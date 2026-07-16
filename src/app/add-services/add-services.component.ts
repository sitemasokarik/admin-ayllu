import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
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
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './add-services.component.html',
  styleUrls: ['./add-services.component.css']
})
export class AddServicesComponent {

  title: string = "Agregar Servicio";

  servicio: any = {
    nombre: "",
    descripcion: "",
    precio: 0,
    cantidadMinima: 1,
    fotosUrls: [] as string[],
    usuarioCreacion: "desconocido",
    estado: true
  };

  fotoUploading = false;

  constructor(
    public userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.servicio.usuarioCreacion = this.authService.getUser()?.username || "desconocido";
  }

  onFotoSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.fotoUploading = true;
    this.userService.uploadMedia(file, 'servicios').subscribe({
      next: (res) => {
        const url = res?.data?.url;
        if (url) this.servicio.fotosUrls.push(url);
        this.fotoUploading = false;
        (event.target as HTMLInputElement).value = '';
      },
      error: (err) => {
        this.fotoUploading = false;
        Swal.fire('Error', err?.error?.message || 'No se pudo subir la imagen', 'error');
      },
    });
  }

  removeFotoUrl(index: number): void {
    this.servicio.fotosUrls.splice(index, 1);
  }

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
        console.error("Error creando servicio:", err);
        Swal.fire("Error", err?.error?.message || "Error al crear servicio", "error");
      }
    });
  }

  cancel(): void {
    this.router.navigate(["/services"]);
  }
}
