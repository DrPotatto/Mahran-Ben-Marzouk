import Reveal from './Reveal';

// Consistent section opener: technical eyebrow, editorial title, optional intro.
export default function SectionHeading({ id, eyebrow, title, intro, className = '' }) {
  return (
    <Reveal className={`max-w-3xl ${className}`}>
      <p className="eyebrow">
        <span aria-hidden="true" className="eyebrow-rule" />
        {eyebrow}
      </p>
      <h2 id={id} className="mt-5 font-display text-4xl leading-[1.08] text-ivory sm:text-5xl lg:text-[3.4rem]">
        {title}
      </h2>
      {intro ? <p className="mt-6 max-w-2xl text-base leading-relaxed text-steel sm:text-lg">{intro}</p> : null}
    </Reveal>
  );
}
