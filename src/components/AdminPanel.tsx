import React, { useState } from 'react';
import {
  Product,
  Order,
  Review,
  Coupon,
  SellerProfile,
  FestivalTheme,
  Language
} from '../types';
import { translations } from '../data/translations';
import { formatINR } from '../utils/formatters';
import { FESTIVAL_THEMES } from '../data/festival';
import {
  ShieldAlert,
  BarChart3,
  Users,
  Store,
  Package,
  Star,
  Tag,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText
} from 'lucide-react';

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  reviews: Review[];
  coupons: Coupon[];
  sellers: SellerProfile[];
  festivalTheme: FestivalTheme;
  language: Language;
  onUpdateFestival: (theme: FestivalTheme) => void;
  onApproveSeller: (sellerId: string) => void;
  onSuspendSeller: (sellerId: string) => void;
  onToggleFlagProduct: (productId: string) => void;
  onDeleteReview: (reviewId: string) => void;
  onCreateCoupon: (coupon: Coupon) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  orders,
  reviews,
  coupons,
  sellers,
  festivalTheme,
  language,
  onUpdateFestival,
  onApproveSeller,
  onSuspendSeller,
  onToggleFlagProduct,
  onDeleteReview,
  onCreateCoupon
}) => {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'reports' | 'sellers' | 'products' | 'reviews' | 'festival' | 'coupons'>('reports');

  // New Coupon Form
  const [newCode, setNewCode] = useState('');
  const [newDiscValue, setNewDiscValue] = useState(100);
  const [newMinCart, setNewMinCart] = useState(599);

  // Analytics
  const totalGmv = orders.reduce((sum, o) => sum + o.finalTotal, 0);
  const totalOrders = orders.length;
  const returnedOrders = orders.filter(o => o.returnRequest).length;
  const returnRate = totalOrders > 0 ? Math.round((returnedOrders / totalOrders) * 100) : 0;

  const handleCreateCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    onCreateCoupon({
      code: newCode.trim().toUpperCase(),
      discountType: 'flat',
      discountValue: newDiscValue,
      minCartAmount: newMinCart,
      expiryDate: '2026-12-31',
      usageLimit: 1000,
      timesUsed: 0,
      createdBy: 'admin',
      isActive: true
    });

    setNewCode('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Admin Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-subtle">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-slate-deep text-brass flex items-center justify-center font-bold">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-heading font-bold text-ink dark:text-zinc-100">
              Haat Platform Administration
            </h1>
            <p className="text-xs text-ink-muted dark:text-zinc-400">
              Marketplace governance, KYC audits, festival themes & financial reports
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-surface dark:bg-charcoal-800 p-1 rounded border border-subtle text-xs font-semibold">
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-3 py-1.5 rounded transition ${activeTab === 'reports' ? 'bg-slate-deep text-white dark:bg-brass dark:text-slate-deep' : 'text-ink-muted hover:text-ink'}`}
          >
            Reports & GMV
          </button>
          <button
            onClick={() => setActiveTab('sellers')}
            className={`px-3 py-1.5 rounded transition ${activeTab === 'sellers' ? 'bg-slate-deep text-white dark:bg-brass dark:text-slate-deep' : 'text-ink-muted hover:text-ink'}`}
          >
            Sellers KYC ({sellers.filter(s => s.status === 'pending_approval').length} pending)
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3 py-1.5 rounded transition ${activeTab === 'products' ? 'bg-slate-deep text-white dark:bg-brass dark:text-slate-deep' : 'text-ink-muted hover:text-ink'}`}
          >
            Catalog Moderation
          </button>
          <button
            onClick={() => setActiveTab('festival')}
            className={`px-3 py-1.5 rounded transition ${activeTab === 'festival' ? 'bg-slate-deep text-white dark:bg-brass dark:text-slate-deep' : 'text-ink-muted hover:text-ink'}`}
          >
            Festival Mode
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-3 py-1.5 rounded transition ${activeTab === 'coupons' ? 'bg-slate-deep text-white dark:bg-brass dark:text-slate-deep' : 'text-ink-muted hover:text-ink'}`}
          >
            Coupons ({coupons.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-3 py-1.5 rounded transition ${activeTab === 'reviews' ? 'bg-slate-deep text-white dark:bg-brass dark:text-slate-deep' : 'text-ink-muted hover:text-ink'}`}
          >
            Reviews
          </button>
        </div>
      </div>

      {/* TAB 1: Reports & GMV */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-surface dark:bg-charcoal-800 border border-subtle rounded">
              <span className="text-[11px] font-semibold uppercase text-ink-muted block">Total Marketplace GMV</span>
              <span className="text-2xl font-heading font-bold text-slate-deep dark:text-brass">{formatINR(totalGmv)}</span>
              <span className="text-[10px] text-emerald-700 block mt-1">100% Cash on Delivery / UPI QR</span>
            </div>
            <div className="p-4 bg-surface dark:bg-charcoal-800 border border-subtle rounded">
              <span className="text-[11px] font-semibold uppercase text-ink-muted block">Orders Placed</span>
              <span className="text-2xl font-heading font-bold text-slate-deep dark:text-brass">{totalOrders}</span>
              <span className="text-[10px] text-ink-muted block mt-1">Across Indian cities</span>
            </div>
            <div className="p-4 bg-surface dark:bg-charcoal-800 border border-subtle rounded">
              <span className="text-[11px] font-semibold uppercase text-ink-muted block">Active Sellers</span>
              <span className="text-2xl font-heading font-bold text-slate-deep dark:text-brass">{sellers.filter(s => s.status === 'approved').length}</span>
              <span className="text-[10px] text-emerald-700 block mt-1">KYC Verified Kiranas</span>
            </div>
            <div className="p-4 bg-surface dark:bg-charcoal-800 border border-subtle rounded">
              <span className="text-[11px] font-semibold uppercase text-ink-muted block">Returns / Exchanges</span>
              <span className="text-2xl font-heading font-bold text-slate-deep dark:text-brass">{returnRate}%</span>
              <span className="text-[10px] text-ink-muted block mt-1">{returnedOrders} orders requested 7-day return</span>
            </div>
          </div>

          {/* Top Selling Categories & Performance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-surface dark:bg-charcoal-800 border border-subtle rounded space-y-3">
              <h3 className="font-heading font-semibold uppercase tracking-wider text-ink dark:text-zinc-200">
                Top Categories by Demand
              </h3>
              <div className="space-y-2">
                {[
                  { name: 'Local Kirana & A2 Ghee', percent: 42, rev: '₹18,400' },
                  { name: 'Kashmiri Mogra Spices', percent: 28, rev: '₹12,200' },
                  { name: 'Mobiles & Tech (boAt, OnePlus)', percent: 20, rev: '₹8,800' },
                  { name: 'Traditional Handlooms & Brass', percent: 10, rev: '₹4,400' }
                ].map((cat, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-ink dark:text-zinc-200">{cat.name}</span>
                      <span className="font-semibold text-slate-deep dark:text-brass">{cat.rev} ({cat.percent}%)</span>
                    </div>
                    <div className="w-full bg-concrete dark:bg-charcoal-700 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-brass h-full rounded-full" style={{ width: `${cat.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-surface dark:bg-charcoal-800 border border-subtle rounded space-y-3">
              <h3 className="font-heading font-semibold uppercase tracking-wider text-ink dark:text-zinc-200">
                Merchant Fulfillment SLA
              </h3>
              <div className="p-3 bg-concrete/60 dark:bg-charcoal-900 rounded space-y-2">
                <div className="flex justify-between">
                  <span className="text-ink-muted">Same-Day Local Deliveries</span>
                  <strong className="text-emerald-700">98.4% on-time</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">Bhaav-Taav Response Speed</span>
                  <strong className="text-slate-deep dark:text-brass">&lt; 3 mins avg</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">Cash on Delivery Verification</span>
                  <strong className="text-ink">100% Doorstep QR</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Sellers KYC Management */}
      {activeTab === 'sellers' && (
        <div className="space-y-4 text-xs">
          <div className="flex justify-between items-center">
            <h3 className="font-heading font-semibold uppercase tracking-wider text-ink dark:text-zinc-200">
              Registered Merchant Partners & KYC
            </h3>
          </div>

          <div className="space-y-3">
            {sellers.map((s) => (
              <div
                key={s.id}
                className="p-4 bg-surface dark:bg-charcoal-800 border border-subtle rounded flex flex-wrap items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={s.shopPhoto}
                    alt={s.shopName}
                    className="w-12 h-12 object-cover rounded border border-subtle"
                  />
                  <div>
                    <h4 className="font-semibold text-sm text-ink dark:text-zinc-100">{s.shopName}</h4>
                    <p className="text-ink-muted">{s.ownerName} • {s.city}, {s.state} ({s.pincode})</p>
                    <p className="font-mono text-[11px] text-ink-light">PAN: {s.pan} • GSTIN: {s.gstin || 'Unregistered Composition'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase ${
                    s.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : s.status === 'pending_approval' ? 'bg-amber-100 text-amber-800' : 'bg-brick-light text-brick'
                  }`}>
                    {s.status}
                  </span>

                  {s.status === 'pending_approval' ? (
                    <button
                      onClick={() => onApproveSeller(s.id)}
                      className="py-1 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-semibold text-xs flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve KYC</span>
                    </button>
                  ) : s.status === 'approved' ? (
                    <button
                      onClick={() => onSuspendSeller(s.id)}
                      className="py-1 px-2.5 bg-brick hover:bg-brick/90 text-white rounded text-xs"
                    >
                      Suspend
                    </button>
                  ) : (
                    <button
                      onClick={() => onApproveSeller(s.id)}
                      className="py-1 px-2.5 bg-slate-deep text-white rounded text-xs"
                    >
                      Re-activate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Catalog Moderation */}
      {activeTab === 'products' && (
        <div className="space-y-4 text-xs">
          <h3 className="font-heading font-semibold uppercase tracking-wider text-ink dark:text-zinc-200">
            Catalog Quality Audit & Product Flags
          </h3>
          <div className="bg-surface dark:bg-charcoal-800 border border-subtle rounded overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-concrete/60 dark:bg-charcoal-900 border-b border-subtle font-semibold uppercase text-ink-muted">
                <tr>
                  <th className="p-3">Product</th>
                  <th className="p-3">Price / MRP</th>
                  <th className="p-3">Seller</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Moderation Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-subtle">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-concrete/30">
                    <td className="p-3 flex items-center gap-2">
                      <img src={p.imageUrl} alt={p.name} className="w-8 h-8 object-cover rounded border" />
                      <span className="font-semibold truncate max-w-xs">{p.name}</span>
                    </td>
                    <td className="p-3">{formatINR(p.price)}</td>
                    <td className="p-3 text-ink-muted">{p.sellerName}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        p.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-brick-light text-brick'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onToggleFlagProduct(p.id)}
                        className={`py-1 px-2.5 rounded text-[11px] font-semibold uppercase ${
                          p.status === 'flagged' ? 'bg-emerald-700 text-white' : 'bg-brick text-white'
                        }`}
                      >
                        {p.status === 'flagged' ? 'Unflag Product' : 'Flag / Restrict'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Festival Mode Switcher */}
      {activeTab === 'festival' && (
        <div className="space-y-4 text-xs">
          <div>
            <h3 className="font-heading font-semibold uppercase tracking-wider text-ink dark:text-zinc-200">
              Live Festival Mode & Promotional Theme
            </h3>
            <p className="text-ink-muted">
              Instantly switch marketplace banners, theme colors, and greeting strips across India.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(FESTIVAL_THEMES).map(([key, theme]) => {
              const isCurrent = festivalTheme.mode === theme.mode;
              return (
                <div
                  key={key}
                  className={`p-4 rounded border-2 transition ${
                    isCurrent ? 'border-brass bg-brass-light/30 dark:bg-brass/10' : 'border-subtle bg-surface dark:bg-charcoal-800'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-sm text-ink dark:text-zinc-100">{theme.title}</span>
                    {isCurrent && (
                      <span className="text-[10px] font-bold text-brass uppercase bg-brass/20 px-1.5 py-0.2 rounded">
                        Active Now
                      </span>
                    )}
                  </div>
                  <p className="text-ink-muted text-xs mb-3">{theme.subtitle}</p>
                  <button
                    onClick={() => onUpdateFestival(theme)}
                    disabled={isCurrent}
                    className="w-full py-1.5 bg-slate-deep hover:bg-slate-hover disabled:opacity-50 text-white font-semibold uppercase tracking-wider rounded text-xs"
                  >
                    {isCurrent ? 'Current Live Theme' : 'Activate Theme'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: Coupons */}
      {activeTab === 'coupons' && (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <form onSubmit={handleCreateCouponSubmit} className="p-4 bg-surface dark:bg-charcoal-800 border border-subtle rounded space-y-3">
              <h3 className="font-heading font-semibold uppercase tracking-wider text-ink dark:text-zinc-200">
                Create Platform Coupon
              </h3>
              <div>
                <label className="block text-[10px] uppercase font-semibold text-ink-muted mb-0.5">Coupon Code *</label>
                <input
                  type="text"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="e.g. UTSAV150"
                  className="w-full px-2.5 py-1.5 bg-concrete dark:bg-charcoal-700 border border-subtle rounded uppercase font-mono font-bold"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-semibold text-ink-muted mb-0.5">Flat Discount (₹) *</label>
                <input
                  type="number"
                  value={newDiscValue}
                  onChange={(e) => setNewDiscValue(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-2.5 py-1.5 bg-concrete dark:bg-charcoal-700 border border-subtle rounded font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-semibold text-ink-muted mb-0.5">Min Cart Amount (₹) *</label>
                <input
                  type="number"
                  value={newMinCart}
                  onChange={(e) => setNewMinCart(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-2.5 py-1.5 bg-concrete dark:bg-charcoal-700 border border-subtle rounded font-mono"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-slate-deep hover:bg-slate-hover text-white font-semibold uppercase rounded"
              >
                Launch Platform Coupon
              </button>
            </form>

            <div className="md:col-span-2 space-y-2.5">
              <h3 className="font-heading font-semibold uppercase tracking-wider text-ink dark:text-zinc-200">
                Active Marketplace Coupons
              </h3>
              {coupons.map((c, i) => (
                <div key={i} className="p-3 bg-surface dark:bg-charcoal-800 border border-subtle rounded flex justify-between items-center">
                  <div>
                    <span className="font-mono font-bold text-sm text-slate-deep dark:text-brass">{c.code}</span>
                    <p className="text-ink-muted">{c.discountType === 'flat' ? `Flat ${formatINR(c.discountValue)} OFF` : `${c.discountValue}% OFF`} on min cart {formatINR(c.minCartAmount)}</p>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-semibold">{c.timesUsed} redeemed</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: Reviews Moderation */}
      {activeTab === 'reviews' && (
        <div className="space-y-4 text-xs">
          <h3 className="font-heading font-semibold uppercase tracking-wider text-ink dark:text-zinc-200">
            Real Customer Reviews Audit
          </h3>
          <div className="space-y-2.5">
            {reviews.map(r => (
              <div key={r.id} className="p-3 bg-surface dark:bg-charcoal-800 border border-subtle rounded flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-ink dark:text-zinc-100">{r.userName}</span>
                    <span className="text-amber-700 font-bold">★ {r.rating}</span>
                    {r.verifiedPurchase && <span className="text-[10px] text-emerald-700">Verified Buyer</span>}
                  </div>
                  <p className="text-ink-muted">{r.comment}</p>
                  <span className="text-[10px] text-ink-light">{r.date}</span>
                </div>
                <button
                  onClick={() => onDeleteReview(r.id)}
                  className="py-1 px-2.5 bg-brick text-white rounded text-[11px]"
                >
                  Remove Spam
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
