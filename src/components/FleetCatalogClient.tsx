"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BatteryCharging,
  Gauge,
  Weight,
  Zap,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Calendar,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Award,
} from "lucide-react";
import {
  PAYMENT_CONFIG,
  ProductWithAvailability,
  calculateRentalDays,
  formatRupiah,
  TOTAL_SGB_COUNT,
} from "@/lib/fleet-data";

interface FleetCatalogClientProps {
  initialProducts: ProductWithAvailability[];
  defaultStartDate: string;
  defaultEndDate: string;
}

export default function FleetCatalogClient({
  initialProducts,
  defaultStartDate,
  defaultEndDate,
}: FleetCatalogClientProps) {
  const [products, setProducts] =
    useState<ProductWithAvailability[]>(initialProducts);
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [isLoading, setIsLoading] = useState(false);

  const rentalDays = calculateRentalDays(startDate, endDate);
  const isDurationInvalid = rentalDays < 3;
  const validDays = rentalDays >= 3 ? rentalDays : 3;

  useEffect(() => {
    if (!startDate || !endDate || rentalDays < 1) return;
    let cancelled = false;
    const loadStock = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/products?start_date=${encodeURIComponent(
            startDate
          )}&end_date=${encodeURIComponent(endDate)}`,
          { cache: "no-store" }
        );
        const data = await res.json();
        if (!cancelled && data.ok && Array.isArray(data.products)) {
          setProducts(data.products);
        }
      } catch {
        // Keep current products
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    loadStock();
    return () => {
      cancelled = true;
    };
  }, [startDate, endDate, rentalDays]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Page Header + Live Date Availability Filter */}
      <div className="bg-white rounded-[16px] border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#059669] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Katalog Spesifikasi Resmi • {PAYMENT_CONFIG.companyName}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#111827]">
              Katalog Unit Motor Listrik Volta Bali
            </h1>
            <p className="text-sm sm:text-base text-[#6B7280]">
              Tersedia untuk <strong>sewa harian (min. 3 hari)</strong> maupun <strong>Program Sewa Hak Milik 720 Hari</strong>. Seluruh unit didukung akses tukar baterai di <strong>{TOTAL_SGB_COUNT} titik SGB Bali</strong>.
            </p>
            <p className="text-xs text-amber-800 font-semibold">
              * Pengambilan mandiri di kantor: {PAYMENT_CONFIG.officeAddress} (tidak ada antar jemput, serta tidak free helm, jas hujan, & holder HP).
            </p>
          </div>

          {/* Date Range Filter for Real-Time Stock */}
          <div className="bg-[#F9FAFB] p-5 rounded-[16px] border border-gray-200 w-full lg:w-auto lg:min-w-[360px] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#059669]" />
                Filter Tanggal Sewa
              </span>
              {isLoading ? (
                <span className="inline-flex items-center gap-1 text-xs text-[#6B7280]">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#059669]" />
                  Memeriksa...
                </span>
              ) : (
                <span className="text-xs font-bold text-[#059669]">
                  {rentalDays > 0 ? `${rentalDays} Hari` : "Pilih Tanggal"}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label
                  htmlFor="fleet-start-date"
                  className="block text-[11px] font-semibold text-[#6B7280] mb-1"
                >
                  Tanggal Mulai
                </label>
                <input
                  id="fleet-start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-[12px] text-xs font-semibold text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#059669]"
                />
              </div>
              <div>
                <label
                  htmlFor="fleet-end-date"
                  className="block text-[11px] font-semibold text-[#6B7280] mb-1"
                >
                  Tanggal Selesai
                </label>
                <input
                  id="fleet-end-date"
                  type="date"
                  value={endDate}
                  min={startDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-[12px] text-xs font-semibold text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#059669]"
                />
              </div>
            </div>

            {isDurationInvalid && (
              <div
                role="alert"
                className="p-2.5 rounded-[12px] bg-red-50 border border-[#EF4444] flex items-center gap-2 text-xs font-bold text-[#EF4444]"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Durasi minimum penyewaan adalah 3 hari</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Product Sections */}
      <div className="space-y-8">
        {products.map((product) => {
          const totalForPeriod = validDays * product.price_per_day;
          const checkoutUrl = `/checkout?motor=${encodeURIComponent(
            product.slug
          )}&start=${encodeURIComponent(startDate)}&end=${encodeURIComponent(
            endDate
          )}`;

          return (
            <section
              key={product.id}
              id={product.slug}
              className="bg-white rounded-[16px] border border-gray-200 shadow-sm overflow-hidden scroll-mt-24"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Left Visual Column */}
                <div className="lg:col-span-5 bg-gradient-to-b from-emerald-50/60 to-gray-50/40 p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-gray-200">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#059669] text-white">
                      {product.specs.badge}
                    </span>
                    {product.is_available ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-[#047857]">
                        <span className="w-2 h-2 rounded-full bg-[#059669]" />
                        Tersedia {product.available_stock} Unit
                      </span>
                    ) : (
                      <span
                        role="status"
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-[#EF4444]"
                      >
                        <AlertCircle className="w-3.5 h-3.5" />
                        Unit Penuh pada Tanggal Ini
                      </span>
                    )}
                  </div>

                  <div className="my-6 aspect-[16/10] flex items-center justify-center">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="p-4 rounded-[12px] bg-white border border-gray-200 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-[#6B7280] block">
                          Tarif Sewa Harian
                        </span>
                        <span className="text-2xl font-extrabold text-[#111827]">
                          {formatRupiah(product.price_per_day)}
                        </span>
                        <span className="text-xs text-[#6B7280]"> / hari</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-[#6B7280] block">
                          Total {validDays} Hari
                        </span>
                        <span className="text-lg font-extrabold text-[#059669]">
                          {formatRupiah(totalForPeriod)}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-[12px] bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-900">
                      <span className="font-bold flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-amber-700" />
                        Opsi Hak Milik 720 Hari:
                      </span>
                      <span className="font-extrabold text-[#111827]">
                        {formatRupiah(product.price_per_day)}/hari
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Details & Specs Column */}
                <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-5">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#059669]">
                        {product.specs.targetPersona}
                      </p>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] mt-1">
                        {product.name}
                      </h2>
                      <p className="text-sm text-[#6B7280] mt-2 leading-relaxed">
                        {product.specs.description}
                      </p>
                    </div>

                    {/* Technical Specs Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3.5 rounded-[12px] bg-[#F9FAFB] border border-gray-200">
                        <BatteryCharging className="w-4 h-4 text-[#059669] mb-1" />
                        <span className="text-[11px] text-[#6B7280] block">
                          Jarak Tempuh
                        </span>
                        <span className="text-xs font-bold text-[#111827]">
                          {product.specs.maxRangeKm}
                        </span>
                      </div>
                      <div className="p-3.5 rounded-[12px] bg-[#F9FAFB] border border-gray-200">
                        <Gauge className="w-4 h-4 text-[#059669] mb-1" />
                        <span className="text-[11px] text-[#6B7280] block">
                          Kecepatan Maks
                        </span>
                        <span className="text-xs font-bold text-[#111827]">
                          {product.specs.maxSpeedKmh}
                        </span>
                      </div>
                      <div className="p-3.5 rounded-[12px] bg-[#F9FAFB] border border-gray-200">
                        <Zap className="w-4 h-4 text-[#059669] mb-1" />
                        <span className="text-[11px] text-[#6B7280] block">
                          Daya Motor
                        </span>
                        <span className="text-xs font-bold text-[#111827]">
                          {product.specs.motorPower}
                        </span>
                      </div>
                      <div className="p-3.5 rounded-[12px] bg-[#F9FAFB] border border-gray-200">
                        <Weight className="w-4 h-4 text-[#059669] mb-1" />
                        <span className="text-[11px] text-[#6B7280] block">
                          Beban Maksimal
                        </span>
                        <span className="text-xs font-bold text-[#111827]">
                          {product.specs.maxLoadKg}
                        </span>
                      </div>
                    </div>

                    {/* Features & Included Accessories */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div className="space-y-2">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827]">
                          Keunggulan Unit
                        </h3>
                        <ul className="space-y-1.5 text-xs text-[#6B7280]">
                          {product.specs.features.map((feat, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827]">
                          Fasilitas Termasuk
                        </h3>
                        <ul className="space-y-1.5 text-xs text-[#6B7280]">
                          {product.specs.includedItems.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <ShieldCheck className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                          <li className="text-[11px] text-amber-800 font-semibold pt-1">
                            * Tidak termasuk free helm, jas hujan, holder HP, & tidak ada antar jemput
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Bottom CTA Row */}
                  <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-xs text-[#6B7280]">
                      Tukar Baterai SGB: <strong className="text-[#111827]">&lt; 1 Menit di 29 Titik SGB Bali</strong>
                    </div>

                    {product.is_available && !isDurationInvalid ? (
                      <Link
                        href={checkoutUrl}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[12px] text-sm font-bold text-white bg-[#059669] hover:bg-[#047857] transition-colors shadow-sm shrink-0"
                      >
                        <span>Pesan {product.name}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[12px] text-sm font-bold text-white bg-gray-300 cursor-not-allowed shrink-0"
                      >
                        <span>
                          {isDurationInvalid
                            ? "Minimal Sewa 3 Hari"
                            : "Unit Penuh pada Tanggal Ini"}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* Side-by-Side Comparison Matrix */}
      <section className="bg-white rounded-[16px] border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#059669]">
            Tabel Perbandingan 3 Unit
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#111827] mt-1">
            Ringkasan Spesifikasi & Program 720 Hari
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-[#111827] bg-[#F9FAFB]">
                <th className="py-3.5 px-4 font-bold rounded-tl-[12px]">
                  Parameter
                </th>
                <th className="py-3.5 px-4 font-bold">Volta 401</th>
                <th className="py-3.5 px-4 font-bold">Volta Eagle</th>
                <th className="py-3.5 px-4 font-bold rounded-tr-[12px]">
                  Volta Mandala
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-xs sm:text-sm">
              <tr>
                <td className="py-3.5 px-4 font-semibold text-[#6B7280]">
                  Tarif Sewa Harian
                </td>
                <td className="py-3.5 px-4 font-extrabold text-[#059669]">
                  Rp 60.000 / hari
                </td>
                <td className="py-3.5 px-4 font-extrabold text-[#059669]">
                  Rp 65.000 / hari
                </td>
                <td className="py-3.5 px-4 font-extrabold text-[#059669]">
                  Rp 70.000 / hari
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-[#6B7280]">
                  Paket Minimum (3 Hari)
                </td>
                <td className="py-3.5 px-4 font-bold text-[#111827]">
                  Rp 180.000
                </td>
                <td className="py-3.5 px-4 font-bold text-[#111827]">
                  Rp 195.000
                </td>
                <td className="py-3.5 px-4 font-bold text-[#111827]">
                  Rp 210.000
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-[#6B7280]">
                  Program Hak Milik (720 Hari)
                </td>
                <td className="py-3.5 px-4 font-bold text-amber-700">
                  Rp 60.000 / hari
                </td>
                <td className="py-3.5 px-4 font-bold text-amber-700">
                  Rp 65.000 / hari
                </td>
                <td className="py-3.5 px-4 font-bold text-amber-700">
                  Rp 70.000 / hari
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-[#6B7280]">
                  Jaringan Tukar Baterai
                </td>
                <td className="py-3.5 px-4 text-[#111827]">29 Titik SGB Bali</td>
                <td className="py-3.5 px-4 text-[#111827]">29 Titik SGB Bali</td>
                <td className="py-3.5 px-4 text-[#111827]">29 Titik SGB Bali</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-[#6B7280]">
                  Daya Angkut Maksimal
                </td>
                <td className="py-3.5 px-4 text-[#111827]">200 kg</td>
                <td className="py-3.5 px-4 text-[#111827]">180 kg</td>
                <td className="py-3.5 px-4 text-[#111827]">150 kg</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
