import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { API } from "../app/config/api.config";
import { environment } from "../environments/environment";

@Injectable({ providedIn: "root" })
export class UserService {
	private apiUrl = API.usuario;
	private apiUrlCategorias = API.categoria;
	private apiUrlProductos = API.producto;
	private apiUrlClientes = API.cliente;
	private apiUrlLocales = API.local;
	private apiUrlEmpresa = API.empresa;
	private apiUrlBlog = API.blog;
	private apiUrlFormulario = API.contactanos;
	private apiUrlServicio = API.servicio;
	private apiUrlCotizacion = API.cotizacion;
	private apiUrlEvento = API.evento;
	private apiUrlRol = API.rol;
	private apiUrlPage = API.pagina;
	private apiUrlPermiso = API.permiso;
	

	constructor(private http: HttpClient) {}

	// Obtener todos los usuarios
	getAll(): Observable<any> {
		return this.http.get(`${this.apiUrl}/getall`);
	}

	// Crear usuario
	createUser(userData: any): Observable<any> {
		return this.http.post(`${this.apiUrl}/create`, userData);
	}

	// UserService
	getById(id: number): Observable<any> {
		return this.http.get(`${this.apiUrl}/${id}`);
	}

	// Eliminar usuario (soft delete)
	delete(id: number): Observable<any> {
		return this.http.delete(`${this.apiUrl}/${id}`);
	}

	updateUser(userData: any): Observable<any> {
		return this.http.put(`${this.apiUrl}/update`, userData);
	}

	changePassword(passwordData: any): Observable<any> {
		return this.http.put(`${this.apiUrl}/change-password`, passwordData);
	}

	//CATEGORY METHODS
	getAllCategorys(): Observable<any> {
		return this.http.get(`${this.apiUrlCategorias}/root`);
	}
	getAllHierarchy(): Observable<any> {
		return this.http.get(`${this.apiUrlCategorias}/hierarchy`);
	}	
	getAllCategorysG(): Observable<any> {
		return this.http.get(`${this.apiUrlCategorias}/getall`);
	}	
	getAllAddProducto(): Observable<any> {
		return this.http.get(`${this.apiUrlCategorias}/getall`);
	}		
	getCategoryById(id: number): Observable<any> {
		return this.http.get(`${this.apiUrlCategorias}/getbyid/${id}`);
	}
	createCategory(categoryData: any): Observable<any> {
		return this.http.post(`${this.apiUrlCategorias}/create`, categoryData);
	}
	updateCategory(categoryData: any): Observable<any> {
		return this.http.put(`${this.apiUrlCategorias}/update`, categoryData);
	}
	deleteCategory(id: number): Observable<any> {
		return this.http.delete(`${this.apiUrlCategorias}/delete/${id}`);
	}
	//PRODUCT METHODS
	getAllProducts(): Observable<any> {
		return this.http.get(`${this.apiUrlProductos}/getall`);
	}
	getProductById(productoId: number): Observable<any> {
		return this.http.get(`${this.apiUrlProductos}/getbyid/${productoId}`);
	}
	createProduct(productData: any): Observable<any> {
		return this.http.post(`${this.apiUrlProductos}/create`, productData);
	}
	updateProduct(productData: any): Observable<any> {
		return this.http.put(`${this.apiUrlProductos}/update`, productData);
	}
	deleteProduct(id: number): Observable<any> {
		return this.http.delete(`${this.apiUrlProductos}/delete/${id}`);
	}
	//CLIENT METHODS
	getAllClients(): Observable<any> {
		return this.http.get(`${this.apiUrlClientes}/getall`);
	}
	getByDocument(numeroDocumento: number): Observable<any> {
		return this.http.get(`${this.apiUrlClientes}/getbydocumento/${numeroDocumento}`);
	}
	getClienteCotizaciones(clienteId: number): Observable<any> {
		return this.http.get(`${this.apiUrlClientes}/cotizaciones/${clienteId}`);
	}
	createCliente(clienteData: any): Observable<any> {
		return this.http.post(`${this.apiUrlClientes}/create`, clienteData);
	}
	//LOCAL METHODS
	getAllLocales(): Observable<any> {
		return this.http.get(`${this.apiUrlLocales}/getall`);
	}
	getLocalById(id: number): Observable<any> {
		return this.http.get(`${this.apiUrlLocales}/getbyid/${id}`);
	}
	createLocal(localData: any): Observable<any> {
		return this.http.post(`${this.apiUrlLocales}/create`, localData);
	}
	updateLocal(localData: any): Observable<any> {
		return this.http.put(`${this.apiUrlLocales}/update`, localData);
	}
	deleteLocal(id: number): Observable<any> {
		return this.http.delete(`${this.apiUrlLocales}/delete/${id}`);
	}
	getFechasReservadas(localId: number): Observable<any> {
		return this.http.get(`${this.apiUrlLocales}/${localId}/fechas-reservadas`);
	}

	//EMPRESA METHODS
	getAllEmpresas(): Observable<any> {
		return this.http.get(`${this.apiUrlEmpresa}/getall`);
	}
	getEmpresaById(id: number): Observable<any> {
		return this.http.get(`${this.apiUrlEmpresa}/getbyid/${id}`);
	}
	updateEmpresa(empresaData: any): Observable<any> {
		return this.http.put(`${this.apiUrlEmpresa}/update`, empresaData);
	}

	//BLOG METHODS
	getAllBlogs(): Observable<any> {
		return this.http.get(`${this.apiUrlBlog}/getall`);
	}
	getBlogById(id: number): Observable<any> {
		return this.http.get(`${this.apiUrlBlog}/getbyid/${id}`);
	}
	createBlog(blogData: any): Observable<any> {
		return this.http.post(`${this.apiUrlBlog}/create`, blogData);
	}
	updateBlog(blogData: any): Observable<any> {
		return this.http.put(`${this.apiUrlBlog}/update`, blogData);
	}
	deleteBlog(id: number): Observable<any> {
		return this.http.delete(`${this.apiUrlBlog}/delete/${id}`);
	}
	//FORMULARIO CONTACTO METHODS
	getAllFormulario(): Observable<any> {
		return this.http.get(`${this.apiUrlFormulario}/getall`);
	}


	getAllServicios(): Observable<any> {
		return this.http.get(`${this.apiUrlServicio}/getall`);
	}
	getServicioById(id: number): Observable<any> {
		return this.http.get(`${this.apiUrlServicio}/getbyid/${id}`);
	}
	createServicio(localData: any): Observable<any> {
		return this.http.post(`${this.apiUrlServicio}/create`, localData);
	}
	updateServicio(localData: any): Observable<any> {
		return this.http.put(`${this.apiUrlServicio}/update`, localData);
	}
	deleteServicio(id: number): Observable<any> {
		return this.http.delete(`${this.apiUrlServicio}/delete/${id}`);
	}	


	getAllCotizaciones(): Observable<any> {
		return this.http.get(`${this.apiUrlCotizacion}/getall`);
	}	
	getCotizacionesById(id: number): Observable<any> {
		return this.http.get(`${this.apiUrlCotizacion}/getbyid/${id}`);
	}
	tomarCotizacion(id: number, usuarioId: number, usuarioNombre: string): Observable<any> {
		const params = new URLSearchParams({
			usuarioId: String(usuarioId),
			usuarioNombre: usuarioNombre || '',
		});
		return this.http.post(`${this.apiUrlCotizacion}/${id}/tomar?${params.toString()}`, {});
	}
	createCotizaciones(localData: any): Observable<any> {
		return this.http.post(`${this.apiUrlCotizacion}/create`, localData);
	}
	updateCotizaciones(localData: any): Observable<any> {
		return this.http.put(`${this.apiUrlCotizacion}/update`, localData);
	}
	updateCotizacionComentario(localData: any): Observable<any> {
		return this.http.put(`${this.apiUrlCotizacion}/update`, localData);
	}	
	deleteCotizaciones(id: number): Observable<any> {
		return this.http.delete(`${this.apiUrlCotizacion}/delete/${id}`);
	}	
	
	
	getAllEventos(): Observable<any> {
		return this.http.get(`${this.apiUrlEvento}/getall`);
	}	
	createEvento(localData: any): Observable<any> {
		return this.http.post(`${this.apiUrlEvento}/create`, localData);
	}		
	getEventoById(id: number): Observable<any> {
		return this.http.get(`${this.apiUrlEvento}/getbyid/${id}`);
	}
	updateEvento(eventoData: any): Observable<any> {
		return this.http.put(`${this.apiUrlEvento}/update`, eventoData);
	}
	deleteEvento(id: number): Observable<any> {
		return this.http.delete(`${this.apiUrlEvento}/delete/${id}`);
	}	

	//ROLE METHODS

	getAllRoles(): Observable<any> {
		return this.http.get(`${this.apiUrlRol}/getall`);
	}	
	getRolById(id: number): Observable<any> {
		return this.http.get(`${this.apiUrlRol}/getbyid/${id}`);
	}	
	deleteRol(id: number): Observable<any> {
		return this.http.delete(`${this.apiUrlRol}/delete/${id}`);
	}
	createRol(localData: any): Observable<any> {
		return this.http.post(`${this.apiUrlRol}/create`, localData);
	}	
	updateRol(localData: any): Observable<any> {
		return this.http.put(`${this.apiUrlRol}/update`, localData);
	}	
	
	getAllPages(): Observable<any> {
		return this.http.get(`${this.apiUrlPage}/getall`);
	}	
	getPageById(id: number): Observable<any> {
		return this.http.get(`${this.apiUrlPage}/getbyid/${id}`);
	}	
	deletePage(id: number): Observable<any> {
		return this.http.delete(`${this.apiUrlPage}/delete/${id}`);
	}
	createPage(localData: any): Observable<any> {
		return this.http.post(`${this.apiUrlPage}/create`, localData);
	}	
	updatePage(localData: any): Observable<any> {
		return this.http.put(`${this.apiUrlPage}/update`, localData);
	}		


	getAllPermisos(): Observable<any> {
		return this.http.get(`${this.apiUrlPermiso}/getall`);
	}	
	createPermiso(localData: any): Observable<any> {
		return this.http.post(`${this.apiUrlPermiso}/create`, localData);
	}			
	deletePermiso(id: number): Observable<any> {
		return this.http.delete(`${this.apiUrlPermiso}/delete/${id}`);
	}

	getPagoVouchersPendientes(): Observable<any> {
		return this.http.get(`${API.pagoVoucher}/pendientes`);
	}
	getPagoVouchersHistorial(estadoPago?: string): Observable<any> {
		const params = estadoPago ? { estadoPago } : undefined;
		return this.http.get(`${API.pagoVoucher}/historial`, { params });
	}
	countPagoVouchersPendientes(): Observable<any> {
		return this.http.get(`${API.pagoVoucher}/pendientes/count`);
	}
	reviewPagoVoucher(payload: { pagoVoucherID: number; aprobado: boolean; observacionAdmin?: string; fechaReservadaElegida?: string }): Observable<any> {
		return this.http.put(`${API.pagoVoucher}/revisar`, payload);
	}
	getPagoVoucherArchivo(id: number, inline = true): Observable<Blob> {
		return this.http.get(`${API.pagoVoucher}/${id}/archivo`, {
			params: { inline: String(inline) },
			responseType: 'blob',
		});
	}
	countCotizacionesRecientes(vistoDesde?: string | null): Observable<any> {
		const params = vistoDesde ? { vistoDesde } : undefined;
		return this.http.get(`${this.apiUrlCotizacion}/count/recientes`, { params });
	}
	uploadQrPago(empresaId: number, file: File): Observable<any> {
		const form = new FormData();
		form.append('archivo', file);
		return this.http.post(`${this.apiUrlEmpresa}/upload-qr-pago/${empresaId}`, form);
	}
	uploadCertificado(empresaId: number, file: File, claveCertificado: string): Observable<any> {
		const form = new FormData();
		form.append('archivo', file);
		form.append('claveCertificado', claveCertificado);
		return this.http.post(`${this.apiUrlEmpresa}/upload-certificado/${empresaId}`, form);
	}
	uploadMedia(file: File, folder: 'productos' | 'locales' | 'servicios' | 'eventos' | 'blog' | 'empresa'): Observable<any> {
		const form = new FormData();
		form.append('archivo', file);
		return this.http.post(`${API.media}/upload?folder=${folder}`, form);
	}
	resolveMediaUrl(url?: string | null): string {
		if (!url) return '';
		if (/^https?:\/\//i.test(url)) return url;
		const base = environment.apiBaseUrl.replace(/\/api\/v1\/?$/, '');
		return `${base}${url.startsWith('/') ? url : '/' + url}`;
	}
}
