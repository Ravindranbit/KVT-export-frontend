import type { Metadata } from "next";
import { Geist, Geist_Mono, Kumar_One, Arvo } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const arvo = Arvo({
  weight: ["400", "700"],
  variable: "--font-arvo",
  subsets: ["latin"],
});

const kumarOne = Kumar_One({
  weight: "400",
  variable: "--font-kumar-one",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KVT exports",
  description: "KVT exports storefront",
  icons: {
    icon: [],
  },
};

import ThemeSync from "../components/ThemeSync";
import Footer from "../components/layout/Footer";
import DynamicFavicon from "../components/DynamicFavicon";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${kumarOne.variable} ${arvo.variable} antialiased`}
      >
        <ThemeSync />
        <DynamicFavicon />
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
