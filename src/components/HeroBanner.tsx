import React from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { ArrowRight, Tag, Zap, Gift, ShieldCheck } from 'lucide-react';

interface HeroBannerProps {
  language: Language;
  onExploreLocal: () => void;
  onOpenScratchHub: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  language,
  onExploreLocal,
  onOpenScratchHub
}) => {
  const t = translations[language];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Main Architectural Hero Tile (8 cols) */}
        <div className="lg:col-span-8 bg-surface dark:bg-charcoal-800 border border-subtle rounded p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle geometric line accents */}
          <div className="absolute top-0 right-0 w-32 h-32 border-b border-l border-brass/20 pointer-events-none" />
          <div className="absolute bottom-0 right-8 w-48 h-48 border-t border-l border-brass/10 pointer-events-none" />

          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-brass/15 border border-brass/30 rounded text-[11px] font-semibold tracking-wider uppercase text-brass-dark dark:text-brass mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-brass" />
              <span>{language === 'hi' ? 'भारतीय मार्केटप्लेस' : 'Authentic Indian Commerce'}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-heading font-bold text-ink dark:text-zinc-100 tracking-tight leading-tight">
              {t.heroTitle}
            </h1>

            <p className="mt-3 text-xs sm:text-sm text-ink-muted dark:text-zinc-300 leading-relaxed">
              {t.heroSubtitle}
            </p>

            {/* Feature Pills */}
            <div className="mt-5 flex flex-wrap gap-2 text-[11px]">
              <span className="px-2.5 py-1 bg-concrete dark:bg-charcoal-700 border border-subtle rounded text-ink dark:text-zinc-200 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-brass" />
                <span>{language === 'hi' ? 'भाव-ताव मोलभाव' : 'Bhaav-Taav Bargaining'}</span>
              </span>
              <span className="px-2.5 py-1 bg-concrete dark:bg-charcoal-700 border border-subtle rounded text-ink dark:text-zinc-200 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{language === 'hi' ? 'स्थानीय उसी दिन डिलीवरी' : 'Local Same-Day Dispatch'}</span>
              </span>
              <span className="px-2.5 py-1 bg-concrete dark:bg-charcoal-700 border border-subtle rounded text-ink dark:text-zinc-200 flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5 text-brass" />
                <span>{language === 'hi' ? 'ब्रांड प्रायोजित स्क्रैच कार्ड्स' : 'Sponsored Scratch Cards'}</span>
              </span>
            </div>
          </div>

          <div className="relative z-10 mt-6 pt-5 border-t border-subtle flex flex-wrap items-center gap-3">
            <button
              onClick={onExploreLocal}
              className="py-2.5 px-5 bg-slate-deep hover:bg-slate-hover text-white text-xs font-semibold tracking-wider uppercase rounded flex items-center gap-2 transition"
            >
              <span>{t.exploreLocal}</span>
              <ArrowRight className="w-4 h-4 text-brass" />
            </button>
            <button
              onClick={onOpenScratchHub}
              className="py-2.5 px-4 bg-concrete hover:bg-zinc-200 dark:bg-charcoal-700 dark:hover:bg-charcoal-600 text-ink dark:text-zinc-200 text-xs font-semibold tracking-wider uppercase rounded border border-subtle transition flex items-center gap-2"
            >
              <Gift className="w-4 h-4 text-brass" />
              <span>{t.scratchAndWin}</span>
            </button>
          </div>
        </div>

        {/* Right Promo Tiles (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Promo Tile 1: Local Stores Fast Track */}
          <div
            onClick={onExploreLocal}
            className="group cursor-pointer flex-1 bg-surface dark:bg-charcoal-800 border border-subtle hover:border-brass/70 rounded p-5 flex flex-col justify-between transition"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  ⚡ {language === 'hi' ? 'स्थानीय एक्सप्रेस' : 'Local Express'}
                </span>
                <span className="text-ink-muted dark:text-zinc-400 text-[11px]">4 hrs</span>
              </div>
              <h2 className="text-sm font-heading font-semibold text-ink dark:text-zinc-100 group-hover:text-brass transition">
                {t.promo1Title}
              </h2>
              <p className="text-xs text-ink-muted dark:text-zinc-400 mt-1">
                {t.promo1Subtitle}
              </p>
            </div>
            <div className="mt-3 flex items-center text-xs font-medium text-slate-deep dark:text-brass gap-1">
              <span>{language === 'hi' ? 'स्टोर खोजें' : 'Check nearby stores'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Promo Tile 2: Brand Scratch Pool */}
          <div
            onClick={onOpenScratchHub}
            className="group cursor-pointer flex-1 bg-brass-light/40 dark:bg-charcoal-800 border border-brass/40 hover:border-brass rounded p-5 flex flex-col justify-between transition"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-brass-dark dark:text-brass bg-brass/20 px-2 py-0.5 rounded">
                  ★ {language === 'hi' ? 'ब्रांड्स द्वारा प्रायोजित' : 'Brand Sponsored'}
                </span>
                <span className="font-mono text-xs font-bold text-slate-deep dark:text-brass">Up to ₹250</span>
              </div>
              <h2 className="text-sm font-heading font-semibold text-ink dark:text-zinc-100 group-hover:text-brass transition">
                {t.promo2Title}
              </h2>
              <p className="text-xs text-ink-muted dark:text-zinc-400 mt-1">
                {t.promo2Subtitle}
              </p>
            </div>
            <div className="mt-3 flex items-center text-xs font-medium text-slate-deep dark:text-brass gap-1">
              <span>{language === 'hi' ? 'अभी कार्ड स्क्रैच करें' : 'Scratch reward cards'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
