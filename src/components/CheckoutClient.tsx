"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  CreditCard,
  User,
  Phone,
  MapPin,
  Calendar,
  ArrowLeft,
  Lock,
  Info,
  Clock,
  Copy,
  Check,
  MessageCircle,
  Upload,
  FileCheck2,
  Trash2,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import {
  PAYMENT_CONFIG,
  PAYMENT_METHODS,
  ProductWithAvailability,
  calculateRentalDays,
  formatDisplayDate,
  formatRupiah,
} from "@/lib/fleet-data";

interface CheckoutClientProps {
  initialProducts: ProductWithAvailability[];
  initialMotorSlug: string;
  initialStartDate: string;
  initialEndDate: string;
}

export default function CheckoutClient({
  initialProducts,
  initialMotorSlug,
  initialStartDate,
  initialEndDate,
}: CheckoutClientProps) {
  const [products] = useState<ProductWithAvailability[]>(initialProducts);
  const [selectedSlug, setSelectedSlug] = useState<string>(initialMotorSlug);
  const [startDate, setStartDate] = useState<string>(initialStartDate);
  const [endDate, setEndDate] = useState<string>(initialEndDate);

  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>("BCA");
  const [agreedTerms, setAgreedTerms] = useState<boolean>(true);

  // State Validasi Pembayaran Fleksibel (Bisa dari Bank manapun / E-Wallet)
  const [senderChannel, setSenderChannel] = useState<string>("Transfer Bank (BCA / Mandiri / BRI / BNI / Lainnya)");
  const [senderAccountName, setSenderAccountName] = useState<string>("");
  const [hasTransferredConfirm, setHasTransferredConfirm] = useState<boolean>(false);
  const [transferProofFile, setTransferProofFile] = useState<File | null>(null);
  const [transferProofPreview, setTransferProofPreview] = useState<string | null>(null);
  const [isValidatingPayment, setIsValidatingPayment] = useState<boolean>(false);
  const [isPaymentValidated, setIsPaymentValidated] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [copiedAccount, setCopiedAccount] = useState<boolean>(false);
  const [copiedAmount, setCopiedAmount] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [waSentSuccess, setWaSentSuccess] = useState<boolean>(false);

  const totalDays = calculateRentalDays(startDate, endDate);
  const isDurationInvalid = totalDays < 3;

  const selectedProduct =
    products.find((p) => p.slug === selectedSlug) ?? products[0];

  const isStockOut = selectedProduct ? !selectedProduct.is_available : false;
  const totalAmount =
    !isDurationInvalid && selectedProduct
      ? totalDays * selectedProduct.price_per_day
      : 0;

  const handleCopyAccount = async () => {
    try {
      await navigator.clipboard.writeText(PAYMENT_CONFIG.accountNumber);
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 2000);
    } catch {
      // Ignore clipboard error
    }
  };

  const handleCopyAmount = async () => {
    if (totalAmount <= 0) return;
    try {
      await navigator.clipboard.writeText(String(totalAmount));
      setCopiedAmount(true);
      setTimeout(() => setCopiedAmount(false), 2000);
    } catch {
      // Ignore clipboard error
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubmitError(null);
    const file = e.target.files?.[0];
    if (!file) {
      setTransferProofFile(null);
      setTransferProofPreview(null);
      return;
    }

    setTransferProofFile(file);
    setHasTransferredConfirm(true);
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTransferProofPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setTransferProofPreview(null);
    }
  };

  const handleRemoveFile = () => {
    setTransferProofFile(null);
    setTransferProofPreview(null);
    setIsPaymentValidated(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleValidateTransfer = () => {
    setSubmitError(null);

    if (!transferProofFile) {
      setSubmitError("Harap unggah foto bukti pembayaran terlebih dahulu.");
      return;
    }
    if (isDurationInvalid) {
      setSubmitError("Durasi minimum penyewaan adalah 3 hari.");
      return;
    }
    if (isStockOut) {
      setSubmitError("Stok unit sedang penuh.");
      return;
    }

    setHasTransferredConfirm(true);
    setIsValidatingPayment(true);
    setTimeout(() => {
      setIsValidatingPayment(false);
      setIsPaymentValidated(true);
    }, 300);
  };

  const canConfirmWhatsApp =
    !isDurationInvalid &&
    !isStockOut &&
    transferProofFile !== null &&
    isPaymentValidated;

  const buildWhatsAppUrl = () => {
    const unitName = selectedProduct?.name ?? "Volta";
    const dailyRate = selectedProduct
      ? formatRupiah(selectedProduct.price_per_day)
      : "-";

    const lines = [
      `Halo Admin *${PAYMENT_CONFIG.brandName}* (${PAYMENT_CONFIG.companyName}),`,
      `Saya sudah melakukan pembayaran untuk penyewaan unit motor listrik dengan rincian berikut:`,
      ``,
      `*DATA PENYEWA*`,
      `• Nama Lengkap: ${customerName.trim() || "-"}`,
      `• No. WhatsApp: ${customerPhone.trim() || "-"}`,
      ``,
      `*RINCIAN SEWA UNIT*`,
      `• Tipe Unit: *${unitName}* (${dailyRate}/hari)`,
      `• Tanggal Mulai: ${formatDisplayDate(startDate)}`,
      `• Tanggal Selesai: ${formatDisplayDate(endDate)}`,
      `• Total Durasi: *${totalDays} Hari*`,
      `• Lokasi Ambil & Kembali: Mandiri di Garasi (${PAYMENT_CONFIG.officeAddress})`,
      notes.trim() ? `• Catatan Tambahan: ${notes.trim()}` : null,
      ``,
      `*DETAIL PEMBAYARAN (TERVALIDASI)*`,
      `• Rekening Tujuan: BCA ${PAYMENT_CONFIG.accountNumber} a.n. ${PAYMENT_CONFIG.accountHolder}`,
      `• Metode / Saluran Pengirim: ${senderChannel}`,
      `• Nama Akun / Rekening Pengirim: *${senderAccountName.trim() || "-"}*`,
      transferProofFile ? `• Lampiran Bukti: ${transferProofFile.name}` : null,
      `• Total Nominal Transfer: *${formatRupiah(totalAmount)}*`,
      ``,
      `Berikut saya konfirmasikan pembayaran saya. Mohon dibantu konfirmasi jadwal pengambilan unit di garasi. Terima kasih!`,
    ].filter(Boolean);

    return `https://wa.me/${PAYMENT_CONFIG.adminWhatsApp}?text=${encodeURIComponent(
      lines.join("\n")
    )}`;
  };

  const handleConfirmWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!canConfirmWhatsApp) {
      setSubmitError(
        "Tombol WhatsApp masih terkunci. Harap klik tombol 'Validasi Pembayaran Sekarang' terlebih dahulu."
      );
      return;
    }

    const waUrl = buildWhatsAppUrl();
    setWaSentSuccess(true);
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Top Breadcrumb & Header */}
      <div className="space-y-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B7280] hover:text-[#059669] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Katalog Beranda</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827]">
              Kalkulator Sewa & Validasi Pembayaran
            </h1>
            <p className="text-sm text-[#6B7280]">
              {PAYMENT_CONFIG.companyName} • Hitung biaya sewa otomatis, transfer dari Bank atau E-Wallet mana saja ke rekening BCA resmi, lalu validasi untuk membuka WhatsApp Admin.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-[#047857]">
            <MapPin className="w-4 h-4 text-[#059669]" />
            <span>Pengambilan Mandiri di Sidakarya</span>
          </div>
        </div>
      </div>

      {/* Ketentuan Penting Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-extrabold text-sm text-amber-950">
            Perhatian Sebelum Melakukan Pembayaran:
          </p>
          <p>
            1. <strong>Tidak ada layanan antar jemput:</strong> Pengambilan dan pengembalian unit dilakukan mandiri langsung di alamat garasi:{" "}
            <strong>{PAYMENT_CONFIG.officeAddress}</strong>.
          </p>
          <p>
            2. <strong>Tidak free helm, jas hujan, & holder HP:</strong> Tarif sewa hanya mencakup unit motor listrik dan akses baterai SGB. Harap mempersiapkan helm standar SNI serta perlengkapan berkendara pribadi Anda.
          </p>
        </div>
      </div>

      {/* Desktop 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Ringkasan & Pemilihan Unit/Tanggal */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#059669]">
                  Langkah 1 • Pilih Unit & Durasi
                </span>
                <h2 className="text-lg font-extrabold text-[#111827] mt-0.5">
                  Kalkulator Biaya Sewa
                </h2>
              </div>
              <Calendar className="w-5 h-5 text-[#059669]" />
            </div>

            {/* Pilih Unit Motor (3 Radio Cards) */}
            <fieldset className="space-y-2.5">
              <legend className="text-xs font-bold text-[#111827] mb-2">
                Pilih Unit Motor Listrik
              </legend>
              {products.map((product) => {
                const isSelected = product.slug === selectedSlug;
                return (
                  <label
                    key={product.id}
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "border-[#059669] bg-emerald-50/50 ring-2 ring-[#059669]/20"
                        : "border-gray-200 bg-[#F9FAFB] hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="motor_unit"
                        value={product.slug}
                        checked={isSelected}
                        onChange={() => {
                          setSelectedSlug(product.slug);
                          setIsPaymentValidated(false);
                        }}
                        className="w-4 h-4 accent-[#059669]"
                      />
                      <div>
                        <span className="text-sm font-bold text-[#111827] block">
                          {product.name}
                        </span>
                        <span className="text-xs text-[#6B7280]">
                          {product.is_available ? (
                            <span className="text-[#059669] font-medium">
                              Stok Tersedia: {product.available_stock} unit
                            </span>
                          ) : (
                            <span className="text-[#EF4444] font-semibold">
                              Stok unit sedang penuh
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-[#111827] block">
                        {formatRupiah(product.price_per_day)}
                      </span>
                      <span className="text-[11px] text-[#6B7280]">/ hari</span>
                    </div>
                  </label>
                );
              })}
            </fieldset>

            {/* Selected Unit Preview */}
            {selectedProduct && (
              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-center gap-4">
                <img
                  src={selectedProduct.image_url}
                  alt={selectedProduct.name}
                  className="w-24 h-16 object-contain rounded-lg bg-white p-1 border border-gray-200 shrink-0"
                />
                <div className="text-xs space-y-1">
                  <span className="font-bold text-[#111827] block text-sm">
                    {selectedProduct.name}
                  </span>
                  <span className="text-[#6B7280] block">
                    {selectedProduct.specs.maxRangeKm} • Maks{" "}
                    {selectedProduct.specs.maxSpeedKmh}
                  </span>
                  <span className="text-[#059669] font-semibold block">
                    Unit Siap Jalan + Akses 29 Titik SGB Bali
                  </span>
                  <span className="text-amber-800 font-medium block">
                    * Tidak free helm, jas hujan, & holder HP
                  </span>
                </div>
              </div>
            )}

            {/* Tanggal Mulai & Selesai */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label
                  htmlFor="checkout-start-date"
                  className="block text-xs font-bold text-[#111827]"
                >
                  Tanggal Mulai Sewa
                </label>
                <input
                  id="checkout-start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setIsPaymentValidated(false);
                  }}
                  className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-gray-300 rounded-xl text-sm font-medium text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#059669]"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="checkout-end-date"
                  className="block text-xs font-bold text-[#111827]"
                >
                  Tanggal Selesai Sewa
                </label>
                <input
                  id="checkout-end-date"
                  type="date"
                  value={endDate}
                  min={startDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setIsPaymentValidated(false);
                  }}
                  className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-gray-300 rounded-xl text-sm font-medium text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#059669]"
                />
              </div>
            </div>

            {/* Validasi Min. 3 Hari */}
            {isDurationInvalid && (
              <div
                role="alert"
                className="p-4 rounded-xl bg-red-50 border border-[#EF4444] flex items-start gap-3 text-[#EF4444]"
              >
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <p className="font-extrabold text-sm">
                    Durasi minimum penyewaan adalah 3 hari
                  </p>
                  <p className="mt-0.5 text-red-600">
                    Rentang tanggal yang Anda pilih saat ini adalah{" "}
                    <strong>{totalDays > 0 ? totalDays : 0} hari</strong>.
                    Tombol validasi & konfirmasi dikunci hingga durasi minimal 3 hari.
                  </p>
                </div>
              </div>
            )}

            {/* Validasi Stok Habis */}
            {!isDurationInvalid && isStockOut && (
              <div
                role="alert"
                className="p-4 rounded-xl bg-red-50 border border-[#EF4444] flex items-start gap-3 text-[#EF4444]"
              >
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <p className="font-extrabold text-sm">
                    Stok unit {selectedProduct?.name} sedang penuh
                  </p>
                  <p className="mt-0.5 text-red-600">
                    Silakan pilih tipe unit lain yang masih tersedia.
                  </p>
                </div>
              </div>
            )}

            {/* Rincian Perhitungan Harga Otomatis */}
            <div className="p-4 rounded-xl bg-[#F9FAFB] border border-gray-200 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-[#6B7280]">
                <span>Harga Sewa Harian</span>
                <span className="font-semibold text-[#111827]">
                  {selectedProduct
                    ? `${formatRupiah(selectedProduct.price_per_day)} / hari`
                    : "-"}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-[#6B7280]">
                <span>Total Durasi Sewa</span>
                <span
                  className={`font-bold ${
                    isDurationInvalid ? "text-[#EF4444]" : "text-[#111827]"
                  }`}
                >
                  {totalDays > 0 ? `${totalDays} Hari` : "0 Hari"} (Min. 3 Hari)
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-[#6B7280]">
                <span>Status Ketersediaan Unit</span>
                {selectedProduct?.is_available ? (
                  <span className="font-bold text-[#059669] inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Tersedia ({selectedProduct.available_stock} unit)
                  </span>
                ) : (
                  <span className="font-bold text-[#EF4444]">Stok Penuh</span>
                )}
              </div>

              <div className="pt-3 border-t border-gray-200 flex items-baseline justify-between">
                <div>
                  <span className="text-sm font-extrabold text-[#111827] block">
                    Total yang Harus Ditransfer
                  </span>
                  <span className="text-[11px] text-[#6B7280]">
                    {!isDurationInvalid && selectedProduct
                      ? `${totalDays} hari × ${formatRupiah(
                          selectedProduct.price_per_day
                        )}`
                      : "Menunggu durasi valid (≥ 3 hari)"}
                  </span>
                </div>
                <span className="text-2xl font-extrabold text-[#059669]">
                  {isDurationInvalid ? "—" : formatRupiah(totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Data Penyewa, Transfer & Validasi Fleksibel */}
        <div className="lg:col-span-7 space-y-6">
          <form
            onSubmit={handleConfirmWhatsApp}
            className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6"
            noValidate
          >
            <div className="border-b border-gray-100 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#059669]">
                Langkah 2 • Pembayaran & Validasi Konfirmasi
              </span>
              <h2 className="text-xl font-extrabold text-[#111827] mt-0.5">
                Lengkapi Data & Validasi Pembayaran
              </h2>
              <p className="text-xs text-[#6B7280] mt-1">
                Anda dapat melakukan transfer ke rekening BCA resmi kami melalui Bank apa saja maupun E-Wallet (DANA, OVO, GoPay, ShopeePay, dll).
              </p>
            </div>

            {submitError && (
              <div
                role="alert"
                className="p-4 rounded-xl bg-red-50 border border-[#EF4444] flex items-start gap-2.5 text-xs font-bold text-[#EF4444]"
              >
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{submitError}</span>
              </div>
            )}

            {waSentSuccess && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-900">
                <CheckCircle2 className="w-5 h-5 text-[#059669] shrink-0 mt-0.5" />
                <div>
                  <p className="font-extrabold text-sm text-[#047857]">
                    Halaman WhatsApp Admin Telah Dibuka!
                  </p>
                  <p className="mt-0.5">
                    Silakan kirimkan pesan konfirmasi yang sudah terformat otomatis kepada Admin.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-5">
              {/* 1. Nama Lengkap */}
              <div className="space-y-1.5">
                <label
                  htmlFor="customer-name"
                  className="block text-sm font-bold text-[#111827]"
                >
                  Nama Lengkap Sesuai KTP / Paspor{" "}
                  <span className="text-[#EF4444]">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="customer-name"
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Contoh: Budi Santoso / Sarah Jenkins"
                    className="w-full pl-10 pr-4 py-3 bg-[#F9FAFB] border border-gray-300 rounded-xl text-sm text-[#111827] placeholder:text-[#6B7280] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#059669]"
                  />
                </div>
              </div>

              {/* 2. Nomor WhatsApp Aktif */}
              <div className="space-y-1.5">
                <label
                  htmlFor="customer-phone"
                  className="block text-sm font-bold text-[#111827]"
                >
                  Nomor WhatsApp Aktif <span className="text-[#EF4444]">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="customer-phone"
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Contoh: 081234567890 atau +6281234567890"
                    className="w-full pl-10 pr-4 py-3 bg-[#F9FAFB] border border-gray-300 rounded-xl text-sm text-[#111827] placeholder:text-[#6B7280] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#059669]"
                  />
                </div>
              </div>

              {/* 3. Lokasi Pengambilan (Mandiri di Garasi) */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-[#111827]">
                  Titik Pengambilan & Pengembalian Unit{" "}
                  <span className="text-[#059669]">(Mandiri di Garasi)</span>
                </label>
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#059669] shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <p className="font-extrabold text-[#111827]">
                      {PAYMENT_CONFIG.companyName}
                    </p>
                    <p className="text-[#111827] font-medium">
                      {PAYMENT_CONFIG.officeAddress}
                    </p>
                    <p className="text-amber-800 font-semibold pt-0.5">
                      * Kami tidak melayani antar jemput unit. Unit diambil dan dikembalikan langsung ke alamat garasi di atas.
                    </p>
                  </div>
                </div>

                <div className="pt-1 space-y-1">
                  <label
                    htmlFor="checkout-notes"
                    className="block text-xs font-semibold text-[#6B7280]"
                  >
                    Catatan Tambahan / Jam Estimasi Kedatangan (Opsional)
                  </label>
                  <input
                    id="checkout-notes"
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Contoh: Rencana ambil unit sekitar pukul 10:00 WITA"
                    className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-gray-300 rounded-xl text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#059669]"
                  />
                </div>
              </div>

              {/* 4. PILIHAN METODE PEMBAYARAN & REKENING TUJUAN */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-bold text-[#111827]">
                    Metode Pembayaran <span className="text-[#EF4444]">*</span>
                  </label>
                  <span className="text-[11px] font-semibold text-[#059669]">
                    Bisa via Bank Apa Saja / E-Wallet
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {PAYMENT_METHODS.map((method) => {
                    const isSelected = selectedPaymentId === method.id;
                    return (
                      <div
                        key={method.id}
                        onClick={() => {
                          if (method.isAvailable) {
                            setSelectedPaymentId(method.id);
                          }
                        }}
                        className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between gap-2 ${
                          method.isAvailable
                            ? isSelected
                              ? "border-[#059669] bg-emerald-50/60 ring-2 ring-[#059669]/20 cursor-pointer"
                              : "border-gray-200 bg-white hover:border-gray-300 cursor-pointer"
                            : "border-gray-200 bg-gray-50/80 opacity-85 cursor-not-allowed"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="payment_method"
                              checked={isSelected}
                              disabled={!method.isAvailable}
                              onChange={() => {
                                if (method.isAvailable) {
                                  setSelectedPaymentId(method.id);
                                }
                              }}
                              className="w-4 h-4 accent-[#059669]"
                            />
                            <span className="text-xs font-extrabold text-[#111827]">
                              {method.name}
                            </span>
                          </div>
                          {method.isAvailable ? (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#059669] text-white shrink-0">
                              Aktif
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 shrink-0">
                              <Clock className="w-2.5 h-2.5" />
                              Coming Soon
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#6B7280] leading-snug pl-6">
                          {method.description}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Box Rekening Tujuan Transfer */}
                <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-emerald-50 to-[#F9FAFB] border border-emerald-200 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#047857] uppercase tracking-wider flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-[#059669]" />
                      Langkah A: Rekening Tujuan Transfer
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-[#059669] border border-emerald-200">
                      {PAYMENT_CONFIG.bankName}
                    </span>
                  </div>

                  {/* Nomor Rekening + Copy */}
                  <div className="bg-white p-3.5 rounded-xl border border-emerald-200 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[11px] text-[#6B7280] block">
                        Nomor Rekening Tujuan (a.n.{" "}
                        <strong className="text-[#111827]">
                          {PAYMENT_CONFIG.accountHolder}
                        </strong>
                        )
                      </span>
                      <span className="text-lg sm:text-xl font-extrabold text-[#059669] tracking-wider font-mono">
                        {PAYMENT_CONFIG.accountNumber}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyAccount}
                      className="px-3 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#047857] text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                    >
                      {copiedAccount ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin Rek</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Total Nominal Transfer + Copy */}
                  <div className="bg-white p-3.5 rounded-xl border border-emerald-200 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[11px] text-[#6B7280] block">
                        Nominal Transfer ({totalDays > 0 ? totalDays : 0} Hari ×{" "}
                        {selectedProduct
                          ? formatRupiah(selectedProduct.price_per_day)
                          : "-"}
                        )
                      </span>
                      <span className="text-lg sm:text-xl font-extrabold text-[#111827]">
                        {isDurationInvalid ? "—" : formatRupiah(totalAmount)}
                      </span>
                    </div>
                    {!isDurationInvalid && (
                      <button
                        type="button"
                        onClick={handleCopyAmount}
                        className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-[#111827] text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                      >
                        {copiedAmount ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#059669]" />
                            <span>Tersalin</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Salin Nominal</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] text-[#047857]">
                    💡 Anda bisa transfer ke rekening BCA di atas menggunakan <strong>Bank apa saja</strong> (BCA, Mandiri, BRI, BNI, SeaBank, Jago, dll) atau fitur <strong>Kirim ke Bank dari E-Wallet</strong> (DANA, OVO, GoPay, ShopeePay, Flip, dll).
                  </p>
                </div>

                {/* 5. FORM VALIDASI PEMBAYARAN FLEKSIBEL */}
                <div
                  className={`p-4 sm:p-5 rounded-xl border space-y-4 transition-all ${
                    isPaymentValidated
                      ? "bg-emerald-50/70 border-[#059669] ring-2 ring-[#059669]/20"
                      : "bg-[#F9FAFB] border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-extrabold text-[#111827] uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#059669]" />
                      Langkah B: Validasi Pembayaran
                    </span>
                    {isPaymentValidated ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#059669] text-white">
                        <CheckCircle2 className="w-3 h-3" />
                        Tervalidasi
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                        <Lock className="w-3 h-3" />
                        Belum Divalidasi
                      </span>
                    )}
                  </div>

                  {/* Pilihan Saluran Pengirim (Bank / E-Wallet / Lainnya) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="sender-channel"
                        className="block text-xs font-bold text-[#111827]"
                      >
                        Transfer Melalui Apa? <span className="text-[#EF4444]">*</span>
                      </label>
                      <select
                        id="sender-channel"
                        value={senderChannel}
                        onChange={(e) => setSenderChannel(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs sm:text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#059669]"
                      >
                        <option value="Transfer Bank (BCA / Mandiri / BRI / BNI / Lainnya)">
                          Transfer Bank (BCA / Mandiri / BRI / BNI / Lainnya)
                        </option>
                        <option value="E-Wallet (DANA / OVO / GoPay / ShopeePay)">
                          E-Wallet (DANA / OVO / GoPay / ShopeePay)
                        </option>
                        <option value="Aplikasi Transfer (Flip / Wise / SeaBank / Jago)">
                          Aplikasi Transfer (Flip / Wise / SeaBank / Jago)
                        </option>
                        <option value="Lainnya">Metode Lainnya</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="sender-account-name"
                        className="block text-xs font-bold text-[#111827]"
                      >
                        Nama Pengirim & Nama Bank/E-Wallet{" "}
                        <span className="text-[#EF4444]">*</span>
                      </label>
                      <input
                        id="sender-account-name"
                        type="text"
                        value={senderAccountName}
                        onChange={(e) => setSenderAccountName(e.target.value)}
                        placeholder="Contoh: Budi - DANA / Sarah - Mandiri"
                        className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs sm:text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#059669]"
                      />
                    </div>
                  </div>

                  {/* Upload Bukti Pembayaran (Wajib upload foto apapun untuk membuka tombol Validasi) */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="transfer-proof-upload"
                      className="block text-xs font-bold text-[#111827]"
                    >
                      Unggah Foto / Screenshot Bukti Pembayaran (Bank / E-Wallet / Lainnya){" "}
                      <span className="text-[#EF4444]">*</span>
                    </label>

                    <input
                      ref={fileInputRef}
                      id="transfer-proof-upload"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {!transferProofFile ? (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-4 px-4 border-2 border-dashed border-gray-300 hover:border-[#059669] rounded-xl bg-white hover:bg-emerald-50/30 transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer text-xs text-[#111827]"
                      >
                        <Upload className="w-5 h-5 text-[#059669]" />
                        <span className="font-bold">
                          Klik untuk Pilih Foto / Screenshot Bukti Transfer
                        </span>
                        <span className="text-[11px] text-[#6B7280]">
                          Bisa bukti dari BCA, Bank lain, maupun E-Wallet (DANA, OVO, GoPay, dll)
                        </span>
                      </button>
                    ) : (
                      <div className="p-3 rounded-xl bg-white border border-emerald-200 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          {transferProofPreview ? (
                            <img
                              src={transferProofPreview}
                              alt="Preview Bukti Transfer"
                              className="w-10 h-10 object-cover rounded-lg border border-gray-200 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#059669] flex items-center justify-center shrink-0">
                              <FileCheck2 className="w-5 h-5" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[#111827] truncate">
                              {transferProofFile.name}
                            </p>
                            <p className="text-[11px] text-[#6B7280]">
                              {(transferProofFile.size / 1024).toFixed(1)} KB • Foto siap divalidasi
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                          title="Hapus Lampiran"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Tombol Aksi Validasi (Terkunci sebelum ada foto, terbuka begitu foto diupload) */}
                  {!isPaymentValidated ? (
                    <button
                      type="button"
                      onClick={handleValidateTransfer}
                      disabled={!transferProofFile || isValidatingPayment}
                      className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
                        transferProofFile && !isValidatingPayment
                          ? "bg-amber-500 hover:bg-amber-600 text-white shadow-xs cursor-pointer"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {isValidatingPayment ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Memvalidasi Pembayaran...</span>
                        </>
                      ) : !transferProofFile ? (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>
                            Unggah Foto Bukti Pembayaran Dahulu untuk Membuka Validasi
                          </span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>Validasi Pembayaran Sekarang</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="p-3 rounded-xl bg-emerald-100/80 border border-emerald-300 flex items-center gap-2.5 text-xs font-bold text-[#047857]">
                      <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
                      <span>
                        Bukti pembayaran ({transferProofFile?.name}) telah tervalidasi! Tombol WhatsApp Admin di bawah kini sudah terbuka.
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Checkbox Ketentuan */}
              <label className="flex items-start gap-3 p-3 rounded-xl bg-[#F9FAFB] border border-gray-200 cursor-pointer text-xs text-[#111827]">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => {
                    setAgreedTerms(e.target.checked);
                    if (!e.target.checked) setIsPaymentValidated(false);
                  }}
                  className="w-4 h-4 mt-0.5 accent-[#059669] rounded"
                />
                <span className="leading-relaxed">
                  Saya telah membaca dan menyetujui bahwa{" "}
                  <strong>pengambilan unit dilakukan mandiri</strong> di alamat{" "}
                  {PAYMENT_CONFIG.officeAddress} (
                  <strong>tidak ada antar jemput</strong>), serta paket sewa{" "}
                  <strong>
                    tidak termasuk free helm, jas hujan, dan holder HP
                  </strong>
                  .
                </span>
              </label>
            </div>

            {/* Tombol Konfirmasi ke WhatsApp Admin (Terkunci sebelum tervalidasi) */}
            <div className="pt-2 space-y-3">
              <button
                type="submit"
                disabled={!canConfirmWhatsApp}
                className={`w-full py-4 px-6 rounded-xl text-base font-extrabold text-white transition-all flex items-center justify-center gap-2 shadow-sm ${
                  canConfirmWhatsApp
                    ? "bg-[#059669] hover:bg-[#047857] cursor-pointer"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                {!canConfirmWhatsApp ? (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>
                      {isDurationInvalid
                        ? "Tombol WA Terkunci (Minimal Sewa 3 Hari)"
                        : isStockOut
                        ? "Tombol WA Terkunci (Stok Unit Penuh)"
                        : "Tombol WA Terkunci — Klik Validasi Pembayaran Dahulu"}
                    </span>
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-5 h-5" />
                    <span>
                      Masuk ke WhatsApp Admin & Konfirmasi Pembayaran (
                      {formatRupiah(totalAmount)})
                    </span>
                  </>
                )}
              </button>

              <p className="text-center text-xs text-[#6B7280]">
                {canConfirmWhatsApp ? (
                  <>
                    ✅ Validasi berhasil! Klik tombol hijau di atas untuk membuka WhatsApp Resmi{" "}
                    <strong>{PAYMENT_CONFIG.adminWhatsAppDisplay}</strong>.
                  </>
                ) : (
                  <>
                    🔒 Tombol WhatsApp Admin terkunci otomatis sebelum pembayaran divalidasi.
                  </>
                )}
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
