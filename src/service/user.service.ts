import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://caeteringdcodepe.runasp.net/api/v1/usuario'; // 👈 Cambia si usas otra ruta base

  constructor(private http: HttpClient) {}

  // ⭐ Obtener todos los usuarios
  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getAll`);
  }

  // ⭐ Crear usuario
  createUser(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, data);
  }

  // ⭐ Obtener usuario por ID
  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // ⭐ Actualizar usuario
  updateUser(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, data);
  }

  // ⭐ Eliminar usuario
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
}
