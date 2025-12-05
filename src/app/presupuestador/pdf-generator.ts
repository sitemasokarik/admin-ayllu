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

  const newPage = () => {
    drawFooter();
    page = pdfDoc.addPage();
    width = page.getWidth();
    height = page.getHeight();
    y = height - 120;
    drawHeader();
  };

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
  const wrapText = (text: string, maxWidth: number, fontSize = 11) => {
    const words = text.split(' ');
    const lines = [];
    let current = '';

    for (let w of words) {
      const testLine = current ? current + ' ' + w : w;
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);

      if (testWidth < maxWidth) {
        current = testLine;
      } else {
        lines.push(current);
        current = w;
      }
    }
    if (current) lines.push(current);

    return lines;
  };
const insertImage = async (url: string, maxHeight = 400) => {
  // Cargar imagen
  const imgBytes = await fetch(url).then(r => r.arrayBuffer());

  let img;
  if (url.endsWith('.png')) {
    img = await pdfDoc.embedPng(imgBytes);
  } else {
    img = await pdfDoc.embedJpg(imgBytes);
  }

  const { width: imgW, height: imgH } = img;

  const maxWidth = width - (MARGIN * 2);
  let scale = maxWidth / imgW;

  // Limitar altura máxima
  if (imgH * scale > maxHeight) {
    scale = maxHeight / imgH;
  }

  const scaledW = imgW * scale;
  const scaledH = imgH * scale;

  // Salto de página si falta espacio
  if (y - scaledH < 100) {
    newPage();
  }

  page.drawImage(img, {
    x: MARGIN,
    y: y - scaledH,
    width: scaledW,
    height: scaledH
  });

  y -= scaledH + 20;
};

  const longLine = (text: string, spacing = 16, indent = false) => {
    const maxWidth = width - (indent ? LIST_INDENT : MARGIN) - MARGIN;

    const lines = wrapText(text, maxWidth, 11);

    lines.forEach(l => {
      if (y < 80) newPage();
      page.drawText(l, {
        x: indent ? LIST_INDENT : MARGIN,
        y,
        size: 11,
        font
      });
      y -= spacing;
    });
  };  
  const line = (text: string, spacing = 16, indent = false) => {
    if (y < 80) newPage();
    page.drawText(text, { x: indent ? LIST_INDENT : MARGIN, y, size: 11, font });
    y -= spacing;
  };

  const drawHeader = () => {
    centered("EVENTOS AYLLU", 20, 26);
    centered("Cotización personalizada", 12, 40);
  };

  const drawFooter = () => {
    page.drawText("Jr. de la Unión 364 – Lima", { x: MARGIN, y: 40, size: 10, font });
    page.drawText("Cel: 978 561 182 / 957 915 971 / 01 782 2192", { x: MARGIN, y: 26, size: 10, font });
    page.drawText("https://ayllueventos.com/", { x: MARGIN, y: 12, size: 10, font });
  };

  drawHeader();

  // ========================================
  // DATOS DEL CLIENTE
  // ========================================
  sectionTitle("Datos del Cliente");
  line(`Estimado: ${data.cliente.nombre} ${data.cliente.apellido}`);
  line(`Teléfonos: ${data.cliente.telefono1} / ${data.cliente.telefono2}`);
  line(`Correo: ${data.cliente.correo}`);
  line(`Documento: ${data.cliente.tipoDocumento} ${data.cliente.documento}`);
  line(`Fechas tentativas: ${data.evento.fecha1} o ${data.evento.fecha2}`);
  line(`Tipo de evento: ${data.evento.tipo}`);
  line(`Cantidad de invitados: ${data.evento.invitados}`);
  line(`Salón deseado: ${data.local?.nombre || "No seleccionado"}`);

  // Cargar imagen
  await insertImage("https://diintec.com/ayllu/assets/images/servicio-decoracion.jpg", 400);

  // SI LA IMAGEN YA USÓ TODA LA HOJA, FORZAR UNA NUEVA PÁGINA
  if (y < 200) {   // puedes ajustar 200 según el espacio que quieras
    newPage();
  }  
  // ========================================
  // SERVICIO DE CATERING
  // ========================================
  sectionTitle("Servicio de Catering");
  longLine("El coctel de bienvenida se brinda al inicio de la recepción, los invitados socializan mientras esperan la llegada de los novios, a continuación, deben elegir 1 (una) variedad entre las siguientes opciones:");
  line("A continuación, los productos seleccionados son:");
  
  // Coctel
  if (data.categorias.coctel?.length) {
    const coctelNames = data.categorias.coctel.map(p => p.nombre).join(', ');
    line(`• Cóctel: ${coctelNames}`, 16, true);
  }

  // Entradas
  if (data.categorias.entrada?.length) {
    const entradaNames = data.categorias.entrada.map(p => p.nombre).join(', ');
    line(`• Entrada: ${entradaNames}`, 16, true);
  }

  // Fondos
  if (data.categorias.fondo?.length) {
    const fondoNames = data.categorias.fondo.map(p => p.nombre).join(', ');
    line(`• Fondo: ${fondoNames}`, 16, true);
  }
  // Entremeses
  if (data.categorias.entremeses?.length) {
    sectionTitle("Entremeses");
    data.categorias.entremeses.forEach((item: any) => line(`• ${item.nombre}`, 16, true));
  }
   
  // ========================================
  // MOBILIARIO Y DECORACIÓN
  // ========================================
  if (data.categorias.mesasSillas?.length) {
    sectionTitle("Mobiliario y Decoración");
    data.categorias.mesasSillas.forEach((m: any) => line(`• ${m.nombre}`, 16, true));
  }

  if (data.categorias.menajeria?.length) {
    sectionTitle("Menajería");
    data.categorias.menajeria.forEach((m: any) => line(`• ${m.nombre}`, 16, true));
  }

  if (data.categorias.fuentes?.length) {
    sectionTitle("Fuentes");
    data.categorias.fuentes.forEach((m: any) => line(`• ${m.nombre}`, 16, true));
  }
    // Cargar imagen
  await insertImage("https://diintec.com/ayllu/assets/images/servicio-locales.jpg", 400);
  
  // SI LA IMAGEN YA USÓ TODA LA HOJA, FORZAR UNA NUEVA PÁGINA
  if (y < 200) {   // puedes ajustar 200 según el espacio que quieras
    newPage();
  }  
  // ========================================
  // PERSONAL
  // ========================================
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

  if (data.personal?.length) {
    sectionTitle("Personal Adicional");
    data.personal.forEach((p: any) => line(`• ${p.nombre} - ${p.rol}`, 16, true));
  }

  // ========================================
  // DJ, SONIDO E ILUMINACIÓN
  // ========================================
  sectionTitle("DJ, Sonido e Iluminación");
  [
    "4 parlantes de 15 pulgadas JBL",
    "Consola 6 canales",
    "8 tachos LED",
    "2 micrófonos inalámbricos",
    "2 esferas de luz"
  ].forEach(t => line(`• ${t}`, 16, true));

  // ========================================
  // EVENT DESIGNER
  // ========================================
  sectionTitle("Event Designer");
  [
    "Asesoría en diseño del evento",
    "Elección de mobiliario",
    "Planificación del catering",
    "Coordinación del timing",
    "Recomendación de proveedores"
  ].forEach(t => line(`• ${t}`, 16, true));

  // ========================================
  // SERVICIOS ADICIONALES
  // ========================================
  if (data.adicionales?.length) {
    sectionTitle("Servicios Adicionales");
    data.adicionales.forEach((a: any) => line(`• ${a.nombre} - S/ ${a.precio}`, 16, true));
  }

  // ========================================
  // RESUMEN Y TOTALES
  // ========================================
  const drawTable = (rows: any[]) => {
    const col1X = MARGIN;
    const col2X = width - MARGIN - 120;
    const rowHeight = 20;

    // Encabezado
    page.drawText("Descripción", { x: col1X, y, size: 12, font });
    page.drawText("Monto", { x: col2X, y, size: 12, font });
    y -= rowHeight;

    rows.forEach(r => {
      if (y < 80) newPage();

      page.drawText(r.label, { x: col1X, y, size: 11, font });
      page.drawText(r.value, { x: col2X, y, size: 11, font });

      y -= rowHeight;
    });
  };

  y -= 20; 

  // USO
  sectionTitle("Resumen de Presupuesto");

  drawTable([
    { label: "Costo por invitado", value: `S/ ${data.totales?.costoPorInvitado || 0}` },
    { label: "Garantía Catering", value: `S/ ${data.totales?.garantia || 0}` },
    { label: "Alquiler de salón", value: `S/ ${data.local?.precioAlquiler || 0}` },
  ]);


  drawFooter();

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
