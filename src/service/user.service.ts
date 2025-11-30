import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class UserService {
	private apiUrl = "http://caeteringdcodepe.runasp.net/api/v1/usuario"; // URL completa de tu API
	private apiUrlCategorias = "http://caeteringdcodepe.runasp.net/api/v1/categoria"; // URL completa de tu API
	private apiUrlProductos = "http://caeteringdcodepe.runasp.net/api/v1/Producto"; // URL completa de tu API
	private apiUrlClientes = "http://caeteringdcodepe.runasp.net/api/v1/Cliente"; // URL completa de tu API
	private apiUrlLocales = "http://caeteringdcodepe.runasp.net/api/v1/local"; // URL de tu API de Local
	private apiUrlEmpresa = "http://caeteringdcodepe.runasp.net/api/v1/empresa"; // <-- URL de Empresa

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
		return this.http.get(`${this.apiUrlLocales}/get-all`);
	}
	getLocalById(id: number): Observable<any> {
		return this.http.get(`${this.apiUrlLocales}/get-by-id/${id}`);
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
}
