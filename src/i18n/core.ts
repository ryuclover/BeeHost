import messages from './en.json' with { type: 'json' };

export type Locale = 'pt' | 'en';
export const LOCALE_KEY = 'beehost-language';
export const localeTag = (locale: Locale) => locale === 'pt' ? 'pt-BR' : 'en-US';
export const isLocale = (value: unknown): value is Locale => value === 'pt' || value === 'en';

// An explicit link or saved choice wins. Otherwise use the first supported
// browser preference; an unsupported preference list falls back to English.
export function resolveLocale(urlChoice: unknown, savedChoice: unknown, languages: readonly string[]): Locale {
  if (isLocale(urlChoice)) return urlChoice;
  if (isLocale(savedChoice)) return savedChoice;
  for (const language of languages) {
    const base = language.toLowerCase().split(/[-_]/)[0];
    if (isLocale(base)) return base;
  }
  return 'en';
}

export function translate(locale: Locale, source: string, values: Record<string, string | number> = {}): string {
  const text = locale === 'en' ? (messages as Record<string, string>)[source] ?? source : source;
  return text.replace(/\{(\w+)\}/g, (match, key: string) => String(values[key] ?? match));
}

export function localizedHref(href: string, locale: Locale): string {
  if (!href.startsWith('/') || href.startsWith('//')) return href;
  const url = new URL(href, 'https://beehost.invalid');
  url.searchParams.set('lang', locale);
  return `${url.pathname}${url.search}${url.hash}`;
}

export function formatMoney(locale: Locale, value: number): string {
  return new Intl.NumberFormat(localeTag(locale), { style: 'currency', currency: 'USD' }).format(value);
}
