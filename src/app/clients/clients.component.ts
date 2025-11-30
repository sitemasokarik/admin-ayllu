import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { BreadcrumbComponent } from "../breadcrumb/breadcrumb.component";
import { RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { UserService } from "../../service/user.service";
import Swal from "sweetalert2";
import * as bootstrap from "bootstrap";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../service/auth.service";

@Component({
  selector: 'app-clients',
	standalone: true,
	imports: [BreadcrumbComponent, RouterLink, CommonModule, FormsModule],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})

export class ClientsComponent {
  title = "Clientes";
 
  clients: any[] = [];
  selectedUser: any = null; // Usuario seleccionado para ver/editar
  passwords = { currentPassword: "", newPassword: "", confirmPassword: "" }; // Para cambio de contraseña

  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadCategorys();
  }

  loadCategorys(): void {
    this.userService.getAllClients().subscribe({
      next: (res: any) => {
        console.log("📌 Clientes cargados:", res);
        this.clients = res.data || [];
      },
      error: err => {
        console.error("❌ Error al cargar Clientes", err);
      },
    });
  }
}
