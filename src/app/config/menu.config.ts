/** Metadatos de grupos del menú lateral (orden e icono). */
export const MENU_GROUP_META: Record<string, { icon: string; order: number }> = {
  'Ventas y cotizaciones': { icon: 'rocket-line', order: 10 },
  'Eventos y locales': { icon: 'store-3-line', order: 20 },
  'Catálogo': { icon: 'layout-grid-2-line', order: 30 },
  'Usuarios y clientes': { icon: 'team-line', order: 40 },
  'Facturación y pagos': { icon: 'bill-line', order: 50 },
  'Seguridad y accesos': { icon: 'shield-user-line', order: 70 },
};

/** Etiquetas visibles en menú (sobreescriben nombre de BD por ruta). */
export const MENU_DISPLAY_LABELS: Record<string, string> = {
  presupuestador: 'Cotizador',
};

/** Sobreescritura por nombre de página en BD (permisos, etc.). */
export const PAGE_DISPLAY_LABELS: Record<string, string> = {
  Presupuestador: 'Cotizador',
};

export function resolveMenuDisplayName(ruta: string, fallback: string): string {
  const key = (ruta || '').replace(/^\//, '').trim();
  if (key && MENU_DISPLAY_LABELS[key]) return MENU_DISPLAY_LABELS[key];
  if (PAGE_DISPLAY_LABELS[fallback]) return PAGE_DISPLAY_LABELS[fallback];
  return fallback;
}

/** Valores por defecto si la BD aún no tiene grupo (por PaginaID). */
export const DEFAULT_MENU_BY_PAGE: Record<number, { grupo: string | null; orden: number }> = {
  1: { grupo: null, orden: 1 },
  2: { grupo: 'Ventas y cotizaciones', orden: 1 },
  3: { grupo: 'Ventas y cotizaciones', orden: 2 },
  903: { grupo: 'Ventas y cotizaciones', orden: 3 },
  4: { grupo: 'Ventas y cotizaciones', orden: 4 },
  5: { grupo: 'Eventos y locales', orden: 1 },
  6: { grupo: 'Eventos y locales', orden: 2 },
  7: { grupo: 'Usuarios y clientes', orden: 1 },
  8: { grupo: 'Usuarios y clientes', orden: 2 },
  9: { grupo: 'Catálogo', orden: 1 },
  10: { grupo: 'Catálogo', orden: 2 },
  11: { grupo: 'Seguridad y accesos', orden: 1 },
  12: { grupo: 'Seguridad y accesos', orden: 2 },
  13: { grupo: 'Eventos y locales', orden: 3 },
  14: { grupo: 'Seguridad y accesos', orden: 3 },
  15: { grupo: null, orden: 80 },
  16: { grupo: null, orden: 90 },
  17: { grupo: null, orden: 0 },
  18: { grupo: null, orden: 60 },
  19: { grupo: 'Facturación y pagos', orden: 4 },
  20: { grupo: 'Facturación y pagos', orden: 1 },
  21: { grupo: 'Facturación y pagos', orden: 2 },
  22: { grupo: 'Facturación y pagos', orden: 3 },
};

/** Páginas duplicadas u ocultas en el menú. */
export const HIDDEN_MENU_PAGE_IDS = new Set([17]);
