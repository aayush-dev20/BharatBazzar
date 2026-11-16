export type Language = 'en' | 'hi' | 'pa' | 'mr' | 'ta' | 'bn' | 'te';

export type UserRole = 'customer' | 'seller' | 'sponsor' | 'admin';

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  addressLine: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  addressType: 'home' | 'work';
  isDefault: boolean;
}

export interface UserSession {
  id: string;
  name: string;
  phone: string;
  email?: string;
  photoUrl?: string;
  role: UserRole;
  language: Language;
  addresses: Address[];
  defaultAddressId?: string;
  walletBalance: number;
  scratchCardsDailyCount: number;
  bhaavOffersDailyCount: number;
  lastActiveDate: string;
  referralCode: string;
  referredBy?: string;
  sellerProfileId?: string;
  wishlist: string[];
}

export interface ProductVariant {
  id: string;
  size?: string;
  color?: string;
  price: number;
  mrp: number;
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  name: string;
  nameHi: string;
  brand: string;
  category: string;
  subCategory?: string;
  price: number;
  mrp: number;
  minBhaavPrice: number; // Seller's secret reserve floor
  stock: number;
  isLocalStore: boolean;
  localStoreName?: string;
  localStoreCity?: string;
  sellerId: string;
  sellerName: string;
  description: string;
  descriptionHi: string;
  features: string[];
  featuresHi: string[];
  imageUrl: string;
  images: string[]; // Up to 6 photos with zoom
  variants?: ProductVariant[];
  rating: number; // calculated from real reviews
  reviewCount: number;
  badge?: string;
  badgeHi?: string;
  isDealOfTheDay?: boolean;
  isFlashSale?: boolean;
  flashSaleEndsAt?: string;
  flashStockRemaining?: number;
  status: 'active' | 'flagged' | 'removed';
}

export interface ProductQA {
  id: string;
  productId: string;
  question: string;
  askedBy: string;
  askedAt: string;
  answers: {
    id: string;
    answer: string;
    answeredBy: string;
    isSeller: boolean;
    answeredAt: string;
  }[];
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  verifiedPurchase: boolean; // only buyers who received the item
  reviewPhoto?: string;
  reportedAbuse?: boolean;
}

export interface ScratchCard {
  id: string;
  campaignId: string;
  sponsorName: string;
  sponsorCategory: string;
  sponsorLogo?: string;
  rewardAmount: number;
  isScratched: boolean;
  scratchedAt?: string;
  tagline: string;
  taglineHi: string;
  couponCode?: string;
}

export interface SponsorCampaign {
  id: string;
  brandName: string;
  category: string;
  targetCity?: string;
  maxReward: number;
  totalCards: number;
  cardsIssued: number;
  cardsScratched: number;
  cardsRedeemed: number;
  salesInfluenced: number;
  totalBudget: number;
  platformFee: number;
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
}

export interface Coupon {
  code: string;
  discountType: 'percent' | 'flat';
  discountValue: number;
  minCartAmount: number;
  maxDiscount?: number;
  expiryDate: string;
  usageLimit: number;
  timesUsed: number;
  category?: string;
  sellerId?: string;
  createdBy: string; // 'admin' | sellerId
  isActive: boolean;
}

export interface MohallaGroupBuy {
  id: string;
  productId: string;
  neighborhood: string; // e.g. "Gokuldham Society, Goregaon East"
  targetCount: number; // e.g. 10
  joinedCount: number; // e.g. 7
  groupDiscountPercent: number; // e.g. 25% off
  deadline: string;
  members: {
    userId: string;
    userName: string;
    joinedAt: string;
  }[];
}

export interface BhaavRound {
  roundNumber: number;
  offeredBy: 'customer' | 'seller';
  price: number;
  timestamp: string;
  note?: string;
}

export interface BhaavNegotiation {
  id: string;
  productId: string;
  productName: string;
  sellerId: string;
  sellerName: string;
  customerId: string;
  customerName: string;
  initialPrice: number;
  sellerMinPrice: number;
  rounds: BhaavRound[];
  currentOffer: number;
  status: 'pending' | 'accepted' | 'countered' | 'declined' | 'expired';
  expiresAt: string; // 30-minute countdown
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productNameHi: string;
  variantId?: string;
  variantLabel?: string;
  price: number;
  mrp: number;
  quantity: number;
  imageUrl: string;
  isLocalStore: boolean;
  wasBargained?: boolean;
  originalPrice?: number;
  sellerId: string;
}

export interface ReturnRequest {
  id: string;
  reason: string;
  photoUrl?: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  sellerNotes?: string;
  type: 'return' | 'exchange';
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  itemTotal: number;
  deliveryFee: number;
  couponDiscount: number;
  couponCode?: string;
  scratchRewardDiscount: number;
  finalTotal: number;
  paymentMethod: 'cod' | 'upi_qr_delivery'; // Strictly Cash on Delivery or Pay at Delivery by UPI QR
  shippingAddress: Address;
  deliverySlot: 'morning' | 'afternoon' | 'evening';
  deliverySlotLabel: string;
  status: 'placed' | 'confirmed' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';
  isSameDayDelivery: boolean;
  estimatedDelivery: string;
  deliveryOtp?: string;
  whatsappOptIn?: boolean;
  sellerWhatsApp?: string;
  returnRequest?: ReturnRequest;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'bhaav' | 'price_drop' | 'coupon' | 'reward' | 'system';
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export interface SellerProfile {
  id: string;
  userId: string;
  shopName: string;
  ownerName: string;
  phone: string;
  pan: string;
  gstin?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  shopPhoto: string;
  rating: number;
  followersCount: number;
  status: 'pending_approval' | 'approved' | 'suspended' | 'rejected';
  createdAt: string;
}

export interface FestivalTheme {
  mode: 'normal' | 'diwali' | 'holi' | 'eid' | 'independence';
  title: string;
  subtitle: string;
  greeting: string;
  bannerUrl: string;
  accentBadge: string;
}

export interface HelpArticle {
  id: string;
  category: string;
  question: string;
  answer: string;
}
