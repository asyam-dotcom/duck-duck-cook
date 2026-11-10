"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  Phone,
  ArrowRight,
  Loader2,
  AlertCircle,
  ExternalLink,
  Plus,
} from "lucide-react";

interface OrderItem {
  id: string;
  order_code: string;
  user_id: string;
  customer_name: string;
  customer_phone: string;
  order_type: "dine_in" | "delivery" | "frozen_pack";
  items_summary: string;
  total_amount: number;
  reservation_date?: string;
  reservation_time?: string;
  pax_or_quantity: number;
  delivery_address?: string;
  notes?: string;
  status: "menunggu_konfirmasi" | "dikonfirmasi" | "dibatalkan";
  admin_notes?: string;
  created_at: string;
}

export default function MyOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => {
        if (res.status === 401) {
          router.push("/login?redirect=/pesanan");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        if (data.success && Array.isArray(data.data)) {
          setOrders(data.data);
        } else {
          setError(data.error || "Gagal memuat pesanan");
        }
      })
      .catch(() => setError("Terjadi kesalahan koneksi"))
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <div className="min-h-screen py-12 px-6 lg:px-12 bg-surface-cream text-on-surface">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs text-primary font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-surface-mint-subtle border border-border-soft/40 mb-2 inline-block">
              Riwayat Transaksi
            </span>
            <h1 className="font-epilogue text-2xl sm:text-3xl font-bold tracking-tight text-on-surface">
              Pesanan &amp; Reservasi Anda
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
              Pantau status verifikasi pembayaran tiket dan jadwal kunjungan kuliner Anda
            </p>
          </div>

          <Link
            href="/pesan"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-xs font-semibold shadow hover:bg-on-surface transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Pesanan Baru</span>
          </Link>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="py-20 flex justify-center items-center gap-2 text-primary text-sm">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Memuat data tiket pesanan Anda...</span>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && orders.length === 0 && (
          <div className="bg-white p-12 rounded-3xl shadow-sm border border-border-soft/40 text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-surface-mint-subtle flex items-center justify-center text-primary">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="font-epilogue text-lg font-bold text-on-surface">Belum Ada Pesanan Aktif</h2>
            <p className="text-xs text-on-surface-variant max-w-sm leading-relaxed">
              Anda belum memiliki tiket pemesanan atau reservasi meja di DUCK DUCK COOK.
            </p>
            <Link
              href="/pesan"
              className="mt-2 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white text-xs font-semibold shadow hover:bg-on-surface transition-all"
            >
              <span>Pesan Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Orders list */}
        {!loading && orders.length > 0 && (
          <div className="flex flex-col gap-6">
            {orders.map((order) => {
              const isWaiting = order.status === "menunggu_konfirmasi";
              const isConfirmed = order.status === "dikonfirmasi";
              const isCancelled = order.status === "dibatalkan";

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow border border-border-soft/40 flex flex-col gap-6"
                >
                  {/* Top card bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border-soft/20">
                    <div className="flex items-center gap-3">
                      <span className="font-epilogue text-base sm:text-lg font-bold text-on-surface font-mono">
                        #{order.order_code}
                      </span>
                      <span className="text-xs text-on-surface-variant">
                        {new Date(order.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div>
                      {isWaiting && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Menunggu Konfirmasi</span>
                        </span>
                      )}
                      {isConfirmed && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Pembayaran Dikonfirmasi</span>
                        </span>
                      )}
                      {isCancelled && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Dibatalkan</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-8 flex flex-col gap-2">
                      <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                        {order.order_type === "dine_in"
                          ? "Reservasi Meja Resto"
                          : order.order_type === "delivery"
                          ? "Paket Bento / Nasi Kotak"
                          : "Frozen Ready-to-Heat Pack"}
                      </span>
                      <h3 className="font-epilogue text-base font-bold text-on-surface leading-snug">
                        {order.items_summary}
                      </h3>

                      {order.order_type === "dine_in" && order.reservation_date && (
                        <div className="flex items-center gap-2 text-xs text-on-surface-variant mt-1">
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                          <span>
                            Jadwal: {order.reservation_date} • {order.reservation_time} WIB ({order.pax_or_quantity} Orang)
                          </span>
                        </div>
                      )}

                      {order.delivery_address && (
                        <p className="text-xs text-on-surface-variant line-clamp-1">
                          Alamat: {order.delivery_address}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-4 flex flex-col md:items-end justify-center">
                      <span className="text-[11px] text-on-surface-variant">Total Pembayaran:</span>
                      <span className="font-epilogue text-lg font-extrabold text-primary">
                        Rp {order.total_amount?.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>

                  {/* Status Notice Callouts */}
                  {isConfirmed && (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs leading-relaxed flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>
                        <b>Selamat, pembayaran Anda telah dikonfirmasi!</b> Silakan tunggu informasi selanjutnya dari admin melalui WhatsApp / email, atau langsung datang ke resto sesuai jadwal reservasi Anda.
                      </span>
                    </div>
                  )}

                  {isWaiting && (
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Menunggu verifikasi admin. Sudah membayar via QRIS?</span>
                      </div>
                      <Link
                        href={`/pembayaran/${order.id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white text-primary text-xs font-semibold border border-amber-300 hover:bg-surface-cream transition-colors w-fit"
                      >
                        <span>Lihat QRIS Pembayaran</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}

                  {isCancelled && (
                    <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs leading-relaxed flex items-start gap-2.5">
                      <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <span>
                        Pesanan ini telah dibatalkan. {order.admin_notes ? `Alasan: ${order.admin_notes}` : "Silakan hubungi admin bila ada kendala."}
                      </span>
                    </div>
                  )}

                  {/* Bottom Actions */}
                  <div className="pt-2 border-t border-border-soft/20 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <Link
                      href={`/pembayaran/${order.id}`}
                      className="text-primary font-bold hover:underline inline-flex items-center gap-1"
                    >
                      <span>Buka Halaman Tiket</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    <a
                      href={`https://wa.me/${siteConfig.contact.whatsapp}?text=Halo%20Admin%20DUCK%20DUCK%20COOK,%20saya%20ingin%20menanyakan%20status%20tiket%20pesanan%20${order.order_code}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface-cream hover:bg-surface-mint-subtle text-on-surface font-semibold border border-border-soft/40 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-primary" />
                      <span>Tanya Admin via WhatsApp</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

