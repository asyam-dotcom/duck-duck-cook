"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Calendar, ArrowRight, BookOpen, Loader2 } from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail_path: string;
  status: "published" | "draft";
  created_at?: string;
}

export default function News() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/news")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setNewsList(data.data);
        } else {
          // Fallback ke siteConfig.news jika database belum ada data
          setNewsList(
            siteConfig.news.map((item) => ({
              id: item.id,
              title: item.title,
              slug: item.slug,
              excerpt: item.excerpt,
              content: item.excerpt,
              thumbnail_path: item.image,
              status: "published",
              created_at: new Date().toISOString(),
            }))
          );
        }
      })
      .catch(() => {
        setNewsList(
          siteConfig.news.map((item) => ({
            id: item.id,
            title: item.title,
            slug: item.slug,
            excerpt: item.excerpt,
            content: item.excerpt,
            thumbnail_path: item.image,
            status: "published",
            created_at: new Date().toISOString(),
          }))
        );
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="berita" className="w-full py-20 lg:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="flex flex-col gap-3">
            <span className="text-xs text-primary font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-surface-mint-subtle w-fit border border-border-soft/40">
              Kabar & Berita
            </span>
            <h2 className="font-epilogue text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-on-surface">
              Cerita dari Dapur DUCK DUCK COOK
            </h2>
            <p className="text-base text-on-surface-variant max-w-xl">
              Inspirasi kuliner, catatan teknik masak artisanal, serta pembaruan kegiatan terbaru dapur kami langsung dari database.
            </p>
          </div>

          <Link
            href="/#berita"
            className="hidden md:inline-flex items-center gap-2 px-6 py-3 rounded-full bg-surface-cream text-primary text-sm font-semibold hover:bg-surface-mint-subtle transition-colors border border-border-soft/40"
          >
            <span>Semua Artikel</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3 Editorial Cards Grid */}
        {loading ? (
          <div className="py-16 flex items-center justify-center gap-2 text-primary text-sm">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Memuat artikel berita terbaru...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {newsList.slice(0, 3).map((post) => (
              <article
                key={post.id}
                className="bg-surface-cream rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group border border-border-soft/30 hover:-translate-y-1"
              >
                {/* Image & Category Pill */}
                <div className="w-full h-56 overflow-hidden bg-surface-container relative">
                  <Image
                    src={post.thumbnail_path || "/images/news-1.svg"}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm text-xs font-bold text-on-surface shadow-sm">
                    Inspirasi Kuliner
                  </span>
                </div>

                {/* Content Body */}
                <div className="p-6 flex flex-col flex-1 justify-between gap-6">
                  <div className="flex flex-col gap-3">
                    {/* Meta */}
                    <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        <time dateTime={post.created_at || new Date().toISOString()}>
                          {new Date(post.created_at || Date.now()).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </time>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-primary" />
                        <span>3-5 menit baca</span>
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-epilogue text-lg font-bold text-on-surface group-hover:text-primary transition-colors leading-snug">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-sm text-on-surface-variant line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary group-hover:underline">
                      <span>Baca Selengkapnya</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Mobile View All Button */}
        <div className="mt-10 flex justify-center md:hidden">
          <Link
            href="/#berita"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-primary-container text-on-primary text-sm font-semibold shadow-sm w-full"
          >
            <span>Semua Artikel</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
