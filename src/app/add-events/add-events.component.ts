import { Component } from "@angular/core";
import { BreadcrumbComponent } from "../breadcrumb/breadcrumb.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { UserService } from "../../service/user.service";
import { AuthService } from "../../service/auth.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-add-events',
  standalone: true,
  imports: [BreadcrumbComponent, CommonModule, FormsModule],
  templateUrl: './add-events.component.html',
  styleUrl: './add-events.component.css'
})
export class AddEventsComponent {
  title: string = "Agregar Evento";

  servicio: any = {
    nombre: "",
    descripcion: "",
    precio: 0,
    fotosUrls: [] as string[],
    usuarioCreacion: "Admin",
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

    const payload = {
      nombre: this.servicio.nombre,
      descripcion: this.servicio.descripcion,
      fotos: this.servicio.fotosUrls[0] || '',
      estadoEvento: this.servicio.estado === true ? "Activo" : "Inactivo",
      usuarioCreacion: this.servicio.usuarioCreacion
    };

    this.userService.createEvento(payload).subscribe({
      next: res => {
        if (res.success) {
          Swal.fire({
            icon: "success",
            title: "Evento creado",
            text: "El evento se ha creado con éxito",
            timer: 1500,
            showConfirmButton: false
          }).then(() => this.router.navigate(["/events"]));
        } else {
          Swal.fire("Error", res.message || "No se pudo crear el evento", "error");
        }
      },
      error: err => {
        console.error("Error creando evento:", err);
        Swal.fire("Error", err?.error?.message || "Error al crear evento", "error");
      }
    });
  }


  cancel(): void {
    this.router.navigate(["/events"]);
  }
}
