"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";
import {
  UtensilsCrossed,
  Package,
  Snowflake,
  Calendar,
  Clock,
  Users,
  MapPin,
  Phone,
  User,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ShoppingBag,
} from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  type: "dine_in" | "delivery" | "frozen_pack";
}

const menuCatalog: MenuItem[] = [
  // Dine-in packages
  {
    id: "dine-1",
    name: "Paket Bebek Panggang Utuh Signature",
    price: 245000,
    description: "1 Ekor bebek panggang slow-roast 6 jam + 2 porsi nasi daun jeruk + sambal korek & lalapan.",
    type: "dine_in",
  },
  {
    id: "dine-2",
    name: "Paket Bebek Panggang 1/2 Ekor",
    price: 135000,
    description: "Setengah ekor bebek panggang empuk juicy + 1 nasi daun jeruk + sambal matah.",
    type: "dine_in",
  },
  {
    id: "dine-3",
    name: "Paket Kenduri Keluarga (4-6 Orang)",
    price: 450000,
    description: "2 Ekor bebek panggang + 5 nasi gurih + urap sayur rempah + es sereh wangi teko.",
    type: "dine_in",
  },
  // Bento packages
  {
    id: "bento-1",
    name: "Bento Bebek Panggang Nasi Jeruk",
    price: 48000,
    description: "Potongan paha/dada bebek panggang, nasi daun jeruk purut, serundeng, lalapan & sambal.",
    type: "delivery",
  },
  {
    id: "bento-2",
    name: "Bento Bebek Crispy Sambal Matah",
    price: 45000,
    description: "Bebek goreng kulit garing keemasan dengan siraman sambal matah Bali segar & telur pindang.",
    type: "delivery",
  },
  // Frozen packages
  {
    id: "frozen-1",
    name: "Frozen Bebek Ungkep Bumbu Utuh (1 Ekor)",
    price: 165000,
    description: "Vacuum sealed blast-freeze dengan bumbu marinasi lengkap, tinggal goreng/panggang 12 menit.",
    type: "frozen_pack",
  },
  {
    id: "frozen-2",
    name: "Frozen Bebek Panggang Artisanal Siap Saji",
    price: 180000,
    description: "Sudah dipanggang matang, cukup panaskan dalam oven/air fryer untuk kerenyahan maksimal.",
    type: "frozen_pack",
  },
  {
    id: "frozen-3",
    name: "Sambal Korek & Rempah Jar (200g)",
    price: 35000,
    description: "Racikan cabai rawit dan rempah minyak kelapa murni khas DUCK DUCK COOK.",
    type: "frozen_pack",
  },
];

export default function OrderPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Order Category Selection
  const [orderType, setOrderType] = useState<"dine_in" | "delivery" | "frozen_pack">("dine_in");
  const [selectedItem, setSelectedItem] = useState<string>("dine-1");
  const [quantity, setQuantity] = useState(1);

  // Form Fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [resDate, setResDate] = useState("");
  const [resTime, setResTime] = useState("12:00");
  const [pax, setPax] = useState(2);
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
          setName(data.user.name || "");
        }
      })
      .finally(() => setAuthChecked(true));

    // Default tanggal besok
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setResDate(tomorrow.toISOString().split("T")[0]);
  }, []);

  // Update selected item default saat order type berganti
  useEffect(() => {
    const available = menuCatalog.filter((item) => item.type === orderType);
    if (available.length > 0) {
      setSelectedItem(available[0].id);
    }
  }, [orderType]);

  const currentItem = menuCatalog.find((i) => i.id === selectedItem) || menuCatalog[0];
  const totalPrice = currentItem.price * quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!currentUser) {
      setError("Silakan masuk (login) terlebih dahulu untuk melanjutkan pemesanan.");
      return;
    }

    if (!name.trim() || !phone.trim()) {
      setError("Nama pemesan dan nomor WhatsApp wajib diisi.");
      return;
    }

    if (orderType !== "dine_in" && !address.trim()) {
      setError("Alamat lengkap pengantaran wajib diisi.");
      return;
    }

    setLoading(true);

    try {
      const items_summary = `${currentItem.name} (${quantity}x @ Rp ${currentItem.price.toLocaleString("id-ID")})`;

      const payload = {
        customer_name: name,
        customer_phone: phone,
        order_type: orderType,
        items_summary,
        total_amount: totalPrice,
        reservation_date: orderType === "dine_in" ? resDate : "",
        reservation_time: orderType === "dine_in" ? resTime : "",
        pax_or_quantity: orderType === "dine_in" ? pax : quantity,
        delivery_address: orderType !== "dine_in" ? address : "",
        notes,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Gagal memproses pesanan.");
        setLoading(false);
        return;
      }

      // Arahkan ke halaman pembayaran dengan kode tiket
      router.push(`/pembayaran/${data.order.id}`);
    } catch {
      setError("Terjadi kesalahan koneksi. Silakan coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-6 lg:px-12 bg-surface-cream text-on-surface">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <span className="text-xs text-primary font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-surface-mint-subtle border border-border-soft/40 mb-3">
            Pemesanan Online &amp; Reservasi
          </span>
          <h1 className="font-epilogue text-3xl sm:text-4xl font-bold tracking-tight text-on-surface">
            Pesan Sajian Bebek DUCK DUCK COOK
          </h1>
          <p className="text-sm sm:text-base text-on-surface-variant max-w-xl mt-2 leading-relaxed">
            Nikmati kemudahan reservasi meja eksklusif, pengantaran bento ke kantor, atau paket frozen pack siap saji dengan konfirmasi instan via QRIS.
          </p>
        </div>

        {/* Not Logged In Warning Banner */}
        {authChecked && !currentUser && (
          <div className="mb-8 p-5 rounded-3xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>
                Anda belum masuk ke akun. Silakan login atau daftar terlebih dahulu agar tiket pesanan Anda tercatat rapi di menu <b>Pesanan Anda</b>.
              </span>
            </div>
            <Link
              href="/login?redirect=/pesan"
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-primary text-white text-xs font-semibold shadow hover:bg-on-surface transition-all shrink-0"
            >
              <span>Masuk Akun</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Error Feedback */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Selection & Fields */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Step 1: Pilih Tipe Pesanan */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-border-soft/40">
              <h2 className="font-epilogue text-base font-bold text-on-surface mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-mono">1</span>
                <span>Pilih Jenis Pemesanan</span>
              </h2>

              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setOrderType("dine_in")}
                  className={`p-4 rounded-2xl border text-center flex flex-col items-center gap-2 transition-all ${
                    orderType === "dine_in"
                      ? "border-primary bg-surface-mint-subtle/70 text-primary font-bold shadow-sm ring-2 ring-primary/20"
                      : "border-border-soft/40 bg-white text-on-surface-variant hover:bg-surface-cream"
                  }`}
                >
                  <UtensilsCrossed className="w-5 h-5" />
                  <span className="text-xs">Reservasi Meja Resto</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderType("delivery")}
                  className={`p-4 rounded-2xl border text-center flex flex-col items-center gap-2 transition-all ${
                    orderType === "delivery"
                      ? "border-primary bg-surface-mint-subtle/70 text-primary font-bold shadow-sm ring-2 ring-primary/20"
                      : "border-border-soft/40 bg-white text-on-surface-variant hover:bg-surface-cream"
                  }`}
                >
                  <Package className="w-5 h-5" />
                  <span className="text-xs">Nasi Kotak / Bento</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderType("frozen_pack")}
                  className={`p-4 rounded-2xl border text-center flex flex-col items-center gap-2 transition-all ${
                    orderType === "frozen_pack"
                      ? "border-primary bg-surface-mint-subtle/70 text-primary font-bold shadow-sm ring-2 ring-primary/20"
                      : "border-border-soft/40 bg-white text-on-surface-variant hover:bg-surface-cream"
                  }`}
                >
                  <Snowflake className="w-5 h-5" />
                  <span className="text-xs">Frozen Pack Bebek</span>
                </button>
              </div>
            </div>

            {/* Step 2: Pilih Menu & Jumlah */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-border-soft/40">
              <h2 className="font-epilogue text-base font-bold text-on-surface mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-mono">2</span>
                <span>Pilih Paket Menu</span>
              </h2>

              <div className="flex flex-col gap-3">
                {menuCatalog
                  .filter((item) => item.type === orderType)
                  .map((item) => {
                    const isSelected = selectedItem === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedItem(item.id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between gap-4 ${
                          isSelected
                            ? "border-primary bg-surface-mint-subtle/50 ring-2 ring-primary/20"
                            : "border-border-soft/30 bg-surface-cream/50 hover:bg-surface-cream"
                        }`}
                      >
                        <div className="flex flex-col gap-1">
                          <span className="font-epilogue text-sm font-bold text-on-surface">{item.name}</span>
                          <span className="text-xs text-on-surface-variant leading-relaxed">{item.description}</span>
                          <span className="text-xs font-bold text-primary mt-1">
                            Rp {item.price.toLocaleString("id-ID")}
                          </span>
                        </div>
                        <input
                          type="radio"
                          name="selectedMenu"
                          checked={isSelected}
                          onChange={() => setSelectedItem(item.id)}
                          className="mt-1 accent-primary w-4 h-4 cursor-pointer"
                        />
                      </div>
                    );
                  })}
              </div>

              {/* Quantity */}
              <div className="mt-5 pt-4 border-t border-border-soft/30 flex items-center justify-between">
                <span className="text-xs font-bold text-on-surface">Jumlah Porsi / Paket:</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-full bg-surface-cream text-on-surface border border-border-soft/40 flex items-center justify-center font-bold text-sm hover:bg-surface-mint-subtle"
                  >
                    -
                  </button>
                  <span className="font-epilogue text-sm font-bold w-6 text-center">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-full bg-surface-cream text-on-surface border border-border-soft/40 flex items-center justify-center font-bold text-sm hover:bg-surface-mint-subtle"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Step 3: Informasi Pemesan */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-border-soft/40 flex flex-col gap-4">
              <h2 className="font-epilogue text-base font-bold text-on-surface mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-mono">3</span>
                <span>Data Pemesan &amp; Jadwal</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-on-surface">Nama Lengkap</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Nama Anda"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-surface-cream text-xs text-on-surface border border-border-soft/40 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <User className="w-4 h-4 text-on-surface-variant absolute left-3 top-3" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-on-surface">Nomor WhatsApp</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="0812xxxx"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-surface-cream text-xs text-on-surface border border-border-soft/40 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Phone className="w-4 h-4 text-on-surface-variant absolute left-3 top-3" />
                  </div>
                </div>
              </div>

              {/* Tanggal & Waktu (Jika Dine-in) */}
              {orderType === "dine_in" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-on-surface">Tanggal Reservasi</label>
                    <input
                      type="date"
                      required
                      value={resDate}
                      onChange={(e) => setResDate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-cream text-xs text-on-surface border border-border-soft/40 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-on-surface">Jam Kedatangan</label>
                    <select
                      value={resTime}
                      onChange={(e) => setResTime(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-cream text-xs text-on-surface border border-border-soft/40 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="11:30">11:30 WIB (Makan Siang)</option>
                      <option value="12:30">12:30 WIB (Makan Siang)</option>
                      <option value="17:30">17:30 WIB (Makan Malam)</option>
                      <option value="19:00">19:00 WIB (Makan Malam)</option>
                      <option value="20:30">20:30 WIB (Makan Malam)</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-on-surface">Jumlah Orang</label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={pax}
                      onChange={(e) => setPax(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-cream text-xs text-on-surface border border-border-soft/40 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              )}

              {/* Alamat Pengantaran (Jika Delivery / Frozen) */}
              {orderType !== "dine_in" && (
                <div className="flex flex-col gap-1.5 pt-2">
                  <label className="text-xs font-bold text-on-surface">Alamat Pengantaran Lengkap</label>
                  <div className="relative">
                    <textarea
                      rows={2}
                      required
                      placeholder="Jalan, nomor rumah/kantor, RT/RW, kelurahan, kecamatan, patokan..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-surface-cream text-xs text-on-surface border border-border-soft/40 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                    <MapPin className="w-4 h-4 text-on-surface-variant absolute left-3 top-3" />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface">Catatan Tambahan (Opsional)</label>
                <input
                  type="text"
                  placeholder="Contoh: Sambal dipisah, meja semi outdoor, dll..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-cream text-xs text-on-surface border border-border-soft/40 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Checkout Button */}
          <div className="lg:col-span-5 sticky top-28">
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-border-soft/40 flex flex-col gap-6">
              <div className="flex items-center gap-3 pb-4 border-b border-border-soft/30">
                <div className="w-10 h-10 rounded-xl bg-surface-mint-subtle flex items-center justify-center text-primary">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-epilogue text-base font-bold text-on-surface">Ringkasan Pesanan</h3>
                  <p className="text-xs text-on-surface-variant">DUCK DUCK COOK Artisanal</p>
                </div>
              </div>

              {/* Items List */}
              <div className="flex flex-col gap-3 text-xs">
                <div className="flex justify-between items-start">
                  <span className="text-on-surface font-semibold">{currentItem.name}</span>
                  <span className="text-on-surface font-mono font-bold">
                    Rp {currentItem.price.toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="flex justify-between text-on-surface-variant text-[11px]">
                  <span>Jumlah:</span>
                  <span>{quantity}x</span>
                </div>

                {orderType === "dine_in" ? (
                  <div className="p-3 rounded-xl bg-surface-cream flex flex-col gap-1 text-[11px] text-on-surface-variant">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      <span>{resDate} ({resTime} WIB)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-primary" />
                      <span>Kapasitas {pax} Orang</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-surface-cream flex items-center gap-1.5 text-[11px] text-on-surface-variant">
                    <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="line-clamp-2">{address || "Alamat belum diisi"}</span>
                  </div>
                )}
              </div>

              {/* Total Calculation */}
              <div className="pt-4 border-t border-border-soft/30 flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs text-on-surface-variant">
                  <span>Subtotal</span>
                  <span>Rp {totalPrice.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-on-surface-variant">
                  <span>Pajak &amp; Biaya Layanan</span>
                  <span className="text-emerald-700 font-semibold">Gratis</span>
                </div>
                <div className="pt-2 flex justify-between items-center">
                  <span className="font-epilogue text-sm font-bold text-on-surface">Total Tagihan:</span>
                  <span className="font-epilogue text-xl font-extrabold text-primary">
                    Rp {totalPrice.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading || !currentUser}
                className="w-full py-4 rounded-full bg-primary text-white font-semibold text-xs sm:text-sm shadow-md hover:bg-on-surface transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Membuat Tiket Pesanan...</span>
                  </>
                ) : (
                  <>
                    <span>Lanjut ke Pembayaran QRIS</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-[11px] text-on-surface-variant text-center">
                Metode pembayaran menggunakan <b>QRIS Resmi DUCK DUCK COOK</b>. Tiket pesanan akan otomatis dibuat setelah Anda menekan tombol di atas.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

