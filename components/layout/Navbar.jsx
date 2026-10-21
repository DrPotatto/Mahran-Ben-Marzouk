'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import Button from '../ui/Button';
import { NAV_ITEMS, SECTION_IDS } from '../../data/navigation';
import { SITE } from '../../data/site';
import { useI18n } from '../AppProvider';

// Fixed navigation with: scroll-aware background, active-section highlight (IntersectionObserver),
// language switcher and an accessible full-screen mobile menu (Esc to close, scroll lock, focus return).
export default function Navbar() {
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('hero');
  const [open, setOpen] = useState(false);
  const toggleRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Active section = the one crossing the middle band of the viewport.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  // Mobile menu: lock page scroll, close on Esc, move focus inside.
  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  const isActive = (item) => active === item.id || (item.also && item.also.includes(active));

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-cinematic ${
        scrolled ? 'border-b border-ivory/10 bg-ink/85 backdrop-blur-md' : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-[68px] max-w-content items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
        <a href="#hero" className="group flex items-center gap-3" aria-label={SITE.shortName}>
          <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center border border-gold font-display text-lg text-gold transition-colors group-hover:bg-gold group-hover:text-ink">
            7
          </span>
          <span className="font-sans text-[0.92rem] font-semibold uppercase tracking-[0.2em] text-ivory">{SITE.shortName}</span>
        </a>

        <nav aria-label={t('a11y.mainNav')} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={isActive(item) ? 'true' : undefined}
                  className={`relative inline-flex min-h-[44px] items-center px-3 text-[0.78rem] font-medium uppercase tracking-[0.14em] transition-colors duration-300 after:absolute after:inset-x-3 after:bottom-2 after:h-px after:origin-left after:scale-x-0 after:bg-gold after:transition-transform after:duration-500 rtl:after:origin-right ${
                    isActive(item) ? 'text-gold after:scale-x-100' : 'text-steel hover:text-ivory'
                  }`}
                >
                  {t(item.labelKey)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher className="hidden sm:inline-flex" />
          <Button href="#estimator" size="sm" className="hidden md:inline-flex">
            {t('nav.quote')}
          </Button>
          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={t('a11y.menuOpen')}
            onClick={() => setOpen(true)}
            className="flex h-11 w-11 items-center justify-center border border-ivory/20 text-ivory lg:hidden"
          >
            <Menu size={20} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label={t('a11y.mainNav')}
        className={`fixed inset-0 z-[70] flex-col bg-ink px-6 pb-8 pt-4 lg:hidden ${open ? 'flex' : 'hidden'}`}
      >
        <div className="flex h-[52px] items-center justify-between">
          <span className="font-sans text-[0.92rem] font-semibold uppercase tracking-[0.2em] text-ivory">{SITE.shortName}</span>
          <button
            ref={closeRef}
            type="button"
            aria-label={t('a11y.menuClose')}
            onClick={close}
            className="flex h-11 w-11 items-center justify-center border border-ivory/20 text-ivory"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <ul className="mt-8 flex flex-1 flex-col">
          {NAV_ITEMS.map((item) => (
            <li key={item.id} className="border-b border-ivory/10">
              <a
                href={`#${item.id}`}
                onClick={() => setOpen(false)}
                aria-current={isActive(item) ? 'true' : undefined}
                className={`flex min-h-[60px] items-center font-display text-3xl ${isActive(item) ? 'text-gold' : 'text-ivory'}`}
              >
                {t(item.labelKey)}
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-col gap-4">
          <LanguageSwitcher className="self-start" />
          <Button href="#estimator" onClick={() => setOpen(false)}>
            {t('nav.quote')}
          </Button>
        </div>
      </div>
    </header>
  );
}
