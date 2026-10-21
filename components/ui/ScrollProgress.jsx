'use client';

import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion';

// Thin reading-progress hairline fixed at the top of the viewport.
export default function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });
  if (reduce) return null;
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gold rtl:origin-right"
    />
  );
}
