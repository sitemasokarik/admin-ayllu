import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { BreadcrumbComponent } from "../breadcrumb/breadcrumb.component";
import { RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { UserService } from "../../service/user.service";
import DataTable from "datatables.net";
import Swal from "sweetalert2";
import * as bootstrap from "bootstrap";
import { AuthService } from "../../service/auth.service";

@Component({
  selector: "app-services",
  standalone: true,
  imports: [BreadcrumbComponent, RouterLink, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: "./services.component.html",
  styleUrl: "./services.component.css",
})
export class ServicesComponent implements OnInit {

  title = "Servicios";
  loading = true;

  servicios: any[] = [];
  dataTable: any = null;

  selectedServicio: any = null;
  newFotoUrl: string = "";

  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadServicios();
  }

  // ===========================
  //   CARGAR SERVICIOS
  // ===========================
  loadServicios(): void {
    this.loading = true;

    // Si existe DataTable → destruirla
    if (this.dataTable) {
      this.dataTable.destroy();
      this.dataTable = null;
    }

    this.userService.getAllServicios().subscribe({
      next: (res: any) => {
        this.servicios = res.data || [];
        this.loading = false;

        // Inicializar DataTable con delay
        setTimeout(() => this.initDataTable(), 150);
      },
      error: err => {
        console.error("Error al cargar servicios:", err);
        this.loading = false;
      }
    });
  }

  // ===========================
  //   INICIALIZAR DATATABLE
  // ===========================
  initDataTable(): void {
    const tableElement = document.querySelector("#dataTable");
    if (!tableElement) return;

    this.dataTable = new DataTable("#dataTable", {
      pageLength: 10,
      columnDefs: [
        { orderable: false, targets: -1 }
      ]
    });
  }

  // ===========================
  //   ABRIR MODAL DETALLES
  // ===========================
  openServicioModal(servicio: any) {
    this.selectedServicio = null;

    this.userService.getServicioById(servicio.servicioID).subscribe({
      next: (res: any) => {
        this.selectedServicio = res.data;

        const modalEl = document.getElementById("servicioModal");
        if (modalEl) new bootstrap.Modal(modalEl).show();
      },
      error: () => Swal.fire("Error", "No se pudo cargar el servicio", "error")
    });
  }

  // ===========================
  //   EDITAR SERVICIO
  // ===========================
  editServicio(servicio: any) {
    this.selectedServicio = null;

    this.userService.getServicioById(servicio.servicioID).subscribe({
      next: (res: any) => {
        this.selectedServicio = res.data;

        const modalEl = document.getElementById("editServicioModal");
        if (modalEl) new bootstrap.Modal(modalEl).show();
      },
      error: () => Swal.fire("Error", "No se pudo cargar la información", "error")
    });
  }

  // ===========================
  //   GUARDAR CAMBIOS EDITAR
  // ===========================
  submitEditServicio() {
    if (!this.selectedServicio) return;

    const user = this.authService.getUser();

    this.selectedServicio.usuarioModificacion =
      user?.username || "Administrador";

    this.userService.updateServicio(this.selectedServicio).subscribe({
      next: () => {
        Swal.fire("Actualizado", "Servicio modificado correctamente", "success");
        this.closeEditServicioModal();
        this.loadServicios();
      },
      error: () => Swal.fire("Error", "No se pudo actualizar el servicio", "error")
    });
  }

  closeEditServicioModal() {
    const modalEl = document.getElementById("editServicioModal");
    if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();
  }

  // ===========================
  //   ELIMINAR SERVICIO
  // ===========================
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
            this.loadServicios();
            Swal.fire("Eliminado", "Servicio eliminado correctamente", "success");
          },
          error: () => Swal.fire("Error", "No se pudo eliminar el servicio", "error"),
        });
      }
    });
  }

}
