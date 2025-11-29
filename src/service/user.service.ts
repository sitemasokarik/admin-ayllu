import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class UserService {
	private apiUrl = "http://caeteringdcodepe.runasp.net/api/v1/usuario"; // URL completa de tu API

	constructor(private http: HttpClient) {}

	// Obtener todos los usuarios
	getAll(): Observable<any> {
		return this.http.get(`${this.apiUrl}/getall`);
	}

	// Crear usuario
	createUser(userData: any): Observable<any> {
		return this.http.post(`${this.apiUrl}/create`, userData);
	}

	// Eliminar usuario
	delete(id: number): Observable<any> {
		return this.http.delete(`${this.apiUrl}/delete/${id}`);
	}
}
