import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
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
	selector: "app-locales",
	standalone: true,
	imports: [BreadcrumbComponent, RouterLink, CommonModule, FormsModule],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	templateUrl: "./locales.component.html",
	styleUrl: "./locales.component.css",
})
export class LocalesComponent {
	title = "Locales";

	categorys: any[] = [];
	selectedUser: any = null; // Usuario seleccionado para ver/editar
	selectedCategory: any = null; // Categoría seleccionada para ver/editar
	selectedLocal: any = null; // Local seleccionado para ver en modal
	newFotoUrl: string = ""; // <-- Aquí declaras la variable para ngModel

	locales: any[] = [];
	dataTable: any; // Instancia de DataTable
	private dtInitialized = false; // Marca si DataTable ya se inicializó

	passwords = { currentPassword: "", newPassword: "", confirmPassword: "" }; // Para cambio de contraseña

	constructor(private userService: UserService, private authService: AuthService) {}
	ngOnInit(): void {
		this.loadLocales();
	}

	ngAfterViewInit(): void {
		// Inicializar DataTable después de que la vista esté lista
		setTimeout(() => {
			if (!this.dtInitialized && this.locales.length > 0) {
				this.initDataTable();
				this.dtInitialized = true;
			}
		}, 0);
	}

	loadLocales(): void {
		this.userService.getAllLocales().subscribe({
			next: (res: any) => {
				this.locales = res.data || [];

				// Si DataTable ya estaba inicializado, destruimos y reiniciamos
				if (this.dtInitialized && this.dataTable) {
					this.dataTable.destroy();
					setTimeout(() => this.initDataTable(), 0);
				}
			},
			error: err => console.error("Error al cargar locales:", err),
		});
	}

	initDataTable(): void {
		this.dataTable = new DataTable("#dataTable", {
			pageLength: 10,
			columnDefs: [
				{ orderable: false, targets: -1 }, // Desactivar orden en la columna de acciones
			],
		});
	}
	deleteLocal(localID: number): void {
		Swal.fire({
			title: "¿Estás seguro?",
			text: "¡El local será desactivado!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#3085d6",
			confirmButtonText: "Sí, desactivar",
			cancelButtonText: "Cancelar",
		}).then(result => {
			if (result.isConfirmed) {
				this.userService.deleteLocal(localID).subscribe({
					next: () => {
						// Actualizar estado en la tabla sin eliminar el objeto
						const local = this.locales.find(l => l.localID === localID);
						if (local) {
							local.estado = false; // marcar como inactivo
						}

						Swal.fire({
							icon: "success",
							title: "Local desactivado",
							text: "El local ahora está inactivo",
							timer: 1500,
							showConfirmButton: false,
						});
					},
					error: err => {
						console.error("Error desactivando local", err);
						Swal.fire({
							icon: "error",
							title: "Error",
							text: err?.error?.message || "No se pudo desactivar el local",
						});
					},
				});
			}
		});
	}

	// Abrir modal de detalles de local
	openLocalModal(local: any) {
		const localId = local.localID;
		this.selectedLocal = null;

		this.userService.getLocalById(localId).subscribe({
			next: (res: any) => {
				this.selectedLocal = res.data;

				const modalEl = document.getElementById("localModal");
				if (modalEl) {
					const modal = new bootstrap.Modal(modalEl);
					modal.show();
				}
			},
			error: err => {
				console.error("Error cargando local:", err);
				Swal.fire("Error", "No se pudo cargar la información del local", "error");
			},
		});
	}
	// Abrir modal para editar Local
	editLocal(local: any) {
		this.selectedLocal = null; // limpiar temporal

		this.userService.getLocalById(local.localID).subscribe({
			next: (res: any) => {
				this.selectedLocal = res.data || res;
				const modalEl = document.getElementById("editLocalModal");
				if (modalEl) {
					const modal = new bootstrap.Modal(modalEl);
					modal.show();
				}
			},
			error: err => {
				console.error("Error obteniendo local:", err);
				Swal.fire("Error", "No se pudo cargar la información del local", "error");
			},
		});
	}

	// Enviar datos actualizados
	submitEditLocal() {
		if (!this.selectedLocal) return;

		const loggedUser = this.authService.getUser();

		const updateData = {
			localID: Number(this.selectedLocal.localID),
			nombre: this.selectedLocal.nombre || "",
			direccion: this.selectedLocal.direccion || "",
			capacidad: this.selectedLocal.capacidad || 0,
			precioAlquiler: this.selectedLocal.precioAlquiler || 0,
			horasEvento: this.selectedLocal.horasEvento || 0,
			fotosUrls: this.selectedLocal.fotosUrls || [],
			terminosCondiciones: this.selectedLocal.terminosCondiciones || "",
			usuarioModificacion: loggedUser?.userName || "Admin",
		};

		this.userService.updateLocal(updateData).subscribe({
			next: () => {
				Swal.fire("Éxito", "Local actualizado correctamente", "success");
				this.closeEditLocalModal();
				this.loadLocales(); // refrescar lista
			},
			error: err => {
				console.error("Error actualizando local:", err);
				Swal.fire("Error", "No se pudo actualizar el local", "error");
			},
		});
	}

	// Cerrar modal de edición
	closeEditLocalModal() {
		const modalEl = document.getElementById("editLocalModal");
		if (modalEl) {
			const modal = bootstrap.Modal.getInstance(modalEl);
			modal?.hide();
		}
	}
}
