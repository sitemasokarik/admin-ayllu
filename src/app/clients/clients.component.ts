import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

import { BreadcrumbComponent } from "../breadcrumb/breadcrumb.component";

import { CommonModule } from "@angular/common";

import { UserService } from "../../service/user.service";

import { AdminTableShellComponent } from "../shared/admin-table/admin-table-shell.component";

import { AdminTableBodyDirective } from "../shared/admin-table/admin-table-body.directive";



@Component({

  selector: 'app-clients',

  standalone: true,

  imports: [

    BreadcrumbComponent,

    CommonModule,

    AdminTableShellComponent,

    AdminTableBodyDirective,

  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  templateUrl: './clients.component.html',

  styleUrl: './clients.component.css'

})

export class ClientsComponent implements OnInit {

  title = "Clientes";

  clients: any[] = [];

  loading = true;

  tableFilterFields = ["clienteID", "nombreCompleto", "numeroDocumento", "email", "telefono"];



  selectedClient: any = null;

  clientCotizaciones: any[] = [];

  loadingCotizaciones = false;



  constructor(private userService: UserService) {}



  ngOnInit(): void {

    this.loadFormulario();

  }



  loadFormulario(): void {

    this.loading = true;



    this.userService.getAllClients().subscribe({

      next: (res: any) => {

        this.clients = res.data || [];

        this.loading = false;

      },

      error: () => {

        this.loading = false;

      },

    });

  }



  verCotizaciones(cliente: any): void {

    this.selectedClient = cliente;

    this.loadingCotizaciones = true;

    this.clientCotizaciones = [];



    this.userService.getClienteCotizaciones(cliente.clienteID).subscribe({

      next: (res: any) => {

        this.clientCotizaciones = res?.data || [];

        this.loadingCotizaciones = false;

      },

      error: () => {

        this.loadingCotizaciones = false;

      },

    });

  }



  cerrarDetalle(): void {

    this.selectedClient = null;

    this.clientCotizaciones = [];

  }



  tieneCuentaPortal(cliente: any): boolean {

    if (cliente?.tieneCuentaPortal === true || cliente?.tieneCuentaPortal === 1) {

      return true;

    }



    return (cliente?.esPortalActivo === true || cliente?.esPortalActivo === 1)

      && !!cliente?.userNamePortal;

  }



  trackByClienteId(_index: number, cliente: { clienteID: number }): number {

    return cliente.clienteID;

  }

}


