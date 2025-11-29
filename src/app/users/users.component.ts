import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
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
  styleUrls: ['./users.component.css']   // 👈 corregido (styleUrls)
})
export class UsersComponent implements OnInit {

  title: string = 'Usuarios';
  users: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (resp) => {
        console.log("📌 Usuarios cargados:", resp);

        // Si tu API devuelve algo así:
        // { success: true, data: [...] }
        // Entonces sería:
        // this.users = resp.data;

        this.users = resp; // mantengo igual, según tu API
      },
      error: (err) => {
        console.error("❌ Error al cargar usuarios:", err);
      }
    });
  }
}
