"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";
import { Lock, Mail, User, ArrowRight, AlertCircle, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok dengan kata sandi yang dimasukkan.");
      return;
    }

    if (password.length < 6) {
      setError("Kata sandi minimal harus terdiri dari 6 karakter.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Gagal membuat akun.");
        setLoading(false);
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan koneksi. Silakan coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-16 px-6 flex items-center justify-center bg-surface-cream">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-border-soft/40 relative overflow-hidden">
          {/* Header Brand */}
          <div className="flex flex-col items-center text-center mb-8">
            <Link href="/" className="relative w-14 h-14 rounded-full overflow-hidden shadow mb-3 border border-border-soft">
              <Image src={siteConfig.logo} alt={siteConfig.name} fill className="object-cover" priority />
            </Link>
            <h1 className="font-epilogue text-2xl font-bold text-on-surface">Daftar Akun Baru</h1>
            <p className="text-xs text-on-surface-variant mt-1">
              Bergabunglah untuk menikmati layanan spesial {siteConfig.name}
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-xs font-bold text-on-surface">
                Nama Lengkap
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  required
                  placeholder="Contoh: Rian Pratama"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-cream text-on-surface text-sm border border-border-soft/40 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
                <User className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-bold text-on-surface">
                Alamat Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  required
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-cream text-on-surface text-sm border border-border-soft/40 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
                <Mail className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-xs font-bold text-on-surface">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  required
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-cream text-on-surface text-sm border border-border-soft/40 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
                <Lock className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirmPassword" className="text-xs font-bold text-on-surface">
                Konfirmasi Kata Sandi
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="confirmPassword"
                  required
                  placeholder="Ulangi kata sandi"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-cream text-on-surface text-sm border border-border-soft/40 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
                <Lock className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-primary text-white font-semibold text-sm shadow hover:bg-on-surface transition-all active:scale-95 disabled:opacity-70 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Mendaftarkan...</span>
                </>
              ) : (
                <>
                  <span>Daftar Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-6 text-center text-xs text-on-surface-variant">
            Sudah memiliki akun?{" "}
            <Link href="/login" className="text-primary font-bold hover:underline">
              Masuk di sini
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

