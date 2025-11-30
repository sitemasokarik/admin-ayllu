import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { AuthService } from '../../service/auth.service';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-presupuestador',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, BreadcrumbComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './presupuestador.component.html',
  styleUrl: './presupuestador.component.css'
})
export class PresupuestadorComponent {

  title = 'Presupuestador';

  locales: any[] = [];
  constructor(private userService: UserService, private authService: AuthService) {}
  
  ngOnInit(): void {
		this.loadLocales();
	}
  onSubmit(): void {

  }

  loadLocales(): void {
    this.userService.getAllLocales().subscribe({
      next: (res: any) => {
        console.log("📌 Respuesta completa:", res); // <-- imprime toda la respuesta

        this.locales = res.data || [];

        console.log("📌 Locales cargados:", this.locales); // <-- imprime solo los locales
      },
      error: err => console.error("❌ Error al cargar locales:", err),
    });
  }

}
