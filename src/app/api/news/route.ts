import { NextResponse } from "next/server";
import { db, NewsItem } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const news = await db.list<NewsItem>("News");
    
    // Filter hanya berita berstatus published dan urutkan dari yang paling baru
    const publishedNews = news
      .filter((item) => item.status === "published")
      .sort((a, b) => {
        const timeA = new Date(a.created_at || a.updated_at || 0).getTime();
        const timeB = new Date(b.created_at || b.updated_at || 0).getTime();
        return timeB - timeA; // Descending (terbaru di posisi pertama)
      });

    return NextResponse.json({ success: true, data: publishedNews });
  } catch (error) {
    console.error("Gagal memuat berita:", error);
    return NextResponse.json({ success: false, error: "Gagal memuat berita" }, { status: 500 });
  }
}
