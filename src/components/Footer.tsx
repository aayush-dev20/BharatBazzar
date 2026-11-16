import React from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  language: Language;
  onOpenLegal: (type: 'terms' | 'privacy' | 'returns' | 'scratchAdvisory') => void;
  onOpenSponsorPortal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  onOpenLegal,
  onOpenSponsorPortal
}) => {
  const t = translations[language];

  return (
    <footer className="mt-16 bg-surface dark:bg-charcoal-900 border-t border-subtle transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-slate-deep border border-brass flex items-center justify-center">
                <span className="font-heading font-bold text-sm text-brass">भ</span>
              </div>
              <span className="font-heading font-bold text-base text-slate-deep dark:text-zinc-100">
                Bharat<span className="text-brass">Bazaar</span>
              </span>
            </div>
            <p className="text-xs text-ink-muted dark:text-zinc-400 leading-relaxed">
              {language === 'hi'
                ? 'भारत का अपना मार्केटप्लेस - स्थानीय दुकानों से उसी दिन डिलीवरी, ब्रांड-प्रायोजित स्क्रैच कार्ड्स और भाव-ताव मोलभाव के साथ।'
                : 'Architectural Indian marketplace connecting neighborhood kiranas, artisans and national brands with same-day dispatch and interactive bargaining.'}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-ink-muted dark:text-zinc-400 pt-1">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-brick fill-current" />
              <span>for Bharat</span>
            </div>
          </div>

          {/* Differentiators & Programs */}
          <div>
            <h4 className="text-xs font-heading font-semibold uppercase tracking-wider text-ink dark:text-zinc-100 mb-3">
              {language === 'hi' ? 'विशेष सुविधाएं' : 'Core Features'}
            </h4>
            <ul className="space-y-2 text-xs text-ink-muted dark:text-zinc-400">
              <li>
                <button
                  onClick={() => onOpenLegal('terms')}
                  className="hover:text-brass transition"
                >
                  {t.bhaavGuide}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('scratchAdvisory')}
                  className="hover:text-brass transition"
                >
                  {language === 'hi' ? 'स्क्रैच और जीतें नियम' : 'Scratch & Win Wallet Rules'}
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenSponsorPortal}
                  className="hover:text-brass transition text-brass font-medium"
                >
                  {t.sponsorGuide}
                </button>
              </li>
            </ul>
          </div>

          {/* Consumer Policy & Compliance */}
          <div>
            <h4 className="text-xs font-heading font-semibold uppercase tracking-wider text-ink dark:text-zinc-100 mb-3">
              {language === 'hi' ? 'नीति एवं अनुपालन' : 'Consumer Policies'}
            </h4>
            <ul className="space-y-2 text-xs text-ink-muted dark:text-zinc-400">
              <li>
                <button
                  onClick={() => onOpenLegal('terms')}
                  className="hover:text-brass transition"
                >
                  {t.termsOfService}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('privacy')}
                  className="hover:text-brass transition"
                >
                  {t.privacyPolicy}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('returns')}
                  className="hover:text-brass transition"
                >
                  {t.returnsPolicy}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('scratchAdvisory')}
                  className="hover:text-brass transition"
                >
                  {t.legalAdvisory}
                </button>
              </li>
            </ul>
          </div>

          {/* Payment & Security Badges */}
          <div className="space-y-3">
            <h4 className="text-xs font-heading font-semibold uppercase tracking-wider text-ink dark:text-zinc-100">
              {language === 'hi' ? 'सुरक्षित भुगतान प्रणाली' : 'Payment & Security'}
            </h4>
            <p className="text-[11px] text-ink-muted dark:text-zinc-400">
              Accepting RuPay, UPI (GPay, PhonePe, Paytm, BHIM), Net Banking, Cash on Delivery, and Low-Cost EMI.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="px-2 py-0.5 bg-concrete dark:bg-charcoal-700 text-ink dark:text-zinc-300 text-[10px] font-semibold rounded border border-subtle">
                RuPay
              </span>
              <span className="px-2 py-0.5 bg-concrete dark:bg-charcoal-700 text-ink dark:text-zinc-300 text-[10px] font-semibold rounded border border-subtle">
                UPI 2.0
              </span>
              <span className="px-2 py-0.5 bg-concrete dark:bg-charcoal-700 text-ink dark:text-zinc-300 text-[10px] font-semibold rounded border border-subtle">
                GST Invoice
              </span>
              <span className="px-2 py-0.5 bg-concrete dark:bg-charcoal-700 text-ink dark:text-zinc-300 text-[10px] font-semibold rounded border border-subtle">
                256-bit SSL
              </span>
            </div>
          </div>
        </div>

        {/* Legal Regulatory Bottom Bar */}
        <div className="pt-8 border-t border-subtle space-y-2 text-[11px] text-ink-muted dark:text-zinc-500">
          <p className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-brass shrink-0" />
            <span>{t.footerDisclaimer}</span>
          </p>
          <p>{t.footerLegalNote}</p>
          <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-subtle/50 text-xs">
            <span>{t.copyright}</span>
            <span className="font-mono text-[10px]">CIN: U72900DL2026PTC384192 • GSTIN: 07AABCB1429M1ZP</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
