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

	constructor(private readonly router: Router, private readonly authService: AuthService) {}

	onSubmit(): void {
		const credentials = {
			userName: this.userName,
			password: this.password,
		};

		this.authService.login(credentials).subscribe({
			next: (resp: any) => {
				console.log("🟢 Respuesta servidor:", resp);

				// Guardar token
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

				// Guardar info del usuario logueado
				const user = resp?.data?.usuario; // 👈 Ajusta según tu API
				if (user) {
					this.authService.saveUser(user);
					// 🔹 Mostrar info del usuario en consola
					console.log("💻 Usuario logueado:", user);
				} else {
					console.warn("⚠️ No se recibió información del usuario en la respuesta");
				}

				Swal.fire({
					icon: "success",
					title: "Bienvenido",
					text: `Hola ${user?.nombre || this.userName}!`,
				});

				this.router.navigate(["/home"]);
			},

			error: err => {
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
