import React, { useState, useEffect } from 'react';
import { Product, Language, UserSession, BhaavRound } from '../types';
import { translations } from '../data/translations';
import { formatINR } from '../utils/formatters';
import { evaluateBhaavOffer } from '../utils/bhaavTaav';
import {
  X,
  Tag,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Clock,
  Flame,
  Users
} from 'lucide-react';

interface BhaavTaavModalProps {
  product: Product | null;
  currentUser: UserSession;
  language: Language;
  onClose: () => void;
  onAcceptBargain: (product: Product, agreedPrice: number) => void;
  onOfferSubmitted: () => void;
}

export const BhaavTaavModal: React.FC<BhaavTaavModalProps> = ({
  product,
  currentUser,
  language,
  onClose,
  onAcceptBargain,
  onOfferSubmitted
}) => {
  const t = translations[language];

  const [offerInput, setOfferInput] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [rounds, setRounds] = useState<BhaavRound[]>([]);
  const [currentOfferPrice, setCurrentOfferPrice] = useState<number>(0);
  const [negotiationStatus, setNegotiationStatus] = useState<'active' | 'accepted' | 'declined' | 'countered'>('active');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [secondsLeft, setSecondsLeft] = useState<number>(1800); // 30-minute expiry

  // 30-minute countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!product) return null;

  const maxRounds = 3;
  const currentRoundNumber = Math.floor(rounds.length / 2) + 1;
  const isDailyLimitReached = currentUser.bhaavOffersDailyCount >= 5;

  const handleSubmitOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (isDailyLimitReached) return;

    const numericOffer = parseInt(offerInput.replace(/[^0-9]/g, ''), 10);
    if (isNaN(numericOffer) || numericOffer <= 0) return;

    setIsEvaluating(true);
    setCurrentOfferPrice(numericOffer);

    // Record customer round
    const customerRound: BhaavRound = {
      roundNumber: currentRoundNumber,
      offeredBy: 'customer',
      price: numericOffer,
      timestamp: new Date().toISOString()
    };

    setTimeout(() => {
      const evaluation = evaluateBhaavOffer(product, numericOffer, language);

      if (evaluation.status === 'accepted') {
        const sellerRound: BhaavRound = {
          roundNumber: currentRoundNumber,
          offeredBy: 'seller',
          price: numericOffer,
          timestamp: new Date().toISOString(),
          note: 'Offer approved by seller!'
        };
        setRounds(prev => [...prev, customerRound, sellerRound]);
        setNegotiationStatus('accepted');
        setStatusMessage(evaluation.message);
      } else if (evaluation.status === 'counter_offered') {
        const counter = evaluation.counterPrice || Math.round((numericOffer + product.price) / 2);
        const sellerRound: BhaavRound = {
          roundNumber: currentRoundNumber,
          offeredBy: 'seller',
          price: counter,
          timestamp: new Date().toISOString(),
          note: `Seller Counter-Offer for Round ${currentRoundNumber}`
        };
        setRounds(prev => [...prev, customerRound, sellerRound]);
        setNegotiationStatus('countered');
        setStatusMessage(evaluation.message);
      } else {
        const sellerRound: BhaavRound = {
          roundNumber: currentRoundNumber,
          offeredBy: 'seller',
          price: 0,
          timestamp: new Date().toISOString(),
          note: 'Offer declined below seller reserve'
        };
        setRounds(prev => [...prev, customerRound, sellerRound]);
        setNegotiationStatus('declined');
        setStatusMessage(evaluation.message);
      }

      onOfferSubmitted();
      setIsEvaluating(false);
      setOfferInput('');
    }, 900);
  };

  const handleAcceptAgreed = (price: number) => {
    onAcceptBargain(product, price);
    onClose();
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s.toString().padStart(2, '0')}`;
  };

  const latestSellerRound = [...rounds].reverse().find(r => r.offeredBy === 'seller' && r.price > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-ink/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-surface dark:bg-charcoal-800 border border-subtle rounded p-5 sm:p-6 shadow-none max-h-[92vh] flex flex-col overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-ink-muted hover:text-ink dark:text-zinc-400 rounded"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-subtle">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-brass/15 text-brass flex items-center justify-center">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-heading font-semibold text-ink dark:text-zinc-100 flex items-center gap-1.5">
                <span>Bhaav-Taav 2.0 (भाव-ताव)</span>
                <span className="text-[10px] bg-brass/20 text-brass-dark dark:text-brass font-bold px-1.5 rounded">
                  Round {Math.min(currentRoundNumber, 3)} of 3
                </span>
              </h3>
              <span className="text-[11px] text-ink-muted dark:text-zinc-400">
                Direct Seller Negotiation • 30-min price lock
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-mono font-bold text-brick bg-brick-light/40 dark:bg-brick/20 px-2 py-0.5 rounded border border-brick/30">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTimer(secondsLeft)}</span>
          </div>
        </div>

        {/* Social Proof Ticker */}
        <div className="my-2.5 px-3 py-1.5 bg-concrete dark:bg-charcoal-900 border border-subtle rounded flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1 text-ink dark:text-zinc-200">
            <Flame className="w-3.5 h-3.5 text-brick" />
            <span>120 people bargained today on Haat</span>
          </span>
          <span className="text-emerald-700 dark:text-emerald-400 font-bold">
            ₹42,500 saved
          </span>
        </div>

        {/* Product Mini Bar */}
        <div className="p-3 bg-concrete/60 dark:bg-charcoal-900 border border-subtle rounded flex items-center gap-3">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-12 h-12 object-cover rounded border border-subtle shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold text-ink dark:text-zinc-200 truncate">
              {language === 'hi' ? product.nameHi : product.name}
            </h4>
            <div className="flex items-baseline gap-2 mt-0.5 text-xs">
              <span className="text-ink-muted">Listed:</span>
              <span className="font-bold text-slate-deep dark:text-brass">
                {formatINR(product.price)}
              </span>
              <span className="text-[10px] text-ink-light line-through">
                {formatINR(product.mrp)}
              </span>
            </div>
          </div>
        </div>

        {/* Negotiation Rounds History */}
        <div className="flex-1 overflow-y-auto my-3 space-y-2 pr-1 max-h-48 text-xs">
          {rounds.map((r, i) => (
            <div
              key={i}
              className={`p-2.5 rounded border text-xs ${
                r.offeredBy === 'customer'
                  ? 'bg-concrete/40 dark:bg-charcoal-700/40 border-subtle ml-4'
                  : 'bg-brass-light/40 dark:bg-brass/10 border-brass/40 mr-4'
              }`}
            >
              <div className="flex justify-between font-semibold">
                <span>{r.offeredBy === 'customer' ? 'Your Bid' : 'Seller Response'}</span>
                <span className="font-bold text-slate-deep dark:text-brass">{r.price > 0 ? formatINR(r.price) : 'Declined'}</span>
              </div>
              {r.note && <p className="text-[11px] text-ink-muted mt-0.5">{r.note}</p>}
            </div>
          ))}
        </div>

        {/* Active Interaction Area */}
        <div className="space-y-3 pt-1 border-t border-subtle">
          {isDailyLimitReached ? (
            <div className="p-3 bg-brick-light dark:bg-brick/20 border border-brick/40 rounded text-xs text-brick">
              You have reached your daily limit of 5 Bhaav-Taav bargains. Quotas reset tomorrow at midnight to prevent system abuse.
            </div>
          ) : isEvaluating ? (
            <div className="py-4 text-center space-y-2">
              <RefreshCw className="w-6 h-6 text-brass animate-spin mx-auto" />
              <p className="text-xs font-medium text-ink dark:text-zinc-200">
                Evaluating offer with seller inventory reserve...
              </p>
            </div>
          ) : negotiationStatus === 'accepted' ? (
            /* Accepted */
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Deal Sealed! Seller accepted your offer!</span>
              </div>
              <p className="text-ink dark:text-zinc-200">{statusMessage}</p>
              <button
                type="button"
                onClick={() => handleAcceptAgreed(latestSellerRound?.price || currentOfferPrice)}
                className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold uppercase tracking-wider rounded transition"
              >
                Add to Cart at {formatINR(latestSellerRound?.price || currentOfferPrice)}
              </button>
            </div>
          ) : (
            /* Countered or Enter New Bid */
            <div className="space-y-2.5">
              {negotiationStatus === 'countered' && latestSellerRound && (
                <div className="p-2.5 bg-brass-light/40 dark:bg-brass/10 border border-brass/40 rounded text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-deep dark:text-brass">Seller Counter-Offer:</span>
                    <strong className="text-sm font-bold text-slate-deep dark:text-brass">{formatINR(latestSellerRound.price)}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAcceptAgreed(latestSellerRound.price)}
                    className="w-full py-1.5 bg-slate-deep hover:bg-slate-hover text-white font-semibold uppercase tracking-wider rounded text-xs transition"
                  >
                    Accept Counter & Add to Cart ({formatINR(latestSellerRound.price)})
                  </button>
                </div>
              )}

              {currentRoundNumber <= maxRounds ? (
                <form onSubmit={handleSubmitOffer} className="space-y-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-ink-muted">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={offerInput}
                        onChange={(e) => setOfferInput(e.target.value)}
                        placeholder={`e.g. ₹${Math.round(product.price * 0.9)}`}
                        className="w-full pl-7 pr-3 py-2 bg-surface dark:bg-charcoal-700 border border-subtle rounded text-xs font-semibold text-ink dark:text-zinc-100 focus:outline-none focus:border-brass"
                        required
                        autoFocus
                      />
                    </div>
                    <button
                      type="submit"
                      className="py-2 px-4 bg-slate-deep hover:bg-slate-hover text-white text-xs font-semibold uppercase tracking-wider rounded transition"
                    >
                      Bid Round {currentRoundNumber}
                    </button>
                  </div>
                </form>
              ) : (
                <p className="text-xs text-ink-muted text-center italic">
                  Maximum 3 negotiation rounds reached for this item.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="mt-3 pt-2 border-t border-subtle flex items-center justify-between text-[10px] text-ink-muted">
          <span>Daily quota: {currentUser.bhaavOffersDailyCount}/5 used</span>
          <span>Fair Trade Guarantee</span>
        </div>
      </div>
    </div>
  );
};
