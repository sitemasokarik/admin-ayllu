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
  selector: 'app-roles',
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
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent implements OnInit {
  title = "Roles";
  loading = true;

  roles: any[] = [];
  tableFilterFields = ["rolID", "nombre", "descripcion"];
  selectedPaginaID: number | null = null;

  selectedRoles: any = null;
  newFotoUrl: string = "";

  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadEventos();
  }

  loadEventos(): void {
    this.loading = true;

    this.userService.getAllRoles().subscribe({
      next: (res: any) => {
        this.roles = res.data || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire("Error", "No se pudieron cargar los roles", "error");
      },
    });
  }

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

  editRol(servicio: any) {
    this.selectedRoles = null;

    this.userService.getRolById(servicio.rolID).subscribe({
      next: (res: any) => {
        this.selectedRoles = res.data;

        this.loadPaginas();

        const modalEl = document.getElementById("editServicioModal");
        if (modalEl) new bootstrap.Modal(modalEl).show();
      },
      error: () => Swal.fire("Error", "No se pudo cargar la información", "error")
    });
  }

  submitEditRol() {
    if (!this.selectedRoles) return;

    const user = this.authService.getUser();

    this.selectedRoles.usuarioModificacion =
      user?.username || "Administrador";

    this.userService.updateRol(this.selectedRoles).subscribe({
      next: () => {
        const index = this.roles.findIndex((r) => r.rolID === this.selectedRoles.rolID);
        if (index >= 0) {
          this.roles[index] = { ...this.roles[index], ...this.selectedRoles };
          this.roles = [...this.roles];
        }
        Swal.fire("Actualizado", "Rol modificado correctamente", "success");
        this.closeEditServicioModal();
      },
      error: () => Swal.fire("Error", "No se pudo actualizar el servicio", "error")
    });
  }

  closeEditServicioModal() {
    const modalEl = document.getElementById("editServicioModal");
    if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();
  }

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
            this.roles = this.roles.filter((r) => r.rolID !== rolID);
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
        this.loadEventos();
      },
      error: () => {
        Swal.fire("Error", "No se pudo crear el permiso", "error");
      }
    });
  }

  trackByRolId(_index: number, rol: { rolID: number }): number {
    return rol.rolID;
  }
}
