import type { Metadata } from "next";
import { Geist, Geist_Mono, Kumar_One } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${kumarOne.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
