import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string;
  is_system: boolean;
  created_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role_id: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail_path: string;
  status: "published" | "draft";
  author_id: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
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
  updated_at: string;
}

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;
const APPS_SCRIPT_SECRET = process.env.APPS_SCRIPT_SECRET;

// Path penyimpanan lokal otomatis jika Apps Script belum dikonfigurasi
const LOCAL_DATA_DIR = path.join(process.cwd(), ".data");
const LOCAL_DB_FILE = path.join(LOCAL_DATA_DIR, "db.json");

interface DatabaseSchema {
  Roles: Role[];
  Users: User[];
  News: NewsItem[];
  Orders: OrderItem[];
}

const initialSeedData: DatabaseSchema = {
  Roles: [
    {
      id: "role-admin",
      name: "admin",
      description: "Administrator Utama dengan akses penuh",
      permissions: "all",
      is_system: true,
      created_at: new Date().toISOString(),
    },
    {
      id: "role-user",
      name: "user",
      description: "Pengguna terdaftar / Pelanggan",
      permissions: "read,order",
      is_system: true,
      created_at: new Date().toISOString(),
    },
  ],
  Users: [
    {
      id: "user-admin-default",
      name: "Admin Duck Duck Cook",
      email: "admin@gmail.com",
      password_hash: "$2b$10$DfqWsVekSTQJqbZWZJk.4uT5HO5b5FHXl7eGXirJgay98UsVwPk4m", // hash dari "123456"
      role_id: "role-admin",
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  News: [
    {
      id: "news-1",
      title: "Rahasia Kulit Bebek Crispy dengan Teknik Slow-Roast 6 Jam",
      slug: "rahasia-kulit-bebek-crispy-slow-roast",
      excerpt:
        "Mengapa suhu pemanggangan bertahap dan pengeringan kulit selama semalam menjadi kunci kelezatan yang membedakan bebek artisanal kami.",
      content:
        "Setiap bebek dipersiapkan melalui proses marinasi basah 24 jam dengan rempah alami lokal, dikeringkan perlahan di ruang khusus bersuhu terkontrol, kemudian dipanggang lambat selama 6 jam untuk menciptakan keseimbangan magis antara kerenyahan kulit dan kelembutan daging.",
      thumbnail_path: "/images/news-1.svg",
      status: "published",
      author_id: "user-admin-default",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "news-2",
      title: "DUCK DUCK COOK Membuka Cabang Flagship Baru di Jakarta Selatan",
      slug: "duck-duck-cook-ekspansi-cabang-jakarta-selatan",
      excerpt:
        "Menjawab antusiasme para pecinta kuliner di ibukota, kami menghadirkan gerai flagship berkonsep open kitchen dengan area dining semi-outdoor yang asri.",
      content:
        "Berawal dari merintis di pinggir jalan, kini DUCK DUCK COOK resmi hadir di pusat kuliner Senopati, Kebayoran Baru, Jakarta Selatan. Gerai flagship ini menawarkan fasilitas parkir luas, ruang VIP eksklusif, serta area dapur terbuka di mana pengunjung dapat menyaksikan langsung keahlian memanggang bebek.",
      thumbnail_path: "/images/news-2.svg",
      status: "published",
      author_id: "user-admin-default",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "news-3",
      title: "Pilihan Menu Sehat: Olahan Bebek Rendah Lemak Kaya Nutrisi",
      slug: "pilihan-menu-sehat-bebek-rendah-lemak",
      excerpt:
        "Mematahkan mitos bahwa daging bebek selalu berlemak tinggi. Pelajari proses rendemen lemak alami selama pemanggangan yang mempertahankan nutrisi penting.",
      content:
        "Banyak yang mengira daging bebek selalu tinggi lemak jenuh. Dengan teknik pemanggangan khusus kami, lemak berlebih mencair secara alami (fat rendering) sambil tetap mengunci kadar zat besi, protein tinggi, dan rasa gurih alami rempah.",
      thumbnail_path: "/images/news-3.svg",
      status: "published",
      author_id: "user-admin-default",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  Orders: [
    {
      id: "order-demo-1",
      order_code: "DDC-1001",
      user_id: "user-admin-default",
      customer_name: "Rian Pratama",
      customer_phone: "081234567890",
      order_type: "dine_in",
      items_summary: "Reservasi Meja VIP + 1 Ekor Bebek Panggang Utuh",
      total_amount: 245000,
      reservation_date: "2026-11-15",
      reservation_time: "19:00",
      pax_or_quantity: 4,
      delivery_address: "",
      notes: "Meja dekat jendela bila tersedia",
      status: "menunggu_konfirmasi",
      admin_notes: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
};

async function getLocalDb(): Promise<DatabaseSchema> {
  try {
    await fs.mkdir(LOCAL_DATA_DIR, { recursive: true });
    const content = await fs.readFile(LOCAL_DB_FILE, "utf-8");
    const parsed = JSON.parse(content);
    if (!parsed.Orders) {
      parsed.Orders = initialSeedData.Orders;
      await fs.writeFile(LOCAL_DB_FILE, JSON.stringify(parsed, null, 2), "utf-8");
    }
    return parsed;
  } catch {
    await fs.writeFile(LOCAL_DB_FILE, JSON.stringify(initialSeedData, null, 2), "utf-8");
    return initialSeedData;
  }
}

async function saveLocalDb(data: DatabaseSchema) {
  await fs.mkdir(LOCAL_DATA_DIR, { recursive: true });
  await fs.writeFile(LOCAL_DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

/**
 * Memanggil Google Apps Script Web App jika URL tersedia,
 * atau beralih ke penyimpanan lokal jika URL belum diset.
 */
async function callAppsScript(payload: {
  action: string;
  table: string;
  data?: any;
  id?: string;
}) {
  if (APPS_SCRIPT_URL && APPS_SCRIPT_URL.startsWith("https://script.google.com")) {
    try {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: APPS_SCRIPT_SECRET,
          ...payload,
        }),
        cache: "no-store",
      });
      const json = await response.json();
      return json;
    } catch (err) {
      console.warn("Gagal menghubungi Google Apps Script, beralih ke mode lokal:", err);
    }
  }

  // Fallback lokal
  const db = await getLocalDb();
  const table = payload.table as keyof DatabaseSchema;
  if (!db[table]) {
    return { success: false, error: `Tabel ${payload.table} tidak ditemukan` };
  }

  const list = db[table] as any[];

  switch (payload.action) {
    case "list":
      return { success: true, data: list };

    case "findById": {
      const found = list.find((item) => String(item.id) === String(payload.id));
      return found
        ? { success: true, data: found }
        : { success: false, error: "Data tidak ditemukan" };
    }

    case "create": {
      const newItem = {
        id: payload.data?.id || crypto.randomUUID(),
        ...payload.data,
        created_at: payload.data?.created_at || new Date().toISOString(),
        updated_at: payload.data?.updated_at || new Date().toISOString(),
      };
      list.push(newItem);
      await saveLocalDb(db);
      return { success: true, data: newItem };
    }

    case "update": {
      const index = list.findIndex((item) => String(item.id) === String(payload.id));
      if (index === -1) {
        return { success: false, error: "Data tidak ditemukan untuk diubah" };
      }
      list[index] = {
        ...list[index],
        ...payload.data,
        updated_at: new Date().toISOString(),
      };
      await saveLocalDb(db);
      return { success: true, data: list[index] };
    }

    case "delete": {
      const initialLength = list.length;
      db[table] = list.filter((item) => String(item.id) !== String(payload.id)) as any;
      if (db[table].length === initialLength) {
        return { success: false, error: "Data tidak ditemukan untuk dihapus" };
      }
      await saveLocalDb(db);
      return { success: true, message: "Data berhasil dihapus" };
    }

    default:
      return { success: false, error: `Aksi ${payload.action} tidak didukung` };
  }
}

export const db = {
  async list<T>(table: string): Promise<T[]> {
    const res = await callAppsScript({ action: "list", table });
    return (res.success && Array.isArray(res.data) ? res.data : []) as T[];
  },

  async findById<T>(table: string, id: string): Promise<T | null> {
    const res = await callAppsScript({ action: "findById", table, id });
    return res.success ? (res.data as T) : null;
  },

  async create<T>(table: string, data: Partial<T>): Promise<T | null> {
    const res = await callAppsScript({ action: "create", table, data });
    return res.success ? (res.data as T) : null;
  },

  async update<T>(table: string, id: string, data: Partial<T>): Promise<T | null> {
    const res = await callAppsScript({ action: "update", table, id, data });
    return res.success ? (res.data as T) : null;
  },

  async delete(table: string, id: string): Promise<boolean> {
    const res = await callAppsScript({ action: "delete", table, id });
    return !!res.success;
  },
};

