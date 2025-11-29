import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../service/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [BreadcrumbComponent, RouterLink, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  title = 'Usuarios';
  users: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAll().subscribe({
      next: (res: any) => {
        console.log('📌 Usuarios cargados:', res);
        this.users = res.data || [];
      },
      error: (err) => {
        console.error('❌ Error al cargar usuarios', err);
      }
    });
  }

  deleteUser(usuarioID: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡El usuario será eliminado!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.delete(usuarioID).subscribe({
          next: () => {
            // Actualizar la lista de usuarios sin recargar
            this.users = this.users.filter(u => u.usuarioID !== usuarioID);

            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'El usuario ha sido eliminado',
              timer: 1500,
              showConfirmButton: false
            });
          },
          error: (err) => {
            console.error('Error eliminando usuario', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar el usuario'
            });
          }
        });
      }
    });
  }

  editUser(user: any) {
    // Lógica para editar usuario
    console.log('Editar usuario:', user);
  }
}
