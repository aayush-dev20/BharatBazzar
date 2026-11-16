import React, { useState } from 'react';
import { OrderItem, Language, Coupon } from '../types';
import { translations } from '../data/translations';
import { formatINR } from '../utils/formatters';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Gift,
  ArrowRight,
  Share2,
  Bookmark,
  CheckCircle2,
  AlertCircle,
  Tag
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: OrderItem[];
  savedForLater: OrderItem[];
  walletBalance: number;
  coupons: Coupon[];
  language: Language;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onSaveForLater: (item: OrderItem) => void;
  onMoveToCart: (item: OrderItem) => void;
  onProceedToCheckout: (appliedWalletDiscount: number, appliedCoupon?: Coupon) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  savedForLater,
  walletBalance,
  coupons,
  language,
  onUpdateQuantity,
  onRemoveItem,
  onSaveForLater,
  onMoveToCart,
  onProceedToCheckout
}) => {
  const t = translations[language];

  const [applyWallet, setApplyWallet] = useState(true);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  // Subtotal
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Delivery fee rule: Free over ₹499, else ₹49
  const isFreeDelivery = subtotal >= 499 || items.length === 0;
  const deliveryFee = isFreeDelivery ? 0 : 49;
  const amountNeededForFree = Math.max(0, 499 - subtotal);

  // Coupon discount
  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percent') {
      const calc = Math.round((subtotal * appliedCoupon.discountValue) / 100);
      couponDiscount = appliedCoupon.maxDiscount ? Math.min(calc, appliedCoupon.maxDiscount) : calc;
    } else {
      couponDiscount = appliedCoupon.discountValue;
    }
  }

  // Wallet discount: Applicable on carts of ₹299 or more
  const isEligibleForWallet = subtotal >= 299;
  const maxUsableWallet = Math.min(walletBalance, Math.floor(subtotal * 0.25), 250);
  const walletDiscount = (applyWallet && isEligibleForWallet) ? maxUsableWallet : 0;

  // Final Total
  const finalTotal = Math.max(0, subtotal + deliveryFee - couponDiscount - walletDiscount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    const found = coupons.find(c => c.code.toUpperCase() === code && c.isActive);
    if (!found) {
      setCouponError('Invalid coupon code. Try HAAT100 or DESI15.');
      return;
    }

    if (subtotal < found.minCartAmount) {
      setCouponError(`This coupon requires a minimum cart amount of ${formatINR(found.minCartAmount)}.`);
      return;
    }

    setAppliedCoupon(found);
    setCouponInput('');
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  const handleOrderViaWhatsApp = () => {
    if (items.length === 0) return;

    let text = `*Haat | भारत बाज़ार Order Request*\n\n`;
    items.forEach((item, idx) => {
      text += `${idx + 1}. ${item.productName} x ${item.quantity} = ${formatINR(item.price * item.quantity)}\n`;
    });
    text += `\n*Subtotal:* ${formatINR(subtotal)}`;
    text += `\n*Delivery:* ${deliveryFee === 0 ? 'FREE' : formatINR(deliveryFee)}`;
    if (couponDiscount > 0) text += `\n*Coupon (${appliedCoupon?.code}):* -${formatINR(couponDiscount)}`;
    if (walletDiscount > 0) text += `\n*Scratch Wallet Discount:* -${formatINR(walletDiscount)}`;
    text += `\n*Total Payable:* ${formatINR(finalTotal)} (GST Included)\n*Payment:* Cash on Delivery / UPI QR on delivery\n\nPlease confirm address!`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-ink/70 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-surface dark:bg-charcoal-800 border-l border-subtle flex flex-col justify-between">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-subtle flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-heading font-semibold text-ink dark:text-zinc-100">
                {t.yourCart}
              </h2>
              <span className="text-xs px-2 py-0.5 bg-concrete dark:bg-charcoal-700 text-ink-muted rounded">
                {items.length} items
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-ink-muted hover:text-ink dark:text-zinc-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery threshold banner */}
          <div className="px-4 py-2 bg-concrete/70 dark:bg-charcoal-900 border-b border-subtle text-xs">
            {isFreeDelivery ? (
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>You unlocked FREE Local Delivery!</span>
              </span>
            ) : (
              <span className="text-ink-muted">
                Add {formatINR(amountNeededForFree)} more for FREE Delivery
              </span>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.length === 0 ? (
              <div className="py-12 text-center text-xs text-ink-muted space-y-2">
                <p className="text-sm font-medium">Your shopping cart is empty.</p>
                <p>Discover authentic spices, handlooms & local kirana!</p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.productId}
                  className="p-3 bg-concrete/40 dark:bg-charcoal-700/40 border border-subtle rounded flex gap-3 text-xs"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="w-14 h-14 object-cover rounded border border-subtle shrink-0"
                  />

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-semibold text-ink dark:text-zinc-200 truncate">
                          {language === 'hi' ? item.productNameHi : item.productName}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.productId)}
                          className="text-ink-muted hover:text-brick"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.variantLabel && (
                        <span className="text-[10px] text-ink-muted block">{item.variantLabel}</span>
                      )}

                      {item.wasBargained && (
                        <span className="inline-block px-1.5 py-0.2 bg-brass/20 text-brass-dark dark:text-brass text-[10px] font-semibold rounded mt-0.5">
                          ⚡ Bhaav-Taav Deal
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-bold text-slate-deep dark:text-brass">
                          {formatINR(item.price)}
                        </span>
                        {item.mrp > item.price && (
                          <span className="text-[10px] text-ink-light line-through">
                            {formatINR(item.mrp)}
                          </span>
                        )}
                      </div>

                      {/* Quantity & Save for Later */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSaveForLater(item)}
                          className="text-[10px] text-ink-muted hover:text-brass underline"
                        >
                          Save for later
                        </button>

                        <div className="flex items-center border border-subtle rounded bg-surface dark:bg-charcoal-800">
                          <button
                            onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                            className="p-1 hover:bg-concrete dark:hover:bg-charcoal-700"
                          >
                            <Minus className="w-3 h-3 text-ink-muted" />
                          </button>
                          <span className="px-1.5 font-mono font-semibold text-xs text-ink dark:text-zinc-200">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                            className="p-1 hover:bg-concrete dark:hover:bg-charcoal-700"
                          >
                            <Plus className="w-3 h-3 text-ink-muted" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Saved For Later Bucket */}
            {savedForLater.length > 0 && (
              <div className="pt-4 border-t border-subtle space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-ink dark:text-zinc-300 block">
                  Saved For Later ({savedForLater.length})
                </span>
                {savedForLater.map((sItem) => (
                  <div
                    key={sItem.productId}
                    className="p-2.5 bg-concrete/30 dark:bg-charcoal-900 border border-subtle rounded flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5 truncate max-w-[220px]">
                      <img src={sItem.imageUrl} alt="" className="w-10 h-10 object-cover rounded border" />
                      <div className="truncate">
                        <p className="font-semibold truncate">{sItem.productName}</p>
                        <span className="font-bold text-slate-deep dark:text-brass">{formatINR(sItem.price)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onMoveToCart(sItem)}
                      className="py-1 px-2.5 bg-slate-deep text-white text-[10px] font-semibold uppercase rounded"
                    >
                      Move to Cart
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Calculation & Checkout */}
          {items.length > 0 && (
            <div className="p-4 border-t border-subtle bg-surface dark:bg-charcoal-800 space-y-3 text-xs">
              {/* Coupon Form */}
              <div className="space-y-1.5">
                {appliedCoupon ? (
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded flex justify-between items-center text-xs text-emerald-800 dark:text-emerald-300">
                    <span className="font-bold">Code applied: {appliedCoupon.code} (-{formatINR(couponDiscount)})</span>
                    <button onClick={handleRemoveCoupon} className="text-brick font-semibold hover:underline">
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-brass absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Coupon (e.g. HAAT100, DESI15)"
                        className="w-full pl-8 pr-2 py-1.5 bg-concrete dark:bg-charcoal-700 border border-subtle rounded text-xs uppercase font-mono font-medium"
                      />
                    </div>
                    <button
                      type="submit"
                      className="py-1.5 px-3 bg-slate-deep text-white text-xs font-semibold uppercase rounded"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponError && <p className="text-brick text-[11px]">{couponError}</p>}
              </div>

              {/* Wallet Discount Redemption */}
              {walletBalance > 0 && (
                <div className="p-2.5 bg-brass-light/40 dark:bg-brass/10 border border-brass/30 rounded flex justify-between items-center text-xs">
                  <div className="flex items-center gap-1.5">
                    <Gift className="w-4 h-4 text-brass" />
                    <span>Apply Scratch Reward Wallet ({formatINR(maxUsableWallet)})</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={applyWallet && isEligibleForWallet}
                    disabled={!isEligibleForWallet}
                    onChange={(e) => setApplyWallet(e.target.checked)}
                    className="rounded text-brass focus:ring-brass"
                  />
                </div>
              )}

              {/* Bill Row */}
              <div className="space-y-1 text-xs text-ink-muted border-t border-subtle pt-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-medium text-ink dark:text-zinc-200">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee:</span>
                  <span className={deliveryFee === 0 ? 'text-emerald-700 font-bold' : 'text-ink dark:text-zinc-200'}>
                    {deliveryFee === 0 ? 'FREE' : formatINR(deliveryFee)}
                  </span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Coupon Savings:</span>
                    <span>-{formatINR(couponDiscount)}</span>
                  </div>
                )}
                {walletDiscount > 0 && (
                  <div className="flex justify-between text-brass font-semibold">
                    <span>Scratch Wallet Discount:</span>
                    <span>-{formatINR(walletDiscount)}</span>
                  </div>
                )}
                <div className="pt-1.5 border-t border-subtle flex justify-between font-bold text-sm text-slate-deep dark:text-brass">
                  <span>Total Payable:</span>
                  <span>{formatINR(finalTotal)}</span>
                </div>
                <p className="text-[10px] text-ink-muted">
                  GST included. Collected at delivery via Cash or UPI QR.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => onProceedToCheckout(walletDiscount, appliedCoupon || undefined)}
                  className="w-full py-2.5 px-4 bg-slate-deep hover:bg-slate-hover text-white text-xs font-semibold uppercase tracking-wider rounded flex items-center justify-center gap-2 transition"
                >
                  <span>Proceed to Checkout • {formatINR(finalTotal)}</span>
                  <ArrowRight className="w-4 h-4 text-brass" />
                </button>

                <button
                  onClick={handleOrderViaWhatsApp}
                  className="w-full py-2 px-4 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold uppercase rounded flex items-center justify-center gap-2 transition"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Order via WhatsApp</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
