import React from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { X, ShieldCheck, FileText, AlertTriangle, RotateCcw } from 'lucide-react';

interface LegalModalProps {
  type: 'terms' | 'privacy' | 'returns' | 'scratchAdvisory' | null;
  language: Language;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, language, onClose }) => {
  const t = translations[language];

  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-surface dark:bg-charcoal-800 border border-subtle rounded max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-subtle flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {type === 'terms' && <FileText className="w-5 h-5 text-brass" />}
            {type === 'privacy' && <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
            {type === 'returns' && <RotateCcw className="w-5 h-5 text-slate-deep dark:text-brass" />}
            {type === 'scratchAdvisory' && <AlertTriangle className="w-5 h-5 text-brick" />}

            <h2 className="text-base font-heading font-semibold text-ink dark:text-zinc-100">
              {type === 'terms' && t.termsOfService}
              {type === 'privacy' && t.privacyPolicy}
              {type === 'returns' && t.returnsPolicy}
              {type === 'scratchAdvisory' && t.legalAdvisory}
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
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-ink-muted dark:text-zinc-300 leading-relaxed">
          {type === 'terms' && (
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-ink dark:text-zinc-100">
                1. Marketplace Platform Operator
              </h3>
              <p>
                BharatBazaar operates as a registered electronic marketplace facilitator in accordance with the Consumer Protection (E-Commerce) Rules, 2020 framed under the Consumer Protection Act, 2019 of India.
              </p>

              <h3 className="font-semibold text-sm text-ink dark:text-zinc-100">
                2. Bhaav-Taav (Bargaining) Mechanism
              </h3>
              <p>
                Bhaav-Taav offers represent automated interactive preliminary purchase agreements between customers and verified merchant partners. Accepted bargain prices are locked to the user’s authenticated session for 30 minutes. All agreed prices include Goods and Services Tax (GST) as per Indian tax schedules.
              </p>

              <h3 className="font-semibold text-sm text-ink dark:text-zinc-100">
                3. Local Store Same-Day Delivery
              </h3>
              <p>
                Same-day fulfillment is subject to postal PIN verification and inventory availability within verified neighborhood store nodes. Orders placed before 4:00 PM IST on working days qualify for dispatch by 8:00 PM IST.
              </p>
            </div>
          )}

          {type === 'privacy' && (
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-ink dark:text-zinc-100">
                Compliance with Digital Personal Data Protection Act, 2023 (DPDP)
              </h3>
              <p>
                BharatBazaar respects customer privacy. We collect mobile numbers solely for OTP authentication, address verification, and delivery coordination via SMS and WhatsApp.
              </p>
              <h3 className="font-semibold text-sm text-ink dark:text-zinc-100">
                Data Minimization & Local Hosting
              </h3>
              <p>
                All user data, order histories, and payment logs are retained strictly in certified Indian data centers. We never sell customer browsing or bargaining behavior to unvetted third parties.
              </p>
            </div>
          )}

          {type === 'returns' && (
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-ink dark:text-zinc-100">
                7-Day Hassle-Free Returns & Replacement Policy
              </h3>
              <p>
                Under our consumer protection charter, unopened items in original packaging qualify for a 7-day doorstep return pickup.
              </p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Local Kirana & perishable goods: 24-hour instant replacement for freshness.</li>
                <li>Mobiles & electronics: 7-day replacement for technical defects.</li>
                <li>Handlooms & handicrafts: 7-day return with reverse courier pickup.</li>
              </ul>
              <p>
                Refunds are credited directly to original payment method (UPI / Bank Account) within 24-48 banking hours post-pickup.
              </p>
            </div>
          )}

          {type === 'scratchAdvisory' && (
            <div className="space-y-3">
              <div className="p-3 bg-brass-light dark:bg-brass/10 border border-brass/40 rounded text-slate-deep dark:text-brass">
                <span className="font-bold block mb-1">
                  ⚖️ Regulatory Disclosure on Promotional Games & Rewards (India)
                </span>
                <span>
                  Under Indian state laws (including Public Gambling Act, 1867 and respective State Gaming Legislations), game of skill vs chance distinctions apply.
                </span>
              </div>

              <p>
                1. <strong>Free-to-Play Customer Loyalty:</strong> BharatBazaar scratch cards require no entry fee or real-money wager. They are strictly trade promotions sponsored by FMCG and electronics brand partners (e.g. Tata Consumer, boAt, Amul).
              </p>
              <p>
                2. <strong>Redemption Limitations:</strong> Rewards are credited exclusively as internal store wallet credits redeemable against orders of ₹299 or higher on BharatBazaar, and cannot be withdrawn as cash.
              </p>
              <p>
                3. <strong>Pre-Launch Legal Verification:</strong> Formal production launch with third-party merchant pools requires jurisdiction-specific legal review, particularly for users residing in Tamil Nadu, Andhra Pradesh, Telangana, Assam, and Odisha under respective prize competition acts.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-subtle flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-4 bg-slate-deep hover:bg-slate-hover text-white text-xs font-semibold uppercase rounded transition"
          >
            {language === 'hi' ? 'समझ गया / बंद करें' : 'Acknowledge & Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
