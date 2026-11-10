import React from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import {
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  Star,
  ArrowRight,
  Utensils,
  Leaf,
} from "lucide-react";

export default function Hero() {
  return (
    <section id="hero" className="relative w-full overflow-hidden py-16 lg:py-24 bg-surface-cream">
      {/* Decorative Background Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-surface-mint-subtle/70 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-[30rem] h-[30rem] rounded-full bg-surface-mint-tint/40 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 flex flex-col items-start gap-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-surface-mint-subtle text-primary shadow-sm border border-border-soft/40">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span className="text-xs tracking-wider uppercase font-bold">
                {siteConfig.tagline}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-epilogue text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-on-surface leading-[1.15]">
              {siteConfig.headline}
            </h1>

            {/* Subtitle / Description */}
            <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed max-w-xl">
              {siteConfig.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto">
              <Link
                href="/pesan"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-primary-container text-on-primary font-semibold text-sm shadow-md hover:bg-primary transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Pesan Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#layanan"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white text-on-surface font-semibold text-sm shadow-sm hover:bg-surface-mint-subtle transition-all duration-200 border border-border-soft/40"
              >
                <Utensils className="w-4 h-4 text-primary" />
                <span>Lihat Menu & Layanan</span>
              </Link>
            </div>

            {/* 3 Metric Badges */}
            <div className="pt-6 grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-lg">
              <div className="p-3.5 rounded-2xl bg-white shadow-sm flex items-center gap-3 border border-border-soft/30">
                <div className="w-10 h-10 rounded-xl bg-surface-mint-subtle flex items-center justify-center text-primary shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-epilogue text-base sm:text-lg font-bold text-on-surface">
                    6 Jam
                  </span>
                  <span className="text-xs text-on-surface-variant">Slow-Roast</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white shadow-sm flex items-center gap-3 border border-border-soft/30">
                <div className="w-10 h-10 rounded-xl bg-surface-mint-subtle flex items-center justify-center text-primary shrink-0">
                  <Leaf className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-epilogue text-base sm:text-lg font-bold text-on-surface">
                    12 Jenis
                  </span>
                  <span className="text-xs text-on-surface-variant">Rempah Murni</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white shadow-sm flex items-center gap-3 border border-border-soft/30">
                <div className="w-10 h-10 rounded-xl bg-surface-mint-subtle flex items-center justify-center text-primary shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-epilogue text-base sm:text-lg font-bold text-on-surface">
                    100%
                  </span>
                  <span className="text-xs text-on-surface-variant">Halal Resmi</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual & Floating Social Proofs */}
          <div className="lg:col-span-6 relative">
            <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl bg-surface-container aspect-[4/3] lg:aspect-[5/4] border-4 border-white">
              <Image
                src="/images/hero-duck.jpg"
                alt="Sajian Bebek Panggang Artisanal DUCK DUCK COOK dengan kulit keemasan renyah dan bumbu rempah harum"
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Bottom Schedule Banner */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs sm:text-sm px-4 py-2.5 rounded-xl bg-black/50 backdrop-blur-md border border-white/10">
                <span className="flex items-center gap-2 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                  Dapur Buka Hari Ini
                </span>
                <span className="text-white/90 text-xs sm:text-sm font-medium">
                  Panggang Segar Pukul 11:00 & 17:00
                </span>
              </div>
            </div>

            {/* Social Proof Pill 1 (Top Left) */}
            <div className="absolute -top-5 left-4 sm:left-6 px-4 py-2 rounded-full bg-white shadow-lg flex items-center gap-2 border border-border-soft/40">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span className="text-xs sm:text-sm font-bold text-on-surface">
                100% Halal Certified
              </span>
            </div>

            {/* Social Proof Pill 2 (Right Floating Card) */}
            <div className="absolute top-1/3 -right-3 sm:-right-6 px-4 py-3 rounded-2xl bg-white shadow-xl flex items-center gap-3 border border-border-soft/40">
              <div className="w-10 h-10 rounded-full bg-surface-mint-subtle flex items-center justify-center text-amber-500 shrink-0">
                <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="font-epilogue text-base font-bold text-on-surface">4.9</span>
                  <span className="text-xs text-on-surface-variant">/ 5.0</span>
                </div>
                <span className="text-xs text-on-surface-variant font-medium">
                  10.000+ Pelanggan Puas
                </span>
              </div>
            </div>

            {/* Social Proof Pill 3 (Bottom Right) */}
            <div className="absolute -bottom-5 right-6 sm:right-10 px-4 py-2 rounded-full bg-white shadow-lg flex items-center gap-2 border border-border-soft/40">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs sm:text-sm font-bold text-on-surface">
                Bahan Segar Tiap Hari
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

