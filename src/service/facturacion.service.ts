import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API } from '../app/config/api.config';
import { FacturacionConfig } from '../app/facturacion/facturacion.config';
import {
  ComprobanteElectronico,
  ComprobanteItem,
  TipoComprobante,
} from '../app/facturacion/models/comprobante.model';

export interface EmpresaFacturacionConfig {
  empresaID: number;
  razonSocial: string;
  nombreComercial: string;
  ruc: string;
  direccion: string;
  email: string;
  telefono: string;
  ubigeo?: string;
  generaFactElect: boolean;
  sunatConfigurado: boolean;
  sunatModo: string;
  sunatWsUrlActivo?: string;
  sunatIntegrado: boolean;
}

export interface CotizacionFacturacionInfo {
  cotizacionID: number;
  clienteNombre: string;
  clienteDocumento: string;
  clienteDireccion?: string;
  clienteTelefono?: string;
  montoAdelanto: number;
  pagoVoucherID?: number;
  pagoMercadoPagoID?: number;
  metodoPago: string;
}

@Injectable({ providedIn: 'root' })
export class FacturacionService {
  private readonly baseUrl = API.comprobante;
  private readonly cotizacionUrl = API.cotizacion;
  private readonly empresaUrl = API.empresa;

  constructor(private http: HttpClient) {}

  getFacturacionConfig(): Observable<EmpresaFacturacionConfig> {
    return this.http.get<any>(`${this.empresaUrl}/facturacion-config`).pipe(
      map((res) => ({
        empresaID: res.data.empresaID,
        razonSocial: res.data.razonSocial,
        nombreComercial: res.data.nombreComercial,
        ruc: res.data.ruc,
        direccion: res.data.direccion,
        email: res.data.email,
        telefono: res.data.telefono,
        ubigeo: res.data.ubigeo,
        generaFactElect: !!res.data.generaFactElect,
        sunatConfigurado: !!res.data.sunatConfigurado,
        sunatModo: res.data.sunatModo || 'DESARROLLO',
        sunatWsUrlActivo: res.data.sunatWsUrlActivo,
        sunatIntegrado: !!res.data.sunatIntegrado,
      }))
    );
  }

  getCotizacionFacturacion(cotizacionId: number): Observable<CotizacionFacturacionInfo> {
    return this.http.get<any>(`${this.cotizacionUrl}/${cotizacionId}/facturacion`).pipe(
      map((res) => ({
        cotizacionID: res.data.cotizacionID,
        clienteNombre: res.data.clienteNombre,
        clienteDocumento: res.data.clienteDocumento,
        clienteDireccion: res.data.clienteDireccion,
        clienteTelefono: res.data.clienteTelefono,
        montoAdelanto: Number(res.data.montoAdelanto),
        pagoVoucherID: res.data.pagoVoucherID,
        pagoMercadoPagoID: res.data.pagoMercadoPagoID,
        metodoPago: res.data.metodoPago,
      }))
    );
  }

  reenviarSunat(comprobanteId: string | number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${comprobanteId}/reenviar-sunat`, {});
  }

  descargarArchivo(comprobanteId: string | number, tipo: 'xml' | 'cdr'): void {
    window.open(`${this.baseUrl}/${comprobanteId}/descargar?tipo=${tipo}`, '_blank');
  }

  getComprobantes(tipo?: TipoComprobante): Observable<ComprobanteElectronico[]> {
    const params = tipo ? { tipo } : undefined;
    return this.http.get<any>(`${this.baseUrl}/getall`, { params }).pipe(
      map((res) => (res.data || []).map((item: any) => this.mapFromApi(item)))
    );
  }

  emitirComprobante(
    comprobante: Omit<ComprobanteElectronico, 'id' | 'createdAt' | 'correlativo' | 'numeroCompleto' | 'estado'> & {
      estado?: ComprobanteElectronico['estado'];
    }
  ): Observable<ComprobanteElectronico> {
    const payload = {
      tipo: comprobante.tipo,
      serie: comprobante.serie,
      cotizacionID: comprobante.cotizacionID,
      clienteNombre: comprobante.clienteNombre,
      clienteDocumento: comprobante.clienteDocumento,
      tipoDocumento: comprobante.tipoDocumento,
      clienteDireccion: comprobante.clienteDireccion,
      clienteTelefono: comprobante.clienteTelefono,
      fechaEmision: comprobante.fechaEmision,
      formaPago: comprobante.formaPago,
      medioPago: comprobante.medioPago,
      moneda: comprobante.moneda,
      opGravadas: comprobante.opGravadas,
      opInafectas: comprobante.opInafectas,
      opExoneradas: comprobante.opExoneradas,
      subtotal: comprobante.subtotal,
      igv: comprobante.igv,
      total: comprobante.total,
      recibido: comprobante.recibido,
      vuelto: comprobante.vuelto,
      modoEmision: comprobante.modoEmision ?? 'solo_venta',
      items: comprobante.items.map((item) => ({
        item: item.item,
        codigo: item.codigo,
        descripcion: item.descripcion,
        idTipoIgv: item.idTipoIgv,
        tipoIgv: item.tipoIgv,
        unidadMedida: item.unidadMedida,
        valor: item.valor,
        cantidad: item.cantidad,
        subtotal: item.subtotal,
        igv: item.igv,
        importe: item.importe,
      })),
    };

    return this.http.post<any>(`${this.baseUrl}/emitir`, payload).pipe(
      map((res) => this.mapFromApi(res.data))
    );
  }

  previewCorrelativo(tipo: TipoComprobante): string {
    return '00000001';
  }

  buildItemsFromAdelanto(cotizacionId: number, montoAdelanto: number, idTipoIgv = '10'): ComprobanteItem[] {
    const tipo = FacturacionConfig.tiposIgv.find((t) => t.id === idTipoIgv) ?? FacturacionConfig.tiposIgv[0];
    const tipoLabel = tipo.label;

    if (tipo.aplicaIgv) {
      const total = montoAdelanto;
      const base = total / (1 + FacturacionConfig.igvRate);
      const igv = total - base;

      return [
        {
          item: 1,
          codigo: `COT-${cotizacionId}`,
          descripcion: `Adelanto reserva evento - Cot. #${cotizacionId}`,
          idTipoIgv: tipo.id,
          tipoIgv: tipoLabel,
          unidadMedida: 'ZZ',
          valor: this.round(base),
          cantidad: 1,
          subtotal: this.round(base),
          igv: this.round(igv),
          importe: this.round(total),
        },
      ];
    }

    return [
      {
        item: 1,
        codigo: `COT-${cotizacionId}`,
        descripcion: `Adelanto reserva evento - Cot. #${cotizacionId}`,
        idTipoIgv: tipo.id,
        tipoIgv: tipoLabel,
        unidadMedida: 'ZZ',
        valor: this.round(montoAdelanto),
        cantidad: 1,
        subtotal: this.round(montoAdelanto),
        igv: 0,
        importe: this.round(montoAdelanto),
      },
    ];
  }

  calculateTotals(items: ComprobanteItem[]) {
    const gravadas = items
      .filter((i) => i.idTipoIgv === '10')
      .reduce((s, i) => s + i.subtotal, 0);
    const exoneradas = items
      .filter((i) => i.idTipoIgv === '20')
      .reduce((s, i) => s + i.importe, 0);
    const inafectas = items
      .filter((i) => i.idTipoIgv === '30')
      .reduce((s, i) => s + i.importe, 0);
    const igv = items.reduce((s, i) => s + i.igv, 0);
    const total = items.reduce((s, i) => s + i.importe, 0);

    return {
      opGravadas: this.round(gravadas),
      opInafectas: this.round(inafectas),
      opExoneradas: this.round(exoneradas),
      subtotal: this.round(gravadas + exoneradas + inafectas),
      igv: this.round(igv),
      total: this.round(total),
    };
  }

  private mapFromApi(item: any): ComprobanteElectronico {
    return {
      id: String(item.comprobanteID ?? item.id),
      tipo: item.tipo,
      serie: item.serie,
      correlativo: item.correlativo,
      numeroCompleto: item.numeroCompleto,
      cotizacionID: item.cotizacionID,
      clienteNombre: item.clienteNombre,
      clienteDocumento: item.clienteDocumento,
      tipoDocumento: item.tipoDocumento,
      clienteDireccion: item.clienteDireccion ?? '',
      clienteTelefono: item.clienteTelefono ?? '',
      fechaEmision: this.formatDate(item.fechaEmision),
      formaPago: item.formaPago,
      medioPago: item.medioPago,
      moneda: item.moneda,
      opGravadas: Number(item.opGravadas),
      opInafectas: Number(item.opInafectas),
      opExoneradas: Number(item.opExoneradas),
      subtotal: Number(item.subtotal),
      igv: Number(item.igv),
      total: Number(item.total),
      recibido: Number(item.recibido),
      vuelto: Number(item.vuelto),
      modoEmision: item.modoEmision,
      estado: item.estadoComprobante ?? item.estado ?? 'Registrado',
      sunatRespuesta: item.sunatRespuesta,
      sunatCodigoError: item.sunatCodigoError,
      rutaXml: item.rutaXml,
      rutaCdr: item.rutaCdr,
      montoAdelantoFacturado: Number(item.montoAdelantoFacturado || 0),
      items: (item.items || []).map((d: any) => ({
        item: d.item,
        codigo: d.codigo,
        descripcion: d.descripcion,
        idTipoIgv: d.idTipoIgv,
        tipoIgv: d.tipoIgv,
        unidadMedida: d.unidadMedida,
        valor: Number(d.valor),
        cantidad: Number(d.cantidad),
        subtotal: Number(d.subtotal),
        igv: Number(d.igv),
        importe: Number(d.importe),
      })),
      createdAt: item.fechaCreacion ?? new Date().toISOString(),
    };
  }

  private formatDate(value: any): string {
    if (!value) return new Date().toISOString().split('T')[0];
    if (typeof value === 'string' && value.includes('T')) {
      return value.split('T')[0];
    }
    return String(value).substring(0, 10);
  }

  private round(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
