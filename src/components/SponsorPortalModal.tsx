import React, { useState } from 'react';
import { SponsorCampaign, Language } from '../types';
import { translations } from '../data/translations';
import { formatINR } from '../utils/formatters';
import { X, Sparkles, Building2, Plus, BarChart3, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface SponsorPortalModalProps {
  campaigns: SponsorCampaign[];
  language: Language;
  onClose: () => void;
  onCreateCampaign: (campaign: Omit<SponsorCampaign, 'id' | 'createdAt' | 'cardsIssued' | 'cardsScratched'>) => void;
}

export const SponsorPortalModal: React.FC<SponsorPortalModalProps> = ({
  campaigns,
  language,
  onClose,
  onCreateCampaign
}) => {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'create' | 'dashboard'>('create');

  // Form State
  const [brandName, setBrandName] = useState('');
  const [category, setCategory] = useState('');
  const [maxReward, setMaxReward] = useState<number>(50);
  const [numberOfCards, setNumberOfCards] = useState<number>(500);
  const [isSuccess, setIsSuccess] = useState(false);

  // Fee calculation:
  // Expected average reward is ~60% of max reward
  const avgReward = Math.round(maxReward * 0.65);
  const rewardPool = numberOfCards * avgReward;
  const platformFee = Math.round(rewardPool * 0.10); // 10% platform fee as specified
  const totalCost = rewardPool + platformFee;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim() || !category.trim() || maxReward <= 0 || numberOfCards <= 0) return;

    onCreateCampaign({
      brandName: brandName.trim(),
      category: category.trim(),
      maxReward,
      totalCards: numberOfCards,
      totalBudget: totalCost,
      platformFee,
      status: 'active'
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setActiveTab('dashboard');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-surface dark:bg-charcoal-800 border border-subtle rounded max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-subtle flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-brass/15 text-brass flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-heading font-semibold text-ink dark:text-zinc-100">
                {t.sponsorPortalTitle}
              </h2>
              <p className="text-xs text-ink-muted dark:text-zinc-400">
                {t.sponsorPortalSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-ink-muted hover:text-ink dark:text-zinc-400 dark:hover:text-zinc-100 text-sm font-medium p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 border-b border-subtle flex gap-6 bg-concrete/30 dark:bg-charcoal-900/50">
          <button
            onClick={() => setActiveTab('create')}
            className={`py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition flex items-center gap-2 ${
              activeTab === 'create'
                ? 'border-brass text-slate-deep dark:text-brass'
                : 'border-transparent text-ink-muted dark:text-zinc-400 hover:text-ink dark:hover:text-zinc-200'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'hi' ? 'नया अभियान बनाएं' : 'Create New Pool'}</span>
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition flex items-center gap-2 ${
              activeTab === 'dashboard'
                ? 'border-brass text-slate-deep dark:text-brass'
                : 'border-transparent text-ink-muted dark:text-zinc-400 hover:text-ink dark:hover:text-zinc-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>{t.activeSponsorCampaigns} ({campaigns.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto flex-1">
          {activeTab === 'create' ? (
            <div className="space-y-5">
              {isSuccess ? (
                <div className="p-8 text-center space-y-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 rounded">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto" />
                  <h3 className="text-base font-heading font-semibold text-emerald-900 dark:text-emerald-200">
                    {language === 'hi' ? 'प्रायोजक अभियान सफलतापूर्वक लॉन्च हुआ!' : 'Sponsor Campaign Successfully Created!'}
                  </h3>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300">
                    {language === 'hi'
                      ? 'आपके कार्ड अब भारतीय खरीदारों के स्क्रैच कार्ड्स पूल में शामिल हो गए हैं।'
                      : 'Your funded scratch cards are now active and being issued to BharatBazaar shoppers.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleCreate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-ink dark:text-zinc-300 mb-1">
                        {t.brandName} *
                      </label>
                      <input
                        type="text"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        placeholder="e.g. Raymond, Dabur, FabIndia, Paper Boat"
                        className="w-full px-3 py-2 bg-surface dark:bg-charcoal-700 border border-subtle rounded text-sm text-ink dark:text-zinc-100 focus:outline-none focus:border-brass"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-ink dark:text-zinc-300 mb-1">
                        {t.brandCategory} *
                      </label>
                      <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="e.g. FMCG, Handloom, Consumer Electronics"
                        className="w-full px-3 py-2 bg-surface dark:bg-charcoal-700 border border-subtle rounded text-sm text-ink dark:text-zinc-100 focus:outline-none focus:border-brass"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-ink dark:text-zinc-300 mb-1">
                        {t.maxRewardPerCard}
                      </label>
                      <select
                        value={maxReward}
                        onChange={(e) => setMaxReward(parseInt(e.target.value, 10))}
                        className="w-full px-3 py-2 bg-surface dark:bg-charcoal-700 border border-subtle rounded text-sm text-ink dark:text-zinc-100 focus:outline-none focus:border-brass"
                      >
                        <option value={25}>₹25 (Micro Reward Pool)</option>
                        <option value={50}>₹50 (Standard Brand Boost)</option>
                        <option value={100}>₹100 (Premium Engagement Pool)</option>
                        <option value={250}>₹250 (Mega Festival Jackpot)</option>
                        <option value={500}>₹500 (Exclusive Flagship Pool)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-ink dark:text-zinc-300 mb-1">
                        {t.numberOfCards}
                      </label>
                      <select
                        value={numberOfCards}
                        onChange={(e) => setNumberOfCards(parseInt(e.target.value, 10))}
                        className="w-full px-3 py-2 bg-surface dark:bg-charcoal-700 border border-subtle rounded text-sm text-ink dark:text-zinc-100 focus:outline-none focus:border-brass"
                      >
                        <option value={100}>100 Cards (Pilot)</option>
                        <option value={250}>250 Cards</option>
                        <option value={500}>500 Cards (Recommended)</option>
                        <option value={1000}>1,000 Cards</option>
                        <option value={2500}>2,500 Cards (National Campaign)</option>
                      </select>
                    </div>
                  </div>

                  {/* Budget & Cost Breakdown (Rewards + 10% Platform Fee) */}
                  <div className="p-4 bg-concrete dark:bg-charcoal-900 border border-subtle rounded space-y-2.5">
                    <h4 className="text-xs font-heading font-semibold uppercase tracking-wider text-ink dark:text-zinc-200 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-brass" />
                      <span>{t.feeCalculation}</span>
                    </h4>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between text-ink-muted dark:text-zinc-400">
                        <span>{t.rewardPool} ({numberOfCards} cards @ ~{formatINR(avgReward)} avg):</span>
                        <span className="font-medium text-ink dark:text-zinc-200">{formatINR(rewardPool)}</span>
                      </div>
                      <div className="flex justify-between text-ink-muted dark:text-zinc-400">
                        <span>{t.platformFeeLabel}:</span>
                        <span className="font-medium text-ink dark:text-zinc-200">{formatINR(platformFee)}</span>
                      </div>
                      <div className="pt-2 border-t border-subtle flex justify-between text-sm font-bold text-slate-deep dark:text-brass">
                        <span>{t.totalSponsorCost}:</span>
                        <span>{formatINR(totalCost)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Legal Compliance Disclaimer */}
                  <div className="p-3 bg-brass-light/40 dark:bg-brass/10 border border-brass/20 rounded flex items-start gap-2.5 text-[11px] text-ink-muted dark:text-zinc-400">
                    <ShieldCheck className="w-4 h-4 text-brass shrink-0 mt-0.5" />
                    <span>
                      {language === 'hi'
                        ? 'प्रायोजित रिवॉर्ड्स भारतीय व्यापार संवर्धन मानदंडों के अंतर्गत संचालित होते हैं। सभी रिवॉर्ड्स सीधे ग्राहकों के भारत बाज़ार वॉलेट में क्रेडिट किए जाते हैं।'
                        : 'Promotional scratch cards are customer engagement mechanisms funded by brands. Rewards are credited to customer wallets and redeemed against purchases on BharatBazaar.'}
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-slate-deep hover:bg-slate-hover text-white text-xs font-semibold tracking-wider uppercase rounded flex items-center justify-center gap-2 transition"
                  >
                    <span>{t.launchCampaign} • {formatINR(totalCost)}</span>
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* Dashboard of Campaigns */
            <div className="space-y-4">
              {campaigns.length === 0 ? (
                <div className="p-8 text-center text-xs text-ink-muted dark:text-zinc-400 border border-dashed border-subtle rounded">
                  {language === 'hi' ? 'कोई सक्रिय प्रायोजक अभियान नहीं है।' : 'No active sponsor campaigns yet.'}
                </div>
              ) : (
                campaigns.map(camp => {
                  const remaining = Math.max(0, camp.totalCards - camp.cardsIssued);
                  const percentScratched = camp.cardsIssued > 0
                    ? Math.round((camp.cardsScratched / camp.cardsIssued) * 100)
                    : 0;

                  return (
                    <div
                      key={camp.id}
                      className="p-4 bg-concrete/50 dark:bg-charcoal-700/50 border border-subtle rounded space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-semibold text-ink dark:text-zinc-100">
                            {camp.brandName}
                          </h3>
                          <span className="text-xs text-ink-muted dark:text-zinc-400">
                            {camp.category} • Max {formatINR(camp.maxReward)}/card
                          </span>
                        </div>
                        <span className="text-[11px] font-semibold uppercase px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 rounded">
                          {camp.status}
                        </span>
                      </div>

                      {/* Stat Tiles */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                        <div className="p-2 bg-surface dark:bg-charcoal-800 border border-subtle rounded">
                          <span className="text-[10px] uppercase text-ink-muted dark:text-zinc-400 block">
                            {t.cardsIssued}
                          </span>
                          <span className="text-sm font-bold text-slate-deep dark:text-brass">
                            {camp.cardsIssued}
                          </span>
                        </div>
                        <div className="p-2 bg-surface dark:bg-charcoal-800 border border-subtle rounded">
                          <span className="text-[10px] uppercase text-ink-muted dark:text-zinc-400 block">
                            {t.cardsScratched}
                          </span>
                          <span className="text-sm font-bold text-slate-deep dark:text-brass">
                            {camp.cardsScratched} ({percentScratched}%)
                          </span>
                        </div>
                        <div className="p-2 bg-surface dark:bg-charcoal-800 border border-subtle rounded">
                          <span className="text-[10px] uppercase text-ink-muted dark:text-zinc-400 block">
                            {t.remainingCards}
                          </span>
                          <span className="text-sm font-bold text-slate-deep dark:text-brass">
                            {remaining}
                          </span>
                        </div>
                        <div className="p-2 bg-surface dark:bg-charcoal-800 border border-subtle rounded">
                          <span className="text-[10px] uppercase text-ink-muted dark:text-zinc-400 block">
                            {t.totalSponsorCost}
                          </span>
                          <span className="text-sm font-bold text-slate-deep dark:text-brass">
                            {formatINR(camp.totalBudget)}
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-surface dark:bg-charcoal-800 h-1.5 rounded overflow-hidden">
                        <div
                          className="bg-brass h-full transition-all duration-500"
                          style={{ width: `${(camp.cardsIssued / camp.totalCards) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-subtle flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-4 bg-concrete hover:bg-zinc-200 dark:bg-charcoal-700 dark:hover:bg-charcoal-600 text-ink dark:text-zinc-200 text-xs font-medium uppercase rounded transition"
          >
            {language === 'hi' ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
