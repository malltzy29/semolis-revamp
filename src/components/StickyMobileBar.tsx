"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarCheck, Compass } from "lucide-react";

export default function StickyMobileBar() {
  const pathname = usePathname();

  // Hide on /checkout, /success, and /admin to avoid overlapping action buttons
  if (
    pathname?.startsWith("/checkout") ||
    pathname?.startsWith("/success") ||
    pathname?.startsWith("/admin")
  ) {
    return null;
  }

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-40 sm:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
      role="region"
      aria-label="Bar Aksi Cepat Mobile"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium text-[#6B7280] leading-tight">
            Sewa Harian (Min. 3 Hari)
          </p>
          <p className="text-base font-extrabold text-[#111827]">
            Mulai <span className="text-[#059669]">Rp 60.000</span>
            <span className="text-xs font-normal text-[#6B7280]">/hari</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {pathname !== "/fleet" && (
            <Link
              href="/fleet"
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-[12px] text-xs font-semibold text-[#111827] bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Compass className="w-4 h-4 text-[#059669]" />
              <span>Unit</span>
            </Link>
          )}
          <Link
            href="/checkout"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[12px] text-xs font-bold text-white bg-[#059669] hover:bg-[#047857] transition-colors shadow-sm"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Pesan Sekarang</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

