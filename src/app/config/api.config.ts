import { environment } from '../../environments/environment';

export const API_BASE = environment.apiBaseUrl;

export const API = {
  usuario: `${API_BASE}/usuario`,
  rol: `${API_BASE}/rol`,
  categoria: `${API_BASE}/categoria`,
  producto: `${API_BASE}/Producto`,
  cliente: `${API_BASE}/Cliente`,
  local: `${API_BASE}/local`,
  empresa: `${API_BASE}/empresa`,
  blog: `${API_BASE}/blog`,
  contactanos: `${API_BASE}/contactanos`,
  servicio: `${API_BASE}/ServicioAdicional`,
  cotizacion: `${API_BASE}/cotizacion`,
  evento: `${API_BASE}/evento`,
  pagina: `${API_BASE}/pagina`,
  permiso: `${API_BASE}/permiso`,
  comprobante: `${API_BASE}/comprobante`,
  ticket: `${API_BASE}/ticket`,
  consultaDocumento: `${API_BASE}/consulta-documento`,
  pagoVoucher: `${API_BASE}/pago-voucher`,
  media: `${API_BASE}/media`,
};
