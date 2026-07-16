export interface EventoTarifaTier {
  minInvitados: number;
  precioPorInvitado: number;
}

export interface EventoTarifasConfig {
  minInvitados: number;
  garantia: number;
  tarifas: EventoTarifaTier[];
}

const TARIFAS_BODAS: EventoTarifasConfig = {
  minInvitados: 60,
  garantia: 500,
  tarifas: [
    { minInvitados: 60, precioPorInvitado: 250 },
    { minInvitados: 80, precioPorInvitado: 240 },
    { minInvitados: 100, precioPorInvitado: 230 },
    { minInvitados: 150, precioPorInvitado: 220 },
    { minInvitados: 170, precioPorInvitado: 210 },
    { minInvitados: 200, precioPorInvitado: 200 },
    { minInvitados: 250, precioPorInvitado: 190 },
  ],
};

const TARIFAS_CORPORATIVO: EventoTarifasConfig = {
  minInvitados: 150,
  garantia: 500,
  tarifas: [
    { minInvitados: 150, precioPorInvitado: 150 },
    { minInvitados: 500, precioPorInvitado: 90 },
    { minInvitados: 700, precioPorInvitado: 90 },
  ],
};

export function defaultTarifasForEvento(nombre?: string): EventoTarifasConfig {
  const key = (nombre || '').toLowerCase();
  if (key.includes('corporativ')) {
    return JSON.parse(JSON.stringify(TARIFAS_CORPORATIVO));
  }
  return JSON.parse(JSON.stringify(TARIFAS_BODAS));
}

export function parseEventoTarifas(raw: unknown, eventoNombre?: string): EventoTarifasConfig {
  const fallback = defaultTarifasForEvento(eventoNombre);

  if (!raw) return fallback;

  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!parsed || typeof parsed !== 'object') return fallback;

    const tarifas = Array.isArray(parsed.tarifas)
      ? parsed.tarifas
          .map((t: any) => ({
            minInvitados: Number(t.minInvitados),
            precioPorInvitado: Number(t.precioPorInvitado),
          }))
          .filter((t: EventoTarifaTier) => t.minInvitados > 0 && t.precioPorInvitado >= 0)
          .sort((a: EventoTarifaTier, b: EventoTarifaTier) => a.minInvitados - b.minInvitados)
      : fallback.tarifas;

    return {
      minInvitados: Number(parsed.minInvitados) || fallback.minInvitados,
      garantia: Number(parsed.garantia ?? fallback.garantia),
      tarifas: tarifas.length ? tarifas : fallback.tarifas,
    };
  } catch {
    return fallback;
  }
}

export function serializeEventoTarifas(config: EventoTarifasConfig): string {
  return JSON.stringify({
    minInvitados: config.minInvitados,
    garantia: config.garantia,
    tarifas: [...config.tarifas].sort((a, b) => a.minInvitados - b.minInvitados),
  });
}

export function resolvePrecioPorInvitado(config: EventoTarifasConfig, invitados: number): number | null {
  if (!invitados || invitados < config.minInvitados) return null;

  let selected: EventoTarifaTier | null = null;
  for (const tier of config.tarifas) {
    if (invitados >= tier.minInvitados) {
      selected = tier;
    }
  }

  return selected?.precioPorInvitado ?? null;
}

export function validateInvitadosMinimos(
  config: EventoTarifasConfig,
  invitados: number,
): { ok: boolean; minInvitados: number; message?: string } {
  if (!invitados || invitados < config.minInvitados) {
    return {
      ok: false,
      minInvitados: config.minInvitados,
      message: `El mínimo para este evento es ${config.minInvitados} invitados.`,
    };
  }
  return { ok: true, minInvitados: config.minInvitados };
}

export interface ServicioAdicionalPricing {
  precio?: number;
  cantidadMinima?: number;
  nombre?: string;
}

export function resolveCantidadMinimaServicio(servicio: ServicioAdicionalPricing): number {
  const min = Number(servicio?.cantidadMinima);
  return min > 0 ? min : 1;
}

export function validarServicioAdicionalMinimo(
  servicio: ServicioAdicionalPricing,
  invitados: number,
): { ok: boolean; cantidadMinima: number; message?: string } {
  const cantidadMinima = resolveCantidadMinimaServicio(servicio);
  if (!invitados || invitados < cantidadMinima) {
    const nombre = servicio?.nombre?.trim() || 'Este servicio';
    return {
      ok: false,
      cantidadMinima,
      message: `"${nombre}" requiere mínimo ${cantidadMinima} invitados.`,
    };
  }
  return { ok: true, cantidadMinima };
}

export function puedeAgregarServicioAdicional(
  servicio: ServicioAdicionalPricing,
  invitados: number,
): boolean {
  return validarServicioAdicionalMinimo(servicio, invitados).ok;
}

export function calcularTotalAdicionales(
  adicionales: ServicioAdicionalPricing[] | null | undefined,
  invitados: number,
): number {
  if (!Array.isArray(adicionales) || invitados <= 0) return 0;
  return adicionales.reduce((sum, servicio) => sum + (Number(servicio.precio) || 0) * invitados, 0);
}

export function formatAdicionalesSubtotal(
  adicionales: ServicioAdicionalPricing[] | null | undefined,
  invitados: number,
): string {
  if (!Array.isArray(adicionales) || !adicionales.length || invitados <= 0) {
    return 'Ninguno';
  }
  const unit = adicionales.reduce((sum, servicio) => sum + (Number(servicio.precio) || 0), 0);
  return `S/ ${unit.toLocaleString('es-PE')} × ${invitados} invitado${invitados === 1 ? '' : 's'}`;
}
