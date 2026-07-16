import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { BreadcrumbComponent } from "../breadcrumb/breadcrumb.component";
import { UserService } from "../../service/user.service";
import { AuthService } from "../../service/auth.service";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import Swal from "sweetalert2";

@Component({
  selector: 'app-add-local',
  standalone: true,
  imports: [BreadcrumbComponent, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './add-local.component.html',
  styleUrls: ['./add-local.component.css']
})
export class AddLocalComponent {
  title: string = "Agregar Local";

  // Modelo para el formulario de Local
  local = {
    nombre: "",
    direccion: "",
    capacidad: 0,
    precioAlquiler: 0,
    garantia: 0,
    horasEvento: 0,
    fotosUrls: [] as string[],
    terminosCondiciones: "",
    estado: true
  };

  fotoUploading = false;

  constructor(
    public userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  onFotoSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.fotoUploading = true;
    this.userService.uploadMedia(file, 'locales').subscribe({
      next: (res) => {
        const url = res?.data?.url;
        if (url) this.local.fotosUrls.push(url);
        this.fotoUploading = false;
      },
      error: (err) => {
        this.fotoUploading = false;
        Swal.fire('Error', err?.error?.message || 'No se pudo subir la imagen', 'error');
      }
    });
  }

  // Quitar foto del array
  removeFotoUrl(index: number): void {
    this.local.fotosUrls.splice(index, 1);
  }

  // Guardar local
  saveLocal(): void {
    if (!this.local.nombre || !this.local.direccion) {
      Swal.fire("Campos incompletos", "Por favor, completa los campos obligatorios", "error");
      return;
    }

    this.userService.createLocal(this.local).subscribe({
      next: res => {
        if (res.success) {
          Swal.fire({
            icon: "success",
            title: "Local creado",
            text: "El local se ha creado con éxito",
            timer: 1500,
            showConfirmButton: false
          }).then(() => this.router.navigate(["/locales"]));
        } else {
          Swal.fire("Error", res.message || "No se pudo crear el local", "error");
        }
      },
      error: err => {
        console.error("Error creando local:", err);
        Swal.fire("Error", err?.error?.message || "Error al crear local", "error");
      }
    });
  }

  cancel(): void {
    this.router.navigate(["/locales"]);
  }
}
