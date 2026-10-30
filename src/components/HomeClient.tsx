"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Clock,
  Sparkles,
  RefreshCw,
  BatteryCharging,
  MessageCircle,
  Award,
} from "lucide-react";
import {
  PAYMENT_CONFIG,
  ProductWithAvailability,
  calculateRentalDays,
  formatRupiah,
  TOTAL_SGB_COUNT,
  RENT_TO_OWN_INFO,
} from "@/lib/fleet-data";
import FleetCard from "./FleetCard";

interface HomeClientProps {
  initialProducts: ProductWithAvailability[];
  defaultStartDate: string;
  defaultEndDate: string;
}

export default function HomeClient({
  initialProducts,
  defaultStartDate,
  defaultEndDate,
}: HomeClientProps) {
  const [products, setProducts] =
    useState<ProductWithAvailability[]>(initialProducts);
  const [startDate, setStartDate] = useState<string>(defaultStartDate);
  const [endDate, setEndDate] = useState<string>(defaultEndDate);
  const [selectedSlug, setSelectedSlug] = useState<string>("volta-401");
  const [isLoadingStock, setIsLoadingStock] = useState<boolean>(false);

  const rentalDays = calculateRentalDays(startDate, endDate);
  const isDurationInvalid = rentalDays < 3;

  const selectedProduct =
    products.find((p) => p.slug === selectedSlug) ?? products[0];
  const estimatedCost =
    !isDurationInvalid && selectedProduct
      ? rentalDays * selectedProduct.price_per_day
      : 0;

  useEffect(() => {
    if (!startDate || !endDate || rentalDays < 1) return;

    let cancelled = false;
    const fetchAvailability = async () => {
      setIsLoadingStock(true);
      try {
        const res = await fetch(
          `/api/products?start_date=${encodeURIComponent(
            startDate
          )}&end_date=${encodeURIComponent(endDate)}`,
          { cache: "no-store" }
        );
        if (res.ok) {
          const data = await res.json();
          if (!cancelled && data.ok && Array.isArray(data.products)) {
            setProducts(data.products);
            return;
          }
        }
      } catch {
        // Fallback for static hosting
      } finally {
        if (!cancelled) {
          setIsLoadingStock(false);
        }
      }
      const savedLocal = localStorage.getItem("semolis_products_override");
      if (!cancelled && savedLocal) {
        try {
          setProducts(JSON.parse(savedLocal));
        } catch {
          // Ignore parse error
        }
      }
    };

    fetchAvailability();
    return () => {
      cancelled = true;
    };
  }, [startDate, endDate, rentalDays]);

  const rentToOwnWaMessage = `Halo Admin ${PAYMENT_CONFIG.companyName}, saya tertarik ingin berkonsultasi mengenai Program Sewa Hak Milik 720 Hari untuk unit motor listrik Volta. Mohon informasinya.`;
  const rentToOwnWaUrl = `https://wa.me/${PAYMENT_CONFIG.adminWhatsApp}?text=${encodeURIComponent(rentToOwnWaMessage)}`;

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-[#F9FAFB] pt-12 pb-16 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-[#047857] text-xs font-bold">
                <Sparkles className="w-4 h-4 text-[#059669]" />
                <span>{PAYMENT_CONFIG.companyName} • Solusi Motor Listrik Bali</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#111827] leading-[1.12]">
                Keliling Bali <span className="text-[#059669]">Bebas Polusi</span> & Hemat Biaya.
              </h1>

              <p className="text-base sm:text-lg text-[#6B7280] max-w-2xl leading-relaxed">
                Penyewaan unit motor listrik harian transparan mulai{" "}
                <strong className="text-[#111827]">Rp 60.000/hari</strong> (min. 3 hari) dan{" "}
                <strong className="text-[#059669]">Program Sewa Hak Milik 720 Hari</strong> didukung{" "}
                <strong className="text-[#111827]">{TOTAL_SGB_COUNT} titik stasiun tukar baterai (SGB)</strong> di Bali.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#katalog-motor"
                  className="px-6 py-3.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-extrabold text-sm sm:text-base shadow-sm transition-all inline-flex items-center gap-2"
                >
                  <span>Lihat Katalog Unit</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#hak-milik"
                  className="px-6 py-3.5 rounded-xl bg-white border border-gray-300 hover:border-gray-400 text-[#111827] font-bold text-sm sm:text-base transition-colors inline-flex items-center gap-2"
                >
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Program Hak Milik 720 Hari</span>
                </a>
              </div>

              {/* 3 Core Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-200/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-extrabold text-[#111827] block">Min. 3 Hari</span>
                    <span className="text-xs text-[#6B7280]">Tarif Harian Terjangkau</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center shrink-0">
                    <BatteryCharging className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-extrabold text-[#111827] block">{TOTAL_SGB_COUNT} Titik SGB</span>
                    <span className="text-xs text-[#6B7280]">Tukar Baterai &lt; 1 Menit</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-extrabold text-[#111827] block">BCA & E-Wallet</span>
                    <span className="text-xs text-[#6B7280]">BCA (Aktif) & QRIS/OVO (Coming soon)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Right: Quick Calculator & Date Simulator */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-6 sm:p-7 space-y-5">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#059669]">
                      Simulasi Sewa Harian
                    </span>
                    <h2 className="text-lg font-extrabold text-[#111827] mt-0.5">
                      Kalkulator Biaya Sewa
                    </h2>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center">
                    <Calendar className="w-5 h-5" />
                  </div>
                </div>

                {/* Motor Select */}
                <div className="space-y-1.5">
                  <label htmlFor="quick-motor-select" className="block text-xs font-bold text-[#111827]">
                    Pilih Unit Motor
                  </label>
                  <select
                    id="quick-motor-select"
                    value={selectedSlug}
                    onChange={(e) => setSelectedSlug(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-gray-300 rounded-xl text-sm font-semibold text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#059669]"
                  >
                    {products.map((p) => (
                      <option key={p.slug} value={p.slug}>
                        {p.name} — {formatRupiah(p.price_per_day)}/hari ({p.available_stock > 0 ? `Tersedia ${p.available_stock} unit` : "Penuh"})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label htmlFor="quick-start-date" className="block text-xs font-bold text-[#111827]">
                      Tanggal Mulai
                    </label>
                    <input
                      id="quick-start-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-gray-300 rounded-xl text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#059669]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="quick-end-date" className="block text-xs font-bold text-[#111827]">
                      Tanggal Selesai
                    </label>
                    <input
                      id="quick-end-date"
                      type="date"
                      value={endDate}
                      min={startDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-gray-300 rounded-xl text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#059669]"
                    />
                  </div>
                </div>

                {/* Validation Alert if < 3 days */}
                {isDurationInvalid && (
                  <div
                    role="alert"
                    className="p-3.5 rounded-xl bg-red-50 border border-[#EF4444] flex items-start gap-2.5 text-[#EF4444]"
                  >
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div className="text-xs leading-relaxed">
                      <p className="font-extrabold text-sm">
                        Durasi minimum penyewaan adalah 3 hari
                      </p>
                      <p className="mt-0.5 text-red-600">
                        Durasi terpilih saat ini: {rentalDays > 0 ? rentalDays : 0} hari. Silakan sesuaikan tanggal selesai minimal 3 hari.
                      </p>
                    </div>
                  </div>
                )}

                {/* Stock Out Alert */}
                {!isDurationInvalid && selectedProduct && !selectedProduct.is_available && (
                  <div
                    role="alert"
                    className="p-3.5 rounded-xl bg-red-50 border border-[#EF4444] flex items-start gap-2.5 text-[#EF4444]"
                  >
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div className="text-xs font-bold">
                      Unit penuh pada tanggal tersebut
                    </div>
                  </div>
                )}

                {/* Calculation Summary Box */}
                <div className="p-4 rounded-xl bg-[#F9FAFB] border border-gray-200 space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#6B7280]">
                    <span>Durasi Sewa</span>
                    <span className="font-bold text-[#111827]">
                      {rentalDays > 0 ? `${rentalDays} Hari` : "-"} (Min. 3 Hari)
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#6B7280]">
                    <span>Tarif Unit</span>
                    <span className="font-semibold text-[#111827]">
                      {selectedProduct ? `${formatRupiah(selectedProduct.price_per_day)} / hari` : "-"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#6B7280]">
                    <span>Ketersediaan Unit</span>
                    {isLoadingStock ? (
                      <span className="inline-block h-4 w-20 rounded bg-gray-200 animate-pulse" />
                    ) : selectedProduct?.is_available ? (
                      <span className="font-bold text-[#059669]">
                        Tersedia {selectedProduct.available_stock} Unit
                      </span>
                    ) : (
                      <span className="font-bold text-[#EF4444]">Penuh</span>
                    )}
                  </div>
                  <div className="pt-2 border-t border-gray-200 flex items-baseline justify-between">
                    <span className="text-sm font-bold text-[#111827]">
                      Total Estimasi Biaya
                    </span>
                    <span className="text-2xl font-extrabold text-[#059669]">
                      {isDurationInvalid ? "—" : formatRupiah(estimatedCost)}
                    </span>
                  </div>
                </div>

                {/* CTA Button */}
                {isDurationInvalid || !selectedProduct?.is_available ? (
                  <button
                    type="button"
                    disabled
                    className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gray-300 cursor-not-allowed"
                  >
                    {isDurationInvalid
                      ? "Pilih Minimal 3 Hari untuk Checkout"
                      : "Unit Penuh pada Tanggal Ini"}
                  </button>
                ) : (
                  <Link
                    href={`/checkout?motor=${encodeURIComponent(
                      selectedProduct.slug
                    )}&start=${encodeURIComponent(startDate)}&end=${encodeURIComponent(endDate)}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-extrabold text-white bg-[#059669] hover:bg-[#047857] transition-colors shadow-sm"
                  >
                    <span>Lanjut ke Checkout ({rentalDays} Hari)</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}

                <p className="text-[11px] text-[#6B7280] text-center">
                  Pengambilan unit mandiri di garasi Sidakarya • Tidak free helm, jas hujan, & holder HP
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BANNER UTAMA: PROGRAM SEWA HAK MILIK 720 HARI (SPOTLIGHT) */}
      <section id="hak-milik" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="relative rounded-2xl bg-gradient-to-br from-emerald-900 via-[#064E3B] to-[#047857] text-white p-8 sm:p-12 overflow-hidden shadow-xl">
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Program Unggulan {PAYMENT_CONFIG.companyName}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                {RENT_TO_OWN_INFO.title}
              </h2>
              <p className="text-emerald-100 text-base sm:text-lg max-w-xl leading-relaxed">
                {RENT_TO_OWN_INFO.subtitle}. Cukup sewa harian selama <strong>720 hari</strong> untuk seluruh unit Volta (401, Eagle, Mandala), motor <strong>100% resmi jadi hak milik Anda</strong> lengkap dengan BPKB & STNK resmi tanpa uang muka berat.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {RENT_TO_OWN_INFO.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-emerald-50">
                    <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <a
                  href={rentToOwnWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#111827] font-extrabold text-sm transition-all shadow-md inline-flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Konsultasi Sewa Hak Milik via WhatsApp</span>
                </a>
                <Link
                  href="/fleet"
                  className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition-colors"
                >
                  Lihat Pilihan 3 Unit Volta
                </Link>
              </div>
            </div>

            {/* Right Card: Pricing Table for 720 Days */}
            <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/15">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                  Skema Cicilan Harian
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-400 text-emerald-950">
                  Flat 720 Hari
                </span>
              </div>

              <div className="space-y-3">
                {RENT_TO_OWN_INFO.pricingTable.map((item) => (
                  <div
                    key={item.slug}
                    className="p-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 flex items-center justify-between transition-colors"
                  >
                    <div>
                      <h4 className="text-sm font-extrabold text-white">{item.motor}</h4>
                      <p className="text-[11px] text-emerald-200">{item.bestFor}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-extrabold text-amber-300 block">
                        {formatRupiah(item.dailyRate)}
                      </span>
                      <span className="text-[10px] text-emerald-100">/ hari</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-[11px] text-emerald-100 leading-relaxed border-t border-white/15">
                * Unit langsung dapat dipakai untuk aktivitas harian sejak hari pertama. Setelah genap 720 hari, kepemilikan BPKB & STNK diproses resmi.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. KATALOG 3 UNIT MOTOR */}
      <section id="katalog-motor" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#059669]">
              Katalog Unit Resmi
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827]">
              Pilihan Unit Motor Listrik Volta Siap Jalan
            </h2>
            <p className="text-sm text-[#6B7280]">
              Tarif harian transparan, durasi minimum sewa 3 hari, dan bisa dilanjutkan ke program hak milik 720 hari.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isLoadingStock && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6B7280]">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#059669]" />
                Memperbarui status unit...
              </span>
            )}
            <Link
              href="/fleet"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-[#059669] bg-emerald-50 hover:bg-emerald-100 transition-colors"
            >
              <span>Bandingkan Spesifikasi Lengkap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 3 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <FleetCard
              key={product.id}
              product={product}
              startDate={startDate}
              endDate={endDate}
              rentalDays={rentalDays >= 3 ? rentalDays : 3}
            />
          ))}
        </div>
      </section>

      {/* 4. TRUST SECTION: DUKUNGAN 29 TITIK SGB (TANPA DAFTAR LOKASI) */}
      <section id="titik-sgb" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-10 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#059669] text-xs font-bold">
                <BatteryCharging className="w-4 h-4 text-[#059669]" />
                <span>Ekosistem Baterai Motor Listrik Bali</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827]">
                Didukung {TOTAL_SGB_COUNT} Titik Stasiun Ganti Baterai (SGB) di Bali
              </h2>
              <p className="text-sm sm:text-base text-[#6B7280] leading-relaxed">
                Seluruh unit Volta yang disewa di <strong>{PAYMENT_CONFIG.companyName}</strong> didukung jaringan{" "}
                <strong>{TOTAL_SGB_COUNT} titik Stasiun Ganti Baterai (SGB)</strong> aktif di Bali. Tukar baterai kosong dengan baterai penuh dalam waktu <strong>&lt; 1 menit</strong> tanpa perlu menunggu charging lama atau mengantre bensin.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
              <div className="flex items-center gap-4 bg-emerald-50 px-6 py-5 rounded-2xl border border-emerald-100">
                <div className="w-14 h-14 rounded-xl bg-[#059669] text-white flex items-center justify-center text-2xl font-black shadow-xs">
                  {TOTAL_SGB_COUNT}
                </div>
                <div>
                  <span className="text-sm font-extrabold text-[#111827] block">Titik Stasiun SGB</span>
                  <span className="text-xs text-[#059669] font-semibold">Aktif & Siap Tukar Baterai</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="px-6 py-4 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-sm font-extrabold transition-colors text-center shadow-xs inline-flex items-center justify-center gap-2"
              >
                <span>Pesan Unit Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
