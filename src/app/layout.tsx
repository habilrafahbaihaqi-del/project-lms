import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";

// Font untuk teks biasa (UI, paragraf, input)
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

// Font untuk Judul (Heading)
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "Klassa Site | LMS Platform",
  description:
    "Platform LMS modern untuk belajar, mengajar, dan berkembang bersama.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${plusJakartaSans.variable} ${outfit.variable}`}
    >
      {/* 
        Kita memasukkan variabel font ke tag body, 
        antialiased agar text lebih halus di layar resolusi tinggi 
      */}
      <body className="font-sans antialiased bg-[#050914]">{children}</body>
    </html>
  );
}
