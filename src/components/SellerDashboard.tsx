import React, { useState } from 'react';
import {
  Product,
  Order,
  SponsorCampaign,
  Language,
  SellerProfile,
  Coupon,
  ReturnRequest,
  ProductVariant
} from '../types';
import { translations } from '../data/translations';
import { formatINR, formatDate } from '../utils/formatters';
import {
  Package,
  PlusCircle,
  Truck,
  BarChart3,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Tag,
  Zap,
  Building2,
  Share2,
  Upload,
  FileSpreadsheet,
  AlertTriangle,
  RotateCcw,
  Check,
  X,
  Users,
  MessageCircle,
  Mic,
  BookOpen,
  Phone,
  Send,
  Sparkles
} from 'lucide-react';
import { buildSellerCustomerWhatsAppUrl, normalizeWhatsAppNumber } from '../services/whatsapp/whatsappService';
import { INITIAL_LEDGER_ENTRIES, LedgerEntry } from '../data/community';

interface SellerDashboardProps {
  products: Product[];
  orders: Order[];
  campaigns: SponsorCampaign[];
  seller: SellerProfile;
  language: Language;
  onAddProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => void;
  onUpdateStock: (productId: string, newStock: number) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onHandleReturn: (orderId: string, approve: boolean) => void;
  onCreateSellerCoupon: (coupon: Coupon) => void;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({
  products,
  orders,
  campaigns,
  seller,
  language,
  onAddProduct,
  onUpdateStock,
  onDeleteProduct,
  onUpdateOrderStatus,
  onHandleReturn,
  onCreateSellerCoupon
}) => {
  const t = translations[language];

  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'returns' | 'bhaav' | 'analytics' | 'coupons' | 'khata'>('inventory');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [csvText, setCsvText] = useState('');
  const [csvSuccess, setCsvSuccess] = useState(false);

  // Haat Khata Ledger State
  const [ledger, setLedger] = useState<LedgerEntry[]>(INITIAL_LEDGER_ENTRIES);
  const [showKhataModal, setShowKhataModal] = useState(false);
  const [khataCustomerName, setKhataCustomerName] = useState('');
  const [khataCustomerPhone, setKhataCustomerPhone] = useState('');
  const [khataAmount, setKhataAmount] = useState<number>(500);
  const [khataType, setKhataType] = useState<'credit_given' | 'payment_received'>('credit_given');
  const [khataDesc, setKhataDesc] = useState('');

  // Seller WhatsApp Number Setting
  const [sellerWhatsAppNum, setSellerWhatsAppNum] = useState(seller.phone || '919234725874');

  // Interactive Bhaav-Taav Inbox State
  const [bhaavOffers, setBhaavOffers] = useState([
    {
      id: 'offer-1',
      customerName: 'Aarav Sharma',
      productTitle: 'Handcrafted Moradabad Brass Peacock Diya',
      listedPrice: 1450,
      reservePrice: 1250,
      offeredPrice: 1300,
      status: 'pending' as 'pending' | 'accepted' | 'countered' | 'rejected',
      counterPrice: 1350,
      time: '12 mins ago'
    },
    {
      id: 'offer-2',
      customerName: 'Priya Iyer',
      productTitle: 'Pure Mulberry Kanchipuram Silk Saree',
      listedPrice: 8499,
      reservePrice: 7600,
      offeredPrice: 7800,
      status: 'pending' as 'pending' | 'accepted' | 'countered' | 'rejected',
      counterPrice: 8000,
      time: '25 mins ago'
    }
  ]);

  // New Product Form State
  const [nameEn, setNameEn] = useState('');
  const [nameHi, setNameHi] = useState('');
  const [brand, setBrand] = useState(seller.shopName.split(' ')[0] || 'Desi Brand');
  const [category, setCategory] = useState('catKirana');
  const [price, setPrice] = useState<number>(499);
  const [mrp, setMrp] = useState<number>(699);
  const [minBhaavPrice, setMinBhaavPrice] = useState<number>(420);
  const [stock, setStock] = useState<number>(50);
  const [isLocalStore, setIsLocalStore] = useState<boolean>(true);
  const [descriptionEn, setDescriptionEn] = useState('');
  const [descriptionHi, setDescriptionHi] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80');

  // Stock edit state
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [tempStockValue, setTempStockValue] = useState<number>(0);

  // Follower count state
  const [followers, setFollowers] = useState(seller.followersCount);
  const [isFollowing, setIsFollowing] = useState(false);

  // Coupon creation
  const [couponCode, setCouponCode] = useState('');
  const [couponVal, setCouponVal] = useState(50);
  const [couponMinCart, setCouponMinCart] = useState(499);

  // Seller's products
  const sellerProducts = products.filter(p => p.sellerId === seller.id || p.sellerName === seller.shopName);
  const lowStockProducts = sellerProducts.filter(p => p.stock <= 5);

  // Return requests on orders
  const pendingReturns = orders.filter(o => o.returnRequest && o.returnRequest.status === 'pending');

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameEn.trim()) return;

    onAddProduct({
      name: nameEn.trim(),
      nameHi: nameHi.trim() || nameEn.trim(),
      brand: brand.trim() || 'Indian Artisan',
      category,
      price,
      mrp,
      minBhaavPrice,
      stock,
      isLocalStore,
      localStoreName: seller.shopName,
      localStoreCity: seller.city,
      sellerId: seller.id,
      sellerName: seller.shopName,
      description: descriptionEn || nameEn,
      descriptionHi: descriptionHi || nameHi || nameEn,
      features: ['Genuine Indian produce / craft', 'Audited quality standards', 'GST invoice included'],
      featuresHi: ['प्रामाणिक भारतीय उत्पाद', 'सख्त गुणवत्ता मानक', 'जीएसटी बिलिंग सहित'],
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80',
      images: [imageUrl.trim() || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80'],
      status: 'active'
    });

    setShowAddModal(false);
    setNameEn('');
    setNameHi('');
  };

  const handleCsvImport = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = csvText.trim().split('\n');
    let imported = 0;

    lines.forEach((line, idx) => {
      if (idx === 0 && line.toLowerCase().includes('name')) return; // skip header
      const parts = line.split(',');
      if (parts.length >= 4) {
        const [name, priceStr, mrpStr, stockStr] = parts.map(s => s.trim());
        const pPrice = parseInt(priceStr, 10) || 499;
        const pMrp = parseInt(mrpStr, 10) || 699;
        const pStock = parseInt(stockStr, 10) || 20;

        onAddProduct({
          name,
          nameHi: name,
          brand: seller.shopName.split(' ')[0] || 'Desi Brand',
          category: 'catKirana',
          price: pPrice,
          mrp: pMrp,
          minBhaavPrice: Math.round(pPrice * 0.85),
          stock: pStock,
          isLocalStore: true,
          localStoreName: seller.shopName,
          localStoreCity: seller.city,
          sellerId: seller.id,
          sellerName: seller.shopName,
          description: `${name} supplied fresh from ${seller.shopName}.`,
          descriptionHi: `${name} ताज़ा स्थानीय आपूर्ति।`,
          features: ['Local store partner supply', 'Fresh batch stock'],
          featuresHi: ['स्थानीय स्टोर आपूर्ति'],
          imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80',
          images: ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80'],
          status: 'active'
        });
        imported++;
      }
    });

    if (imported > 0) {
      setCsvSuccess(true);
      setTimeout(() => {
        setCsvSuccess(false);
        setShowCsvModal(false);
        setCsvText('');
      }, 1200);
    }
  };

  const handleShareWhatsAppCatalog = () => {
    let text = `*${seller.shopName}* - Official WhatsApp Storefront Catalog\n`;
    text += `Location: ${seller.city}, ${seller.state} (PIN: ${seller.pincode})\n`;
    text += `Rating: ★ ${seller.rating} • Cash on Delivery & Same-Day Dispatch Available!\n\n`;
    sellerProducts.forEach((p, idx) => {
      text += `${idx + 1}. *${p.name}* - ${formatINR(p.price)} (MRP: ${formatINR(p.mrp)})\n`;
    });
    text += `\nOrder directly on Haat or reply to place order!`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCreateSellerCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    onCreateSellerCoupon({
      code: couponCode.trim().toUpperCase(),
      discountType: 'flat',
      discountValue: couponVal,
      minCartAmount: couponMinCart,
      expiryDate: '2026-12-31',
      usageLimit: 500,
      timesUsed: 0,
      sellerId: seller.id,
      createdBy: seller.id,
      isActive: true
    });

    setCouponCode('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn space-y-6">
      {/* Seller Header & Profile Banner */}
      <div className="bg-surface dark:bg-charcoal-800 border border-subtle rounded p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={seller.shopPhoto}
            alt={seller.shopName}
            className="w-16 h-16 object-cover rounded border border-subtle shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-heading font-bold text-ink dark:text-zinc-100">
                {seller.shopName}
              </h1>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                KYC Verified
              </span>
            </div>
            <p className="text-xs text-ink-muted">
              {seller.ownerName} • {seller.city}, {seller.state} ({seller.pincode}) • Rating: ★ <strong>{seller.rating}</strong>
            </p>
            <p className="text-[11px] text-ink-light font-mono mt-0.5">
              GSTIN: {seller.gstin || '27AABCP1122M1ZP'} • PAN: {seller.pan}
            </p>
          </div>
        </div>

        {/* Action Buttons: Follower counter & WhatsApp Catalog Link */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsFollowing(!isFollowing);
              setFollowers(prev => isFollowing ? prev - 1 : prev + 1);
            }}
            className={`py-1.5 px-3 rounded text-xs font-semibold uppercase tracking-wider transition ${
              isFollowing
                ? 'bg-brass text-slate-deep'
                : 'bg-concrete dark:bg-charcoal-700 text-ink dark:text-zinc-200 border border-subtle'
            }`}
          >
            {isFollowing ? 'Following' : 'Follow Shop'} ({followers})
          </button>

          <button
            onClick={handleShareWhatsAppCatalog}
            className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>WhatsApp Catalog</span>
          </button>
        </div>
      </div>

      {/* Low Stock Alert Strip if any */}
      {lowStockProducts.length > 0 && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Low Stock Alert:</strong> {lowStockProducts.length} product(s) have 5 or fewer items remaining.
            </span>
          </div>
          <button
            onClick={() => setActiveTab('inventory')}
            className="text-amber-800 dark:text-amber-300 font-semibold underline text-[11px]"
          >
            Review Stock
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-subtle pb-2 text-xs font-semibold uppercase">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`py-2 px-3 rounded transition ${activeTab === 'inventory' ? 'bg-slate-deep text-white' : 'text-ink-muted hover:text-ink'}`}
        >
          Catalog ({sellerProducts.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`py-2 px-3 rounded transition ${activeTab === 'orders' ? 'bg-slate-deep text-white' : 'text-ink-muted hover:text-ink'}`}
        >
          Customer Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('returns')}
          className={`py-2 px-3 rounded transition ${activeTab === 'returns' ? 'bg-slate-deep text-white' : 'text-ink-muted hover:text-ink'}`}
        >
          Return Requests ({pendingReturns.length})
        </button>
        <button
          onClick={() => setActiveTab('bhaav')}
          className={`py-2 px-3 rounded transition ${activeTab === 'bhaav' ? 'bg-slate-deep text-white' : 'text-ink-muted hover:text-ink'}`}
        >
          Bhaav-Taav Inbox
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`py-2 px-3 rounded transition ${activeTab === 'analytics' ? 'bg-slate-deep text-white' : 'text-ink-muted hover:text-ink'}`}
        >
          Sales Charts
        </button>
        <button
          onClick={() => setActiveTab('coupons')}
          className={`py-2 px-3 rounded transition ${activeTab === 'coupons' ? 'bg-slate-deep text-white' : 'text-ink-muted hover:text-ink'}`}
        >
          Shop Coupons
        </button>
        <button
          onClick={() => setActiveTab('khata')}
          className={`py-2 px-3 rounded transition ${activeTab === 'khata' ? 'bg-slate-deep text-white' : 'text-ink-muted hover:text-ink'}`}
        >
          Haat Khata ({ledger.length})
        </button>
      </div>

      {/* TAB 1: Inventory & CSV Upload */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-heading font-semibold uppercase tracking-wider text-xs text-ink dark:text-zinc-200">
              Your Products & Variant Pricing
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setShowVoiceModal(true);
                  setVoiceTranscript('');
                }}
                className="py-1.5 px-3 bg-brass-light dark:bg-brass/10 hover:border-brass border border-brass/50 text-slate-deep dark:text-brass text-xs font-semibold uppercase rounded flex items-center gap-1.5 transition"
              >
                <Mic className="w-3.5 h-3.5 text-brass" />
                <span>Hindi Voice Listing</span>
              </button>
              <button
                onClick={() => setShowCsvModal(true)}
                className="py-1.5 px-3 bg-concrete dark:bg-charcoal-700 hover:border-brass border border-subtle text-ink dark:text-zinc-200 text-xs font-semibold uppercase rounded flex items-center gap-1.5 transition"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-brass" />
                <span>Bulk CSV Upload</span>
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="py-1.5 px-3 bg-slate-deep hover:bg-slate-hover text-white text-xs font-semibold uppercase rounded flex items-center gap-1.5 transition"
              >
                <PlusCircle className="w-3.5 h-3.5 text-brass" />
                <span>Add Product</span>
              </button>
            </div>
          </div>

          <div className="bg-surface dark:bg-charcoal-800 border border-subtle rounded overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="bg-concrete/60 dark:bg-charcoal-900 border-b border-subtle text-ink-muted uppercase">
                <tr>
                  <th className="p-3">Product</th>
                  <th className="p-3">Price / MRP</th>
                  <th className="p-3">Min Bhaav Reserve</th>
                  <th className="p-3">Stock Units</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-subtle">
                {sellerProducts.map(p => (
                  <tr key={p.id}>
                    <td className="p-3 flex items-center gap-3">
                      <img src={p.imageUrl} alt="" className="w-9 h-9 object-cover rounded border" />
                      <div className="max-w-xs truncate">
                        <p className="font-semibold truncate">{p.name}</p>
                        <span className="text-[10px] text-ink-muted">{p.category}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="font-bold text-slate-deep dark:text-brass">{formatINR(p.price)}</span>
                      <span className="text-[10px] text-ink-light line-through ml-1.5">{formatINR(p.mrp)}</span>
                    </td>
                    <td className="p-3 font-mono text-emerald-700 font-semibold">{formatINR(p.minBhaavPrice)}</td>
                    <td className="p-3">
                      {editingStockId === p.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={tempStockValue}
                            onChange={(e) => setTempStockValue(parseInt(e.target.value, 10) || 0)}
                            className="w-16 px-1.5 py-0.5 bg-surface dark:bg-charcoal-700 border rounded font-mono"
                          />
                          <button onClick={() => { onUpdateStock(p.id, tempStockValue); setEditingStockId(null); }} className="text-emerald-600">
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className={`font-mono font-bold ${p.stock <= 5 ? 'text-brick' : ''}`}>{p.stock}</span>
                          <button onClick={() => { setEditingStockId(p.id); setTempStockValue(p.stock); }} className="text-ink-muted hover:text-ink">
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <button onClick={() => onDeleteProduct(p.id)} className="text-ink-muted hover:text-brick">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Customer Orders Management */}
      {activeTab === 'orders' && (
        <div className="space-y-3 text-xs">
          <h3 className="font-heading font-semibold uppercase tracking-wider text-ink dark:text-zinc-200">
            Marketplace Orders for Your Fulfillment
          </h3>

          <div className="space-y-3">
            {orders.map(ord => (
              <div key={ord.id} className="p-4 bg-surface dark:bg-charcoal-800 border border-subtle rounded space-y-2.5">
                <div className="flex justify-between items-center border-b border-subtle pb-2">
                  <div>
                    <span className="font-mono font-bold text-slate-deep dark:text-brass text-sm">{ord.id}</span>
                    <span className="text-ink-muted ml-2">{formatDate(ord.createdAt, language)}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span>Status:</span>
                    <select
                      value={ord.status}
                      onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as Order['status'])}
                      className="px-2 py-1 bg-concrete dark:bg-charcoal-700 border border-subtle rounded font-semibold text-xs"
                    >
                      <option value="placed">Placed</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="packed">Packed</option>
                      <option value="shipped">Shipped</option>
                      <option value="out_for_delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    {/* WhatsApp Customer Update Link */}
                    <a
                      href={buildSellerCustomerWhatsAppUrl({
                        customerPhone: ord.customerPhone,
                        customerName: ord.customerName,
                        orderNumber: ord.id,
                        status: (ord.status === 'placed' ? 'confirmed' : ord.status) as any,
                        deliveryOtp: ord.deliveryOtp || '748291',
                        shopName: currentSeller.shopName,
                        pickupAddress: currentSeller.address,
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-1 px-2.5 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded font-semibold text-xs flex items-center gap-1 transition"
                      title="Send status notification to customer via WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Message Customer</span>
                    </a>
                  </div>
                </div>

                <div className="text-[11px] text-ink-muted">
                  Customer: <strong>{ord.customerName}</strong> (+91 {ord.customerPhone}) • Address: {ord.shippingAddress.addressLine}, {ord.shippingAddress.city} ({ord.shippingAddress.pincode})
                </div>

                <div className="space-y-1">
                  {ord.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-xs">
                      <span>{it.productName} x {it.quantity}</span>
                      <span className="font-mono">{formatINR(it.price * it.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-subtle flex justify-between font-bold">
                  <span>Payment (Collect at Doorstep): {ord.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Doorstep UPI QR'}</span>
                  <span className="text-slate-deep dark:text-brass">{formatINR(ord.finalTotal)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Return Requests Management */}
      {activeTab === 'returns' && (
        <div className="space-y-3 text-xs">
          <h3 className="font-heading font-semibold uppercase tracking-wider text-ink dark:text-zinc-200">
            Customer 7-Day Return & Replacement Requests
          </h3>

          {pendingReturns.length === 0 ? (
            <div className="p-8 text-center text-xs text-ink-muted border border-dashed rounded">
              No pending return requests. All customers are satisfied!
            </div>
          ) : (
            pendingReturns.map(ord => (
              <div key={ord.id} className="p-4 bg-surface dark:bg-charcoal-800 border border-subtle rounded space-y-2">
                <div className="flex justify-between font-bold">
                  <span>Order {ord.id} - Customer: {ord.customerName}</span>
                  <span className="text-amber-700 uppercase">{ord.returnRequest?.type} Request</span>
                </div>
                <p className="text-ink-muted">
                  Reason cited: <strong>{ord.returnRequest?.reason}</strong>
                </p>
                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => onHandleReturn(ord.id, true)}
                    className="py-1 px-3 bg-emerald-700 text-white rounded font-semibold text-xs"
                  >
                    Approve Return & Dispatch Courier Pickup
                  </button>
                  <button
                    onClick={() => onHandleReturn(ord.id, false)}
                    className="py-1 px-3 bg-brick text-white rounded font-semibold text-xs"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 4: Bhaav-Taav Inbox */}
      {activeTab === 'bhaav' && (
        <div className="space-y-4 text-xs">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-heading font-semibold uppercase tracking-wider text-ink dark:text-zinc-200">
                Live Bhaav-Taav Bargaining Inbox
              </h3>
              <p className="text-ink-muted">
                Customers negotiate live against your reserve floor. You can accept, counter-offer, or decline.
              </p>
            </div>
            <span className="text-[11px] font-mono px-2 py-1 bg-brass-light dark:bg-brass/20 text-slate-deep dark:text-brass rounded font-semibold">
              ⚡ 120 people bargained today
            </span>
          </div>

          <div className="space-y-3">
            {bhaavOffers.map((offer) => (
              <div
                key={offer.id}
                className="p-4 bg-surface dark:bg-charcoal-800 border border-subtle rounded space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-sm text-ink dark:text-zinc-100">{offer.customerName}</span>
                    <span className="text-ink-muted ml-2 text-[11px]">({offer.time})</span>
                    <p className="text-ink-muted font-medium mt-0.5">{offer.productTitle}</p>
                  </div>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      offer.status === 'accepted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : offer.status === 'countered'
                        ? 'bg-amber-100 text-amber-800'
                        : offer.status === 'rejected'
                        ? 'bg-brick-light text-brick'
                        : 'bg-concrete dark:bg-charcoal-700 text-ink dark:text-zinc-300'
                    }`}
                  >
                    {offer.status}
                  </span>
                </div>

                <div className="p-2.5 bg-concrete/60 dark:bg-charcoal-900 rounded border border-subtle grid grid-cols-3 gap-2 text-center">
                  <div>
                    <span className="text-ink-muted text-[10px] block">Listed Price</span>
                    <span className="font-bold text-ink dark:text-zinc-200">{formatINR(offer.listedPrice)}</span>
                  </div>
                  <div>
                    <span className="text-ink-muted text-[10px] block">Your Reserve Floor</span>
                    <span className="font-semibold text-ink-muted">{formatINR(offer.reservePrice)}</span>
                  </div>
                  <div>
                    <span className="text-brass text-[10px] block font-bold">Buyer Offered</span>
                    <span className="font-extrabold text-sm text-slate-deep dark:text-brass">
                      {formatINR(offer.offeredPrice)}
                    </span>
                  </div>
                </div>

                {offer.status === 'pending' ? (
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() =>
                        setBhaavOffers((prev) =>
                          prev.map((o) => (o.id === offer.id ? { ...o, status: 'accepted' } : o))
                        )
                      }
                      className="py-1.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-semibold text-xs flex items-center gap-1 transition"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Accept ({formatINR(offer.offeredPrice)})</span>
                    </button>
                    <button
                      onClick={() =>
                        setBhaavOffers((prev) =>
                          prev.map((o) => (o.id === offer.id ? { ...o, status: 'countered' } : o))
                        )
                      }
                      className="py-1.5 px-3 bg-slate-deep hover:bg-slate-hover text-white rounded font-semibold text-xs flex items-center gap-1 transition"
                    >
                      <span>Counter-Offer ({formatINR(offer.counterPrice)})</span>
                    </button>
                    <button
                      onClick={() =>
                        setBhaavOffers((prev) =>
                          prev.map((o) => (o.id === offer.id ? { ...o, status: 'rejected' } : o))
                        )
                      }
                      className="py-1.5 px-3 bg-concrete dark:bg-charcoal-700 hover:bg-brick-light text-brick rounded font-semibold text-xs transition"
                    >
                      Decline
                    </button>
                  </div>
                ) : (
                  <p className="text-[11px] text-ink-muted italic">
                    {offer.status === 'accepted' && 'Deal locked in customer cart for 24 hours at the agreed price.'}
                    {offer.status === 'countered' && `Counter-offer of ${formatINR(offer.counterPrice)} sent to customer.`}
                    {offer.status === 'rejected' && 'Offer declined below reserve threshold.'}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Sales Charts */}
      {activeTab === 'analytics' && (
        <div className="space-y-4 text-xs">
          <h3 className="font-heading font-semibold uppercase tracking-wider text-ink dark:text-zinc-200">
            Daily Sales Volume & Product Performance
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-surface dark:bg-charcoal-800 border border-subtle rounded space-y-3">
              <span className="font-bold text-xs uppercase tracking-wider block">7-Day Revenue Trend</span>
              <div className="flex items-end gap-3 h-32 pt-4 border-b border-subtle px-2">
                {[
                  { day: 'Mon', h: '40%', val: '₹4.2k' },
                  { day: 'Tue', h: '65%', val: '₹6.8k' },
                  { day: 'Wed', h: '50%', val: '₹5.1k' },
                  { day: 'Thu', h: '80%', val: '₹8.4k' },
                  { day: 'Fri', h: '70%', val: '₹7.3k' },
                  { day: 'Sat', h: '95%', val: '₹10.2k' },
                  { day: 'Sun', h: '85%', val: '₹9.1k' }
                ].map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-brass/80 hover:bg-brass rounded-t transition" style={{ height: bar.h }} />
                    <span className="text-[10px] text-ink-muted">{bar.day}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-surface dark:bg-charcoal-800 border border-subtle rounded space-y-3">
              <span className="font-bold text-xs uppercase tracking-wider block">Top Selling Products</span>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Kashmiri Organic Mogra Saffron</span>
                  <strong className="text-slate-deep dark:text-brass">38 units</strong>
                </div>
                <div className="flex justify-between">
                  <span>A2 Vedic Bilona Gir Cow Ghee</span>
                  <strong className="text-slate-deep dark:text-brass">84 units</strong>
                </div>
                <div className="flex justify-between">
                  <span>MP Sharbati Atta 10kg</span>
                  <strong className="text-slate-deep dark:text-brass">64 units</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: Shop Coupons */}
      {activeTab === 'coupons' && (
        <div className="space-y-4 text-xs">
          <form onSubmit={handleCreateSellerCoupon} className="p-4 bg-surface dark:bg-charcoal-800 border border-subtle rounded space-y-3 max-w-md">
            <h3 className="font-heading font-semibold uppercase tracking-wider text-ink dark:text-zinc-200">
              Create Seller Coupon
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="e.g. KIRANA50"
                className="px-2.5 py-1.5 bg-concrete dark:bg-charcoal-700 border rounded uppercase font-mono font-bold"
                required
              />
              <input
                type="number"
                value={couponVal}
                onChange={(e) => setCouponVal(parseInt(e.target.value, 10) || 0)}
                placeholder="Discount ₹"
                className="px-2.5 py-1.5 bg-concrete dark:bg-charcoal-700 border rounded font-mono"
                required
              />
            </div>
            <input
              type="number"
              value={couponMinCart}
              onChange={(e) => setCouponMinCart(parseInt(e.target.value, 10) || 0)}
              placeholder="Min Cart Amount ₹"
              className="w-full px-2.5 py-1.5 bg-concrete dark:bg-charcoal-700 border rounded font-mono"
              required
            />
            <button type="submit" className="w-full py-2 bg-slate-deep text-white font-semibold uppercase rounded">
              Launch Seller Coupon
            </button>
          </form>
        </div>
      )}

      {/* TAB 7: Haat Khata (Shopkeeper Credit Ledger) */}
      {activeTab === 'khata' && (
        <div className="space-y-4 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-heading font-semibold uppercase tracking-wider text-ink dark:text-zinc-200 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-brass" />
                <span>Haat Khata (खाता बही)</span>
              </h3>
              <p className="text-ink-muted text-[11px]">
                Record credit given to regular customers and send polite WhatsApp reminders.
              </p>
            </div>
            <button
              onClick={() => setShowKhataModal(true)}
              className="py-1.5 px-3 bg-slate-deep hover:bg-slate-hover text-white text-xs font-semibold uppercase rounded flex items-center gap-1.5 transition"
            >
              <PlusCircle className="w-3.5 h-3.5 text-brass" />
              <span>Add Khata Entry</span>
            </button>
          </div>

          {/* Legal Compliance Disclaimer Banner */}
          <div className="p-2.5 bg-concrete dark:bg-charcoal-700/60 border border-subtle rounded text-[11px] text-ink-muted dark:text-zinc-300 flex items-center gap-2">
            <span className="font-bold text-slate-deep dark:text-brass">Legal Notice:</span>
            <span>Haat Khata is strictly for shopkeeper record-keeping and bookkeeping. No lending, credit financing, or interest is provided.</span>
          </div>

          <div className="bg-surface dark:bg-charcoal-800 border border-subtle rounded overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-concrete/60 dark:bg-charcoal-900 border-b border-subtle text-ink-muted uppercase">
                <tr>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Notes</th>
                  <th className="p-3 text-right">WhatsApp Reminder</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-subtle">
                {ledger.map((entry) => {
                  const reminderText = `नमस्ते ${entry.customerName} जी! ${seller.shopName} से आपका पुराना बकाया ₹${entry.amount.toLocaleString('en-IN')} है। कृपया सुविधानुसार भुगतान करें। धन्यवाद!`;
                  const reminderUrl = `https://wa.me/${normalizeWhatsAppNumber(entry.customerPhone)}?text=${encodeURIComponent(reminderText)}`;

                  return (
                    <tr key={entry.id}>
                      <td className="p-3 font-semibold text-ink dark:text-zinc-200">{entry.customerName}</td>
                      <td className="p-3 font-mono text-ink-muted">+91 {entry.customerPhone}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          entry.type === 'credit_given'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
                        }`}>
                          {entry.type === 'credit_given' ? 'उधार दिया (Credit)' : 'भुगतान मिला (Paid)'}
                        </span>
                      </td>
                      <td className="p-3 font-mono font-bold text-slate-deep dark:text-brass">
                        {formatINR(entry.amount)}
                      </td>
                      <td className="p-3 text-ink-muted max-w-xs truncate">{entry.description}</td>
                      <td className="p-3 text-right">
                        {entry.type === 'credit_given' && (
                          <a
                            href={reminderUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-1 px-2.5 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded text-[11px] font-semibold inline-flex items-center gap-1 transition"
                          >
                            <Send className="w-3 h-3 text-emerald-600" />
                            <span>Send Reminder</span>
                          </a>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bulk CSV Upload Modal */}
      {showCsvModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-surface dark:bg-charcoal-800 border border-subtle rounded p-5 space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm">Bulk Inventory CSV Importer</h3>
              <button onClick={() => setShowCsvModal(false)} className="text-ink-muted"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-ink-muted text-[11px]">
              Format: <code>Product Name, Price, MRP, Stock</code> (one per line)
            </p>
            {csvSuccess ? (
              <p className="text-emerald-700 font-bold">Products imported successfully into catalog!</p>
            ) : (
              <form onSubmit={handleCsvImport} className="space-y-3">
                <textarea
                  rows={5}
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  placeholder={`Organic Mustard Oil 1L, 210, 260, 40\nPure Wild Honey 500g, 399, 499, 25`}
                  className="w-full p-2 bg-concrete dark:bg-charcoal-700 border border-subtle rounded font-mono text-[11px]"
                  required
                />
                <button type="submit" className="w-full py-2 bg-slate-deep text-white font-semibold uppercase rounded">
                  Import CSV Rows
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-surface dark:bg-charcoal-800 border border-subtle rounded p-5 max-h-[90vh] flex flex-col overflow-hidden text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-subtle">
              <h3 className="font-bold text-sm">Add New Product to Catalog</h3>
              <button onClick={() => setShowAddModal(false)}><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleCreateProduct} className="p-1 overflow-y-auto space-y-3 flex-1 mt-2">
              <input
                type="text"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="Product Name (English) *"
                className="w-full px-2.5 py-1.5 bg-concrete dark:bg-charcoal-700 border rounded"
                required
              />
              <input
                type="text"
                value={nameHi}
                onChange={(e) => setNameHi(e.target.value)}
                placeholder="Product Name (Hindi)"
                className="w-full px-2.5 py-1.5 bg-concrete dark:bg-charcoal-700 border rounded"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Brand Name *"
                  className="px-2.5 py-1.5 bg-concrete dark:bg-charcoal-700 border rounded"
                  required
                />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="px-2.5 py-1.5 bg-concrete dark:bg-charcoal-700 border rounded"
                >
                  <option value="catKirana">Local Kirana</option>
                  <option value="catSpices">Spices & Dry Fruits</option>
                  <option value="catTech">Mobiles & Tech</option>
                  <option value="catFashion">Fashion & Handlooms</option>
                  <option value="catHome">Home & Kitchen</option>
                  <option value="catCrafts">Indian Crafts & Decor</option>
                  <option value="catWellness">Ayurveda & Wellness</option>
                  <option value="catBooks">Books & Stationery</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(parseInt(e.target.value, 10) || 0)}
                  placeholder="Selling Price ₹"
                  className="px-2 py-1.5 bg-concrete dark:bg-charcoal-700 border rounded font-mono"
                  required
                />
                <input
                  type="number"
                  value={mrp}
                  onChange={(e) => setMrp(parseInt(e.target.value, 10) || 0)}
                  placeholder="MRP ₹"
                  className="px-2 py-1.5 bg-concrete dark:bg-charcoal-700 border rounded font-mono"
                  required
                />
                <input
                  type="number"
                  value={minBhaavPrice}
                  onChange={(e) => setMinBhaavPrice(parseInt(e.target.value, 10) || 0)}
                  placeholder="Min Bhaav ₹"
                  className="px-2 py-1.5 bg-concrete dark:bg-charcoal-700 border border-brass/50 rounded font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(parseInt(e.target.value, 10) || 0)}
                  placeholder="Stock Units"
                  className="px-2.5 py-1.5 bg-concrete dark:bg-charcoal-700 border rounded font-mono"
                  required
                />
                <label className="flex items-center gap-1.5 text-[11px] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isLocalStore}
                    onChange={(e) => setIsLocalStore(e.target.checked)}
                    className="text-brass"
                  />
                  <span>Flag as Local Store (Same-Day)</span>
                </label>
              </div>

              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Product Image URL"
                className="w-full px-2.5 py-1.5 bg-concrete dark:bg-charcoal-700 border rounded"
              />

              <button type="submit" className="w-full py-2 bg-slate-deep text-white font-semibold uppercase rounded">
                Save & Publish Product
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Hindi Voice Listing Modal */}
      {showVoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-surface dark:bg-charcoal-800 border border-subtle rounded p-5 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-subtle pb-2">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-brass" />
                <h3 className="font-bold text-sm text-ink dark:text-zinc-100">
                  Hindi Voice Product Listing (आवाज़ से लिस्टिंग)
                </h3>
              </div>
              <button onClick={() => setShowVoiceModal(false)}><X className="w-4 h-4" /></button>
            </div>

            <p className="text-ink-muted text-[11px]">
              विक्रेता उत्पाद का नाम, मात्रा और कीमत बोलें। सिस्टम स्वतः ड्राफ्ट लिस्टिंग तैयार कर देगा:
            </p>

            {/* Simulated Voice Recognition / Presets */}
            <div className="p-4 bg-concrete/60 dark:bg-charcoal-900 rounded border border-subtle text-center space-y-3">
              <button
                type="button"
                onClick={() => {
                  setIsListeningVoice(!isListeningVoice);
                  if (!isListeningVoice) {
                    setVoiceTranscript('कश्मीरी मोगरा केसर, 15 डब्बे, 1850 रुपये (न्यूनतम 1650)');
                  }
                }}
                className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center transition ${
                  isListeningVoice
                    ? 'bg-brick text-white animate-pulse'
                    : 'bg-brass text-slate-deep hover:scale-105'
                }`}
              >
                <Mic className="w-6 h-6" />
              </button>
              <span className="text-[11px] font-semibold text-slate-deep dark:text-brass block">
                {isListeningVoice ? 'Listening in Hindi (hi-IN)... बोलिए' : 'Tap to Speak in Hindi / English'}
              </span>

              {voiceTranscript && (
                <div className="p-2.5 bg-surface dark:bg-charcoal-800 rounded border border-brass/40 text-left text-xs font-mono space-y-1">
                  <span className="text-[10px] text-ink-muted uppercase block">Transcribed & Parsed:</span>
                  <p className="text-ink dark:text-zinc-100 font-bold">"{voiceTranscript}"</p>
                  <div className="pt-1 text-[11px] grid grid-cols-3 gap-1 text-ink-muted">
                    <span>Item: <strong>Kashmiri Kesar</strong></span>
                    <span>Stock: <strong>15 units</strong></span>
                    <span>Price: <strong>₹1,850</strong></span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1 text-[11px] text-ink-muted">
              <span className="font-semibold block text-slate-deep dark:text-brass">उदाहरण (Try Preset):</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'शुद्ध गिर गाय घी, 25 बोतल, 1750 रुपये',
                  'मुरादाबाद पीतल थाली, 10 पीस, 1450 रुपये',
                  'चंदेरी सिल्क कुर्ता, 12 पीस, 2199 रुपये'
                ].map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setVoiceTranscript(sample)}
                    className="p-1 px-2 bg-concrete dark:bg-charcoal-700 hover:border-brass border border-subtle rounded text-[10px]"
                  >
                    "{sample}"
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              disabled={!voiceTranscript}
              onClick={() => {
                onAddProduct({
                  name: 'Kashmiri Organic Mogra Kesar (Voice Listed)',
                  nameHi: 'कश्मीरी ऑर्गेनिक मोगरा केसर (आवाज़ से लिस्टेड)',
                  category: 'catSpices',
                  price: 1850,
                  mrp: 2300,
                  minBhaavPrice: 1650,
                  stock: 15,
                  isLocalStore: true,
                  deliveryDays: 0,
                  brand: seller.shopName.split(' ')[0] || 'Desi Brand',
                  sellerId: seller.id,
                  sellerName: seller.shopName,
                  imageUrl: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=800&auto=format&fit=crop&q=80',
                  description: 'Authentic Kashmiri saffron listed via voice recognition.',
                  descriptionHi: 'आवाज़ पहचान तकनीक द्वारा लिस्टेड प्रामाणिक कश्मीरी केसर।'
                });
                setShowVoiceModal(false);
                setVoiceTranscript('');
              }}
              className="w-full py-2 bg-slate-deep hover:bg-slate-hover text-white text-xs font-semibold uppercase rounded disabled:opacity-50 transition"
            >
              Confirm & Add Voice Listing to Catalog
            </button>
          </div>
        </div>
      )}

      {/* Haat Khata Add Entry Modal */}
      {showKhataModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm bg-surface dark:bg-charcoal-800 border border-subtle rounded p-5 space-y-3 text-xs">
            <div className="flex justify-between items-center border-b border-subtle pb-2">
              <h3 className="font-bold text-sm">Add Haat Khata Entry</h3>
              <button onClick={() => setShowKhataModal(false)}><X className="w-4 h-4" /></button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const newEntry: LedgerEntry = {
                  id: `led-${Date.now()}`,
                  sellerId: seller.id,
                  customerName: khataCustomerName,
                  customerPhone: khataCustomerPhone,
                  amount: khataAmount,
                  type: khataType,
                  description: khataDesc || 'General neighborhood purchase',
                  date: new Date().toISOString().split('T')[0]
                };
                setLedger((prev) => [newEntry, ...prev]);
                setShowKhataModal(false);
                setKhataCustomerName('');
                setKhataCustomerPhone('');
                setKhataDesc('');
              }}
              className="space-y-3"
            >
              <input
                type="text"
                value={khataCustomerName}
                onChange={(e) => setKhataCustomerName(e.target.value)}
                placeholder="Regular Customer Name *"
                className="w-full px-2.5 py-1.5 bg-concrete dark:bg-charcoal-700 border rounded"
                required
              />
              <input
                type="tel"
                maxLength={10}
                value={khataCustomerPhone}
                onChange={(e) => setKhataCustomerPhone(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="10-Digit Mobile Phone *"
                className="w-full px-2.5 py-1.5 bg-concrete dark:bg-charcoal-700 border rounded font-mono"
                required
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={khataAmount}
                  onChange={(e) => setKhataAmount(parseInt(e.target.value, 10) || 0)}
                  placeholder="Amount ₹"
                  className="px-2.5 py-1.5 bg-concrete dark:bg-charcoal-700 border rounded font-mono"
                  required
                />
                <select
                  value={khataType}
                  onChange={(e) => setKhataType(e.target.value as any)}
                  className="px-2 py-1.5 bg-concrete dark:bg-charcoal-700 border rounded"
                >
                  <option value="credit_given">उधार दिया (Credit)</option>
                  <option value="payment_received">भुगतान मिला (Paid)</option>
                </select>
              </div>
              <input
                type="text"
                value={khataDesc}
                onChange={(e) => setKhataDesc(e.target.value)}
                placeholder="Items / Description (e.g. 5kg Atta + Spices)"
                className="w-full px-2.5 py-1.5 bg-concrete dark:bg-charcoal-700 border rounded"
              />
              <button
                type="submit"
                className="w-full py-2 bg-slate-deep hover:bg-slate-hover text-white text-xs font-semibold uppercase rounded transition"
              >
                Record in Ledger
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
