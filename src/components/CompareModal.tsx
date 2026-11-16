import React from 'react';
import { Product, Language } from '../types';
import { translations } from '../data/translations';
import { formatINR, calculateDiscount } from '../utils/formatters';
import { X, Check, Minus, ShoppingCart, Zap, Star } from 'lucide-react';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  language: Language;
  onRemoveFromCompare: (productId: string) => void;
  onAddToCart: (product: Product) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  products,
  language,
  onRemoveFromCompare,
  onAddToCart
}) => {
  const t = translations[language];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-ink/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-surface dark:bg-charcoal-800 border border-subtle rounded max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-subtle flex items-center justify-between">
          <div>
            <h2 className="text-base font-heading font-semibold text-ink dark:text-zinc-100">
              {language === 'hi' ? 'उत्पाद तुलना (3 तक)' : 'Product Comparison (Up to 3 Items)'}
            </h2>
            <p className="text-xs text-ink-muted dark:text-zinc-400">
              {language === 'hi'
                ? 'कीमत, स्थानीय डिलीवरी, रेटिंग और विशेषताओं की आमने-सामने तुलना करें'
                : 'Side-by-side comparison of prices, local delivery speeds, ratings, and features'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-ink-muted hover:text-ink dark:text-zinc-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Table */}
        <div className="p-4 sm:p-6 overflow-x-auto overflow-y-auto flex-1">
          {products.length === 0 ? (
            <div className="py-12 text-center text-xs text-ink-muted dark:text-zinc-400">
              {language === 'hi'
                ? 'तुलना के लिए कोई उत्पाद नहीं चुना गया। उत्पाद कार्ड्स पर "तुलना करें" पर क्लिक करें।'
                : 'No products selected for comparison. Add items using the compare option on product cards.'}
            </div>
          ) : (
            <div className="min-w-[600px]">
              <div className="grid grid-cols-4 gap-3 text-xs border-b border-subtle pb-4">
                <div className="font-semibold text-ink-muted dark:text-zinc-400 self-end pb-2">
                  Feature
                </div>
                {products.map((p) => (
                  <div key={p.id} className="relative space-y-2 text-center">
                    <button
                      onClick={() => onRemoveFromCompare(p.id)}
                      className="absolute -top-1 right-0 p-1 text-ink-muted hover:text-brick"
                      title="Remove from comparison"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-24 h-24 object-cover mx-auto rounded border border-subtle"
                    />
                    <h4 className="font-semibold text-ink dark:text-zinc-200 line-clamp-2 leading-tight">
                      {language === 'hi' ? p.nameHi : p.name}
                    </h4>
                    <button
                      onClick={() => onAddToCart(p)}
                      className="w-full py-1.5 bg-slate-deep hover:bg-slate-hover text-white text-[10px] font-semibold uppercase tracking-wider rounded flex items-center justify-center gap-1"
                    >
                      <ShoppingCart className="w-3 h-3 text-brass" />
                      <span>{t.addToCart}</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Rows */}
              <div className="divide-y divide-subtle text-xs">
                {/* Price */}
                <div className="grid grid-cols-4 gap-3 py-3 items-center">
                  <span className="font-semibold text-ink-muted">Price (GST Inc.)</span>
                  {products.map(p => (
                    <div key={p.id} className="text-center font-bold text-slate-deep dark:text-brass text-sm">
                      {formatINR(p.price)}
                      <span className="text-[10px] text-ink-light line-through ml-1 font-normal">{formatINR(p.mrp)}</span>
                    </div>
                  ))}
                </div>

                {/* Discount */}
                <div className="grid grid-cols-4 gap-3 py-3 items-center">
                  <span className="font-semibold text-ink-muted">Discount</span>
                  {products.map(p => (
                    <div key={p.id} className="text-center text-brick font-semibold">
                      {calculateDiscount(p.price, p.mrp)}% OFF
                    </div>
                  ))}
                </div>

                {/* Rating */}
                <div className="grid grid-cols-4 gap-3 py-3 items-center">
                  <span className="font-semibold text-ink-muted">Rating</span>
                  {products.map(p => (
                    <div key={p.id} className="text-center flex items-center justify-center gap-1 font-semibold text-amber-700 dark:text-brass">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{p.rating} ({p.reviewCount})</span>
                    </div>
                  ))}
                </div>

                {/* Local Store Same-Day */}
                <div className="grid grid-cols-4 gap-3 py-3 items-center">
                  <span className="font-semibold text-ink-muted">Same-Day Local</span>
                  {products.map(p => (
                    <div key={p.id} className="text-center">
                      {p.isLocalStore ? (
                        <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center justify-center gap-1">
                          <Zap className="w-3.5 h-3.5" />
                          <span>Same-Day (Local)</span>
                        </span>
                      ) : (
                        <span className="text-ink-muted">2-3 Days Standard</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Bhaav-Taav Eligible */}
                <div className="grid grid-cols-4 gap-3 py-3 items-center">
                  <span className="font-semibold text-ink-muted">Bhaav-Taav Bargain</span>
                  {products.map(p => (
                    <div key={p.id} className="text-center font-semibold text-brass">
                      Available (Reserve {formatINR(p.minBhaavPrice)})
                    </div>
                  ))}
                </div>

                {/* Brand */}
                <div className="grid grid-cols-4 gap-3 py-3 items-center">
                  <span className="font-semibold text-ink-muted">Brand</span>
                  {products.map(p => (
                    <div key={p.id} className="text-center font-medium text-ink dark:text-zinc-200">
                      {p.brand}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-subtle flex justify-end">
          <button
            onClick={onClose}
            className="py-1.5 px-4 bg-concrete hover:bg-zinc-200 dark:bg-charcoal-700 text-ink dark:text-zinc-200 text-xs font-semibold uppercase rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
