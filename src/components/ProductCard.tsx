import React from 'react';
import { Product, Language } from '../types';
import { translations } from '../data/translations';
import { formatINR, calculateDiscount, calculateEMI, getDeliveryEstimate } from '../utils/formatters';
import { isValidPincode } from '../utils/pincodes';
import { Heart, Tag, Star, Zap, Layers, Flame } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  language: Language;
  pincode: string;
  isWishlisted: boolean;
  isInCompare: boolean;
  isLiteMode?: boolean;
  onToggleWishlist: (productId: string) => void;
  onToggleCompare: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onOpenBhaav: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  language,
  pincode,
  isWishlisted,
  isInCompare,
  isLiteMode = false,
  onToggleWishlist,
  onToggleCompare,
  onSelectProduct,
  onOpenBhaav
}) => {
  const t = translations[language];
  const discount = calculateDiscount(product.price, product.mrp);
  const emi = calculateEMI(product.price, 6);
  const hasValidPin = isValidPincode(pincode);
  const delivery = getDeliveryEstimate(product.isLocalStore, hasValidPin, language);

  return (
    <div className="group relative bg-surface dark:bg-charcoal-800 border border-subtle hover:border-brass/70 rounded transition flex flex-col justify-between overflow-hidden">
      {/* Top Image Container */}
      <div
        className="relative aspect-square overflow-hidden bg-concrete dark:bg-charcoal-900 cursor-pointer"
        onClick={() => onSelectProduct(product)}
      >
        {isLiteMode ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-concrete/80 dark:bg-charcoal-900 text-center space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-widest text-ink-muted">
              [2G/3G Text Mode]
            </span>
            <span className="font-heading font-bold text-slate-deep dark:text-brass text-xs line-clamp-2">
              {language === 'hi' ? product.nameHi : product.name}
            </span>
            <span className="text-[10px] text-ink-muted">{product.brand}</span>
          </div>
        ) : (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            loading="lazy"
          />
        )}

        {/* Top-Right Action Stack */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            className="p-1.5 bg-surface/90 dark:bg-charcoal-800/90 hover:bg-surface border border-subtle rounded text-ink-muted hover:text-brick transition"
            aria-label="Wishlist"
          >
            <Heart
              className={`w-4 h-4 ${isWishlisted ? 'fill-brick text-brick' : 'text-ink-muted dark:text-zinc-400'}`}
            />
          </button>

          {/* Compare Toggle Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(product);
            }}
            className={`p-1.5 bg-surface/90 dark:bg-charcoal-800/90 border border-subtle rounded transition ${
              isInCompare ? 'text-brass border-brass' : 'text-ink-muted hover:text-ink'
            }`}
            title={isInCompare ? 'Remove from compare' : 'Add to compare'}
          >
            <Layers className="w-4 h-4" />
          </button>
        </div>

        {/* Local Store Flag Badge */}
        {product.isLocalStore && (
          <div className="absolute top-2.5 left-2.5 bg-slate-deep/90 text-white text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded border border-brass flex items-center gap-1">
            <Zap className="w-3 h-3 text-brass" />
            <span>Local Store</span>
          </div>
        )}

        {/* Flash Sale or Discount Tag */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1">
          {discount > 0 && (
            <span className="bg-brick text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              {discount}% OFF
            </span>
          )}
          {product.isFlashSale && (
            <span className="bg-amber-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <Flame className="w-3 h-3" />
              <span>Flash</span>
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          {/* Brand & Rating Row */}
          <div className="flex items-center justify-between mb-1 text-[11px]">
            <span className="font-semibold text-ink-muted uppercase tracking-wider text-[10px]">
              {product.brand}
            </span>
            <span className="flex items-center gap-0.5 font-bold text-amber-700 dark:text-brass bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.2 rounded">
              <Star className="w-3 h-3 fill-current" />
              <span>{product.rating}</span>
              <span className="text-ink-muted font-normal text-[10px]">({product.reviewCount})</span>
            </span>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onSelectProduct(product)}
            className="text-xs sm:text-sm font-heading font-semibold text-ink dark:text-zinc-100 hover:text-brass transition line-clamp-2 cursor-pointer leading-snug"
          >
            {language === 'hi' ? product.nameHi : product.name}
          </h3>

          {/* Variants pill summary */}
          {product.variants && product.variants.length > 0 && (
            <div className="mt-1 flex gap-1 text-[10px] text-ink-muted">
              <span>{product.variants.length} options available</span>
            </div>
          )}

          {/* Price Row */}
          <div className="mt-2 flex items-baseline gap-2 flex-wrap">
            <span className="text-base sm:text-lg font-heading font-bold text-slate-deep dark:text-brass">
              {formatINR(product.price)}
            </span>
            {product.mrp > product.price && (
              <span className="text-xs text-ink-light line-through">
                {formatINR(product.mrp)}
              </span>
            )}
            <span className="text-[10px] text-ink-muted">
              incl. GST
            </span>
          </div>

          {/* EMI Calculation */}
          <p className="text-[11px] text-ink-muted dark:text-zinc-400 mt-0.5">
            EMI from <span className="font-semibold text-ink dark:text-zinc-300">{formatINR(emi)}/mo</span>
          </p>

          {/* Delivery Date based on entered PIN */}
          <div className="mt-2 pt-2 border-t border-subtle text-[11px]">
            <p className={`font-medium ${delivery.isSameDay ? 'text-emerald-700 dark:text-emerald-400' : 'text-ink-muted dark:text-zinc-400'}`}>
              {delivery.text}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-3 pt-2 border-t border-subtle grid grid-cols-2 gap-1.5">
          <button
            onClick={() => onOpenBhaav(product)}
            className="py-1.5 px-2 bg-brass-light hover:bg-brass/25 dark:bg-charcoal-700 border border-brass/50 text-slate-deep dark:text-brass text-[11px] font-semibold uppercase tracking-wider rounded flex items-center justify-center gap-1 transition"
            title="Make an offer using Bhaav-Taav"
          >
            <Tag className="w-3 h-3 text-brass" />
            <span className="truncate">Bhaav-Taav</span>
          </button>

          <button
            onClick={() => onSelectProduct(product)}
            className="py-1.5 px-2 bg-slate-deep hover:bg-slate-hover text-white text-[11px] font-semibold uppercase tracking-wider rounded flex items-center justify-center transition"
          >
            <span className="truncate">View</span>
          </button>
        </div>
      </div>
    </div>
  );
};
