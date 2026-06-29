import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { CartProvider } from "@/components/CartProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Aether",
  description: "A private luxury catalog for curated designer pieces.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#050505] text-white">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
