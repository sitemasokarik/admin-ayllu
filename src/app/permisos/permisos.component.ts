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
import { resolveMenuDisplayName } from "../config/menu.config";

@Component({
  selector: 'app-permisos',
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
  templateUrl: './permisos.component.html',
  styleUrl: './permisos.component.css'
})
export class PermisosComponent {
  title = "Permisos de Roles";
  loading = true;
  tableFilterFields = ["permisoID", "paginaNombre", "rolNombre"];

  permisos: any[] = [];

  selectedPermisos: any = null;
  newFotoUrl: string = "";

  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadPermisos();
  }

  loadPermisos(): void {
    this.loading = true;

    this.userService.getAllPermisos().subscribe({
      next: (res: any) => {
        this.permisos = res.data || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire("Error", "No se pudieron cargar los permisos", "error");
      },
    });
  }

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

  editRol(servicio: any) {
    this.selectedPermisos = null;

    this.userService.getRolById(servicio.permisoID).subscribe({
      next: (res: any) => {
        this.selectedPermisos = res.data;

        this.loadPaginas();

        const modalEl = document.getElementById("editServicioModal");
        if (modalEl) new bootstrap.Modal(modalEl).show();
      },
      error: () => Swal.fire("Error", "No se pudo cargar la información", "error")
    });
  }

  submitEditRol() {
    if (!this.selectedPermisos) return;

    const user = this.authService.getUser();

    this.selectedPermisos.usuarioModificacion =
      user?.username || "Administrador";

    this.userService.updateRol(this.selectedPermisos).subscribe({
      next: () => {
        const index = this.permisos.findIndex((p) => p.permisoID === this.selectedPermisos.permisoID);
        if (index >= 0) {
          this.permisos[index] = { ...this.permisos[index], ...this.selectedPermisos };
          this.permisos = [...this.permisos];
        }
        Swal.fire("Actualizado", "Permiso modificado correctamente", "success");
        this.closeEditServicioModal();
      },
      error: () => Swal.fire("Error", "No se pudo actualizar el servicio", "error")
    });
  }

  closeEditServicioModal() {
    const modalEl = document.getElementById("editServicioModal");
    if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();
  }

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
            this.permisos = this.permisos.filter((p) => p.permisoID !== permisoID);
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

  trackByPermisoId(_index: number, permiso: { permisoID: number }): number {
    return permiso.permisoID;
  }

  paginaLabel(permiso: { paginaNombre?: string; url?: string }): string {
    return resolveMenuDisplayName(permiso.url ?? '', permiso.paginaNombre ?? '');
  }
}
