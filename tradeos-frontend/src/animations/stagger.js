export const staggerContainer = {

  hidden: {},

  show: {

    transition: {

      staggerChildren: 0.08,
    },
  },
};

export const staggerItem = {

  hidden: {

    opacity: 0,
    y: 12,
  },

  show: {

    opacity: 1,
    y: 0,

    transition: {

      duration: 0.35,
    },
  },
};