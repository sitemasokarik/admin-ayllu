import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { BreadcrumbComponent } from "../breadcrumb/breadcrumb.component";
import { RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { UserService } from "../../service/user.service";
import Swal from "sweetalert2";
import * as bootstrap from "bootstrap";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../service/auth.service";
import DataTable from 'datatables.net';

@Component({
	selector: "app-category",
	standalone: true,
	imports: [BreadcrumbComponent, RouterLink, CommonModule, FormsModule],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	templateUrl: "./category.component.html",
	styleUrl: "./category.component.css",
})
export class CategoryComponent {
	title = "Categorías";

	categorys: any[] = [];
	selectedUser: any = null; // Usuario seleccionado para ver/editar
	selectedCategory: any = null; // Categoría seleccionada para ver/editar

	dataTable: any; // Instancia de DataTable
	private dtInitialized = false; // Marca si DataTable ya se inicializó

	passwords = { currentPassword: "", newPassword: "", confirmPassword: "" }; // Para cambio de contraseña

	constructor(private userService: UserService, private authService: AuthService) {}

	ngOnInit(): void {
		this.loadCategorys();
	  }
	
	  ngAfterViewChecked(): void {
		// Inicializamos DataTable solo una vez que hay datos
		if (!this.dtInitialized && this.categorys.length > 0) {
		  this.initDataTable();
		  this.dtInitialized = true;
		}
	  }
	
	  loadCategorys(): void {
		this.userService.getAllCategorys().subscribe({
		  next: (res: any) => {
			console.log("📌 Categorias cargados:", res);
			this.categorys = res.data || [];
	
			// Si ya estaba inicializado, refrescar DataTable
			if (this.dataTable) {
			  this.dataTable.clear().draw();
			  this.dataTable.rows.add(this.categorys).draw();
			}
		  },
		  error: err => {
			console.error("❌ Error al cargar Categorias", err);
		  },
		});
	  }
	
	  initDataTable(): void {
		this.dataTable = new DataTable('#dataTable', {
		  pageLength: 10,
		  // Configuración adicional si quieres
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
						// Actualizar estado en la tabla sin eliminar el objeto
						const category = this.categorys.find(c => c.categoriaID === categoriaID);
						if (category) {
							category.estado = false; // marcar como inactivo
						}

						Swal.fire({
							icon: "success",
							title: "Categoría desactivada",
							text: "La categoría ahora está inactiva",
							timer: 1500,
							showConfirmButton: false,
						});
					},
					error: err => {
						console.error("Error desactivando categoría", err);
						Swal.fire({
							icon: "error",
							title: "Error",
							text: err?.error?.message || "No se pudo desactivar la categoría",
						});
					},
				});
			}
		});
	}

	// Abrir modal de detalles de categoría
	openCategoryModal(category: any) {
		const categoryId = category.categoriaID;
		this.selectedCategory = null;

		this.userService.getCategoryById(categoryId).subscribe({
			next: (res: any) => {
				this.selectedCategory = res.data;

				const modalEl = document.getElementById("categoryModal");
				if (modalEl) {
					const modal = new bootstrap.Modal(modalEl);
					modal.show();
				}
			},
			error: err => {
				console.error("Error cargando categoría:", err);
				Swal.fire("Error", "No se pudo cargar la información de la categoría", "error");
			},
		});
	}
	// Abrir modal para editar categoría
	editCategory(category: any) {
		// Limpiar selectedCategory temporalmente
		this.selectedCategory = null;

		this.userService.getCategoryById(category.categoriaID).subscribe({
			next: (res: any) => {
				this.selectedCategory = res.data || res;
				const modalEl = document.getElementById("editCategoryModal");
				if (modalEl) {
					const modal = new bootstrap.Modal(modalEl);
					modal.show();
				}
			},
			error: err => {
				console.error("Error obteniendo categoría:", err);
				Swal.fire("Error", "No se pudo cargar la información de la categoría", "error");
			},
		});
	}

	// Enviar datos actualizados
	submitEditCategory() {
		if (!this.selectedCategory) return;

		// Obtener usuario logueado
		const loggedUser = this.authService.getUser();

		const updateData = {
			categoriaID: Number(this.selectedCategory.categoriaID),
			nombre: this.selectedCategory.nombre || "",
			descripcion: this.selectedCategory.descripcion || "",
			usuarioModificacion: loggedUser?.userName || "Admin",
		};

		this.userService.updateCategory(updateData).subscribe({
			next: () => {
				Swal.fire("Éxito", "Categoría actualizada correctamente", "success");
				this.closeEditCategoryModal();
				this.loadCategorys(); // refrescar lista
			},
			error: err => {
				console.error("Error actualizando categoría:", err);
				Swal.fire("Error", "No se pudo actualizar la categoría", "error");
			},
		});
	}

	// Cerrar modal de edición de categoría
	closeEditCategoryModal() {
		const modalEl = document.getElementById("editCategoryModal");
		if (modalEl) {
			const modal = bootstrap.Modal.getInstance(modalEl);
			modal?.hide();
		}
	}
}
