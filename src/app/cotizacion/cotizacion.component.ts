import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from "@angular/core";
import { BreadcrumbComponent } from "../breadcrumb/breadcrumb.component";
import { Router, RouterLink, ActivatedRoute } from "@angular/router";
import { CommonModule } from "@angular/common";
import { UserService } from "../../service/user.service";
import Swal from "sweetalert2";
import * as bootstrap from "bootstrap";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../service/auth.service";
import { markCotizacionesVistas } from "../config/header-alerts.util";
import { AdminTableShellComponent } from "../shared/admin-table/admin-table-shell.component";
import { AdminTableBodyDirective } from "../shared/admin-table/admin-table-body.directive";

type CotizacionListMode = "operaciones" | "evento";

@Component({
  selector: "app-cotizacion",
  standalone: true,
  imports: [
    BreadcrumbComponent,
    RouterLink,
    CommonModule,
    FormsModule,
    AdminTableShellComponent,
    AdminTableBodyDirective,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: "./cotizacion.component.html",
  styleUrl: "./cotizacion.component.css",
})
export class CotizacionComponent implements OnInit {
  @ViewChild(AdminTableShellComponent) tableShell?: AdminTableShellComponent;

  title = "Cotizaciones";
  listMode: CotizacionListMode = "operaciones";
  loading = true;
  cotizaciones: any[] = [];
  filteredCotizaciones: any[] = [];
  selectedCotizaciones: any = null;

  filterEstado = "";
  filterOrigen = "";
  filterDateField: "fechaCreacion" | "fechaTentativa" | "fechaReservada" = "fechaCreacion";
  filterDateFrom = "";
  filterDateTo = "";

  dateFieldOptions: { value: "fechaCreacion" | "fechaTentativa" | "fechaReservada"; label: string }[] = [
    { value: "fechaCreacion", label: "Fecha registro" },
    { value: "fechaTentativa", label: "Fecha tentativa" },
    { value: "fechaReservada", label: "Fecha reservada" },
  ];

  estadoOptions = ["Activo", "Pendiente", "Borrador", "Anulado"];
  origenOptions = ["Admin", "Landing", "Portal"];

  tableFilterFields = [
    "cotizacionID",
    "clienteNombre",
    "clienteDocumento",
    "totalCotizacion",
    "totalEvento",
    "localNombre",
    "fechaTentativa",
    "fechaTentativaOpcional",
    "fechaReservada",
    "fechaCreacion",
    "estadoCotizacion",
    "origenCotizacion",
    "creadoPorNombre",
    "responsableNombre",
    "comprobanteNumero",
  ];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    markCotizacionesVistas(this.authService.getUser()?.usuarioID);

    this.route.data.subscribe((data) => {
      this.listMode = data["listMode"] === "evento" ? "evento" : "operaciones";
      this.title = data["title"] ?? (this.listMode === "evento" ? "Cotizaciones en evento" : "Cotizaciones");
      this.estadoOptions = this.listMode === "evento"
        ? ["Evento"]
        : ["Activo", "Pendiente", "Borrador", "Anulado"];
      this.loadServicios();
    });
  }

  loadServicios(): void {
    this.loading = true;

    this.userService.getAllCotizaciones().subscribe({
      next: (res: any) => {
        const all = res.data || [];
        this.cotizaciones =
          this.listMode === "evento"
            ? all.filter((c: any) => c.estadoCotizacion === "Evento")
            : all.filter((c: any) => c.estadoCotizacion !== "Evento" && c.estadoCotizacion !== "Anulado");
        this.applyLocalFilters();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire("Error", "No se pudieron cargar las cotizaciones", "error");
      },
    });
  }

  applyLocalFilters(): void {
    this.filteredCotizaciones = this.cotizaciones.filter((c) => {
      if (this.filterEstado && c.estadoCotizacion !== this.filterEstado) return false;
      if (this.filterOrigen && (c.origenCotizacion || "Admin") !== this.filterOrigen) return false;
      if (!this.matchesDateRange(c)) return false;
      return true;
    });
  }

  private parseDateOnly(value: unknown): Date | null {
    if (value == null || value === "") return null;
    const d = new Date(String(value));
    if (Number.isNaN(d.getTime())) return null;
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  private matchesDateRange(c: any): boolean {
    if (!this.filterDateFrom && !this.filterDateTo) return true;

    const recordDate = this.parseDateOnly(c[this.filterDateField]);
    if (!recordDate) return false;

    const from = this.filterDateFrom ? this.parseDateOnly(this.filterDateFrom) : null;
    const to = this.filterDateTo ? this.parseDateOnly(this.filterDateTo) : null;

    if (from && recordDate < from) return false;
    if (to && recordDate > to) return false;
    return true;
  }

  get hasActiveFilters(): boolean {
    return !!(
      this.filterEstado ||
      this.filterOrigen ||
      this.filterDateFrom ||
      this.filterDateTo
    );
  }

  get filteredCountLabel(): string {
    return `${this.filteredCotizaciones.length} de ${this.cotizaciones.length} cotizaciones`;
  }

  onFilterChange(): void {
    if (this.filterDateFrom && this.filterDateTo) {
      const from = this.parseDateOnly(this.filterDateFrom);
      const to = this.parseDateOnly(this.filterDateTo);
      if (from && to && from > to) {
        this.filterDateTo = this.filterDateFrom;
      }
    }

    this.applyLocalFilters();
    if (this.tableShell) {
      this.tableShell.currentPage = 1;
    }
  }

  clearFilters(): void {
    this.filterEstado = "";
    this.filterOrigen = "";
    this.filterDateField = "fechaCreacion";
    this.filterDateFrom = "";
    this.filterDateTo = "";
    this.applyLocalFilters();
    if (this.tableShell) {
      this.tableShell.currentPage = 1;
    }
  }

  sortBy(field: string): void {
    this.tableShell?.toggleSort(field);
  }

  sortIcon(field: string): string {
    return this.tableShell?.sortIcon(field) ?? "solar:sort-vertical-linear";
  }

  private getCurrentUsuarioId(): number | null {
    const user = this.authService.getUser();
    if (!user) return null;
    const id = Number(user.usuarioID ?? user.UsuarioID ?? user.usuarioId);
    return id > 0 ? id : null;
  }

  private getCurrentUsuarioNombre(): string {
    const user = this.authService.getUser();
    return (user?.nombre || user?.Nombre || user?.userName || user?.UserName || "Administrador").trim();
  }

  puedeTomarCotizacion(c: any): boolean {
    if (!c || c.estadoCotizacion === "Borrador") return false;
    return (c.origenCotizacion || "").toLowerCase() === "landing" && !c.responsableNombre;
  }

  tomarCotizacion(c: any, event?: Event): void {
    event?.stopPropagation();

    const usuarioId = this.getCurrentUsuarioId();
    if (!usuarioId) {
      Swal.fire(
        "Sesión",
        "No se pudo identificar tu usuario. Cierra sesión e ingresa de nuevo.",
        "warning",
      );
      return;
    }

    const nombre = this.getCurrentUsuarioNombre();
    Swal.fire({
      title: "¿Tomar esta cotización?",
      html: `Quedará asignada a <strong>${nombre}</strong>.<br>Nadie podrá cambiarla después.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, tomar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#f47820",
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.userService.tomarCotizacion(c.cotizacionID, usuarioId, nombre).subscribe({
        next: (res: any) => {
          const data = res?.data;
          c.responsableNombre = data?.responsableNombre || nombre;
          c.responsableUsuarioID = usuarioId;
          c.fechaAsignacion = data?.fechaAsignacion || new Date().toISOString();
          this.applyLocalFilters();

          if (data?.alreadyAssigned && data?.responsableNombre && data.responsableNombre !== nombre) {
            Swal.fire("Ya tomada", `Esta cotización ya fue tomada por ${data.responsableNombre}.`, "info");
            return;
          }

          Swal.fire("Asignada", `Cotización tomada por ${c.responsableNombre}.`, "success");
        },
        error: (err) => {
          const msg =
            err?.error?.message ||
            "No se pudo tomar la cotización. Si acabas de actualizar, reinicia la API (restart-dev.ps1).";
          Swal.fire("Error", msg, "error");
        },
      });
    });
  }

  openServicioModal(cotizacionID: number) {
    const row = this.cotizaciones.find((c) => c.cotizacionID === cotizacionID)
      ?? this.filteredCotizaciones.find((c) => c.cotizacionID === cotizacionID);
    const usuarioId = this.getCurrentUsuarioId();
    const isLanding = (row?.origenCotizacion || '').toLowerCase() === 'landing';
    const needsClaim = isLanding && !row?.responsableNombre && !!usuarioId;

    const showDetail = () => {
      this.userService.getCotizacionesById(cotizacionID).subscribe({
        next: (res: any) => {
          this.selectedCotizaciones = res.data;

          setTimeout(() => {
            const modalEl = document.getElementById("servicioModal");
            if (modalEl) {
              const modal = new bootstrap.Modal(modalEl);
              modal.show();
            }
          }, 50);
        },
        error: () => Swal.fire("Error", "No se pudo cargar la información", "error"),
      });
    };

    if (!needsClaim) {
      showDetail();
      return;
    }

    const nombre = this.getCurrentUsuarioNombre();
    this.userService.tomarCotizacion(cotizacionID, usuarioId!, nombre).subscribe({
      next: (res: any) => {
        const data = res?.data;
        if (row) {
          row.responsableNombre = data?.responsableNombre || nombre;
          row.responsableUsuarioID = usuarioId;
          row.fechaAsignacion = data?.fechaAsignacion || new Date().toISOString();
        }
        this.applyLocalFilters();
        showDetail();
      },
      error: () => showDetail(),
    });
  }

  private auditUserName(): string {
    const user = this.authService.getUser();
    return (user?.nombre || user?.userName || 'Admin').trim();
  }

  origenLabel(origen: string | undefined | null): string {
    const value = (origen || 'Admin').trim();
    if (value.toLowerCase() === 'landing') return 'Landing';
    if (value.toLowerCase() === 'portal') return 'Portal';
    return 'Admin';
  }

  creadoPorLabel(c: any): string {
    if (!c) return '—';
    const origen = (c.origenCotizacion || 'Admin').toLowerCase();
    if (origen === 'landing') return 'Cliente (Landing)';
    return c.creadoPorNombre || c.usuarioCreacion || '—';
  }

  responsableLabel(c: any): string {
    if (!c) return '—';
    const origen = (c.origenCotizacion || 'Admin').toLowerCase();
    if (origen === 'landing') {
      return c.responsableNombre || 'Pendiente de tomar';
    }
    return c.creadoPorNombre || c.usuarioCreacion || '—';
  }

  operObservacion(cotizacionID: number) {
    this.userService.getCotizacionesById(cotizacionID).subscribe({
      next: (res: any) => {
        this.selectedCotizaciones = res.data[0];

        setTimeout(() => {
          const modalEl = document.getElementById("cotizacionModalComentario");
          if (modalEl) {
            const modal = new bootstrap.Modal(modalEl);
            modal.show();
          }
        }, 50);
      },
      error: () => Swal.fire("Error", "No se pudo cargar la información", "error"),
    });
  }

  openEstadoModal(cotizacionID: number) {
    this.userService.getCotizacionesById(cotizacionID).subscribe({
      next: (res: any) => {
        this.selectedCotizaciones = res.data[0];

        setTimeout(() => {
          const modalEl = document.getElementById("modalEstadoCotizacion");
          if (modalEl) {
            const modal = new bootstrap.Modal(modalEl);
            modal.show();
          }
        }, 50);
      },
      error: () => Swal.fire("Error", "No se pudo cargar la información", "error"),
    });
  }

  continuarBorrador(c: any): void {
    this.router.navigate(["/presupuestador"], { queryParams: { borrador: c.cotizacionID } });
  }

  onCotizacionRowClick(c: any, event: MouseEvent): void {
    if (c.estadoCotizacion !== "Borrador") return;
    const target = event.target as HTMLElement | null;
    if (target?.closest("button")) return;
    this.continuarBorrador(c);
  }

  guardarEstado() {
    const data = {
      ...this.selectedCotizaciones,
      usuarioModificacion: this.auditUserName(),
    };

    this.userService.updateCotizaciones(data).subscribe({
      next: () => {
        Swal.fire("¡Guardado!", "Estado actualizado correctamente.", "success").then(() => {
          const modalEl = document.getElementById("modalEstadoCotizacion");
          const modal = bootstrap.Modal.getInstance(modalEl!);
          modal?.hide();
          this.selectedCotizaciones = null;
          this.loadServicios();
        });
      },
      error: () => {
        Swal.fire("Error", "No se pudo guardar el Estado", "error");
      },
    });
  }

  guardarObservacion() {
    const data = {
      ...this.selectedCotizaciones,
      usuarioModificacion: this.auditUserName(),
    };

    this.userService.updateCotizacionComentario(data).subscribe({
      next: () => {
        Swal.fire("¡Guardado!", "Observación registrada correctamente.", "success").then(() => {
          const modalEl = document.getElementById("cotizacionModalComentario");
          const modal = bootstrap.Modal.getInstance(modalEl!);
          modal?.hide();
          this.selectedCotizaciones = null;
          this.loadServicios();
        });
      },
      error: () => {
        Swal.fire("Error", "No se pudo guardar la observación", "error");
      },
    });
  }

  editServicio(cotizacionID: number) {
    const item = this.cotizaciones.find((c) => c.cotizacionID === cotizacionID);
    const precioCateringBase = this.precioCateringBase(item);
    const precioCateringDescuento = Number(item.precioPorCubiertoConDescuento) > 0
      ? Number(item.precioPorCubiertoConDescuento)
      : precioCateringBase;

    this.selectedCotizaciones = {
      ...item,
      fotosUrls: item.fotosUrls || [],
      invitadosConDescuento: item.numeroInvitados,
      precioCateringDescuento: precioCateringDescuento,
      precioCateringBase,
    };

    const modalEl = document.getElementById("editServicioModal");
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  deleteServicio(cotizacionID: number) {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "La cotización será eliminada.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteCotizaciones(cotizacionID).subscribe({
          next: () => {
            Swal.fire("Eliminado", "La cotización ha sido eliminada", "success");
            this.loadServicios();
          },
          error: () => Swal.fire("Error", "No se pudo eliminar", "error"),
        });
      }
    });
  }

  submitEditServicio() {
    if (!this.selectedCotizaciones) return;

    const invitados = Number(
      this.selectedCotizaciones.invitadosConDescuento ?? this.selectedCotizaciones.numeroInvitados,
    );
    const precioCatering = Number(
      this.selectedCotizaciones.precioCateringDescuento ?? this.precioCateringBase(this.selectedCotizaciones),
    );

    if (invitados <= 0 || precioCatering <= 0) {
      Swal.fire('Datos inválidos', 'Invitados y precio de catering deben ser mayores a cero', 'warning');
      return;
    }

    const subtotalCateringDescuento = invitados * precioCatering;
    const restoSinCatering = this.restoSinCatering(this.selectedCotizaciones);

    this.selectedCotizaciones.precioPorCubiertoConDescuento = precioCatering;
    this.selectedCotizaciones.totalCotizacion = subtotalCateringDescuento + restoSinCatering;
    this.selectedCotizaciones.usuarioModificacion = this.auditUserName();

    this.userService.updateCotizaciones(this.selectedCotizaciones).subscribe({
      next: () => {
        Swal.fire("Éxito", "Descuento actualizado correctamente", "success").then(() => {
          const modalEl = document.getElementById("editServicioModal");
          const modal = bootstrap.Modal.getInstance(modalEl!);
          modal?.hide();
          this.loadServicios();
        });
      },
      error: () => Swal.fire("Error", "No se pudo actualizar el Descuento", "error"),
    });
  }

  trackByCotizacionId(_index: number, cotizacion: { cotizacionID: number }): number {
    return cotizacion.cotizacionID;
  }

  tieneDescuento(item: any): boolean {
    if (!item) return false;
    const totalDesc = Number(item.totalCotizacion || 0);
    if (totalDesc <= 0) return false;
    const precioBase = this.precioCateringBase(item);
    const precioDesc = Number(item.precioPorCubiertoConDescuento || 0);
    return totalDesc !== Number(item.totalEvento || 0)
      || (precioDesc > 0 && precioDesc !== precioBase);
  }

  precioCateringBase(item: any): number {
    if (!item) return 0;
    const tarifa = Number(item.tarifaMenuPorInvitado);
    if (tarifa > 0) return tarifa;

    const invitados = Number(item.numeroInvitados);
    const subtotalMenu = Number(item.subtotalMenu);
    if (invitados > 0 && subtotalMenu > 0) return subtotalMenu / invitados;

    return 0;
  }

  restoSinCatering(item: any): number {
    if (!item) return 0;
    const totalEvento = Number(item.totalEvento || 0);
    const subtotalMenu = Number(item.subtotalMenu || 0);
    if (totalEvento > 0 && subtotalMenu >= 0) {
      return Math.max(0, totalEvento - subtotalMenu);
    }
    return 0;
  }

  previewSubtotalCateringDescuento(): number {
    if (!this.selectedCotizaciones) return 0;
    const invitados = Number(
      this.selectedCotizaciones.invitadosConDescuento ?? this.selectedCotizaciones.numeroInvitados ?? 0,
    );
    const precio = Number(
      this.selectedCotizaciones.precioCateringDescuento
        ?? this.precioCateringBase(this.selectedCotizaciones),
    );
    return invitados * precio;
  }

  previewTotalConDescuento(): number {
    if (!this.selectedCotizaciones) return 0;
    return this.previewSubtotalCateringDescuento() + this.restoSinCatering(this.selectedCotizaciones);
  }

  estadoClass(estado: string): string {
    switch (estado) {
      case "Activo": return "bg-success-focus text-success-600 border border-success-main";
      case "Evento": return "bg-warning-focus text-warning-600 border border-warning-main";
      case "Pendiente": return "bg-info-50 text-info-600 border border-info-main";
      case "Borrador": return "bg-neutral-200 text-neutral-700 border border-neutral-400";
      default: return "bg-danger-200 text-danger-600 border border-danger-main";
    }
  }
}
