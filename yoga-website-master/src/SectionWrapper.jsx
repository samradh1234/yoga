import { motion } from "framer-motion";

export default function SectionWrapper({ id, children, direction = "up", fullWidth = false }) {
  // Variants based on direction
  const variants = {
    up: { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } },
    down: { hidden: { opacity: 0, y: -40 }, visible: { opacity: 1, y: 0 } },
    left: { hidden: { opacity: 0, x: -60 }, visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 60 }, visible: { opacity: 1, x: 0 } },
  };

  return (
    <motion.section
      id={id}
      className={fullWidth ? "w-full" : "p-8 max-w-5xl mx-auto"}
      initial="hidden"
      whileInView="visible"
      variants={variants[direction]}
      transition={{ duration: 0.9, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
    >
      {children}
    </motion.section>
  );
}
