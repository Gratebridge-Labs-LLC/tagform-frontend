"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

const navigation = [
  { name: "Forms", href: "/dashboard", current: true },
  { name: "Integrations", href: "/dashboard/integrations", current: false },
  { name: "Brand kit", href: "/dashboard/brand-kit", current: false },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation */}
      <header className="border-b border-gray-200">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 w-full max-w-[1440px] mx-auto">
          {/* Left - Brand */}
          <Link href="/dashboard">
            <h1 className="text-2xl font-jedira bg-gradient-to-r from-black via-purple-700 to-black text-transparent bg-clip-text">
              tagform
            </h1>
          </Link>

          {/* Right - Icons */}
          <div className="flex items-center gap-3">
            <button className="text-gray-400 hover:text-gray-600">
              <QuestionMarkCircleIcon className="w-5 h-5" />
            </button>
            <div className="h-8 w-8 rounded-full bg-[#FF6B00] flex items-center justify-center text-white text-sm font-medium">
              VO
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8 px-4 sm:px-6 w-full max-w-[1440px] mx-auto">
        {children}
      </main>
    </div>
  );
} 