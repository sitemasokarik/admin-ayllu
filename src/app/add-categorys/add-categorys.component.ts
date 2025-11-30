import { Component } from "@angular/core";
import { BreadcrumbComponent } from "../breadcrumb/breadcrumb.component";
import { UserService } from "../../service/user.service";
import { AuthService } from "../../service/auth.service";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import Swal from "sweetalert2";

@Component({
  selector: 'app-add-categorys',
  imports: [BreadcrumbComponent, CommonModule, FormsModule],
  templateUrl: './add-categorys.component.html',
  styleUrls: ['./add-categorys.component.css']
})
export class AddCategorysComponent {
  title: string = "Agregar Categoría";

  // Modelo de categoría para el formulario
  category = {
    nombre: "",
    descripcion: "",
    usuarioCreacion: ""
  };

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {
    // Asignamos automáticamente el nombre del usuario logueado
    const user = this.authService.getUser();
    this.category.usuarioCreacion = user?.nombre || "admin";
  }

  // Método para guardar categoría
  saveCategory(): void {
    if (!this.category.nombre || !this.category.descripcion) {
      Swal.fire({
        icon: "error",
        title: "Campos incompletos",
        text: "Por favor, completa todos los campos obligatorios",
      });
      return;
    }

    // Llamada al servicio para crear categoría
    this.userService.createCategory(this.category).subscribe({
      next: res => {
        if (res.success) {
          Swal.fire({
            icon: "success",
            title: "Categoría creada",
            text: "La categoría se ha creado con éxito",
            timer: 1500,
            showConfirmButton: false,
          }).then(() => this.goToCategories());
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: res.message || "Error al crear categoría",
          });
        }
      },
      error: err => {
        console.error("Error creando categoría:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err?.error?.message || "Error al crear categoría",
        });
      },
    });
  }

  goToCategories(): void {
    this.router.navigate(["/categorys"]);
  }
}
