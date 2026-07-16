import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../service/user.service';
import Swal from 'sweetalert2';
import * as bootstrap from 'bootstrap';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { AdminTableShellComponent } from '../shared/admin-table/admin-table-shell.component';
import { AdminTableBodyDirective } from '../shared/admin-table/admin-table-body.directive';

@Component({
  selector: 'app-users',
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
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  title = 'Usuarios';
  users: any[] = [];
  selectedUser: any = null;
  passwords = { currentPassword: '', newPassword: '', confirmPassword: '' };

  loading = true;
  tableFilterFields = ['usuarioID', 'nombre', 'userName', 'email', 'rolNombre'];
  user = {
    nombre: '',
    userName: '',
    email: '',
    password: '',
    rolID: null,
    usuarioCreacion: 'admin',
  };
  categories: any[] = [];

  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;

    this.userService.getAllRoles().subscribe({
      next: (rolesRes: any) => {
        this.categories = rolesRes.data || [];
        this.fetchUsers();
      },
      error: () => this.fetchUsers(),
    });
  }

  private fetchUsers(): void {
    this.userService.getAll().subscribe({
      next: (res: any) => {
        this.users = (res.data || []).map((user: any) => ({
          ...user,
          rolNombre: this.getRoleName(user.rolID),
        }));
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire('Error', 'No se pudieron cargar los usuarios', 'error');
      },
    });
  }

  getRoleName(rolID: number | string | null | undefined): string {
    if (rolID == null) return 'Sin rol';
    const role = this.categories.find((r) => r.rolID == rolID);
    return role?.nombre ?? 'Sin rol';
  }

  private patchUserInList(usuarioID: number, patch: Record<string, unknown>): void {
    const index = this.users.findIndex((u) => u.usuarioID === usuarioID);
    if (index >= 0) {
      this.users[index] = { ...this.users[index], ...patch };
      this.users = [...this.users];
    }
  }

  deleteUser(usuarioID: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡El usuario será desactivado!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.delete(usuarioID).subscribe({
          next: () => {
            this.patchUserInList(usuarioID, { estado: false });
            Swal.fire({
              icon: 'success',
              title: 'Usuario desactivado',
              text: 'El usuario ahora está inactivo',
              timer: 1500,
              showConfirmButton: false,
            });
          },
          error: () => {
            Swal.fire('Error', 'No se pudo desactivar el usuario', 'error');
          },
        });
      }
    });
  }

  openUserModal(user: any): void {
    this.selectedUser = null;

    this.userService.getById(user.usuarioID).subscribe({
      next: (res: any) => {
        this.selectedUser = res.data;
        const modalEl = document.getElementById('userModal');
        if (modalEl) new bootstrap.Modal(modalEl).show();
      },
      error: () => Swal.fire('Error', 'No se pudo cargar la información del usuario', 'error'),
    });
  }

  editUser(user: any): void {
    this.passwords = { currentPassword: '', newPassword: '', confirmPassword: '' };
    this.selectedUser = null;

    this.userService.getById(user.usuarioID).subscribe({
      next: (res: any) => {
        this.selectedUser = res.data || res;
        const modalEl = document.getElementById('editUserModal');
        if (modalEl) new bootstrap.Modal(modalEl).show();
      },
      error: () => Swal.fire('Error', 'No se pudo cargar la información del usuario', 'error'),
    });
  }

  submitEditUser(): void {
    if (!this.selectedUser) return;

    const loggedUser = this.authService.getUser();
    const updateData = {
      usuarioID: Number(this.selectedUser.usuarioID),
      nombre: this.selectedUser.nombre || '',
      userName: this.selectedUser.userName || '',
      email: this.selectedUser.email || '',
      rolID: Number(this.selectedUser.rolID),
      usuarioModificacion: loggedUser?.userName || 'Admin',
    };

    this.userService.updateUser(updateData).subscribe({
      next: () => {
        const finishEdit = () => {
          this.patchUserInList(updateData.usuarioID, {
            nombre: updateData.nombre,
            userName: updateData.userName,
            email: updateData.email,
            rolID: updateData.rolID,
            rolNombre: this.getRoleName(updateData.rolID),
          });
          Swal.fire('Éxito', 'Usuario actualizado correctamente', 'success');
          this.closeEditModal();
        };

        if (this.passwords.newPassword) {
          if (this.passwords.newPassword !== this.passwords.confirmPassword) {
            Swal.fire('Error', 'La nueva contraseña y la confirmación no coinciden', 'error');
            return;
          }

          this.userService
            .changePassword({
              usuarioID: this.selectedUser.usuarioID,
              currentPassword: this.passwords.currentPassword,
              newPassword: this.passwords.newPassword,
              confirmPassword: this.passwords.confirmPassword,
            })
            .subscribe({
              next: () => {
                Swal.fire('Éxito', 'Usuario y contraseña actualizados correctamente', 'success');
                finishEdit();
              },
              error: () => Swal.fire('Error', 'No se pudo cambiar la contraseña', 'error'),
            });
        } else {
          finishEdit();
        }
      },
      error: () => Swal.fire('Error', 'No se pudo actualizar el usuario', 'error'),
    });
  }

  closeEditModal(): void {
    const modalEl = document.getElementById('editUserModal');
    if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();
  }

  trackByUsuarioId(_index: number, user: { usuarioID: number }): number {
    return user.usuarioID;
  }
}
