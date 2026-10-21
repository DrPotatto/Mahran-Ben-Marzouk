// Button that renders an <a> when `href` is given, otherwise a <button>.
// Variants follow the site's material language: gold (primary), hairline (secondary), ghost.

const VARIANTS = {
  primary:
    'bg-gold text-ink hover:bg-ivory border border-gold hover:border-ivory disabled:opacity-50 disabled:hover:bg-gold',
  secondary:
    'bg-transparent text-ivory border border-ivory/30 hover:border-gold hover:text-gold disabled:opacity-50',
  ghost: 'bg-transparent text-steel border border-transparent hover:text-ivory disabled:opacity-50',
  dark: 'bg-graphite-2 text-ivory border border-ivory/10 hover:border-gold/60 disabled:opacity-50',
};

const SIZES = {
  sm: 'min-h-[40px] px-4 text-[0.78rem]',
  md: 'min-h-[48px] px-6 text-[0.82rem]',
  lg: 'min-h-[56px] px-8 text-[0.88rem]',
};

export default function Button({
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  type = 'button',
  ...rest
}) {
  const classes = [
    'inline-flex items-center justify-center gap-2.5 font-sans font-semibold uppercase tracking-[0.16em]',
    'transition-colors duration-300 ease-cinematic select-none',
    VARIANTS[variant] || VARIANTS.primary,
    SIZES[size] || SIZES.md,
    className,
  ].join(' ');

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}
