import { motion } from "framer-motion";

const ScrollReveal = ({
  children,
  delay = 0,
  y = 30,
  duration = 0.7,
  amount = 0.2,
  once = true,
  className = "",
}) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
