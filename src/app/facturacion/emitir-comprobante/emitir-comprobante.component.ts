import { Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../../../service/user.service';
import { FacturacionService } from '../../../service/facturacion.service';
import { ConsultaDocumentoService } from '../../../service/consulta-documento.service';
import { FacturacionConfig } from '../facturacion.config';
import { ComprobanteItem, ComprobanteElectronico, ModoEmision, TipoComprobante } from '../models/comprobante.model';
import { openTicketPreview } from '../facturacion-ticket.util';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-emitir-comprobante',
  standalone: true,
  imports: [CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './emitir-comprobante.component.html',
  styleUrl: './emitir-comprobante.component.css',
})
export class EmitirComprobanteComponent implements OnInit, OnDestroy {
  tipo: TipoComprobante = 'boleta';
  title = 'Boleta';
  config = FacturacionConfig;
  loading = true;
  saving = false;
  consultandoDocumento = false;
  private ultimoDocumentoConsultado = '';
  private consultaDocumentoSub?: Subscription;

  modoEmision: ModoEmision = 'sunat';
  sunatIntegrado = false;
  sunatModo = 'DESARROLLO';
  sunatWsUrlActivo = '';
  emisorConfig: any = null;
  montoAdelantoFacturado = 0;
  metodoPagoAdelanto = '';
  searchQuery = '';
  cotizacionesEvento: any[] = [];
  searchResults: any[] = [];
  selectedCotizacion: any = null;

  fechaEmision = '';
  serie = '';
  correlativoPreview = '';
  moneda = FacturacionConfig.monedaLabel;
  tipoComprobanteLabel = '';
  tipoOperacion = FacturacionConfig.tipoOperacion;
  tipoVenta = 'Venta Producto';

  tipoDocumento = '1 - DNI';
  nroDocumento = '';
  clienteNombre = '';
  clienteDireccion = '';
  clienteTelefono = '';

  formaPago = 'Contado';
  medioPago = 'EFECTIVO';
  recibido: number | null = null;
  vuelto = 0;

  items: ComprobanteItem[] = [];
  itemTipoIgv = '10';
  totals = {
    opGravadas: 0,
    opInafectas: 0,
    opExoneradas: 0,
    subtotal: 0,
    igv: 0,
    total: 0,
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private facturacionService: FacturacionService,
    private consultaDocumentoService: ConsultaDocumentoService
  ) {}

  ngOnInit(): void {
    const routeTipo = this.route.snapshot.data['tipo'] as TipoComprobante;
    this.tipo = routeTipo === 'factura' ? 'factura' : 'boleta';
    this.title = this.tipo === 'boleta' ? 'Boleta' : 'Factura';
    this.tipoComprobanteLabel = this.tipo === 'boleta' ? 'Boleta de venta' : 'FACTURA';
    this.tipoDocumento = this.tipo === 'boleta' ? '1 — DNI' : '2 — RUC';
    this.serie = this.tipo === 'boleta' ? this.config.series.boleta : this.config.series.factura;
    this.correlativoPreview = this.facturacionService.previewCorrelativo(this.tipo);
    this.fechaEmision = this.todayString();

    this.facturacionService.getFacturacionConfig().subscribe({
      next: (cfg) => {
        this.emisorConfig = cfg;
        this.sunatIntegrado = cfg.sunatIntegrado;
        this.sunatModo = cfg.sunatModo || 'DESARROLLO';
        this.sunatWsUrlActivo = cfg.sunatWsUrlActivo || '';
        FacturacionConfig.empresaEmisora.razonSocial = cfg.razonSocial;
        FacturacionConfig.empresaEmisora.ruc = cfg.ruc;
        FacturacionConfig.empresaEmisora.nombreComercial = cfg.nombreComercial;
        FacturacionConfig.empresaEmisora.direccion = cfg.direccion;
        FacturacionConfig.empresaEmisora.ubigeo = cfg.ubigeo || '';
        FacturacionConfig.sunatIntegrado = cfg.sunatIntegrado;
      },
    });

    this.userService.getAllCotizaciones().subscribe({
      next: (res: any) => {
        this.cotizacionesEvento = (res.data || []).filter(
          (c: any) => c.estadoCotizacion === 'Evento' && !c.comprobanteNumero,
        );
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire('Error', 'No se pudieron cargar las cotizaciones en estado Evento', 'error');
      },
    });
  }

  get empresaEmisoraNombre(): string {
    return this.emisorConfig?.razonSocial || this.config.empresaEmisora.razonSocial;
  }

  get documentoPlaceholder(): string {
    return this.tipo === 'boleta' ? '8 dígitos (solo con DNI)' : 'Ingrese Nro de documento';
  }

  get clienteCampoPlaceholder(): string {
    return this.tipo === 'boleta' ? 'Obligatorio si el tipo es DNI' : 'Ingrese Nombre del Cliente o Razón Social';
  }

  get empresaEmisoraLabel(): string {
    const razon = this.emisorConfig?.razonSocial || this.config.empresaEmisora.razonSocial;
    const ruc = this.emisorConfig?.ruc || this.config.empresaEmisora.ruc;
    return `${razon} · RUC ${ruc}`;
  }

  buscarCotizacion(): void {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) {
      this.searchResults = [];
      return;
    }

    this.searchResults = this.cotizacionesEvento
      .filter(
        (c) =>
          String(c.cotizacionID).includes(q) ||
          (c.clienteNombre || '').toLowerCase().includes(q) ||
          (c.clienteDocumento || '').toLowerCase().includes(q)
      )
      .slice(0, 8);
  }

  seleccionarCotizacion(cotizacion: any): void {
    this.facturacionService.getCotizacionFacturacion(cotizacion.cotizacionID).subscribe({
      next: (fact) => {
        this.userService.getCotizacionesById(cotizacion.cotizacionID).subscribe({
          next: (res: any) => {
            const data = Array.isArray(res.data) ? res.data[0] : res.data;
            if (!data) {
              Swal.fire('Sin datos', 'No se encontró la cotización seleccionada', 'warning');
              return;
            }
            this.applyCotizacion(data, fact);
            this.searchResults = [];
            this.searchQuery = `#${data.cotizacionID} - ${data.clienteNombre || ''}`;
          },
          error: () => Swal.fire('Error', 'No se pudo cargar la cotización', 'error'),
        });
      },
      error: (err) => {
        const msg = this.readApiError(err, 'No se puede facturar esta cotización');
        Swal.fire('No facturable', msg, 'warning');
      },
    });
  }

  applyCotizacion(cotizacion: any, fact?: { montoAdelanto: number; metodoPago: string; clienteNombre?: string; clienteDocumento?: string; clienteDireccion?: string; clienteTelefono?: string }): void {
    this.selectedCotizacion = cotizacion;
    this.clienteNombre = fact?.clienteNombre || cotizacion.clienteNombre || '';
    this.clienteDireccion = fact?.clienteDireccion || cotizacion.clienteDireccion || '';
    this.clienteTelefono = fact?.clienteTelefono || cotizacion.clienteTelefono || '';
    this.nroDocumento = fact?.clienteDocumento || cotizacion.clienteDocumento || '';
    this.ultimoDocumentoConsultado = this.nroDocumento.replace(/\D/g, '');
    this.montoAdelantoFacturado = fact?.montoAdelanto || 0;
    this.metodoPagoAdelanto = fact?.metodoPago || '';

    this.items = this.facturacionService.buildItemsFromAdelanto(
      cotizacion.cotizacionID,
      this.montoAdelantoFacturado,
      this.itemTipoIgv,
    );
    this.recalcularTotales();
  }

  onTipoIgvChange(): void {
    if (!this.selectedCotizacion || this.montoAdelantoFacturado <= 0) return;
    this.items = this.facturacionService.buildItemsFromAdelanto(
      this.selectedCotizacion.cotizacionID,
      this.montoAdelantoFacturado,
      this.itemTipoIgv,
    );
    this.recalcularTotales();
  }

  recalcularTotales(): void {
    this.totals = this.facturacionService.calculateTotals(this.items);
    this.calcularVuelto();
  }

  calcularVuelto(): void {
    const recibido = Number(this.recibido || 0);
    this.vuelto = recibido > this.totals.total ? this.round(recibido - this.totals.total) : 0;
  }

  validarDocumento(): boolean {
    const doc = this.nroDocumento.replace(/\D/g, '');
    const expectedLen = this.tipo === 'boleta' ? 8 : 11;
    return doc.length === expectedLen;
  }

  onDocumentoEnter(event: Event): void {
    event.preventDefault();
    this.consultarDocumento();
  }

  onDocumentoChange(value: string): void {
    const doc = (value || '').replace(/\D/g, '');
    if (doc !== this.ultimoDocumentoConsultado) {
      this.ultimoDocumentoConsultado = '';
    }
  }

  consultarDocumento(): void {
    const doc = this.nroDocumento.replace(/\D/g, '');

    if (!doc) {
      Swal.fire('Validación', 'Ingrese el número de documento a consultar.', 'warning');
      return;
    }

    const expectedLen = this.tipo === 'boleta' ? 8 : 11;
    if (doc.length !== expectedLen) {
      Swal.fire(
        'Documento inválido',
        this.tipo === 'boleta'
          ? 'Ingresa un DNI de 8 dígitos'
          : 'Ingresa un RUC de 11 dígitos',
        'warning'
      );
      return;
    }

    if (doc === this.ultimoDocumentoConsultado) {
      return;
    }

    this.consultaDocumentoSub?.unsubscribe();
    this.consultandoDocumento = true;
    const request =
      this.tipo === 'boleta'
        ? this.consultaDocumentoService.consultarDni(doc)
        : this.consultaDocumentoService.consultarRuc(doc);

    this.consultaDocumentoSub = request.subscribe({
      next: (result) => {
        this.consultandoDocumento = false;
        if (!result.esValido) {
          Swal.fire('Consulta', result.mensaje || 'No se encontraron datos para ese documento.', 'warning');
          return;
        }

        if (result.nombreORazonSocial) {
          this.clienteNombre = result.nombreORazonSocial;
        }
        if (result.direccion) {
          this.clienteDireccion = result.direccion;
        }
        if (result.clienteTelefono) {
          this.clienteTelefono = result.clienteTelefono;
        }
        this.nroDocumento = result.numeroDocumento;
        this.ultimoDocumentoConsultado = result.numeroDocumento.replace(/\D/g, '');

        Swal.fire({
          icon: 'success',
          title: 'Cliente encontrado',
          text: this.mensajeOrigenConsulta(result.fuente, result.mensaje),
          timer: 1800,
          showConfirmButton: false,
        });
      },
      error: (err) => {
        this.consultandoDocumento = false;
        Swal.fire('Error', this.readApiError(err, 'No se pudo consultar el documento'), 'error');
      },
    });
  }

  private mensajeOrigenConsulta(fuente?: string, mensaje?: string): string {
    if (mensaje?.trim()) {
      return mensaje;
    }
    if (fuente === 'local') {
      return 'Cliente encontrado en el sistema.';
    }
    if (fuente === 'reniec') {
      return 'Cliente encontrado por RENIEC.';
    }
    if (fuente === 'sunat') {
      return 'Empresa encontrada por SUNAT.';
    }
    return 'Datos del documento cargados.';
  }

  ngOnDestroy(): void {
    this.consultaDocumentoSub?.unsubscribe();
  }

  vender(): void {
    if (!this.selectedCotizacion) {
      Swal.fire('Cotización requerida', 'Busca y selecciona una cotización en estado Evento', 'warning');
      return;
    }

    if (!this.clienteNombre.trim()) {
      Swal.fire('Cliente requerido', 'Ingresa el nombre o razón social del cliente', 'warning');
      return;
    }

    if (!this.validarDocumento()) {
      Swal.fire(
        'Documento inválido',
        this.tipo === 'boleta'
          ? 'La boleta requiere un DNI de 8 dígitos'
          : 'La factura requiere un RUC de 11 dígitos',
        'warning'
      );
      return;
    }

    if (this.items.length === 0 || this.totals.total <= 0) {
      Swal.fire('Total inválido', 'La cotización no tiene un monto válido para facturar', 'warning');
      return;
    }

    this.saving = true;

    this.facturacionService
      .emitirComprobante({
        tipo: this.tipo,
        serie: this.serie,
        cotizacionID: this.selectedCotizacion.cotizacionID,
        clienteNombre: this.clienteNombre.trim(),
        clienteDocumento: this.nroDocumento.replace(/\D/g, ''),
        tipoDocumento: this.tipoDocumento,
        clienteDireccion: this.clienteDireccion,
        clienteTelefono: this.clienteTelefono,
        fechaEmision: this.fechaEmision,
        formaPago: this.formaPago,
        medioPago: this.medioPago,
        moneda: this.moneda,
        opGravadas: this.totals.opGravadas,
        opInafectas: this.totals.opInafectas,
        opExoneradas: this.totals.opExoneradas,
        subtotal: this.totals.subtotal,
        igv: this.totals.igv,
        total: this.totals.total,
        recibido: Number(this.recibido || 0),
        vuelto: this.vuelto,
        modoEmision: this.modoEmision,
        items: this.items,
      })
      .subscribe({
        next: (comprobante) => {
          this.saving = false;

          const mensajeSunat = this.buildMensajeEmision(comprobante);
          openTicketPreview(comprobante, {
            razonSocial: this.emisorConfig?.razonSocial,
            ruc: this.emisorConfig?.ruc,
            direccion: this.emisorConfig?.direccion,
            nombreComercial: this.emisorConfig?.nombreComercial,
          });

          Swal.fire({
            icon: 'success',
            title: `${this.title} registrada`,
            html: `Comprobante <strong>${comprobante.numeroCompleto}</strong><br>${mensajeSunat}<br><small>Se abrió la ventana del ticket para imprimir o guardar.</small>`,
            confirmButtonText: 'Ver comprobantes',
            showCancelButton: true,
            cancelButtonText: 'Emitir otra',
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/facturacion/comprobantes']);
            } else {
              this.resetForm();
            }
          });
        },
        error: (err) => {
          this.saving = false;
          const msg = this.readApiError(err, 'No se pudo registrar el comprobante');
          Swal.fire('Error', msg, 'error');
        },
      });
  }

  cancelar(): void {
    this.router.navigate(['/facturacion/comprobantes']);
  }

  private buildMensajeEmision(comprobante: ComprobanteElectronico): string {
    if (this.modoEmision === 'solo_venta') {
      return 'Venta registrada en el sistema (sin envío a SUNAT).';
    }

    switch (comprobante.estado) {
      case 'Aceptado':
        return 'Comprobante aceptado por SUNAT.';
      case 'Rechazado':
        return comprobante.sunatRespuesta || 'SUNAT rechazó el comprobante. Revisa el detalle en Comprobantes.';
      case 'Pendiente SUNAT':
        return comprobante.sunatRespuesta
          || 'Venta registrada. Quedará pendiente de envío a SUNAT hasta activar la integración.';
      default:
        return comprobante.sunatRespuesta || 'Comprobante registrado.';
    }
  }

  private resetForm(): void {
    this.selectedCotizacion = null;
    this.searchQuery = '';
    this.searchResults = [];
    this.nroDocumento = '';
    this.ultimoDocumentoConsultado = '';
    this.clienteNombre = '';
    this.clienteDireccion = '';
    this.clienteTelefono = '';
    this.items = [];
    this.recibido = null;
    this.vuelto = 0;
    this.montoAdelantoFacturado = 0;
    this.metodoPagoAdelanto = '';
    this.itemTipoIgv = '10';
    this.correlativoPreview = this.facturacionService.previewCorrelativo(this.tipo);
    this.recalcularTotales();
  }

  private readApiError(err: any, fallback: string): string {
    const body = err?.error;
    if (typeof body === 'string' && body.trim()) {
      return body;
    }
    if (body?.message) {
      return body.message;
    }
    if (body?.Message) {
      return body.Message;
    }
    if (typeof err?.message === 'string' && err.message && !err.message.startsWith('Http failure')) {
      return err.message;
    }
    return fallback;
  }

  private todayString(): string {
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return local.toISOString().split('T')[0];
  }

  private round(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
