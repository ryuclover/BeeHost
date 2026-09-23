import { useEffect, useState, type ReactNode } from 'react';
import { formatMoney, localizedHref, localeTag, LOCALE_KEY, resolveLocale, translate, type Locale } from './core';
import { LocaleContext } from './useLocale';

function initialLocale(): Locale {
  let saved: string | null = null;
  try { saved = localStorage.getItem(LOCALE_KEY); } catch { /* Private storage can be unavailable. */ }
  return resolveLocale(new URLSearchParams(location.search).get('lang'), saved, navigator.languages?.length ? navigator.languages : [navigator.language]);
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, updateLocale] = useState<Locale>(initialLocale);
  function setLocale(next: Locale) {
    updateLocale(next);
    try { localStorage.setItem(LOCALE_KEY, next); } catch { /* URL links keep the choice during navigation. */ }
    const url = new URL(location.href);
    url.searchParams.set('lang', next);
    history.replaceState(history.state, '', url);
  }
  useEffect(() => { document.documentElement.lang = localeTag(locale); }, [locale]);
  return <LocaleContext.Provider value={{ locale, setLocale, t: (source, values) => translate(locale, source, values), withLocale: href => localizedHref(href, locale), money: value => formatMoney(locale, value) }}>{children}</LocaleContext.Provider>;
}
