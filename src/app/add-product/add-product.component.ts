import { Component, OnInit } from "@angular/core";
import { BreadcrumbComponent } from "../breadcrumb/breadcrumb.component";
import { UserService } from "../../service/user.service";
import { AuthService } from "../../service/auth.service";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import Swal from "sweetalert2";

@Component({
  selector: 'app-add-product',
  imports: [BreadcrumbComponent, CommonModule, FormsModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  title: string = "Agregar Producto";

  product = {
    productoID: 0,
    nombre: "",
    descripcion: "",
    precio: 0,
    precioCosto: 0,
    imagenUrl: "",
    categoriaID: 0,
    usuarioCreacion: "",
    estado: true
  };

  categories: any[] = []; // <-- Aquí guardaremos las categorías para el select

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {
    const user = this.authService.getUser();
    this.product.usuarioCreacion = user?.nombre || "admin";
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.userService.getAllCategorys().subscribe({
      next: (res: any) => {
        this.categories = res.data || [];
      },
      error: err => {
        console.error("Error cargando categorías:", err);
        Swal.fire("Error", "No se pudieron cargar las categorías", "error");
      }
    });
  }

  saveProduct(): void {
    if (!this.product.nombre || !this.product.descripcion || !this.product.precio || !this.product.categoriaID) {
      Swal.fire({
        icon: "error",
        title: "Campos incompletos",
        text: "Por favor, completa todos los campos obligatorios",
      });
      return;
    }

    this.userService.createProduct(this.product).subscribe({
      next: res => {
        if (res.success) {
          Swal.fire({
            icon: "success",
            title: "Producto creado",
            text: "El producto se ha creado con éxito",
            timer: 1500,
            showConfirmButton: false,
          }).then(() => this.router.navigate(['/products']));
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: res.message || "Error al crear producto",
          });
        }
      },
      error: err => {
        console.error("Error creando producto:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err?.error?.message || "Error al crear producto",
        });
      },
    });
  }

  goToProducts(): void {
    this.router.navigate(['/products']);
  }
}
