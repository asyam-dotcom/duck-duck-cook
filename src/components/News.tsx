"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Calendar, ArrowRight, BookOpen, Loader2, Sparkles, X, ChevronDown, ChevronUp } from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail_path: string;
  status: "published" | "draft";
  created_at?: string;
  updated_at?: string;
}

export default function News() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch("/api/news")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          // Pastikan selalu terurut dari tanggal terbaru
          const sorted = [...data.data].sort((a, b) => {
            const timeA = new Date(a.created_at || a.updated_at || 0).getTime();
            const timeB = new Date(b.created_at || b.updated_at || 0).getTime();
            return timeB - timeA;
          });
          setNewsList(sorted);
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

  const displayedNews = showAll ? newsList : newsList.slice(0, 3);

  const getThumbnailSrc = (post: NewsItem, index: number) => {
    if (imgErrors[post.id] || !post.thumbnail_path) {
      const fallbackSvgs = ["/images/news-1.svg", "/images/news-2.svg", "/images/news-3.svg"];
      return fallbackSvgs[index % fallbackSvgs.length];
    }
    return post.thumbnail_path;
  };

  return (
    <section id="berita" className="w-full py-20 lg:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="flex flex-col gap-3">
            <span className="text-xs text-primary font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-surface-mint-subtle w-fit border border-border-soft/40 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Kabar &amp; Berita Terbaru</span>
            </span>
            <h2 className="font-epilogue text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-on-surface">
              Cerita dari Dapur DUCK DUCK COOK
            </h2>
            <p className="text-base text-on-surface-variant max-w-xl">
              Inspirasi kuliner, rahasia teknik panggang lambat, serta kabar pembaruan menu artisanal terbaru langsung dari tim kami.
            </p>
          </div>

          {newsList.length > 3 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="hidden md:inline-flex items-center gap-2 px-6 py-3 rounded-full bg-surface-cream text-primary text-sm font-semibold hover:bg-surface-mint-subtle transition-colors border border-border-soft/40"
            >
              <span>{showAll ? "Tampilkan 3 Berita Saja" : `Lihat Semua Berita (${newsList.length})`}</span>
              {showAll ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="py-16 flex items-center justify-center gap-2 text-primary text-sm">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Memuat artikel berita terbaru dari Google Spreadsheet...</span>
          </div>
        ) : newsList.length === 0 ? (
          <div className="py-16 text-center text-on-surface-variant text-sm">
            Belum ada artikel berita yang dipublikasikan.
          </div>
        ) : (
          /* News Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedNews.map((post, index) => {
              const isNewest = index === 0;

              return (
                <article
                  key={post.id}
                  onClick={() => setSelectedArticle(post)}
                  className={`bg-surface-cream rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group border cursor-pointer hover:-translate-y-1 relative ${
                    isNewest
                      ? "border-primary/40 ring-1 ring-primary/20"
                      : "border-border-soft/30"
                  }`}
                >
                  {/* Image & Badges */}
                  <div className="w-full h-56 overflow-hidden bg-surface-container relative">
                    <Image
                      src={getThumbnailSrc(post, index)}
                      alt={post.title}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={() =>
                        setImgErrors((prev) => ({ ...prev, [post.id]: true }))
                      }
                    />

                    {/* Category Pill */}
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm text-xs font-bold text-on-surface shadow-sm">
                      Inspirasi Kuliner
                    </span>

                    {/* Badge Terbaru Khusus Artikel Pertama */}
                    {isNewest && (
                      <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary text-white text-xs font-extrabold shadow-md flex items-center gap-1 animate-pulse">
                        <Sparkles className="w-3 h-3" />
                        <span>Terbaru</span>
                      </span>
                    )}
                  </div>

                  {/* Content Body */}
                  <div className="p-6 flex flex-col flex-1 justify-between gap-6">
                    <div className="flex flex-col gap-3">
                      {/* Meta Information */}
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
                      <h3 className="font-epilogue text-lg font-bold text-on-surface group-hover:text-primary transition-colors leading-snug line-clamp-2">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-sm text-on-surface-variant line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-border-soft/20">
                      <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary group-hover:underline">
                        <span>Baca Selengkapnya</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Mobile View Toggle Button */}
        {newsList.length > 3 && (
          <div className="mt-10 flex justify-center md:hidden">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-primary-container text-on-primary text-sm font-semibold shadow-sm w-full"
            >
              <span>{showAll ? "Tampilkan 3 Berita Saja" : `Lihat Semua Berita (${newsList.length})`}</span>
              {showAll ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>

      {/* Modal Popup Baca Artikel Lengkap */}
      {selectedArticle && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setSelectedArticle(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-border-soft/60 flex flex-col relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Bar */}
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-border-soft/30 flex items-center justify-between">
              <span className="text-xs font-bold text-primary uppercase tracking-wider px-3 py-1 rounded-full bg-surface-mint-subtle">
                Kabar Restoran
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="w-9 h-9 rounded-full bg-surface-cream hover:bg-surface-mint-subtle text-on-surface flex items-center justify-center transition-colors"
                title="Tutup artikel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 flex flex-col gap-6">
              {/* Image banner */}
              <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden bg-surface-container">
                <Image
                  src={getThumbnailSrc(selectedArticle, 0)}
                  alt={selectedArticle.title}
                  fill
                  unoptimized
                  className="object-cover"
                  onError={() =>
                    setImgErrors((prev) => ({ ...prev, [selectedArticle.id]: true }))
                  }
                />
              </div>

              {/* Title & Metadata */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>
                      {new Date(
                        selectedArticle.created_at || Date.now()
                      ).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </span>
                  <span>•</span>
                  <span>Oleh Dapur DUCK DUCK COOK</span>
                </div>

                <h2 className="font-epilogue text-2xl sm:text-3xl font-bold text-on-surface leading-tight">
                  {selectedArticle.title}
                </h2>
              </div>

              {/* Excerpt callout */}
              {selectedArticle.excerpt && (
                <div className="p-4 rounded-2xl bg-surface-cream border-l-4 border-primary text-sm text-on-surface-variant italic leading-relaxed">
                  &ldquo;{selectedArticle.excerpt}&rdquo;
                </div>
              )}

              {/* Full Content */}
              <div className="text-sm sm:text-base text-on-surface leading-relaxed whitespace-pre-line space-y-4 font-normal">
                {selectedArticle.content || selectedArticle.excerpt}
              </div>

              {/* Modal Footer CTA */}
              <div className="pt-6 border-t border-border-soft/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-on-surface-variant text-center sm:text-left">
                  Ingin mencicipi menu unggulan kami?
                </p>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Link
                    href="/pesan"
                    onClick={() => setSelectedArticle(null)}
                    className="flex-1 sm:flex-none text-center px-6 py-2.5 rounded-full bg-primary text-white text-xs font-semibold hover:bg-on-surface transition-all shadow"
                  >
                    Pesan Meja / Menu
                  </Link>
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="px-5 py-2.5 rounded-full bg-surface-cream text-on-surface text-xs font-semibold hover:bg-surface-mint-subtle transition-colors border border-border-soft/40"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
