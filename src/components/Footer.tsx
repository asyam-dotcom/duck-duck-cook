import React from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Clock, Phone, Mail, Instagram, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-white shadow-[0_-4px_24px_rgba(92,112,87,0.04)] mt-auto border-t border-border-soft/30">
      {/* Bottom CTA Banner */}
      <section className="w-full bg-primary-container text-on-primary py-12 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-1 text-center md:text-left">
            <h3 className="font-epilogue text-xl sm:text-2xl font-bold">
              Siap Menikmati Sensasi Bebek Panggang Hari Ini?
            </h3>
            <p className="text-sm text-on-primary/90">
              Dapatkan pengalaman santap istimewa untuk santapan keluarga, pesta katering, dan bento kantor.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="#kontak"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white text-primary text-sm font-semibold shadow-md hover:bg-surface-cream transition-all duration-200"
            >
              <Phone className="w-4 h-4 text-primary" />
              <span>Hubungi Tim Reservasi</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand Col */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-full overflow-hidden shadow-sm border border-border-soft">
                <Image
                  src={siteConfig.logo}
                  alt={siteConfig.name}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-epilogue text-lg font-bold text-primary tracking-tight">
                {siteConfig.name}
              </span>
            </div>
            <p className="text-sm text-on-surface-variant max-w-sm leading-relaxed">
              Menghadirkan seni kuliner unggas artisanal berkualitas tinggi dengan sentuhan tradisi Nusantara dan keanggunan gastronomi kontemporer.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={siteConfig.contact.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-surface-mint-subtle flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={`https://wa.me/${siteConfig.contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-10 h-10 rounded-full bg-surface-mint-subtle flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
              >
                <Phone className="w-5 h-5" />
              </a>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                aria-label="Email"
                className="w-10 h-10 rounded-full bg-surface-mint-subtle flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Nav Quick Links */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <h4 className="font-epilogue text-base font-bold text-on-surface">Navigasi Cepat</h4>
            <ul className="flex flex-col gap-2.5 text-sm text-on-surface-variant">
              <li>
                <Link href="#hero" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Beranda</span>
                </Link>
              </li>
              <li>
                <Link href="#tentang-kami" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Tentang Kami</span>
                </Link>
              </li>
              <li>
                <Link href="#layanan" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Layanan & Katering</span>
                </Link>
              </li>
              <li>
                <Link href="#berita" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Berita & Inspirasi</span>
                </Link>
              </li>
              <li>
                <Link href="#kontak" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Hubungi Kami</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Store Info */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <h4 className="font-epilogue text-base font-bold text-on-surface">Dapur Utama</h4>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              {siteConfig.contact.address}
            </p>
            <p className="text-xs text-on-surface-variant flex items-center gap-2 pt-1">
              <Clock className="w-4 h-4 text-primary shrink-0" />
              <span>{siteConfig.contact.hours}</span>
            </p>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="mt-16 pt-8 border-t border-border-soft/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant">
          <p>© {new Date().getFullYear()} {siteConfig.name}. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-primary cursor-pointer transition-colors">Kebijakan Privasi</span>
            <span className="hover:text-primary cursor-pointer transition-colors">Syarat & Ketentuan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

