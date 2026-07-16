import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { BreadcrumbComponent } from "../breadcrumb/breadcrumb.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { UserService } from "../../service/user.service";
import Swal from "sweetalert2";
import * as bootstrap from "bootstrap";
import { AuthService } from "../../service/auth.service";
import { AdminTableShellComponent } from "../shared/admin-table/admin-table-shell.component";
import { AdminTableBodyDirective } from "../shared/admin-table/admin-table-body.directive";

@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    CommonModule,
    FormsModule,
    AdminTableShellComponent,
    AdminTableBodyDirective,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.css'
})
export class PagesComponent {
  title = "Páginas";
  loading = true;
  tableFilterFields = ["paginaID", "nombre"];

  pages: any[] = [];

  selectedPages: any = null;
  newFotoUrl: string = "";

  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadPages();
  }

  loadPages(): void {
    this.loading = true;

    this.userService.getAllPages().subscribe({
      next: (res: any) => {
        this.pages = res.data || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire("Error", "No se pudieron cargar las páginas", "error");
      },
    });
  }

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

  submitEditPage() {
    if (!this.selectedPages) return;

    const user = this.authService.getUser();

    this.selectedPages.usuarioModificacion =
      user?.username || "Administrador";

    this.userService.updatePage(this.selectedPages).subscribe({
      next: () => {
        const index = this.pages.findIndex((p) => p.paginaID === this.selectedPages.paginaID);
        if (index >= 0) {
          this.pages[index] = { ...this.pages[index], ...this.selectedPages };
          this.pages = [...this.pages];
        }
        Swal.fire("Actualizado", "Página modificada correctamente", "success");
        this.closeEditServicioModal();
      },
      error: () => Swal.fire("Error", "No se pudo actualizar el servicio", "error")
    });
  }

  closeEditServicioModal() {
    const modalEl = document.getElementById("editServicioModal");
    if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();
  }

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
            this.pages = this.pages.filter((p) => p.paginaID !== paginaID);
            Swal.fire("Eliminado", "Página eliminada correctamente", "success");
          },
          error: () => Swal.fire("Error", "No se pudo eliminar el Página", "error"),
        });
      }
    });
  }

  trackByPaginaId(_index: number, page: { paginaID: number }): number {
    return page.paginaID;
  }
}
