"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="text-xl font-jedira bg-gradient-to-r from-black via-purple-700 to-black text-transparent bg-clip-text inline-block">
              tagform
            </Link>
            <p className="text-sm text-gray-500">
              A tool and product under Gratebridge Labs
            </p>
            <p className="text-sm text-gray-500">
              1021 E Lincolnway Suite #7415<br />
              Cheyenne, Wyoming 82001<br />
              United States
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li>
                <a href="mailto:tagform@gratebridgelabs.xyz" className="text-sm text-gray-500 hover:text-gray-700">
                  tagform@gratebridgelabs.xyz
                </a>
              </li>
              <li>
                <a href="tel:+15307736391" className="text-sm text-gray-500 hover:text-gray-700">
                  +1 (530) 773-6391
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-700">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-700">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            © {new Date().getFullYear()} tagform. A Gratebridge Labs product. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
