import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { BreadcrumbComponent } from "../breadcrumb/breadcrumb.component";
import { RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { UserService } from "../../service/user.service";
import Swal from "sweetalert2";
import * as bootstrap from "bootstrap";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../service/auth.service";
import DataTable from "datatables.net";

@Component({
  selector: 'app-services',
	standalone: true,
	imports: [BreadcrumbComponent, RouterLink, CommonModule, FormsModule],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent implements OnInit {
  title = "Servicios";
  loading: boolean = true;
  servicios: any[] = [];
  selectedServicio: any = null;
  dataTable: any;
  private dtInitialized = false;
  newFotoUrl: string = '';

  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadServicios();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (!this.dtInitialized && this.servicios.length > 0) {
        this.initDataTable();
        this.dtInitialized = true;
      }
    }, 0);
  }

  loadServicios(): void {
    this.userService.getAllServicios().subscribe({
      next: (res: any) => {
        this.servicios = res.data || [];
        this.loading = false;
        if (this.dtInitialized && this.dataTable) {
          this.dataTable.destroy();
          setTimeout(() => this.initDataTable(), 0);
        }
      },
      error: err => console.error("Error al cargar servicios:", err),
    });
  }

  initDataTable(): void {
    this.dataTable = new DataTable("#dataTable", {
      pageLength: 10,
      columnDefs: [{ orderable: false, targets: -1 }],
    });
  }

  // Modal detalle servicio
  openServicioModal(servicio: any) {
    this.selectedServicio = null;
    this.userService.getServicioById(servicio.servicioID).subscribe({
      next: (res: any) => {
        this.selectedServicio = res.data;
        const modalEl = document.getElementById("servicioModal");
        if (modalEl) {
          const modal = new bootstrap.Modal(modalEl);
          modal.show();
        }
      },
      error: err => Swal.fire("Error", "No se pudo cargar el servicio", "error")
    });
  }

  // Eliminar / desactivar servicio
  deleteServicio(servicioID: number) {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡El servicio será eliminado!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(result => {
      if (result.isConfirmed) {
        this.userService.deleteServicio(servicioID).subscribe({
          next: () => {
            this.servicios = this.servicios.filter(s => s.servicioID !== servicioID);
            Swal.fire("Eliminado", "El servicio ha sido eliminado", "success");
          },
          error: err => Swal.fire("Error", "No se pudo eliminar el servicio", "error")
        });
      }
    });
  }


// Abrir modal de edición
editServicio(servicio: any) {
  this.selectedServicio = { ...servicio, fotosUrls: servicio.fotosUrls || [] }; // asegurar array
  const modalEl = document.getElementById("editServicioModal");
  if (modalEl) {
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }
}


submitEditServicio() {
  if (!this.selectedServicio) return;

  // Agregar usuario que modifica
  this.selectedServicio.usuarioModificacion = this.authService.getUser()?.username || "desconocido";


  this.userService.updateServicio(this.selectedServicio).subscribe({
    next: () => {
      Swal.fire("Éxito", "Servicio actualizado correctamente", "success");
      // Actualizar tabla local
      const index = this.servicios.findIndex(s => s.servicioID === this.selectedServicio.servicioID);
      if (index > -1) this.servicios[index] = { ...this.selectedServicio };
      this.selectedServicio = null;

      // Cerrar modal
      const modalEl = document.getElementById("editServicioModal");
      const modal = bootstrap.Modal.getInstance(modalEl);
      modal?.hide();
    },
    error: err => Swal.fire("Error", "No se pudo actualizar el servicio", "error")
  });
}


}
