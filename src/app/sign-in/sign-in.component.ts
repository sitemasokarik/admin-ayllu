import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent {
  title = 'Iniciar sesión';
  email: string = 'admin@ayllu.com';
  password: string = 'Password';
  errorMessage: string = '';
  showPassword: boolean = false;

  constructor(private readonly router: Router) {}

  onSubmit(): void {
    this.errorMessage = '';
    const validEmail = 'admin@ayllu.com';
    const validPassword = 'Password';

    if (this.email !== validEmail) {
      this.errorMessage = 'Email inválido';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Email inválido'
      });
      return;
    }

    if (this.password !== validPassword) {
      this.errorMessage = 'Contraseña incorrecta';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Contraseña incorrecta'
      });
      return;
    }

    this.router.navigate(['/home']);
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}
