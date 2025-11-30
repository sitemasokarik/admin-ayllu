import { Component } from "@angular/core";
import { BreadcrumbComponent } from "../breadcrumb/breadcrumb.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { UserService } from "../../service/user.service";
import { AuthService } from "../../service/auth.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-add-services',
  standalone: true,
  imports: [BreadcrumbComponent, CommonModule, FormsModule],
  templateUrl: './add-services.component.html',
  styleUrls: ['./add-services.component.css']
})
export class AddServicesComponent {

  title: string = "Agregar Servicio";

  servicio: any = {
    nombre: "",
    descripcion: "",
    precio: 0,
    fotosUrls: [] as string[],
    usuarioCreacion: "desconocido",
    estado: true
  };

  newFotoUrl: string = "";

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.servicio.usuarioCreacion = this.authService.getUser()?.username || "desconocido";
  }

  addFotoUrl(): void {
    if (this.newFotoUrl.trim()) {
      this.servicio.fotosUrls.push(this.newFotoUrl.trim());
      this.newFotoUrl = "";
    }
  }

  removeFotoUrl(index: number): void {
    this.servicio.fotosUrls.splice(index, 1);
  }

  // Guardar local
  saveServicio(): void {
    if (!this.servicio.nombre || !this.servicio.descripcion) {
      Swal.fire("Campos incompletos", "Por favor, completa los campos obligatorios", "error");
      return;
    }

    this.userService.createServicio(this.servicio).subscribe({
      next: res => {
        if (res.success) {
          Swal.fire({
            icon: "success",
            title: "Servicio creado",
            text: "El Servicio se ha creado con éxito",
            timer: 1500,
            showConfirmButton: false
          }).then(() => this.router.navigate(["/services"]));
        } else {
          Swal.fire("Error", res.message || "No se pudo crear el Servicio", "error");
        }
      },
      error: err => {
        console.error("Error creando local:", err);
        Swal.fire("Error", err?.error?.message || "Error al crear local", "error");
      }
    });
  }

  cancel(): void {
    this.router.navigate(["/servicios"]);
  }
}
