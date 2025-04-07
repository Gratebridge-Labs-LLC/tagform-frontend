"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <div>
      <div className="flex justify-between items-center py-4 px-6 border border-gray-200 rounded-full bg-white shadow-sm">
        <Link href="/" className="font-jedira text-2xl bg-gradient-to-r from-black via-purple-700 to-black text-transparent bg-clip-text">
          tagform
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/auth/signin">
            <motion.button
              className="text-gray-600 hover:text-gray-900 text-sm font-[family-name:var(--font-geist-mono)]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign in
            </motion.button>
          </Link>
          <Link href="/auth/signup">
            <motion.button
              className="bg-black text-white px-4 py-2 rounded-full text-sm font-[family-name:var(--font-geist-mono)] hover:bg-gray-900 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  );
}
