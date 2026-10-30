"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Lock,
  Unlock,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import {
  ProductWithAvailability,
  formatRupiah,
} from "@/lib/fleet-data";

export default function AdminClient() {
  const [pin, setPin] = useState("");
  const [pinInput, setPinInput] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const [products, setProducts] = useState<ProductWithAvailability[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [actionMessage, setActionMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [editingProducts, setEditingProducts] = useState<
    Record<number, { total_stock: number; price_per_day: number }>
  >({});
  const [isSavingProduct, setIsSavingProduct] = useState<number | null>(null);

  const loadProductsData = useCallback(async (adminPin: string) => {
    setIsLoadingData(true);
    try {
      const productsRes = await fetch("/api/admin/products", {
        headers: { "x-admin-pin": adminPin },
      });
      const productsData = await productsRes.json();

      if (productsRes.ok && productsData.data) {
        setProducts(productsData.data);
        const initialEdits: Record<
          number,
          { total_stock: number; price_per_day: number }
        > = {};
        productsData.data.forEach((p: ProductWithAvailability) => {
          initialEdits[p.id] = {
            total_stock: p.total_stock,
            price_per_day: p.price_per_day,
          };
        });
        setEditingProducts(initialEdits);
      }
    } catch {
      setActionMessage({
        type: "error",
        text: "Gagal memuat data unit dari server.",
      });
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  const verifyPinOnServer = useCallback(
    async (testPin: string) => {
      setIsVerifying(true);
      setLoginError("");
      try {
        const res = await fetch("/api/admin/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pin: testPin }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setPin(testPin);
          setIsAuthenticated(true);
          sessionStorage.setItem("semolis_admin_pin", testPin);
          loadProductsData(testPin);
        } else {
          setIsAuthenticated(false);
          setLoginError(data.message || "PIN Admin salah. Silakan coba lagi.");
        }
      } catch {
        setLoginError("Gagal menghubungi server. Periksa koneksi lokal Anda.");
      } finally {
        setIsVerifying(false);
      }
    },
    [loadProductsData]
  );

  useEffect(() => {
    const savedPin = sessionStorage.getItem("semolis_admin_pin");
    if (savedPin) {
      setPin(savedPin);
      verifyPinOnServer(savedPin);
    }
  }, [verifyPinOnServer]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) {
      setLoginError("Masukkan PIN Admin terlebih dahulu.");
      return;
    }
    verifyPinOnServer(pinInput.trim());
  };

  const handleLogout = () => {
    sessionStorage.removeItem("semolis_admin_pin");
    setPin("");
    setPinInput("");
    setIsAuthenticated(false);
    setProducts([]);
  };

  const handleSaveProduct = async (productId: number) => {
    const edit = editingProducts[productId];
    if (!edit) return;

    setIsSavingProduct(productId);
    setActionMessage(null);
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-pin": pin,
        },
        body: JSON.stringify({
          id: productId,
          total_stock: edit.total_stock,
          price_per_day: edit.price_per_day,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionMessage({
          type: "success",
          text: data.message,
        });
        await loadProductsData(pin);
      } else {
        setActionMessage({
          type: "error",
          text: data.message || "Gagal memperbarui data unit.",
        });
      }
    } catch {
      setActionMessage({
        type: "error",
        text: "Terjadi kesalahan saat menyimpan perubahan unit.",
      });
    } finally {
      setIsSavingProduct(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
          <div className="text-center mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#059669] hover:underline mb-4"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Beranda Semolis
            </Link>
            <div className="w-12 h-12 bg-emerald-100 text-[#059669] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#111827]">
              Panel Admin Semolis
            </h1>
            <p className="text-xs text-[#6B7280] mt-1">
              PT Aviana Sinar Anugerah — Manajemen Stok & Tarif Unit
            </p>
          </div>

          <div className="bg-white py-8 px-6 shadow-xl border border-gray-200 rounded-2xl sm:px-8 space-y-5">
            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1.5">
                  Masukkan PIN / Password Admin
                </label>
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="PIN Admin (default: semolis2026)"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-transparent transition-all"
                  autoFocus
                />
                <p className="text-[11px] text-[#6B7280] mt-1.5">
                  Default PIN:{" "}
                  <code className="bg-gray-100 px-1.5 py-0.5 rounded text-emerald-700 font-mono">
                    semolis2026
                  </code>
                </p>
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-3 px-4 bg-[#059669] hover:bg-[#047857] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Memverifikasi...
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4" /> Masuk ke Panel Admin
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 border-t border-gray-100 text-center">
              <span className="text-[11px] text-[#6B7280]">
                Akses terbatas hanya untuk tim operasional Semolis Bali
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs text-[#6B7280] hover:text-[#059669] flex items-center gap-1 font-semibold pr-3 border-r border-gray-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Web Publik
            </Link>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#059669] animate-pulse"></span>
              <span className="font-extrabold text-sm sm:text-base text-[#111827]">
                Manajemen Stok Unit Semolis
              </span>
              <span className="hidden sm:inline-block text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                PT Aviana Sinar Anugerah
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => loadProductsData(pin)}
              disabled={isLoadingData}
              className="p-2 text-[#6B7280] hover:text-[#059669] hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
              title="Muat Ulang Data"
            >
              <RefreshCw
                className={`w-4 h-4 ${
                  isLoadingData ? "animate-spin text-[#059669]" : ""
                }`}
              />
            </button>
            <button
              onClick={handleLogout}
              className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              Keluar
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {actionMessage && (
          <div
            className={`p-4 rounded-xl border flex items-center justify-between text-xs font-semibold ${
              actionMessage.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            <div className="flex items-center gap-2">
              {actionMessage.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              )}
              <span>{actionMessage.text}</span>
            </div>
            <button
              onClick={() => setActionMessage(null)}
              className="text-gray-400 hover:text-gray-600 ml-3"
            >
              ✕
            </button>
          </div>
        )}

        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Pengaturan Stok & Tarif Unit Langsung:</p>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              Kurangi (<code>-</code>) stok saat unit disewa keluar garasi, atau tambah (<code>+</code>) stok kembali saat unit dikembalikan penyewa atau jika ada pembatalan sewa. Klik <strong>Simpan Perubahan Unit</strong> untuk memperbarui ketersediaan di katalog publik.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((p) => {
            const edit = editingProducts[p.id] || {
              total_stock: p.total_stock,
              price_per_day: p.price_per_day,
            };
            const isSaving = isSavingProduct === p.id;

            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#059669] tracking-wider">
                        Unit Motor Listrik
                      </span>
                      <h3 className="text-base font-extrabold text-[#111827]">
                        {p.name}
                      </h3>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-700">
                      ID: #{p.id}
                    </span>
                  </div>

                  <div className="my-3 p-3.5 bg-gray-50 rounded-xl text-center">
                    <span className="text-[11px] text-[#6B7280] font-bold block">
                      Stok Tersedia di Web Saat Ini
                    </span>
                    <span className="text-2xl font-extrabold text-[#059669]">
                      {p.total_stock} Unit
                    </span>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-[#111827] mb-1">
                        Ubah Jumlah Stok Tersedia (Unit):
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const current = edit.total_stock;
                            if (current > 0) {
                              setEditingProducts((prev) => ({
                                ...prev,
                                [p.id]: {
                                  ...edit,
                                  total_stock: current - 1,
                                },
                              }));
                            }
                          }}
                          className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 text-[#111827] font-bold flex items-center justify-center cursor-pointer"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min={0}
                          value={edit.total_stock}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            setEditingProducts((prev) => ({
                              ...prev,
                              [p.id]: { ...edit, total_stock: val },
                            }));
                          }}
                          className="w-full text-center py-1.5 px-3 border border-gray-300 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#059669]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const current = edit.total_stock;
                            setEditingProducts((prev) => ({
                              ...prev,
                              [p.id]: {
                                ...edit,
                                total_stock: current + 1,
                              },
                            }));
                          }}
                          className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 text-[#111827] font-bold flex items-center justify-center cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#111827] mb-1">
                        Tarif Harian (Rp):
                      </label>
                      <input
                        type="number"
                        step={1000}
                        value={edit.price_per_day}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          setEditingProducts((prev) => ({
                            ...prev,
                            [p.id]: { ...edit, price_per_day: val },
                          }));
                        }}
                        className="w-full py-1.5 px-3 border border-gray-300 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#059669]"
                      />
                      <span className="text-[10px] text-[#6B7280]">
                        Saat ini: {formatRupiah(p.price_per_day)}/hari
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleSaveProduct(p.id)}
                  disabled={isSaving}
                  className="w-full mt-4 py-2.5 px-3 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />{" "}
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> Simpan Perubahan
                      Unit
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
