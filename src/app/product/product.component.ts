import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, AfterViewInit, AfterViewChecked } from "@angular/core";
import { BreadcrumbComponent } from "../breadcrumb/breadcrumb.component";
import { RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { UserService } from "../../service/user.service";
import Swal from "sweetalert2";
import * as bootstrap from "bootstrap";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../service/auth.service";
import DataTable from "datatables.net";

@Component({
	selector: "app-product",
	standalone: true,
	imports: [BreadcrumbComponent, RouterLink, CommonModule, FormsModule],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	templateUrl: "./product.component.html",
	styleUrl: "./product.component.css",
})
export class ProductComponent implements OnInit {
	title = "Productos";
	categories: any[] = [];
	productos: any[] = [];
	loading: boolean = true;

	selectedUser: any = null; // Usuario seleccionado para ver/editar
	selectedProduct: any = null;
	dataTable: any; // Instancia de DataTable
	private dtInitialized = false; // Marca si DataTable ya se inicializó

	passwords = { currentPassword: "", newPassword: "", confirmPassword: "" }; // Para cambio de contraseña

	constructor(private userService: UserService, private authService: AuthService) {}

	ngOnInit(): void {
		this.loadProductos();
	}

	ngAfterViewChecked(): void {
		// Inicializamos DataTable solo una vez que hay datos
		if (!this.dtInitialized && this.productos.length > 0) {
			this.initDataTable();
			this.dtInitialized = true;
		}
	}

	loadProductos(): void {
		this.userService.getAllProducts().subscribe({
			next: (res: any) => {
				console.log("📌 Productos cargados:", res);
				this.productos = res.data || [];
				this.loading = false;
				// Si ya estaba inicializado, refrescar DataTable
				if (this.dataTable) {
					this.dataTable.clear().draw();
					this.dataTable.rows.add(this.productos).draw();
				}
			},
			error: err => {
				console.error("❌ Error al cargar Productos", err);
				this.loading = false;
			},
		});
	}

	initDataTable(): void {
		this.dataTable = new DataTable("#dataTable", {
			pageLength: 10,
			// Configuración adicional si quieres
		});
	}

	deleteProduct(productoID: number): void {
		Swal.fire({
			title: "¿Estás seguro?",
			text: "¡El producto será desactivado!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#3085d6",
			confirmButtonText: "Sí, desactivar",
			cancelButtonText: "Cancelar",
		}).then(result => {
			if (result.isConfirmed) {
				this.userService.deleteProduct(productoID).subscribe({
					next: () => {
						// Actualizar estado en la tabla sin eliminar el objeto
						const product = this.productos.find(p => p.productoID === productoID);
						if (product) {
							product.estado = false; // marcar como inactivo
						}

						Swal.fire({
							icon: "success",
							title: "Producto desactivado",
							text: "El producto ahora está inactivo",
							timer: 1500,
							showConfirmButton: false,
						});
					},
					error: err => {
						console.error("Error desactivando producto", err);
						Swal.fire({
							icon: "error",
							title: "Error",
							text: "No se pudo desactivar el producto",
						});
					},
				});
			}
		});
	}

	openProductModal(product: any) {
		const productoId = product.productoID;
		this.selectedProduct = null;

		this.userService.getProductById(productoId).subscribe({
			next: (res: any) => {
				this.selectedProduct = res.data;

				// Obtener el nombre de la categoría
				this.userService.getCategoryById(this.selectedProduct.categoriaID).subscribe({
					next: (catRes: any) => {
						this.selectedProduct.categoryName = catRes.data?.nombre || "-";

						// Mostrar modal solo después de tener el nombre de la categoría
						const modalEl = document.getElementById("productModal");
						if (modalEl) {
							const modal = new bootstrap.Modal(modalEl);
							modal.show();
						}
					},
					error: err => {
						console.error("Error cargando categoría:", err);
						this.selectedProduct.categoryName = "-";
					},
				});
			},
			error: err => {
				console.error("Error cargando producto:", err);
				Swal.fire("Error", "No se pudo cargar la información del producto", "error");
			},
		});
	}

	editProduct(product: any) {
		this.selectedProduct = null;

		// Esperar a que las categorías se carguen primero
		this.userService.getAllCategorys().subscribe({
			next: (cats: any) => {
				this.categories = cats.data;

				// Ahora traemos el producto
				this.userService.getProductById(product.productoID).subscribe({
					next: (res: any) => {
						this.selectedProduct = res.data;
						this.selectedProduct.categoriaID = Number(this.selectedProduct.categoriaID); // asegurar tipo

						// Abrir modal
						const modalEl = document.getElementById("editProductModal");
						if (modalEl) {
							const modal = new bootstrap.Modal(modalEl);
							modal.show();
						}
					},
				});
			},
		});
	}

	// Enviar datos actualizados
	submitEditProduct() {
		if (!this.selectedProduct) return;

		const loggedUser = this.authService.getUser();

		const updateData = {
			productoID: this.selectedProduct.productoID,
			nombre: this.selectedProduct.nombre,
			descripcion: this.selectedProduct.descripcion,
			precio: Number(this.selectedProduct.precio),
			precioCosto: Number(this.selectedProduct.precioCosto),
			imagenUrl: this.selectedProduct.imagenUrl,
			categoriaID: Number(this.selectedProduct.categoriaID),
			usuarioModificacion: loggedUser?.nombre || "Admin",
		};

		this.userService.updateProduct(updateData).subscribe({
			next: () => {
				Swal.fire("Éxito", "Producto actualizado correctamente", "success");
				this.closeEditModal();
				this.loadProductos(); // Método para refrescar tabla de productos
			},
			error: err => {
				console.error("Error actualizando producto:", err);
				Swal.fire("Error", "No se pudo actualizar el producto", "error");
			},
		});
	}

	closeEditModal() {
		const modalEl = document.getElementById("editProductModal");
		if (modalEl) {
			const modal = bootstrap.Modal.getInstance(modalEl);
			modal?.hide();
		}
	}
}
