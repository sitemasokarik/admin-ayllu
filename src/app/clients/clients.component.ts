import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { BreadcrumbComponent } from "../breadcrumb/breadcrumb.component";
import { RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { UserService } from "../../service/user.service";
import Swal from "sweetalert2";
import * as bootstrap from "bootstrap";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../service/auth.service";

@Component({
  selector: 'app-clients',
	standalone: true,
	imports: [BreadcrumbComponent, RouterLink, CommonModule, FormsModule],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})

export class ClientsComponent {
  title = "Clientes";
 
  clients: any[] = [];
  selectedUser: any = null; // Usuario seleccionado para ver/editar
  passwords = { currentPassword: "", newPassword: "", confirmPassword: "" }; // Para cambio de contraseña

  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadCategorys();
  }

  loadCategorys(): void {
    this.userService.getAllClients().subscribe({
      next: (res: any) => {
        console.log("📌 Clientes cargados:", res);
        this.clients = res.data || [];
      },
      error: err => {
        console.error("❌ Error al cargar Clientes", err);
      },
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
            const user = this.clients.find(u => u.usuarioID === usuarioID);
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
  openCategoryModal(category: any) {
    const categoryId = category.categoriaID; // ✅ solo el ID
    this.selectedUser = null;

    this.userService.getCategoryById(categoryId).subscribe({
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
  editUser(category: any) {
    // Limpiamos passwords y selectedUser temporalmente
    this.passwords = { currentPassword: "", newPassword: "", confirmPassword: "" };
    this.selectedUser = null; // para evitar errores de binding

    // Llamamos al backend para traer todos los datos del usuario
    this.userService.getCategoryById(category.categoriaID).subscribe({
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
              this.loadCategorys();
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
          this.loadCategorys();
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
