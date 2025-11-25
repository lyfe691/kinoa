import type { Variants, Transition } from "framer-motion";

// Shared spring config for a snappy, premium feel
export const springTransition: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 30,
};

// Container variants for staggered children (desktop - drops down)
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.02,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
};

// Individual item variants with blur + scale + fade (desktop)
export const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -12,
    scale: 0.9,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: springTransition,
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.95,
    filter: "blur(4px)",
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

// Mobile-specific variants (slide up instead of down)
export const mobileContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
};

export const mobileItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
    scale: 0.95,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: springTransition,
  },
  exit: {
    opacity: 0,
    y: 8,
    scale: 0.98,
    filter: "blur(4px)",
    transition: { duration: 0.12, ease: "easeIn" },
  },
};
