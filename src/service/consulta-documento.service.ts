import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API } from '../app/config/api.config';

export interface ConsultaDocumentoResult {
  esValido: boolean;
  numeroDocumento: string;
  nombreORazonSocial?: string;
  direccion?: string;
  estado?: string;
  condicion?: string;
  tipoDocumento: string;
  mensaje?: string;
  consultaApi: boolean;
  fuente?: string;
  clienteTelefono?: string;
}

@Injectable({ providedIn: 'root' })
export class ConsultaDocumentoService {
  private readonly baseUrl = API.consultaDocumento;

  constructor(private http: HttpClient) {}

  consultarDni(numero: string): Observable<ConsultaDocumentoResult> {
    const doc = numero.replace(/\D/g, '');
    return this.http.get<any>(`${this.baseUrl}/dni/${doc}`).pipe(
      map((res) => this.mapResponse(res))
    );
  }

  consultarRuc(numero: string): Observable<ConsultaDocumentoResult> {
    const doc = numero.replace(/\D/g, '');
    return this.http.get<any>(`${this.baseUrl}/ruc/${doc}`).pipe(
      map((res) => this.mapResponse(res))
    );
  }

  private mapResponse(res: any): ConsultaDocumentoResult {
    const data = res?.data ?? res;
    return {
      esValido: data.esValido ?? data.EsValido ?? false,
      numeroDocumento: data.numeroDocumento ?? data.NumeroDocumento ?? '',
      nombreORazonSocial: data.nombreORazonSocial ?? data.NombreORazonSocial,
      direccion: data.direccion ?? data.Direccion,
      estado: data.estado ?? data.Estado,
      condicion: data.condicion ?? data.Condicion,
      tipoDocumento: data.tipoDocumento ?? data.TipoDocumento ?? '',
      mensaje: data.mensaje ?? data.Mensaje,
      consultaApi: data.consultaApi ?? data.ConsultaApi ?? false,
      fuente: data.fuente ?? data.Fuente,
      clienteTelefono: data.clienteTelefono ?? data.ClienteTelefono,
    };
  }
}
