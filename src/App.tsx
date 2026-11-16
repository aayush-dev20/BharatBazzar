import React, { useState, useEffect } from 'react';
import {
  Product,
  Review,
  ProductQA,
  Order,
  ScratchCard,
  SponsorCampaign,
  Language,
  OrderItem,
  UserSession,
  Coupon,
  MohallaGroupBuy,
  SellerProfile,
  FestivalTheme,
  NotificationItem,
  ReturnRequest,
  ProductVariant
} from './types';
import { Storage } from './utils/storage';
import { translations } from './data/translations';
import { formatINR, calculateDiscount } from './utils/formatters';

// Components
import { Header } from './components/Header';
import { CategoryBar } from './components/CategoryBar';
import { HeroBanner } from './components/HeroBanner';
import { TrustRow } from './components/TrustRow';
import { DealOfTheDay } from './components/DealOfTheDay';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { BhaavTaavModal } from './components/BhaavTaavModal';
import { ScratchCardModal } from './components/ScratchCardModal';
import { ScratchHub } from './components/ScratchHub';
import { SponsorPortalModal } from './components/SponsorPortalModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { OrdersModal } from './components/OrdersModal';
import { SellerDashboard } from './components/SellerDashboard';
import { AdminPanel } from './components/AdminPanel';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { CompareModal } from './components/CompareModal';
import { MohallaGroupBuyModal } from './components/MohallaGroupBuyModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { InvoiceModal } from './components/InvoiceModal';
import { HelpCentreModal } from './components/HelpCentreModal';
import { LegalModal } from './components/LegalModals';
import { CommunityModal } from './components/CommunityModal';
import { Footer } from './components/Footer';

// Icons
import {
  SlidersHorizontal,
  ArrowUpDown,
  Zap,
  RotateCcw,
  Sparkles,
  Users,
  Flame,
  HelpCircle,
  Layers
} from 'lucide-react';

export const App: React.FC = () => {
  // Global persistent states
  const [products, setProducts] = useState<Product[]>(Storage.getProducts);
  const [reviews, setReviews] = useState<Review[]>(Storage.getReviews);
  const [qnas, setQnas] = useState<ProductQA[]>(Storage.getQnas);
  const [orders, setOrders] = useState<Order[]>(Storage.getOrders);
  const [scratchCards, setScratchCards] = useState<ScratchCard[]>(Storage.getScratchCards);
  const [sponsors, setSponsors] = useState<SponsorCampaign[]>(Storage.getSponsors);
  const [coupons, setCoupons] = useState<Coupon[]>(Storage.getCoupons);
  const [groupBuys, setGroupBuys] = useState<MohallaGroupBuy[]>(Storage.getGroupBuys);
  const [sellers, setSellers] = useState<SellerProfile[]>(Storage.getSellers);
  const [festivalTheme, setFestivalTheme] = useState<FestivalTheme>(Storage.getFestival);
  const [cart, setCart] = useState<OrderItem[]>(Storage.getCart);
  const [savedForLater, setSavedForLater] = useState<OrderItem[]>(Storage.getSavedForLater);
  const [notifications, setNotifications] = useState<NotificationItem[]>(Storage.getNotifications);
  const [pincode, setPincode] = useState<string>(Storage.getPincode);
  const [language, setLanguage] = useState<Language>(Storage.getLanguage);
  const [darkMode, setDarkMode] = useState<boolean>(Storage.getDarkMode);
  const [isLiteMode, setIsLiteMode] = useState<boolean>(false);
  const [user, setUser] = useState<UserSession>(Storage.getUser);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(Storage.getRecentlyViewed);

  // Active view: 'customer' | 'seller' | 'admin'
  const [currentMode, setCurrentMode] = useState<'customer' | 'seller' | 'admin'>('customer');

  // Filtering & Sorting
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [filterLocalOnly, setFilterLocalOnly] = useState<boolean>(false);
  const [filterInStockOnly, setFilterInStockOnly] = useState<boolean>(false);
  const [filterRating4Plus, setFilterRating4Plus] = useState<boolean>(false);
  const [selectedBrand, setSelectedBrand] = useState<string>('all');

  // Comparison list (up to 3 products)
  const [compareProductIds, setCompareProductIds] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);

  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [bhaavProduct, setBhaavProduct] = useState<Product | null>(null);
  const [activeScratchCard, setActiveScratchCard] = useState<ScratchCard | null>(null);
  const [showScratchHub, setShowScratchHub] = useState<boolean>(false);
  const [showSponsorPortal, setShowSponsorPortal] = useState<boolean>(false);
  const [showCartDrawer, setShowCartDrawer] = useState<boolean>(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);
  const [checkoutWalletDiscount, setCheckoutWalletDiscount] = useState<number>(0);
  const [checkoutAppliedCoupon, setCheckoutAppliedCoupon] = useState<Coupon | undefined>(undefined);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);
  const [showOrdersModal, setShowOrdersModal] = useState<boolean>(false);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [showMohallaModal, setShowMohallaModal] = useState<boolean>(false);
  const [showCommunityModal, setShowCommunityModal] = useState<boolean>(false);
  const [showNotificationsDrawer, setShowNotificationsDrawer] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [legalModalType, setLegalModalType] = useState<'terms' | 'privacy' | 'returns' | 'scratchAdvisory' | null>(null);

  const t = translations[language];

  // Sync dark mode class on root
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    Storage.saveDarkMode(darkMode);
  }, [darkMode]);

  // Persist storage whenever key states change
  useEffect(() => Storage.saveProducts(products), [products]);
  useEffect(() => Storage.saveReviews(reviews), [reviews]);
  useEffect(() => Storage.saveQnas(qnas), [qnas]);
  useEffect(() => Storage.saveOrders(orders), [orders]);
  useEffect(() => Storage.saveScratchCards(scratchCards), [scratchCards]);
  useEffect(() => Storage.saveSponsors(sponsors), [sponsors]);
  useEffect(() => Storage.saveCoupons(coupons), [coupons]);
  useEffect(() => Storage.saveGroupBuys(groupBuys), [groupBuys]);
  useEffect(() => Storage.saveSellers(sellers), [sellers]);
  useEffect(() => Storage.saveFestival(festivalTheme), [festivalTheme]);
  useEffect(() => Storage.saveUser(user), [user]);
  useEffect(() => Storage.saveCart(cart), [cart]);
  useEffect(() => Storage.saveSavedForLater(savedForLater), [savedForLater]);
  useEffect(() => Storage.saveNotifications(notifications), [notifications]);
  useEffect(() => Storage.savePincode(pincode), [pincode]);
  useEffect(() => Storage.saveLanguage(language), [language]);
  useEffect(() => Storage.saveRecentlyViewed(recentlyViewed), [recentlyViewed]);

  // Wishlist handler
  const handleToggleWishlist = (productId: string) => {
    setUser(prev => {
      const isW = prev.wishlist.includes(productId);
      const nextW = isW ? prev.wishlist.filter(id => id !== productId) : [...prev.wishlist, productId];
      return { ...prev, wishlist: nextW };
    });
  };

  // Compare handler (up to 3)
  const handleToggleCompare = (prod: Product) => {
    setCompareProductIds(prev => {
      if (prev.includes(prod.id)) {
        return prev.filter(id => id !== prod.id);
      }
      if (prev.length >= 3) {
        alert('You can compare up to 3 products side by side.');
        return prev;
      }
      return [...prev, prod.id];
    });
  };

  // Select Product Detail
  const handleSelectProduct = (prod: Product) => {
    setSelectedProduct(prod);
    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== prod.id);
      return [prod.id, ...filtered].slice(0, 8);
    });
  };

  // Add to Cart handler
  const handleAddToCart = (prod: Product, quantity: number = 1, variant?: ProductVariant, bargainedPrice?: number) => {
    setCart(prev => {
      const priceToUse = bargainedPrice ?? (variant ? variant.price : prod.price);
      const mrpToUse = variant ? variant.mrp : prod.mrp;
      const key = variant ? `${prod.id}-${variant.id}` : prod.id;

      const existing = prev.find(item => item.productId === prod.id && item.variantId === variant?.id);
      if (existing) {
        return prev.map(item =>
          item.productId === prod.id && item.variantId === variant?.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
                price: priceToUse,
                wasBargained: !!bargainedPrice || item.wasBargained
              }
            : item
        );
      } else {
        const newItem: OrderItem = {
          productId: prod.id,
          productName: prod.name,
          productNameHi: prod.nameHi,
          variantId: variant?.id,
          variantLabel: variant ? (variant.size || variant.color) : undefined,
          price: priceToUse,
          mrp: mrpToUse,
          quantity,
          imageUrl: prod.imageUrl,
          isLocalStore: prod.isLocalStore,
          wasBargained: !!bargainedPrice,
          originalPrice: prod.price,
          sellerId: prod.sellerId
        };
        return [...prev, newItem];
      }
    });

    setShowCartDrawer(true);
  };

  const handleBuyNow = (prod: Product, variant?: ProductVariant) => {
    handleAddToCart(prod, 1, variant);
    setSelectedProduct(null);
    setShowCartDrawer(false);
    setShowCheckoutModal(true);
  };

  // Save for later
  const handleSaveForLater = (item: OrderItem) => {
    setCart(prev => prev.filter(i => !(i.productId === item.productId && i.variantId === item.variantId)));
    setSavedForLater(prev => [...prev, item]);
  };

  const handleMoveToCart = (item: OrderItem) => {
    setSavedForLater(prev => prev.filter(i => !(i.productId === item.productId && i.variantId === item.variantId)));
    setCart(prev => [...prev, item]);
  };

  // Update Cart Quantity
  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(item => item.productId !== productId));
    } else {
      setCart(prev =>
        prev.map(item => item.productId === productId ? { ...item, quantity } : item)
      );
    }
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  // Bhaav-Taav acceptance
  const handleAcceptBargain = (prod: Product, agreedPrice: number) => {
    handleAddToCart(prod, 1, undefined, agreedPrice);
    setBhaavProduct(null);
  };

  // Scratch card revealed
  const handleCardScratched = (cardId: string, amount: number) => {
    setScratchCards(prev =>
      prev.map(c =>
        c.id === cardId
          ? { ...c, isScratched: true, scratchedAt: new Date().toISOString() }
          : c
      )
    );
    setUser(prev => ({
      ...prev,
      walletBalance: prev.walletBalance + amount,
      scratchCardsDailyCount: prev.scratchCardsDailyCount + 1
    }));
  };

  // Order Placed handler (Strictly Cash on Delivery / Pay at Delivery by UPI QR)
  const handleOrderPlaced = (newOrder: Order) => {
    // 1. Decrement stock server-side
    setProducts(prev =>
      prev.map(prod => {
        const item = newOrder.items.find(i => i.productId === prod.id);
        if (item) {
          return { ...prod, stock: Math.max(0, prod.stock - item.quantity) };
        }
        return prod;
      })
    );

    // 2. Deduct used wallet discount
    if (newOrder.scratchRewardDiscount > 0) {
      setUser(prev => ({ ...prev, walletBalance: Math.max(0, prev.walletBalance - newOrder.scratchRewardDiscount) }));
    }

    // 3. Clear cart
    setCart([]);

    // 4. Save order to history
    setOrders(prev => [newOrder, ...prev]);

    // 5. Create in-app notification
    const orderNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: user.id,
      title: `Order ${newOrder.id} Placed!`,
      message: `Your Cash on Delivery order is confirmed. Delivery slot: ${newOrder.deliverySlotLabel}.`,
      type: 'order',
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [orderNotif, ...prev]);

    // 6. Give bonus scratch card
    const activeCamp = sponsors.find(c => c.status === 'active') || sponsors[0];
    if (activeCamp) {
      const bonusReward = [50, 75, 100, 150][Math.floor(Math.random() * 4)];
      const bonusCard: ScratchCard = {
        id: `sc-ord-${Date.now()}`,
        campaignId: activeCamp.id,
        sponsorName: activeCamp.brandName,
        sponsorCategory: activeCamp.category,
        rewardAmount: bonusReward,
        isScratched: false,
        tagline: 'Order Bonus: Thank you for shopping local on Haat!',
        taglineHi: 'ऑर्डर बोनस: हाट पर खरीदारी के लिए धन्यवाद!'
      };
      setScratchCards(prev => [bonusCard, ...prev]);
    }

    setShowCheckoutModal(false);
    setLastPlacedOrder(newOrder);
  };

  // Cancel order before shipping
  const handleCancelOrder = (orderId: string) => {
    setOrders(prev =>
      prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o)
    );
  };

  // Reorder past order
  const handleReorder = (order: Order) => {
    order.items.forEach(it => {
      const prod = products.find(p => p.id === it.productId);
      if (prod) {
        handleAddToCart(prod, it.quantity);
      }
    });
    setShowOrdersModal(false);
    setShowCartDrawer(true);
  };

  // Request 7-Day Return / Exchange
  const handleRequestReturn = (orderId: string, returnReq: ReturnRequest) => {
    setOrders(prev =>
      prev.map(o => o.id === orderId ? { ...o, returnRequest: returnReq } : o)
    );
    alert('Return / Exchange request submitted to seller. A courier pickup will be scheduled upon approval.');
  };

  // Join Mohalla Group Buy
  const handleJoinGroupBuy = (gbId: string, product: Product, discountedPrice: number) => {
    setGroupBuys(prev =>
      prev.map(gb => {
        if (gb.id === gbId) {
          const already = gb.members.some(m => m.userId === user.id);
          if (already) return gb;
          return {
            ...gb,
            joinedCount: gb.joinedCount + 1,
            members: [...gb.members, { userId: user.id, userName: user.name, joinedAt: new Date().toISOString() }]
          };
        }
        return gb;
      })
    );
    handleAddToCart(product, 1, undefined, discountedPrice);
    setShowMohallaModal(false);
  };

  // Q&A Question submission
  const handleAddQuestion = (productId: string, question: string) => {
    const newQ: ProductQA = {
      id: `qna-${Date.now()}`,
      productId,
      question,
      askedBy: user.name,
      askedAt: new Date().toISOString().split('T')[0],
      answers: []
    };
    setQnas(prev => [newQ, ...prev]);
  };

  // Review submission
  const handleAddReview = (newReview: Omit<Review, 'id' | 'date'>) => {
    const fullReview: Review = {
      ...newReview,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setReviews(prev => [fullReview, ...prev]);

    setProducts(prev =>
      prev.map(p => {
        if (p.id === newReview.productId) {
          const prodReviews = [...reviews.filter(r => r.productId === p.id), fullReview];
          const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
          return {
            ...p,
            rating: Math.round(avg * 10) / 10,
            reviewCount: prodReviews.length
          };
        }
        return p;
      })
    );
  };

  // Filter & Sort Products for Storefront
  const filteredProducts = products.filter(p => {
    if (p.status === 'removed') return false;
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (selectedBrand !== 'all' && p.brand !== selectedBrand) return false;
    if (filterLocalOnly && !p.isLocalStore) return false;
    if (filterInStockOnly && p.stock <= 0) return false;
    if (filterRating4Plus && p.rating < 4.0) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q) || p.nameHi.includes(q);
      const matchBrand = p.brand.toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      if (!matchName && !matchBrand && !matchCat) return false;
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'priceLow': return a.price - b.price;
      case 'priceHigh': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      case 'discount': return calculateDiscount(b.price, b.mrp) - calculateDiscount(a.price, a.mrp);
      default: return 0;
    }
  });

  // Brands list
  const uniqueBrands = Array.from(new Set(products.map(p => p.brand)));

  // Compared products
  const comparedProducts = compareProductIds
    .map(id => products.find(p => p.id === id))
    .filter((p): p is Product => !!p);

  // Active seller profile for Seller Hub
  const currentSellerProfile = sellers.find(s => s.userId === user.id) || sellers[0];

  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const unreadNotifications = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen flex flex-col bg-concrete text-ink dark:bg-charcoal-900 dark:text-zinc-100 transition-colors duration-200">
      {/* Sticky Architectural Header */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        pincode={pincode}
        onPincodeChange={setPincode}
        cartCount={cartTotalItems}
        onOpenCart={() => setShowCartDrawer(true)}
        wishlistCount={user.wishlist.length}
        onOpenWishlist={() => {
          setSelectedCategory('all');
          // filter wishlist
        }}
        onOpenOrders={() => setShowOrdersModal(true)}
        onOpenScratchHub={() => setShowScratchHub(true)}
        walletBalance={user.walletBalance}
        currentMode={currentMode}
        onModeChange={setCurrentMode}
        user={user}
        products={products}
        onSelectProduct={handleSelectProduct}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        unreadNotificationCount={unreadNotifications}
        onOpenNotifications={() => setShowNotificationsDrawer(true)}
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenProfile={() => setShowProfileModal(true)}
        onOpenMohalla={() => setShowMohallaModal(true)}
        compareCount={compareProductIds.length}
        onOpenCompare={() => setShowCompareModal(true)}
        isLiteMode={isLiteMode}
        onToggleLiteMode={() => setIsLiteMode(prev => !prev)}
      />

      {/* Festival Banner Mode Strip if active */}
      {festivalTheme.mode !== 'normal' && (
        <div className="bg-gradient-to-r from-brass-light via-concrete to-brass-light dark:from-charcoal-800 dark:via-charcoal-900 dark:to-charcoal-800 border-b border-brass/40 py-2 px-4 text-center text-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <span className="font-bold text-slate-deep dark:text-brass flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brass" />
              <span>{festivalTheme.greeting}</span>
            </span>
            <span className="hidden sm:inline text-ink-muted text-[11px]">{festivalTheme.subtitle}</span>
            <span className="text-[10px] font-bold uppercase bg-brass text-slate-deep px-2 py-0.5 rounded">
              {festivalTheme.accentBadge}
            </span>
          </div>
        </div>
      )}

      {/* Main Switchable Application Views */}
      {currentMode === 'admin' ? (
        /* 1. ADMIN PANEL VIEW */
        <main className="flex-1">
          <AdminPanel
            products={products}
            orders={orders}
            reviews={reviews}
            coupons={coupons}
            sellers={sellers}
            festivalTheme={festivalTheme}
            language={language}
            onUpdateFestival={setFestivalTheme}
            onApproveSeller={(sId) => setSellers(prev => prev.map(s => s.id === sId ? { ...s, status: 'approved' } : s))}
            onSuspendSeller={(sId) => setSellers(prev => prev.map(s => s.id === sId ? { ...s, status: 'suspended' } : s))}
            onToggleFlagProduct={(pId) => setProducts(prev => prev.map(p => p.id === pId ? { ...p, status: p.status === 'flagged' ? 'active' : 'flagged' } : p))}
            onDeleteReview={(rId) => setReviews(prev => prev.filter(r => r.id !== rId))}
            onCreateCoupon={(c) => setCoupons(prev => [c, ...prev])}
          />
        </main>
      ) : currentMode === 'seller' ? (
        /* 2. SELLER COMMAND HUB VIEW */
        <main className="flex-1">
          <SellerDashboard
            products={products}
            orders={orders}
            campaigns={sponsors}
            seller={currentSellerProfile}
            language={language}
            onAddProduct={(newP) => setProducts(prev => [{ ...newP, id: `prod-${Date.now()}`, rating: 5.0, reviewCount: 1 }, ...prev])}
            onUpdateStock={(pId, stock) => setProducts(prev => prev.map(p => p.id === pId ? { ...p, stock } : p))}
            onDeleteProduct={(pId) => setProducts(prev => prev.filter(p => p.id !== pId))}
            onUpdateOrderStatus={(oId, st) => setOrders(prev => prev.map(o => o.id === oId ? { ...o, status: st } : o))}
            onHandleReturn={(oId, approve) => setOrders(prev => prev.map(o => o.id === oId && o.returnRequest ? { ...o, returnRequest: { ...o.returnRequest, status: approve ? 'approved' : 'rejected' } } : o))}
            onCreateSellerCoupon={(c) => setCoupons(prev => [c, ...prev])}
          />
        </main>
      ) : (
        /* 3. CUSTOMER STOREFRONT VIEW (Flipkart/Amazon Architecture) */
        <main className="flex-1">
          {/* Category Bar */}
          <CategoryBar
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            language={language}
            onOpenCommunity={() => setShowCommunityModal(true)}
          />

          {/* Hero Banner with Promo Tiles */}
          <HeroBanner
            language={language}
            onExploreLocal={() => {
              setFilterLocalOnly(true);
              document.getElementById('catalog-grid')?.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenScratchHub={() => setShowScratchHub(true)}
          />

          {/* Trust Row */}
          <TrustRow language={language} />

          {/* Deal of the Day with Countdown */}
          {products[0] && (
            <DealOfTheDay
              product={products[0]}
              language={language}
              onSelectProduct={handleSelectProduct}
              onOpenBhaav={(p) => setBhaavProduct(p)}
            />
          )}

          {/* Main Catalog & Filter Grid Section */}
          <section id="catalog-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Filter and Discovery Toolbar */}
            <div className="bg-surface dark:bg-charcoal-800 border border-subtle rounded p-4 mb-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-brass" />
                  <span className="text-xs font-heading font-semibold uppercase tracking-wider text-ink dark:text-zinc-200">
                    {t.filters}
                  </span>
                  <span className="text-xs text-ink-muted">
                    ({sortedProducts.length} items found)
                  </span>
                </div>

                {/* Sort dropdown */}
                <div className="flex items-center gap-2 text-xs">
                  <ArrowUpDown className="w-3.5 h-3.5 text-ink-muted" />
                  <span className="text-ink-muted">{t.sortBy}:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-2.5 py-1 bg-concrete dark:bg-charcoal-700 border border-subtle rounded text-xs font-medium text-ink dark:text-zinc-200"
                  >
                    <option value="relevance">{t.sortRelevance}</option>
                    <option value="priceLow">{t.sortPriceLow}</option>
                    <option value="priceHigh">{t.sortPriceHigh}</option>
                    <option value="rating">{t.sortRating}</option>
                    <option value="discount">{t.sortDiscount}</option>
                  </select>
                </div>
              </div>

              {/* Filters row */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2 border-t border-subtle text-xs">
                {/* Local Stores Only (Same-day dispatch) */}
                <button
                  onClick={() => setFilterLocalOnly(!filterLocalOnly)}
                  className={`px-3 py-1.5 rounded font-medium border flex items-center gap-1.5 transition ${
                    filterLocalOnly
                      ? 'bg-emerald-800 text-white border-emerald-800'
                      : 'bg-concrete dark:bg-charcoal-700 text-ink dark:text-zinc-300 border-subtle hover:border-brass'
                  }`}
                >
                  <Zap className={`w-3.5 h-3.5 ${filterLocalOnly ? 'text-white' : 'text-emerald-600'}`} />
                  <span>{t.localOnly}</span>
                </button>

                {/* Brand Filter */}
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="px-2 py-1.5 bg-concrete dark:bg-charcoal-700 border border-subtle rounded text-xs"
                >
                  <option value="all">All Brands</option>
                  {uniqueBrands.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>

                {/* In stock only */}
                <button
                  onClick={() => setFilterInStockOnly(!filterInStockOnly)}
                  className={`px-3 py-1.5 rounded font-medium border transition ${
                    filterInStockOnly
                      ? 'bg-slate-deep text-white border-slate-deep'
                      : 'bg-concrete dark:bg-charcoal-700 text-ink dark:text-zinc-300 border-subtle'
                  }`}
                >
                  {t.inStockOnly}
                </button>

                {/* 4★ and above */}
                <button
                  onClick={() => setFilterRating4Plus(!filterRating4Plus)}
                  className={`px-3 py-1.5 rounded font-medium border transition ${
                    filterRating4Plus
                      ? 'bg-brass text-slate-deep font-bold border-brass'
                      : 'bg-concrete dark:bg-charcoal-700 text-ink dark:text-zinc-300 border-subtle'
                  }`}
                >
                  ★ 4★ & above
                </button>

                {/* Clear all */}
                {(filterLocalOnly || filterInStockOnly || filterRating4Plus || selectedCategory !== 'all' || selectedBrand !== 'all') && (
                  <button
                    onClick={() => {
                      setFilterLocalOnly(false);
                      setFilterInStockOnly(false);
                      setFilterRating4Plus(false);
                      setSelectedCategory('all');
                      setSelectedBrand('all');
                      setSearchQuery('');
                    }}
                    className="px-2 py-1 text-ink-muted hover:text-ink text-[11px] underline flex items-center gap-1 ml-auto"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{t.clearAll}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {sortedProducts.map(prod => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  language={language}
                  pincode={pincode}
                  isWishlisted={user.wishlist.includes(prod.id)}
                  isInCompare={compareProductIds.includes(prod.id)}
                  isLiteMode={isLiteMode}
                  onToggleWishlist={handleToggleWishlist}
                  onToggleCompare={handleToggleCompare}
                  onSelectProduct={handleSelectProduct}
                  onOpenBhaav={(p) => setBhaavProduct(p)}
                />
              ))}
            </div>
          </section>

          {/* Mohalla Community Group Buy Teaser Banner */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="p-5 bg-gradient-to-r from-brass-light/60 to-surface dark:from-charcoal-800 dark:to-charcoal-900 border-2 border-brass/40 rounded flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brass-dark dark:text-brass bg-brass/20 px-2 py-0.5 rounded inline-block">
                  Community Wholesale Savings
                </span>
                <h3 className="text-base font-heading font-bold text-slate-deep dark:text-zinc-100">
                  Mohalla Community Group Buy: Unlock 20-25% Bulk Discounts
                </h3>
                <p className="text-xs text-ink-muted">
                  Team up with your apartment society or neighborhood to order direct from verified producers with Cash on Delivery.
                </p>
              </div>
              <button
                onClick={() => setShowMohallaModal(true)}
                className="py-2.5 px-4 bg-slate-deep hover:bg-slate-hover text-white text-xs font-semibold uppercase tracking-wider rounded whitespace-nowrap flex items-center gap-2 transition"
              >
                <Users className="w-4 h-4 text-brass" />
                <span>Explore Group Buys</span>
              </button>
            </div>
          </section>

          {/* Recently Viewed Products */}
          {recentlyViewed.length > 0 && (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-subtle">
              <h3 className="text-xs font-heading font-semibold uppercase tracking-wider text-ink dark:text-zinc-300 mb-3">
                Recently Viewed
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                {recentlyViewed.map(id => {
                  const p = products.find(prod => prod.id === id);
                  if (!p) return null;
                  return (
                    <div
                      key={p.id}
                      onClick={() => handleSelectProduct(p)}
                      className="p-2.5 bg-surface dark:bg-charcoal-800 border border-subtle hover:border-brass rounded cursor-pointer text-xs"
                    >
                      <img src={p.imageUrl} alt="" className="w-full aspect-square object-cover rounded border mb-1.5" />
                      <p className="font-semibold truncate">{p.name}</p>
                      <span className="font-bold text-slate-deep dark:text-brass">{formatINR(p.price)}</span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </main>
      )}

      {/* Footer */}
      <Footer
        language={language}
        onOpenLegal={setLegalModalType}
        onOpenSponsorPortal={() => setShowSponsorPortal(true)}
      />

      {/* ALL OVERLAYS & MODALS */}
      {/* 1. Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          reviews={reviews}
          qnas={qnas}
          allProducts={products}
          language={language}
          pincode={pincode}
          isWishlisted={user.wishlist.includes(selectedProduct.id)}
          onToggleWishlist={handleToggleWishlist}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          onOpenBhaav={(p) => {
            setSelectedProduct(null);
            setBhaavProduct(p);
          }}
          onAddReview={handleAddReview}
          onAddQuestion={handleAddQuestion}
          onSelectSimilarProduct={handleSelectProduct}
        />
      )}

      {/* 2. Bhaav-Taav 2.0 Negotiation Modal */}
      {bhaavProduct && (
        <BhaavTaavModal
          product={bhaavProduct}
          currentUser={user}
          language={language}
          onClose={() => setBhaavProduct(null)}
          onAcceptBargain={handleAcceptBargain}
          onOfferSubmitted={() => setUser(prev => ({ ...prev, bhaavOffersDailyCount: prev.bhaavOffersDailyCount + 1 }))}
        />
      )}

      {/* 3. Scratch & Win Hub */}
      {showScratchHub && (
        <ScratchHub
          cards={scratchCards}
          walletBalance={user.walletBalance}
          language={language}
          onOpenCard={(c) => {
            setShowScratchHub(false);
            setActiveScratchCard(c);
          }}
          onOpenSponsorPortal={() => {
            setShowScratchHub(false);
            setShowSponsorPortal(true);
          }}
          onClose={() => setShowScratchHub(false)}
        />
      )}

      {/* 4. Canvas Scratch Card Modal */}
      {activeScratchCard && (
        <ScratchCardModal
          card={activeScratchCard}
          language={language}
          onClose={() => setActiveScratchCard(null)}
          onScratched={handleCardScratched}
        />
      )}

      {/* 5. Sponsor Portal Modal */}
      {showSponsorPortal && (
        <SponsorPortalModal
          campaigns={sponsors}
          language={language}
          onClose={() => setShowSponsorPortal(false)}
          onCreateCampaign={(camp) => {
            const created: SponsorCampaign = {
              ...camp,
              id: `camp-${Date.now()}`,
              cardsIssued: 1,
              cardsScratched: 0,
              cardsRedeemed: 0,
              salesInfluenced: 0,
              createdAt: new Date().toISOString().split('T')[0]
            };
            setSponsors(prev => [created, ...prev]);
          }}
        />
      )}

      {/* 6. Shopping Cart Drawer */}
      <CartDrawer
        isOpen={showCartDrawer}
        onClose={() => setShowCartDrawer(false)}
        items={cart}
        savedForLater={savedForLater}
        walletBalance={user.walletBalance}
        coupons={coupons}
        language={language}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onSaveForLater={handleSaveForLater}
        onMoveToCart={handleMoveToCart}
        onProceedToCheckout={(wDisc, c) => {
          setCheckoutWalletDiscount(wDisc);
          setCheckoutAppliedCoupon(c);
          setShowCartDrawer(false);
          setShowCheckoutModal(true);
        }}
      />

      {/* 7. Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        items={cart}
        walletDiscount={checkoutWalletDiscount}
        appliedCoupon={checkoutAppliedCoupon}
        currentUser={user}
        language={language}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* 8. Order Success Modal */}
      {lastPlacedOrder && (
        <OrderSuccessModal
          order={lastPlacedOrder}
          language={language}
          onClose={() => setLastPlacedOrder(null)}
          onOpenScratchCard={() => {
            const firstUnscratched = scratchCards.find(c => !c.isScratched);
            if (firstUnscratched) setActiveScratchCard(firstUnscratched);
            else setShowScratchHub(true);
          }}
          onViewOrders={() => setShowOrdersModal(true)}
        />
      )}

      {/* 9. Orders Modal */}
      {showOrdersModal && (
        <OrdersModal
          orders={orders}
          currentUser={user}
          language={language}
          onClose={() => setShowOrdersModal(false)}
          onViewInvoice={(ord) => setInvoiceOrder(ord)}
          onReorder={handleReorder}
          onCancelOrder={handleCancelOrder}
          onRequestReturn={handleRequestReturn}
        />
      )}

      {/* 10. GST Tax Invoice Modal */}
      {invoiceOrder && (
        <InvoiceModal
          order={invoiceOrder}
          language={language}
          onClose={() => setInvoiceOrder(null)}
        />
      )}

      {/* 11. Auth Modal (Mobile OTP) */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        currentUser={user}
        language={language}
        onLoginSuccess={(u) => {
          setUser(u);
          if (u.role !== 'customer') setCurrentMode(u.role);
        }}
      />

      {/* 12. Profile & Address Book Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={user}
        language={language}
        onUpdateUser={setUser}
        onOpenScratchHub={() => {
          setShowProfileModal(false);
          setShowScratchHub(true);
        }}
      />

      {/* 13. Compare Products Modal */}
      <CompareModal
        isOpen={showCompareModal}
        onClose={() => setShowCompareModal(false)}
        products={comparedProducts}
        language={language}
        onRemoveFromCompare={(pId) => setCompareProductIds(prev => prev.filter(id => id !== pId))}
        onAddToCart={(p) => handleAddToCart(p, 1)}
      />

      {/* 14. Mohalla Community Group Buy Modal */}
      <MohallaGroupBuyModal
        isOpen={showMohallaModal}
        onClose={() => setShowMohallaModal(false)}
        groupBuys={groupBuys}
        products={products}
        currentUser={user}
        language={language}
        onJoinGroupBuy={handleJoinGroupBuy}
      />

      {/* 15. In-App Notifications Drawer */}
      <NotificationDrawer
        isOpen={showNotificationsDrawer}
        onClose={() => setShowNotificationsDrawer(false)}
        notifications={notifications}
        language={language}
        onMarkAllAsRead={() => setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))}
        onNotificationClick={(notif) => {
          setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
          setShowNotificationsDrawer(false);
          if (notif.link === 'orders') setShowOrdersModal(true);
          else if (notif.link === 'scratch') setShowScratchHub(true);
          else if (notif.link?.startsWith('prod-')) {
            const prod = products.find(p => p.id === notif.link);
            if (prod) setSelectedProduct(prod);
          }
        }}
      />

      {/* 16. Help Centre & Support Modal */}
      <HelpCentreModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        language={language}
        onOpenLegal={setLegalModalType}
      />

      {/* 17. Legal Policy Modals */}
      <LegalModal
        type={legalModalType}
        language={language}
        onClose={() => setLegalModalType(null)}
      />

      {/* 18. Community, Artisans & Pre-Owned Resale Modal */}
      <CommunityModal
        isOpen={showCommunityModal}
        onClose={() => setShowCommunityModal(false)}
        language={language}
      />
    </div>
  );
};

export default App;
