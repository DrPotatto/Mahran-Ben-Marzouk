'use client';

import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import ContactForm from '../forms/ContactForm';
import Reveal from '../ui/Reveal';
import { buildMailtoLink, buildTelLink, buildWhatsAppLink, getContactConfig } from '../../lib/contact';
import { useI18n, useInquiry } from '../AppProvider';

export default function Contact() {
  const { t } = useI18n();
  const { topic } = useInquiry();
  const cfg = getContactConfig();
  const tel = cfg.phoneDisplay ? buildTelLink(cfg.phoneDisplay) : null;
  const mail = cfg.email ? buildMailtoLink(cfg.email) : null;
  const wa = cfg.whatsapp ? buildWhatsAppLink(cfg.whatsapp) : null;

  return (
    <section id="contact" aria-labelledby="contact-title" className="section-pad border-t border-ivory/10 bg-graphite">
      <div className="content-wrap">
        <SectionHeading id="contact-title" eyebrow={t('contact.eyebrow')} title={t('contact.title')} intro={t('contact.intro')} />

        <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <Reveal>
            <h3 className="font-mono text-[0.72rem] uppercase tracking-technical text-gold">{t('contact.info.title')}</h3>
            <ul className="mt-6 space-y-5 text-base text-ivory">
              <li className="flex items-start gap-3">
                <MapPin size={20} strokeWidth={1.5} aria-hidden="true" className="mt-0.5 shrink-0 text-gold" />
                <span>{t('contact.info.location')}</span>
              </li>
              {tel ? (
                <li className="flex items-start gap-3">
                  <Phone size={20} strokeWidth={1.5} aria-hidden="true" className="mt-0.5 shrink-0 text-gold" />
                  <a href={tel} className="hover:text-gold" dir="ltr">
                    {cfg.phoneDisplay}
                  </a>
                </li>
              ) : null}
              {wa ? (
                <li className="flex items-start gap-3">
                  <MessageCircle size={20} strokeWidth={1.5} aria-hidden="true" className="mt-0.5 shrink-0 text-gold" />
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                    {t('contact.info.whatsapp')}
                  </a>
                </li>
              ) : null}
              {mail ? (
                <li className="flex items-start gap-3">
                  <Mail size={20} strokeWidth={1.5} aria-hidden="true" className="mt-0.5 shrink-0 text-gold" />
                  <a href={mail} className="hover:text-gold" dir="ltr">
                    {cfg.email}
                  </a>
                </li>
              ) : null}
            </ul>
            {!cfg.hasDirectChannel ? <p className="mt-8 border-s-2 border-amber/60 ps-4 text-sm leading-relaxed text-steel">{t('contact.info.none')}</p> : null}
          </Reveal>

          <Reveal delay={0.1} className="border border-ivory/10 bg-ink p-6 sm:p-10">
            <h3 className="mb-8 font-display text-3xl text-ivory">{t('contact.form.title')}</h3>
            <ContactForm initialMessage={topic} />
          </Reveal>
        </div>

        {/* 🔥 THE MAP SECTION WITH YOUR EXACT LINK */}
        <Reveal delay={0.2} className="mt-20">
          <div className="mb-6 flex items-center gap-3">
            <span aria-hidden="true" className="block h-px w-10 bg-gold" />
            <h3 className="font-mono text-[0.72rem] uppercase tracking-technical text-gold">
              {t('contact.info.locationMap') || 'Nous trouver'}
            </h3>
          </div>
          
          <div className="group relative aspect-[4/3] w-full overflow-hidden border border-ivory/20 bg-ink sm:aspect-[16/9] lg:aspect-[21/9]">
            
            <iframe
              title="Entreprise BTP 7DCONSTRUCTION - Google Maps"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d798.3779388494554!2d9.838124495395423!3d36.83021804075295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fcd59db87c3077%3A0x71d016fd9303ffed!2sEntreprise%20BTP%207DCONSTRUCTION!5e0!3m2!1sfr!2stn!4v1792624882129!5m2!1sfr!2stn"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              /* This CSS filter creates the beautiful Dark Mode map effect */
              className="absolute inset-0 grayscale invert-[0.9] hue-rotate-180 contrast-[1.1] transition-all duration-700 group-hover:filter-none"
            />
            
            {/* Golden Inner Border on Hover */}
            <div className="pointer-events-none absolute inset-0 border border-transparent transition-colors duration-500 group-hover:border-gold/50" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}