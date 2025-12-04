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
  selector: 'app-pages',
  standalone: true,
  imports: [BreadcrumbComponent, RouterLink, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.css'
})
export class PagesComponent {
  title = "Páginas";
  loading = true;

  pages: any[] = [];
  dataTable: any = null;

  selectedPages: any = null;
  newFotoUrl: string = "";

  constructor(private userService: UserService, private authService: AuthService) {}


  ngOnInit(): void {
    this.loadPages();
  }

  loadPages(): void {
    this.loading = true;

    // Si existe DataTable → destruirla
    if (this.dataTable) {
      this.dataTable.destroy();
      this.dataTable = null;
    }

    this.userService.getAllPages().subscribe({
      next: (res: any) => {
        console.log(res);
        this.pages = res.data || [];
        this.loading = false;

        // Inicializar DataTable con delay
        setTimeout(() => this.initDataTable(), 150);
      },
      error: err => {
        console.error("Error al cargar Eventos:", err);
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
  openRolModal(rol: any) {
    this.selectedPages = null;

    this.userService.getPageById(rol.paginaID).subscribe({
      next: (res: any) => {
        this.selectedPages = res.data;

        const modalEl = document.getElementById("servicioModal");
        if (modalEl) new bootstrap.Modal(modalEl).show();
      },
      error: () => Swal.fire("Error", "No se pudo cargar el servicio", "error")
    });
  }

  // ===========================
  //   EDITAR SERVICIO
  // ===========================
  editPage(servicio: any) {
    this.selectedPages = null;

    this.userService.getPageById(servicio.paginaID).subscribe({
      next: (res: any) => {
        this.selectedPages = res.data;

        const modalEl = document.getElementById("editServicioModal");
        if (modalEl) new bootstrap.Modal(modalEl).show();
      },
      error: () => Swal.fire("Error", "No se pudo cargar la información", "error")
    });
  }

  // ===========================
  //   GUARDAR CAMBIOS EDITAR
  // ===========================
  submitEditPage() {
    if (!this.selectedPages) return;

    const user = this.authService.getUser();

    this.selectedPages.usuarioModificacion =
      user?.username || "Administrador";

    this.userService.updatePage(this.selectedPages).subscribe({
      next: () => {
        Swal.fire("Actualizado", "Servicio modificado correctamente", "success");
        this.closeEditServicioModal();
        this.loadPages();
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
  deletePage(paginaID: number) {
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
        this.userService.deletePage(paginaID).subscribe({
          next: () => {
            this.loadPages();
            Swal.fire("Eliminado", "Página eliminado correctamente", "success");
          },
          error: () => Swal.fire("Error", "No se pudo eliminar el Página", "error"),
        });
      }
    });
  }
}
