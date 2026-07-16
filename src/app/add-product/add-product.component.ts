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



  categories: any[] = [];

  fotoUploading = false;



  constructor(

    public userService: UserService,

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



  onFotoSelected(event: Event): void {

    const file = (event.target as HTMLInputElement).files?.[0];

    if (!file) return;



    this.fotoUploading = true;

    this.userService.uploadMedia(file, 'productos').subscribe({

      next: (res) => {

        const url = res?.data?.url || '';

        if (url) this.product.fotosUrls.push(url);

        this.fotoUploading = false;

        (event.target as HTMLInputElement).value = '';

      },

      error: (err) => {

        this.fotoUploading = false;

        Swal.fire('Error', err?.error?.message || 'No se pudo subir la imagen', 'error');

      }

    });

  }



  removeFotoUrl(index: number): void {

    this.product.fotosUrls.splice(index, 1);

  }

}

