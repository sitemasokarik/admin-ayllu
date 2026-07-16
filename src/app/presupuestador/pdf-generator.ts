import { PDFDocument, PDFPage, PDFFont, rgb, StandardFonts } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import {
  PDF_CONDICIONES,
  PDF_DESIGNER,
  PDF_DJ,
  PDF_EQUIPO,
  PDF_IMAGE_POOL,
  PDF_NOTAS,
  costoInclusionText,
  designerSectionTitle,
  introLetter,
  packageTitle,
} from './pdf-content';
import { calcularTotalAdicionales, formatAdicionalesSubtotal } from '../shared/evento-pricing.util';

const C = {
  orange: rgb(244 / 255, 120 / 255, 32 / 255),
  orangeSoft: rgb(1, 0.96, 0.93),
  navy: rgb(0.12, 0.11, 0.28),
  text: rgb(0.18, 0.16, 0.17),
  muted: rgb(0.45, 0.43, 0.44),
  line: rgb(0.86, 0.84, 0.83),
  white: rgb(1, 1, 1),
};

const MARGIN = 52;
const FOOTER_Y = 54;
const CONTENT_TOP = 762;
const BODY = 10;
const BODY_LH = 13.5;
const CHECK_INDENT = 22;

function asList(val: unknown): any[] {
  if (!val) return [];
  return Array.isArray(val) ? val : [val];
}

function pdfSafe(text: string): string {
  return String(text ?? '')
    .replace(/\u2713/g, 'v')
    .replace(/\u2022/g, '-')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\u00b7/g, '|')
    .replace(/[^\x00-\xFF]/g, '');
}

function money(n: number | undefined | null): string {
  const v = Number(n) || 0;
  const [intPart, decPart = '00'] = v.toFixed(2).split('.');
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return pdfSafe(`S/ ${grouped}.${decPart}`);
}

function fmtDate(value: string | undefined | null): string {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return pdfSafe(value);
  return pdfSafe(d.toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' }));
}

function fmtDates(evento: any): string {
  const f1 = fmtDate(evento?.fecha1);
  const f2 = fmtDate(evento?.fecha2);
  if (f1 && f2) return `${f1}  /  ${f2}`;
  return f1 || f2 || 'Por confirmar';
}

function isLocalAsset(url: string): boolean {
  return /^(\/)?assets\//i.test(url);
}

async function loadFonts(doc: PDFDocument) {
  const candidates = [
    ['assets/fonts/Jost-Regular.ttf', 'assets/fonts/GildaDisplay-Regular.ttf'],
    ['assets/Roboto-VariableFont_wdth_wght.ttf', 'assets/Roboto-VariableFont_wdth_wght.ttf'],
  ];
  for (const [bodyPath, headPath] of candidates) {
    try {
      doc.registerFontkit(fontkit);
      const [bodyRes, headRes] = await Promise.all([fetch(bodyPath), fetch(headPath)]);
      if (!bodyRes.ok || !headRes.ok) continue;
      const body = await doc.embedFont(await bodyRes.arrayBuffer());
      const heading = await doc.embedFont(await headRes.arrayBuffer());
      return { body, bodyBold: body, heading, headingBold: heading };
    } catch {
      /* fallback */
    }
  }
  return {
    body: await doc.embedFont(StandardFonts.Helvetica),
    bodyBold: await doc.embedFont(StandardFonts.HelveticaBold),
    heading: await doc.embedFont(StandardFonts.TimesRoman),
    headingBold: await doc.embedFont(StandardFonts.TimesRomanBold),
  };
}

async function loadLogo(doc: PDFDocument) {
  for (const path of ['assets/images/ayllu_logo.png', 'assets/images/favicon_ayllu.png']) {
    try {
      const res = await fetch(path);
      if (res.ok) return await doc.embedPng(await res.arrayBuffer());
    } catch {
      /* next */
    }
  }
  return null;
}

async function embedImageFromUrl(doc: PDFDocument, url: string) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const bytes = await res.arrayBuffer();
    return url.toLowerCase().endsWith('.png') ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
  } catch {
    return null;
  }
}

function collectPhotos(data: any): string[] {
  const urls: string[] = [];
  const push = (v: unknown) => {
    if (!v) return;
    (Array.isArray(v) ? v : [v]).forEach((u) => {
      if (typeof u === 'string' && u && isLocalAsset(u) && !urls.includes(u)) urls.push(u);
    });
  };
  push(data.local?.fotosUrls);
  push(data.local?.fotos);
  asList(data.adicionales).forEach((a) => {
    push(a.fotosUrls);
    push(a.foto);
    push(a.imagen);
  });
  return urls;
}

export async function generarPDF(data: any): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const fonts = await loadFonts(doc);
  const logo = await loadLogo(doc);

  const cliente = data.cliente || {};
  const evento = data.evento || {};
  const tipoEvento = evento.tipo || 'Evento';
  const clientName = `${cliente.nombre || ''} ${cliente.apellido || ''}`.trim();
  const cat = data.categorias || {};

  const userPhotos = collectPhotos(data);
  const usedImages = new Set<string>();
  let photoIdx = 0;

  let page = doc.addPage();
  let width = page.getWidth();
  let height = page.getHeight();
  let y = CONTENT_TOP;
  let pageNum = 1;

  const wrapText = (text: string, font: PDFFont, size: number, maxWidth: number): string[] => {
    const words = pdfSafe(text).split(/\s+/).filter(Boolean);
    const lines: string[] = [];
    let current = '';
    for (const w of words) {
      const test = current ? `${current} ${w}` : w;
      if (font.widthOfTextAtSize(test, size) <= maxWidth) current = test;
      else {
        if (current) lines.push(current);
        current = w;
      }
    }
    if (current) lines.push(current);
    return lines.length ? lines : [''];
  };

  const drawWatermark = () => {
    if (!logo) return;
    const wmH = 300;
    const wmW = (logo.width / logo.height) * wmH;
    page.drawImage(logo, {
      x: (width - wmW) / 2,
      y: height / 2 - wmH / 2,
      width: wmW,
      height: wmH,
      opacity: 0.05,
    });
  };

  const drawFooter = () => {
    page.drawLine({
      start: { x: MARGIN, y: FOOTER_Y + 8 },
      end: { x: width - MARGIN, y: FOOTER_Y + 8 },
      thickness: 1,
      color: C.orange,
    });
    const t = pdfSafe(
      'Jr. de la Union 364 - Lima  |  Cel. 978 561 182 / 957 915 971 / 01 782 2192  |  holaayllucatering@gmail.com'
    );
    const tw = fonts.body.widthOfTextAtSize(t, 7.5);
    page.drawText(t, { x: (width - tw) / 2, y: FOOTER_Y - 4, size: 7.5, font: fonts.body, color: C.muted });
    page.drawText(String(pageNum), {
      x: width - MARGIN - 6,
      y: FOOTER_Y - 18,
      size: 8,
      font: fonts.body,
      color: C.muted,
    });
  };

  const drawBrandHeader = () => {
    drawWatermark();
    const top = y;
    if (logo) {
      const ih = 34;
      const iw = (logo.width / logo.height) * ih;
      page.drawImage(logo, { x: MARGIN, y: top - ih, width: iw, height: ih });
    }
    page.drawText('Ayllu', {
      x: logo ? MARGIN + 42 : MARGIN,
      y: top - 14,
      size: 20,
      font: fonts.headingBold,
      color: C.navy,
    });
    page.drawText('Eventos & Catering', {
      x: logo ? MARGIN + 42 : MARGIN,
      y: top - 28,
      size: 9,
      font: fonts.body,
      color: C.orange,
    });
    page.drawLine({
      start: { x: MARGIN, y: top - 44 },
      end: { x: width - MARGIN, y: top - 44 },
      thickness: 0.5,
      color: C.line,
    });
    y = top - 72;
  };

  const newPage = () => {
    drawFooter();
    pageNum += 1;
    page = doc.addPage();
    width = page.getWidth();
    height = page.getHeight();
    y = CONTENT_TOP;
    drawBrandHeader();
  };

  const bottomLimit = () => FOOTER_Y + 24;

  const ensureSpace = (needed: number) => {
    if (y - needed < bottomLimit()) newPage();
  };

  const sectionTitle = (text: string, size = 13) => {
    ensureSpace(size + 28);
    y -= 8;
    const safe = pdfSafe(text);
    const tw = fonts.headingBold.widthOfTextAtSize(safe, size);
    page.drawText(safe, { x: (width - tw) / 2, y, size, font: fonts.headingBold, color: C.text });
    page.drawLine({
      start: { x: (width - tw) / 2, y: y - 6 },
      end: { x: (width + tw) / 2, y: y - 6 },
      thickness: 0.5,
      color: C.text,
    });
    y -= size + 20;
  };

  const coverTitle = (text: string) => {
    ensureSpace(40);
    const size = 22;
    const safe = pdfSafe(text);
    const tw = fonts.heading.widthOfTextAtSize(safe, size);
    page.drawText(safe, { x: (width - tw) / 2, y, size, font: fonts.heading, color: C.orange });
    y -= size + 22;
  };

  const drawCheck = (x: number, cy: number) => {
    page.drawLine({ start: { x: x + 1, y: cy - 2 }, end: { x: x + 4, y: cy - 5 }, thickness: 1.2, color: C.orange });
    page.drawLine({ start: { x: x + 4, y: cy - 5 }, end: { x: x + 9, y: cy + 1 }, thickness: 1.2, color: C.orange });
  };

  const drawCheckList = (items: string[], twoColumns = false) => {
    if (!items.length) return;

    if (twoColumns && items.length >= 4) {
      const mid = Math.ceil(items.length / 2);
      const left = items.slice(0, mid);
      const right = items.slice(mid);
      const colW = (width - MARGIN * 2 - 16) / 2;
      const rows = Math.max(left.length, right.length);

      for (let r = 0; r < rows; r++) {
        let rowH = 0;
        const blocks: { lines: string[]; x: number }[] = [];

        [left[r], right[r]].forEach((item, ci) => {
          if (!item) return;
          const lines = wrapText(item, fonts.body, BODY, colW - CHECK_INDENT);
          rowH = Math.max(rowH, lines.length * BODY_LH + 6);
          blocks.push({ lines, x: MARGIN + ci * (colW + 16) });
        });

        ensureSpace(rowH);
        blocks.forEach(({ lines, x }) => {
          drawCheck(x, y);
          lines.forEach((line, li) => {
            page.drawText(line, {
              x: x + CHECK_INDENT,
              y: y - li * BODY_LH,
              size: BODY,
              font: fonts.body,
              color: C.text,
            });
          });
        });
        y -= rowH;
      }
      return;
    }

    items.forEach((item) => {
      const lines = wrapText(item, fonts.body, BODY, width - MARGIN * 2 - CHECK_INDENT);
      const blockH = lines.length * BODY_LH + 6;
      ensureSpace(blockH);
      drawCheck(MARGIN, y);
      lines.forEach((line, li) => {
        page.drawText(line, {
          x: MARGIN + CHECK_INDENT,
          y: y - li * BODY_LH,
          size: BODY,
          font: fonts.body,
          color: C.text,
        });
      });
      y -= blockH;
    });
  };

  const subHeading = (text: string) => {
    ensureSpace(18);
    page.drawText(text, { x: MARGIN, y, size: 10.5, font: fonts.bodyBold, color: C.text });
    y -= 16;
  };

  const bodyText = (text: string, size = BODY) => {
    wrapText(text, fonts.body, size, width - MARGIN * 2).forEach((line) => {
      ensureSpace(BODY_LH);
      page.drawText(line, { x: MARGIN, y, size, font: fonts.body, color: C.text });
      y -= BODY_LH;
    });
    y -= 4;
  };

  const resolveImage = async (poolKey: keyof typeof PDF_IMAGE_POOL): Promise<Awaited<ReturnType<typeof embedImageFromUrl>>> => {
    const candidates: string[] = [];
    if (photoIdx < userPhotos.length) candidates.push(userPhotos[photoIdx++]);
    PDF_IMAGE_POOL[poolKey].forEach((p) => {
      if (!candidates.includes(p)) candidates.push(p);
    });
    for (const url of candidates) {
      if (usedImages.has(url)) continue;
      const img = await embedImageFromUrl(doc, url);
      if (img) {
        usedImages.add(url);
        return img;
      }
    }
    return null;
  };

  const insertCoverImage = async (poolKey: keyof typeof PDF_IMAGE_POOL) => {
    const img = await resolveImage(poolKey);
    if (!img) return;

    const maxBoxW = width - MARGIN * 2;
    const maxH = Math.min(280, y - bottomLimit() - 20);
    let sw = maxBoxW;
    let sh = (img.height / img.width) * sw;
    if (sh > maxH) {
      sh = maxH;
      sw = (img.width / img.height) * sh;
    }

    ensureSpace(sh + 18);
    y -= 8;
    const ix = MARGIN + (maxBoxW - sw) / 2;
    page.drawRectangle({
      x: ix - 1,
      y: y - sh - 1,
      width: sw + 2,
      height: sh + 2,
      borderColor: C.line,
      borderWidth: 0.5,
    });
    page.drawImage(img, { x: ix, y: y - sh, width: sw, height: sh });
    y -= sh + 14;
  };

  const insertImage = async (poolKey: keyof typeof PDF_IMAGE_POOL, maxH = 200) => {
    const img = await resolveImage(poolKey);
    if (!img) return;

    const maxW = width - MARGIN * 2;
    let scale = maxW / img.width;
    if (img.height * scale > maxH) scale = maxH / img.height;
    const sw = img.width * scale;
    const sh = img.height * scale;

    ensureSpace(sh + 20);
    y -= 6;
    const ix = (width - sw) / 2;
    page.drawRectangle({
      x: ix - 1,
      y: y - sh - 1,
      width: sw + 2,
      height: sh + 2,
      borderColor: C.line,
      borderWidth: 0.5,
    });
    page.drawImage(img, { x: ix, y: y - sh, width: sw, height: sh });
    y -= sh + 16;
  };

  const insertImageRow = async (keys: (keyof typeof PDF_IMAGE_POOL)[], maxH = 200) => {
    const imgs: { img: NonNullable<Awaited<ReturnType<typeof embedImageFromUrl>>>; key: string }[] = [];
    for (const k of keys) {
      const img = await resolveImage(k);
      if (img) imgs.push({ img, key: k });
      if (imgs.length >= 2) break;
    }
    if (!imgs.length) return;

    const gap = 12;
    const availW = width - MARGIN * 2;
    const count = imgs.length;
    const cellW = count === 1 ? availW : (availW - gap) / 2;
    const effectiveMaxH = count === 1 ? Math.min(maxH, y - bottomLimit() - 16) : maxH;

    let maxScaledH = 0;
    const scaled = imgs.map(({ img }) => {
      let scale = cellW / img.width;
      if (img.height * scale > effectiveMaxH) scale = effectiveMaxH / img.height;
      const sw = img.width * scale;
      const sh = img.height * scale;
      maxScaledH = Math.max(maxScaledH, sh);
      return { sw, sh };
    });

    ensureSpace(maxScaledH + 20);
    y -= 6;
    let cx = count === 1 ? (width - scaled[0].sw) / 2 : MARGIN;

    scaled.forEach(({ sw, sh }, i) => {
      page.drawRectangle({
        x: cx - 1,
        y: y - sh - 1,
        width: sw + 2,
        height: sh + 2,
        borderColor: C.line,
        borderWidth: 0.5,
      });
      page.drawImage(imgs[i].img, { x: cx, y: y - sh, width: sw, height: sh });
      cx += sw + gap;
    });
    y -= maxScaledH + 16;
  };

  const drawClientCard = () => {
    const rows: [string, string][] = [
      ['Estimado/a', clientName || 'Cliente'],
      ['Telefono', [cliente.telefono1, cliente.telefono2].filter(Boolean).join(' / ') || '-'],
      ['Correo', cliente.correo || '-'],
      ['Fechas tentativas', fmtDates(evento)],
      ['Salon deseado', data.local?.nombre || 'Por confirmar'],
      ['Invitados', String(evento.invitados || '-')],
    ];

    const colW = (width - MARGIN * 2 - 20) / 2;
    const rowH = 30;
    const boxH = Math.ceil(rows.length / 2) * rowH + 28;
    ensureSpace(boxH + 8);
    const top = y;

    page.drawRectangle({
      x: MARGIN,
      y: top - boxH,
      width: width - MARGIN * 2,
      height: boxH,
      color: C.orangeSoft,
      borderColor: C.orange,
      borderWidth: 0.75,
    });

    page.drawText('Datos del cliente', {
      x: MARGIN + 12,
      y: top - 16,
      size: 9,
      font: fonts.bodyBold,
      color: C.orange,
    });

    rows.forEach(([label, value], i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = MARGIN + 12 + col * (colW + 20);
      const ry = top - 30 - row * rowH;
      const isName = label === 'Estimado/a';
      page.drawText(`${label}:`, { x, y: ry, size: 8, font: fonts.bodyBold, color: C.muted });
      wrapText(value, fonts.body, isName ? 11 : 9.5, colW - 4)
        .slice(0, 2)
        .forEach((vl, vi) => {
          page.drawText(vl, {
            x,
            y: ry - 11 - vi * 12,
            size: isName ? 11 : 9.5,
            font: isName ? fonts.heading : fonts.body,
            color: isName ? C.orange : C.text,
          });
        });
    });

    y = top - boxH - 14;
  };

  const drawClosingPage = () => {
    newPage();
    sectionTitle('PRESUPUESTO PARA EL EVENTO', 14);

    const tableW = width - MARGIN * 2;
    const montoX = MARGIN + tableW - 82;

    ensureSpace(40);
    page.drawText('Tipo de evento:', { x: MARGIN, y, size: 9.5, font: fonts.bodyBold, color: C.text });
    page.drawText(pdfSafe(tipoEvento), { x: MARGIN + 100, y, size: 9.5, font: fonts.body, color: C.text });
    y -= 16;
    page.drawText('Cantidad de invitados:', { x: MARGIN, y, size: 9.5, font: fonts.bodyBold, color: C.text });
    page.drawText(String(evento.invitados || '-'), { x: MARGIN + 100, y, size: 9.5, font: fonts.body, color: C.text });
    y -= 22;

    const tw = fonts.headingBold.widthOfTextAtSize('Resumen de Presupuesto', 11);
    page.drawText('Resumen de Presupuesto', { x: (width - tw) / 2, y, size: 11, font: fonts.headingBold, color: C.text });
    y -= 20;

    const invitados = evento.invitados ?? data.totales?.invitados ?? 0;
    const costoPorInvitado = data.totales?.costoPorInvitado ?? data.costoPorInvitado ?? 0;
    const menuTotal = data.totales?.totalEvento ?? invitados * costoPorInvitado;
    const localMonto = data.totales?.local ?? data.local?.precioAlquiler ?? 0;
    const garantiaCatering = data.totales?.garantia ?? 500;
    const garantiaLocal = data.totales?.garantiaLocal ?? data.local?.garantia ?? 0;
    const totalAdicionales =
      Number(data.totales?.adicionales) || calcularTotalAdicionales(data.adicionales, invitados);
    const adicionalesNombres = (data.adicionales || []).map((a: any) => a.nombre).filter(Boolean).join(', ');
    const adicionalesSub = formatAdicionalesSubtotal(data.adicionales, invitados);
    const cateringSub =
      invitados > 0 && costoPorInvitado > 0
        ? `(S/ ${costoPorInvitado.toLocaleString('es-PE')}) x ${invitados} invitado${invitados === 1 ? '' : 's'}`
        : '';

    const budgetRows = [
      {
        label: pdfSafe('Costo por invitado'),
        value: money(costoPorInvitado),
        note: pdfSafe(costoInclusionText(tipoEvento)),
      },
      {
        label: pdfSafe(`Servicio catering x invitados (${invitados})`),
        value: money(menuTotal),
        note: pdfSafe(cateringSub),
      },
      { label: pdfSafe('Garantia catering'), value: money(garantiaCatering), note: '' },
      {
        label: pdfSafe('Alquiler de salon'),
        value: money(localMonto),
        note: pdfSafe(data.local?.nombre || ''),
      },
      {
        label: pdfSafe('Garantia local'),
        value: money(garantiaLocal),
        note: pdfSafe(data.local?.nombre || ''),
      },
      {
        label: pdfSafe('Servicios adicionales'),
        value: money(totalAdicionales),
        note: pdfSafe(adicionalesNombres ? `${adicionalesSub} · ${adicionalesNombres}` : adicionalesSub),
      },
    ];

    const noteMaxW = tableW * 0.58;
    const parsedRows = budgetRows.map((row) => {
      const noteLines = row.note ? wrapText(row.note, fonts.body, 8, noteMaxW) : [];
      const notesH = noteLines.length ? noteLines.length * 10 + 4 : 0;
      const rowH = 12 + notesH + 20;
      return { ...row, noteLines, rowH };
    });

    const headerH = 20;
    const tableH = headerH + parsedRows.reduce((s, r) => s + r.rowH, 0);
    ensureSpace(tableH + 16);

    const tableTop = y;
    const tableBottom = tableTop - tableH;

    page.drawRectangle({
      x: MARGIN,
      y: tableBottom,
      width: tableW,
      height: tableH,
      borderColor: C.line,
      borderWidth: 0.75,
    });

    let rowY = tableTop - 14;
    page.drawText('Descripcion', { x: MARGIN + 10, y: rowY, size: 9.5, font: fonts.bodyBold, color: C.text });
    page.drawText('Monto', { x: montoX, y: rowY, size: 9.5, font: fonts.bodyBold, color: C.text });

    const headerLineY = tableTop - headerH;
    page.drawLine({
      start: { x: MARGIN, y: headerLineY },
      end: { x: MARGIN + tableW, y: headerLineY },
      thickness: 0.5,
      color: C.line,
    });

    let currentY = headerLineY;
    parsedRows.forEach((row, idx) => {
      const labelY = currentY - 12;
      page.drawText(pdfSafe(row.label), {
        x: MARGIN + 10,
        y: labelY,
        size: 9.5,
        font: fonts.bodyBold,
        color: C.text,
      });
      page.drawText(pdfSafe(row.value), {
        x: montoX,
        y: labelY,
        size: 9.5,
        font: fonts.body,
        color: C.text,
      });

      row.noteLines.forEach((nl, i) => {
        page.drawText(nl, {
          x: MARGIN + 10,
          y: labelY - 12 - i * 10,
          size: 8,
          font: fonts.body,
          color: C.muted,
        });
      });

      const notesH = row.noteLines.length ? row.noteLines.length * 10 + 4 : 0;
      currentY = labelY - 12 - notesH - 8;

      if (idx < parsedRows.length - 1) {
        page.drawLine({
          start: { x: MARGIN, y: currentY },
          end: { x: MARGIN + tableW, y: currentY },
          thickness: 0.25,
          color: C.line,
        });
      }
    });

    y = tableBottom - 14;
    bodyText('El presente presupuesto es referencial y sujeto a confirmacion de fecha y disponibilidad.', 8.5);

    y -= 6;
    sectionTitle('NOTAS IMPORTANTES', 11);
    drawCheckList(PDF_NOTAS, true);

    y -= 4;
    sectionTitle('CONDICIONES DE PAGO', 11);
    PDF_CONDICIONES.forEach((c) => {
      const lines = wrapText(c, fonts.body, 9, width - MARGIN * 2 - CHECK_INDENT);
      const blockH = lines.length * 12 + 4;
      ensureSpace(blockH);
      page.drawText('-', { x: MARGIN, y, size: 10, font: fonts.bodyBold, color: C.orange });
      lines.forEach((line, li) => {
        page.drawText(line, { x: MARGIN + CHECK_INDENT, y: y - li * 12, size: 9, font: fonts.body, color: C.text });
      });
      y -= blockH;
    });
  };

  /* ─── Pág. 1 · Portada ─── */
  drawBrandHeader();
  coverTitle(packageTitle(tipoEvento));

  drawClientCard();
  introLetter(tipoEvento).forEach((p) => bodyText(p, 10));
  await insertCoverImage('portada');

  /* ─── Pág. 2 · Catering + mobiliario ─── */
  newPage();
  sectionTitle('SERVICIO DE CATERING', 13);
  bodyText(
    'El coctel de bienvenida se brinda al inicio de la recepcion. Los invitados socializan mientras esperan la llegada de los anfitriones. Productos seleccionados:'
  );

  const coctel = asList(cat.coctel);
  const entrada = asList(cat.entrada);
  const fondo = asList(cat.fondo);
  const entremeses = asList(cat.entremeses);

  if (coctel.length) {
    subHeading('Coctel de bienvenida');
    drawCheckList(coctel.map((p) => p.nombre));
  }
  if (entremeses.length) {
    subHeading('Entremeses salados');
    drawCheckList(entremeses.map((p) => p.nombre), true);
  }
  if (entrada.length) {
    subHeading('Platos de entrada');
    drawCheckList(entrada.map((p) => p.nombre));
  }
  if (fondo.length) {
    subHeading('Platos de fondo');
    drawCheckList(fondo.map((p) => p.nombre));
  }

  bodyText('Se realizara degustacion de los platos elegidos con anticipacion al evento.');
  bodyText('Importante: el servicio incluye agua mineral ilimitada durante la recepcion.');

  const mesas = asList(cat.mesasSillas);
  const menajeria = asList(cat.menajeria);
  const fuentes = asList(cat.fuentes);

  if (mesas.length || menajeria.length || fuentes.length) {
    if (y < bottomLimit() + 120) newPage();
    sectionTitle('MOBILIARIO Y DECORACION', 12);
    if (mesas.length) {
      subHeading('Mesas y sillas');
      drawCheckList(mesas.map((m) => m.nombre), true);
    }
    if (menajeria.length) {
      subHeading('Menajeria');
      drawCheckList(menajeria.map((m) => m.nombre), true);
    }
    if (fuentes.length) {
      subHeading('Fuentes');
      drawCheckList(fuentes.map((m) => m.nombre), true);
    }
  }

  if (y > bottomLimit() + 150) {
    await insertImageRow(['catering', 'locales'], 220);
  } else {
    newPage();
    await insertImageRow(['catering', 'locales'], 240);
  }

  /* ─── Pág. 3 · Equipo + DJ + Designer + adicionales ─── */
  newPage();
  sectionTitle('EQUIPO DE TRABAJO', 13);
  drawCheckList(PDF_EQUIPO, true);

  if (data.personal?.length) {
    subHeading('Personal adicional');
    drawCheckList(data.personal.map((p: any) => `${p.nombre} - ${p.rol}`));
  }

  sectionTitle('DJ, SONIDO E ILUMINACION PROFESIONAL', 12);
  drawCheckList(PDF_DJ, true);

  if (y > bottomLimit() + 100) await insertImage('equipo', 120);

  sectionTitle(designerSectionTitle(tipoEvento), 12);
  bodyText('Asesoria integral en diseno, mobiliario, catering y coordinacion de su celebracion.');
  drawCheckList(PDF_DESIGNER, true);

  if (data.adicionales?.length) {
    sectionTitle('SERVICIOS ADICIONALES', 12);
    drawCheckList(data.adicionales.map((a: any) => a.nombre));
    ensureSpace(14);
    const note = 'Los servicios adicionales no son obligatorios.';
    const nw = fonts.body.widthOfTextAtSize(note, 8.5);
    page.drawText(note, { x: (width - nw) / 2, y, size: 8.5, font: fonts.bodyBold, color: C.muted });
    y -= 14;
  }

  if (y > bottomLimit() + 120) {
    await insertImage('designer', 115);
  }

  /* ─── Pág. 4 · Presupuesto + notas (una sola hoja) ─── */
  drawClosingPage();
  drawFooter();

  return doc.save();
}
