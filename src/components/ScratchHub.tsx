import React from 'react';
import { ScratchCard, Language } from '../types';
import { translations } from '../data/translations';
import { formatINR } from '../utils/formatters';
import { Gift, Sparkles, CheckCircle2, ChevronRight, PlusCircle, Wallet, Info } from 'lucide-react';

interface ScratchHubProps {
  cards: ScratchCard[];
  walletBalance: number;
  language: Language;
  onOpenCard: (card: ScratchCard) => void;
  onOpenSponsorPortal: () => void;
  onClose: () => void;
}

export const ScratchHub: React.FC<ScratchHubProps> = ({
  cards,
  walletBalance,
  language,
  onOpenCard,
  onOpenSponsorPortal,
  onClose
}) => {
  const t = translations[language];

  const unscratched = cards.filter(c => !c.isScratched);
  const scratched = cards.filter(c => c.isScratched);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-surface dark:bg-charcoal-800 border border-subtle rounded max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-subtle flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-brass/15 flex items-center justify-center text-brass">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-heading font-semibold text-ink dark:text-zinc-100">
                {t.scratchAndWin}
              </h2>
              <p className="text-xs text-ink-muted dark:text-zinc-400">
                {language === 'hi'
                  ? 'ब्रांड्स द्वारा प्रायोजित स्क्रैच कार्ड्स - सीधे अपने वॉलेट में पाएं असली छूट'
                  : 'Brand-sponsored scratch reward pools — redeemable on carts of ₹299+'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-ink-muted hover:text-ink dark:text-zinc-400 dark:hover:text-zinc-100 text-sm font-medium px-2 py-1"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1">
          {/* Wallet Balance Banner */}
          <div className="p-4 bg-slate-subtle/50 dark:bg-charcoal-700/60 border border-subtle rounded flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-slate-deep text-white flex items-center justify-center">
                <Wallet className="w-5 h-5 text-brass" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-ink-muted dark:text-zinc-400 block font-medium">
                  {language === 'hi' ? 'आपका भारत बाज़ार वॉलेट' : 'Your BharatBazaar Wallet Balance'}
                </span>
                <span className="text-2xl font-heading font-bold text-slate-deep dark:text-brass">
                  {formatINR(walletBalance)}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded">
                <Info className="w-3.5 h-3.5" />
                {language === 'hi' ? '₹299+ के कार्ट पर लागू' : 'Valid on carts ₹299+'}
              </span>
            </div>
          </div>

          {/* Unscratched Cards Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-heading font-semibold uppercase tracking-wider text-ink dark:text-zinc-200 flex items-center gap-2">
                <span>{t.availableCards}</span>
                <span className="text-xs px-2 py-0.5 bg-brass/20 text-brass-dark dark:text-brass font-bold rounded">
                  {unscratched.length}
                </span>
              </h3>
            </div>

            {unscratched.length === 0 ? (
              <div className="p-6 text-center border border-dashed border-subtle rounded text-ink-muted dark:text-zinc-400 text-xs">
                {t.noCardsLeft}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {unscratched.map(card => (
                  <div
                    key={card.id}
                    onClick={() => onOpenCard(card)}
                    className="group cursor-pointer p-4 border-2 border-brass/40 hover:border-brass bg-gradient-to-r from-brass/5 to-transparent dark:from-brass/10 rounded transition flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-deep dark:text-brass">
                        <Sparkles className="w-3.5 h-3.5 text-brass" />
                        <span>{card.sponsorName}</span>
                      </div>
                      <p className="text-xs text-ink-muted dark:text-zinc-400 mt-0.5">
                        {card.sponsorCategory}
                      </p>
                      <span className="inline-block mt-2 text-[11px] font-medium text-brass-dark dark:text-brass underline">
                        {language === 'hi' ? 'खुरचने के लिए टैप करें →' : 'Tap to Scratch →'}
                      </span>
                    </div>

                    <div className="w-12 h-12 rounded bg-brass/20 border border-brass/50 flex items-center justify-center text-brass font-bold text-sm group-hover:scale-105 transition">
                      ?
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Scratched Cards History */}
          {scratched.length > 0 && (
            <div>
              <h3 className="text-sm font-heading font-semibold uppercase tracking-wider text-ink dark:text-zinc-200 mb-3">
                {t.scratchedCards}
              </h3>

              <div className="space-y-2">
                {scratched.map(card => (
                  <div
                    key={card.id}
                    className="p-3 bg-concrete/60 dark:bg-charcoal-700/50 border border-subtle rounded flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <div>
                        <span className="font-semibold text-ink dark:text-zinc-200">
                          {card.sponsorName}
                        </span>
                        <span className="text-ink-muted dark:text-zinc-400 ml-2">
                          ({card.sponsorCategory})
                        </span>
                      </div>
                    </div>

                    <div className="font-bold text-slate-deep dark:text-brass text-sm">
                      +{formatINR(card.rewardAmount)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sponsor a Scratch Pool CTA Banner */}
          <div className="p-4 bg-concrete dark:bg-charcoal-900 border border-subtle rounded flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-heading font-semibold text-ink dark:text-zinc-100 flex items-center gap-1.5">
                <PlusCircle className="w-4 h-4 text-brass" />
                <span>{language === 'hi' ? 'ब्रांड प्रायोजन पोर्टल' : 'Are you a brand or local enterprise?'}</span>
              </h4>
              <p className="text-xs text-ink-muted dark:text-zinc-400">
                {language === 'hi'
                  ? 'अपने ब्रांड के नाम पर रिवॉर्ड पूल बनाएं (पुरस्कार राशि + 10% शुल्क)'
                  : 'Sponsor reward pools for Indian shoppers (Rewards + 10% platform fee)'}
              </p>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenSponsorPortal();
              }}
              className="py-2 px-4 bg-slate-deep hover:bg-slate-hover text-white text-xs font-medium tracking-wide uppercase rounded flex items-center gap-1.5 whitespace-nowrap transition"
            >
              <span>{t.sponsorACard}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-subtle flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-4 bg-concrete hover:bg-zinc-200 dark:bg-charcoal-700 dark:hover:bg-charcoal-600 text-ink dark:text-zinc-200 text-xs font-medium uppercase rounded transition"
          >
            {language === 'hi' ? 'वापस जाएं' : 'Back to Store'}
          </button>
        </div>
      </div>
    </div>
  );
};
