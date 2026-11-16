import React from 'react';
import { Order, Language } from '../types';
import { translations } from '../data/translations';
import { formatINR } from '../utils/formatters';
import {
  CheckCircle2,
  Gift,
  Package,
  ArrowRight,
  Sparkles,
  X,
  MessageCircle,
  ShieldCheck,
  KeyRound,
  ExternalLink,
} from 'lucide-react';
import {
  buildOrderWhatsAppUrl,
  OrderMessagePayload,
  DEFAULT_MARKETPLACE_WHATSAPP,
} from '../services/whatsapp/whatsappService';

interface OrderSuccessModalProps {
  order: Order | null;
  language: Language;
  onClose: () => void;
  onOpenScratchCard: () => void;
  onViewOrders: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  language,
  onClose,
  onOpenScratchCard,
  onViewOrders,
}) => {
  const t = translations[language];

  if (!order) return null;

  // Group items by seller for multi-seller WhatsApp routing
  const sellerGroups = new Map<string, typeof order.items>();
  order.items.forEach((item) => {
    const sId = item.sellerId || 'seller-default';
    const existing = sellerGroups.get(sId) || [];
    existing.push(item);
    sellerGroups.set(sId, existing);
  });

  // Delivery OTP (fallback if not already set)
  const deliveryOtp = order.deliveryOtp || '748291';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-ink/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-surface dark:bg-charcoal-800 border border-subtle rounded max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-subtle flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-base font-heading font-semibold text-ink dark:text-zinc-100">
              {t.orderPlacedTitle}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-ink-muted hover:text-ink dark:text-zinc-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Order Status & ID */}
          <div className="p-3 bg-concrete dark:bg-charcoal-900 border border-subtle rounded space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-ink-muted dark:text-zinc-400">{t.orderId}:</span>
              <span className="font-mono font-bold text-slate-deep dark:text-brass text-sm">
                {order.id}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-ink-muted dark:text-zinc-400">Payment Mode:</span>
              <span className="font-semibold text-ink dark:text-zinc-200 uppercase">
                {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Pay at Delivery by UPI QR'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-ink-muted dark:text-zinc-400">{t.orderTotal}:</span>
              <span className="font-bold text-ink dark:text-zinc-200">
                {formatINR(order.finalTotal)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-ink-muted dark:text-zinc-400">{t.deliveryScheduled}:</span>
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                {order.estimatedDelivery} ({order.deliverySlotLabel})
              </span>
            </div>
          </div>

          {/* Delivery OTP Security Box */}
          <div className="p-3.5 bg-brass-light/40 dark:bg-brass/10 border-2 border-brass/50 rounded space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-deep dark:text-brass font-bold text-xs uppercase tracking-wider">
              <KeyRound className="w-4 h-4 text-brass" />
              <span>Doorstep Delivery Verification OTP</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="text-[11px] text-ink-muted dark:text-zinc-300">
                  {language === 'hi'
                    ? 'पार्सल मिलने और जांचने के बाद ही डिलीवरी एजेंट को यह OTP दें:'
                    : 'Share this 6-digit OTP with delivery partner only after receiving package:'}
                </p>
              </div>
              <span className="font-mono text-base font-extrabold tracking-widest px-2.5 py-1 bg-surface dark:bg-charcoal-900 border border-brass text-slate-deep dark:text-brass rounded">
                {deliveryOtp}
              </span>
            </div>
          </div>

          {/* WhatsApp Click-to-Chat (Phase A requirement) */}
          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-600/30 rounded space-y-2.5">
            <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-400 font-bold text-xs">
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>
                {language === 'hi' ? 'व्हाट्सएप पर ऑर्डर भेजें' : 'Send Order on WhatsApp'}
              </span>
            </div>
            <p className="text-[11px] text-ink-muted dark:text-zinc-300">
              {language === 'hi'
                ? 'आपका ऑर्डर पहले ही हमारे डेटाबेस में सुरक्षित सहेज लिया गया है। विक्रेता को तुरंत सूचित करने के लिए नीचे क्लिक करें:'
                : 'Your order is safely saved in the database first. Click below to notify fulfilling seller(s) via WhatsApp:'}
            </p>

            {Array.from(sellerGroups.entries()).map(([sellerId, sellerItems], idx) => {
              const sellerWhatsApp = (sellerItems[0] as any).sellerWhatsApp || DEFAULT_MARKETPLACE_WHATSAPP;

              const payload: OrderMessagePayload = {
                orderNumber: order.id,
                sellerWhatsApp,
                customerName: order.customerName,
                customerPhone: order.customerPhone,
                streetAddress: order.shippingAddress.addressLine,
                landmark: order.shippingAddress.landmark,
                city: order.shippingAddress.city,
                state: order.shippingAddress.state,
                pincode: order.shippingAddress.pincode,
                deliverySlot: order.deliverySlotLabel,
                deliveryCharge: order.deliveryFee,
                discount: order.couponDiscount + order.scratchRewardDiscount,
                totalAmount: order.finalTotal,
                items: sellerItems.map((si) => ({
                  title: si.productName,
                  variantTitle: si.variantLabel,
                  quantity: si.quantity,
                  unitPrice: si.price,
                })),
                language,
              };

              const { url } = buildOrderWhatsAppUrl(payload);

              return (
                <a
                  key={sellerId}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded flex items-center justify-center gap-2 transition shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>
                    {sellerGroups.size > 1
                      ? `Send Seller #${idx + 1} Order on WhatsApp`
                      : 'Send Order on WhatsApp (wa.me)'}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
              );
            })}
          </div>

          {/* Bonus Sponsor Scratch Card */}
          <div className="p-3 bg-concrete/60 dark:bg-charcoal-900 border border-subtle rounded space-y-2">
            <div className="flex items-center gap-1.5 text-slate-deep dark:text-brass font-bold">
              <Gift className="w-4 h-4 text-brass" />
              <span>{t.bonusScratchCard}</span>
            </div>
            <p className="text-[11px] text-ink-muted dark:text-zinc-400">
              {language === 'hi'
                ? 'टाटा टी / बोट प्रायोजित स्क्रैच कार्ड अनलॉक हुआ है। वॉलेट कैश पाने के लिए तुरंत स्क्रैच करें!'
                : 'Brand-sponsored reward card unlocked. Scratch now to win wallet balance for your next order!'}
            </p>
            <button
              onClick={() => {
                onClose();
                onOpenScratchCard();
              }}
              className="w-full py-2 px-3 bg-brass hover:bg-brass-hover text-slate-deep font-semibold text-xs uppercase tracking-wider rounded flex items-center justify-center gap-1.5 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.scratchNow}</span>
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-subtle grid grid-cols-2 gap-2 bg-surface dark:bg-charcoal-800">
          <button
            onClick={() => {
              onClose();
              onViewOrders();
            }}
            className="py-2.5 px-3 bg-concrete dark:bg-charcoal-700 text-ink dark:text-zinc-200 text-xs font-semibold uppercase rounded hover:bg-zinc-200 transition text-center"
          >
            {t.trackOrder}
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-3 bg-slate-deep hover:bg-slate-hover text-white text-xs font-semibold uppercase rounded transition text-center"
          >
            {t.continueShopping}
          </button>
        </div>
      </div>
    </div>
  );
};
