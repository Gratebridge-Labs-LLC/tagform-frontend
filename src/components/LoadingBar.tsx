"use client";

import { motion } from "framer-motion";

export default function LoadingBar() {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
      <div className="w-full max-w-md px-4">
        <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-black"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: 1.5,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />
        </div>
      </div>
    </div>
  );
} 