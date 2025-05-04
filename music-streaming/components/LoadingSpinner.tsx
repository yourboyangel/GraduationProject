"use client";

import { motion } from "framer-motion";

const LoadingSpinner = () => {
    return (
        <div className="h-full flex items-center justify-center">
            <motion.div
                className="w-16 h-16 border-4 border-[#2D2053] border-t-[#422B92] rounded-full"
                animate={{ rotate: 360 }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />
        </div>
    );
};

export default LoadingSpinner;