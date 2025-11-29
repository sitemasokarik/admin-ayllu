import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [BreadcrumbComponent, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {

  title: string = 'Agregar Usuario';

  // Modelo de usuario para el formulario
  user = {
    nombre: '',
    userName: '',
    email: '',
    password: '',
    rolID: 1,
    usuarioCreacion: 'admin'
  };

  constructor(private userService: UserService, private router: Router) {}

  // Método para guardar usuario
  saveUser(): void {
    // Validaciones básicas
    if (!this.user.nombre || !this.user.userName || !this.user.email || !this.user.password) {
      Swal.fire({
        icon: 'error',
        title: 'Campos incompletos',
        text: 'Por favor, completa todos los campos obligatorios'
      });
      return;
    }

    // Validaciones de la contraseña
    const password = this.user.password;
    const errores: string[] = [];

    if (password.length < 8) errores.push('Al menos 8 caracteres');
    if (!/[A-Z]/.test(password)) errores.push('Al menos una letra mayúscula');
    if (!/[a-z]/.test(password)) errores.push('Al menos una letra minúscula');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errores.push('Al menos un carácter especial');

    if (errores.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Contraseña inválida',
        html: `<ul>${errores.map(e => `<li>${e}</li>`).join('')}</ul>`
      });
      return;
    }

    // Llamada al servicio
    this.userService.createUser(this.user).subscribe({
      next: (res) => {
        if (res.success) {
          Swal.fire({
            icon: 'success',
            title: 'Usuario creado',
            text: 'El usuario se ha creado con éxito',
            timer: 1500,
            showConfirmButton: false
          }).then(() => this.goToUsers());
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: res.message || 'Error al crear usuario'
          });
        }
      },
      error: (err) => {
        console.error('Error creando usuario:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err?.error?.message || 'Error al crear usuario'
        });
      }
    });
  }

  goToUsers(): void {
    this.router.navigate(['/users']);
  }
}
