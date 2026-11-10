"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { siteConfig } from "@/config/site";
import {
  QrCode,
  CheckCircle2,
  Clock,
  ArrowRight,
  Loader2,
  AlertCircle,
  Copy,
  Receipt,
  Phone,
  Calendar,
  Users,
  MapPin,
  HelpCircle,
} from "lucide-react";

export default function PaymentPage() {
  const params = useParams();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    fetch(`/api/orders/${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.order) {
          setOrder(data.order);
        } else {
          setError(data.error || "Gagal memuat detail pesanan");
        }
      })
      .catch(() => setError("Terjadi kesalahan koneksi"))
      .finally(() => setLoading(false));
  }, [orderId]);

  const copyOrderCode = () => {
    if (!order) return;
    navigator.clipboard.writeText(order.order_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen py-24 px-6 flex items-center justify-center bg-surface-cream text-primary text-sm gap-2">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span>Memuat rincian tiket pesanan &amp; QRIS...</span>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen py-24 px-6 flex items-center justify-center bg-surface-cream">
        <div className="bg-white p-8 rounded-3xl max-w-md w-full shadow-lg text-center flex flex-col items-center gap-4">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <h2 className="font-epilogue text-lg font-bold text-on-surface">Pesanan Tidak Ditemukan</h2>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            {error || "Tiket pesanan tidak ditemukan atau Anda tidak memiliki akses ke pesanan ini."}
          </p>
          <Link
            href="/pesan"
            className="px-6 py-2.5 rounded-full bg-primary text-white text-xs font-semibold shadow hover:bg-on-surface transition-all"
          >
            Kembali ke Halaman Pesan
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-6 lg:px-12 bg-surface-cream text-on-surface">
      <div className="max-w-4xl mx-auto">
        {/* Status Stepper Banner */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-border-soft/40 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-epilogue text-base sm:text-lg font-bold text-on-surface">
                  Tiket #{order.order_code}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">
                  Menunggu Konfirmasi
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Silakan lakukan pembayaran melalui QRIS di bawah ini untuk mengonfirmasi pesanan Anda.
              </p>
            </div>
          </div>

          <button
            onClick={copyOrderCode}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface-cream hover:bg-surface-mint-subtle text-primary text-xs font-semibold border border-border-soft/40 transition-colors shrink-0"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? "Kode Disalin!" : "Salin Kode Tiket"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: QRIS Graphic & Payment Instructions */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-border-soft/40 flex flex-col items-center">
            <h2 className="font-epilogue text-lg font-bold text-on-surface mb-2">Scan QRIS untuk Membayar</h2>
            <p className="text-xs text-on-surface-variant text-center mb-6">
              Mendukung semua aplikasi Bank (BCA, Mandiri, BRI, BNI) &amp; Dompet Digital (GoPay, OVO, Dana, ShopeePay).
            </p>

            {/* QRIS Graphic Container */}
            <div className="relative w-72 h-96 sm:w-80 sm:h-[420px] rounded-2xl overflow-hidden shadow-md border border-border-soft/60 mb-6 bg-white">
              <Image
                src="/images/qris.svg"
                alt="Kode Pembayaran QRIS DUCK DUCK COOK"
                fill
                priority
                className="object-contain p-2"
              />
            </div>

            {/* Total Amount Pill */}
            <div className="w-full p-4 rounded-2xl bg-surface-mint-tint/60 border border-border-soft/60 flex flex-col items-center gap-1 text-center mb-6">
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Total yang Harus Dibayar:
              </span>
              <span className="font-epilogue text-2xl font-extrabold text-primary">
                Rp {Number(order.total_amount || 0).toLocaleString("id-ID")}
              </span>
            </div>

            {/* Step-by-step instructions */}
            <div className="w-full flex flex-col gap-2.5 text-xs text-on-surface-variant">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-primary-container text-on-primary text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <span>Buka aplikasi m-Banking atau e-Wallet pilihan Anda di smartphone.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-primary-container text-on-primary text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <span>Pilih menu <b>Scan QR / QRIS</b> lalu arahkan kamera ke barcode di atas.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-primary-container text-on-primary text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <span>
                  Pastikan nama penerima tertulis <b>DUCK DUCK COOK</b>, masukkan nominal tepat sebesar{" "}
                  <b>Rp {order.total_amount?.toLocaleString("id-ID")}</b>, lalu selesaikan transaksi.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-primary-container text-on-primary text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  4
                </span>
                <span>
                  Admin kami akan memeriksa dan mengonfirmasi pembayaran Anda dalam waktu 5-15 menit.
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Order Details & Action */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-border-soft/40 flex flex-col gap-5">
              <div className="flex items-center gap-3 pb-3 border-b border-border-soft/30">
                <div className="w-9 h-9 rounded-xl bg-surface-mint-subtle flex items-center justify-center text-primary">
                  <Receipt className="w-5 h-5" />
                </div>
                <h3 className="font-epilogue text-base font-bold text-on-surface">Rincian Tiket Pesanan</h3>
              </div>

              <div className="flex flex-col gap-3 text-xs">
                <div className="flex justify-between py-1 border-b border-border-soft/20">
                  <span className="text-on-surface-variant">Nomor Tiket:</span>
                  <span className="font-bold text-on-surface font-mono">{order.order_code}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-border-soft/20">
                  <span className="text-on-surface-variant">Nama Pemesan:</span>
                  <span className="font-semibold text-on-surface">{order.customer_name}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-border-soft/20">
                  <span className="text-on-surface-variant">Nomor WhatsApp:</span>
                  <span className="font-semibold text-on-surface">{order.customer_phone}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-border-soft/20">
                  <span className="text-on-surface-variant">Jenis Pemesanan:</span>
                  <span className="font-semibold text-primary capitalize">
                    {order.order_type === "dine_in"
                      ? "Reservasi Meja Resto"
                      : order.order_type === "delivery"
                      ? "Bento / Nasi Kotak"
                      : "Frozen Pack Bebek"}
                  </span>
                </div>

                <div className="flex flex-col py-1 border-b border-border-soft/20 gap-1">
                  <span className="text-on-surface-variant">Paket / Menu:</span>
                  <span className="font-semibold text-on-surface">{order.items_summary}</span>
                </div>

                {order.order_type === "dine_in" && order.reservation_date && (
                  <div className="flex justify-between py-1 border-b border-border-soft/20">
                    <span className="text-on-surface-variant">Jadwal Kedatangan:</span>
                    <span className="font-semibold text-on-surface">
                      {order.reservation_date} • {order.reservation_time} WIB ({order.pax_or_quantity} Orang)
                    </span>
                  </div>
                )}

                {order.order_type !== "dine_in" && order.delivery_address && (
                  <div className="flex flex-col py-1 border-b border-border-soft/20 gap-1">
                    <span className="text-on-surface-variant">Alamat Pengantaran:</span>
                    <span className="font-semibold text-on-surface leading-relaxed">
                      {order.delivery_address}
                    </span>
                  </div>
                )}

                {order.notes && (
                  <div className="flex flex-col py-1 border-b border-border-soft/20 gap-1">
                    <span className="text-on-surface-variant">Catatan Tambahan:</span>
                    <span className="italic text-on-surface-variant">{order.notes}</span>
                  </div>
                )}
              </div>

              {/* Navigation CTA */}
              <div className="pt-2 flex flex-col gap-3">
                <Link
                  href="/pesanan"
                  className="w-full py-3.5 rounded-full bg-primary text-white font-semibold text-xs sm:text-sm text-center shadow hover:bg-on-surface transition-all flex items-center justify-center gap-2"
                >
                  <span>Lihat di &ldquo;Pesanan Anda&rdquo;</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={`https://wa.me/${siteConfig.contact.whatsapp}?text=Halo%20Admin%20DUCK%20DUCK%20COOK,%20saya%20sudah%20melakukan%20pembayaran%20QRIS%20untuk%20tiket%20pesanan%20${order.order_code}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs text-center shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Konfirmasi Cepat via WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Assistance card */}
            <div className="p-5 rounded-3xl bg-surface-cream border border-border-soft/40 flex items-start gap-3 text-xs text-on-surface-variant leading-relaxed">
              <HelpCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-on-surface">Butuh bantuan transaksi?</p>
                <p className="mt-0.5">
                  Layanan pelanggan kami siap membantu Anda setiap hari pukul 10.00 – 22.00 WIB melalui WhatsApp resmi di{" "}
                  <b>{siteConfig.contact.phone}</b>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

