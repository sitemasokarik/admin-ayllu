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

  selector: "app-locales",

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

  templateUrl: "./locales.component.html",

  styleUrl: "./locales.component.css",

})

export class LocalesComponent implements OnInit {



  title = "Locales";

  loading = true;

  tableFilterFields = ["localID", "nombre", "direccion", "capacidad"];



  locales: any[] = [];



  selectedLocal: any = null;

  fotoUploading = false;



  constructor(public userService: UserService, private authService: AuthService) {}



  ngOnInit(): void {

    this.loadLocales();

  }



  loadLocales(): void {

    this.loading = true;



    this.userService.getAllLocales().subscribe({

      next: (res: any) => {

        this.locales = res.data || [];

        this.loading = false;

      },

      error: () => {

        this.loading = false;

        Swal.fire("Error", "No se pudieron cargar los locales", "error");

      },

    });

  }



  private patchLocalInList(localID: number, patch: Record<string, unknown>): void {

    const index = this.locales.findIndex((l) => l.localID === localID);

    if (index >= 0) {

      this.locales[index] = { ...this.locales[index], ...patch };

      this.locales = [...this.locales];

    }

  }



  deleteLocal(localID: number): void {

    Swal.fire({

      title: "¿Estás seguro?",

      text: "¡El local será desactivado!",

      icon: "warning",

      showCancelButton: true,

      confirmButtonColor: "#d33",

      cancelButtonColor: "#3085d6",

      confirmButtonText: "Sí, desactivar",

      cancelButtonText: "Cancelar",

    }).then(result => {

      if (result.isConfirmed) {

        this.userService.deleteLocal(localID).subscribe({

          next: () => {

            this.patchLocalInList(localID, { estado: false });

            Swal.fire("Desactivado", "El local ahora está inactivo", "success");

          },

          error: () => Swal.fire("Error", "No se pudo desactivar el local", "error"),

        });

      }

    });

  }



  openLocalModal(local: any) {

    this.selectedLocal = null;



    this.userService.getLocalById(local.localID).subscribe({

      next: res => {

        const data = res.data || {};

        this.selectedLocal = {

          ...data,

          fotosUrls: (data.fotosUrls || []).map((u: string) => this.userService.resolveMediaUrl(u)),

        };



        const modalEl = document.getElementById("localModal");

        if (modalEl) new bootstrap.Modal(modalEl).show();

      },

      error: () => Swal.fire("Error", "No se pudo cargar el local", "error"),

    });

  }



  editLocal(local: any) {

    this.selectedLocal = null;



    this.userService.getLocalById(local.localID).subscribe({

      next: res => {

        const data = res.data || {};

        this.selectedLocal = {

          ...data,

          fotosUrls: data.fotosUrls?.length ? [...data.fotosUrls] : [],

        };



        const modalEl = document.getElementById("editLocalModal");

        if (modalEl) new bootstrap.Modal(modalEl).show();

      },

      error: () => Swal.fire("Error", "No se pudo cargar la información", "error")

    });

  }



  onFotoSelected(event: Event): void {

    const file = (event.target as HTMLInputElement).files?.[0];

    if (!file || !this.selectedLocal) return;



    this.fotoUploading = true;

    this.userService.uploadMedia(file, 'locales').subscribe({

      next: (res) => {

        const url = res?.data?.url;

        if (url) {

          if (!this.selectedLocal.fotosUrls) this.selectedLocal.fotosUrls = [];

          this.selectedLocal.fotosUrls.push(url);

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

    this.selectedLocal?.fotosUrls?.splice(index, 1);

  }



  submitEditLocal() {

    if (!this.selectedLocal) return;



    const loggedUser = this.authService.getUser();



    const updateData = {

      localID: Number(this.selectedLocal.localID),

      nombre: this.selectedLocal.nombre,

      direccion: this.selectedLocal.direccion,

      capacidad: this.selectedLocal.capacidad,

      precioAlquiler: this.selectedLocal.precioAlquiler,

      garantia: Number(this.selectedLocal.garantia) || 0,

      horasEvento: this.selectedLocal.horasEvento,

      fotosUrls: this.selectedLocal.fotosUrls,

      terminosCondiciones: this.selectedLocal.terminosCondiciones,

      usuarioModificacion: loggedUser?.userName || "Admin",

    };



    this.userService.updateLocal(updateData).subscribe({

      next: () => {

        this.patchLocalInList(updateData.localID, updateData);

        Swal.fire("Actualizado", "Local modificado correctamente", "success");

        this.closeEditLocalModal();

      },

      error: () => Swal.fire("Error", "No se pudo actualizar el local", "error"),

    });

  }



  closeEditLocalModal() {

    const modalEl = document.getElementById("editLocalModal");

    if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();

  }



  trackByLocalId(_index: number, local: { localID: number }): number {

    return local.localID;

  }

}

