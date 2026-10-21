'use client';

// Global client state: active language (persisted) and the "inquiry topic" that
// CTAs elsewhere on the page pass to the contact form. The provider sits above all
// sections, so changing the language never unmounts (or resets) the estimator.

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_LANG, LANGS, RTL_LANGS, translate } from '../locales/index.js';

const I18nContext = createContext(null);
const InquiryContext = createContext(null);

const STORAGE_KEY = '7dc-lang';

export default function AppProvider({ children }) {
  // Always start in French so server and client markup match, then apply the saved choice.
  const [lang, setLangState] = useState(DEFAULT_LANG);
  const [topic, setTopic] = useState('');

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved && LANGS.includes(saved)) setLangState(saved);
    } catch {
      /* storage unavailable (private mode): keep default */
    }
  }, []);

  useEffect(() => {
    const el = document.documentElement;
    el.lang = lang;
    el.dir = RTL_LANGS.includes(lang) ? 'rtl' : 'ltr';
    document.title = translate(lang, 'meta.title');
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', translate(lang, 'meta.description'));
  }, [lang]);

  const setLang = useCallback((next) => {
    if (!LANGS.includes(next)) return;
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const i18n = useMemo(
    () => ({
      lang,
      dir: RTL_LANGS.includes(lang) ? 'rtl' : 'ltr',
      isRtl: RTL_LANGS.includes(lang),
      setLang,
      t: (key, params) => translate(lang, key, params),
    }),
    [lang, setLang]
  );

  const inquiry = useMemo(() => ({ topic, setTopic }), [topic]);

  return (
    <I18nContext.Provider value={i18n}>
      <InquiryContext.Provider value={inquiry}>{children}</InquiryContext.Provider>
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside <AppProvider>');
  return ctx;
}

export function useInquiry() {
  const ctx = useContext(InquiryContext);
  if (!ctx) throw new Error('useInquiry must be used inside <AppProvider>');
  return ctx;
}
