import { Component } from "@angular/core";
import { BreadcrumbComponent } from "../breadcrumb/breadcrumb.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { UserService } from "../../service/user.service";
import { AuthService } from "../../service/auth.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-add-rol',
  standalone: true,
  imports: [BreadcrumbComponent, CommonModule, FormsModule],
  templateUrl: './add-rol.component.html',
  styleUrl: './add-rol.component.css'
})
export class AddRolComponent {

  title: string = "Agregar Rol";

  rol: any = {
    nombre: "",
    descripcion: "",
    usuarioCreacion: "Admin"
  };

  newFotoUrl: string = "";

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.rol.usuarioCreacion = this.authService.getUser()?.username || "desconocido";
  }

  addFotoUrl(): void {
    if (this.newFotoUrl.trim()) {
      this.rol.fotosUrls.push(this.newFotoUrl.trim());
      this.newFotoUrl = "";
    }
  }

  removeFotoUrl(index: number): void {
    this.rol.fotosUrls.splice(index, 1);
  }

  // Guardar local
  saveRol(): void {
    if (!this.rol.nombre || !this.rol.descripcion) {
      Swal.fire("Campos incompletos", "Por favor, completa los campos obligatorios", "error");
      return;
    }

    this.userService.createRol(this.rol).subscribe({
      next: res => {
        if (res.success) {
          Swal.fire({
            icon: "success",
            title: "Servicio creado",
            text: "El Servicio se ha creado con éxito",
            timer: 1500,
            showConfirmButton: false
          }).then(() => this.router.navigate(["/roles"]));
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
    this.router.navigate(["/roles"]);
  }
}
