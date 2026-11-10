import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Home, ArrowLeft, Utensils } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-6 py-20 bg-surface-cream text-on-surface">
      <div className="max-w-md w-full text-center flex flex-col items-center gap-6 bg-white p-8 sm:p-12 rounded-3xl shadow-xl border border-border-soft/40">
        <div className="w-16 h-16 rounded-full bg-surface-mint-subtle flex items-center justify-center text-primary">
          <Utensils className="w-8 h-8" />
        </div>

        <div className="flex flex-col gap-2">
          <span className="font-epilogue text-5xl font-extrabold text-primary">404</span>
          <h1 className="font-epilogue text-xl sm:text-2xl font-bold text-on-surface">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            Halaman yang Anda tuju mungkin telah dipindahkan atau tautan yang Anda masukkan kurang tepat.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-full bg-primary text-white text-xs font-semibold shadow hover:bg-on-surface transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
          <Link
            href="/pesan"
            className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-full bg-surface-cream hover:bg-surface-mint-subtle text-primary text-xs font-semibold border border-border-soft/40 transition-colors"
          >
            <span>Pesan Bebek</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

