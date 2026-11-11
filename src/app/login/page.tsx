"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";
import { Lock, Mail, ArrowRight, AlertCircle, Loader2, KeyRound } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Gagal masuk. Periksa kembali email dan password.");
        setLoading(false);
        return;
      }

      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("auth-change"));
      }

      if (data.user.role === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
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
            <h1 className="font-epilogue text-2xl font-bold text-on-surface">Masuk ke Akun Anda</h1>
            <p className="text-xs text-on-surface-variant mt-1">
              Kelola profil, reservasi, dan sistem {siteConfig.name}
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
                Kata Sandi (Password)
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <span>Masuk Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Akun Admin Bawaan Pill */}
          <div className="mt-6 p-3.5 rounded-2xl bg-surface-mint-subtle/80 border border-border-soft/40 flex flex-col gap-1 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-primary">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Kredensial Admin Awal (Demo):</span>
            </div>
            <p className="text-on-surface-variant text-[11px] font-mono">
              Email: <b>admin@gmail.com</b> | Pass: <b>123456</b>
            </p>
          </div>

          {/* Footer Link */}
          <div className="mt-6 text-center text-xs text-on-surface-variant">
            Belum memiliki akun?{" "}
            <Link href="/register" className="text-primary font-bold hover:underline">
              Daftar akun baru
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

