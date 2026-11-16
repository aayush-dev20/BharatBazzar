import React, { useRef, useEffect, useState } from 'react';
import { ScratchCard, Language } from '../types';
import { translations } from '../data/translations';
import { formatINR } from '../utils/formatters';
import { X, Sparkles, CheckCircle2, Gift, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ScratchCardModalProps {
  card: ScratchCard | null;
  language: Language;
  onClose: () => void;
  onScratched: (cardId: string, amount: number) => void;
}

export const ScratchCardModal: React.FC<ScratchCardModalProps> = ({
  card,
  language,
  onClose,
  onScratched
}) => {
  const t = translations[language];
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const isDrawingRef = useRef(false);

  useEffect(() => {
    if (!card) return;
    if (card.isScratched) {
      setIsRevealed(true);
      return;
    }

    setIsRevealed(false);
    setScratchPercent(0);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High DPI scaling
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || 320;
    const height = rect.height || 220;

    canvas.width = width;
    canvas.height = height;

    // Draw rich metallic brass-charcoal architectural scratch coating
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#3a474c');
    grad.addColorStop(0.35, '#b08d57');
    grad.addColorStop(0.5, '#d4af7a');
    grad.addColorStop(0.65, '#b08d57');
    grad.addColorStop(1, '#243b42');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Subtle hatch texture / pattern
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    for (let i = -width; i < width * 2; i += 16) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + height, height);
      ctx.stroke();
    }

    // Border
    ctx.strokeStyle = '#eedbb9';
    ctx.lineWidth = 4;
    ctx.strokeRect(6, 6, width - 12, height - 12);

    // Text on scratch surface
    ctx.fillStyle = '#fafaf8';
    ctx.font = 'bold 15px Jost, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('BHARATBAZAAR SPONSOR POOL', width / 2, height / 2 - 24);

    ctx.font = '13px Hind, sans-serif';
    ctx.fillStyle = '#eedbb9';
    ctx.fillText(language === 'hi' ? 'खुरचें और जीतें' : '★ SCRATCH HERE WITH COIN / FINGER ★', width / 2, height / 2 + 6);

    ctx.font = '11px Hind, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText(card.sponsorName, width / 2, height / 2 + 30);
  }, [card, language]);

  const calculateScratchPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imgData.data;
      let transparentCount = 0;
      const totalPixels = pixels.length / 4;

      // Sample every 8th pixel for speed
      for (let i = 3; i < pixels.length; i += 32) {
        if (pixels[i] < 128) {
          transparentCount++;
        }
      }

      const percent = Math.round((transparentCount / (totalPixels / 8)) * 100);
      setScratchPercent(percent);

      if (percent >= 45 && !isRevealed && card) {
        revealFullCard();
      }
    } catch {
      // fallback
    }
  };

  const revealFullCard = () => {
    if (isRevealed || !card) return;
    setIsRevealed(true);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    // Fire golden celebration confetti
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#b08d57', '#243b42', '#f5efe6', '#d4af7a']
      });
    } catch {
      // ignore
    }

    onScratched(card.id, card.rewardAmount);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isRevealed) return;
    isDrawingRef.current = true;
    scratch(e);
  };

  const handlePointerUp = () => {
    isDrawingRef.current = false;
    calculateScratchPercentage();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || isRevealed) return;
    scratch(e);
  };

  const scratch = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    // Check periodically
    if (Math.random() < 0.2) {
      calculateScratchPercentage();
    }
  };

  if (!card) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-surface dark:bg-charcoal-800 border border-subtle rounded p-6 text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-ink-muted hover:text-ink dark:text-zinc-400 dark:hover:text-zinc-100 rounded hover:bg-concrete dark:hover:bg-charcoal-700 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Sponsor Header */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <Gift className="w-5 h-5 text-brass" />
          <span className="text-xs font-semibold tracking-wider uppercase text-brass">
            {t.sponsoredBy}: {card.sponsorName}
          </span>
        </div>

        <h3 className="text-xl font-heading font-semibold text-ink dark:text-zinc-100 mb-1">
          {t.scratchCardTitle}
        </h3>
        <p className="text-xs text-ink-muted dark:text-zinc-400 mb-4">
          {card.isScratched
            ? (language === 'hi' ? 'यह कार्ड पहले ही स्क्रैच किया जा चुका है' : 'This card has been redeemed')
            : t.scratchInstructions}
        </p>

        {/* Scratch Card Interactive Area */}
        <div className="relative mx-auto w-[320px] h-[220px] rounded border-2 border-brass/40 overflow-hidden bg-gradient-to-br from-concrete to-surface dark:from-charcoal-900 dark:to-charcoal-800 flex flex-col items-center justify-center p-4">
          {/* Revealed Content Underneath */}
          <div className="text-center space-y-2">
            <span className="inline-block px-2.5 py-0.5 text-[11px] font-medium bg-brass/15 text-brass-dark dark:text-brass rounded">
              {card.sponsorCategory}
            </span>

            <div className="text-3xl font-heading font-bold text-slate-deep dark:text-brass flex items-center justify-center gap-1">
              <span>{formatINR(card.rewardAmount)}</span>
              <Sparkles className="w-5 h-5 text-brass animate-bounce" />
            </div>

            <p className="text-xs font-medium text-ink dark:text-zinc-200 px-4">
              {language === 'hi' ? card.taglineHi : card.tagline}
            </p>

            <div className="pt-2">
              <span className="text-[11px] text-ink-muted dark:text-zinc-400 block">
                {t.applyOnCartNotice}
              </span>
              {card.couponCode && (
                <span className="inline-block mt-1 font-mono text-[11px] bg-concrete dark:bg-charcoal-700 px-2 py-0.5 rounded border border-subtle">
                  Code: {card.couponCode}
                </span>
              )}
            </div>
          </div>

          {/* HTML5 Scratch Overlay Canvas */}
          {!card.isScratched && (
            <canvas
              ref={canvasRef}
              className={`absolute inset-0 w-full h-full cursor-pointer touch-none transition-opacity duration-300 ${
                isRevealed ? 'pointer-events-none opacity-0' : 'opacity-100'
              }`}
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              onPointerMove={handlePointerMove}
            />
          )}
        </div>

        {/* Progress or Scratch All Helper */}
        {!card.isScratched && !isRevealed && (
          <div className="mt-3 flex items-center justify-between text-xs text-ink-muted dark:text-zinc-400 px-2">
            <span>{scratchPercent > 0 ? `${scratchPercent}% scratched` : t.scratchMore}</span>
            <button
              onClick={revealFullCard}
              className="text-brass hover:text-brass-hover font-medium underline text-[11px]"
            >
              {language === 'hi' ? 'तुरंत पूरा खोलें' : 'Scratch automatically'}
            </button>
          </div>
        )}

        {/* Celebratory Banner once revealed */}
        {(isRevealed || card.isScratched) && (
          <div className="mt-4 p-3 bg-brass-light dark:bg-brass/10 border border-brass/30 rounded text-center">
            <div className="flex items-center justify-center gap-1.5 text-slate-deep dark:text-brass font-medium text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{formatINR(card.rewardAmount)} {t.claimedToWallet}</span>
            </div>
            <p className="text-[11px] text-ink-muted dark:text-zinc-400 mt-1">
              {t.applyOnCartNotice}
            </p>
          </div>
        )}

        {/* Legal Disclaimer */}
        <div className="mt-4 pt-3 border-t border-subtle flex items-center justify-center gap-1.5 text-[10px] text-ink-light dark:text-zinc-500">
          <ShieldCheck className="w-3.5 h-3.5 text-brass" />
          <span>Brand sponsored promotional card. Valid on BharatBazaar carts of ₹299+. T&C Apply.</span>
        </div>

        {/* Close / Action Button */}
        <div className="mt-4">
          <button
            onClick={onClose}
            className="w-full py-2 px-4 bg-slate-deep hover:bg-slate-hover text-white text-xs font-medium tracking-wide uppercase rounded transition"
          >
            {isRevealed || card.isScratched
              ? (language === 'hi' ? 'वॉलेट में जोड़ा गया • जारी रखें' : 'Claimed to Wallet • Continue Shopping')
              : (language === 'hi' ? 'बंद करें' : 'Close')}
          </button>
        </div>
      </div>
    </div>
  );
};
