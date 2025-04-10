"use client";

import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import Image from "next/image";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

const buttonVariants = {
  hover: {
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
  tap: {
    scale: 0.95,
  },
};

export default function Home() {
  return (
    <div className="bg-white font-[family-name:var(--font-geist-sans)] min-h-screen flex flex-col">
      <div className="w-full max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 flex-1 mb-20">
        <Navbar />

        <div className="h-20" />
        
        {/* Beta announcement - centered */}
        <motion.div
          className="mt-6 mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
            <span className="animate-pulse relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            <span className="text-sm text-gray-600">Now in Beta</span>
          </div>
        </motion.div>
        
        {/* Main content centered */}
        <main className="flex flex-col items-center justify-center mt-2 max-w-3xl mx-auto">
          <motion.div 
            className="flex flex-col gap-6 md:gap-8 w-full text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 
              className="text-4xl sm:text-5xl font-jedira leading-tight"
              variants={itemVariants}
            >
              <span className="bg-gradient-to-r from-black via-purple-700 to-black text-transparent bg-clip-text">
                Create stunning event <span className="font-bold">forms</span> in{" "}
                <span className="font-jedira-italic font-bold">minutes</span> with{" "}
                <span className="font-bold">tagform</span>
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-base sm:text-lg tracking-[-.01em] text-gray-600"
              variants={itemVariants}
            >
              Easily create stunning <span className="bg-gray-100 px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">event forms</span> and access powerful tools for managing attendance, late registrations, and user analytics.
            </motion.p>

            <motion.div 
              className="flex gap-3 sm:gap-4 items-stretch justify-center flex-row w-full sm:w-auto mt-2 sm:mt-4"
              variants={itemVariants}
            >
              <motion.button
                className="flex-1 sm:flex-none bg-black text-white px-6 py-3 rounded-full text-sm/6 text-center font-[family-name:var(--font-geist-mono)] flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Get Started
                <ArrowRightIcon className="w-4 h-4" />
              </motion.button>
              <motion.button
                className="flex-1 sm:flex-none border border-gray-200 text-gray-800 px-6 py-3 rounded-full text-sm/6 text-center font-[family-name:var(--font-geist-mono)] hover:bg-gray-50 transition-colors"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Learn More
              </motion.button>
            </motion.div>
          </motion.div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
