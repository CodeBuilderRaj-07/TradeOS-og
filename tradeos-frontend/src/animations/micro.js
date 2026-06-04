const springTap = { type: "spring", stiffness: 500, damping: 20, mass: 0.5 };
const springHover = { type: "spring", stiffness: 300, damping: 20, mass: 0.6 };

export const tapScale = {
  whileTap: { scale: 0.96, transition: springTap },
};

export const hoverLift = {
  whileHover: {
    y: -3,
    scale: 1.01,
    transition: springHover,
  },
  whileTap: { scale: 0.98, transition: springTap },
};

export const hoverGlow = {
  whileHover: {
    boxShadow: "0 0 30px hsl(var(--primary) / 0.12)",
    transition: { duration: 0.25 },
  },
};

export const cardEnter = {
  initial: { opacity: 0, y: 20, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 220, damping: 25, mass: 0.7 } },
};

export const listItem = {
  initial: { opacity: 0, x: -12 },
  animate: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 200, damping: 26 } },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.25 } },
};

export const counter = {
  initial: { opacity: 0, scale: 0.5 },
  animate: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 15 } },
};
