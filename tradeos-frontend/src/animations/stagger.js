const spring = { type: "spring", stiffness: 260, damping: 26, mass: 0.7 };
const springGentle = { type: "spring", stiffness: 200, damping: 28, mass: 0.8 };

export const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

export const staggerContainerFast = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.035,
    },
  },
};

export const staggerItem = {
  hidden: {
    opacity: 0,
    y: 16,
    scale: 0.98,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: spring,
  },
};

export const staggerItemSimple = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: springGentle,
  },
};

export const staggerItemLeft = {
  hidden: {
    opacity: 0,
    x: -16,
  },
  show: {
    opacity: 1,
    x: 0,
    transition: spring,
  },
};

export const staggerItemRight = {
  hidden: {
    opacity: 0,
    x: 16,
  },
  show: {
    opacity: 1,
    x: 0,
    transition: spring,
  },
};
