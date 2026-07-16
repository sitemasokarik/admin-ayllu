/** Textos fijos de la cotización impresa Ayllu */
export const PDF_NOTAS = [
  'Se brindan 6 horas de servicio. Horas adicionales con costo extra.',
  'El pago de derecho de autor APDAYC es responsabilidad del cliente.',
  'Queda prohibida la propaganda política o religiosa en el local.',
  'Las modificaciones de catering y decoración deben confirmarse con aproximadamente 1 mes de anticipación.',
  'La lista de invitados debe entregarse 1 semana antes del evento.',
  'Si se ingresa licor externo, debe contar con registro sanitario vigente.',
];

export const PDF_CONDICIONES = [
  'Todos los pagos deben realizarse directamente a la empresa Ayllu Eventos & Catering, nunca a colaboradores.',
  'Los precios no incluyen el 18% de IGV, salvo indicación expresa en contrario.',
];

export const PDF_EQUIPO = [
  'Personal de cocina',
  '1 mozo cada 20 invitados',
  '1 mozo especial atención anfitrión',
  'Maitre',
  'Seguridad',
  'Anfitriona',
  'Supervisor/a',
  'Ama de llaves SS.HH.',
  'Maestro de ceremonias',
];

export const PDF_DJ = [
  '4 parlantes de 15 pulgadas JBL',
  'Consola 6 canales Behringer',
  '8 tachos LED',
  '2 micrófonos inalámbricos',
  '2 esferas de luz',
];

export const PDF_DESIGNER = [
  'Asesoría en diseño del evento',
  'Elección de mobiliario',
  'Planificación del catering',
  'Coordinación del timing',
  'Recomendación de proveedores',
];

export function packageTitle(tipoEvento: string): string {
  const t = (tipoEvento || 'Evento').trim();
  const lower = t.toLowerCase();
  if (/matrimonio|boda|wedding/.test(lower)) return 'Paquete de Matrimonios';
  if (/quince/.test(lower)) return 'Paquete de Quinceaños';
  if (/corporativ|empresa/.test(lower)) return 'Paquete Corporativo';
  if (/bautizo|bautismo/.test(lower)) return 'Paquete de Bautizo';
  if (/cumple/.test(lower)) return 'Paquete de Cumpleaños';
  if (/aniversario/.test(lower)) return 'Paquete de Aniversario';
  return `Paquete de ${t}`;
}

export function designerSectionTitle(tipoEvento: string): string {
  const lower = (tipoEvento || '').toLowerCase();
  if (/matrimonio|boda|wedding/.test(lower)) return 'WEDDING DESIGNER';
  return 'EVENT DESIGNER';
}

export function costoInclusionText(tipoEvento: string): string {
  const designer = designerSectionTitle(tipoEvento);
  return `Catering, Mobiliario, Decoración, Personal de Servicio, DJ Sonido e Iluminación, ${designer}`;
}

export function introLetter(tipoEvento: string): string[] {
  const tipo = tipoEvento || 'evento';
  return [
    `En Ayllu Eventos & Catering nos complace presentarle nuestra propuesta para su ${tipo}. Soy Benigna Tafur, wedding planner y event planner con mas de 8 anos de experiencia organizando celebraciones inolvidables.`,
    'Nuestro equipo se encargara de cada detalle para que usted y sus invitados disfruten de una experiencia unica, con servicio de catering, decoracion, personal especializado y coordinacion integral.',
    'Les presento nuestra propuesta.',
  ];
}

/** Rutas de imágenes del PDF (primera disponible gana) */
export const PDF_IMAGE_POOL = {
  portada: [
    'assets/images/pdf/portada.jpg',
    'assets/images/banner_presupuestador.jpg',
    'https://diintec.com/ayllu/assets/images/servicio-decoracion.jpg',
  ],
  catering: [
    'assets/images/pdf/catering-servicio.jpg',
    'assets/images/pdf/servicio-decoracion.jpg',
    'assets/images/banner_servicios.jpg',
    'https://diintec.com/ayllu/assets/images/servicio-decoracion.jpg',
  ],
  servicio: [
    'assets/images/pdf/servicio-mesa.jpg',
    'assets/images/banner_presupuestador.jpg',
    'https://diintec.com/ayllu/assets/images/servicio-decoracion.jpg',
  ],
  locales: [
    'assets/images/pdf/locales-salon.jpg',
    'assets/images/pdf/servicio-locales.jpg',
    'assets/images/banner_locales.jpg',
    'https://diintec.com/ayllu/assets/images/servicio-locales.jpg',
  ],
  equipo: [
    'assets/images/pdf/equipo-trabajo.jpg',
    'assets/images/banner_presupuestador.jpg',
    'https://diintec.com/ayllu/assets/images/servicio-locales.jpg',
  ],
  designer: [
    'assets/images/pdf/wedding-designer.jpg',
    'assets/images/banner_servicios.jpg',
    'https://diintec.com/ayllu/assets/images/servicio-decoracion.jpg',
  ],
};
