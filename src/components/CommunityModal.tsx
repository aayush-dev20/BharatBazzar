import React, { useState } from 'react';
import { Language } from '../types';
import { formatINR } from '../utils/formatters';
import {
  INITIAL_ARTISANS,
  INITIAL_USED_LISTINGS,
  INITIAL_MOHALLA_FEED,
  ArtisanProfile,
  UsedListing,
  MohallaActivity,
} from '../data/community';
import {
  X,
  Sparkles,
  Users,
  Repeat,
  Flag,
  CheckCircle2,
  MapPin,
  Clock,
  PlusCircle,
  ShieldAlert,
} from 'lucide-react';

interface CommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const CommunityModal: React.FC<CommunityModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<'artisans' | 'resale' | 'feed'>('artisans');
  const [usedListings, setUsedListings] = useState<UsedListing[]>(INITIAL_USED_LISTINGS);
  const [reportedListings, setReportedListings] = useState<string[]>([]);
  const [showPostModal, setShowPostModal] = useState(false);

  // New Used Listing Form
  const [resaleTitle, setResaleTitle] = useState('');
  const [resaleDesc, setResaleDesc] = useState('');
  const [resalePrice, setResalePrice] = useState<number>(999);
  const [resaleOrigPrice, setResaleOrigPrice] = useState<number>(2500);
  const [resaleCondition, setResaleCondition] = useState<'like_new' | 'good' | 'fair'>('good');
  const [resaleCity, setResaleCity] = useState('Mumbai');
  const [resalePin, setResalePin] = useState('400050');

  if (!isOpen) return null;

  const handleReport = (listingId: string) => {
    setReportedListings((prev) => [...prev, listingId]);
    setUsedListings((prev) =>
      prev.map((l) => (l.id === listingId ? { ...l, reportedCount: l.reportedCount + 1 } : l))
    );
  };

  const handleCreateUsedListing = (e: React.FormEvent) => {
    e.preventDefault();
    const newListing: UsedListing = {
      id: `used-${Date.now()}`,
      sellerName: 'Local Neighbor',
      sellerPhone: '9876543210',
      title: resaleTitle,
      description: resaleDesc,
      condition: resaleCondition,
      price: resalePrice,
      originalPrice: resaleOrigPrice,
      city: resaleCity,
      pincode: resalePin,
      images: ['https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80'],
      reportedCount: 0,
      createdAt: 'Just now',
    };
    setUsedListings((prev) => [newListing, ...prev]);
    setShowPostModal(false);
    setResaleTitle('');
    setResaleDesc('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-ink/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-surface dark:bg-charcoal-800 border border-subtle rounded max-h-[92vh] flex flex-col overflow-hidden text-xs">
        {/* Header */}
        <div className="p-4 border-b border-subtle flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-brass" />
            <h2 className="text-base font-heading font-semibold text-ink dark:text-zinc-100">
              {language === 'hi' ? 'कारीगर, कम्युनिटी और रीसेल बाज़ार' : 'Artisans, Community & Resale'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-ink-muted hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-subtle px-4 pt-2 gap-4 uppercase font-semibold text-[11px]">
          <button
            onClick={() => setActiveTab('artisans')}
            className={`pb-2 border-b-2 transition ${
              activeTab === 'artisans'
                ? 'border-brass text-slate-deep dark:text-brass font-bold'
                : 'border-transparent text-ink-muted hover:text-ink'
            }`}
          >
            {language === 'hi' ? 'स्थानीय कारीगर (Maker Stories)' : 'Local Artisans & Heritage'}
          </button>
          <button
            onClick={() => setActiveTab('resale')}
            className={`pb-2 border-b-2 transition ${
              activeTab === 'resale'
                ? 'border-brass text-slate-deep dark:text-brass font-bold'
                : 'border-transparent text-ink-muted hover:text-ink'
            }`}
          >
            {language === 'hi' ? 'सेकंड-हैंड रीसेल (Pre-Owned)' : 'Community Resale (Used)'}
          </button>
          <button
            onClick={() => setActiveTab('feed')}
            className={`pb-2 border-b-2 transition ${
              activeTab === 'feed'
                ? 'border-brass text-slate-deep dark:text-brass font-bold'
                : 'border-transparent text-ink-muted hover:text-ink'
            }`}
          >
            {language === 'hi' ? 'मोहल्ला फीड (Neighbour Activity)' : 'Mohalla Activity Feed'}
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: ARTISAN MAKER PROFILES */}
          {activeTab === 'artisans' && (
            <div className="space-y-4">
              <p className="text-ink-muted text-[11px]">
                {language === 'hi'
                  ? 'हाट पर हर पारंपरिक वस्तु के पीछे एक सच्चा कारीगर और सदियों पुरानी विरासत है:'
                  : 'Behind every handcrafted product on Haat is a master artisan preserving India’s living heritage:'}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {INITIAL_ARTISANS.map((art) => (
                  <div
                    key={art.id}
                    className="p-4 bg-concrete/50 dark:bg-charcoal-900 border border-subtle rounded space-y-3 flex flex-col justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={art.portraitUrl}
                        alt={art.artisanName}
                        className="w-14 h-14 object-cover rounded-full border-2 border-brass/50 shadow-sm"
                      />
                      <div>
                        <h4 className="font-heading font-bold text-sm text-slate-deep dark:text-brass">
                          {art.artisanName}
                        </h4>
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold block">
                          {art.yearsOfHeritage} Years of Tradition
                        </span>
                        <span className="text-[10px] text-ink-muted block line-clamp-1">{art.region}</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-ink dark:text-zinc-300 italic leading-relaxed">
                      "{language === 'hi' ? art.storyHi : art.story}"
                    </p>

                    <div className="pt-2 border-t border-subtle flex items-center justify-between text-[10px] text-ink-muted">
                      <span className="font-semibold uppercase tracking-wider">{art.craftTradition}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: SECOND-HAND & COMMUNITY RESALE */}
          {activeTab === 'resale' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-heading font-semibold uppercase tracking-wider text-ink dark:text-zinc-100">
                    Pre-Owned & Used Goods Exchange
                  </h3>
                  <p className="text-ink-muted text-[11px]">
                    Buy and sell pre-loved local items. Clearly separated from new products.
                  </p>
                </div>
                <button
                  onClick={() => setShowPostModal(true)}
                  className="py-1.5 px-3 bg-slate-deep hover:bg-slate-hover text-white rounded text-xs font-semibold uppercase flex items-center gap-1.5 transition"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-brass" />
                  <span>List Pre-Owned Item</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {usedListings.map((item) => {
                  const isReported = reportedListings.includes(item.id);

                  return (
                    <div
                      key={item.id}
                      className="p-3 bg-surface dark:bg-charcoal-700/60 border-2 border-dashed border-subtle rounded space-y-2 flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative aspect-video rounded overflow-hidden bg-concrete mb-2">
                          <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                          <span className="absolute top-1.5 left-1.5 px-2 py-0.5 bg-ink/80 text-white font-mono text-[9px] uppercase font-bold tracking-widest rounded">
                            USED / PRE-OWNED
                          </span>
                        </div>
                        <h4 className="font-semibold text-xs text-ink dark:text-zinc-100 line-clamp-1">{item.title}</h4>
                        <p className="text-[11px] text-ink-muted line-clamp-2 mt-0.5">{item.description}</p>
                      </div>

                      <div className="pt-2 border-t border-subtle space-y-2">
                        <div className="flex justify-between items-baseline">
                          <span className="font-bold text-sm text-slate-deep dark:text-brass">{formatINR(item.price)}</span>
                          <span className="text-[10px] text-ink-light line-through">{formatINR(item.originalPrice)}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="capitalize font-semibold text-emerald-700 dark:text-emerald-400">
                            Condition: {item.condition.replace('_', ' ')}
                          </span>
                          <span className="text-ink-muted">{item.city} ({item.pincode})</span>
                        </div>

                        <div className="flex items-center justify-between pt-1 text-[10px]">
                          <a
                            href={`https://wa.me/91${item.sellerPhone}?text=${encodeURIComponent(`Hi, I am interested in your used listing on Haat: "${item.title}" (₹${item.price}). Is it available?`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-700 dark:text-emerald-400 hover:underline font-semibold"
                          >
                            Chat with Owner
                          </a>
                          <button
                            onClick={() => handleReport(item.id)}
                            disabled={isReported}
                            className={`flex items-center gap-1 ${isReported ? 'text-brick font-bold' : 'text-ink-muted hover:text-brick'}`}
                          >
                            <Flag className="w-3 h-3" />
                            <span>{isReported ? 'Reported' : 'Report'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: MOHALLA ACTIVITY FEED */}
          {activeTab === 'feed' && (
            <div className="space-y-3">
              <p className="text-ink-muted text-[11px]">
                {language === 'hi'
                  ? 'देखें आपके मोहल्ले और शहर के पड़ोसी हाट पर क्या खरीद रहे हैं:'
                  : 'Live verified purchases from neighbors across your pincode cluster:'}
              </p>

              <div className="space-y-2">
                {INITIAL_MOHALLA_FEED.map((act) => (
                  <div
                    key={act.id}
                    className="p-3 bg-concrete/40 dark:bg-charcoal-900 border border-subtle rounded flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-brass-light dark:bg-brass/20 text-slate-deep dark:text-brass flex items-center justify-center font-bold text-xs">
                        {act.buyerName.substring(0, 1)}
                      </div>
                      <div>
                        <span className="font-semibold text-ink dark:text-zinc-100">{act.buyerName}</span>
                        <span className="text-ink-muted text-[11px] ml-1.5">bought</span>
                        <p className="font-bold text-slate-deep dark:text-brass">{act.productName}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-bold">{formatINR(act.price)}</span>
                      <span className="text-[10px] text-ink-muted block flex items-center gap-1 justify-end">
                        <Clock className="w-3 h-3" />
                        <span>{act.timeAgo} • {act.neighborhood}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Post Used Item Modal */}
        {showPostModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/80 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-sm bg-surface dark:bg-charcoal-800 border border-subtle rounded p-5 space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-subtle pb-2">
                <h3 className="font-bold text-sm">Post a Pre-Owned Listing</h3>
                <button onClick={() => setShowPostModal(false)}><X className="w-4 h-4" /></button>
              </div>

              <form onSubmit={handleCreateUsedListing} className="space-y-3">
                <input
                  type="text"
                  value={resaleTitle}
                  onChange={(e) => setResaleTitle(e.target.value)}
                  placeholder="Item Title (e.g. Brass Pooja Lamp) *"
                  className="w-full px-2.5 py-1.5 bg-concrete dark:bg-charcoal-700 border rounded"
                  required
                />
                <textarea
                  rows={2}
                  value={resaleDesc}
                  onChange={(e) => setResaleDesc(e.target.value)}
                  placeholder="Description & condition details *"
                  className="w-full px-2.5 py-1.5 bg-concrete dark:bg-charcoal-700 border rounded"
                  required
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={resalePrice}
                    onChange={(e) => setResalePrice(parseInt(e.target.value, 10) || 0)}
                    placeholder="Your Price ₹"
                    className="px-2.5 py-1.5 bg-concrete dark:bg-charcoal-700 border rounded font-mono"
                    required
                  />
                  <select
                    value={resaleCondition}
                    onChange={(e) => setResaleCondition(e.target.value as any)}
                    className="px-2 py-1.5 bg-concrete dark:bg-charcoal-700 border rounded"
                  >
                    <option value="like_new">Like New</option>
                    <option value="good">Good Condition</option>
                    <option value="fair">Fair / Functional</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={resaleCity}
                    onChange={(e) => setResaleCity(e.target.value)}
                    placeholder="City"
                    className="px-2.5 py-1.5 bg-concrete dark:bg-charcoal-700 border rounded"
                  />
                  <input
                    type="text"
                    maxLength={6}
                    value={resalePin}
                    onChange={(e) => setResalePin(e.target.value)}
                    placeholder="Pincode"
                    className="px-2.5 py-1.5 bg-concrete dark:bg-charcoal-700 border rounded font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-slate-deep hover:bg-slate-hover text-white font-semibold uppercase rounded transition"
                >
                  Publish Pre-Owned Listing
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
