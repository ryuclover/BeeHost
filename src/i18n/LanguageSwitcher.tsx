import { Languages } from 'lucide-react';
import { useLocale } from './useLocale';
import { isLocale } from './core';

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLocale();
  return <label className="language-switcher"><Languages size={17} aria-hidden="true" /><span className="sr-only">{t('Idioma')}</span><select value={locale} onChange={event => { if (isLocale(event.target.value)) setLocale(event.target.value); }}><option value="pt" lang="pt-BR">PT</option><option value="en" lang="en">EN</option></select></label>;
}
