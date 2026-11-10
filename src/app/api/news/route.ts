import { NextResponse } from "next/server";
import { db, NewsItem } from "@/lib/db";

export async function GET() {
  const news = await db.list<NewsItem>("News");
  const publishedNews = news.filter((item) => item.status === "published");
  return NextResponse.json({ success: true, data: publishedNews });
}

