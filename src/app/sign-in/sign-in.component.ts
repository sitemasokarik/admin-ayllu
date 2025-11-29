import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent {

  // 🔥 CAMBIADO: email → userName (porque tu API usa userName)
  userName: string = '';
  password: string = '';

  showPassword = false;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}

  onSubmit(): void {

    const credentials = {
      userName: this.userName, // 👈 ahora coincide 100% con tu API
      password: this.password
    };

    this.authService.login(credentials).subscribe({
      next: (resp) => {
        console.log("🟢 Respuesta servidor:", resp);

        // 👇 Tu API devuelve token dentro de resp.data.token
        const token = resp?.data?.token;

        console.log("🔐 Token recibido:", token);

        if (!token) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se recibió token del servidor'
          });
          return;
        }

        this.authService.saveToken(token);

        Swal.fire({
          icon: 'success',
          title: 'Bienvenido',
          text: 'Inicio de sesión exitoso'
        });

        this.router.navigate(['/home']);
      },

      error: (err) => {
        console.error("❌ Error login:", err);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Credenciales incorrectas'
        });
      }
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
