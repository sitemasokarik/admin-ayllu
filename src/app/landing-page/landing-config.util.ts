export interface HeroSlide {
  tag: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  orden: number;
  activo: boolean;
}

export interface PageBanners {
  homeCta?: string;
  nosotros?: string;
  servicios?: string;
  locales?: string;
  contacto?: string;
  presupuestador?: string;
  login?: string;
  registro?: string;
}

export interface StatItem {
  value: string;
  numericValue?: number | null;
  prefix?: string;
  suffix?: string;
  label: string;
  animate: boolean;
}

export interface LandingConfig {
  heroSlides: HeroSlide[];
  pageBanners: PageBanners;
  stats: StatItem[];
}

export function createDefaultLandingConfig(): LandingConfig {
  return {
    heroSlides: [
      {
        tag: 'Matrimonios',
        title: 'Hacemos de tu boda un recuerdo inolvidable',
        subtitle: 'Cada detalle pensado para contar tu historia de amor con elegancia y calidez.',
        imageUrl: '/assets/images/banner-3.jpg',
        orden: 0,
        activo: true,
      },
      {
        tag: 'Eventos corporativos',
        title: 'Experiencias que inspiran y conectan',
        subtitle: 'Producción integral para empresas que buscan impacto, orden y excelencia.',
        imageUrl: '/assets/images/banner_servicios.jpg',
        orden: 1,
        activo: true,
      },
      {
        tag: 'Celebraciones',
        title: 'Momentos únicos, recuerdos para siempre',
        subtitle: 'Quinceañeros, aniversarios y fiestas con la magia que tu evento merece.',
        imageUrl: '/assets/images/banner_nosotros.jpg',
        orden: 2,
        activo: true,
      },
    ],
    pageBanners: {
      nosotros: '/assets/images/banner_nosotros.jpg',
      servicios: '/assets/images/banner_servicios.jpg',
      locales: '/assets/images/banner_locales.jpg',
      contacto: '/assets/images/banner_contacto.jpg',
      presupuestador: '/assets/images/banner_presupuestador.jpg',
      login: '/assets/images/banner_nosotros.jpg',
      registro: '/assets/images/banner_contacto.jpg',
      homeCta: '/assets/images/banner_presupuestador.jpg',
    },
    stats: [
      { value: '+500', numericValue: 500, prefix: '+', suffix: '', label: 'Eventos realizados', animate: true },
      { value: '+15', numericValue: 15, prefix: '+', suffix: '', label: 'Años de experiencia', animate: true },
      { value: '100%', label: 'Compromiso personal', animate: false },
      { value: '360°', label: 'Producción integral', animate: false },
    ],
  };
}

export function parseLandingConfig(raw: unknown): LandingConfig {
  const defaults = createDefaultLandingConfig();
  if (!raw || typeof raw !== 'object') return defaults;

  const src = raw as Record<string, unknown>;
  const heroSlides = Array.isArray(src['heroSlides']) && src['heroSlides'].length
    ? (src['heroSlides'] as HeroSlide[]).map((s, i) => ({
        tag: s.tag || '',
        title: s.title || '',
        subtitle: s.subtitle || '',
        imageUrl: s.imageUrl || '',
        orden: s.orden ?? i,
        activo: s.activo !== false,
      }))
    : defaults.heroSlides;

  const pageBannersSrc = (src['pageBanners'] || {}) as PageBanners;
  const pageBanners: PageBanners = { ...defaults.pageBanners, ...pageBannersSrc };

  const stats = Array.isArray(src['stats']) && src['stats'].length
    ? (src['stats'] as StatItem[]).map((s) => normalizeStatItem(s))
    : defaults.stats.map((s) => normalizeStatItem(s));

  return { heroSlides, pageBanners, stats };
}

export function normalizeStatItem(s: StatItem): StatItem {
  const label = s.label || '';
  const rawValue = (s.value || '').trim();
  const shouldAnimate = s.animate === true && s.numericValue != null && s.numericValue !== undefined;

  if (!shouldAnimate) {
    return {
      value: rawValue,
      numericValue: null,
      prefix: '',
      suffix: '',
      label,
      animate: false,
    };
  }

  const prefix = s.prefix ?? '';
  const suffix = s.suffix ?? '';
  const numericValue = Number(s.numericValue);
  const value = rawValue || `${prefix}${numericValue}${suffix}`;

  return {
    value,
    numericValue,
    prefix,
    suffix,
    label,
    animate: true,
  };
}

export function normalizeStatsForSave(stats: StatItem[]): StatItem[] {
  return stats.map((s) => normalizeStatItem(s));
}

export function buildLandingConfigPayload(config: LandingConfig): LandingConfig {
  const defaults = createDefaultLandingConfig().pageBanners;
  const banners = { ...defaults, ...config.pageBanners };
  return {
    heroSlides: config.heroSlides.map((s, i) => ({
      tag: s.tag || '',
      title: s.title || '',
      subtitle: s.subtitle || '',
      imageUrl: s.imageUrl || '',
      orden: s.orden ?? i,
      activo: s.activo !== false,
    })),
    pageBanners: {
      homeCta: banners.homeCta ?? '',
      nosotros: banners.nosotros ?? '',
      servicios: banners.servicios ?? '',
      locales: banners.locales ?? '',
      contacto: banners.contacto ?? '',
      presupuestador: banners.presupuestador ?? '',
      login: banners.login ?? '',
      registro: banners.registro ?? '',
    },
    stats: normalizeStatsForSave(config.stats),
  };
}

export const PAGE_BANNER_LABELS: { key: keyof PageBanners; label: string }[] = [
  { key: 'nosotros', label: 'Página Nosotros' },
  { key: 'servicios', label: 'Página Servicios' },
  { key: 'locales', label: 'Página Locales' },
  { key: 'contacto', label: 'Página Contacto' },
  { key: 'presupuestador', label: 'Cotizador (landing)' },
  { key: 'login', label: 'Login cliente' },
  { key: 'registro', label: 'Registro cliente' },
  { key: 'homeCta', label: 'CTA final (home)' },
];
