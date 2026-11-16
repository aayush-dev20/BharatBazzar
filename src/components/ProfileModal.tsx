import React, { useState } from 'react';
import { UserSession, Address, Language, UserRole } from '../types';
import { translations, LANGUAGE_OPTIONS } from '../data/translations';
import { isValidIndianMobile, isValidPincode, lookupPincode, INDIAN_STATES } from '../utils/pincodes';
import {
  X,
  User,
  MapPin,
  Plus,
  Trash2,
  CheckCircle2,
  Share2,
  ShieldCheck,
  Edit2,
  Gift,
  Tag
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserSession;
  language: Language;
  onUpdateUser: (updatedUser: UserSession) => void;
  onOpenScratchHub: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  language,
  onUpdateUser,
  onOpenScratchHub
}) => {
  const t = translations[language];

  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'referrals'>('profile');

  // Edit Profile State
  const [name, setName] = useState(user.name);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl || '');
  const [selectedLang, setSelectedLang] = useState<Language>(user.language);
  const [selectedRole, setSelectedRole] = useState<UserRole>(user.role);

  // Address Form State
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addrName, setAddrName] = useState(user.name);
  const [addrPhone, setAddrPhone] = useState(user.phone);
  const [addrLine, setAddrLine] = useState('');
  const [addrLandmark, setAddrLandmark] = useState('');
  const [addrPincode, setAddrPincode] = useState('400001');
  const [addrCity, setAddrCity] = useState('Mumbai');
  const [addrState, setAddrState] = useState('Maharashtra');
  const [addrType, setAddrType] = useState<'home' | 'work'>('home');
  const [addrError, setAddrError] = useState('');

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserSession = {
      ...user,
      name: name.trim() || user.name,
      photoUrl: photoUrl.trim() || user.photoUrl,
      language: selectedLang,
      role: selectedRole
    };
    onUpdateUser(updated);
    onClose();
  };

  const handlePincodeChange = (pin: string) => {
    const cleaned = pin.replace(/[^0-9]/g, '');
    setAddrPincode(cleaned);
    if (isValidPincode(cleaned)) {
      const info = lookupPincode(cleaned);
      if (info) {
        setAddrCity(info.city);
        setAddrState(info.state);
      }
    }
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrName.trim()) {
      setAddrError('Please enter full recipient name.');
      return;
    }
    if (!isValidIndianMobile(addrPhone)) {
      setAddrError('Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.');
      return;
    }
    if (!isValidPincode(addrPincode)) {
      setAddrError('Please enter a valid 6-digit Indian PIN code.');
      return;
    }
    if (!addrLine.trim()) {
      setAddrError('Please enter street or house address.');
      return;
    }

    setAddrError('');

    if (editingAddressId) {
      // Edit existing
      const updatedAddresses = user.addresses.map(a =>
        a.id === editingAddressId
          ? {
              ...a,
              fullName: addrName.trim(),
              phone: addrPhone.trim(),
              addressLine: addrLine.trim(),
              landmark: addrLandmark.trim(),
              pincode: addrPincode.trim(),
              city: addrCity,
              state: addrState,
              addressType: addrType
            }
          : a
      );
      onUpdateUser({ ...user, addresses: updatedAddresses });
    } else {
      // Add new
      const newAddress: Address = {
        id: `addr-${Date.now()}`,
        fullName: addrName.trim(),
        phone: addrPhone.trim(),
        addressLine: addrLine.trim(),
        landmark: addrLandmark.trim(),
        pincode: addrPincode.trim(),
        city: addrCity,
        state: addrState,
        addressType: addrType,
        isDefault: user.addresses.length === 0
      };
      onUpdateUser({
        ...user,
        addresses: [...user.addresses, newAddress],
        defaultAddressId: user.defaultAddressId || newAddress.id
      });
    }

    setShowAddAddress(false);
    setEditingAddressId(null);
    setAddrLine('');
    setAddrLandmark('');
  };

  const handleSetDefaultAddress = (addressId: string) => {
    const updated = user.addresses.map(a => ({
      ...a,
      isDefault: a.id === addressId
    }));
    onUpdateUser({ ...user, addresses: updated, defaultAddressId: addressId });
  };

  const handleDeleteAddress = (addressId: string) => {
    const filtered = user.addresses.filter(a => a.id !== addressId);
    onUpdateUser({
      ...user,
      addresses: filtered,
      defaultAddressId: user.defaultAddressId === addressId && filtered.length > 0 ? filtered[0].id : user.defaultAddressId
    });
  };

  const handleShareReferral = () => {
    const shareText = encodeURIComponent(
      `Join me on Haat! India's architectural marketplace with local same-day delivery, Bhaav-Taav bargaining & brand scratch cards. Use code ${user.referralCode} to get a bonus scratch card after your first order:\n${window.location.origin}`
    );
    window.open(`https://wa.me/?text=${shareText}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-ink/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-surface dark:bg-charcoal-800 border border-subtle rounded max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-subtle flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded bg-slate-deep text-brass flex items-center justify-center font-bold">
              {user.name[0] || 'U'}
            </div>
            <div>
              <h2 className="text-base font-heading font-semibold text-ink dark:text-zinc-100">
                {user.name}
              </h2>
              <span className="text-[11px] text-ink-muted dark:text-zinc-400">
                +91 {user.phone} • Role: <strong className="uppercase text-slate-deep dark:text-brass">{user.role}</strong>
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-ink-muted hover:text-ink dark:text-zinc-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-5 border-b border-subtle flex gap-6 bg-concrete/30 dark:bg-charcoal-900/50 text-xs font-semibold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 border-b-2 transition ${
              activeTab === 'profile'
                ? 'border-brass text-slate-deep dark:text-brass'
                : 'border-transparent text-ink-muted hover:text-ink'
            }`}
          >
            Profile & Role
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`py-3 border-b-2 transition ${
              activeTab === 'addresses'
                ? 'border-brass text-slate-deep dark:text-brass'
                : 'border-transparent text-ink-muted hover:text-ink'
            }`}
          >
            Address Book ({user.addresses.length})
          </button>
          <button
            onClick={() => setActiveTab('referrals')}
            className={`py-3 border-b-2 transition ${
              activeTab === 'referrals'
                ? 'border-brass text-slate-deep dark:text-brass'
                : 'border-transparent text-ink-muted hover:text-ink'
            }`}
          >
            Refer & Win
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1">
          {activeTab === 'profile' ? (
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink dark:text-zinc-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-concrete/60 dark:bg-charcoal-700 border border-subtle rounded text-xs text-ink dark:text-zinc-100 focus:outline-none focus:border-brass"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink dark:text-zinc-300 mb-1">
                  Registered Mobile Number (OTP Verified)
                </label>
                <input
                  type="text"
                  value={user.phone}
                  disabled
                  className="w-full px-3 py-2 bg-concrete/40 dark:bg-charcoal-900 border border-subtle rounded text-xs text-ink-muted font-mono"
                />
              </div>

              {/* Role Switcher */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink dark:text-zinc-300 mb-1">
                  Current Mode / Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['customer', 'seller', 'admin'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setSelectedRole(r)}
                      className={`py-2 px-3 text-xs font-semibold uppercase rounded border transition ${
                        selectedRole === r
                          ? 'bg-slate-deep text-white border-slate-deep dark:bg-brass dark:text-slate-deep'
                          : 'bg-concrete/50 dark:bg-charcoal-700 text-ink-muted border-subtle hover:text-ink'
                      }`}
                    >
                      {r === 'customer' ? 'Customer' : r === 'seller' ? 'Seller Hub' : 'Admin Panel'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Preference */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink dark:text-zinc-300 mb-1">
                  Language Preference / भाषा
                </label>
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value as Language)}
                  className="w-full px-3 py-2 bg-concrete/60 dark:bg-charcoal-700 border border-subtle rounded text-xs text-ink dark:text-zinc-100 focus:outline-none focus:border-brass"
                >
                  {LANGUAGE_OPTIONS.map((opt) => (
                    <option key={opt.code} value={opt.code}>
                      {opt.label} ({opt.native})
                    </option>
                  ))}
                </select>
              </div>

              {/* Anti-Abuse / Daily Limits Overview */}
              <div className="p-3 bg-concrete dark:bg-charcoal-900 border border-subtle rounded space-y-2">
                <span className="text-[11px] font-semibold text-slate-deep dark:text-brass uppercase tracking-wider block">
                  Daily Fair-Use Quotas
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 bg-surface dark:bg-charcoal-800 rounded border border-subtle">
                    <span className="text-ink-muted dark:text-zinc-400 block">Bhaav-Taav Bargains</span>
                    <span className="font-bold text-ink dark:text-zinc-100">{user.bhaavOffersDailyCount} / 5 used today</span>
                  </div>
                  <div className="p-2 bg-surface dark:bg-charcoal-800 rounded border border-subtle">
                    <span className="text-ink-muted dark:text-zinc-400 block">Scratch Cards</span>
                    <span className="font-bold text-ink dark:text-zinc-100">{user.scratchCardsDailyCount} / 3 scratched today</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-slate-deep hover:bg-slate-hover text-white text-xs font-semibold tracking-wider uppercase rounded transition"
              >
                Save Profile Updates
              </button>
            </form>
          ) : activeTab === 'addresses' ? (
            /* Address Book Tab */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-ink dark:text-zinc-300">
                  Saved Delivery Addresses
                </h3>
                {!showAddAddress && (
                  <button
                    onClick={() => {
                      setEditingAddressId(null);
                      setAddrLine('');
                      setAddrLandmark('');
                      setShowAddAddress(true);
                    }}
                    className="py-1 px-2.5 bg-slate-deep hover:bg-slate-hover text-white text-[11px] font-semibold uppercase rounded flex items-center gap-1 transition"
                  >
                    <Plus className="w-3.5 h-3.5 text-brass" />
                    <span>Add New</span>
                  </button>
                )}
              </div>

              {showAddAddress ? (
                /* Address Add / Edit Form */
                <form onSubmit={handleSaveAddress} className="p-4 bg-concrete/50 dark:bg-charcoal-900 border border-subtle rounded space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-subtle pb-2">
                    <span className="font-semibold text-slate-deep dark:text-brass">
                      {editingAddressId ? 'Edit Address' : 'Add New Address'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowAddAddress(false)}
                      className="text-ink-muted hover:text-ink"
                    >
                      Cancel
                    </button>
                  </div>

                  {addrError && (
                    <p className="text-brick text-[11px] font-medium">{addrError}</p>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] uppercase font-medium text-ink-muted mb-0.5">Full Name *</label>
                      <input
                        type="text"
                        value={addrName}
                        onChange={(e) => setAddrName(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-surface dark:bg-charcoal-700 border border-subtle rounded text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-medium text-ink-muted mb-0.5">10-Digit Mobile *</label>
                      <input
                        type="tel"
                        maxLength={10}
                        value={addrPhone}
                        onChange={(e) => setAddrPhone(e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-full px-2.5 py-1.5 bg-surface dark:bg-charcoal-700 border border-subtle rounded text-xs font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-medium text-ink-muted mb-0.5">Flat, House No., Street *</label>
                    <input
                      type="text"
                      value={addrLine}
                      onChange={(e) => setAddrLine(e.target.value)}
                      placeholder="e.g. 402, Shivam Enclave, MG Road"
                      className="w-full px-2.5 py-1.5 bg-surface dark:bg-charcoal-700 border border-subtle rounded text-xs"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] uppercase font-medium text-ink-muted mb-0.5">6-Digit PIN *</label>
                      <input
                        type="text"
                        maxLength={6}
                        value={addrPincode}
                        onChange={(e) => handlePincodeChange(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-surface dark:bg-charcoal-700 border border-subtle rounded text-xs font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-medium text-ink-muted mb-0.5">City *</label>
                      <input
                        type="text"
                        value={addrCity}
                        onChange={(e) => setAddrCity(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-surface dark:bg-charcoal-700 border border-subtle rounded text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-medium text-ink-muted mb-0.5">State *</label>
                      <select
                        value={addrState}
                        onChange={(e) => setAddrState(e.target.value)}
                        className="w-full px-2 py-1.5 bg-surface dark:bg-charcoal-700 border border-subtle rounded text-xs"
                      >
                        {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Type */}
                  <div className="flex gap-4 pt-1">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        checked={addrType === 'home'}
                        onChange={() => setAddrType('home')}
                        className="text-brass focus:ring-brass"
                      />
                      <span>Home</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        checked={addrType === 'work'}
                        onChange={() => setAddrType('work')}
                        className="text-brass focus:ring-brass"
                      />
                      <span>Work</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 px-3 bg-slate-deep hover:bg-slate-hover text-white text-xs font-semibold uppercase tracking-wider rounded"
                  >
                    Save Address
                  </button>
                </form>
              ) : null}

              {/* Address List */}
              <div className="space-y-2.5">
                {user.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-3 bg-concrete/40 dark:bg-charcoal-700/40 border border-subtle rounded text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-ink dark:text-zinc-100">{addr.fullName}</span>
                        <span className="text-[10px] uppercase font-semibold px-1.5 py-0.2 bg-concrete dark:bg-charcoal-800 text-ink-muted rounded border border-subtle">
                          {addr.addressType}
                        </span>
                        {addr.isDefault && (
                          <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 rounded">
                            Default
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingAddressId(addr.id);
                            setAddrName(addr.fullName);
                            setAddrPhone(addr.phone);
                            setAddrLine(addr.addressLine);
                            setAddrLandmark(addr.landmark || '');
                            setAddrPincode(addr.pincode);
                            setAddrCity(addr.city);
                            setAddrState(addr.state);
                            setAddrType(addr.addressType);
                            setShowAddAddress(true);
                          }}
                          className="text-ink-muted hover:text-ink"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-ink-muted hover:text-brick"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-ink-muted dark:text-zinc-300">
                      {addr.addressLine}, {addr.landmark ? `${addr.landmark}, ` : ''}{addr.city}, {addr.state} - <strong className="font-mono">{addr.pincode}</strong>
                    </p>
                    <p className="text-[11px] text-ink-muted dark:text-zinc-400">Mobile: +91 {addr.phone}</p>

                    {!addr.isDefault && (
                      <button
                        onClick={() => handleSetDefaultAddress(addr.id)}
                        className="text-[11px] text-brass hover:underline font-medium"
                      >
                        Set as Default Address
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Refer & Win Tab */
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-brass-light/40 dark:bg-brass/10 border border-brass/40 rounded text-center space-y-2">
                <Gift className="w-8 h-8 text-brass mx-auto" />
                <h3 className="text-sm font-heading font-bold text-slate-deep dark:text-brass">
                  Invite Friends to Haat
                </h3>
                <p className="text-ink-muted dark:text-zinc-300 max-w-sm mx-auto">
                  Share your referral link with friends. When they place their first Cash on Delivery order, both of you unlock brand-sponsored scratch cards worth up to ₹250!
                </p>

                <div className="pt-2">
                  <div className="inline-flex items-center gap-2 p-2 bg-surface dark:bg-charcoal-800 border border-brass/40 rounded">
                    <span className="text-ink-muted font-mono">CODE:</span>
                    <strong className="font-mono text-sm tracking-wider text-slate-deep dark:text-brass">
                      {user.referralCode}
                    </strong>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleShareReferral}
                    className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold uppercase tracking-wider rounded inline-flex items-center gap-1.5 transition"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share on WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
