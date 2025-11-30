import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import Swal from "sweetalert2";
import { AuthService } from "../../service/auth.service";

@Component({
	selector: "app-sign-in",
	standalone: true,
	imports: [CommonModule, FormsModule, RouterLink],
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
	this.loading = true; // 🔹 Activar loading

	const credentials = {
		userName: this.userName,
		password: this.password,
	};

	this.authService.login(credentials).subscribe({
		next: (resp: any) => {
		this.loading = false; // 🔹 Desactivar loading

		console.log("🟢 Respuesta servidor:", resp);

		const token = resp?.data?.token;
		if (!token) {
			Swal.fire({
			icon: "error",
			title: "Error",
			text: "No se recibió token del servidor",
			});
			return;
		}

		this.authService.saveToken(token);

		const user = resp?.data?.usuario;
		if (user) this.authService.saveUser(user);

		Swal.fire({
			icon: "success",
			title: "Bienvenido",
			text: `Hola ${user?.nombre || this.userName}!`,
		});

		this.router.navigate(["/home"]);
		},

		error: err => {
		this.loading = false; // 🔹 Desactivar loading

		console.error("❌ Error login:", err);
		Swal.fire({
			icon: "error",
			title: "Error",
			text: "Credenciales incorrectas",
		});
		},
	});
	}


	togglePassword() {
		this.showPassword = !this.showPassword;
	}
}
