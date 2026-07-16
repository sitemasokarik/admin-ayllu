import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API } from '../app/config/api.config';

export interface TicketInterno {
  ticketID: number;
  titulo: string;
  descripcion: string;
  estadoTicket: string;
  prioridad: string;
  creadoPorUsuarioID?: number;
  asignadoUsuarioID?: number;
  asignadoUsuarioNombre?: string;
  creadoPorClienteID?: number;
  rolDestinoID?: number;
  cotizacionID?: number;
  totalMensajes?: number;
  fechaCreacion: string;
}

@Injectable({ providedIn: 'root' })
export class TicketService {
  private readonly baseUrl = API.ticket;

  constructor(private http: HttpClient) {}

  getAll(usuarioId?: number): Observable<any> {
    const params = usuarioId ? { usuarioId: String(usuarioId) } : undefined;
    return this.http.get(`${this.baseUrl}/getall`, { params });
  }

  create(payload: {
    titulo: string;
    descripcion: string;
    prioridad?: string;
    creadoPorUsuarioID?: number;
    asignadoUsuarioID?: number;
    cotizacionID?: number;
    rolDestinoID?: number;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, {
      titulo: payload.titulo,
      descripcion: payload.descripcion,
      prioridad: payload.prioridad ?? 'Media',
      creadoPorUsuarioID: payload.creadoPorUsuarioID,
      asignadoUsuarioID: payload.asignadoUsuarioID,
      cotizacionID: payload.cotizacionID,
      rolDestinoID: payload.rolDestinoID,
      estadoTicket: 'Abierto',
    });
  }

  addMensaje(payload: {
    ticketID: number;
    mensaje: string;
    usuarioID?: number;
    clienteID?: number;
    autorNombre?: string;
    esInterno?: boolean;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/mensaje`, {
      ticketID: payload.ticketID,
      mensaje: payload.mensaje,
      usuarioID: payload.usuarioID,
      clienteID: payload.clienteID,
      autorNombre: payload.autorNombre ?? 'Usuario',
      esInterno: payload.esInterno ?? false,
    });
  }

  updateEstado(payload: { ticketID: number; estadoTicket: string }): Observable<any> {
    return this.http.put(`${this.baseUrl}/estado`, payload);
  }

  getDetalle(ticketId: number, usuarioId?: number): Observable<any> {
    const params = usuarioId ? { usuarioId: String(usuarioId) } : undefined;
    return this.http.get(`${this.baseUrl}/getbyid/${ticketId}`, { params });
  }

  countAlertas(usuarioId?: number): Observable<any> {
    const params = usuarioId ? { usuarioId: String(usuarioId) } : undefined;
    return this.http.get(`${this.baseUrl}/count/alertas`, { params });
  }
}
