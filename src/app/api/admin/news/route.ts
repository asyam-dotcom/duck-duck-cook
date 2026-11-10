import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db, NewsItem } from "@/lib/db";
import { deleteFile } from "@/lib/storage";

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return null;
  }
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ success: false, error: "Akses ditolak" }, { status: 403 });
  }

  const news = await db.list<NewsItem>("News");
  return NextResponse.json({ success: true, data: news });
}

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ success: false, error: "Akses ditolak" }, { status: 403 });
  }

  const body = await req.json();
  const { id, title, excerpt, content, thumbnail_path, status } = body;

  if (!title || !content) {
    return NextResponse.json(
      { success: false, error: "Judul dan konten berita wajib diisi" },
      { status: 400 }
    );
  }

  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

  // Update berita
  if (id) {
    const existing = await db.findById<NewsItem>("News", id);
    if (!existing) {
      return NextResponse.json({ success: false, error: "Berita tidak ditemukan" }, { status: 404 });
    }

    const updated = await db.update<NewsItem>("News", id, {
      title,
      slug,
      excerpt: excerpt || content.substring(0, 160) + "...",
      content,
      thumbnail_path: thumbnail_path || existing.thumbnail_path,
      status: status === "draft" ? "draft" : "published",
    });

    return NextResponse.json({ success: true, data: updated });
  }

  // Buat berita baru
  const newNews = await db.create<NewsItem>("News", {
    title,
    slug,
    excerpt: excerpt || content.substring(0, 160) + "...",
    content,
    thumbnail_path: thumbnail_path || "/images/news-1.svg",
    status: status === "draft" ? "draft" : "published",
    author_id: session.userId,
  });

  return NextResponse.json({ success: true, data: newNews });
}

export async function DELETE(req: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ success: false, error: "Akses ditolak" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ success: false, error: "ID berita wajib disertakan" }, { status: 400 });
  }

  const existing = await db.findById<NewsItem>("News", id);
  if (existing && existing.thumbnail_path) {
    // Bersihkan file thumbnail lokal jika ada di /uploads/
    await deleteFile(existing.thumbnail_path);
  }

  const success = await db.delete("News", id);
  return NextResponse.json({ success });
}

