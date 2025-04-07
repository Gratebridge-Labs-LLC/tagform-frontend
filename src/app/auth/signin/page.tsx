"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import LoadingBar from "@/components/LoadingBar";

export default function SignIn() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Redirect to dashboard
    router.push("/dashboard");
  };

  return (
    <>
      {isLoading && <LoadingBar />}
      <div className="h-screen overflow-hidden bg-white flex">
        {/* Left Section */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto lg:overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-[360px] sm:max-w-[400px]"
          >
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 lg:mb-6"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to home
            </Link>

            <h1 className="text-3xl sm:text-4xl font-jedira mb-2 bg-gradient-to-r from-black via-purple-700 to-black text-transparent bg-clip-text">
              Welcome back
            </h1>
            <p className="text-gray-600 mb-4 lg:mb-6">
              Sign in to your account
            </p>

            <div className="space-y-2 lg:space-y-3 mb-4 lg:mb-6">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 lg:py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                onClick={() => {
                  setIsLoading(true);
                  setTimeout(() => router.push("/dashboard"), 2000);
                }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385c.6.105.825-.255.825-.57c0-.285-.015-1.23-.015-2.235c-3.015.555-3.795-.735-4.035-1.41c-.135-.345-.72-1.41-1.23-1.695c-.42-.225-1.02-.78-.015-.795c.945-.015 1.62.87 1.845 1.23c1.08 1.815 2.805 1.305 3.495.99c.105-.78.42-1.305.765-1.605c-2.67-.3-5.46-1.335-5.46-5.925c0-1.305.465-2.385 1.23-3.225c-.12-.3-.54-1.53.12-3.18c0 0 1.005-.315 3.3 1.23c.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23c.66 1.65.24 2.88.12 3.18c.765.84 1.23 1.905 1.23 3.225c0 4.605-2.805 5.625-5.475 5.925c.435.375.81 1.095.81 2.22c0 1.605-.015 2.895-.015 3.3c0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"
                    fill="currentColor"
                  />
                </svg>
                Continue with GitHub
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 lg:py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                onClick={() => {
                  setIsLoading(true);
                  setTimeout(() => router.push("/dashboard"), 2000);
                }}
              >
                <svg className="w-5 h-5" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                </svg>
                Continue with Google
              </motion.button>
            </div>

            <div className="relative my-4 lg:my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            <form onSubmit={handleSignIn} className="space-y-3 lg:space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-2 lg:py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors text-sm"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Link href="/auth/forgot-password" className="text-sm text-purple-600 hover:text-purple-700">
                    Forgot password?
                  </Link>
                </div>
                <input
                  type="password"
                  id="password"
                  className="w-full px-4 py-2 lg:py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors text-sm"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                className="w-full bg-black text-white py-2 lg:py-2.5 rounded-lg hover:bg-gray-900 transition-colors text-sm"
              >
                Sign In
              </motion.button>
            </form>

            <p className="mt-4 lg:mt-6 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-purple-600 hover:text-purple-700 font-medium">
                Sign Up Now
              </Link>
            </p>
          </motion.div>
        </div>

        {/* Right Section */}
        <div className="hidden lg:flex lg:w-1/2 bg-gray-50 items-center justify-center p-6">
          <div className="max-w-lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-8"
            >
              <div className="text-center space-y-4">
                <div className="text-4xl">👋</div>
                <blockquote className="text-lg font-jedira-italic text-gray-900">
                  "Welcome back to your event management hub"
                </blockquote>
              </div>

              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <p className="text-sm font-jedira-italic text-gray-700">
                    "Track attendance and check-ins in real-time"
                  </p>
                  <div className="mt-1 text-xs text-gray-500">@EventHost</div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <p className="text-sm font-jedira-italic text-gray-700">
                    "Beautiful landing pages that convert visitors"
                  </p>
                  <div className="mt-1 text-xs text-gray-500">@EventDesigner</div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <p className="text-sm font-jedira-italic text-gray-700">
                    "Keep your attendees informed with instant updates"
                  </p>
                  <div className="mt-1 text-xs text-gray-500">@EventCoordinator</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
} 