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
  selector: 'app-cotizacion',
	standalone: true,
	imports: [BreadcrumbComponent, RouterLink, CommonModule, FormsModule],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './cotizacion.component.html',
  styleUrl: './cotizacion.component.css'
})
export class CotizacionComponent {
  title = 'Cotizaciones';
  loading: boolean = true;
  cotizaciones: any[] = [];
  dataTable: any;
  selectedCotizaciones: any = null;
  private dtInitialized = false;
  constructor(private userService: UserService, private authService: AuthService) {}
  
  ngOnInit(): void {
    this.loadServicios();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (!this.dtInitialized && this.cotizaciones.length > 0) {
        this.initDataTable();
        this.dtInitialized = true;
      }
    }, 0);
  }

  loadServicios(): void {
    this.loading = true;

    // Destruir datatable si existe
    if (this.dataTable) {
      this.dataTable.destroy();
      this.dataTable = null;
      this.dtInitialized = false;
    }

    this.userService.getAllCotizaciones().subscribe({
      next: (res: any) => {
        console.log('Respuesta completa de la API:', res);

        this.cotizaciones = res.data || [];
        this.loading = false;

        // Esperar a que Angular pinte la tabla
        setTimeout(() => {
          this.initDataTable();
        }, 150);
      },
      error: err => console.error("Error al cargar servicios:", err),
    });
  }


initDataTable(): void {
  if (!document.querySelector("#dataTable")) return;

  this.dataTable = new DataTable("#dataTable", {
    pageLength: 10,
    columnDefs: [{ orderable: false, targets: -1 }],
  });
}


openServicioModal(cotizacionID: number) {
  this.userService.getCotizacionesById(cotizacionID).subscribe({
    next: (res: any) => {
      this.selectedCotizaciones = res.data;

      setTimeout(() => {
        const modalEl = document.getElementById("servicioModal");
        if (modalEl) {
          const modal = new bootstrap.Modal(modalEl);
          modal.show();
        }
      }, 50); // pequeño delay
    },
    error: () => Swal.fire("Error", "No se pudo cargar la información", "error"),
  });
}

operObservacion(cotizacionID: number) {
  this.userService.getCotizacionesById(cotizacionID).subscribe({
    next: (res: any) => {
      this.selectedCotizaciones = res.data[0]; // solo objeto

      setTimeout(() => {
        const modalEl = document.getElementById("cotizacionModalComentario");
        if (modalEl) {
          const modal = new bootstrap.Modal(modalEl);
          modal.show();
        }
      }, 50);
    },
    error: () => Swal.fire("Error", "No se pudo cargar la información", "error"),
  });
}

openEstadoModal(cotizacionID: number) {
  this.userService.getCotizacionesById(cotizacionID).subscribe({
    next: (res: any) => {
      this.selectedCotizaciones = res.data[0]; // solo objeto

      setTimeout(() => {
        const modalEl = document.getElementById("modalEstadoCotizacion");
        if (modalEl) {
          const modal = new bootstrap.Modal(modalEl);
          modal.show();
        }
      }, 50);
    },
    error: () => Swal.fire("Error", "No se pudo cargar la información", "error"),
  });
}
guardarEstado() {
  const data = {
    ...this.selectedCotizaciones,
    usuarioModificacion: "Admin"
  };

  this.userService.updateCotizaciones(data).subscribe({
    next: () => {
      Swal.fire("¡Guardado!", "Estado actualizado correctamente.", "success").then(() => {

        // 👉 Cerrar modal
        const modalEl = document.getElementById("cotizacionModalComentario");
        const modal = bootstrap.Modal.getInstance(modalEl!);
        modal?.hide();

        // 👉 Limpiar la variable
        this.selectedCotizaciones = null;

        // 👉 Recargar toda la vista
        window.location.reload();
      });
    },
    error: () => {
      Swal.fire("Error", "No se pudo guardar el Estado", "error");
    }
  });
}

guardarObservacion() {
  const data = {
    ...this.selectedCotizaciones,
    usuarioModificacion: "Admin"
  };

  this.userService.updateCotizacionComentario(data).subscribe({
    next: () => {
      Swal.fire("¡Guardado!", "Observación registrada correctamente.", "success").then(() => {

        // 👉 Cerrar modal
        const modalEl = document.getElementById("cotizacionModalComentario");
        const modal = bootstrap.Modal.getInstance(modalEl!);
        modal?.hide();

        // 👉 Limpiar la variable
        this.selectedCotizaciones = null;

        // 👉 Recargar toda la vista
        window.location.reload();
      });
    },
    error: () => {
      Swal.fire("Error", "No se pudo guardar la observación", "error");
    }
  });
}





editServicio(cotizacionID: number) {
  const item = this.cotizaciones.find(c => c.cotizacionID === cotizacionID);
  this.selectedCotizaciones = { ...item, fotosUrls: item.fotosUrls || [] };

  const modalEl = document.getElementById("editServicioModal");
  if (modalEl) {
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }
}


  // Eliminar / desactivar servicio
  deleteServicio(cotizacionID: number) {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡El servicio será eliminado!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(result => {
      if (result.isConfirmed) {
        this.userService.deleteCotizaciones(cotizacionID).subscribe({
          next: () => {
            this.cotizaciones = this.cotizaciones.filter(s => s.cotizacionID !== cotizacionID);
            Swal.fire("Eliminado", "El servicio ha sido eliminado", "success");
          },
          error: err => Swal.fire("Error", "No se pudo eliminar el servicio", "error")
        });
      }
    });
  }

  submitEditServicio() {
    if (!this.selectedCotizaciones) return;

    const nuevoPrecio = Number(this.selectedCotizaciones.precioPorCubierto);

    // 👉 No modificamos precioPorCubierto original
    this.selectedCotizaciones.precioPorCubiertoConDescuento = nuevoPrecio;

    // 👉 Recalcular total
    const invitados = Number(this.selectedCotizaciones.numeroInvitados || 0);
    this.selectedCotizaciones.totalCotizacion = nuevoPrecio * invitados;

    // 👉 Agregar usuario que modifica
    this.selectedCotizaciones.usuarioModificacion = "Admin";

    // 👉 Llamar a UPDATE
    this.userService.updateCotizaciones(this.selectedCotizaciones)
      .subscribe({
        next: () => {
          Swal.fire("Éxito", "Descuento actualizado correctamente", "success")
            .then(() => {
              
              // 👉 Cerrar modal
              const modalEl = document.getElementById("editServicioModal");
              const modal = bootstrap.Modal.getInstance(modalEl!);
              modal?.hide();

              // 👉 Refrescar toda la vista
              window.location.reload();
            });
        },
        error: () => Swal.fire("Error", "No se pudo actualizar el Descuento", "error")
      });
  }


}
