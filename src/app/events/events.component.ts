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
import {
  parseEventoTarifas,
  serializeEventoTarifas,
  defaultTarifasForEvento,
} from '../shared/evento-pricing.util';



@Component({

  selector: 'app-events',

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

  templateUrl: './events.component.html',

  styleUrl: './events.component.css'

})

export class EventsComponent {

  title = "Eventos";

  loading = true;

  tableFilterFields = ["eventoID", "nombre", "descripcion"];



  eventos: any[] = [];

  selectedEvento: any = null;

  fotoUploading = false;



  constructor(public userService: UserService, private authService: AuthService) {}



  ngOnInit(): void {

    this.loadEventos();

  }



  loadEventos(): void {

    this.loading = true;



    this.userService.getAllEventos().subscribe({

      next: (res: any) => {

        this.eventos = res.data || [];

        this.loading = false;

      },

      error: () => {

        this.loading = false;

        Swal.fire("Error", "No se pudieron cargar los eventos", "error");

      },

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

        const data = res.data || {};

        const tarifasConfig = parseEventoTarifas(
          data.tarifasInvitadoJson ?? data.TarifasInvitadoJson,
          data.nombre,
        );

        this.selectedEvento = {

          ...data,

          fotosUrls: data.fotosUrls?.length

            ? [...data.fotosUrls]

            : data.fotos

              ? data.fotos.split(';').filter(Boolean)

              : [],

          tarifasConfig,

        };



        const modalEl = document.getElementById("editServicioModal");

        if (modalEl) new bootstrap.Modal(modalEl).show();

      },

      error: () => Swal.fire("Error", "No se pudo cargar la información", "error")

    });

  }



  onFotoSelected(event: Event): void {

    const file = (event.target as HTMLInputElement).files?.[0];

    if (!file || !this.selectedEvento) return;



    this.fotoUploading = true;

    this.userService.uploadMedia(file, 'eventos').subscribe({

      next: (res) => {

        const url = res?.data?.url;

        if (url) {

          if (!this.selectedEvento.fotosUrls) this.selectedEvento.fotosUrls = [];

          this.selectedEvento.fotosUrls.push(url);

        }

        this.fotoUploading = false;

        (event.target as HTMLInputElement).value = '';

      },

      error: (err) => {

        this.fotoUploading = false;

        Swal.fire('Error', err?.error?.message || 'No se pudo subir la imagen', 'error');

      }

    });

  }



  removeFotoUrl(index: number): void {

    this.selectedEvento?.fotosUrls?.splice(index, 1);

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

            this.eventos = this.eventos.filter((e) => e.eventoID !== eventoID);

            Swal.fire("Eliminado", "Evento eliminado correctamente", "success");

          },

          error: () => Swal.fire("Error", "No se pudo eliminar el Evento", "error"),

        });

      }

    });

  }



  submitEditServicio() {

    if (!this.selectedEvento) return;

    if (!this.selectedEvento.tarifasConfig) {
      this.selectedEvento.tarifasConfig = defaultTarifasForEvento(this.selectedEvento.nombre);
    }

    const user = this.authService.getUser();



    const updateData = {

      eventoID: this.selectedEvento.eventoID,

      nombre: this.selectedEvento.nombre,

      descripcion: this.selectedEvento.descripcion,

      fotosUrls: this.selectedEvento.fotosUrls || [],

      tarifasInvitadoJson: serializeEventoTarifas(this.selectedEvento.tarifasConfig),

      estadoEvento: this.selectedEvento.estadoEvento || (this.selectedEvento.estado ? 'Activo' : 'Inactivo'),

      usuarioModificacion: user?.username || "Administrador",

    };



    this.userService.updateEvento(updateData).subscribe({

      next: () => {

        const index = this.eventos.findIndex((e) => e.eventoID === updateData.eventoID);

        if (index >= 0) {

          this.eventos[index] = { ...this.eventos[index], ...updateData };

          this.eventos = [...this.eventos];

        }

        Swal.fire("Actualizado", "Evento modificado correctamente", "success");

        this.closeEditServicioModal();

      },

      error: () => Swal.fire("Error", "No se pudo actualizar el evento", "error")

    });

  }



  closeEditServicioModal() {

    const modalEl = document.getElementById("editServicioModal");

    if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();

  }



  trackByEventoId(_index: number, evento: { eventoID: number }): number {

    return evento.eventoID;

  }

  addTarifaTier(): void {
    if (!this.selectedEvento?.tarifasConfig) return;
    this.selectedEvento.tarifasConfig.tarifas.push({ minInvitados: 0, precioPorInvitado: 0 });
  }

  removeTarifaTier(index: number): void {
    this.selectedEvento?.tarifasConfig?.tarifas.splice(index, 1);
  }

  resetTarifasDefault(): void {
    if (!this.selectedEvento) return;
    this.selectedEvento.tarifasConfig = defaultTarifasForEvento(this.selectedEvento.nombre);
  }

  trackByTarifaIndex(index: number): number {
    return index;
  }

}

