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
  selector: 'app-events',
  standalone: true,
  imports: [BreadcrumbComponent, RouterLink, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent {
  title = "Eventos";
  loading = true;

  eventos: any[] = [];
  dataTable: any = null;
  selectedEvento: any = null;
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

      this.userService.getAllEventos().subscribe({
        next: (res: any) => {
          console.log("Eventos cargados:", res);
          this.eventos = res.data || [];
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
    
    openServicioModal(evento: any) {
      this.selectedEvento = null;

      this.userService.getServicioById(evento.servicioID).subscribe({
        next: (res: any) => {
          this.selectedEvento = res.data;

          const modalEl = document.getElementById("servicioModal");
          if (modalEl) new bootstrap.Modal(modalEl).show();
        },
        error: () => Swal.fire("Error", "No se pudo cargar el servicio", "error")
      });
    }   
    
    editServicio(evento: any) {
      this.selectedEvento = null;

      this.userService.getEventoById(evento.eventoID).subscribe({
        next: (res: any) => {
          this.selectedEvento = res.data;

          const modalEl = document.getElementById("editServicioModal");
          if (modalEl) new bootstrap.Modal(modalEl).show();
        },
        error: () => Swal.fire("Error", "No se pudo cargar la información", "error")
      });
    }    

    deleteEvento(eventoID: number) {
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
          this.userService.deleteEvento(eventoID).subscribe({
            next: () => {
              this.loadEventos();
              Swal.fire("Eliminado", "Evento eliminado correctamente", "success");
            },
            error: () => Swal.fire("Error", "No se pudo eliminar el Evento", "error"),
          });
        }
      });
    }   
    
    submitEditServicio() {
      if (!this.selectedEvento) return;

      const user = this.authService.getUser();

      this.selectedEvento.usuarioModificacion =
        user?.username || "Administrador";

      this.userService.updateServicio(this.selectedEvento).subscribe({
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
}
