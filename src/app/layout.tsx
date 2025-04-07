import type { Metadata } from "next";
import { Geist, Geist_Mono, Nunito } from "next/font/google";
import "./globals.css";
import localFont from 'next/font/local';
import { Providers } from './providers';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jediraRegular = localFont({
  src: '../../public/Fonts/JediraRegular.ttf',
  variable: '--font-jedira-regular'
});

const jediraItalic = localFont({
  src: '../../public/Fonts/JediraItalic.ttf',
  variable: '--font-jedira-italic'
});

const nunito = Nunito({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "attendbase",
  description: "attendbase | Event based forms, and real-time tracking",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${jediraRegular.variable} ${jediraItalic.variable} ${nunito.variable} antialiased`}>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
