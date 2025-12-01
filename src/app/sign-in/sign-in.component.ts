import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { UserService } from '../core/services/user.service';
import { AuthService } from '../core/auth/auth.service';
import { RequestOption } from '../shared/class/request-option';
import { finalize } from 'rxjs';
import { ResponseModel } from '../shared/models/response.model';
import { AuthUserModel } from '../core/models/auth/auth-user.model';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent {
  private readonly _userService = inject(UserService);
  private readonly _authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  title = 'Iniciar sesión';
  email: string = 'admin@ayllu.com';
  password: string = 'Password';
  errorMessage: string = '';
  showPassword: boolean = false;
  signInForm: FormGroup;

  constructor(private readonly router: Router) {
    this.signInForm = this.fb.group({
      email: [this.email, [Validators.required]],
      password: [this.password, [Validators.required]],
    });
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (this.signInForm.invalid) {
      this.signInForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.signInForm.value;
    const credentials: { userName: string, password: string } = { userName: email, password };

    this._userService
      .post(new RequestOption({ resource: 'login', request: credentials }))
      .pipe(finalize(() => null))
      .subscribe({
        next: (data: ResponseModel<AuthUserModel>) => {
          if (data.success) {
            const user = data.data;
            this._authService.setAuthUser(user);
            this.router.navigate(['/home']);
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: data.message || 'Error en la autenticación',
            });
          }
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.error.message || 'Error en la autenticación',
          });
        }
      });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}
