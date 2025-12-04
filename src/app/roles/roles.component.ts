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
  selector: 'app-roles',
  standalone: true,
  imports: [BreadcrumbComponent, RouterLink, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent {
  title = "Roles";
  loading = true;

  roles: any[] = [];
  dataTable: any = null;
  selectedPaginaID: number | null = null;
  
  selectedRoles: any = null;
  newFotoUrl: string = "";

  constructor(private userService: UserService, private authService: AuthService) {}


  ngOnInit(): void {
    this.loadEventos();
  }

  loadEventos(): void {
    this.loading = true;

    // Si existe DataTable → destruirla
    if (this.dataTable) {
      this.dataTable.destroy();
      this.dataTable = null;
    }

    this.userService.getAllRoles().subscribe({
      next: (res: any) => {
        console.log(res);
        this.roles = res.data || [];
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
    this.selectedRoles = null;

    this.userService.getRolById(rol.rolID).subscribe({
      next: (res: any) => {
        this.selectedRoles = res.data;

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
    this.selectedRoles = null;

    this.userService.getRolById(servicio.rolID).subscribe({
      next: (res: any) => {
        this.selectedRoles = res.data;

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
    if (!this.selectedRoles) return;

    const user = this.authService.getUser();

    this.selectedRoles.usuarioModificacion =
      user?.username || "Administrador";

    this.userService.updateRol(this.selectedRoles).subscribe({
      next: () => {
        Swal.fire("Actualizado", "Servicio modificado correctamente", "success");
        this.closeEditServicioModal();
        this.loadEventos();
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
  deleteRol(rolID: number) {
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
        this.userService.deleteRol(rolID).subscribe({
          next: () => {
            this.loadEventos();
            Swal.fire("Eliminado", "Rol eliminado correctamente", "success");
          },
          error: () => Swal.fire("Error", "No se pudo eliminar el Rol", "error"),
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

  agregarPermiso() {
    if (!this.selectedRoles || !this.selectedPaginaID) return;

    const payload = {
      rolID: this.selectedRoles.rolID,
      paginaID: this.selectedPaginaID,
      puedeVer: true,
      puedeCrear: true,
      puedeEditar: true,
      puedeEliminar: true,
      usuarioCreacion: "Admin"
    };

    this.userService.createPermiso(payload).subscribe({
      next: () => {
        Swal.fire("Correcto", "Permiso creado", "success");
        this.loadEventos(); // recargar lista de roles
      },
      error: () => {
        Swal.fire("Error", "No se pudo crear el permiso", "error");
      }
    });
  }

}
