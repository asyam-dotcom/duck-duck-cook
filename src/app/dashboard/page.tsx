"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";
import {
  Users,
  Shield,
  Newspaper,
  KeyRound,
  LogOut,
  Plus,
  Trash2,
  Edit,
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Upload,
  ExternalLink,
  ShieldAlert,
  Database,
  ShoppingBag,
  Clock,
  XCircle,
  Phone,
  Calendar,
  MapPin,
  Check,
  X,
} from "lucide-react";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role_id: string;
  role_name: string;
  status: "active" | "inactive";
  created_at: string;
}

interface RoleItem {
  id: string;
  name: string;
  description: string;
  permissions: string;
  is_system: boolean;
  created_at: string;
}

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail_path: string;
  status: "published" | "draft";
  author_id: string;
  created_at: string;
}

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

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"orders" | "users" | "roles" | "news" | "security">("orders");
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Data states
  const [users, setUsers] = useState<UserItem[]>([]);
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Filter & Search
  const [userSearch, setUserSearch] = useState("");
  const [newsSearch, setNewsSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderFilter, setOrderFilter] = useState<"all" | "menunggu_konfirmasi" | "dikonfirmasi" | "dibatalkan">("all");

  // News Modals & Forms
  const [newsModalOpen, setNewsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [newsForm, setNewsForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    thumbnail_path: "",
    status: "published" as "published" | "draft",
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  // Role Form Modal
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [roleForm, setRoleForm] = useState({
    name: "",
    description: "",
    permissions: "read",
  });

  // Password Change Form
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passLoading, setPassLoading] = useState(false);

  // Cancel order modal
  const [cancelModalOrder, setCancelModalOrder] = useState<OrderItem | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  // Load Initial Data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [meRes, usersRes, rolesRes, newsRes, ordersRes] = await Promise.all([
        fetch("/api/auth/me"),
        fetch("/api/admin/users"),
        fetch("/api/admin/roles"),
        fetch("/api/admin/news"),
        fetch("/api/admin/orders"),
      ]);

      const meData = await meRes.json();
      if (!meData.authenticated || meData.user.role !== "admin") {
        router.push("/login");
        return;
      }
      setCurrentUser(meData.user);

      const usersData = await usersRes.json();
      if (usersData.success) setUsers(usersData.data);

      const rolesData = await rolesRes.json();
      if (rolesData.success) setRoles(rolesData.data);

      const newsData = await newsRes.json();
      if (newsData.success) setNews(newsData.data);

      const ordersData = await ordersRes.json();
      if (ordersData.success) setOrders(ordersData.data);
    } catch {
      showFeedback("error", "Gagal memuat data dari server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showFeedback = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  // Order Actions
  const handleConfirmOrder = async (order: OrderItem) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: order.id, status: "dikonfirmasi" }),
      });
      const data = await res.json();
      if (data.success) {
        showFeedback("success", `Pembayaran tiket #${order.order_code} berhasil dikonfirmasi!`);
        fetchData();
      } else {
        showFeedback("error", data.error || "Gagal mengonfirmasi pesanan");
      }
    } catch {
      showFeedback("error", "Koneksi gagal");
    }
  };

  const handleCancelOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelModalOrder) return;
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: cancelModalOrder.id,
          status: "dibatalkan",
          admin_notes: cancelReason || "Dibatalkan oleh admin",
        }),
      });
      const data = await res.json();
      if (data.success) {
        showFeedback("success", `Pesanan #${cancelModalOrder.order_code} telah dibatalkan.`);
        setCancelModalOrder(null);
        setCancelReason("");
        fetchData();
      } else {
        showFeedback("error", data.error || "Gagal membatalkan pesanan");
      }
    } catch {
      showFeedback("error", "Koneksi gagal");
    }
  };

  // User Actions
  const handleToggleUserStatus = async (user: UserItem) => {
    const nextStatus = user.status === "active" ? "inactive" : "active";
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showFeedback("success", `Status user ${user.name} berhasil diubah`);
        fetchData();
      } else {
        showFeedback("error", data.error || "Gagal mengubah status user");
      }
    } catch {
      showFeedback("error", "Koneksi gagal");
    }
  };

  const handleChangeUserRole = async (userId: string, newRoleId: string) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, role_id: newRoleId }),
      });
      const data = await res.json();
      if (data.success) {
        showFeedback("success", "Role user berhasil diperbarui");
        fetchData();
      } else {
        showFeedback("error", data.error || "Gagal mengubah role");
      }
    } catch {
      showFeedback("error", "Koneksi gagal");
    }
  };

  const handleDeleteUser = async (user: UserItem) => {
    if (!confirm(`Yakin ingin menghapus pengguna "${user.name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/users?id=${user.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showFeedback("success", `User ${user.name} berhasil dihapus`);
        fetchData();
      } else {
        showFeedback("error", data.error || "Gagal menghapus user");
      }
    } catch {
      showFeedback("error", "Koneksi gagal");
    }
  };

  // Role Actions
  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(roleForm),
      });
      const data = await res.json();
      if (data.success) {
        showFeedback("success", "Role baru berhasil ditambahkan");
        setRoleModalOpen(false);
        setRoleForm({ name: "", description: "", permissions: "read" });
        fetchData();
      } else {
        showFeedback("error", data.error || "Gagal menyimpan role");
      }
    } catch {
      showFeedback("error", "Koneksi gagal");
    }
  };

  const handleDeleteRole = async (role: RoleItem) => {
    if (role.is_system) {
      showFeedback("error", "Role sistem tidak boleh dihapus");
      return;
    }
    if (!confirm(`Yakin ingin menghapus role "${role.name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/roles?id=${role.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showFeedback("success", `Role ${role.name} berhasil dihapus`);
        fetchData();
      } else {
        showFeedback("error", data.error || "Gagal menghapus role");
      }
    } catch {
      showFeedback("error", "Koneksi gagal");
    }
  };

  // News Actions
  const openNewsModal = (newsItem?: NewsItem) => {
    if (newsItem) {
      setEditingNews(newsItem);
      setNewsForm({
        title: newsItem.title,
        excerpt: newsItem.excerpt,
        content: newsItem.content,
        thumbnail_path: newsItem.thumbnail_path,
        status: newsItem.status,
      });
    } else {
      setEditingNews(null);
      setNewsForm({
        title: "",
        excerpt: "",
        content: "",
        thumbnail_path: "/images/news-1.svg",
        status: "published",
      });
    }
    setNewsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        setNewsForm((prev) => ({ ...prev, thumbnail_path: data.filePath }));
        showFeedback("success", "Gambar berhasil diunggah");
      } else {
        showFeedback("error", data.error || "Gagal mengunggah gambar");
      }
    } catch {
      showFeedback("error", "Koneksi upload gagal");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = { ...newsForm };
      if (editingNews) payload.id = editingNews.id;

      const res = await fetch("/api/admin/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        showFeedback("success", editingNews ? "Berita berhasil diperbarui" : "Berita baru diterbitkan");
        setNewsModalOpen(false);
        fetchData();
      } else {
        showFeedback("error", data.error || "Gagal menyimpan berita");
      }
    } catch {
      showFeedback("error", "Koneksi gagal");
    }
  };

  const handleDeleteNews = async (newsItem: NewsItem) => {
    if (!confirm(`Yakin ingin menghapus artikel "${newsItem.title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/news?id=${newsItem.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showFeedback("success", "Berita berhasil dihapus");
        fetchData();
      } else {
        showFeedback("error", data.error || "Gagal menghapus berita");
      }
    } catch {
      showFeedback("error", "Koneksi gagal");
    }
  };

  // Change Password Action
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showFeedback("error", "Konfirmasi password baru tidak cocok");
      return;
    }
    if (newPassword.length < 6) {
      showFeedback("error", "Password baru minimal 6 karakter");
      return;
    }

    setPassLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        showFeedback("success", "Password berhasil diubah!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        showFeedback("error", data.error || "Gagal mengubah password");
      }
    } catch {
      showFeedback("error", "Koneksi gagal");
    } finally {
      setPassLoading(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const code = String(o.order_code || "").toLowerCase();
    const name = String(o.customer_name || "").toLowerCase();
    const phone = String(o.customer_phone || "");
    const q = orderSearch.toLowerCase();
    const matchesSearch = code.includes(q) || name.includes(q) || phone.includes(orderSearch);
    const matchesFilter = orderFilter === "all" || o.status === orderFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredUsers = users.filter(
    (u) =>
      String(u.name || "").toLowerCase().includes(userSearch.toLowerCase()) ||
      String(u.email || "").toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredNews = news.filter(
    (n) =>
      String(n.title || "").toLowerCase().includes(newsSearch.toLowerCase()) ||
      String(n.slug || "").toLowerCase().includes(newsSearch.toLowerCase())
  );

  const pendingOrdersCount = orders.filter((o) => o.status === "menunggu_konfirmasi").length;

  return (
    <div className="min-h-screen bg-surface-cream text-on-surface">
      {/* Top Bar */}
      <header className="bg-white border-b border-border-soft/40 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="relative w-10 h-10 rounded-full overflow-hidden shadow-sm border border-border-soft">
              <Image src={siteConfig.logo} alt={siteConfig.name} fill className="object-cover" />
            </Link>
            <div>
              <h1 className="font-epilogue text-lg font-bold text-primary leading-tight">
                Dashboard Admin {siteConfig.name}
              </h1>
              <p className="text-xs text-on-surface-variant">
                Masuk sebagai: <b>{currentUser?.name || "Administrator"}</b> ({currentUser?.email})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-surface-cream hover:bg-surface-mint-subtle text-primary border border-border-soft/40 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Lihat Website</span>
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-700 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
        {/* Feedback Alert Toast */}
        {feedback && (
          <div
            className={`mb-6 p-4 rounded-2xl border text-sm flex items-center gap-3 shadow-sm animate-in fade-in duration-200 ${
              feedback.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Database Mode Notice */}
        <div className="mb-6 p-4 rounded-2xl bg-white border border-border-soft/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm">
          <div className="flex items-center gap-2.5">
            <Database className="w-4 h-4 text-primary" />
            <span className="font-semibold text-on-surface">Status Database:</span>
            <span className="text-on-surface-variant">
              {process.env.NEXT_PUBLIC_APPS_SCRIPT_URL
                ? "Terhubung ke Google Spreadsheet via Apps Script"
                : "Mode Database Lokal Aman (.data/db.json) — Siap sinkronisasi ke Google Spreadsheet"}
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-surface-mint-subtle text-primary font-semibold w-fit">
            Ready &amp; Active
          </span>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-border-soft/40 pb-4 mb-8 overflow-x-auto">
          {/* Tab Pesanan (Step 3) */}
          <button
            onClick={() => setActiveTab("orders")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
              activeTab === "orders"
                ? "bg-primary text-white shadow-sm"
                : "bg-white text-on-surface-variant hover:bg-surface-mint-subtle"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Pesanan &amp; Reservasi ({orders.length})</span>
            {pendingOrdersCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-amber-950 text-[10px] font-extrabold animate-pulse">
                {pendingOrdersCount} Baru
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
              activeTab === "users"
                ? "bg-primary text-white shadow-sm"
                : "bg-white text-on-surface-variant hover:bg-surface-mint-subtle"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Manajemen User ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("roles")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
              activeTab === "roles"
                ? "bg-primary text-white shadow-sm"
                : "bg-white text-on-surface-variant hover:bg-surface-mint-subtle"
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Manajemen Role ({roles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("news")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
              activeTab === "news"
                ? "bg-primary text-white shadow-sm"
                : "bg-white text-on-surface-variant hover:bg-surface-mint-subtle"
            }`}
          >
            <Newspaper className="w-4 h-4" />
            <span>CRUD Berita ({news.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
              activeTab === "security"
                ? "bg-primary text-white shadow-sm"
                : "bg-white text-on-surface-variant hover:bg-surface-mint-subtle"
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Ganti Password Admin</span>
          </button>
        </div>

        {/* Tab: Manajemen Pesanan (Step 3) */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-border-soft/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-epilogue text-xl font-bold text-on-surface">Daftar Tiket Pesanan &amp; Reservasi</h2>
                <p className="text-xs text-on-surface-variant">
                  Verifikasi pembayaran QRIS, konfirmasi jadwal reservasi, dan hubungi pelanggan via WhatsApp
                </p>
              </div>

              {/* Search & Status Filter */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Cari kode tiket, nama, WA..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-surface-cream text-xs text-on-surface border border-border-soft/40 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-3" />
                </div>

                <select
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value as any)}
                  className="w-full sm:w-auto px-3 py-2.5 rounded-xl bg-surface-cream text-xs font-medium border border-border-soft/40 focus:outline-none"
                >
                  <option value="all">Semua Status</option>
                  <option value="menunggu_konfirmasi">Menunggu Konfirmasi ({pendingOrdersCount})</option>
                  <option value="dikonfirmasi">Dikonfirmasi</option>
                  <option value="dibatalkan">Dibatalkan</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="py-12 flex justify-center items-center gap-2 text-primary text-sm">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Memuat data pesanan...</span>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="py-12 text-center text-xs text-on-surface-variant">
                Tidak ada tiket pesanan yang cocok dengan kriteria pencarian.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filteredOrders.map((order) => {
                  const isWaiting = order.status === "menunggu_konfirmasi";
                  const isConfirmed = order.status === "dikonfirmasi";
                  const isCancelled = order.status === "dibatalkan";

                  // Clean WhatsApp number
                  const cleanPhone = String(order.customer_phone || "").replace(/\D/g, "");
                  const waNumber = cleanPhone.startsWith("0") ? `62${cleanPhone.slice(1)}` : cleanPhone;

                  return (
                    <div
                      key={order.id}
                      className="p-5 rounded-2xl bg-surface-cream border border-border-soft/30 flex flex-col md:flex-row md:items-center justify-between gap-5 hover:bg-surface-mint-subtle/30 transition-colors"
                    >
                      <div className="flex flex-col gap-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-epilogue text-sm font-bold text-on-surface font-mono">
                            #{order.order_code}
                          </span>
                          <span className="text-xs font-semibold text-primary capitalize px-2.5 py-0.5 rounded-full bg-surface-mint-subtle border border-border-soft/40">
                            {order.order_type === "dine_in"
                              ? "Dine-in"
                              : order.order_type === "delivery"
                              ? "Bento Delivery"
                              : "Frozen Pack"}
                          </span>

                          {isWaiting && (
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">
                              Menunggu Konfirmasi
                            </span>
                          )}
                          {isConfirmed && (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                              Dikonfirmasi
                            </span>
                          )}
                          {isCancelled && (
                            <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[11px] font-bold">
                              Dibatalkan
                            </span>
                          )}
                        </div>

                        <div className="text-xs font-bold text-on-surface mt-1">
                          {order.customer_name} • <span className="font-mono text-on-surface-variant">{order.customer_phone}</span>
                        </div>

                        <p className="text-xs text-on-surface-variant font-medium">
                          {order.items_summary}
                        </p>

                        {order.order_type === "dine_in" && order.reservation_date && (
                          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                            <Calendar className="w-3.5 h-3.5 text-primary" />
                            <span>
                              {order.reservation_date} pukul {order.reservation_time} WIB ({order.pax_or_quantity} Orang)
                            </span>
                          </div>
                        )}

                        {order.delivery_address && (
                          <div className="flex items-start gap-1.5 text-xs text-on-surface-variant">
                            <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{order.delivery_address}</span>
                          </div>
                        )}

                        {order.notes && (
                          <p className="text-[11px] italic text-on-surface-variant">
                            Catatan: &ldquo;{order.notes}&rdquo;
                          </p>
                        )}

                        {order.admin_notes && (
                          <p className="text-[11px] font-semibold text-red-700">
                            Catatan Admin: {order.admin_notes}
                          </p>
                        )}
                      </div>

                      {/* Right: Total Price & Actions */}
                      <div className="flex flex-col md:items-end justify-between gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-border-soft/30">
                        <div className="text-left md:text-right">
                          <span className="text-[11px] text-on-surface-variant block">Total Pembayaran:</span>
                          <span className="font-epilogue text-base font-extrabold text-primary">
                            Rp {Number(order.total_amount || 0).toLocaleString("id-ID")}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {/* WhatsApp Direct Link */}
                          <a
                            href={`https://wa.me/${waNumber}?text=Halo%20Kak%20${encodeURIComponent(
                              order.customer_name
                            )},%20kami%20dari%20DUCK%20DUCK%20COOK%20mengenai%20tiket%20pesanan%20${order.order_code}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors"
                            title="Hubungi Pelanggan via WhatsApp"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Chat WA</span>
                          </a>

                          {/* Confirm Button */}
                          {isWaiting && (
                            <button
                              onClick={() => handleConfirmOrder(order)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary hover:bg-on-surface text-white text-xs font-semibold shadow-sm transition-colors"
                              title="Konfirmasi Pembayaran QRIS"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Konfirmasi</span>
                            </button>
                          )}

                          {/* Cancel Button */}
                          {!isCancelled && (
                            <button
                              onClick={() => {
                                setCancelModalOrder(order);
                                setCancelReason("");
                              }}
                              className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors"
                              title="Batalkan Pesanan"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Manajemen User */}
        {activeTab === "users" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-border-soft/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-epilogue text-xl font-bold text-on-surface">Daftar Pengguna Terdaftar</h2>
                <p className="text-xs text-on-surface-variant">
                  Kelola hak akses role dan status aktif akun pengguna sistem
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  placeholder="Cari nama atau email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-surface-cream text-xs text-on-surface border border-border-soft/40 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-3" />
              </div>
            </div>

            {loading ? (
              <div className="py-12 flex justify-center items-center gap-2 text-primary text-sm">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Memuat daftar pengguna...</span>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="py-12 text-center text-xs text-on-surface-variant">
                Tidak ada data pengguna yang cocok dengan pencarian.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-cream border-b border-border-soft/30 text-on-surface uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="py-3 px-4 rounded-l-xl">Nama Pengguna</th>
                      <th className="py-3 px-4">Alamat Email</th>
                      <th className="py-3 px-4">Role Saat Ini</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 rounded-r-xl text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-soft/20">
                    {filteredUsers.map((u) => {
                      const isSelf = u.id === currentUser?.id;
                      return (
                        <tr key={u.id} className="hover:bg-surface-cream/50 transition-colors">
                          <td className="py-4 px-4 font-semibold text-on-surface">
                            {u.name}
                            {isSelf && (
                              <span className="ml-2 px-2 py-0.5 rounded-full bg-surface-mint-subtle text-primary text-[10px]">
                                Anda
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-on-surface-variant">{u.email}</td>
                          <td className="py-4 px-4">
                            <select
                              value={u.role_id}
                              disabled={isSelf}
                              onChange={(e) => handleChangeUserRole(u.id, e.target.value)}
                              className="px-2.5 py-1.5 rounded-lg bg-surface-cream text-xs font-medium border border-border-soft/40 focus:outline-none disabled:opacity-60"
                            >
                              {roles.map((r) => (
                                <option key={r.id} value={r.id}>
                                  {r.name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-full font-semibold text-[11px] ${
                                u.status === "active"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-red-50 text-red-700"
                              }`}
                            >
                              {u.status === "active" ? "Aktif" : "Nonaktif"}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right space-x-2">
                            <button
                              onClick={() => handleToggleUserStatus(u)}
                              disabled={isSelf}
                              title={u.status === "active" ? "Nonaktifkan akun" : "Aktifkan akun"}
                              className="px-3 py-1.5 rounded-lg bg-surface-cream hover:bg-surface-mint-subtle text-on-surface border border-border-soft/40 transition-colors disabled:opacity-40"
                            >
                              {u.status === "active" ? "Nonaktifkan" : "Aktifkan"}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u)}
                              disabled={isSelf}
                              title={isSelf ? "Tidak bisa menghapus diri sendiri" : "Hapus user"}
                              className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors disabled:opacity-30"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Manajemen Role */}
        {activeTab === "roles" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-border-soft/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-epilogue text-xl font-bold text-on-surface">Manajemen Hak Akses (Role)</h2>
                <p className="text-xs text-on-surface-variant">
                  Role sistem terlindungi dan tidak dapat dihapus demi keamanan sistem
                </p>
              </div>

              <button
                onClick={() => setRoleModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-primary text-white text-xs font-semibold shadow hover:bg-on-surface transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Role Kustom</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roles.map((r) => (
                <div
                  key={r.id}
                  className="p-5 rounded-2xl bg-surface-cream border border-border-soft/30 flex flex-col justify-between gap-4"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-epilogue text-base font-bold text-on-surface uppercase">
                          {r.name}
                        </span>
                        {r.is_system && (
                          <span className="px-2 py-0.5 rounded-full bg-primary-container text-on-primary text-[10px] font-semibold">
                            Role Sistem
                          </span>
                        )}
                      </div>
                      {!r.is_system && (
                        <button
                          onClick={() => handleDeleteRole(r)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      {r.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-border-soft/20 flex items-center justify-between text-xs text-on-surface-variant">
                    <span>
                      Permissions: <code className="bg-white px-2 py-0.5 rounded text-primary font-mono">{r.permissions}</code>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: CRUD Berita */}
        {activeTab === "news" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-border-soft/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-epilogue text-xl font-bold text-on-surface">Manajemen Berita &amp; Artikel</h2>
                <p className="text-xs text-on-surface-variant">
                  Berita berstatus published otomatis tampil langsung pada halaman depan landing page
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative w-full sm:w-60">
                  <input
                    type="text"
                    placeholder="Cari berita..."
                    value={newsSearch}
                    onChange={(e) => setNewsSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-surface-cream text-xs text-on-surface border border-border-soft/40 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-3" />
                </div>

                <button
                  onClick={() => openNewsModal()}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-primary text-white text-xs font-semibold shadow hover:bg-on-surface transition-all shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Berita</span>
                </button>
              </div>
            </div>

            {loading ? (
              <div className="py-12 flex justify-center items-center gap-2 text-primary text-sm">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Memuat data berita...</span>
              </div>
            ) : filteredNews.length === 0 ? (
              <div className="py-12 text-center text-xs text-on-surface-variant">
                Belum ada artikel berita. Klik &ldquo;Tambah Berita&rdquo; untuk membuat berita pertama.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNews.map((item) => (
                  <div
                    key={item.id}
                    className="bg-surface-cream rounded-2xl overflow-hidden border border-border-soft/30 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div>
                      <div className="relative w-full h-40 bg-surface-container">
                        <Image
                          src={item.thumbnail_path || "/images/news-1.svg"}
                          alt={item.title}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                        <span
                          className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === "published"
                              ? "bg-emerald-600 text-white"
                              : "bg-amber-500 text-white"
                          }`}
                        >
                          {item.status === "published" ? "Published" : "Draft"}
                        </span>
                      </div>
                      <div className="p-4 flex flex-col gap-2">
                        <h3 className="font-epilogue text-sm font-bold text-on-surface line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-xs text-on-surface-variant line-clamp-3 leading-relaxed">
                          {item.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 pt-0 border-t border-border-soft/20 mt-2 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-on-surface-variant">
                        {new Date(item.created_at).toLocaleDateString("id-ID")}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openNewsModal(item)}
                          className="p-1.5 rounded-lg text-primary hover:bg-surface-mint-subtle transition-colors"
                          title="Ubah Berita"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteNews(item)}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                          title="Hapus Berita"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Keamanan & Ganti Password */}
        {activeTab === "security" && (
          <div className="max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-border-soft/40">
            <div className="flex items-start gap-4 mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Peringatan Keamanan Penting:</p>
                <p className="mt-1">
                  Akun awal administrator dibuat dengan password bawaan <code>123456</code>. Pastikan Anda segera memperbarui password akun administrator dengan kombinasi yang kuat sebelum website dideploy ke production.
                </p>
              </div>
            </div>

            <h2 className="font-epilogue text-xl font-bold text-on-surface mb-2">
              Perbarui Kata Sandi Administrator
            </h2>
            <p className="text-xs text-on-surface-variant mb-6">
              Password baru akan di-hash secara aman menggunakan bcrypt sebelum disimpan.
            </p>

            <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface">Password Saat Ini</label>
                <input
                  type="password"
                  required
                  placeholder="Masukkan password saat ini (default: 123456)"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-cream text-xs text-on-surface border border-border-soft/40 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface">Password Baru</label>
                <input
                  type="password"
                  required
                  placeholder="Minimal 6 karakter"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-cream text-xs text-on-surface border border-border-soft/40 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface">Konfirmasi Password Baru</label>
                <input
                  type="password"
                  required
                  placeholder="Ulangi password baru"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-cream text-xs text-on-surface border border-border-soft/40 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <button
                type="submit"
                disabled={passLoading}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-semibold text-xs shadow hover:bg-on-surface transition-all disabled:opacity-60 mt-2"
              >
                {passLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                <span>Simpan Password Baru</span>
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Modal Batal Pesanan */}
      {cancelModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-border-soft/40 animate-in zoom-in-95 duration-200">
            <h3 className="font-epilogue text-lg font-bold text-on-surface mb-2">
              Batalkan Pesanan #{cancelModalOrder.order_code}?
            </h3>
            <p className="text-xs text-on-surface-variant mb-4">
              Pemesan: <b>{cancelModalOrder.customer_name}</b> ({cancelModalOrder.customer_phone})
            </p>

            <form onSubmit={handleCancelOrderSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface">Alasan Pembatalan</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Contoh: Meja penuh di jam tersebut / bahan baku habis / stok frozen pack habis..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-cream text-xs text-on-surface border border-border-soft/40 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCancelModalOrder(null)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-on-surface-variant hover:bg-surface-cream transition-colors"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow transition-all"
                >
                  Konfirmasi Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tambah/Edit Berita */}
      {newsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-border-soft/40 animate-in zoom-in-95 duration-200">
            <h3 className="font-epilogue text-lg font-bold text-on-surface mb-4">
              {editingNews ? "Ubah Berita" : "Tulis Berita Baru"}
            </h3>

            <form onSubmit={handleSaveNews} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface">Judul Berita</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rahasia Teknik Slow-Roast..."
                  value={newsForm.title}
                  onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-cream text-xs text-on-surface border border-border-soft/40 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface">Thumbnail Gambar</label>
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-14 rounded-xl overflow-hidden bg-surface-container border border-border-soft shrink-0">
                    <Image
                      src={newsForm.thumbnail_path || "/images/news-1.svg"}
                      alt="Preview"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface-cream hover:bg-surface-mint-subtle text-xs font-semibold text-primary border border-border-soft/40 cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? "Mengunggah..." : "Unggah Gambar"}</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface">Ringkasan (Excerpt)</label>
                <textarea
                  rows={2}
                  placeholder="Ringkasan singkat yang memikat pembaca..."
                  value={newsForm.excerpt}
                  onChange={(e) => setNewsForm({ ...newsForm, excerpt: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-cream text-xs text-on-surface border border-border-soft/40 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface">Konten Lengkap</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Isi narasi berita selengkapnya..."
                  value={newsForm.content}
                  onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-cream text-xs text-on-surface border border-border-soft/40 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface">Status Publikasi</label>
                <select
                  value={newsForm.status}
                  onChange={(e) => setNewsForm({ ...newsForm, status: e.target.value as any })}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-cream text-xs text-on-surface border border-border-soft/40 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="published">Published (Tampil di Landing Page)</option>
                  <option value="draft">Draft (Disimpan Sementara)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-soft/30">
                <button
                  type="button"
                  onClick={() => setNewsModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-on-surface-variant hover:bg-surface-cream transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-primary text-white text-xs font-semibold shadow hover:bg-on-surface transition-all"
                >
                  Simpan Berita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tambah Role */}
      {roleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-border-soft/40 animate-in zoom-in-95 duration-200">
            <h3 className="font-epilogue text-lg font-bold text-on-surface mb-4">Tambah Role Kustom</h3>

            <form onSubmit={handleSaveRole} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface">Nama Role</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: staff_dapur, kasir"
                  value={roleForm.name}
                  onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-cream text-xs text-on-surface border border-border-soft/40 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface">Deskripsi</label>
                <textarea
                  rows={2}
                  placeholder="Tugas dan batasan wewenang role..."
                  value={roleForm.description}
                  onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-cream text-xs text-on-surface border border-border-soft/40 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface">Hak Akses (Permissions)</label>
                <input
                  type="text"
                  placeholder="Contoh: read,order,kitchen"
                  value={roleForm.permissions}
                  onChange={(e) => setRoleForm({ ...roleForm, permissions: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-cream text-xs text-on-surface border border-border-soft/40 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-soft/30">
                <button
                  type="button"
                  onClick={() => setRoleModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-on-surface-variant hover:bg-surface-cream transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-primary text-white text-xs font-semibold shadow hover:bg-on-surface transition-all"
                >
                  Simpan Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
