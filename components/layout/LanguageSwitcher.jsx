'use client';

import { LANGS } from '../../locales/index.js';
import { useI18n } from '../AppProvider';

const SHORT = { fr: 'FR', ar: 'عربي', en: 'EN' };

// Segmented FR / AR / EN control. Switching only changes `lang` in the provider,
// so estimator inputs and the open project are untouched.
export default function LanguageSwitcher({ className = '' }) {
  const { lang, setLang, t } = useI18n();
  return (
    <div role="group" aria-label={t('a11y.language')} className={`inline-flex border border-ivory/15 ${className}`} dir="ltr">
      {LANGS.map((code) => {
        const selected = lang === code;
        return (
          <button
            key={code}
            type="button"
            lang={code}
            aria-pressed={selected}
            aria-label={t(`languages.${code}`)}
            onClick={() => setLang(code)}
            className={`min-h-[40px] min-w-[44px] px-2.5 font-mono text-[0.72rem] tracking-[0.12em] transition-colors duration-300 ${
              selected ? 'bg-gold text-ink' : 'text-steel hover:text-ivory'
            }`}
          >
            {SHORT[code]}
          </button>
        );
      })}
    </div>
  );
}
