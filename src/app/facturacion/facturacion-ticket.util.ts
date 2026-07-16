import { FacturacionConfig } from './facturacion.config';
import { ComprobanteElectronico } from './models/comprobante.model';

export interface TicketEmisorInfo {
  razonSocial?: string;
  ruc?: string;
  direccion?: string;
  nombreComercial?: string;
}

function fmtMoney(value: number): string {
  return `S/ ${value.toFixed(2)}`;
}

function fmtDate(value: string): string {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('es-PE');
}

export function buildTicketHtml(comprobante: ComprobanteElectronico, emisorOverride?: TicketEmisorInfo): string {
  const emisor = {
    ...FacturacionConfig.empresaEmisora,
    ...(emisorOverride || {}),
  };
  const tipoLabel = comprobante.tipo === 'boleta' ? 'BOLETA DE VENTA ELECTRÓNICA' : 'FACTURA ELECTRÓNICA';
  const nombreComercial = emisor.nombreComercial || 'Ayllu Eventos';

  const itemsRows = comprobante.items
    .map(
      (item) => `
      <tr>
        <td colspan="3" class="bold">${item.codigo} · ${item.descripcion}</td>
      </tr>
      <tr>
        <td>${item.cantidad} ${item.unidadMedida}</td>
        <td>IGV ${item.idTipoIgv}</td>
        <td class="right">${fmtMoney(item.valor)} c/u</td>
      </tr>
      <tr>
        <td>Subtotal</td>
        <td>IGV ${fmtMoney(item.igv)}</td>
        <td class="right bold">${fmtMoney(item.importe)}</td>
      </tr>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>Ticket ${comprobante.numeroCompleto}</title>
  <style>
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      min-height: 100%;
      background: #ececec;
    }
    body {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding: 24px 12px;
    }
    .ticket-wrap {
      width: 80mm;
      max-width: 100%;
      background: #fff;
      box-shadow: 0 2px 12px rgba(0,0,0,0.12);
      padding: 14px 12px;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 12px;
      color: #111;
    }
    .center { text-align: center; }
    .right { text-align: right; }
    .bold { font-weight: 700; }
    .title { font-size: 13px; font-weight: 700; margin: 8px 0; }
    .divider { border-top: 1px dashed #333; margin: 8px 0; }
    table { width: 100%; border-collapse: collapse; }
    td { vertical-align: top; padding: 3px 0; }
    .totals td { padding: 2px 0; }
    .total-main { font-size: 14px; font-weight: 700; }
    @media print {
      html, body {
        background: #fff;
        padding: 0;
      }
      body {
        display: block;
      }
      .ticket-wrap {
        width: 80mm;
        margin: 0 auto;
        box-shadow: none;
        padding: 8px 6px;
      }
    }
  </style>
</head>
<body>
  <div class="ticket-wrap">
    <div class="center bold">${emisor.razonSocial}</div>
    <div class="center">RUC: ${emisor.ruc}</div>
    <div class="center">${emisor.direccion}</div>
    <div class="divider"></div>
    <div class="center title">${tipoLabel}</div>
    <div class="center bold">${comprobante.numeroCompleto}</div>
    <div class="divider"></div>
    <table>
      <tr><td>Fecha emisión</td><td class="right">${fmtDate(comprobante.fechaEmision)}</td></tr>
      <tr><td>Forma pago</td><td class="right">${comprobante.formaPago}</td></tr>
      <tr><td>Medio pago</td><td class="right">${comprobante.medioPago}</td></tr>
      <tr><td>Moneda</td><td class="right">${comprobante.moneda}</td></tr>
    </table>
    <div class="divider"></div>
    <div class="bold">Cliente</div>
    <div>${comprobante.clienteNombre}</div>
    <div>${comprobante.tipoDocumento}: ${comprobante.clienteDocumento}</div>
    <div>${comprobante.clienteDireccion || '-'}</div>
    <div>Tel: ${comprobante.clienteTelefono || '-'}</div>
    <div class="divider"></div>
    <table>
      <thead>
        <tr class="bold">
          <td>Cant</td>
          <td>Descripción</td>
          <td class="right">Importe</td>
        </tr>
      </thead>
      <tbody>${itemsRows}</tbody>
    </table>
    <div class="divider"></div>
    <table class="totals">
      <tr><td>Op. gravadas</td><td class="right">${fmtMoney(comprobante.opGravadas)}</td></tr>
      <tr><td>Op. inafectas</td><td class="right">${fmtMoney(comprobante.opInafectas)}</td></tr>
      <tr><td>Op. exoneradas</td><td class="right">${fmtMoney(comprobante.opExoneradas)}</td></tr>
      <tr><td>Subtotal</td><td class="right">${fmtMoney(comprobante.subtotal)}</td></tr>
      <tr><td>IGV</td><td class="right">${fmtMoney(comprobante.igv)}</td></tr>
      <tr class="total-main"><td>TOTAL</td><td class="right">${fmtMoney(comprobante.total)}</td></tr>
      <tr><td>Recibido</td><td class="right">${fmtMoney(comprobante.recibido)}</td></tr>
      <tr><td>Vuelto</td><td class="right">${fmtMoney(comprobante.vuelto)}</td></tr>
    </table>
    <div class="divider"></div>
    <div class="center">Representación impresa del comprobante</div>
    <div class="center">${nombreComercial}</div>
  </div>
  <script>
    window.onload = function() {
      setTimeout(function() { window.print(); }, 300);
    };
  </script>
</body>
</html>`;
}

/** Abre ventana centrada del ticket e inicia impresión (PDF desde el diálogo del navegador). */
export function openTicketPreview(
  comprobante: ComprobanteElectronico,
  emisorOverride?: TicketEmisorInfo
): Window | null {
  const html = buildTicketHtml(comprobante, emisorOverride);
  const win = window.open('', '_blank', 'width=440,height=780,scrollbars=yes');
  if (!win) return null;
  win.document.open();
  win.document.write(html);
  win.document.close();
  return win;
}

/** @deprecated Usar openTicketPreview para imprimir desde el navegador. */
export function downloadTicket(comprobante: ComprobanteElectronico, emisorOverride?: TicketEmisorInfo): void {
  openTicketPreview(comprobante, emisorOverride);
}
