import { createContext, useContext } from 'react';
import type { Locale } from './core';

export type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (source: string, values?: Record<string, string | number>) => string;
  withLocale: (href: string) => string;
  money: (value: number) => string;
};
export const LocaleContext = createContext<LocaleContextValue | null>(null);
export function useLocale() {
  const value = useContext(LocaleContext);
  if (!value) throw new Error('useLocale requires LocaleProvider');
  return value;
}
