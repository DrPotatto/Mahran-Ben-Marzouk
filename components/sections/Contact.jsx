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
      </div>
    </section>
  );
}
