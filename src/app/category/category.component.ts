import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

import { BreadcrumbComponent } from "../breadcrumb/breadcrumb.component";

import { RouterLink } from "@angular/router";

import { CommonModule } from "@angular/common";

import { UserService } from "../../service/user.service";

import Swal from "sweetalert2";

import * as bootstrap from "bootstrap";

import { FormsModule } from "@angular/forms";

import { AuthService } from "../../service/auth.service";

import { AdminTableShellComponent } from "../shared/admin-table/admin-table-shell.component";

import { AdminTableBodyDirective } from "../shared/admin-table/admin-table-body.directive";



@Component({

  selector: "app-category",

  standalone: true,

  imports: [

    BreadcrumbComponent,

    RouterLink,

    CommonModule,

    FormsModule,

    AdminTableShellComponent,

    AdminTableBodyDirective,

  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  templateUrl: "./category.component.html",

  styleUrl: "./category.component.css",

})

export class CategoryComponent implements OnInit {

  title = "Categorías";

  loading = true;



  categorys: any[] = [];

  selectedCategory: any = null;

  tableFilterFields = ["categoriaID", "nombre", "descripcion"];



  constructor(

    private userService: UserService,

    private authService: AuthService

  ) {}



  ngOnInit(): void {

    this.loadCategorys();

  }



  loadCategorys(): void {

    this.loading = true;



    this.userService.getAllCategorysG().subscribe({

      next: (res: any) => {

        this.categorys = res.data || [];

        this.loading = false;

      },

      error: () => {

        this.loading = false;

        Swal.fire("Error", "No se pudieron cargar las categorías", "error");

      },

    });

  }



  deleteCategory(categoriaID: number): void {

    Swal.fire({

      title: "¿Estás seguro?",

      text: "¡La categoría será desactivada!",

      icon: "warning",

      showCancelButton: true,

      confirmButtonColor: "#d33",

      cancelButtonColor: "#3085d6",

      confirmButtonText: "Sí, desactivar",

      cancelButtonText: "Cancelar",

    }).then(result => {

      if (result.isConfirmed) {

        this.userService.deleteCategory(categoriaID).subscribe({

          next: () => {

            const category = this.categorys.find((c) => c.categoriaID === categoriaID);

            if (category) {

              category.estado = false;

              this.categorys = [...this.categorys];

            }



            Swal.fire({

              icon: "success",

              title: "Categoría desactivada",

              timer: 1500,

              showConfirmButton: false,

            });

          },

          error: err => {

            console.error("Error desactivando categoría", err);

            Swal.fire("Error", err?.error?.message || "No se pudo desactivar", "error");

          },

        });

      }

    });

  }



  openCategoryModal(category: any) {

    this.selectedCategory = null;



    this.userService.getCategoryById(category.categoriaID).subscribe({

      next: (res: any) => {

        console.log("ID", res);

        this.selectedCategory = res.data;



        const modalEl = document.getElementById("categoryModal");

        if (modalEl) new bootstrap.Modal(modalEl).show();

      },

      error: err => {

        console.error("Error cargando categoría:", err);

        Swal.fire("Error", "No se pudo cargar la categoría", "error");

      },

    });

  }



  editCategory(category: any) {

    this.selectedCategory = null;



    this.userService.getCategoryById(category.categoriaID).subscribe({

      next: (res: any) => {

        console.log("ID CATE", res);



        const fullRecord = this.categorys.find(c => c.categoriaID === category.categoriaID);



        if (fullRecord) {

          this.selectedCategory = { ...fullRecord, ...res.data };

        } else {

          this.selectedCategory = res.data;

        }



        console.log("📌 Datos completos para editar:", this.selectedCategory);



        const modalEl = document.getElementById("editCategoryModal");

        if (modalEl) new bootstrap.Modal(modalEl).show();

      },

      error: err => {

        console.error("Error obteniendo categoría:", err);

        Swal.fire("Error", "No se pudo cargar la categoría", "error");

      },

    });

  }



  submitEditCategory() {

    if (!this.selectedCategory) return;



    const loggedUser = this.authService.getUser();



    let categoriaPadreID = this.selectedCategory.categoriaPadreID;



    if (categoriaPadreID === undefined || categoriaPadreID === "")

      categoriaPadreID = 0;



    const updateData = {

      categoriaID: Number(this.selectedCategory.categoriaID),

      categoriaPadreID,

      nombre: this.selectedCategory.nombre.trim(),

      descripcion: this.selectedCategory.descripcion?.trim(),

      limite: Number(this.selectedCategory.limite) || 0,

      nivel: this.selectedCategory.nivel ?? 0,

      orden: this.selectedCategory.orden ?? 0,

      icono: this.selectedCategory.icono ?? null,

      usuarioModificacion: loggedUser?.userName || "Admin",

    };



    console.log("📤 Datos enviados a actualización:", updateData);



    this.userService.updateCategory(updateData).subscribe({

      next: () => {

        const index = this.categorys.findIndex((c) => c.categoriaID === updateData.categoriaID);

        if (index >= 0) {

          this.categorys[index] = { ...this.categorys[index], ...updateData };

          this.categorys = [...this.categorys];

        }

        Swal.fire("Éxito", "Categoría actualizada", "success");

        this.closeEditCategoryModal();

      },

      error: err => {

        console.error("Error actualizando categoría:", err);

        Swal.fire("Error", "No se pudo actualizar", "error");

      },

    });

  }



  closeEditCategoryModal() {

    const modalEl = document.getElementById("editCategoryModal");

    if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();

  }



  trackByCategoriaId(_index: number, category: { categoriaID: number }): number {

    return category.categoriaID;

  }

}


