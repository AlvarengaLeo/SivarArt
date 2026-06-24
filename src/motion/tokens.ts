/** Lenguaje de movimiento de SivarArt — restraint = premium. */
export const DURATION = {
  xfast: 0.12,
  fast: 0.2,
  base: 0.32,
  slow: 0.56,
  cinematic: 0.9,
} as const;

export const EASE = {
  standard: [0.16, 1, 0.3, 1], // easeOutExpo — entradas
  emphasized: [0.83, 0, 0.17, 1], // in-out — secciones / cámara
  exit: [0.7, 0, 0.84, 0], // salidas
} as const;

/** Variants de Framer Motion reutilizables. */
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slow, ease: EASE.standard },
  },
};

export const stagger = (gap = 0.07) => ({
  hidden: {},
  show: { transition: { staggerChildren: gap } },
});
