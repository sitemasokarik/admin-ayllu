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
  selector: 'app-forms',
	standalone: true,
	imports: [BreadcrumbComponent, RouterLink, CommonModule, FormsModule],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.css'
})
export class FormsComponent {
    title = "Formulario Contacto";
  registrosClientes: any[] = [];
  loading: boolean = true;
  
  selectedUser: any = null; // Usuario seleccionado para ver/editar
  passwords = { currentPassword: "", newPassword: "", confirmPassword: "" }; // Para cambio de contraseña
  dataTable: any; // Instancia de DataTable
  private dtInitialized = false; // Marca si DataTable ya se inicializó

  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadFormulario();
  }

 initOrRefreshTable() {
  setTimeout(() => {
    if (!document.querySelector('#dataTable')) return;

    this.dataTable = new DataTable('#dataTable', {
      pageLength: 10,
    });
  }, 100);
}


loadFormulario(): void {
  this.loading = true;

  if (this.dataTable) {
    this.dataTable.destroy();
    this.dataTable = null;
  }

  this.userService.getAllFormulario().subscribe({
    next: (res: any) => {
      this.registrosClientes = res.data || [];

      setTimeout(() => {
        this.loading = false;
        this.initOrRefreshTable();
      }, 150);
    },
    error: err => {
      console.error('❌ Error al cargar Formulario', err);
      this.loading = false;
    },
  });
}
 
}
