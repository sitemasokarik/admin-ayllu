import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

export async function generarPDF(data: any) {

  const existingPdfBytes = await fetch('assets/tu_pdf_base.pdf').then(res => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  pdfDoc.registerFontkit(fontkit);

  const fontBytes = await fetch('assets/Roboto-VariableFont_wdth,wght.ttf').then(res => res.arrayBuffer());
  const font = await pdfDoc.embedFont(fontBytes);

  let page = pdfDoc.getPages()[0];
  let { width, height } = page.getSize();

  const MARGIN = 50;
  const LIST_INDENT = 70;

  let y = height - 120;

  // -----------------------------------
  // CENTERED TITLE WRAPPER
  // -----------------------------------
  const centered = (text: string, size = 18, spacing = 28) => {
    if (y < 100) newPage();
    const textWidth = font.widthOfTextAtSize(text, size);
    const x = (width - textWidth) / 2;
    page.drawText(text, { x, y, size, font });
    y -= spacing;
  };

  const sectionTitle = (text: string, spacing = 22) => {
    if (y < 120) newPage();
    page.drawText(text, { x: MARGIN, y, size: 14, font, color: rgb(0.2, 0.2, 0.2) });
    y -= spacing;
  };

  const line = (text: string, spacing = 16, indent = false) => {
    if (y < 80) newPage();
    page.drawText(text, { x: indent ? LIST_INDENT : MARGIN, y, size: 11, font });
    y -= spacing;
  };

  // -----------------------------------
  // HEADER + FOOTER
  // -----------------------------------
  const drawHeader = () => {
    centered("EVENTOS AYLLU", 20, 26);
    centered("Cotización personalizada", 12, 40);
  };

  const drawFooter = () => {
    page.drawText("Jr. de la Unión 364 – Lima", { x: MARGIN, y: 40, size: 10, font });
    page.drawText("Cel: 978 561 182 / 957 915 971 / 01 782 2192", { x: MARGIN, y: 26, size: 10, font });
    page.drawText("www.eventosayllu.com", { x: MARGIN, y: 12, size: 10, font });
  };

  const newPage = () => {
    drawFooter();
    page = pdfDoc.addPage();
    width = page.getWidth();
    height = page.getHeight();
    y = height - 120;
    drawHeader();
  };

  drawHeader();

  // -----------------------------------
  // CONTENT
  // -----------------------------------

  centered("PAQUETE DE EVENTOS", 18, 35);

  sectionTitle("Datos del Cliente");
  line(`Estimado: ${data.cliente.nombre} ${data.cliente.apellido}`);
  line(`Teléfonos: ${data.cliente.telefono1} / ${data.cliente.telefono2}`);
  line(`Fechas tentativas: ${data.evento.fecha1} o ${data.evento.fecha2}`);
  line(`Salón deseado: ${data.local.nombre}`);
  line(`Cantidad de invitados: ${data.evento.invitados}`);
  line(`Tipo de evento: ${data.evento.tipo}`);

  sectionTitle("Servicio de Catering");
  line("El cóctel de bienvenida se brinda al inicio de la recepción.");
  line("A continuación, la opción seleccionada es:");
  line(`• ${data.categorias.coctel.nombre}`, 16, true);

  sectionTitle("Entremeses Salados");
  line("Los seleccionados son:");
  data.categorias.entremeses.forEach((item: any) => line(`• ${item.nombre}`, 16, true));

  sectionTitle("Platos de Entrada");
  line(`• ${data.categorias.entrada.nombre}`, 16, true);

  sectionTitle("Platos de Fondo");
  line(`• ${data.categorias.fondo.nombre}`, 16, true);

  sectionTitle("Cena de Gala");
  line("La cena incluye degustación previa.");
  line("Se sirve en 2 tiempos: entrada y fondo.");
  line("Cada fondo incluye proteína, arroz y ensalada.");

  line("");
  line("Degustación:");
  line("• 2 variedades de entrada", 16, true);
  line("• 2 variedades de fondo", 16, true);

  sectionTitle("Mobiliario y Decoración en Flores Naturales");
  (data.categorias.mesasSillas || []).forEach((m: any) => line(`• ${m.nombre}`, 16, true));

  sectionTitle("Menajería");
  (data.categorias.menajeria || []).forEach((m: any) => line(`• ${m.nombre}`, 16, true));

  sectionTitle("Fuentes");
  (data.categorias.fuentes || []).forEach((m: any) => line(`• ${m.nombre}`, 16, true));

  sectionTitle("Equipo de Trabajo (Incluido)");
  [
    "Personal de cocina",
    "1 mozo cada 20 invitados",
    "1 mozo especial atención anfitrión",
    "Maitre",
    "Seguridad",
    "Anfitriona",
    "Supervisor/a",
    "Ama de llaves SS.HH.",
    "Maestro de ceremonias"
  ].forEach(t => line(`• ${t}`, 16, true));

  sectionTitle("DJ, Sonido e Iluminación");
  [
    "4 parlantes de 15 pulgadas JBL",
    "Consola 6 canales",
    "8 tachos LED",
    "2 micrófonos inalámbricos",
    "2 esferas de luz"
  ].forEach(t => line(`• ${t}`, 16, true));

  sectionTitle("Event Designer");
  [
    "Asesoría en diseño del evento",
    "Elección de mobiliario",
    "Planificación del catering",
    "Coordinación del timing",
    "Recomendación de proveedores"
  ].forEach(t => line(`• ${t}`, 16, true));

  sectionTitle("Servicios Adicionales");
  data.adicionales.forEach((a: any) => line(`• ${a.nombre}`, 16, true));

  sectionTitle("Resumen de Presupuesto");
  line(`Costo por invitado: S/ ${data.totales.costoPorInvitado}`);
  line(`Garantía Catering: S/ ${data.totales.garantia}`);
  line(`Alquiler de salón: S/ ${data.local.precioAlquiler}`);
  line(`Total Final: S/ ${data.totales.totalFinal}`);

  drawFooter();

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
