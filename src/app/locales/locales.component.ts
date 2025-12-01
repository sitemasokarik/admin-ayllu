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
  selector: "app-locales",
  standalone: true,
  imports: [BreadcrumbComponent, RouterLink, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: "./locales.component.html",
  styleUrl: "./locales.component.css",
})
export class LocalesComponent implements OnInit {

  title = "Locales";
  loading = true;

  locales: any[] = [];
  dataTable: any = null;

  selectedLocal: any = null;
  newFotoUrl: string = "";

  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadLocales();
  }

  // ===========================
  //   CARGAR LOCALIDADES
  // ===========================
  loadLocales(): void {
    this.loading = true;

    // Si ya existe la DataTable, destruirla
    if (this.dataTable) {
      this.dataTable.destroy();
      this.dataTable = null;
    }

    this.userService.getAllLocales().subscribe({
      next: (res: any) => {
        this.locales = res.data || [];
        this.loading = false;

        // Inicializar DataTable con delay para asegurar DOM
        setTimeout(() => this.initDataTable(), 150);
      },
      error: err => {
        console.error("Error al cargar locales:", err);
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
  //   ELIMINAR LOCAL
  // ===========================
  deleteLocal(localID: number): void {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡El local será desactivado!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, desactivar",
      cancelButtonText: "Cancelar",
    }).then(result => {
      if (result.isConfirmed) {
        this.userService.deleteLocal(localID).subscribe({
          next: () => {
            const local = this.locales.find(l => l.localID === localID);
            if (local) local.estado = false;

            Swal.fire("Desactivado", "El local ahora está inactivo", "success");
          },
          error: () => Swal.fire("Error", "No se pudo desactivar el local", "error"),
        });
      }
    });
  }

  // ===========================
  //   ABRIR MODAL DETALLES
  // ===========================
  openLocalModal(local: any) {
    this.selectedLocal = null;

    this.userService.getLocalById(local.localID).subscribe({
      next: res => {
        this.selectedLocal = res.data;

        const modalEl = document.getElementById("localModal");
        if (modalEl) new bootstrap.Modal(modalEl).show();
      },
      error: () => Swal.fire("Error", "No se pudo cargar el local", "error"),
    });
  }

  // ===========================
  //   EDITAR LOCAL
  // ===========================
  editLocal(local: any) {
    this.selectedLocal = null;

    this.userService.getLocalById(local.localID).subscribe({
      next: res => {
        this.selectedLocal = res.data;

        const modalEl = document.getElementById("editLocalModal");
        if (modalEl) new bootstrap.Modal(modalEl).show();
      },
      error: () => Swal.fire("Error", "No se pudo cargar la información", "error")
    });
  }

  // ===========================
  //   GUARDAR CAMBIOS EDITAR
  // ===========================
  submitEditLocal() {
    if (!this.selectedLocal) return;

    const loggedUser = this.authService.getUser();

    const updateData = {
      localID: Number(this.selectedLocal.localID),
      nombre: this.selectedLocal.nombre,
      direccion: this.selectedLocal.direccion,
      capacidad: this.selectedLocal.capacidad,
      precioAlquiler: this.selectedLocal.precioAlquiler,
      horasEvento: this.selectedLocal.horasEvento,
      fotosUrls: this.selectedLocal.fotosUrls,
      terminosCondiciones: this.selectedLocal.terminosCondiciones,
      usuarioModificacion: loggedUser?.userName || "Admin",
    };

    this.userService.updateLocal(updateData).subscribe({
      next: () => {
        Swal.fire("Actualizado", "Local modificado correctamente", "success");
        this.closeEditLocalModal();
        this.loadLocales();
      },
      error: () => Swal.fire("Error", "No se pudo actualizar el local", "error"),
    });
  }

  closeEditLocalModal() {
    const modalEl = document.getElementById("editLocalModal");
    if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();
  }
}
