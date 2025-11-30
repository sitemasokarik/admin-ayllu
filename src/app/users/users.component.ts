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
	selector: "app-users",
	standalone: true,
	imports: [BreadcrumbComponent, RouterLink, CommonModule, FormsModule],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	templateUrl: "./users.component.html",
	styleUrls: ["./users.component.css"],
})
export class UsersComponent implements OnInit {
	title = "Usuarios";
	users: any[] = [];
	selectedUser: any = null; // Usuario seleccionado para ver/editar
	passwords = { currentPassword: "", newPassword: "", confirmPassword: "" }; // Para cambio de contraseña

	loading: boolean = true;

	dataTable: any; // Instancia de DataTable
	private dtInitialized = false; // Marca si DataTable ya se inicializó

	constructor(private userService: UserService, private authService: AuthService) {}

	ngOnInit(): void {
		this.loadUsers();
	}

	ngAfterViewChecked(): void {
		// Inicializamos DataTable solo una vez que hay datos
		if (!this.dtInitialized && this.users.length > 0) {
			this.initDataTable();
			this.dtInitialized = true;
		}
	}

	loadUsers(): void {
		this.userService.getAll().subscribe({
			next: (res: any) => {
				console.log("📌 Usuarios cargados:", res);
				this.users = res.data || [];
				this.loading = false;
				
				// Si ya estaba inicializado, refrescar DataTable
				if (this.dataTable) {
					this.dataTable.clear().draw();
					this.dataTable.rows.add(this.users).draw();
				}
			},
			error: err => {
				console.error("❌ Error al cargar usuarios", err);
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

	deleteUser(usuarioID: number): void {
		Swal.fire({
			title: "¿Estás seguro?",
			text: "¡El usuario será desactivado!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#3085d6",
			confirmButtonText: "Sí, desactivar",
			cancelButtonText: "Cancelar",
		}).then(result => {
			if (result.isConfirmed) {
				this.userService.delete(usuarioID).subscribe({
					next: () => {
						// Actualizar estado en la tabla sin eliminar el objeto
						const user = this.users.find(u => u.usuarioID === usuarioID);
						if (user) {
							user.estado = false; // marcar como inactivo
						}

						Swal.fire({
							icon: "success",
							title: "Usuario desactivado",
							text: "El usuario ahora está inactivo",
							timer: 1500,
							showConfirmButton: false,
						});
					},
					error: err => {
						console.error("Error desactivando usuario", err);
						Swal.fire({
							icon: "error",
							title: "Error",
							text: "No se pudo desactivar el usuario",
						});
					},
				});
			}
		});
	}

	// Abrir modal de detalles
	openUserModal(user: any) {
		const userId = user.usuarioID; // ✅ solo el ID
		this.selectedUser = null;

		this.userService.getById(userId).subscribe({
			next: (res: any) => {
				this.selectedUser = res.data;

				const modalEl = document.getElementById("userModal");
				if (modalEl) {
					const modal = new bootstrap.Modal(modalEl);
					modal.show();
				}
			},
			error: err => {
				console.error("Error cargando usuario:", err);
				Swal.fire("Error", "No se pudo cargar la información del usuario", "error");
			},
		});
	}

	// Abrir modal para editar usuario
	editUser(user: any) {
		// Limpiamos passwords y selectedUser temporalmente
		this.passwords = { currentPassword: "", newPassword: "", confirmPassword: "" };
		this.selectedUser = null; // para evitar errores de binding

		// Llamamos al backend para traer todos los datos del usuario
		this.userService.getById(user.usuarioID).subscribe({
			next: (res: any) => {
				// Asignamos el usuario completo a selectedUser
				this.selectedUser = res.data || res; // dependiendo de cómo venga la API
				// Abrimos modal
				const modalEl = document.getElementById("editUserModal");
				if (modalEl) {
					const modal = new bootstrap.Modal(modalEl);
					modal.show();
				}
			},
			error: err => {
				console.error("Error obteniendo usuario:", err);
				Swal.fire("Error", "No se pudo cargar la información del usuario", "error");
			},
		});
	}

	submitEditUser() {
		if (!this.selectedUser) return;

		// 🔹 Obtener usuario logueado
		const loggedUser = this.authService.getUser(); // todo el objeto del usuario logueado

		// 1️⃣ Preparar datos generales del usuario
		const updateData = {
			usuarioID: Number(this.selectedUser.usuarioID),
			nombre: this.selectedUser.nombre || "",
			userName: this.selectedUser.userName || "",
			email: this.selectedUser.email || "",
			rolID: Number(this.selectedUser.rolID),
			usuarioModificacion: loggedUser?.userName || "Admin",
		};

		// 2️⃣ Llamar a la API de update de datos generales
		this.userService.updateUser(updateData).subscribe({
			next: () => {
				// 3️⃣ Si hay nueva contraseña, validar y actualizar
				if (this.passwords.newPassword) {
					// Validar que coincidan
					if (this.passwords.newPassword !== this.passwords.confirmPassword) {
						Swal.fire("Error", "La nueva contraseña y la confirmación no coinciden", "error");
						return;
					}

					// Preparar datos para cambiar contraseña
					const passwordData = {
						usuarioID: this.selectedUser.usuarioID,
						currentPassword: this.passwords.currentPassword,
						newPassword: this.passwords.newPassword,
						confirmPassword: this.passwords.confirmPassword,
					};

					// Llamar a la API de cambio de contraseña
					this.userService.changePassword(passwordData).subscribe({
						next: () => {
							Swal.fire("Éxito", "Usuario y contraseña actualizados correctamente", "success");
							this.closeEditModal();
							this.loadUsers();
						},
						error: err => {
							console.error("Error cambiando contraseña:", err);
							Swal.fire("Error", "No se pudo cambiar la contraseña", "error");
						},
					});
				} else {
					// Si no hay cambio de contraseña, solo confirmamos update de datos
					Swal.fire("Éxito", "Usuario actualizado correctamente", "success");
					this.closeEditModal();
					this.loadUsers();
				}
			},
			error: err => {
				console.error("Error actualizando usuario:", err);
				Swal.fire("Error", "No se pudo actualizar el usuario", "error");
			},
		});
	}

	// Cerrar modal de edición
	closeEditModal() {
		const modalEl = document.getElementById("editUserModal");
		if (modalEl) {
			const modal = bootstrap.Modal.getInstance(modalEl);
			modal?.hide();
		}
	}
}
