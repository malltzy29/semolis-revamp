import React from "react";
import Link from "next/link";
import { Zap, MapPin, Phone, Mail, Clock, AlertCircle, ArrowUpRight } from "lucide-react";
import { PAYMENT_CONFIG } from "@/lib/fleet-data";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 pt-10 pb-24 sm:pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Symmetrical 12-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-8 border-b border-gray-200 items-stretch">
          {/* Column 1 (4 cols): Brand, Deskripsi & Media Sosial */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#059669] flex items-center justify-center text-white shadow-xs shrink-0">
                  <Zap className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <span className="text-lg font-extrabold tracking-tight text-[#111827] block leading-none">
                    SEMOLIS<span className="text-[#059669]">.BALI</span>
                  </span>
                  <span className="text-[11px] font-bold text-[#059669] tracking-wider uppercase block mt-1">
                    {PAYMENT_CONFIG.companyName}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
                Platform sewa motor listrik harian & program{" "}
                <strong className="text-[#111827]">Sewa Hak Milik 720 Hari</strong> di Bali
                dengan dukungan jaringan 29 titik Stasiun Ganti Baterai (SGB).
              </p>
            </div>

            {/* Social Media Pills - Aligned Side-by-Side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <a
                href={PAYMENT_CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#F9FAFB] hover:bg-emerald-50 border border-gray-200 transition-colors group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <svg className="w-4 h-4 text-pink-600 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  <div className="truncate">
                    <span className="block text-[10px] text-[#6B7280] leading-tight">Instagram</span>
                    <span className="text-xs font-bold text-[#111827] group-hover:text-[#059669] truncate block">
                      {PAYMENT_CONFIG.instagramHandle}
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#059669] shrink-0" />
              </a>

              <a
                href={PAYMENT_CONFIG.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#F9FAFB] hover:bg-emerald-50 border border-gray-200 transition-colors group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <svg className="w-4 h-4 text-blue-600 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <div className="truncate">
                    <span className="block text-[10px] text-[#6B7280] leading-tight">Facebook</span>
                    <span className="text-xs font-bold text-[#111827] group-hover:text-[#059669] truncate block">
                      KJI Impala Bali
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#059669] shrink-0" />
              </a>
            </div>
          </div>

          {/* Column 2 (3 cols): Unit & Program */}
          <div className="lg:col-span-3 flex flex-col justify-between space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#111827]">
              Pilihan Unit & Tarif Harian
            </h3>

            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link
                  href="/checkout?motor=volta-401"
                  className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-[#F9FAFB] hover:bg-emerald-50 border border-gray-100 transition-colors"
                >
                  <span className="font-medium text-[#111827]">Volta 401</span>
                  <span className="font-bold text-[#059669]">Rp 60.000/hr</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/checkout?motor=volta-eagle"
                  className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-[#F9FAFB] hover:bg-emerald-50 border border-gray-100 transition-colors"
                >
                  <span className="font-medium text-[#111827]">Volta Eagle</span>
                  <span className="font-bold text-[#059669]">Rp 65.000/hr</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/checkout?motor=volta-mandala"
                  className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-[#F9FAFB] hover:bg-emerald-50 border border-gray-100 transition-colors"
                >
                  <span className="font-medium text-[#111827]">Volta Mandala</span>
                  <span className="font-bold text-[#059669]">Rp 70.000/hr</span>
                </Link>
              </li>
            </ul>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Link
                href="/#hak-milik"
                className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors"
              >
                ★ Hak Milik 720 Hari
              </Link>
              <Link
                href="/#titik-sgb"
                className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-emerald-50 text-[#047857] border border-emerald-200 hover:bg-emerald-100 transition-colors"
              >
                ⚡ 29 Titik SGB
              </Link>
            </div>
          </div>

          {/* Column 3 (5 cols): Kontak Resmi & Lokasi Garasi (2x2 Balanced Grid) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#111827]">
              Kontak Resmi & Garasi Pengambilan
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-[#F9FAFB] border border-gray-200 flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#111827] block">Alamat Garasi:</span>
                  <span className="text-[#6B7280] leading-snug block mt-0.5">
                    {PAYMENT_CONFIG.officeAddress}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F9FAFB] border border-gray-200 flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#111827] block">WhatsApp Layanan:</span>
                  <a
                    href={`https://wa.me/${PAYMENT_CONFIG.adminWhatsApp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#059669] font-extrabold hover:underline block mt-0.5"
                  >
                    {PAYMENT_CONFIG.adminWhatsAppDisplay}
                  </a>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F9FAFB] border border-gray-200 flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="font-bold text-[#111827] block">Email Resmi:</span>
                  <a
                    href={`mailto:${PAYMENT_CONFIG.officialEmail}`}
                    className="text-[#6B7280] hover:text-[#111827] truncate block mt-0.5"
                  >
                    {PAYMENT_CONFIG.officialEmail}
                  </a>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F9FAFB] border border-gray-200 flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#111827] block">Jam Operasional:</span>
                  <span className="text-[#6B7280] block mt-0.5">
                    {PAYMENT_CONFIG.operationalHours}
                  </span>
                </div>
              </div>
            </div>

            {/* Compact Single-Line Policy Notice */}
            <div className="px-3 py-2 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-center gap-2 text-[11px] text-amber-900">
              <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>
                <strong>Ketentuan:</strong> Ambil & kembalikan mandiri di garasi (tanpa antar jemput) • Tidak free helm, jas hujan, & holder HP.
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B7280]">
          <p>
            © {new Date().getFullYear()} <strong className="text-[#111827]">{PAYMENT_CONFIG.brandName}</strong> ({PAYMENT_CONFIG.companyName}). All rights reserved.
          </p>
          <div className="flex items-center gap-6 font-medium">
            <Link href="/" className="hover:text-[#059669] transition-colors">
              Beranda
            </Link>
            <Link href="/fleet" className="hover:text-[#059669] transition-colors">
              Katalog Unit
            </Link>
            <Link href="/#hak-milik" className="hover:text-[#059669] transition-colors">
              Sewa Hak Milik
            </Link>
            <Link href="/checkout" className="hover:text-[#059669] transition-colors">
              Checkout
            </Link>
            <Link href="/admin" className="hover:text-[#059669] transition-colors text-gray-400">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
