/**
 * Datos internos del emisor. Edita este archivo para cambiar la empresa emisora.
 * La integración SUNAT usará estos mismos valores más adelante.
 */
export const FacturacionConfig = {
  empresaEmisora: {
    ruc: '20601234567',
    razonSocial: 'AYLLU EVENTOS SAC',
    nombreComercial: 'Ayllu Eventos',
    direccion: 'Jr. de la Unión 364, Lima',
    ubigeo: '150101',
    departamento: 'Lima',
    provincia: 'Lima',
    distrito: 'Cercado de Lima',
  },
  moneda: 'PEN',
  monedaLabel: 'PEN - SOLES',
  igvRate: 0.18,
  series: {
    boleta: 'B001',
    factura: 'F001',
  },
  tipoOperacion: '0101 - Venta interna',
  formasPago: ['Contado'],
  mediosPago: ['EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'YAPE/PLIN'],
  tiposIgv: [
    { id: '10', label: 'Gravado - Operación Onerosa', aplicaIgv: true },
    { id: '20', label: 'Exonerado', aplicaIgv: false },
    { id: '30', label: 'Inafecto', aplicaIgv: false },
  ],
  /** Cambiar a true cuando la integración SUNAT esté activa */
  sunatIntegrado: false,
};
