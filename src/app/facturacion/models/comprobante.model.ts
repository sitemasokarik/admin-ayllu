export type TipoComprobante = 'boleta' | 'factura';
export type ModoEmision = 'sunat' | 'solo_venta';

export interface ComprobanteItem {
  item: number;
  codigo: string;
  descripcion: string;
  idTipoIgv: string;
  tipoIgv: string;
  unidadMedida: string;
  valor: number;
  cantidad: number;
  subtotal: number;
  igv: number;
  importe: number;
}

export interface ComprobanteElectronico {
  id: string;
  tipo: TipoComprobante;
  serie: string;
  correlativo: string;
  numeroCompleto: string;
  cotizacionID: number;
  clienteNombre: string;
  clienteDocumento: string;
  tipoDocumento: string;
  clienteDireccion: string;
  clienteTelefono: string;
  fechaEmision: string;
  formaPago: string;
  medioPago: string;
  moneda: string;
  opGravadas: number;
  opInafectas: number;
  opExoneradas: number;
  subtotal: number;
  igv: number;
  total: number;
  recibido: number;
  vuelto: number;
  modoEmision?: ModoEmision;
  estado: 'Registrado' | 'Pendiente SUNAT' | 'Enviado SUNAT' | 'Aceptado' | 'Rechazado' | 'Anulado' | string;
  sunatRespuesta?: string;
  sunatCodigoError?: string;
  rutaXml?: string;
  rutaCdr?: string;
  montoAdelantoFacturado?: number;
  items: ComprobanteItem[];
  createdAt: string;
}
