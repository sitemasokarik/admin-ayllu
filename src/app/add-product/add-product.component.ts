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
    fotosUrls: [] as string[],
    categoriaID: 0,
    usuarioCreacion: "",
    estado: true
  };

  categories: any[] = []; // <-- Aquí guardaremos las categorías para el select
  imageUrl: string = "";

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
    this.userService.getAllAddProducto().subscribe({
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

    // Asegurar que fotosUrls sea un array
    this.product.fotosUrls = this.imageUrl ? [this.imageUrl] : [];

    this.userService.createProduct(this.product).subscribe({
      next: res => {
        console.log("RESPUESTA BACKEND:", res);

        if (res.success) {
          Swal.fire({
            icon: "success",
            title: "Producto creado",
            text: "El producto se ha creado con éxito",
            timer: 1500,
            showConfirmButton: false,
          }).then(() => this.router.navigate(['/products']));
        }
      },
      error: err => {
        console.error("Error creando producto:", err);
        Swal.fire("Error", err?.error?.message || "Error al crear producto", "error");
      }
    });
  }



  goToProducts(): void {
    this.router.navigate(['/products']);
  }
}
