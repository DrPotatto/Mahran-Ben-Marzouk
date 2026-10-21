'use client';

import { NAV_ITEMS } from '../../data/navigation';
import { SITE } from '../../data/site';
import { getContactConfig, buildTelLink, buildMailtoLink, buildWhatsAppLink } from '../../lib/contact';
import { formatCoordinate } from '../../lib/formatters';
import { useI18n } from '../AppProvider';
import LanguageSwitcher from './LanguageSwitcher';

// Footer shows ONLY verified facts: name, owner, city, and whichever contact channels are configured.
export default function Footer() {
  const { t } = useI18n();
  const contact = getContactConfig();
  const tel = contact.phoneDisplay ? buildTelLink(contact.phoneDisplay) : null;
  const mail = contact.email ? buildMailtoLink(contact.email) : null;
  const wa = contact.whatsapp ? buildWhatsAppLink(contact.whatsapp) : null;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ivory/10 bg-graphite">
      <div className="mx-auto grid max-w-content gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-12">
        <div>
          <p className="font-sans text-lg font-semibold uppercase tracking-[0.2em] text-ivory">{SITE.name}</p>
          <p className="mt-4 max-w-sm font-display text-2xl leading-snug text-ivory/90">{t('footer.tagline')}</p>
          <p className="mt-6 text-sm text-steel">
            {SITE.owner} — {t('footer.owner')}
          </p>
          <p className="mt-1 font-mono text-[0.7rem] uppercase tracking-technical text-steel">
            {SITE.city} · {formatCoordinate(SITE.coordinates.lat, 'N', 'S')} {formatCoordinate(SITE.coordinates.lon, 'E', 'W')}
          </p>
        </div>

        <nav aria-label={t('footer.navTitle')}>
          <h2 className="eyebrow">{t('footer.navTitle')}</h2>
          <ul className="mt-5 space-y-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="inline-flex min-h-[40px] items-center text-sm text-steel transition-colors hover:text-gold">
                  {t(item.labelKey)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="eyebrow">{t('footer.contactTitle')}</h2>
          <ul className="mt-5 space-y-2 text-sm text-steel">
            <li>{t('contact.info.location')}</li>
            {tel ? (
              <li>
                <a className="hover:text-gold" href={tel} dir="ltr">
                  {contact.phoneDisplay}
                </a>
              </li>
            ) : null}
            {mail ? (
              <li>
                <a className="hover:text-gold" href={mail} dir="ltr">
                  {contact.email}
                </a>
              </li>
            ) : null}
            {wa ? (
              <li>
                <a className="hover:text-gold" href={wa} target="_blank" rel="noopener noreferrer">
                  {t('contact.info.whatsapp')}
                </a>
              </li>
            ) : null}
            {!contact.hasDirectChannel ? <li className="text-steel/80">{t('footer.noContact')}</li> : null}
          </ul>
          <LanguageSwitcher className="mt-6" />
        </div>
      </div>

      <div className="border-t border-ivory/10">
        <div className="mx-auto flex max-w-content flex-col gap-2 px-5 py-6 text-xs text-steel sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
          <p>{t('footer.conceptNote')}</p>
          <p className="shrink-0">
            © {year} {SITE.shortName}. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
