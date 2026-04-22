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
  selector: 'app-permisos',
  standalone: true,
  imports: [BreadcrumbComponent, RouterLink, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './permisos.component.html',
  styleUrl: './permisos.component.css'
})
export class PermisosComponent {
  title = "Permisos de Roles";
  loading = true;

  permisos: any[] = [];
  dataTable: any = null;
   
  
  selectedPermisos: any = null;
  newFotoUrl: string = "";

  constructor(private userService: UserService, private authService: AuthService) {}


  ngOnInit(): void {
    this.loadPermisos();
  }

  loadPermisos(): void {
    this.loading = true;

    // Si existe DataTable → destruirla
    if (this.dataTable) {
      this.dataTable.destroy();
      this.dataTable = null;
    }

    this.userService.getAllPermisos().subscribe({
      next: (res: any) => {
        console.log(res);
        this.permisos = res.data || [];
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
    this.selectedPermisos = null;

    this.userService.getRolById(rol.permisoID).subscribe({
      next: (res: any) => {
        this.selectedPermisos = res.data;

        const modalEl = document.getElementById("servicioModal");
        if (modalEl) new bootstrap.Modal(modalEl).show();
      },
      error: () => Swal.fire("Error", "No se pudo cargar el servicio", "error")
    });
  }

  // ===========================
  //   EDITAR SERVICIO
  // ===========================
  editRol(servicio: any) {
    this.selectedPermisos = null;

    this.userService.getRolById(servicio.permisoID).subscribe({
      next: (res: any) => {
        this.selectedPermisos = res.data;

        // 🔥 IMPORTANTE → carga páginas ANTES de mostrar modal
        this.loadPaginas();

        const modalEl = document.getElementById("editServicioModal");
        if (modalEl) new bootstrap.Modal(modalEl).show();
      },
      error: () => Swal.fire("Error", "No se pudo cargar la información", "error")
    });
  }


  // ===========================
  //   GUARDAR CAMBIOS EDITAR
  // ===========================
  submitEditRol() {
    if (!this.selectedPermisos) return;

    const user = this.authService.getUser();

    this.selectedPermisos.usuarioModificacion =
      user?.username || "Administrador";

    this.userService.updateRol(this.selectedPermisos).subscribe({
      next: () => {
        Swal.fire("Actualizado", "Servicio modificado correctamente", "success");
        this.closeEditServicioModal();
        this.loadPermisos();
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
  deletePermiso(permisoID: number) {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "El Permiso será eliminado",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(result => {
      if (result.isConfirmed) {
        this.userService.deletePermiso(permisoID).subscribe({
          next: () => {
            this.loadPermisos();
            Swal.fire("Eliminado", "Permiso eliminado correctamente", "success");
          },
          error: () => Swal.fire("Error", "No se pudo eliminar el Permiso", "error"),
        });
      }
    });
  }

  paginas: any[] = [];

  loadPaginas() {
    this.userService.getAllPages().subscribe((res: any) => {
      this.paginas = res.data;
    });
  }

 
}
