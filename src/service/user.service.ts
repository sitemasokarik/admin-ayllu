import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class UserService {
	private apiUrl = "https://aylluperuback.premiumasp.net/api/v1/usuario"; // URL completa de tu API
	private apiUrlCategorias = "https://aylluperuback.premiumasp.net/api/v1/categoria"; // URL completa de tu API
	private apiUrlProductos = "https://aylluperuback.premiumasp.net/api/v1/Producto"; // URL completa de tu API
	private apiUrlClientes = "https://aylluperuback.premiumasp.net/api/v1/Cliente"; // URL completa de tu API
	private apiUrlLocales = "https://aylluperuback.premiumasp.net/api/v1/local"; // URL de tu API de Local
	private apiUrlEmpresa = "https://aylluperuback.premiumasp.net/api/v1/empresa"; // <-- URL de Empresa
	private apiUrlBlog = "https://aylluperuback.premiumasp.net/api/v1/blog";
	private apiUrlFormulario = "https://aylluperuback.premiumasp.net/api/v1/contactanos";
	private apiUrlServicio = "https://aylluperuback.premiumasp.net/api/v1/ServicioAdicional";
	private apiUrlCotizacion = "https://aylluperuback.premiumasp.net/api/v1/cotizacion";
	private apiUrlEvento = "https://aylluperuback.premiumasp.net/api/v1/evento";
	private apiUrlRol = "https://aylluperuback.premiumasp.net/api/v1/rol";
	private apiUrlPage = "https://aylluperuback.premiumasp.net/api/v1/pagina";
	private apiUrlPermiso = "https://aylluperuback.premiumasp.net/api/v1/permiso";

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
	createCotizaciones(localData: any): Observable<any> {
		return this.http.post(`${this.apiUrlCotizacion}/create`, localData);
	}
	updateCotizaciones(localData: any): Observable<any> {
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
}
