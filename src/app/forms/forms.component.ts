import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { BreadcrumbComponent } from "../breadcrumb/breadcrumb.component";
import { CommonModule } from "@angular/common";
import { UserService } from "../../service/user.service";
import { AuthService } from "../../service/auth.service";
import { AdminTableShellComponent } from "../shared/admin-table/admin-table-shell.component";
import { AdminTableBodyDirective } from "../shared/admin-table/admin-table-body.directive";

@Component({
  selector: "app-forms",
  standalone: true,
  imports: [
    BreadcrumbComponent,
    CommonModule,
    AdminTableShellComponent,
    AdminTableBodyDirective,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: "./forms.component.html",
  styleUrl: "./forms.component.css",
})
export class FormsComponent implements OnInit {
  title = "Formulario Contacto";
  registrosClientes: any[] = [];
  loading = true;
  tableFilterFields = [
    "contactanosID",
    "nombreCompleto",
    "correo",
    "telefono",
    "servicio",
    "mensaje",
    "fechaCreacion",
  ];

  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadFormulario();
  }

  loadFormulario(): void {
    this.loading = true;

    this.userService.getAllFormulario().subscribe({
      next: (res: any) => {
        this.registrosClientes = res.data || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  trackByContactoId(_index: number, registro: { contactanosID: number }): number {
    return registro.contactanosID;
  }
}
