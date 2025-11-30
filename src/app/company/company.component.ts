import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { BreadcrumbComponent } from "../breadcrumb/breadcrumb.component";
import { UserService } from "../../service/user.service";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import Swal from "sweetalert2";
import { CommonModule } from "@angular/common";

@Component({
	selector: "app-company",
	standalone: true,
	imports: [BreadcrumbComponent, ReactiveFormsModule, CommonModule],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	templateUrl: "./company.component.html",
	styleUrl: "./company.component.css",
})
export class CompanyComponent implements OnInit {
	title = "Empresa";
	companyForm: FormGroup;
	empresaID!: number; // guardamos el ID de la empresa

	constructor(private userService: UserService, private fb: FormBuilder) {
		// Inicializamos el formulario con validaciones
		this.companyForm = this.fb.group({
			razonSocial: ["", Validators.required],
			nombreComercial: ["", Validators.required],
			ruc: ["", Validators.required],
			email: ["", [Validators.required, Validators.email]],
			telefono: ["", [Validators.required, Validators.pattern(/^\d{9}$/)]],
			telefonoSecundario: ["", Validators.pattern(/^\d{9}$/)],
			whatsApp: ["", Validators.pattern(/^\d{9}$/)],
			direccion: ["", Validators.required],
			ciudad: [""],
			pais: [""],
			facebook: [""],
			instagram: [""],
			linkedIn: [""],
			twitter: [""],
			horarioAtencion: [""],
			logo: [""],
		});
	}

	ngOnInit(): void {
		// Obtenemos todas las empresas para determinar el ID
		this.userService.getAllEmpresas().subscribe({
			next: (res: any) => {
				const empresas = res.data;
				if (empresas && empresas.length > 0) {
					this.empresaID = empresas[0].empresaID; // guardamos el ID real
					this.loadCompany(this.empresaID);
				}
				console.log("📌 Empresas:", empresas);
			},
			error: err => {
				console.error("❌ Error al obtener empresas", err);
			},
		});
	}

	// Cargamos la empresa por ID
	loadCompany(id: number): void {
		this.userService.getEmpresaById(id).subscribe({
			next: (res: any) => {
				const data = res.data;
				if (data) {
					this.companyForm.patchValue({
						razonSocial: data.razonSocial,
						nombreComercial: data.nombreComercial,
						ruc: data.ruc,
						email: data.email,
						telefono: data.telefono,
						telefonoSecundario: data.telefonoSecundario,
						whatsApp: data.whatsApp,
						direccion: data.direccion,
						ciudad: data.ciudad,
						pais: data.pais,
						facebook: data.facebook,
						instagram: data.instagram,
						linkedIn: data.linkedIn,
						twitter: data.twitter,
						horarioAtencion: data.horarioAtencion,
						logo: data.logo,
					});
				}
			},
			error: err => {
				console.error("Error al cargar la empresa", err);
				Swal.fire("Error", "No se pudo cargar la información de la empresa", "error");
			},
		});
	}

	// Guardamos los cambios en la empresa
	saveChanges(): void {
		if (this.companyForm.invalid) {
			Swal.fire("Atención", "Por favor completa todos los campos requeridos correctamente", "warning");
			return;
		}

		const empresaData = {
			...this.companyForm.value,
			empresaID: this.empresaID, // usamos el ID real
			usuarioModificacion: "Admin", // o el usuario actual
		};

		this.userService.updateEmpresa(empresaData).subscribe({
			next: () => {
				Swal.fire("Éxito", "Datos de la empresa actualizados", "success");
			},
			error: err => {
				console.error("Error al actualizar empresa", err);
				Swal.fire("Error", "No se pudo actualizar la empresa", "error");
			},
		});
	}
}
