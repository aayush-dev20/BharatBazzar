import React from 'react';
import { MohallaGroupBuy, Product, Language, UserSession } from '../types';
import { translations } from '../data/translations';
import { formatINR } from '../utils/formatters';
import { X, Users, Clock, CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface MohallaGroupBuyModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupBuys: MohallaGroupBuy[];
  products: Product[];
  currentUser: UserSession;
  language: Language;
  onJoinGroupBuy: (groupBuyId: string, product: Product, discountedPrice: number) => void;
}

export const MohallaGroupBuyModal: React.FC<MohallaGroupBuyModalProps> = ({
  isOpen,
  onClose,
  groupBuys,
  products,
  currentUser,
  language,
  onJoinGroupBuy
}) => {
  const t = translations[language];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-ink/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-surface dark:bg-charcoal-800 border border-subtle rounded max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-subtle flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded bg-brass/15 text-brass flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-heading font-semibold text-ink dark:text-zinc-100">
                {t.mohallaTitle}
              </h2>
              <p className="text-xs text-ink-muted dark:text-zinc-400">
                {t.mohallaSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-ink-muted hover:text-ink dark:text-zinc-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {groupBuys.map((gb) => {
            const prod = products.find(p => p.id === gb.productId);
            if (!prod) return null;

            const discountedPrice = Math.round(prod.price * (1 - gb.groupDiscountPercent / 100));
            const hasJoined = gb.members.some(m => m.userId === currentUser.id);
            const percentFilled = Math.min(100, Math.round((gb.joinedCount / gb.targetCount) * 100));

            return (
              <div
                key={gb.id}
                className="p-4 bg-concrete/50 dark:bg-charcoal-700/50 border-2 border-brass/40 rounded space-y-3"
              >
                {/* Neighborhood Tag & Savings Badge */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-deep dark:text-brass flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>{gb.neighborhood}</span>
                  </span>
                  <span className="text-[11px] font-bold bg-brick text-white px-2 py-0.5 rounded">
                    {gb.groupDiscountPercent}% Group Discount
                  </span>
                </div>

                {/* Product row */}
                <div className="flex items-center gap-3">
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    className="w-16 h-16 object-cover rounded border border-subtle shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-ink dark:text-zinc-100 truncate">
                      {language === 'hi' ? prod.nameHi : prod.name}
                    </h4>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-sm font-bold text-slate-deep dark:text-brass">
                        {formatINR(discountedPrice)}
                      </span>
                      <span className="text-xs text-ink-light line-through">
                        {formatINR(prod.price)}
                      </span>
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                        Save {formatINR(prod.price - discountedPrice)} each!
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar & Members Counter */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-ink dark:text-zinc-200">
                      Progress: {gb.joinedCount} of {gb.targetCount} joined
                    </span>
                    <span className="text-ink-muted flex items-center gap-1 text-[11px]">
                      <Clock className="w-3 h-3 text-brass" />
                      <span>Ends 18 Nov</span>
                    </span>
                  </div>

                  <div className="w-full bg-surface dark:bg-charcoal-800 h-2 rounded-full overflow-hidden border border-subtle">
                    <div
                      className="bg-brass h-full transition-all duration-500 rounded-full"
                      style={{ width: `${percentFilled}%` }}
                    />
                  </div>
                </div>

                {/* Member Avatars list preview */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center -space-x-1.5 overflow-hidden">
                    {gb.members.slice(0, 5).map((m, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full bg-slate-deep text-brass text-[10px] font-bold border border-white dark:border-charcoal-800 flex items-center justify-center shrink-0"
                        title={m.userName}
                      >
                        {m.userName[0]}
                      </div>
                    ))}
                    {gb.members.length > 5 && (
                      <span className="text-[10px] text-ink-muted pl-2">+{gb.members.length - 5} neighbors</span>
                    )}
                  </div>

                  {hasJoined ? (
                    <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>You have joined!</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => onJoinGroupBuy(gb.id, prod, discountedPrice)}
                      className="py-1.5 px-3 bg-slate-deep hover:bg-slate-hover text-white text-xs font-semibold uppercase tracking-wider rounded flex items-center gap-1.5 transition"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-brass" />
                      <span>{t.joinGroupBuy} • {formatINR(discountedPrice)}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
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
