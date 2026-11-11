"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import {
  Menu,
  X,
  ArrowRight,
  User as UserIcon,
  LayoutDashboard,
  LogOut,
  ShoppingBag,
} from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Fungsi sinkronisasi status login dari server
  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const data = await res.json();
      if (data.authenticated && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Periksa status auth setiap kali rute/halaman berubah
  useEffect(() => {
    checkAuth();
  }, [pathname]);

  // Dengarkan custom event 'auth-change' atau saat browser window kembali aktif (focus)
  useEffect(() => {
    const handleAuthChange = () => {
      checkAuth();
    };
    window.addEventListener("auth-change", handleAuthChange);
    window.addEventListener("focus", handleAuthChange);
    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
      window.removeEventListener("focus", handleAuthChange);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout error:", err);
    }
    setUser(null);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("auth-change"));
    }
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { name: "Beranda", href: "/#hero" },
    { name: "Tentang Kami", href: "/#tentang-kami" },
    { name: "Layanan", href: "/#layanan" },
    { name: "Berita", href: "/#berita" },
    { name: "Kontak", href: "/#kontak" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-[0_4px_20px_-2px_rgba(92,112,87,0.08)] py-3"
          : "bg-white/85 backdrop-blur-sm py-4 border-b border-border-soft/30"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/#hero"
          className="flex items-center gap-3 transition-transform hover:opacity-90 group"
          aria-label={`${siteConfig.name} Beranda`}
        >
          <div className="relative w-10 h-10 rounded-full overflow-hidden shadow-sm border border-border-soft/50 group-hover:scale-105 transition-transform">
            <Image
              src={siteConfig.logo}
              alt={`Logo ${siteConfig.name}`}
              fill
              className="object-cover"
              priority
            />
          </div>
          <span className="font-epilogue text-lg lg:text-xl font-bold tracking-tight text-primary">
            {siteConfig.name}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7" aria-label="Menu Utama">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors duration-200 py-1 border-b-2 border-transparent hover:border-primary"
            >
              {link.name}
            </Link>
          ))}

          {/* Menu "Pesanan Anda" - Hanya muncul jika sudah login */}
          {!isLoadingAuth && user && (
            <Link
              href="/pesanan"
              className="text-sm font-semibold text-primary hover:text-on-surface transition-colors duration-200 py-1 border-b-2 border-primary flex items-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Pesanan Anda</span>
            </Link>
          )}
        </nav>

        {/* Desktop Action & Auth State */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/pesan"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-surface-mint-subtle text-primary border border-border-soft/40 text-xs font-bold hover:bg-surface-mint-tint transition-all"
          >
            <span>Pesan Online</span>
          </Link>

          {/* Kondisi Login: Jika sudah login, tombol Masuk HILANG. Jika belum login, tombol Masuk MUNCUL */}
          {isLoadingAuth ? (
            <div className="w-20 h-8 rounded-full bg-surface-mint-subtle/50 animate-pulse" />
          ) : user ? (
            /* USER SUDAH LOGIN: Tombol Masuk tidak ditampilkan */
            <div className="flex items-center gap-2.5">
              {user.role === "admin" && (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-primary text-white text-xs font-semibold shadow hover:bg-on-surface transition-all"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </Link>
              )}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-cream border border-border-soft/40 text-xs font-semibold text-on-surface">
                <UserIcon className="w-3.5 h-3.5 text-primary" />
                <span>{user.name.split(" ")[0]}</span>
              </div>
              <button
                onClick={handleLogout}
                title="Keluar dari akun"
                className="p-2 rounded-full text-red-600 hover:bg-red-50 transition-colors"
                aria-label="Keluar dari akun"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* USER BELUM LOGIN: Tombol Masuk ditampilkan */
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-primary-container text-on-primary text-xs font-bold shadow hover:bg-primary transition-all active:scale-95"
            >
              Masuk
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Tutup menu" : "Buka menu navigasi"}
          className="md:hidden p-2 rounded-xl text-on-surface hover:bg-surface-mint-subtle transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {isOpen ? <X className="w-6 h-6 text-primary" /> : <Menu className="w-6 h-6 text-primary" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-x-0 top-full bg-white/95 backdrop-blur-xl border-b border-border-soft/40 shadow-xl px-6 py-6 transition-all animate-in slide-in-from-top-4 duration-200"
          role="dialog"
          aria-modal="true"
        >
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-base font-semibold text-on-surface hover:text-primary py-2 px-3 rounded-lg hover:bg-surface-mint-subtle transition-colors"
              >
                {link.name}
              </Link>
            ))}

            {!isLoadingAuth && user && (
              <Link
                href="/pesanan"
                onClick={() => setIsOpen(false)}
                className="text-base font-semibold text-primary py-2 px-3 rounded-lg bg-surface-mint-subtle flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Pesanan Anda</span>
              </Link>
            )}

            <div className="pt-4 border-t border-border-soft/40 flex flex-col gap-2.5">
              <Link
                href="/pesan"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-full bg-primary text-white font-semibold text-sm shadow"
              >
                <span>Pesan Online &amp; Reservasi</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {isLoadingAuth ? (
                <div className="w-full h-10 rounded-full bg-surface-mint-subtle/50 animate-pulse" />
              ) : user ? (
                /* USER SUDAH LOGIN DI MOBILE: Tombol Masuk tidak ditampilkan */
                <>
                  <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-surface-cream border border-border-soft/40 text-xs text-on-surface">
                    <span className="font-semibold flex items-center gap-1.5">
                      <UserIcon className="w-4 h-4 text-primary" />
                      <span>{user.name}</span>
                    </span>
                    <span className="capitalize text-[11px] font-bold px-2 py-0.5 rounded-full bg-surface-mint-subtle text-primary border border-border-soft/30">
                      {user.role}
                    </span>
                  </div>

                  {user.role === "admin" && (
                    <Link
                      href="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-full bg-surface-mint-subtle text-primary font-semibold text-xs border border-border-soft/40"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Buka Dashboard Admin</span>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-full bg-red-50 text-red-700 font-semibold text-xs hover:bg-red-100 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Keluar ({user.name})</span>
                  </button>
                </>
              ) : (
                /* USER BELUM LOGIN DI MOBILE: Tombol Masuk ditampilkan */
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-full bg-surface-cream text-on-surface font-semibold text-xs border border-border-soft/40 hover:bg-surface-mint-subtle transition-colors"
                >
                  <span>Masuk ke Akun</span>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
