import React from "react";
import Link from "next/link";
import { ArrowLeft, Zap } from "lucide-react";
import { PAYMENT_CONFIG } from "@/lib/fleet-data";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="w-14 h-14 bg-emerald-100 text-[#059669] rounded-2xl flex items-center justify-center mb-4 shadow-xs">
        <Zap className="w-7 h-7 fill-current" />
      </div>
      <span className="text-xs font-bold uppercase tracking-wider text-[#059669]">
        Error 404 • Halaman Tidak Ditemukan
      </span>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111827] mt-2 mb-3">
        Halaman yang Anda Cari Tidak Tersedia
      </h1>
      <p className="text-sm text-[#6B7280] max-w-md mx-auto mb-6">
        Halaman yang Anda tuju mungkin sudah dipindahkan atau URL yang dimasukkan salah. Silakan kembali ke katalog {PAYMENT_CONFIG.brandName}.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs sm:text-sm font-bold transition-all shadow-xs"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Beranda</span>
      </Link>
    </div>
  );
}
