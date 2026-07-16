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
	selector: "app-product",
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
	templateUrl: "./product.component.html",
	styleUrl: "./product.component.css",
})
export class ProductComponent implements OnInit {
	title = "Productos";
	categories: any[] = [];
	productos: any[] = [];
	loading = true;
	tableFilterFields = ["productoID", "nombre", "categoria", "precio"];

	selectedProduct: any = null;
	fotoUploading = false;

	constructor(
		public userService: UserService,
		private authService: AuthService,
	) {}

	ngOnInit(): void {
		this.loadCategories();
		this.loadProductos();
	}

	private loadCategories(): void {
		this.userService.getAllCategorys().subscribe({
			next: (res: any) => {
				this.categories = res?.data || [];
			},
		});
	}

	private patchProductoInList(updateData: Record<string, unknown>): void {
		const productoID = Number(updateData["productoID"]);
		const index = this.productos.findIndex((p) => p.productoID === productoID);
		if (index < 0) {
			return;
		}

		const categoria = this.categories.find(
			(c) => Number(c.categoriaID) === Number(updateData["categoriaID"] ?? this.productos[index].categoriaID)
		);

		this.productos[index] = {
			...this.productos[index],
			...updateData,
			categoria: categoria?.nombre ?? this.productos[index].categoria,
		};
		this.productos = [...this.productos];
	}

	loadProductos(): void {
		this.loading = true;
		this.userService.getAllProducts().subscribe({
			next: (res: any) => {
				this.productos = res.data || [];
				this.loading = false;
			},
			error: () => {
				this.loading = false;
				Swal.fire("Error", "No se pudieron cargar los productos", "error");
			},
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
		}).then((result) => {
			if (result.isConfirmed) {
				this.userService.deleteProduct(productoID).subscribe({
					next: () => {
						this.patchProductoInList({ productoID, estado: false });
						Swal.fire({
							icon: "success",
							title: "Producto desactivado",
							text: "El producto ahora está inactivo",
							timer: 1500,
							showConfirmButton: false,
						});
					},
					error: () => {
						Swal.fire("Error", "No se pudo desactivar el producto", "error");
					},
				});
			}
		});
	}

	openProductModal(product: any): void {
		this.selectedProduct = null;

		this.userService.getProductById(product.productoID).subscribe({
			next: (res: any) => {
				const data = res.data || {};
				this.selectedProduct = {
					...data,
					fotosUrls: (data.fotosUrls || []).map((u: string) => this.userService.resolveMediaUrl(u)),
				};

				this.userService.getCategoryById(this.selectedProduct.categoriaID).subscribe({
					next: (catRes: any) => {
						this.selectedProduct.categoryName = catRes.data?.nombre || "-";
						const modalEl = document.getElementById("productModal");
						if (modalEl) {
							new bootstrap.Modal(modalEl).show();
						}
					},
					error: () => {
						this.selectedProduct.categoryName = "-";
					},
				});
			},
			error: () => {
				Swal.fire("Error", "No se pudo cargar la información del producto", "error");
			},
		});
	}

	editProduct(product: any): void {
		this.selectedProduct = null;

		this.userService.getAllCategorys().subscribe({
			next: (cats: any) => {
				this.categories = cats.data || [];

				this.userService.getProductById(product.productoID).subscribe({
					next: (res: any) => {
						const data = res.data || {};
						this.selectedProduct = {
							...data,
							fotosUrls: data.fotosUrls?.length ? [...data.fotosUrls] : [],
							categoriaID: Number(data.categoriaID),
						};

						const modalEl = document.getElementById("editProductModal");
						if (modalEl) {
							new bootstrap.Modal(modalEl).show();
						}
					},
				});
			},
		});
	}

	submitEditProduct(): void {
		if (!this.selectedProduct) return;

		const loggedUser = this.authService.getUser();
		const updateData = {
			productoID: this.selectedProduct.productoID,
			nombre: this.selectedProduct.nombre,
			descripcion: this.selectedProduct.descripcion,
			precio: Number(this.selectedProduct.precio),
			precioCosto: Number(this.selectedProduct.precioCosto),
			fotosUrls: this.selectedProduct.fotosUrls || [],
			categoriaID: Number(this.selectedProduct.categoriaID),
			usuarioModificacion: loggedUser?.nombre || "Admin",
		};

		this.userService.updateProduct(updateData).subscribe({
			next: () => {
				this.patchProductoInList(updateData);
				this.closeEditModal();
				Swal.fire("Éxito", "Producto actualizado correctamente", "success");
			},
			error: () => {
				Swal.fire("Error", "No se pudo actualizar el producto", "error");
			},
		});
	}

	onFotoSelected(event: Event): void {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (!file || !this.selectedProduct) return;

		this.fotoUploading = true;
		this.userService.uploadMedia(file, "productos").subscribe({
			next: (res) => {
				const url = res?.data?.url;
				if (url) {
					if (!this.selectedProduct.fotosUrls) this.selectedProduct.fotosUrls = [];
					this.selectedProduct.fotosUrls.push(url);
				}
				this.fotoUploading = false;
				(event.target as HTMLInputElement).value = "";
			},
			error: (err) => {
				this.fotoUploading = false;
				Swal.fire("Error", err?.error?.message || "No se pudo subir la imagen", "error");
			},
		});
	}

	removeFotoUrl(index: number): void {
		this.selectedProduct?.fotosUrls?.splice(index, 1);
	}

	closeEditModal(): void {
		const modalEl = document.getElementById("editProductModal");
		bootstrap.Modal.getInstance(modalEl!)?.hide();
	}

	trackByProductoId(_index: number, producto: { productoID: number }): number {
		return producto.productoID;
	}
}
