import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../service/user.service';

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

  // función para mostrar el estado en texto
  getStatus(status: string) {
    return status === 'Active' ? 'Active' : 'Inactive';
  }

  // opcional: eliminar usuario
  deleteUser(id: number): void {
    if (confirm('¿Seguro que deseas eliminar este usuario?')) {
      this.userService.delete(id).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== id);
          console.log('Usuario eliminado');
        },
        error: (err) => console.error('Error eliminando usuario', err)
      });
    }
  }
}
