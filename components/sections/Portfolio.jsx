'use client';

import { useCallback, useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import SectionHeading from '../ui/SectionHeading';
import ProjectCard from '../ui/ProjectCard';
import Reveal from '../ui/Reveal';
import ProjectDetail from './ProjectDetail';
import { PROJECTS, CATEGORY_IDS } from '../../data/projects';
import { projectText, pickText } from '../../lib/content';
import { useI18n, useInquiry } from '../AppProvider';

export default function Portfolio() {
  const { t, lang } = useI18n();
  const { setTopic } = useInquiry();
  const [filter, setFilter] = useState('all');
  const [openId, setOpenId] = useState(null);

  // Only offer filters that match at least one project (an empty filter would be a dead button).
  const filters = useMemo(() => ['all', ...CATEGORY_IDS.filter((c) => PROJECTS.some((p) => p.categories.includes(c)))], []);
  const visible = useMemo(() => PROJECTS.filter((p) => filter === 'all' || p.categories.includes(filter)), [filter]);
  const openProject = PROJECTS.find((p) => p.id === openId) || null;

  const close = useCallback(() => setOpenId(null), []);
  const inquire = useCallback(
    (title) => {
      setTopic(title);
      setOpenId(null);
    },
    [setTopic]
  );

  return (
    <section id="projects" aria-labelledby="projects-title" className="section-pad border-t border-ivory/10 bg-graphite">
      <div className="content-wrap">
        <SectionHeading id="projects-title" eyebrow={t('projects.eyebrow')} title={t('projects.title')} intro={t('projects.intro')} />

        <div role="group" aria-label={t('projects.filtersLabel')} className="mt-12 flex flex-wrap gap-2">
          {filters.map((id) => (
            <button
              key={id}
              type="button"
              aria-pressed={filter === id}
              onClick={() => setFilter(id)}
              className={`min-h-[44px] border px-4 text-[0.76rem] font-semibold uppercase tracking-[0.14em] transition-colors duration-300 ${
                filter === id ? 'border-gold bg-gold text-ink' : 'border-ivory/15 text-steel hover:border-ivory/40 hover:text-ivory'
              }`}
            >
              {t(`projects.filters.${id}`)}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <p className="mt-12 text-steel" role="status">
            {t('projects.empty')}
          </p>
        ) : (
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3" aria-live="polite">
            {visible.map((project, i) => {
              const title = projectText(project, 'title', lang, t);
              const first = project.images?.[0];
              return (
                <li key={project.id}>
                  <Reveal delay={(i % 3) * 0.07} className="h-full">
                    <ProjectCard
                      title={title}
                      location={projectText(project, 'location', lang, t)}
                      statusLabel={t(`projects.status.${project.status}`)}
                      categoryLabels={project.categories.slice(0, 2).map((c) => t(`projects.filters.${c}`))}
                      imageSrc={first?.src}
                      imageAlt={first ? pickText(first.alt, lang) : ''}
                      model={project.model}
                      conceptual={project.conceptual}
                      conceptLabel={t('projects.conceptBadge')}
                      ctaLabel={t('projects.view')}
                      onOpen={() => setOpenId(project.id)}
                    />
                  </Reveal>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <AnimatePresence>
        {openProject ? <ProjectDetail key={openProject.id} project={openProject} onClose={close} onInquire={inquire} /> : null}
      </AnimatePresence>
    </section>
  );
}
