import React, { useState } from 'react';
import { Language, UserSession, Product } from '../types';
import { translations, LANGUAGE_OPTIONS } from '../data/translations';
import { formatINR } from '../utils/formatters';
import { lookupPincode, isValidPincode } from '../utils/pincodes';
import { VoiceSearchButton } from './VoiceSearchButton';
import {
  MapPin,
  Search,
  ShoppingCart,
  Heart,
  Package,
  Sun,
  Moon,
  Gift,
  Store,
  User,
  X,
  Bell,
  Users,
  ShieldAlert,
  Layers,
  Globe
} from 'lucide-react';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  pincode: string;
  onPincodeChange: (pin: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  wishlistCount: number;
  onOpenWishlist: () => void;
  onOpenOrders: () => void;
  onOpenScratchHub: () => void;
  walletBalance: number;
  currentMode: 'customer' | 'seller' | 'admin';
  onModeChange: (mode: 'customer' | 'seller' | 'admin') => void;
  user: UserSession;
  products: Product[];
  onSelectProduct: (p: Product) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  unreadNotificationCount: number;
  onOpenNotifications: () => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onOpenMohalla: () => void;
  compareCount: number;
  onOpenCompare: () => void;
  isLiteMode?: boolean;
  onToggleLiteMode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  darkMode,
  onToggleDarkMode,
  pincode,
  onPincodeChange,
  cartCount,
  onOpenCart,
  wishlistCount,
  onOpenWishlist,
  onOpenOrders,
  onOpenScratchHub,
  walletBalance,
  currentMode,
  onModeChange,
  user,
  products,
  onSelectProduct,
  searchQuery,
  onSearchChange,
  unreadNotificationCount,
  onOpenNotifications,
  onOpenAuth,
  onOpenProfile,
  onOpenMohalla,
  compareCount,
  onOpenCompare,
  isLiteMode = false,
  onToggleLiteMode
}) => {
  const t = translations[language];
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState(pincode);
  const [pinError, setPinError] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const pinDetails = lookupPincode(pincode);

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidPincode(pinInput)) {
      setPinError('Please enter a valid 6-digit Indian PIN code.');
      return;
    }
    setPinError('');
    onPincodeChange(pinInput);
    setShowPinModal(false);
  };

  // Instant Search Suggestions with spelling tolerance
  const matchingProducts = searchQuery.trim().length > 1
    ? products.filter(p => {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.nameHi.includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
      }).slice(0, 5)
    : [];

  return (
    <>
      {/* Top Announcement Strip */}
      <div className="bg-slate-deep text-surface px-4 py-1.5 text-center text-xs tracking-wide border-b border-brass/30 flex items-center justify-between">
        <span className="font-heading font-medium tracking-wider mx-auto">
          {t.announcement}
        </span>
        <div className="hidden md:flex items-center gap-3 text-[11px] text-zinc-300">
          <button
            onClick={onOpenMohalla}
            className="hover:text-brass flex items-center gap-1 transition"
          >
            <Users className="w-3.5 h-3.5 text-brass" />
            <span>{t.mohallaGroupBuy}</span>
          </button>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-surface/95 dark:bg-charcoal-800/95 backdrop-blur-md border-b border-subtle transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <div
                onClick={() => currentMode !== 'customer' && onModeChange('customer')}
                className="cursor-pointer flex items-center gap-2 group"
              >
                <div className="w-8 h-8 rounded bg-slate-deep border border-brass flex items-center justify-center">
                  <span className="font-heading font-bold text-base text-brass">हा</span>
                </div>
                <div className="leading-none">
                  <span className="font-heading font-bold text-lg text-slate-deep dark:text-zinc-100 tracking-tight group-hover:text-brass transition">
                    Haat <span className="text-brass">| भारत बाज़ार</span>
                  </span>
                  <span className="hidden sm:block text-[9px] font-medium uppercase tracking-widest text-ink-muted dark:text-zinc-400">
                    {t.brandTagline}
                  </span>
                </div>
              </div>

              {/* Delivery PIN Quick-Selector */}
              <button
                onClick={() => setShowPinModal(true)}
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-left rounded hover:bg-concrete dark:hover:bg-charcoal-700 border border-transparent hover:border-subtle transition"
                title="Change Delivery PIN Code"
              >
                <MapPin className="w-4 h-4 text-brass shrink-0" />
                <div className="leading-tight">
                  <span className="text-[10px] text-ink-muted dark:text-zinc-400 block">
                    {t.deliverTo}
                  </span>
                  <span className="font-semibold text-ink dark:text-zinc-200 truncate max-w-[110px] block">
                    {pinDetails ? `${pinDetails.city} ${pinDetails.pincode}` : t.enterPincode}
                  </span>
                </div>
              </button>
            </div>

            {/* Central Search Bar with Voice Search */}
            <div className="relative flex-1 max-w-xl">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    onSearchChange(e.target.value);
                    setShowSearchDropdown(true);
                  }}
                  onFocus={() => setShowSearchDropdown(true)}
                  placeholder={t.searchPlaceholder}
                  className="w-full pl-9 pr-16 py-2 bg-concrete/70 dark:bg-charcoal-900 border border-subtle rounded text-xs text-ink dark:text-zinc-100 placeholder:text-ink-muted/70 focus:outline-none focus:border-brass transition"
                />
                <Search className="w-4 h-4 text-ink-muted dark:text-zinc-400 absolute left-3 pointer-events-none" />

                <div className="absolute right-2 flex items-center gap-1">
                  {/* Voice Search Button (Web Speech API) */}
                  <VoiceSearchButton
                    language={language}
                    onTranscript={(voiceText) => {
                      onSearchChange(voiceText);
                      setShowSearchDropdown(true);
                    }}
                  />

                  {searchQuery && (
                    <button
                      onClick={() => onSearchChange('')}
                      className="p-1 text-ink-muted hover:text-ink dark:text-zinc-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Instant Search Suggestions */}
              {showSearchDropdown && matchingProducts.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-surface dark:bg-charcoal-800 border border-subtle rounded shadow-lg overflow-hidden z-50">
                  <div className="p-1">
                    {matchingProducts.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          onSelectProduct(p);
                          setShowSearchDropdown(false);
                        }}
                        className="p-2 hover:bg-concrete dark:hover:bg-charcoal-700 rounded cursor-pointer flex items-center gap-3 transition"
                      >
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-9 h-9 object-cover rounded border border-subtle shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-ink dark:text-zinc-200 truncate">
                            {language === 'hi' ? p.nameHi : p.name}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-ink-muted dark:text-zinc-400">
                            <span className="font-bold text-slate-deep dark:text-brass">{formatINR(p.price)}</span>
                            <span className="text-[10px] text-ink-light">({p.brand})</span>
                            {p.isLocalStore && (
                              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                                ⚡ Local Store
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Action Icons & Toggles */}
            <div className="flex items-center gap-1 sm:gap-2.5">
              {/* Scratch & Win Hub with Wallet Badge */}
              <button
                onClick={onOpenScratchHub}
                className="flex items-center gap-1.5 px-2 py-1.5 bg-brass-light dark:bg-brass/10 border border-brass/40 rounded text-xs font-semibold text-slate-deep dark:text-brass hover:bg-brass/20 transition"
                title={t.scratchAndWin}
              >
                <Gift className="w-4 h-4 text-brass" />
                <span className="hidden sm:inline font-mono">{formatINR(walletBalance)}</span>
              </button>

              {/* Language Picker Dropdown (7 Indian Languages) */}
              <div className="relative">
                <button
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="px-2 py-1.5 border border-subtle hover:border-brass rounded text-xs font-medium text-ink dark:text-zinc-200 transition bg-concrete/50 dark:bg-charcoal-700 flex items-center gap-1"
                  title="Choose Language"
                >
                  <Globe className="w-3.5 h-3.5 text-brass" />
                  <span className="uppercase">{language}</span>
                </button>

                {showLangMenu && (
                  <div className="absolute right-0 top-full mt-1 w-36 bg-surface dark:bg-charcoal-800 border border-subtle rounded shadow-lg z-50 py-1 text-xs">
                    {LANGUAGE_OPTIONS.map((opt) => (
                      <button
                        key={opt.code}
                        onClick={() => {
                          onLanguageChange(opt.code);
                          setShowLangMenu(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 hover:bg-concrete dark:hover:bg-charcoal-700 flex justify-between items-center ${
                          language === opt.code ? 'font-bold text-brass' : 'text-ink dark:text-zinc-200'
                        }`}
                      >
                        <span>{opt.native}</span>
                        <span className="text-[10px] uppercase text-ink-muted">{opt.code}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Notifications Center */}
              <button
                onClick={onOpenNotifications}
                className="relative p-1.5 text-ink-muted hover:text-ink dark:text-zinc-400 dark:hover:text-zinc-100 rounded hover:bg-concrete dark:hover:bg-charcoal-700 transition"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-brick text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>

              {/* Compare Button */}
              {compareCount > 0 && (
                <button
                  onClick={onOpenCompare}
                  className="relative p-1.5 text-brass hover:text-brass-hover rounded hover:bg-concrete dark:hover:bg-charcoal-700 transition"
                  title="Compare Products"
                >
                  <Layers className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-slate-deep text-brass text-[10px] font-bold rounded-full flex items-center justify-center">
                    {compareCount}
                  </span>
                </button>
              )}

              {/* Wishlist Button */}
              <button
                onClick={onOpenWishlist}
                className="relative p-1.5 text-ink-muted hover:text-ink dark:text-zinc-400 dark:hover:text-zinc-100 rounded hover:bg-concrete dark:hover:bg-charcoal-700 transition"
                title={t.wishlist}
              >
                <Heart className="w-4 h-4" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-brick text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart Button */}
              <button
                onClick={onOpenCart}
                className="relative flex items-center gap-1 px-2.5 py-1.5 bg-slate-deep hover:bg-slate-hover text-white rounded text-xs font-medium transition"
                title={t.cart}
              >
                <ShoppingCart className="w-4 h-4 text-brass" />
                <span className="hidden sm:inline">{t.cart}</span>
                {cartCount > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.2 bg-brass text-slate-deep text-[11px] font-bold rounded">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Account / Profile Button */}
              <button
                onClick={onOpenProfile}
                className="p-1.5 text-ink-muted hover:text-ink dark:text-zinc-400 dark:hover:text-zinc-100 rounded hover:bg-concrete dark:hover:bg-charcoal-700 transition"
                title="Account & Addresses"
              >
                <User className="w-4 h-4" />
              </button>

              {/* Role Switcher Pill */}
              <div className="hidden xl:flex items-center gap-1 p-0.5 bg-concrete dark:bg-charcoal-900 rounded border border-subtle text-[11px] font-semibold">
                <button
                  onClick={() => onModeChange('customer')}
                  className={`px-2 py-1 rounded transition ${currentMode === 'customer' ? 'bg-slate-deep text-white' : 'text-ink-muted'}`}
                >
                  Shop
                </button>
                <button
                  onClick={() => onModeChange('seller')}
                  className={`px-2 py-1 rounded transition ${currentMode === 'seller' ? 'bg-brass text-slate-deep' : 'text-ink-muted'}`}
                >
                  Seller
                </button>
                <button
                  onClick={() => onModeChange('admin')}
                  className={`px-2 py-1 rounded transition ${currentMode === 'admin' ? 'bg-brick text-white' : 'text-ink-muted'}`}
                >
                  Admin
                </button>
              </div>

              {/* Lite Mode (Text-Only for 2G/3G) Toggle */}
              {onToggleLiteMode && (
                <button
                  onClick={onToggleLiteMode}
                  className={`p-1.5 rounded transition text-xs flex items-center gap-1 ${
                    isLiteMode
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold'
                      : 'text-ink-muted hover:text-ink dark:text-zinc-400 hover:bg-concrete dark:hover:bg-charcoal-700'
                  }`}
                  title={isLiteMode ? 'Exit Lite Mode' : 'Switch to Lite Mode (Text-Only for slow 2G/3G)'}
                >
                  <span className="font-mono text-[10px] px-1 py-0.5 border border-current rounded uppercase font-semibold">
                    {isLiteMode ? 'Lite: ON' : '2G Lite'}
                  </span>
                </button>
              )}

              {/* Dark Mode Toggle */}
              <button
                onClick={onToggleDarkMode}
                className="p-1.5 text-ink-muted hover:text-ink dark:text-zinc-400 dark:hover:text-zinc-100 rounded hover:bg-concrete dark:hover:bg-charcoal-700 transition"
                title={darkMode ? 'Light Mode' : 'Dark Mode'}
              >
                {darkMode ? <Sun className="w-4 h-4 text-brass" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Delivery PIN Code Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm bg-surface dark:bg-charcoal-800 border border-subtle rounded p-6 shadow-none">
            <button
              onClick={() => setShowPinModal(false)}
              className="absolute top-4 right-4 p-1 text-ink-muted hover:text-ink dark:text-zinc-400"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-brass" />
              <h3 className="text-base font-heading font-semibold text-ink dark:text-zinc-100">
                Choose Delivery PIN Code
              </h3>
            </div>

            <p className="text-xs text-ink-muted dark:text-zinc-400 mb-4">
              Enter your 6-digit Indian PIN to check same-day delivery availability from local stores in your neighborhood.
            </p>

            <form onSubmit={handleSavePin} className="space-y-3">
              <div>
                <input
                  type="text"
                  maxLength={6}
                  value={pinInput}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/[^0-9]/g, '');
                    setPinInput(digits);
                    setPinError('');
                  }}
                  placeholder="e.g. 400001, 110001, 560001"
                  className="w-full px-3 py-2 bg-concrete/60 dark:bg-charcoal-700 border border-subtle rounded text-sm font-semibold tracking-wider text-ink dark:text-zinc-100 focus:outline-none focus:border-brass font-mono"
                  autoFocus
                />
                {pinError && (
                  <p className="mt-1 text-[11px] text-brick dark:text-brick-light">{pinError}</p>
                )}
              </div>

              {/* Sample PIN shortcuts */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] text-ink-muted dark:text-zinc-400 self-center">Popular:</span>
                {[
                  { pin: '400001', city: 'Mumbai' },
                  { pin: '110001', city: 'Delhi' },
                  { pin: '560001', city: 'Bengaluru' },
                  { pin: '302001', city: 'Jaipur' }
                ].map(item => (
                  <button
                    key={item.pin}
                    type="button"
                    onClick={() => setPinInput(item.pin)}
                    className="px-2 py-0.5 text-[10px] border border-subtle rounded bg-concrete dark:bg-charcoal-700 text-ink dark:text-zinc-300 hover:border-brass"
                  >
                    {item.city} ({item.pin})
                  </button>
                ))}
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-slate-deep hover:bg-slate-hover text-white text-xs font-semibold uppercase tracking-wider rounded transition"
                >
                  Apply PIN
                </button>
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="py-2 px-3 bg-concrete dark:bg-charcoal-700 text-ink dark:text-zinc-300 text-xs font-medium uppercase rounded hover:bg-zinc-200 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
