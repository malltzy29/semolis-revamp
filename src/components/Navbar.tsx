"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Zap,
  Menu,
  X,
  CalendarCheck,
  BatteryCharging,
  Phone,
  MessageCircle,
} from "lucide-react";
import { PAYMENT_CONFIG, TOTAL_SGB_COUNT } from "@/lib/fleet-data";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const navItems = [
    { href: "/", label: "Beranda" },
    { href: "/fleet", label: "Katalog Unit" },
    { href: "/#hak-milik", label: "Sewa Hak Milik" },
    { href: "/checkout", label: "Kalkulator & Checkout" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200">
      {/* Slim Top Info Bar */}
      <div className="bg-[#059669] text-white text-[11px] sm:text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-medium truncate">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-200 shrink-0" />
            <span className="truncate">
              <strong>{PAYMENT_CONFIG.companyName}</strong> — Sewa Harian Mulai Rp 60.000/hari & Hak Milik 720 Hari
            </span>
          </div>

          <div className="hidden md:flex items-center gap-5 text-emerald-50 shrink-0 font-medium">
            <span className="inline-flex items-center gap-1">
              <BatteryCharging className="w-3.5 h-3.5 text-emerald-200" />
              {TOTAL_SGB_COUNT} Titik SGB Bali
            </span>
            <a
              href={`https://wa.me/${PAYMENT_CONFIG.adminWhatsApp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-white underline-offset-2 hover:underline"
            >
              <Phone className="w-3 h-3 text-emerald-200" />
              {PAYMENT_CONFIG.adminWhatsAppDisplay}
            </a>
          </div>
        </div>
      </div>

      {/* Main Header Bar - Symmetrical 3-Part Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus:outline-none shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-[#059669] group-hover:bg-[#047857] transition-colors flex items-center justify-center text-white shadow-xs">
            <Zap className="w-4 h-4 fill-current" />
          </div>
          <div>
            <span className="text-base sm:text-lg font-extrabold tracking-tight text-[#111827] block leading-none">
              SEMOLIS<span className="text-[#059669]">.BALI</span>
            </span>
            <span className="text-[10px] font-bold text-[#6B7280] tracking-wider uppercase block mt-0.5">
              {PAYMENT_CONFIG.companyName}
            </span>
          </div>
        </Link>

        {/* Center: Clean Pill Navigation */}
        <nav
          className="hidden lg:flex items-center bg-[#F9FAFB] border border-gray-200/80 rounded-xl p-1 gap-1"
          aria-label="Navigasi Utama"
        >
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(item.href) && item.href !== "/#hak-milik";
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? "bg-white text-[#059669] shadow-2xs border border-gray-200/60"
                    : "text-[#6B7280] hover:text-[#111827]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="hidden md:flex items-center gap-2.5 shrink-0">
          <a
            href={`https://wa.me/${PAYMENT_CONFIG.adminWhatsApp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#111827] bg-[#F9FAFB] hover:bg-gray-100 border border-gray-200 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#059669]" />
            <span>Chat Admin</span>
          </a>

          <Link
            href="/checkout"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#059669] hover:bg-[#047857] transition-colors shadow-xs"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Pesan Unit</span>
          </Link>
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={mobileMenuOpen}
            className="p-2 rounded-xl text-[#111827] hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-5 space-y-1.5">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(item.href) && item.href !== "/#hak-milik";
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3.5 py-2.5 rounded-xl text-sm font-bold ${
                  isActive
                    ? "bg-emerald-50 text-[#059669]"
                    : "text-[#111827] hover:bg-gray-50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/checkout"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-white bg-[#059669] hover:bg-[#047857]"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Pesan Unit Sekarang</span>
            </Link>
            <a
              href={`https://wa.me/${PAYMENT_CONFIG.adminWhatsApp}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-[#111827] bg-gray-100 hover:bg-gray-200"
            >
              <MessageCircle className="w-4 h-4 text-[#059669]" />
              <span>Konfirmasi via WhatsApp Admin</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
