import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, AfterViewChecked } from "@angular/core";
import { BreadcrumbComponent } from "../breadcrumb/breadcrumb.component";
import { RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { UserService } from "../../service/user.service";
import Swal from "sweetalert2";
import * as bootstrap from "bootstrap";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../service/auth.service";
import DataTable from 'datatables.net';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [BreadcrumbComponent, RouterLink, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent implements OnInit, AfterViewChecked {
  title = "Clientes";
  clients: any[] = [];
  selectedUser: any = null; // Usuario seleccionado para ver/editar
  passwords = { currentPassword: "", newPassword: "", confirmPassword: "" }; // Para cambio de contraseña
  dataTable: any; // Instancia de DataTable
  private dtInitialized = false; // Marca si DataTable ya se inicializó

  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  ngAfterViewChecked(): void {
    // Inicializamos DataTable solo una vez que hay datos
    if (!this.dtInitialized && this.clients.length > 0) {
      this.initDataTable();
      this.dtInitialized = true;
    }
  }

  loadClients(): void {
    this.userService.getAllClients().subscribe({
      next: (res: any) => {
        console.log("📌 Clientes cargados:", res);
        this.clients = res.data || [];

        // Si ya estaba inicializado, refrescar DataTable
        if (this.dataTable) {
          this.dataTable.clear().draw();
          this.dataTable.rows.add(this.clients).draw();
        }
      },
      error: err => {
        console.error("❌ Error al cargar Clientes", err);
      },
    });
  }

  initDataTable(): void {
    this.dataTable = new DataTable('#dataTable', {
      pageLength: 10,
      // Puedes agregar más opciones aquí si quieres
    });
  }
}
