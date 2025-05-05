"use client";

import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

const Loading = () => {
  return (
    <motion.div 
      className={twMerge(`
        fixed 
        inset-0
        flex 
        items-center 
        justify-center 
        bg-neutral-900/50 
        backdrop-blur-sm
        z-50
      `)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.3,
        ease: "easeInOut"
      }}
    >
      <motion.div
        className="h-16 w-16 border-4 border-neutral-400 border-t-[#2D2053] rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </motion.div>
  );
};

export default Loading;