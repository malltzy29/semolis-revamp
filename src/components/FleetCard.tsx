"use client";

import React from "react";
import Link from "next/link";
import {
  BatteryCharging,
  Gauge,
  Weight,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Info,
  Sparkles,
} from "lucide-react";
import {
  ProductWithAvailability,
  formatRupiah,
} from "@/lib/fleet-data";

interface FleetCardProps {
  product: ProductWithAvailability;
  startDate?: string;
  endDate?: string;
  rentalDays?: number;
}

export default function FleetCard({
  product,
  startDate,
  endDate,
  rentalDays = 3,
}: FleetCardProps) {
  const validDays = rentalDays >= 3 ? rentalDays : 3;
  const estimatedTotal = validDays * product.price_per_day;

  const checkoutParams = new URLSearchParams();
  checkoutParams.set("motor", product.slug);
  if (startDate) checkoutParams.set("start", startDate);
  if (endDate) checkoutParams.set("end", endDate);

  return (
    <article
      className="bg-white rounded-[16px] border border-gray-200/90 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden group"
      aria-label={`Kartu Unit ${product.name}`}
    >
      {/* Image & Header Section */}
      <div className="relative bg-gradient-to-b from-emerald-50/70 to-gray-50/50 p-6 border-b border-gray-100">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#059669] text-white shadow-xs">
            {product.specs.badge}
          </span>

          {product.is_available ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-[#047857]">
              <span className="w-2 h-2 rounded-full bg-[#059669]" />
              Tersedia {product.available_stock} Unit
            </span>
          ) : (
            <span
              role="status"
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-[#EF4444]"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              Unit Penuh
            </span>
          )}
        </div>

        <div className="aspect-[16/10] w-full flex items-center justify-center overflow-hidden rounded-[12px] my-2">
          <img
            src={product.image_url}
            alt={`Motor Listrik ${product.name} - Semolis Bali`}
            className="w-full h-full object-contain group-hover:scale-102 transition-transform duration-300"
            loading="lazy"
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-[#6B7280]">
          <span className="font-medium text-[#111827]">{product.specs.targetPersona}</span>
          <span className="font-semibold text-[#059669]">Min. Sewa {product.min_days} Hari</span>
        </div>
      </div>

      {/* Body Content with Spacious Layout */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
        <div className="space-y-5">
          <div>
            <h3 className="text-xl font-extrabold text-[#111827]">
              {product.name}
            </h3>
            <p className="text-sm text-[#6B7280] mt-1 line-clamp-2">
              {product.specs.tagline}
            </p>
          </div>

          {/* Transparent Pricing Card */}
          <div className="p-4 rounded-[12px] bg-[#F9FAFB] border border-gray-200 flex items-baseline justify-between">
            <div>
              <span className="text-xs font-medium text-[#6B7280] block">
                Tarif Sewa Harian
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-extrabold text-[#111827]">
                  {formatRupiah(product.price_per_day)}
                </span>
                <span className="text-xs font-medium text-[#6B7280]">/ hari</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-medium text-[#6B7280] block">
                Estimasi {validDays} Hari
              </span>
              <span className="text-base font-extrabold text-[#059669]">
                {formatRupiah(estimatedTotal)}
              </span>
            </div>
          </div>

          {/* Program Hak Milik Badge */}
          <div className="px-3.5 py-2.5 rounded-[12px] bg-amber-50/80 border border-amber-200/80 flex items-center justify-between text-xs text-amber-900">
            <span className="flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              Sewa Hak Milik 720 Hari
            </span>
            <span className="font-extrabold text-[#111827]">
              {formatRupiah(product.price_per_day)}/hr
            </span>
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="p-2.5 rounded-[12px] bg-gray-50 border border-gray-100">
              <BatteryCharging className="w-4 h-4 text-[#059669] mx-auto mb-1" />
              <span className="text-[10px] text-[#6B7280] block">Jarak</span>
              <span className="text-xs font-bold text-[#111827]">
                {product.specs.maxRangeKm.split(" ")[0]} km
              </span>
            </div>
            <div className="p-2.5 rounded-[12px] bg-gray-50 border border-gray-100">
              <Gauge className="w-4 h-4 text-[#059669] mx-auto mb-1" />
              <span className="text-[10px] text-[#6B7280] block">Top Speed</span>
              <span className="text-xs font-bold text-[#111827]">
                {product.specs.maxSpeedKmh}
              </span>
            </div>
            <div className="p-2.5 rounded-[12px] bg-gray-50 border border-gray-100">
              <Weight className="w-4 h-4 text-[#059669] mx-auto mb-1" />
              <span className="text-[10px] text-[#6B7280] block">Beban</span>
              <span className="text-xs font-bold text-[#111827]">
                {product.specs.maxLoadKg}
              </span>
            </div>
          </div>

          {/* Included Features Clean List */}
          <ul className="space-y-2 text-xs text-[#6B7280]">
            {product.specs.features.slice(0, 2).map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                <span className="leading-tight">{feat}</span>
              </li>
            ))}
            <li className="flex items-start gap-2 text-[#059669] font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Dukungan tukar baterai di 29 titik SGB Bali</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons with High Focus */}
        <div className="pt-2 space-y-2">
          {product.is_available ? (
            <Link
              href={`/checkout?${checkoutParams.toString()}`}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-[12px] text-sm font-extrabold text-white bg-[#059669] hover:bg-[#047857] transition-all shadow-sm group-hover:shadow"
            >
              <span>Pesan Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-[12px] text-sm font-bold text-white bg-gray-300 cursor-not-allowed"
            >
              <span>Unit Penuh pada Tanggal Ini</span>
            </button>
          )}

          <Link
            href={`/fleet#${product.slug}`}
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-[12px] text-xs font-semibold text-[#6B7280] hover:text-[#111827] hover:bg-gray-50 transition-colors"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Spesifikasi Lengkap & Program 720 Hari</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
