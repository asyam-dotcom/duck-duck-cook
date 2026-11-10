import React from "react";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { ChefHat, Sparkles, ShieldCheck, Award } from "lucide-react";

export default function About() {
  const iconMap: Record<string, React.ReactNode> = {
    ChefHat: <ChefHat className="w-6 h-6 text-primary" />,
    Sparkles: <Sparkles className="w-6 h-6 text-primary" />,
    ShieldCheck: <ShieldCheck className="w-6 h-6 text-primary" />,
  };

  return (
    <section id="tentang-kami" className="w-full py-20 lg:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Narrative Storytelling */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider">
              <span className="w-8 h-[2px] bg-primary" />
              {siteConfig.about.badge}
            </div>

            <h2 className="font-epilogue text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-on-surface">
              {siteConfig.about.title}
            </h2>

            <p className="text-base text-on-surface-variant leading-relaxed">
              {siteConfig.about.story1}
            </p>

            <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
              {siteConfig.about.story2}
            </p>

            {/* 3 Key Strengths */}
            <div className="flex flex-col gap-4 pt-2">
              {siteConfig.about.highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-surface-cream hover:bg-surface-mint-subtle transition-colors duration-200 border border-border-soft/20"
                >
                  <div className="w-12 h-12 rounded-xl bg-surface-mint-tint flex items-center justify-center shrink-0">
                    {iconMap[item.icon] || <Sparkles className="w-6 h-6 text-primary" />}
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-base font-bold text-on-surface">
                      {item.title}
                    </h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual with Stat Badge */}
          <div className="lg:col-span-6 relative">
            <div className="relative w-full rounded-3xl overflow-hidden shadow-xl bg-surface-cream aspect-[4/5] border border-border-soft/40">
              <Image
                src={siteConfig.about.image}
                alt="Dedikasi Chef DUCK DUCK COOK dalam meracik bebek panggang artisanal"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Overlapping Stat Card */}
            <div className="absolute -bottom-8 -left-4 sm:-left-8 bg-white p-6 rounded-2xl shadow-xl max-w-xs sm:max-w-sm flex flex-col gap-2 border border-border-soft/40">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shrink-0 shadow-sm">
                  <Award className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <span className="font-epilogue text-xl sm:text-2xl font-bold text-primary">
                    {siteConfig.about.experienceYears}
                  </span>
                  <span className="text-xs font-semibold text-on-surface-variant">
                    {siteConfig.about.experienceSubtitle}
                  </span>
                </div>
              </div>
              <p className="text-xs text-on-surface-variant pt-2 leading-relaxed">
                Menjaga keaslian tradisi rempah sembari terus menyempurnakan teknik gastronomi modern untuk kepuasan pelanggan setia.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

