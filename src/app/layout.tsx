import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StickyMobileBar from "@/components/StickyMobileBar";

export const metadata: Metadata = {
  title: "Semolis Bali — Sewa Motor Listrik Bali (Volta 401, Eagle, Mandala)",
  description:
    "Platform sewa motor listrik Bali dengan tarif harian transparan mulai Rp 60.000/hari (min. 3 hari), program sewa hak milik 720 hari, dan dukungan 29 titik SGB Bali.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="bg-[#F9FAFB] text-[#111827] antialiased flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <StickyMobileBar />
      </body>
    </html>
  );
}

