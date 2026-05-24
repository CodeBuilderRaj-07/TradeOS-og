import { motion } from "framer-motion";

export default function AnimatedButton({
  children,
  className = "",
  ...props
}) {

  return (

    <motion.button

      whileHover={{
        scale: 1.02,
        y: -1,
      }}

      whileTap={{
        scale: 0.98,
      }}

      transition={{
        duration: 0.18,
      }}

      className={className}

      {...props}
    >

      {children}

    </motion.button>
  );
}