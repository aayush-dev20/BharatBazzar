import React, { useState, useEffect } from 'react';
import { Product, Language } from '../types';
import { translations } from '../data/translations';
import { formatINR, calculateDiscount, calculateEMI } from '../utils/formatters';
import { Clock, Zap, ArrowRight, Sparkles } from 'lucide-react';

interface DealOfTheDayProps {
  product: Product;
  language: Language;
  onSelectProduct: (product: Product) => void;
  onOpenBhaav: (product: Product) => void;
}

export const DealOfTheDay: React.FC<DealOfTheDayProps> = ({
  product,
  language,
  onSelectProduct,
  onOpenBhaav
}) => {
  const t = translations[language];

  // Countdown timer for Deal of the Day (ticking down towards midnight)
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 7,
    minutes: 42,
    seconds: 19
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const discount = calculateDiscount(product.price, product.mrp);
  const emi = calculateEMI(product.price, 6);

  const formatDigits = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="bg-surface dark:bg-charcoal-800 border-2 border-brass/50 rounded p-5 sm:p-6 relative overflow-hidden">
        {/* Top Header Row with Countdown */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-subtle">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brick animate-ping" />
            <h3 className="text-base sm:text-lg font-heading font-bold text-ink dark:text-zinc-100 flex items-center gap-1.5">
              <span>{t.dealOfTheDay}</span>
            </h3>
            <span className="text-[11px] font-semibold uppercase bg-brick text-white px-2 py-0.5 rounded">
              {discount}% {t.off}
            </span>
          </div>

          {/* Countdown Clock Display */}
          <div className="flex items-center gap-2 bg-concrete dark:bg-charcoal-700 px-3 py-1.5 rounded border border-subtle">
            <Clock className="w-4 h-4 text-brass" />
            <span className="text-xs text-ink-muted dark:text-zinc-400 font-medium">
              {t.dealEndsIn}:
            </span>
            <div className="flex items-center gap-1 font-mono text-xs font-bold text-slate-deep dark:text-brass">
              <span className="bg-surface dark:bg-charcoal-800 px-1.5 py-0.5 rounded border border-subtle">
                {formatDigits(timeLeft.hours)}
              </span>
              <span>:</span>
              <span className="bg-surface dark:bg-charcoal-800 px-1.5 py-0.5 rounded border border-subtle">
                {formatDigits(timeLeft.minutes)}
              </span>
              <span>:</span>
              <span className="bg-surface dark:bg-charcoal-800 px-1.5 py-0.5 rounded border border-subtle">
                {formatDigits(timeLeft.seconds)}
              </span>
            </div>
          </div>
        </div>

        {/* Product Details Grid */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-4 cursor-pointer" onClick={() => onSelectProduct(product)}>
            <div className="relative aspect-square sm:aspect-video md:aspect-square rounded border border-subtle overflow-hidden bg-concrete dark:bg-charcoal-900 group">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              {product.isLocalStore && (
                <span className="absolute top-2 left-2 bg-slate-deep text-white text-[10px] font-semibold px-2 py-0.5 rounded border border-brass">
                  ⚡ {language === 'hi' ? 'स्थानीय स्टोर' : 'Local Store'}
                </span>
              )}
            </div>
          </div>

          <div className="md:col-span-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs text-ink-muted dark:text-zinc-400 mb-1">
                <span className="font-medium text-brass">★ {product.rating}</span>
                <span>({product.reviewCount} {language === 'hi' ? 'समीक्षाएं' : 'reviews'})</span>
                <span>•</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                  {t.onlyLeft.replace('{count}', product.stock.toString())}
                </span>
              </div>

              <h4
                onClick={() => onSelectProduct(product)}
                className="text-base sm:text-xl font-heading font-bold text-ink dark:text-zinc-100 hover:text-brass cursor-pointer transition"
              >
                {language === 'hi' ? product.nameHi : product.name}
              </h4>

              <p className="mt-2 text-xs sm:text-sm text-ink-muted dark:text-zinc-300 line-clamp-2">
                {language === 'hi' ? product.descriptionHi : product.description}
              </p>

              {/* Price & EMI block */}
              <div className="mt-4 flex flex-wrap items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-heading font-bold text-slate-deep dark:text-brass">
                  {formatINR(product.price)}
                </span>
                <span className="text-sm text-ink-light dark:text-zinc-500 line-through">
                  {formatINR(product.mrp)}
                </span>
                <span className="text-xs font-semibold text-brick">
                  {discount}% {t.off}
                </span>
                <span className="text-[11px] text-ink-muted dark:text-zinc-400">
                  ({t.inclGst})
                </span>
              </div>

              <p className="mt-1 text-xs text-ink-muted dark:text-zinc-400">
                {t.emiFrom} <span className="font-semibold text-ink dark:text-zinc-200">{formatINR(emi)}/{t.month}</span> • Standard Plan
              </p>
            </div>

            {/* Actions */}
            <div className="mt-5 pt-4 border-t border-subtle flex flex-wrap items-center gap-3">
              <button
                onClick={() => onSelectProduct(product)}
                className="py-2.5 px-5 bg-slate-deep hover:bg-slate-hover text-white text-xs font-semibold tracking-wider uppercase rounded flex items-center gap-2 transition"
              >
                <span>{language === 'hi' ? 'डील देखें और खरीदें' : 'View Deal & Buy'}</span>
                <ArrowRight className="w-4 h-4 text-brass" />
              </button>

              <button
                onClick={() => onOpenBhaav(product)}
                className="py-2.5 px-4 bg-brass-light hover:bg-brass/25 dark:bg-charcoal-700 border border-brass/50 text-slate-deep dark:text-brass text-xs font-semibold tracking-wider uppercase rounded flex items-center gap-1.5 transition"
              >
                <Sparkles className="w-4 h-4 text-brass" />
                <span>{t.makeAnOffer}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
