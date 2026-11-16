import React, { useState } from 'react';
import { OrderItem, Address, Language, Order, UserSession, Coupon } from '../types';
import { translations } from '../data/translations';
import { formatINR } from '../utils/formatters';
import { isValidIndianMobile, isValidPincode, lookupPincode, INDIAN_STATES } from '../utils/pincodes';
import { CODPaymentProvider } from '../services/payment/PaymentProvider';
import {
  X,
  Truck,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  QrCode,
  MapPin,
  ArrowRight
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: OrderItem[];
  walletDiscount: number;
  appliedCoupon?: Coupon;
  currentUser: UserSession;
  language: Language;
  onOrderPlaced: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  walletDiscount,
  appliedCoupon,
  currentUser,
  language,
  onOrderPlaced
}) => {
  const t = translations[language];

  // Selected Address from Address Book or Form
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    currentUser.defaultAddressId || (currentUser.addresses[0]?.id ?? 'new')
  );

  // New Address Form State (if adding new address)
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(currentUser.addresses.length === 0);
  const [fullName, setFullName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [addressLine, setAddressLine] = useState('');
  const [pincode, setPincode] = useState('400001');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [addressType, setAddressType] = useState<'home' | 'work'>('home');
  const [addressError, setAddressError] = useState('');

  // Delivery Slot Selection
  const [deliverySlot, setDeliverySlot] = useState<'morning' | 'afternoon' | 'evening'>('afternoon');

  // Payment Choice (Strictly Cash on Delivery or Pay at Delivery by UPI QR - NO GATEWAY)
  const [paymentChoice, setPaymentChoice] = useState<'cod' | 'upi_qr_delivery'>('cod');

  const [isProcessing, setIsProcessing] = useState(false);
  const [whatsappOptIn, setWhatsappOptIn] = useState(true);

  if (!isOpen) return null;

  // Totals
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal >= 499 ? 0 : 49;

  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percent') {
      const calc = Math.round((subtotal * appliedCoupon.discountValue) / 100);
      couponDiscount = appliedCoupon.maxDiscount ? Math.min(calc, appliedCoupon.maxDiscount) : calc;
    } else {
      couponDiscount = appliedCoupon.discountValue;
    }
  }

  const finalTotal = Math.max(0, subtotal + deliveryFee - couponDiscount - walletDiscount);

  const slotLabels = {
    morning: 'Morning (7:00 AM - 11:00 AM)',
    afternoon: 'Afternoon (12:00 PM - 4:00 PM)',
    evening: 'Evening (5:00 PM - 9:00 PM)'
  };

  const handlePincodeChange = (pin: string) => {
    const cleaned = pin.replace(/[^0-9]/g, '');
    setPincode(cleaned);
    if (isValidPincode(cleaned)) {
      const info = lookupPincode(cleaned);
      if (info) {
        setCity(info.city);
        setState(info.state);
      }
    }
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();

    let shippingAddress: Address;

    if (isAddingNewAddress) {
      if (!fullName.trim()) {
        setAddressError('Please enter recipient full name.');
        return;
      }
      if (!isValidIndianMobile(phone)) {
        setAddressError('Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.');
        return;
      }
      if (!isValidPincode(pincode)) {
        setAddressError('Please enter a valid 6-digit Indian PIN code.');
        return;
      }
      if (!addressLine.trim()) {
        setAddressError('Please enter street or house address.');
        return;
      }

      shippingAddress = {
        id: `addr-${Date.now()}`,
        fullName: fullName.trim(),
        phone: phone.trim(),
        addressLine: addressLine.trim(),
        city,
        state,
        pincode: pincode.trim(),
        addressType,
        isDefault: false
      };
    } else {
      const chosen = currentUser.addresses.find(a => a.id === selectedAddressId);
      if (!chosen) {
        setAddressError('Please choose or enter a delivery address.');
        return;
      }
      shippingAddress = chosen;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const hasLocalStoreItem = items.some(i => i.isLocalStore);
      const codProvider = new CODPaymentProvider();
      const deliveryOtp = codProvider.generateDeliveryOTP();

      const order: Order = {
        id: `HT-${Math.floor(100000 + Math.random() * 900000)}`,
        userId: currentUser.id,
        customerName: shippingAddress.fullName,
        customerPhone: shippingAddress.phone,
        items,
        itemTotal: subtotal,
        deliveryFee,
        couponDiscount,
        couponCode: appliedCoupon?.code,
        scratchRewardDiscount: walletDiscount,
        finalTotal,
        paymentMethod: paymentChoice,
        shippingAddress,
        deliverySlot,
        deliverySlotLabel: slotLabels[deliverySlot],
        status: 'placed',
        isSameDayDelivery: hasLocalStoreItem,
        estimatedDelivery: hasLocalStoreItem
          ? 'Today by 8:00 PM (Same-Day Express)'
          : 'Within 2-3 business days',
        deliveryOtp,
        whatsappOptIn,
        createdAt: new Date().toISOString()
      };

      setIsProcessing(false);
      onOrderPlaced(order);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-ink/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-surface dark:bg-charcoal-800 border border-subtle rounded max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-subtle flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-brass" />
            <h2 className="text-base font-heading font-semibold text-ink dark:text-zinc-100">
              Checkout & Delivery Slot (Cash on Delivery)
            </h2>
          </div>
          {!isProcessing && (
            <button
              onClick={onClose}
              className="p-1 text-ink-muted hover:text-ink dark:text-zinc-400"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Body Form */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {isProcessing ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-10 h-10 border-3 border-brass border-t-transparent rounded-full animate-spin mx-auto" />
              <h3 className="text-sm font-heading font-bold text-ink dark:text-zinc-100">
                Placing your Cash on Delivery order...
              </h3>
              <p className="text-ink-muted">
                Deducting stock server-side and dispatching to nearest local store cluster.
              </p>
            </div>
          ) : (
            <form onSubmit={handleConfirmOrder} className="space-y-4">
              {addressError && (
                <div className="p-2.5 bg-brick-light dark:bg-brick/20 border border-brick/40 rounded text-brick">
                  {addressError}
                </div>
              )}

              {/* 1. Address Selection */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold uppercase tracking-wider text-ink dark:text-zinc-200">
                    1. Delivery Address Pick
                  </span>
                  {currentUser.addresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setIsAddingNewAddress(!isAddingNewAddress)}
                      className="text-brass hover:underline font-semibold"
                    >
                      {isAddingNewAddress ? 'Choose Saved Address' : '+ Add New Address'}
                    </button>
                  )}
                </div>

                {!isAddingNewAddress && currentUser.addresses.length > 0 ? (
                  <div className="space-y-2">
                    {currentUser.addresses.map((a) => (
                      <label
                        key={a.id}
                        className={`p-3 rounded border block cursor-pointer transition ${
                          selectedAddressId === a.id
                            ? 'border-brass bg-brass-light/30 dark:bg-brass/10'
                            : 'border-subtle bg-concrete/30'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="deliveryAddress"
                            checked={selectedAddressId === a.id}
                            onChange={() => setSelectedAddressId(a.id)}
                            className="text-brass focus:ring-brass"
                          />
                          <span className="font-semibold">{a.fullName}</span>
                          <span className="text-[10px] uppercase font-semibold px-1.5 bg-concrete dark:bg-charcoal-700 rounded border">
                            {a.addressType}
                          </span>
                        </div>
                        <p className="text-ink-muted mt-1 pl-5">
                          {a.addressLine}, {a.city}, {a.state} - <strong className="font-mono">{a.pincode}</strong> (Phone: {a.phone})
                        </p>
                      </label>
                    ))}
                  </div>
                ) : (
                  /* Form to enter address */
                  <div className="p-3 bg-concrete/40 dark:bg-charcoal-900 rounded border border-subtle space-y-2.5">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Full Name *"
                        className="px-2.5 py-1.5 bg-surface dark:bg-charcoal-700 border border-subtle rounded"
                        required
                      />
                      <input
                        type="tel"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="10-Digit Mobile *"
                        className="px-2.5 py-1.5 bg-surface dark:bg-charcoal-700 border border-subtle rounded font-mono"
                        required
                      />
                    </div>
                    <input
                      type="text"
                      value={addressLine}
                      onChange={(e) => setAddressLine(e.target.value)}
                      placeholder="Flat, House No., Street *"
                      className="w-full px-2.5 py-1.5 bg-surface dark:bg-charcoal-700 border border-subtle rounded"
                      required
                    />
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        value={pincode}
                        onChange={(e) => handlePincodeChange(e.target.value)}
                        placeholder="6-Digit PIN *"
                        className="px-2.5 py-1.5 bg-surface dark:bg-charcoal-700 border border-subtle rounded font-mono"
                        required
                      />
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City *"
                        className="px-2.5 py-1.5 bg-surface dark:bg-charcoal-700 border border-subtle rounded"
                        required
                      />
                      <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="px-2 py-1.5 bg-surface dark:bg-charcoal-700 border border-subtle rounded"
                      >
                        {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Delivery Slot Picker */}
              <div className="space-y-1.5 pt-2 border-t border-subtle">
                <span className="font-semibold uppercase tracking-wider text-ink dark:text-zinc-200 block">
                  2. Select Delivery Slot
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(['morning', 'afternoon', 'evening'] as const).map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setDeliverySlot(slot)}
                      className={`p-2 rounded border text-left transition ${
                        deliverySlot === slot
                          ? 'border-brass bg-brass-light/30 dark:bg-brass/10 font-bold'
                          : 'border-subtle bg-concrete/30'
                      }`}
                    >
                      <span className="capitalize block">{slot}</span>
                      <span className="text-[10px] text-ink-muted block font-normal">
                        {slot === 'morning' ? '7 AM - 11 AM' : slot === 'afternoon' ? '12 PM - 4 PM' : '5 PM - 9 PM'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Payment Mode (Strictly COD / UPI QR on delivery - NO GATEWAY) */}
              <div className="space-y-2 pt-2 border-t border-subtle">
                <span className="font-semibold uppercase tracking-wider text-ink dark:text-zinc-200 block">
                  3. Pay at Doorstep (No Prepayment Required)
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <label
                    className={`p-3 rounded border block cursor-pointer transition ${
                      paymentChoice === 'cod'
                        ? 'border-brass bg-brass-light/40 dark:bg-brass/10'
                        : 'border-subtle bg-concrete/30'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={paymentChoice === 'cod'}
                        onChange={() => setPaymentChoice('cod')}
                        className="text-brass focus:ring-brass"
                      />
                      <span className="font-bold">Cash on Delivery</span>
                    </div>
                    <p className="text-[10px] text-ink-muted mt-1 pl-5">
                      Pay cash when the delivery person arrives at your door.
                    </p>
                  </label>

                  <label
                    className={`p-3 rounded border block cursor-pointer transition ${
                      paymentChoice === 'upi_qr_delivery'
                        ? 'border-brass bg-brass-light/40 dark:bg-brass/10'
                        : 'border-subtle bg-concrete/30'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={paymentChoice === 'upi_qr_delivery'}
                        onChange={() => setPaymentChoice('upi_qr_delivery')}
                        className="text-brass focus:ring-brass"
                      />
                      <span className="font-bold flex items-center gap-1">
                        <QrCode className="w-3.5 h-3.5 text-brass" />
                        <span>Doorstep UPI QR</span>
                      </span>
                    </div>
                    <p className="text-[10px] text-ink-muted mt-1 pl-5">
                      Scan the delivery agent’s UPI QR with GPay, PhonePe, or Paytm.
                    </p>
                  </label>
                </div>
              </div>

              {/* Bill Details */}
              <div className="p-3 bg-concrete dark:bg-charcoal-900 border border-subtle rounded space-y-1">
                <div className="flex justify-between">
                  <span>Item Subtotal:</span>
                  <span>{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges:</span>
                  <span className={deliveryFee === 0 ? 'text-emerald-700 font-bold' : ''}>
                    {deliveryFee === 0 ? 'FREE' : formatINR(deliveryFee)}
                  </span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Coupon ({appliedCoupon?.code}):</span>
                    <span>-{formatINR(couponDiscount)}</span>
                  </div>
                )}
                {walletDiscount > 0 && (
                  <div className="flex justify-between text-brass">
                    <span>Scratch Reward Discount:</span>
                    <span>-{formatINR(walletDiscount)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-subtle flex justify-between font-bold text-sm text-slate-deep dark:text-brass">
                  <span>Amount to Pay at Delivery:</span>
                  <span>{formatINR(finalTotal)}</span>
                </div>
                <p className="text-[10px] text-ink-muted">All prices inclusive of GST.</p>
              </div>

              {/* WhatsApp Communications Consent Checkbox */}
              <div className="flex items-start gap-2 p-2.5 bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-600/30 rounded">
                <input
                  type="checkbox"
                  id="whatsappConsent"
                  checked={whatsappOptIn}
                  onChange={(e) => setWhatsappOptIn(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="whatsappConsent" className="text-[11px] text-ink dark:text-zinc-300 cursor-pointer">
                  <strong>WhatsApp Order Updates:</strong> I agree to be contacted on WhatsApp by the fulfilling seller about this order (tracking, dispatch updates, and delivery verification OTP). No promotional spam.
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-slate-deep hover:bg-slate-hover text-white text-xs font-semibold uppercase tracking-wider rounded flex items-center justify-center gap-2 transition"
              >
                <span>Confirm Order • {formatINR(finalTotal)} (COD)</span>
                <ArrowRight className="w-4 h-4 text-brass" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
