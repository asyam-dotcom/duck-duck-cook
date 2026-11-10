"use client";

import React, { useState } from "react";
import { siteConfig } from "@/config/site";
import {
  MapPin,
  Clock,
  MessageCircle,
  Mail,
  Send,
  CheckCircle2,
  Navigation,
  Copy,
  Car,
  Wifi,
  Building,
  DoorClosed,
  Quote,
} from "lucide-react";

export default function Contact() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    service: "dinein",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setFormData({ name: "", contact: "", service: "dinein", notes: "" });
    setTimeout(() => {
      setFormSubmitted(false);
    }, 6000);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(siteConfig.contact.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="kontak" className="w-full py-20 lg:py-28 bg-surface-cream relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16 gap-3">
          <span className="text-xs text-primary font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-surface-mint-subtle border border-border-soft/40">
            Hubungi Kami
          </span>
          <h2 className="font-epilogue text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-on-surface">
            Mari Berbincang & Bersantap
          </h2>
          <p className="text-base text-on-surface-variant">
            Punya pertanyaan seputar katering acara, reservasi meja spesial, atau pesanan korporat? Tim kami siap melayani dengan senang hati.
          </p>
        </div>

        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: Form & Contact Info */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            {/* Info Badges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Alamat */}
              <div className="p-5 rounded-2xl bg-white shadow-sm flex items-start gap-4 border border-border-soft/30">
                <div className="w-10 h-10 rounded-xl bg-surface-mint-subtle flex items-center justify-center text-primary shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-on-surface">Alamat Utama</span>
                  <span className="text-xs text-on-surface-variant leading-relaxed mt-0.5">
                    {siteConfig.contact.address}
                  </span>
                </div>
              </div>

              {/* Jam Operasional */}
              <div className="p-5 rounded-2xl bg-white shadow-sm flex items-start gap-4 border border-border-soft/30">
                <div className="w-10 h-10 rounded-xl bg-surface-mint-subtle flex items-center justify-center text-primary shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-on-surface">Jam Operasional</span>
                  <span className="text-xs text-on-surface-variant mt-0.5">Senin – Minggu</span>
                  <span className="text-xs text-primary font-semibold">10.00 – 22.00 WIB</span>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="p-5 rounded-2xl bg-white shadow-sm flex items-start gap-4 border border-border-soft/30">
                <div className="w-10 h-10 rounded-xl bg-surface-mint-subtle flex items-center justify-center text-primary shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-on-surface">WhatsApp Resmi</span>
                  <a
                    href={`https://wa.me/${siteConfig.contact.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary font-semibold hover:underline mt-0.5"
                  >
                    {siteConfig.contact.phone}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="p-5 rounded-2xl bg-white shadow-sm flex items-start gap-4 border border-border-soft/30">
                <div className="w-10 h-10 rounded-xl bg-surface-mint-subtle flex items-center justify-center text-primary shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-on-surface">Surel Resmi</span>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="text-xs text-primary font-semibold hover:underline mt-0.5"
                  >
                    {siteConfig.contact.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Interactive Contact Form */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-border-soft/30">
              <h3 className="font-epilogue text-lg font-bold text-on-surface mb-6">
                Kirimkan Pesan atau Permintaan Khusus
              </h3>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-xs font-semibold text-on-surface">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      placeholder="Contoh: Rian Pratama"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-surface-cream text-on-surface focus:outline-none focus:ring-2 focus:ring-primary text-sm transition-all border border-border-soft/30"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact" className="text-xs font-semibold text-on-surface">
                      Email atau Nomor WhatsApp
                    </label>
                    <input
                      type="text"
                      id="contact"
                      required
                      placeholder="0812xxxx / nama@email.com"
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-surface-cream text-on-surface focus:outline-none focus:ring-2 focus:ring-primary text-sm transition-all border border-border-soft/30"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="service" className="text-xs font-semibold text-on-surface">
                    Layanan yang Dituju
                  </label>
                  <select
                    id="service"
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-surface-cream text-on-surface focus:outline-none focus:ring-2 focus:ring-primary text-sm transition-all border border-border-soft/30"
                  >
                    <option value="dinein">Reservasi Dine-in Meja Restoran</option>
                    <option value="katering">Pemesanan Katering Acara / Wedding</option>
                    <option value="bentobox">Pemesanan Bento Box / Nasi Kotak Kantor</option>
                    <option value="frozen">Pemesanan Frozen Pack Grosir / Retail</option>
                    <option value="lainnya">Pertanyaan Umum Lainnya</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="notes" className="text-xs font-semibold text-on-surface">
                    Detail Pesan / Jumlah Porsi / Tanggal Acara
                  </label>
                  <textarea
                    id="notes"
                    required
                    rows={4}
                    placeholder="Ceritakan rencana acara Anda atau menu yang diinginkan..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-surface-cream text-on-surface focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none transition-all border border-border-soft/30"
                  />
                </div>

                {formSubmitted && (
                  <div className="p-4 rounded-xl bg-surface-mint-subtle text-primary text-sm flex items-center gap-3 border border-border-soft animate-in fade-in">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>
                      Terima kasih! Pesan Anda telah kami terima. Tim reservasi DUCK DUCK COOK akan menghubungi Anda segera.
                    </span>
                  </div>
                )}

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-primary-container text-on-primary font-semibold text-sm shadow-md hover:bg-primary transition-all duration-200 mt-2"
                >
                  <span>Kirim Pesan Sekarang</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Right: Map & Amenities */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm flex flex-col gap-5 border border-border-soft/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-mint-subtle flex items-center justify-center text-primary">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-epilogue text-base font-bold text-on-surface">
                      DUCK DUCK COOK Central
                    </h4>
                    <p className="text-xs text-on-surface-variant">Dapur Utama & Restoran Flagship</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-surface-mint-subtle text-xs font-semibold text-primary border border-border-soft/40">
                  Buka Hari Ini
                </span>
              </div>

              {/* Google Maps Embed Iframe */}
              <div className="w-full h-72 rounded-2xl overflow-hidden shadow-inner relative border border-border-soft/40 bg-surface-container">
                <iframe
                  title="Peta Lokasi DUCK DUCK COOK"
                  src={siteConfig.contact.mapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>

              {/* Map Action Buttons */}
              <div className="flex items-center gap-3">
                <a
                  href={siteConfig.contact.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold shadow hover:bg-on-surface transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Buka di Google Maps</span>
                </a>
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface-cream text-on-surface text-xs font-semibold border border-border-soft/50 hover:bg-surface-mint-subtle transition-colors"
                  title="Salin Alamat"
                >
                  <Copy className="w-4 h-4 text-primary" />
                  <span>{copied ? "Tersalin!" : "Salin Alamat"}</span>
                </button>
              </div>

              {/* Practical Amenities Checklist */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border-soft/20">
                <div className="flex items-center gap-2 text-on-surface-variant text-xs">
                  <Car className="w-4 h-4 text-primary shrink-0" />
                  <span>Valet & Parkir Luas</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant text-xs">
                  <Wifi className="w-4 h-4 text-primary shrink-0" />
                  <span>High-Speed Wi-Fi</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant text-xs">
                  <Building className="w-4 h-4 text-primary shrink-0" />
                  <span>Musholla Bersih</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant text-xs">
                  <DoorClosed className="w-4 h-4 text-primary shrink-0" />
                  <span>Private VIP Room</span>
                </div>
              </div>
            </div>

            {/* Highlight Quotation Banner */}
            <div className="p-6 rounded-3xl bg-surface-mint-tint text-on-surface flex flex-col gap-2 border border-border-soft/40 shadow-sm">
              <Quote className="w-6 h-6 text-primary" />
              <p className="text-sm font-medium italic leading-relaxed text-on-surface">
                &ldquo;Kelezatan sejati hadir dari kesabaran mengolah setiap bumbu dan dedikasi memperlakukan setiap santapan bagai hidangan untuk keluarga tercinta.&rdquo;
              </p>
              <span className="text-xs font-bold text-primary mt-1">
                — Tim Pengolah DUCK DUCK COOK
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

