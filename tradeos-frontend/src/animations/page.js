const spring = { type: "spring", stiffness: 280, damping: 28, mass: 0.8 };
const springBouncy = { type: "spring", stiffness: 350, damping: 22, mass: 0.7 };
const springGentle = { type: "spring", stiffness: 220, damping: 30, mass: 0.9 };

export const pageTransition = {
  initial: {
    opacity: 0,
    scale: 0.97,
    y: 12,
    filter: "blur(4px)",
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: spring,
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: -8,
    filter: "blur(6px)",
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

export const pageSlideRight = {
  initial: {
    opacity: 0,
    x: 40,
    scale: 0.97,
  },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: spring,
  },
  exit: {
    opacity: 0,
    x: -30,
    scale: 0.96,
    transition: { duration: 0.18, ease: "easeIn" },
  },
};

export const pageSlideLeft = {
  initial: {
    opacity: 0,
    x: -40,
    scale: 0.97,
  },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: spring,
  },
  exit: {
    opacity: 0,
    x: 30,
    scale: 0.96,
    transition: { duration: 0.18, ease: "easeIn" },
  },
};

export const fadeSlideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: springGentle },
  exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
};

export const scaleFade = {
  initial: { opacity: 0, scale: 0.92 },
  animate: { opacity: 1, scale: 1, transition: springBouncy },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.15 } },
};
