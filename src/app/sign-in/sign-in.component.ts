import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import Swal from "sweetalert2";
import { AuthService } from "../../service/auth.service";

@Component({
	selector: "app-sign-in",
	standalone: true,
	imports: [CommonModule, FormsModule],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	templateUrl: "./sign-in.component.html",
	styleUrls: ["./sign-in.component.css"],
})
export class SignInComponent {
	userName: string = "";
	password: string = "";
	showPassword = false;
	loading: boolean = false;

	constructor(private readonly router: Router, private readonly authService: AuthService) {}

onSubmit(): void {
  this.loading = true;

  const credentials = {
    userName: this.userName,
    password: this.password,
  };

  this.authService.login(credentials).subscribe({
    next: (resp: any) => {
      this.loading = false;

      const token = resp?.data?.token;
      const user = resp?.data;

      console.log("LOGIN:", user);

      if (!token || !user) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se recibió información válida",
        });
        return;
      }

      // Guardar token y usuario
      this.authService.saveToken(token);
      this.authService.saveUser(user);

      // 🔥 TRAER PERMISOS SEGÚN EL ROL
      this.authService.getRolById(user.rolID).subscribe((rolResp: any) => {

        console.log("PERMISOS:", rolResp);

        const permisos = rolResp?.data?.permisos || [];

        // Guardar permisos en localStorage
        localStorage.setItem("permisos", JSON.stringify(permisos));

        Swal.fire({
          icon: "success",
          title: "Bienvenido",
          text: `Hola ${user.nombre}!`,
        });

        this.router.navigate(["/home"]);
      });

    },

    error: err => {
      this.loading = false;
      console.error("Error login:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Credenciales incorrectas",
      });
    }
  });
}



	togglePassword() {
		this.showPassword = !this.showPassword;
	}
}
