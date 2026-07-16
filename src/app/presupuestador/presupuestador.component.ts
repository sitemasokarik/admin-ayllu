import { ChangeDetectionStrategy, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, DestroyRef, OnDestroy, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { UserService } from '../../service/user.service';
import { PresupuestadorConfig } from './presupuestador.config';
import { catchError, forkJoin, lastValueFrom, of } from 'rxjs';
import {
  EventoTarifasConfig,
  calcularTotalAdicionales,
  formatAdicionalesSubtotal,
  parseEventoTarifas,
  puedeAgregarServicioAdicional,
  resolvePrecioPorInvitado,
  validarServicioAdicionalMinimo,
  validateInvitadosMinimos,
} from '../shared/evento-pricing.util';

@Component({
  selector: 'app-presupuestador',
  standalone: true,
  imports: [CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './presupuestador.component.html',
  styleUrl: './presupuestador.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresupuestadorComponent implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  title = 'Cotizador';
  readonly personalEquipoIncluido = PresupuestadorConfig.personalEquipoIncluido;
  readonly personalDjIncluido = PresupuestadorConfig.personalDjIncluido;
  minFechaHoy = '';
  fechasReservadas: string[] = [];

  loading = false;
  generatingPdf = false;
  savingDraft = false;
  invitadosError: string | null = null;

  locales: any[] = [];
  serviciosAdicionales: any[] = [];
  paquetePersonal: any[] = [];
  categories: any[] = [];
  products: any[] = [];
  modalImage: string | null = null;
  personal: any[] = [];

  eventos: any[] = [];
  activeConfigTab: 'local' | 'servicios' | 'personal' | number = 'local';
  private productsByCategoryId = new Map<number, any[]>();
  private saveTimer: ReturnType<typeof setTimeout> | null = null;
  private swalModule: typeof import('sweetalert2') | null = null;
  private pendingBorradorId: number | null = null;
  private catalogLoaded = false;
  // =========================================================
  presupuesto: any = {
    cliente: {
      nombre: "",
      apellido: "",
      telefono1: "",
      telefono2: "",
      correo: "",
      tipoDocumento: "",
      documento: "",
      personal: []
    },
    eventoID: null,
    evento: {
      tipo: "",
      invitados: 0,
      fecha1: "",
      fecha2: ""
    },

    local: null,

    categorias: {
      coctel: null,        // 1
      entrada: null,       // 3
      fondo: null,         // 4
      entremeses: []
    },

    adicionales: [],
    costoPorInvitado: 0,
    totales: {}
  };


  resumen = {
    local: null,
    coctel: null,
    entrada: null,
    fondo: null,
    entremeses: [],
    adicionales: [],
    total: 0
  };

  resumenPasos: { label: string; done: boolean }[] = [];
  resumenProgreso = 0;
  resumenCompletoFlag = false;
  totalesDesglose: { label: string; value: number }[] = [];
  tablaCotizacionFilas: { label: string; sublabel?: string; value: number }[] = [];
  totalEstimadoVisible = 0;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}
  pendingLoads = 0;
  onSubmit(event?: Event) {
    event?.preventDefault();
  }
  // =========================================================
  // 🟦 CARGA DE DATOS
  // =========================================================
  ngOnInit(): void {
    this.minFechaHoy = this.getTodayDateString();

    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const borradorParam = params.get('borrador');
        const borradorId = borradorParam ? Number(borradorParam) : null;
        if (!borradorId || borradorId <= 0) return;

        this.loading = true;
        this.cdr.markForCheck();

        if (this.catalogLoaded) {
          this.loadBorrador(borradorId, () => this.finishBorradorLoad());
        } else {
          this.pendingBorradorId = borradorId;
        }
      });

    this.loadInitialData();
  }

  private finishBorradorLoad(): void {
    this.loading = false;
    this.calcularTotales();
    this.actualizarResumen();
    this.cdr.markForCheck();
  }

  private loadInitialData(): void {
    forkJoin({
      locales: this.userService.getAllLocales().pipe(catchError(() => of({ data: [] }))),
      categories: this.userService.getAllHierarchy().pipe(catchError(() => of({ data: [] }))),
      products: this.userService.getAllProducts().pipe(catchError(() => of({ data: [] }))),
      servicios: this.userService.getAllServicios().pipe(catchError(() => of({ data: [] }))),
      eventos: this.userService.getAllEventos().pipe(catchError(() => of({ data: [] }))),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ locales, categories, products, servicios, eventos }) => {
        this.locales = (locales?.data || [])
          .filter((local: any) => local.estado === true)
          .map((local: any) => ({
            ...local,
            fotosUrls: this.normalizeMediaUrls(local.fotosUrls),
          }));
        this.localesFiltrados = [...this.locales];

        this.categories = categories?.data || [];
        const savedCategorias = { ...(this.presupuesto.categorias || {}) };
        this.presupuesto.categorias = {};
        const leaves = this.getLeafCategories(this.categories);
        leaves.forEach((sub) => {
          const key = this.normalizeKey(sub.nombre);
          this.presupuesto.categorias[key] = sub.limite === 1 ? null : [];
        });
        Object.keys(savedCategorias).forEach((key) => {
          if (savedCategorias[key] !== undefined) {
            this.presupuesto.categorias[key] = savedCategorias[key];
          }
        });

        this.products = (products?.data || []).map((p: any) => ({
          ...p,
          fotosUrls: this.normalizeMediaUrls(p.fotosUrls),
        }));
        this.buildProductsIndex();

        this.serviciosAdicionales = (servicios?.data || []).map((s: any) => ({
          ...s,
          id: s.servicioID,
          fotosUrls: this.normalizeMediaUrls(s.fotosUrls),
        }));

        this.eventos = eventos?.data || [];

        this.filtrarLocalesPorInvitados();
        if (this.presupuesto.local?.localID) {
          const localMatch = this.locales.find((l) => l.localID === this.presupuesto.local.localID);
          if (localMatch) this.selectLocal(localMatch);
        }

        if (this.pendingBorradorId) {
          const borradorId = this.pendingBorradorId;
          this.pendingBorradorId = null;
          this.catalogLoaded = true;
          this.loadBorrador(borradorId, () => this.finishBorradorLoad());
          return;
        }

        this.catalogLoaded = true;
        this.loading = false;
        this.calcularTotales();
        this.actualizarResumen();
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy(): void {
    if (this.saveTimer) {
      clearTimeout(this.saveTimer);
    }
    this.loading = false;
    this.generatingPdf = false;
    document.body.classList.remove('overlay-active');
  }

  setConfigTab(tab: 'local' | 'servicios' | 'personal' | number): void {
    this.activeConfigTab = tab;
    if (typeof tab === 'number') {
      this.selectedSubcategory = null;
    }
    this.cdr.markForCheck();
  }

  isConfigTab(tab: 'local' | 'servicios' | 'personal' | number): boolean {
    return this.activeConfigTab === tab;
  }

  trackByLocalId(_: number, local: any): number {
    return local.localID;
  }

  trackByCategoriaId(_: number, cat: any): number {
    return cat.categoriaID;
  }

  trackBySubcategoriaId(_: number, sub: any): number {
    return sub.subcategoriaID;
  }

  trackByProductoId(_: number, producto: any): number {
    return producto.productoID;
  }

  trackByEventoId(_: number, evento: any): number {
    return evento.eventoID;
  }

  trackByServicioId(_: number, servicio: any): number {
    return servicio.servicioID;
  }

  private normalizeMediaUrls(urls?: string[] | null): string[] {
    if (!urls?.length) return [];
    return urls
      .filter(Boolean)
      .map(u => this.userService.resolveMediaUrl(String(u).trim()))
      .filter(Boolean);
  }

  trackByFoto(_: number, foto: string): string {
    return foto;
  }

  trackByLabel(_: number, item: { label: string }): string {
    return item.label;
  }

  trackByPasoLabel(_: number, paso: { label: string }): string {
    return paso.label;
  }

  private async alertSwal(options: any): Promise<any> {
    if (!this.swalModule) {
      this.swalModule = await import('sweetalert2');
    }
    return this.swalModule.default.fire(options);
  }

  private buildProductsIndex(): void {
    this.productsByCategoryId.clear();

    for (const producto of this.products) {
      if (!producto?.estado || !producto?.categoriaID) continue;

      const list = this.productsByCategoryId.get(producto.categoriaID) ?? [];
      list.push(producto);
      this.productsByCategoryId.set(producto.categoriaID, list);
    }
  }
  onEventoChange() {
    const ev = this.eventos.find(e => e.eventoID === this.presupuesto.eventoID);

    if (ev) {
      this.presupuesto.evento.tipo = ev.nombre;
      localStorage.setItem("tipoEvento", ev.nombre);
    } else {
      this.presupuesto.evento.tipo = "";
      localStorage.removeItem("tipoEvento");
    }

    this.syncInvitadosValidation();
    this.calcularTotales();
    this.save();
    this.cdr.markForCheck();
  }

  private getSelectedEvento(): any | null {
    if (!this.presupuesto.eventoID) return null;
    return this.eventos.find((e) => e.eventoID === this.presupuesto.eventoID) ?? null;
  }

  getEventoTarifasConfig(): EventoTarifasConfig {
    const ev = this.getSelectedEvento();
    return parseEventoTarifas(ev?.tarifasInvitadoJson, ev?.nombre);
  }

  private syncInvitadosValidation(): void {
    const invitados = this.presupuesto.evento.invitados || 0;
    if (!this.presupuesto.eventoID || invitados <= 0) {
      this.invitadosError = null;
      this.syncAdicionalesPorInvitados();
      return;
    }
    const check = validateInvitadosMinimos(this.getEventoTarifasConfig(), invitados);
    this.invitadosError = check.ok ? null : (check.message ?? null);
    this.syncAdicionalesPorInvitados();
  }

  private syncAdicionalesPorInvitados(): void {
    const invitados = this.presupuesto.evento.invitados || 0;
    if (!Array.isArray(this.presupuesto.adicionales) || !this.presupuesto.adicionales.length) return;

    const validos = this.presupuesto.adicionales.filter((servicio: any) =>
      puedeAgregarServicioAdicional(servicio, invitados),
    );

    if (validos.length !== this.presupuesto.adicionales.length) {
      this.presupuesto.adicionales = validos;
      this.save();
    }
  }

  private getAuditUser(): { id: number | null; name: string } {
    const user = this.authService.getUser();
    const name = (user?.nombre || user?.userName || 'Admin').trim();
    const id = Number(user?.usuarioID) > 0 ? Number(user.usuarioID) : null;
    return { id, name };
  }

private async crearNuevoCliente(data: any): Promise<boolean> {
  const audit = this.getAuditUser();
  try {
    const resCliente: any = await lastValueFrom(
      this.userService.createCliente({
        tipoDocumento: (data.cliente.tipoDocumento || '').trim(),
        numeroDocumento: (data.cliente.documento || '').trim(),
        nombreCompleto: `${data.cliente.nombre} ${data.cliente.apellido}`.trim() || 'Borrador Ayllu',
        email: data.cliente.correo,
        telefono: data.cliente.telefono1,
        telefonoSecundario: data.cliente.telefono2,
        direccion: data.cliente.direccion ?? '',
        ciudad: 'Lima',
        pais: 'Peru',
        tipoCliente: 'Natural',
        observaciones: '',
        esVIP: false,
        fechaNacimiento: null,
        usuarioCreacion: audit.name,
      }),
    );

    data.cliente.clienteID = resCliente.data.clienteID;
    this.save();
    return !!data.cliente.clienteID;
  } catch (error) {
    console.error('Error creando cliente:', error);
    await this.alertSwal({
      icon: 'error',
      title: 'Cliente no guardado',
      text: this.extractApiError(error, 'No se pudo registrar el cliente para este borrador.'),
    });
    return false;
  }
}

  private prepareClienteForPersist(isDraft: boolean): void {
    const c = this.presupuesto.cliente;

    if (isDraft) {
      if (!c.nombre?.trim() && !c.apellido?.trim()) {
        c.nombre = 'Borrador';
      }
      if (!c.correo?.trim()) {
        c.correo = `borrador.${Date.now()}@temp.ayllu.local`;
      }
      if (!c.telefono1?.trim()) {
        c.telefono1 = '000000000';
      }
    }

  }

  private extractApiError(error: any, fallback: string): string {
    const payload = error?.error;
    if (payload?.data && Array.isArray(payload.data)) {
      const messages = payload.data
        .map((item: any) => item.errorMessage || item.ErrorMessage)
        .filter(Boolean);
      if (messages.length) return messages.join(' ');
    }
    if (payload?.errors && typeof payload.errors === 'object') {
      const messages = Object.values(payload.errors).flat().filter(Boolean) as string[];
      if (messages.length) return messages.join(' ');
    }
    if (payload?.message && payload.message !== 'Error de validación') {
      return payload.message;
    }
    return fallback;
  }

  private toApiDate(value: string | null | undefined): string | null {
    const normalized = (value || '').trim();
    return normalized || null;
  }


  async ensureCliente(isDraft = false): Promise<boolean> {
    const data = this.presupuesto;

    if (data.cliente.clienteID) return true;

    this.prepareClienteForPersist(isDraft);

    const doc = (data.cliente.documento || '').trim();

    if (!doc) {
      return await this.crearNuevoCliente(data);
    }

    try {
      const resp: any = await lastValueFrom(this.userService.getByDocument(doc));
      const idExistente = resp?.data?.clienteID ?? null;

      if (idExistente) {
        data.cliente.clienteID = idExistente;
        this.save();
        return true;
      }

      return await this.crearNuevoCliente(data);
    } catch (error: any) {
      if (error?.status === 404) {
        return await this.crearNuevoCliente(data);
      }

      console.error('Error verificando cliente:', error);
      await this.alertSwal({
        icon: 'error',
        title: 'Error',
        text: this.extractApiError(error, 'No se pudo comprobar el cliente'),
      });
      return false;
    }
  }

  private resolveLocalId(): number {
    return this.presupuesto.local?.localID ?? this.locales[0]?.localID ?? 1;
  }

  private buildCotizacionProductos(): any[] {
    const audit = this.getAuditUser();
    const c = this.presupuesto.categorias;
    const seen = new Set<number>();
    const productos: any[] = [];
    const categoryKeys = [
      'coctel', 'entrada', 'fondo', 'entremeses', 'menajeria',
      'mesasSillas', 'mesassillas', 'fuentes', 'mesas', 'sillas', 'mesasysillas',
    ];

    const agregar = (p: any) => {
      const id = Number(p?.productoID ?? p?.ProductoID ?? p?.productoId);
      if (!id || seen.has(id)) return;
      seen.add(id);
      productos.push({
        productoID: id,
        cantidad: 1,
        precio: p.precio,
        usuarioCreacion: audit.name,
      });
    };

    categoryKeys.forEach((key) => {
      const val = c[key];
      if (Array.isArray(val)) val.forEach((p) => agregar(p));
      else agregar(val);
    });

    Object.keys(c).forEach((key) => {
      if (categoryKeys.includes(key)) return;
      const val = c[key];
      if (Array.isArray(val)) val.forEach((p) => agregar(p));
      else agregar(val);
    });

    return productos;
  }

  private buildCotizacionBody(estado: 'Activo' | 'Borrador'): any {
    const data = this.presupuesto;
    this.calcularTotales();
    const audit = this.getAuditUser();

    const productos = this.buildCotizacionProductos();
    const servicios = (data.adicionales || [])
      .map((s: any) => ({
        servicioID: Number(s.servicioID ?? s.id ?? s.ServicioID),
        cantidad: data.evento.invitados || 0,
        precio: s.precio,
        usuarioCreacion: audit.name,
      }))
      .filter((s: any) => s.servicioID > 0)
      .filter((s: any, index: number, arr: any[]) =>
        arr.findIndex((x) => x.servicioID === s.servicioID) === index);

    const t = data.totales || {};
    const subtotalMenu = t.totalEvento || 0;
    const precioLocal = t.local || 0;
    const garantiaCatering = t.garantia || this.getEventoTarifasConfig().garantia;
    const garantiaLocal = t.garantiaLocal || 0;
    const adicionales = t.adicionales || 0;
    const totalEvento = subtotalMenu + precioLocal + garantiaCatering + garantiaLocal + adicionales;
    const tarifaPorInvitado = t.costoPorInvitado || 0;
    const precioPorCubierto = data.evento.invitados > 0 ? totalEvento / data.evento.invitados : 0;

    const borradorJson = estado === 'Borrador' ? JSON.stringify(data) : null;

    return {
      ...(data.cotizacionID ? { cotizacionID: data.cotizacionID } : {}),
      clienteID: data.cliente.clienteID,
      localID: this.resolveLocalId(),
      eventoID: data.eventoID || null,
      fechaTentativa: this.toApiDate(data.evento.fecha1),
      fechaTentativaOpcional: this.toApiDate(data.evento.fecha2),
      numeroInvitados: data.evento.invitados || 0,
      costoDePersonal: 0,
      garantia: garantiaCatering + garantiaLocal,
      subtotalMenu,
      totalEvento,
      tarifaMenuPorInvitado: tarifaPorInvitado,
      precioPorCubierto,
      precioPorCubiertoConDescuento: 0,
      totalCotizacion: 0,
      observacion: data.observacion ?? '',
      origenCotizacion: 'Admin',
      estadoCotizacion: estado,
      borradorJson,
      estado: true,
      usuarioCreacion: audit.name,
      usuarioModificacion: audit.name,
      creadoPorUsuarioID: audit.id,
      creadoPorNombre: audit.name,
      cotizacionProducto: productos,
      cotizacionServicio: servicios,
    };
  }

  async persistCotizacion(estado: 'Activo' | 'Borrador'): Promise<boolean> {
    const isDraft = estado === 'Borrador';
    const ok = await this.ensureCliente(isDraft);
    if (!ok) return false;

    const data = this.presupuesto;
    const body = this.buildCotizacionBody(estado);

    try {
      if (data.cotizacionID) {
        await lastValueFrom(this.userService.updateCotizaciones({ ...body, cotizacionID: data.cotizacionID }));
      } else {
        const resCot: any = await lastValueFrom(this.userService.createCotizaciones(body));
        data.cotizacionID = resCot.data.cotizacionID;
      }
      data.modoBorrador = isDraft;
      this.cdr.markForCheck();
      return true;
    } catch (error) {
      console.error('Error guardando cotización:', error);
      await this.alertSwal({
        icon: 'error',
        title: 'Error',
        text: this.extractApiError(
          error,
          isDraft
            ? 'No se pudo guardar el borrador. Revisa los datos e intenta de nuevo.'
            : 'No se pudo registrar la cotización.',
        ),
      });
      return false;
    }
  }

  async generarCotizacionSiNoExiste(): Promise<void> {
    await this.persistCotizacion('Activo');
  }

  private loadBorrador(id: number, onComplete?: () => void): void {
    this.userService.getCotizacionesById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: any) => {
          const row = Array.isArray(res.data) ? res.data[0] : res.data;
          if (!row?.borradorJson) {
            this.alertSwal({
              icon: 'warning',
              title: 'Sin datos de borrador',
              text: 'Esta cotización no tiene un borrador guardado para continuar.',
            });
            onComplete?.();
            return;
          }

          try {
            const saved = JSON.parse(row.borradorJson);
            this.presupuesto = {
              ...this.presupuesto,
              ...saved,
              cotizacionID: row.cotizacionID,
              modoBorrador: true,
            };

            if (saved.local?.localID) {
              const match = this.locales.find((l) => l.localID === saved.local.localID);
              if (match) this.selectLocal(match);
            }

            this.filtrarLocalesPorInvitados();
            this.calcularTotales();
            this.actualizarResumen();
            this.cdr.markForCheck();
          } catch {
            this.alertSwal({
              icon: 'error',
              title: 'Borrador dañado',
              text: 'No se pudieron restaurar los datos guardados.',
            });
          }

          onComplete?.();
        },
        error: () => {
          this.alertSwal({ icon: 'error', title: 'Error', text: 'No se pudo cargar el borrador.' });
          onComplete?.();
        },
      });
  }

  async guardarBorrador(): Promise<void> {
    const c = this.presupuesto.cliente;
    if (!c.nombre?.trim() && !c.correo?.trim()) {
      await this.alertSwal({
        icon: 'warning',
        title: 'Datos mínimos',
        text: 'Indica al menos nombre o correo para identificar el borrador.',
      });
      return;
    }

    this.savingDraft = true;
    this.cdr.markForCheck();

    try {
      const ok = await this.persistCotizacion('Borrador');
      if (!ok) return;

      await this.alertSwal({
        title: 'Borrador guardado',
        text: 'Quedó registrado en el listado de cotizaciones. Puedes continuarlo desde allí.',
        icon: 'success',
        timer: 2200,
        showConfirmButton: false,
      });

      this.limpiarFormulario(false);
    } finally {
      this.savingDraft = false;
      document.body.classList.remove('overlay-active');
      this.cdr.markForCheck();
    }
  }

  async limpiarFormulario(pedirConfirmacion = true): Promise<void> {
    const ejecutar = () => {
      this.presupuesto = this.createEmptyPresupuesto();
      this.fechasReservadas = [];
      this.localesFiltrados = [...this.locales];
      this.activeConfigTab = 'local';
      this.selectedSubcategory = null;
      localStorage.removeItem('presupuesto');
      localStorage.removeItem('tipoEvento');
      this.router.navigate(['/presupuestador'], { replaceUrl: true });
      this.calcularTotales();
      this.actualizarResumen();
      this.cdr.markForCheck();
    };

    if (!pedirConfirmacion) {
      ejecutar();
      return;
    }

    const result = await this.alertSwal({
      title: '¿Limpiar formulario?',
      text: 'Se borrarán los datos del cotizador. Los borradores ya guardados en el listado no se eliminan.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, limpiar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      ejecutar();
    }
  }

  private createEmptyPresupuesto(): any {
    const categorias: Record<string, any> = {};
    const leaves = this.getLeafCategories(this.categories);
    leaves.forEach((sub) => {
      const key = this.normalizeKey(sub.nombre);
      categorias[key] = sub.limite === 1 ? null : [];
    });

    return {
      cliente: {
        nombre: '',
        apellido: '',
        telefono1: '',
        telefono2: '',
        correo: '',
        tipoDocumento: '',
        documento: '',
        personal: [],
      },
      eventoID: null,
      evento: { tipo: '', invitados: 0, fecha1: '', fecha2: '' },
      local: null,
      categorias: Object.keys(categorias).length
        ? categorias
        : { coctel: null, entrada: null, fondo: null, entremeses: [] },
      adicionales: [],
      costoPorInvitado: 0,
      totales: {},
    };
  }

  private validateForActivo(): boolean {
    const c = this.presupuesto.cliente;
    const e = this.presupuesto.evento;
    const missing: string[] = [];

    if (!c.nombre?.trim()) missing.push('nombre');
    if (!c.apellido?.trim()) missing.push('apellido');
    if (!c.telefono1?.trim()) missing.push('celular 1');
    if (!c.correo?.trim()) missing.push('correo');
    if (!this.presupuesto.eventoID) missing.push('tipo de evento');
    if (!e.invitados || e.invitados <= 0) missing.push('número de invitados');
    if (this.invitadosError) missing.push(this.invitadosError);
    if (!e.fecha1) missing.push('fecha tentativa 1');
    if (!this.presupuesto.local) missing.push('local');
    if (!this.resumenCompletoFlag) missing.push('menú completo (coctel, entrada, fondo y entremeses)');

    if (this.algunaFechaReservadaEnFormulario()) {
      this.alertSwal({
        icon: 'warning',
        title: 'Fecha no disponible',
        text: 'Una de las fechas seleccionadas ya está reservada en este local.',
      });
      return false;
    }

    if (missing.length) {
      this.alertSwal({
        icon: 'warning',
        title: 'Completa la cotización',
        html: `Faltan: <strong>${missing.join(', ')}</strong>`,
      });
      return false;
    }

    return true;
  }

  getSeleccionCount(subcat: any): number {
    const key = this.normalizeKey(subcat.nombre);
    const val = this.presupuesto.categorias[key];
    if (!val) return 0;
    return Array.isArray(val) ? val.length : 1;
  }

  getLimiteLabel(subcat: any): string {
    const limite = subcat.limite ?? 1;
    const count = this.getSeleccionCount(subcat);
    if (limite <= 1) {
      return count ? '1 de 1 seleccionado' : 'Elige 1 opción';
    }
    return `${count} de ${limite} seleccionados`;
  }




  private normalizeKey(nombre: string): string {
    return nombre
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[^a-z0-9]/g, '');
  }

  selectedCategory: any = null;
  selectedSubcategory: any = null;

  seleccionarProducto(subcat: any, producto: any) {
    const key = this.normalizeKey(subcat.nombre);
    const categorias = this.presupuesto.categorias;

    if (!categorias[key]) {
      categorias[key] = subcat.limite === 1 ? null : [];
    }

    const limite = subcat.limite ?? Infinity;

    if (!Array.isArray(categorias[key])) {
      if (categorias[key]?.productoID === producto.productoID) {
        categorias[key] = null;
      } else {
        categorias[key] = producto;
      }
    } else {
      const existe = categorias[key].some(p => p.productoID === producto.productoID);

      if (existe) {
        categorias[key] = categorias[key].filter(p => p.productoID !== producto.productoID);
      } else {
        if (categorias[key].length >= limite) {
          this.alertSwal({
            toast: true,
            position: 'top-end',
            icon: 'warning',
            title: `Máximo ${limite} ${subcat.nombre}`,
            showConfirmButton: false,
            timer: 2000
          });
          return;
        }

        categorias[key].push(producto);
      }
    }

    this.save();
    this.calcularTotales();
    this.actualizarResumen();
    this.cdr.markForCheck();
  }


  selectCategory(cat: any) {
    this.selectedCategory = cat;
    this.selectedSubcategory = null; // resetear subcategoría
  }

  selectSubcategory(sub: any, cat: any) {
    this.selectedSubcategory = { ...sub, categoriaPadreID: cat.categoriaID };
    this.cdr.markForCheck();
  }

  isProductoSeleccionado(producto: any, subcat: any): boolean {
    const key = this.normalizeKey(subcat.nombre);
    const val = this.presupuesto.categorias[key];

    if (!val) return false;

    if (Array.isArray(val)) {
      return val.some(p => p.productoID === producto.productoID);
    }

    return val.productoID === producto.productoID;
  }





  localesFiltrados: any[] = []; // <- Nuevo array para mostrar en HTML

  filtrarLocalesPorInvitados() {
    const invitados = this.presupuesto.evento.invitados || 0;

    if (invitados <= 0) {
      // Si no hay invitados, mostrar todos
      this.localesFiltrados = [...this.locales];
      return;
    }

    this.localesFiltrados = this.locales.filter(local => local.capacidad >= invitados);
  }  

  getLeafCategories(categories: any[]): any[] {
    let leaves: any[] = [];

    categories.forEach(cat => {
      if (cat.esHoja) {
        leaves.push(cat);
      }
      if (cat.subcategorias && cat.subcategorias.length > 0) {
        leaves = leaves.concat(this.getLeafCategories(cat.subcategorias));
      }
    });

    return leaves;
  }

getProductsByLeafCategory(cat: any) {
  if (!cat?.categoriaID) return [];
  return this.productsByCategoryId.get(cat.categoriaID) ?? [];
}
 
  // =========================================================
  // 🔥 MÉTODOS DE SELECCIÓN
  // =========================================================
addProducto(subcategoria: any, producto: any) {
  if (!this.presupuesto.categorias) {
    this.presupuesto.categorias = {
      coctel: null,
      entrada: null,
      fondo: null,
      entremeses: [],
      mesasSillas: [],
      menajeria: [],
      fuentes: []
    };
  }

  const categoriaKey = subcategoria.nombre.toLowerCase(); // ejemplo: 'entrada', 'coctel'

  if (categoriaKey === 'entremeses') {
    // Entremeses permite varios productos
    const index = this.presupuesto.categorias.entremeses.findIndex(p => p.productoID === producto.productoID);
    if (index > -1) {
      this.presupuesto.categorias.entremeses.splice(index, 1); // quitar si ya está
    } else if (this.presupuesto.categorias.entremeses.length < 5) {
      this.presupuesto.categorias.entremeses.push(producto); // agregar
    } else {
      alert('Máximo 5 entremeses');
    }
  } else {
    // Categorías que permiten solo 1 producto
    if (this.presupuesto.categorias[categoriaKey] && this.presupuesto.categorias[categoriaKey].productoID === producto.productoID) {
      this.presupuesto.categorias[categoriaKey] = null; // deseleccionar
    } else {
      this.presupuesto.categorias[categoriaKey] = producto; // seleccionar
    }
  }

  this.actualizarResumen(); // actualizar resumen si tienes función
  this.save(); // <-- GUARDO EN LOCALSTORAGE AQUÍ
}



  removeProduct(catId: number, index: number) {
    const c = this.presupuesto.categorias;

    switch (catId) {
      case 2: c.entremeses.splice(index, 1); break;
      case 5: c.mesasSillas.splice(index, 1); break;
      case 6: c.menajeria.splice(index, 1); break;
      case 7: c.fuentes.splice(index, 1); break;
    }

    this.save();
    this.calcularTotales();
    this.actualizarResumen();
    
    this.alertSwal({ icon: 'success', title: 'Eliminado', text: 'Producto eliminado correctamente' });
  }


  selectLocal(local) {
    this.presupuesto.local = local;
    this.fechasReservadas = [];
    if (local?.localID) {
      this.userService.getFechasReservadas(local.localID).subscribe({
        next: (res) => {
          const raw = res?.data;
          this.fechasReservadas = Array.isArray(raw) ? raw.filter(Boolean) : [];
          this.limpiarFechasReservadasEnFormulario(true);
          this.cdr.markForCheck();
        },
        error: () => {
          this.fechasReservadas = [];
          this.cdr.markForCheck();
        },
      });
    }
    this.save();
    this.actualizarResumen();
    this.calcularTotales();
    this.cdr.markForCheck();
  }

  private limpiarFechasReservadasEnFormulario(mostrarAlerta = false): string[] {
    const bloqueadas: string[] = [];
    (['fecha1', 'fecha2'] as const).forEach((campo) => {
      const valor = this.presupuesto.evento[campo];
      if (valor && this.fechasReservadas.includes(valor)) {
        bloqueadas.push(this.formatFechaReservada(valor));
        this.presupuesto.evento[campo] = '';
      }
    });
    if (bloqueadas.length) {
      this.save();
      if (mostrarAlerta) {
        const soloUna = bloqueadas.length === 1;
        this.alertSwal({
          icon: 'warning',
          title: 'Fecha confirmada por otro evento',
          text: soloUna
            ? `Solo ${bloqueadas[0]} ya está reservada en este local. Puedes usar la otra fecha tentativa si está libre.`
            : `Estas fechas ya están confirmadas en este local: ${bloqueadas.join(', ')}.`,
          timer: 4000,
          showConfirmButton: false,
        });
      }
    }
    return bloqueadas;
  }

  private formatFechaReservada(isoDate: string): string {
    const [y, m, d] = isoDate.split('-');
    return `${d}/${m}/${y}`;
  }

  private algunaFechaReservadaEnFormulario(): boolean {
    const { fecha1, fecha2 } = this.presupuesto.evento;
    return (fecha1 && this.fechasReservadas.includes(fecha1))
      || (fecha2 && this.fechasReservadas.includes(fecha2));
  }

 

addAdicional(item: any) {
  const index = this.presupuesto.adicionales.findIndex(a => a.id === item.id);
  if (index > -1) {
    this.presupuesto.adicionales.splice(index, 1);
  } else {
    const invitados = this.presupuesto.evento.invitados || 0;
    const check = validarServicioAdicionalMinimo(item, invitados);
    if (!check.ok) {
      void this.alertSwal({
        icon: 'warning',
        title: 'Invitados insuficientes',
        text: check.message,
      });
      return;
    }
    this.presupuesto.adicionales.push(item);
  }
  this.save();
  this.calcularTotales();
  this.actualizarResumen();
  this.cdr.markForCheck();
}

puedeSeleccionarAdicional(servicio: any): boolean {
  const invitados = this.presupuesto.evento.invitados || 0;
  return this.isAdicionalSeleccionado(servicio) || puedeAgregarServicioAdicional(servicio, invitados);
}

mensajeMinimoAdicional(servicio: any): string | null {
  const invitados = this.presupuesto.evento.invitados || 0;
  if (this.isAdicionalSeleccionado(servicio) || puedeAgregarServicioAdicional(servicio, invitados)) {
    return null;
  }
  return validarServicioAdicionalMinimo(servicio, invitados).message ?? null;
}

isAdicionalSeleccionado(servicio: any): boolean {
  return this.presupuesto.adicionales.some(a => a.id === servicio.id);
}


  addPersonal(per) {
    this.presupuesto.personal.push(per);
    this.save();
    this.calcularTotales();
    this.actualizarResumen();
  }

  // =========================================================
  // 🧮 CALCULAR COSTO POR INVITADO
  // =========================================================
calcularCostoPorInvitado() {
  const invitados = this.presupuesto.evento.invitados || 0;
  if (!this.presupuesto.eventoID || invitados <= 0) {
    this.presupuesto.costoPorInvitado = 0;
    return 0;
  }

  const config = this.getEventoTarifasConfig();
  const precio = resolvePrecioPorInvitado(config, invitados) ?? 0;
  this.presupuesto.costoPorInvitado = precio;
  return precio;
}

calcularTotales() {
  this.syncInvitadosValidation();

  const invitados = this.presupuesto.evento.invitados || 0;
  const costoInv = this.calcularCostoPorInvitado();
  const config = this.getEventoTarifasConfig();

  const totalEvento = invitados * costoInv;
  const local = this.presupuesto.local?.precioAlquiler || 0;
  const garantia = config.garantia;
  const garantiaLocal = this.presupuesto.local?.garantia || 0;
  const adicionales = calcularTotalAdicionales(this.presupuesto.adicionales, invitados);

  const totalFinal = totalEvento + local + garantia + garantiaLocal + adicionales;

  this.presupuesto.totales = {
    costoPorInvitado: costoInv,
    totalEvento,
    local,
    garantia,
    garantiaLocal,
    adicionales,
    totalFinal,
    invitados,
    eventoNombre: this.presupuesto.evento.tipo || '',
  };

  this.save();
  this.refreshSummaryDisplay();
}


  actualizarResumen() {
    const c = this.presupuesto.categorias;

    this.resumen.local = this.presupuesto.local;
    this.resumen.coctel = c.coctel;
    this.resumen.entrada = c.entrada;
    this.resumen.fondo = c.fondo;
    this.resumen.entremeses = c.entremeses || [];
    this.resumen.adicionales = this.presupuesto.adicionales || [];
    this.resumen.total = this.presupuesto.totales?.totalFinal || 0;
    this.refreshSummaryDisplay();
  }

  private refreshSummaryDisplay(): void {
    const evento = this.presupuesto.evento;
    const t = this.presupuesto.totales || {};
    const invitados = this.presupuesto.evento?.invitados ?? 0;
    const tierReady = !!(this.presupuesto.eventoID && invitados > 0 && !this.invitadosError && (t.costoPorInvitado || 0) > 0);
    const base = (t.local || 0) + (t.garantia || 0) + (t.garantiaLocal || 0) + (t.adicionales || 0);

    this.resumenPasos = [
      { label: 'Cliente', done: !!(this.presupuesto.cliente?.nombre && this.presupuesto.cliente?.correo) },
      { label: 'Evento', done: !!this.presupuesto.eventoID },
      { label: 'Invitados', done: (evento?.invitados ?? 0) > 0 },
      { label: 'Fechas', done: !!evento?.fecha1 },
      { label: 'Local', done: !!this.resumen.local },
      {
        label: 'Menú',
        done: !!(
          this.resumen.coctel &&
          this.resumen.entrada &&
          this.resumen.fondo &&
          (this.resumen.entremeses?.length ?? 0) > 0
        ),
      },
    ];

    const completados = this.resumenPasos.filter((p) => p.done).length;
    this.resumenProgreso = Math.round((completados / this.resumenPasos.length) * 100);

    this.resumenCompletoFlag = !!(
      this.resumen.local &&
      this.resumen.coctel &&
      this.resumen.entrada &&
      this.resumen.fondo &&
      (this.resumen.entremeses?.length ?? 0) > 0
    );

    this.totalesDesglose = [
      { label: 'Precio por persona', value: tierReady ? (t.costoPorInvitado || 0) : 0 },
      { label: `Servicio catering × invitados (${invitados})`, value: tierReady ? (t.totalEvento || 0) : 0 },
      { label: 'Garantía catering', value: t.garantia || 0 },
      { label: 'Local', value: t.local || 0 },
      { label: 'Garantía local', value: t.garantiaLocal || 0 },
      { label: 'Servicios adicionales', value: t.adicionales || 0 },
    ];

    const precioInv = tierReady ? (t.costoPorInvitado || 0) : 0;
    const cateringSub =
      invitados > 0 && precioInv > 0
        ? `(S/ ${precioInv.toLocaleString('es-PE')}) × ${invitados} invitado${invitados === 1 ? '' : 's'}`
        : 'Selecciona evento e invitados válidos';

    const adicionalesSub = formatAdicionalesSubtotal(this.resumen.adicionales, invitados);

    this.tablaCotizacionFilas = [
      { label: 'Precio por persona', value: precioInv },
      {
        label: 'Servicio catering × invitados',
        sublabel: cateringSub,
        value: tierReady ? (t.totalEvento || 0) : 0,
      },
      { label: 'Garantía catering', value: t.garantia || 0 },
      {
        label: 'Local',
        sublabel: this.resumen.local?.nombre || 'Sin local seleccionado',
        value: t.local || 0,
      },
      {
        label: 'Garantía local',
        sublabel: this.resumen.local?.nombre || 'Sin local seleccionado',
        value: t.garantiaLocal || 0,
      },
      {
        label: 'Servicios adicionales',
        sublabel: adicionalesSub,
        value: t.adicionales || 0,
      },
    ];

    this.totalEstimadoVisible = tierReady ? (t.totalFinal || 0) : base;
  }

  asSummaryItems(value: any): any[] {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }

openImageModal(img: string) {
  this.modalImage = img;
  this.cdr.markForCheck();
}

closeImageModal() {
  this.modalImage = null;
  this.cdr.markForCheck();
}

async descargarPDF() {
  if (!this.validateForActivo()) return;

  try {
    this.generatingPdf = true;
    this.cdr.markForCheck();

    const saved = await this.persistCotizacion('Activo');
    if (!saved) return;

    const presupuesto = this.presupuesto;
    this.calcularTotales();
    const { generarPDF } = await import('./pdf-generator');
    const pdfBytes = await generarPDF(presupuesto);

    // 3. Descargar PDF
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `Cotización - ${presupuesto.cliente.nombre} ${presupuesto.cliente.apellido}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    // ============================
    // 4. MOSTRAR MODAL DE ÉXITO
    // ============================
    await this.alertSwal({
      title: "¡Cotización Realizada!",
      text: "El PDF ha sido generado correctamente.",
      icon: "success",
      confirmButtonText: "Aceptar"
    });

    // ============================
    // 5. REINICIAR FORMULARIO
    // ============================
    this.limpiarFormulario(false);

  } catch (error) {
    console.error(error);

    this.alertSwal({
      title: "Error",
      text: "Ocurrió un problema al generar la cotización.",
      icon: "error"
    });

  } finally {
    this.generatingPdf = false;
    this.cdr.markForCheck();
  }
}




  // =========================================================
  // 💾 GUARDAR EN LOCALSTORAGE
  // =========================================================
  save() {
    if (this.saveTimer) {
      clearTimeout(this.saveTimer);
    }

    this.saveTimer = setTimeout(() => {
      this.refreshSummaryDisplay();
      this.cdr.markForCheck();
    }, 300);
  }

  saveNow() {
    if (this.saveTimer) {
      clearTimeout(this.saveTimer);
      this.saveTimer = null;
    }
    this.refreshSummaryDisplay();
  }

  getTodayDateString(): string {
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return local.toISOString().split('T')[0];
  }

  onInvitadosInput(): void {
    const raw = this.presupuesto.evento.invitados;
    let value = Number(raw);

    if (raw === '' || raw === null || raw === undefined || !Number.isFinite(value) || value < 0) {
      value = 0;
    }

    value = Math.floor(value);
    this.presupuesto.evento.invitados = value;
    this.syncInvitadosValidation();
    this.save();
    this.filtrarLocalesPorInvitados();
    this.calcularTotales();
    this.actualizarResumen();
    this.cdr.markForCheck();
  }

  private hasMenuSelection(): boolean {
    const c = this.presupuesto.categorias || {};
    return !!(c.coctel || c.entrada || c.fondo || (c.entremeses?.length ?? 0) > 0);
  }

  preventNegativeInvitados(event: KeyboardEvent): void {
    if (event.key === '-' || event.key === '+' || event.key === 'e' || event.key === 'E') {
      event.preventDefault();
    }
  }

  onFechaChange(campo: 'fecha1' | 'fecha2'): void {
    const valor = this.presupuesto.evento[campo];

    if (!valor) {
      this.save();
      return;
    }

    if (valor < this.minFechaHoy) {
      this.presupuesto.evento[campo] = '';
      this.alertSwal({
        toast: true,
        position: 'top-end',
        icon: 'warning',
        title: 'Solo fechas desde hoy en adelante',
        showConfirmButton: false,
        timer: 2500,
        customClass: { popup: 'swal2-toast-custom' }
      });
      return;
    }

    if (this.fechasReservadas.includes(valor)) {
      this.presupuesto.evento[campo] = '';
      this.alertSwal({
        toast: true,
        position: 'top-end',
        icon: 'warning',
        title: 'Solo esa fecha está confirmada',
        showConfirmButton: false,
        timer: 3000,
        customClass: { popup: 'swal2-toast-custom' }
      });
      return;
    }

    this.save();
  }

}
