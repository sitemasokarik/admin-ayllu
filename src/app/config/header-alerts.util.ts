const COTIZACIONES_VISTO_PREFIX = 'ayllu:cotizaciones-visto-at';

export function cotizacionesVistoStorageKey(usuarioId?: number | string | null): string | null {
  if (usuarioId == null || usuarioId === '') return null;
  return `${COTIZACIONES_VISTO_PREFIX}-${usuarioId}`;
}

export function getCotizacionesVistoDesde(usuarioId?: number | string | null): string | null {
  const key = cotizacionesVistoStorageKey(usuarioId);
  return key ? localStorage.getItem(key) : null;
}

export function markCotizacionesVistas(usuarioId?: number | string | null): void {
  const key = cotizacionesVistoStorageKey(usuarioId);
  if (!key) return;
  localStorage.setItem(key, new Date().toISOString());
  window.dispatchEvent(new CustomEvent('ayllu:cotizaciones-vistas'));
}

export function isCotizacionesListUrl(url: string): boolean {
  const path = (url || '').split('?')[0].replace(/^\//, '');
  return path === 'table-cotizaciones' || path === 'cotizaciones-evento';
}
