import React from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ArrowRight, Tag } from "lucide-react";

export default function Services() {
  return (
    <section id="layanan" className="w-full py-20 lg:py-28 bg-surface-cream relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16 gap-3">
          <span className="text-xs text-primary font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-surface-mint-subtle border border-border-soft/40">
            Layanan & Solusi Kuliner
          </span>
          <h2 className="font-epilogue text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-on-surface">
            Pilihan Menikmati DUCK DUCK COOK
          </h2>
          <p className="text-base text-on-surface-variant">
            Dari santap santai keluarga, acara korporat berskala besar, hingga kepraktisan makan lezat di rumah setiap saat.
          </p>
        </div>

        {/* 4 Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {siteConfig.services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group border border-border-soft/30 hover:-translate-y-1"
            >
              <div className="flex flex-col gap-4">
                {/* Image */}
                <div className="w-full h-44 rounded-2xl overflow-hidden bg-surface-container relative">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Category Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-mint-subtle text-primary text-xs font-semibold w-fit border border-border-soft/30">
                  <Tag className="w-3.5 h-3.5" />
                  <span>{service.category}</span>
                </div>

                {/* Title */}
                <h3 className="font-epilogue text-lg font-bold text-on-surface group-hover:text-primary transition-colors leading-snug">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Bottom CTA Link */}
              <div className="pt-6 mt-4 border-t border-border-soft/20">
                <Link
                  href="#kontak"
                  className="inline-flex items-center justify-between w-full text-sm text-primary font-bold group-hover:underline"
                >
                  <span>{service.cta}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

