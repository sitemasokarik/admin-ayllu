import { Component } from "@angular/core";
import { BreadcrumbComponent } from "../breadcrumb/breadcrumb.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { UserService } from "../../service/user.service";
import { AuthService } from "../../service/auth.service";
import Swal from "sweetalert2";
import { resolveMenuDisplayName } from "../config/menu.config";

@Component({
  selector: 'app-add-permiso-rol',
  standalone: true,
  imports: [BreadcrumbComponent, CommonModule, FormsModule],
  templateUrl: './add-permiso-rol.component.html',
  styleUrl: './add-permiso-rol.component.css'
})
export class AddPermisoRolComponent {
 
  title: string = "Generar Permiso Rol";

  rol: any = {
    nombre: "",
    descripcion: "",
    usuarioCreacion: "Admin"
  };

  product = {
    rolID: 0,
    paginaID: 0,
    puedeVer: true,
    puedeCrear: true,
    puedeEditar: true,
    puedeEliminar: true,
    usuarioCreacion: "Admin",
  };

  pagina = {
    paginaID: 0,
    nombre: "",
    descripcion: "",
    usuarioCreacion: "Admin",
  }; 
  
  createpermiso: any = {
    rolID: 0,
    paginaID: 0,
    puedeVer: true,
    puedeCrear: true,
    puedeEditar: true,
    puedeEliminar: true,
    usuarioCreacion: "Admin",
  };

  categories: any[] = []; 
  pages: any[] = []; 

  newFotoUrl: string = "";

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.rol.usuarioCreacion = this.authService.getUser()?.username || "desconocido";
    this.loadRoles();
    this.loadPaginas();
  }
  
  loadRoles(): void {
    this.userService.getAllRoles().subscribe({
      next: (res: any) => {
        this.categories = res.data || [];
      },
      error: err => {
        console.error("Error cargando Roles:", err);
        Swal.fire("Error", "No se pudieron cargar las Roles", "error");
      }
    });
  }

  loadPaginas(): void {
    this.userService.getAllPages().subscribe({
      next: (res: any) => {
        this.pages = res.data || [];
      },
      error: err => {
        console.error("Error cargando Paginas:", err);
        Swal.fire("Error", "No se pudieron cargar las Paginas", "error");
      }
    });
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

  paginaLabel(pag: { nombre?: string; url?: string }): string {
    return resolveMenuDisplayName(pag.url ?? '', pag.nombre ?? '');
  }

  // Guardar local
  savePermiso(): void {
    if (!this.product.rolID || !this.pagina.paginaID) {
      Swal.fire("Campos incompletos", "Por favor, completa los campos obligatorios", "error");
      return;
    }

    // Aquí llenas createpermiso con lo seleccionado
    this.createpermiso = {
      rolID: this.product.rolID,
      paginaID: this.pagina.paginaID,
      puedeVer: true,
      puedeCrear: true,
      puedeEditar: true,
      puedeEliminar: true,
      usuarioCreacion: this.authService.getUser()?.username || "Admin"
    };

    this.userService.createPermiso(this.createpermiso).subscribe({
      next: res => {
        if (res.success) {
          Swal.fire({
            icon: "success",
            title: "Permiso creado",
            text: "El Permiso se ha creado con éxito",
            timer: 1500,
            showConfirmButton: false
          }).then(() => this.router.navigate(["/permisos"]));
        } else {
          Swal.fire("Error", res.message || "No se pudo crear el Permiso", "error");
        }
      },
      error: err => {
        console.error("Error creando permiso:", err);
        Swal.fire("Error", err?.error?.message || "Error al crear el permiso", "error");
      }
    });
  }


  cancel(): void {
    this.router.navigate(["/permisos"]);
  }



}
