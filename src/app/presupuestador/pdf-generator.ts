import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

export async function generarPDF(data: any) {

  // Cargar PDF base (1 página en blanco)
  const existingPdfBytes = await fetch('assets/tu_pdf_base.pdf').then(res => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  pdfDoc.registerFontkit(fontkit);

  // Fuente
  const fontBytes = await fetch('assets/Roboto-VariableFont_wdth,wght.ttf').then(res => res.arrayBuffer());
  const font = await pdfDoc.embedFont(fontBytes);

  let page = pdfDoc.getPages()[0];
  let { width, height } = page.getSize();

  let x = 40;
  let y = height - 80; // espacio para encabezado

  // ------------------------------
  // Helpers
  // ------------------------------
  const newPage = () => {
    page = pdfDoc.addPage();
    width = page.getWidth();
    height = page.getHeight();
    x = 40;
    y = height - 80;

    drawHeader();
  };

  const line = (text: string, spacing = 16) => {
    if (y < 80) {   // espacio para pie
      drawFooter();
      newPage();
    }
    page.drawText(text, { x, y, size: 11, font, color: rgb(0, 0, 0) });
    y -= spacing;
  };

  const title = (text: string, spacing = 22) => {
    if (y < 100) {
      drawFooter();
      newPage();
    }
    page.drawText(text, { x, y, size: 14, font, color: rgb(0, 0, 0) });
    y -= spacing;
  };

  // ------------------------------
  // Encabezado y pie
  // ------------------------------
  const drawHeader = () => {
    page.drawText("EVENTOS AYLLU", { x: 40, y: height - 40, size: 16, font });
    page.drawText("Cotización personalizada", { x: 40, y: height - 60, size: 12, font });
  };

  const drawFooter = () => {
    page.drawText("Jr. de la Unión 364 – Lima", { x: 40, y: 40, size: 10, font });
    page.drawText("Cel: 978 561 182 / 957 915 971 / 01 782 2192", { x: 40, y: 27, size: 10, font });
    page.drawText("www.eventosayllu.com", { x: 40, y: 14, size: 10, font });
  };

  drawHeader();

  // ------------------------------
  // CONTENIDO DINÁMICO
  // ------------------------------

  title("PAQUETE DE EVENTOS");

  line(`Estimado: ${data.cliente.nombre} ${data.cliente.apellido}`);
  line(`Teléfonos: ${data.cliente.telefono1} / ${data.cliente.telefono2}`);
  line(`Fechas tentativas: ${data.evento.fecha1} o ${data.evento.fecha2}`);
  line(`Salón deseado: ${data.local.nombre}`);
  line(`Cantidad de invitados: ${data.evento.invitados}`);
  line(`Tipo de evento: ${data.evento.tipo}`);

  // ------------------------------
  // SERVICIO DE CATERING
  // ------------------------------
  title("SERVICIO DE CATERING");

  line("El coctel de bienvenida se brinda al inicio de la recepción, los invitados socializan mientras");
  line("esperan la llegada de los novios. A continuación, la opción seleccionada es:");
  line(`• ${data.categorias.coctel.nombre}`);

  // ------------------------------
  // ENTREMESSES
  // ------------------------------
  title("ENTREMESSES SALADOS");

  line("Se deben elegir 5 variedades. Los seleccionados son:");

  data.categorias.entremeses.forEach((item: any) => {
    line(`• ${item.nombre}`);
  });

  // ------------------------------
  // ENTRADA
  // ------------------------------
  title("PLATOS DE ENTRADA");
  line(`• ${data.categorias.entrada.nombre}`);

  // ------------------------------
  // FONDO
  // ------------------------------
  title("PLATOS DE FONDO");
  line(`• ${data.categorias.fondo.nombre}`);

  // ------------------------------
  // TEXTOS FIJOS DE LA CENA
  // ------------------------------
  title("CENA DE GALA");
  line("La cena de gala incluye degustación previa. Se sirve en 2 tiempos: entrada y fondo,");
  line("cada fondo incluye 3 complementos (proteína, arroz y ensalada).");
  line("");
  line("Degustación:");
  line("Los novios elegirán 2 variedades de entrada y 2 de fondo para degustación previa.");
  line("La opción elegida será la servida a todos los invitados.");

  // ------------------------------
  // MOBILIARIO
  // ------------------------------
  title("MOBILIARIO Y DECORACIÓN EN FLORES NATURALES");

  const mesas = data.categorias.mesasSillas || [];
  mesas.forEach((m: any) => line(`• ${m.nombre}`));

  title("MANAJERÍA");
  const menajeria = data.categorias.menajeria || [];
  menajeria.forEach((m: any) => line(`• ${m.nombre}`));

  title("FUENTES PARA SERVICIO Y BOCADITOS");
  const fuentes = data.categorias.fuentes || [];
  fuentes.forEach((m: any) => line(`• ${m.nombre}`));

  // ------------------------------
  // EQUIPO DE TRABAJO
  // ------------------------------
  title("EQUIPO DE TRABAJO (INCLUIDO)");
  [
    "Personal de cocina",
    "1 mozo cada 20 invitados",
    "1 mozo especial atención anfitrión",
    "Maitre",
    "Seguridad en puerta principal",
    "Anfitriona para dirigir invitados",
    "Supervisor/a del evento",
    "Ama de llaves SS.HH.",
    "Maestro de ceremonias"
  ].forEach(t => line(`• ${t}`));

  // ------------------------------
  // DJ
  // ------------------------------
  title("DJ, SONIDO E ILUMINACIÓN");
  [
    "4 parlantes de 15 pulgadas JBL",
    "Consola 6 canales",
    "8 tachos LED",
    "2 micrófonos inalámbricos",
    "2 esferas de luz"
  ].forEach(t => line(`• ${t}`));

  // ------------------------------
  // WEDDING DESIGNER
  // ------------------------------
  title("EVENT DESIGNER");
  [
    "Asesoría en diseño del evento",
    "Elección de mobiliario",
    "Planificación del catering",
    "Coordinación del timing",
    "Recomendación de proveedores"
  ].forEach(t => line(`• ${t}`));

  // ------------------------------
  // SERVICIOS ADICIONALES
  // ------------------------------
  title("SERVICIOS ADICIONALES");
  data.adicionales.forEach((a: any) => line(`• ${a.nombre}`));

  // ------------------------------
  // RESUMEN
  // ------------------------------
  title("RESUMEN DE PRESUPUESTO");
  line(`Costo por invitado: S/ ${data.totales.costoPorInvitado}`);
  line(`Garantía Catering: S/ ${data.totales.garantia}`);
  line(`Alquiler de salón: S/ ${data.local.precioAlquiler}`);
  line(`Total Final: S/ ${data.totales.totalFinal}`);

  drawFooter();

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
