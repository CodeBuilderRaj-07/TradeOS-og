export const pageTransition = {

  initial: {
    opacity: 0,
    y: 10,
  },

  animate: {

    opacity: 1,
    y: 0,

    transition: {

      duration: 0.45,
      ease: "easeOut",
    },
  },

  exit: {

    opacity: 0,
    y: -10,

    transition: {

      duration: 0.25,
    },
  },
};