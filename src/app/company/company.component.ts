import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { BreadcrumbComponent } from "../breadcrumb/breadcrumb.component";
import { UserService } from "../../service/user.service";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from "@angular/forms";
import Swal from "sweetalert2";
import { CommonModule } from "@angular/common";
import { environment } from "../../environments/environment";

@Component({
	selector: "app-company",
	standalone: true,
	imports: [BreadcrumbComponent, ReactiveFormsModule, CommonModule, FormsModule],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	templateUrl: "./company.component.html",
	styleUrl: "./company.component.css",
})
export class CompanyComponent implements OnInit {
	title = "Empresa";
	companyForm: FormGroup;
	empresaID!: number; // guardamos el ID de la empresa

	loading: boolean = true;

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
			bancoNombre: [""],
			numeroCuenta: [""],
			cci: [""],
			yapeNumero: [""],
			plinNumero: [""],
			instruccionesPago: [""],
			montoAdelantoReserva: [1000, [Validators.required, Validators.min(1)]],
			generaFactElect: [false],
			ubigeo: ['', Validators.pattern(/^\d{6}$/)],
			usuarioSol: [''],
			claveCertificado: [''],
			claveSol: [''],
			apiPeruDevToken: [''],
			sunatModo: ['DESARROLLO'],
		});
	}

	readonly certificadoRutaFija = 'fe/certificado';
	readonly sunatWsDesarrollo = 'https://e-beta.sunat.gob.pe/ol-ti-itcpfegem-beta/billService';
	readonly sunatWsProduccion = 'https://e-factura.sunat.gob.pe/ol-ti-itcpfegem/billService';

	get sunatWsUrlActivo(): string {
		return this.companyForm.get('sunatModo')?.value === 'PRODUCCION'
			? this.sunatWsProduccion
			: this.sunatWsDesarrollo;
	}

	get hasLogo(): boolean {
		return !!this.getLogoUrl() && !this.logoImageError;
	}

	private extractLogo(data: Record<string, unknown>): string {
		const raw = String(data['logo'] ?? data['Logo'] ?? '').trim();
		if (!raw || raw.toLowerCase() === 'string') return '';
		return raw;
	}

	qrPreviewUrl = '';
	logoPreviewUrl = '';
	logoImageError = false;
	logoUploading = false;
	cuentasBancarias: Array<{
		alias: string;
		bancoNombre: string;
		numeroCuenta: string;
		cci: string;
		yapeNumero: string;
		plinNumero: string;
	}> = [];

	certificadoFileName = '';
	certificadoUploading = false;
	tieneApiPeruDevToken = false;

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
				this.loading = false; // Apaga loading aunque falle
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
						bancoNombre: data.bancoNombre,
						numeroCuenta: data.numeroCuenta,
						cci: data.cci,
						yapeNumero: data.yapeNumero,
						plinNumero: data.plinNumero,
						instruccionesPago: data.instruccionesPago,
						montoAdelantoReserva: data.montoAdelantoReserva ?? 1000,
						generaFactElect: !!data.generaFactElect,
						ubigeo: data.ubigeo || '',
						usuarioSol: data.usuarioSol || '',
						claveCertificado: '',
						claveSol: '',
						apiPeruDevToken: '',
						sunatModo: data.sunatModo === 'PRODUCCION' ? 'PRODUCCION' : 'DESARROLLO',
					});
					this.tieneApiPeruDevToken = !!data.tieneApiPeruDevToken;
					this.certificadoFileName = data.certificadoFileName || '';
					const logo = this.extractLogo(data);
					this.logoPreviewUrl = logo;
					this.logoImageError = false;
					this.companyForm.patchValue({ logo });
					this.qrPreviewUrl = data.qrPagoUrl || '';
					this.cuentasBancarias = (data.cuentasPago?.length ? data.cuentasPago : [{
						alias: 'Cuenta principal',
						bancoNombre: data.bancoNombre || '',
						numeroCuenta: data.numeroCuenta || '',
						cci: data.cci || '',
						yapeNumero: data.yapeNumero || '',
						plinNumero: data.plinNumero || '',
					}]).map((c: any) => ({
						alias: c.alias || '',
						bancoNombre: c.bancoNombre || '',
						numeroCuenta: c.numeroCuenta || '',
						cci: c.cci || '',
						yapeNumero: c.yapeNumero || '',
						plinNumero: c.plinNumero || '',
					}));
				}
				this.loading = false;
			},
			error: err => {
				console.error("Error al cargar la empresa", err);
				this.loading = false;
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
			empresaID: this.empresaID,
			usuarioModificacion: "Admin",
			cuentasPago: this.cuentasBancarias.filter(c =>
				c.bancoNombre || c.numeroCuenta || c.cci || c.yapeNumero || c.plinNumero
			),
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

	onQrSelected(event: Event): void {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file || !this.empresaID) return;

		this.userService.uploadQrPago(this.empresaID, file).subscribe({
			next: (res: any) => {
				this.qrPreviewUrl = res?.data?.qrPagoUrl || '';
				Swal.fire("Éxito", "QR de pago actualizado", "success");
			},
			error: () => Swal.fire("Error", "No se pudo subir el QR", "error"),
		});
	}

	getQrUrl(): string {
		return this.userService.resolveMediaUrl(this.qrPreviewUrl);
	}

	getLogoUrl(): string {
		const value = this.logoPreviewUrl || this.companyForm.get('logo')?.value;
		const normalized = this.extractLogo({ logo: value });
		return this.userService.resolveMediaUrl(normalized);
	}

	onLogoImageError(): void {
		this.logoImageError = true;
	}

	onLogoSelected(event: Event): void {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (!file) return;

		this.logoUploading = true;
		this.logoImageError = false;
		this.userService.uploadMedia(file, 'empresa').subscribe({
			next: (res: any) => {
				const url = res?.data?.url || '';
				this.companyForm.patchValue({ logo: url });
				this.logoPreviewUrl = url;
				this.logoUploading = false;
				this.persistLogo(url);
			},
			error: (err) => {
				this.logoUploading = false;
				Swal.fire('Error', err?.error?.message || 'No se pudo subir el logo', 'error');
			},
		});
	}

	private persistLogo(url: string): void {
		if (!this.empresaID || !url) return;
		this.userService.updateEmpresa({
			...this.companyForm.value,
			logo: url,
			empresaID: this.empresaID,
			usuarioModificacion: 'Admin',
			cuentasPago: this.cuentasBancarias.filter(c =>
				c.bancoNombre || c.numeroCuenta || c.cci || c.yapeNumero || c.plinNumero
			),
		}).subscribe({
			error: () => Swal.fire('Atención', 'Logo subido, pero no se pudo guardar en la empresa. Pulsa Guardar cambios.', 'warning'),
		});
	}

	agregarCuenta(): void {
		this.cuentasBancarias.push({
			alias: `Cuenta ${this.cuentasBancarias.length + 1}`,
			bancoNombre: '',
			numeroCuenta: '',
			cci: '',
			yapeNumero: '',
			plinNumero: '',
		});
	}

	eliminarCuenta(index: number): void {
		if (this.cuentasBancarias.length <= 1) return;
		this.cuentasBancarias.splice(index, 1);
	}

	onCertificadoSelected(event: Event): void {
		const file = (event.target as HTMLInputElement).files?.[0];
		const clave = this.companyForm.get('claveCertificado')?.value;
		if (!file || !this.empresaID) return;
		if (!clave) {
			Swal.fire('Atención', 'Ingresa la clave del certificado antes de subir el .pfx', 'warning');
			return;
		}

		this.certificadoUploading = true;
		this.userService.uploadCertificado(this.empresaID, file, clave).subscribe({
			next: (res: any) => {
				this.certificadoFileName = res?.data?.certificadoFileName || file.name;
				this.certificadoUploading = false;
				Swal.fire('Éxito', 'Certificado digital actualizado', 'success');
			},
			error: (err) => {
				this.certificadoUploading = false;
				Swal.fire('Error', err?.error?.message || 'No se pudo subir el certificado', 'error');
			},
		});
	}
}
