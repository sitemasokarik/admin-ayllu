import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { BreadcrumbComponent } from "../breadcrumb/breadcrumb.component";
import { RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { UserService } from "../../service/user.service";
import Swal from "sweetalert2";
import * as bootstrap from "bootstrap";
import { AuthService } from "../../service/auth.service";
import { AdminTableShellComponent } from "../shared/admin-table/admin-table-shell.component";
import { AdminTableBodyDirective } from "../shared/admin-table/admin-table-body.directive";

@Component({
  selector: "app-services",
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
  templateUrl: "./services.component.html",
  styleUrl: "./services.component.css",
})
export class ServicesComponent implements OnInit {

  title = "Servicios";
  loading = true;
  tableFilterFields = ["servicioID", "nombre", "precio", "descripcion"];

  servicios: any[] = [];

  selectedServicio: any = null;
  fotoUploading = false;

  constructor(public userService: UserService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadServicios();
  }

  loadServicios(): void {
    this.loading = true;

    this.userService.getAllServicios().subscribe({
      next: (res: any) => {
        this.servicios = res.data || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire("Error", "No se pudieron cargar los servicios", "error");
      },
    });
  }

  private patchServicioInList(servicioID: number, patch: Record<string, unknown>): void {
    const index = this.servicios.findIndex((s) => s.servicioID === servicioID);
    if (index >= 0) {
      this.servicios[index] = { ...this.servicios[index], ...patch };
      this.servicios = [...this.servicios];
    }
  }

  openServicioModal(servicio: any) {
    this.selectedServicio = null;

    this.userService.getServicioById(servicio.servicioID).subscribe({
      next: (res: any) => {
        this.selectedServicio = {
          ...res.data,
          fotosUrls: res.data?.fotosUrls?.length ? [...res.data.fotosUrls] : [],
        };

        const modalEl = document.getElementById("servicioModal");
        if (modalEl) new bootstrap.Modal(modalEl).show();
      },
      error: () => Swal.fire("Error", "No se pudo cargar el servicio", "error")
    });
  }

  editServicio(servicio: any) {
    this.selectedServicio = null;

    this.userService.getServicioById(servicio.servicioID).subscribe({
      next: (res: any) => {
        this.selectedServicio = {
          ...res.data,
          fotosUrls: res.data?.fotosUrls?.length ? [...res.data.fotosUrls] : [],
        };

        const modalEl = document.getElementById("editServicioModal");
        if (modalEl) new bootstrap.Modal(modalEl).show();
      },
      error: () => Swal.fire("Error", "No se pudo cargar la información", "error")
    });
  }

  onFotoSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file || !this.selectedServicio) return;

    this.fotoUploading = true;
    this.userService.uploadMedia(file, 'servicios').subscribe({
      next: (res) => {
        const url = res?.data?.url;
        if (url) {
          if (!this.selectedServicio.fotosUrls) this.selectedServicio.fotosUrls = [];
          this.selectedServicio.fotosUrls.push(url);
        }
        this.fotoUploading = false;
        (event.target as HTMLInputElement).value = '';
      },
      error: (err) => {
        this.fotoUploading = false;
        Swal.fire('Error', err?.error?.message || 'No se pudo subir la imagen', 'error');
      },
    });
  }

  removeFotoUrl(index: number): void {
    this.selectedServicio?.fotosUrls?.splice(index, 1);
  }

  submitEditServicio() {
    if (!this.selectedServicio) return;

    const user = this.authService.getUser();

    this.selectedServicio.usuarioModificacion =
      user?.username || "Administrador";

    this.userService.updateServicio(this.selectedServicio).subscribe({
      next: () => {
        this.patchServicioInList(this.selectedServicio.servicioID, { ...this.selectedServicio });
        Swal.fire("Actualizado", "Servicio modificado correctamente", "success");
        this.closeEditServicioModal();
      },
      error: () => Swal.fire("Error", "No se pudo actualizar el servicio", "error")
    });
  }

  closeEditServicioModal() {
    const modalEl = document.getElementById("editServicioModal");
    if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();
  }

  deleteServicio(servicioID: number) {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "El servicio será eliminado",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(result => {
      if (result.isConfirmed) {
        this.userService.deleteServicio(servicioID).subscribe({
          next: () => {
            this.servicios = this.servicios.filter((s) => s.servicioID !== servicioID);
            Swal.fire("Eliminado", "Servicio eliminado correctamente", "success");
          },
          error: () => Swal.fire("Error", "No se pudo eliminar el servicio", "error"),
        });
      }
    });
  }

  trackByServicioId(_index: number, servicio: { servicioID: number }): number {
    return servicio.servicioID;
  }
}
