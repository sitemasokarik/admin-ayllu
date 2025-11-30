import { Component, OnInit, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { BreadcrumbComponent } from "../breadcrumb/breadcrumb.component";
import { RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { UserService } from "../../service/user.service";
import { FormsModule } from "@angular/forms";
import DataTable from 'datatables.net';
import { AuthService } from "../../service/auth.service";

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [BreadcrumbComponent, RouterLink, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent implements OnInit {

  title = "Clientes";
  dt: any;
  clients: any[] = [];

  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.userService.getAllClients().subscribe({
      next: (res: any) => {
        this.clients = res.data || [];
        console.log("📌 Clientes cargados:", this.clients);

        // 🟢 Espera a que Angular renderice la tabla, luego inicializa DataTable
        setTimeout(() => {
          if (this.dt) {
            this.dt.destroy();
          }
          this.dt = new DataTable('#dataTable');
        }, 50);
      },
      error: err => {
        console.error("❌ Error al cargar Clientes", err);
      }
    });
  }
}
