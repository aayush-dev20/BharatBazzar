import {
  Product,
  Review,
  ProductQA,
  Order,
  ScratchCard,
  SponsorCampaign,
  Coupon,
  MohallaGroupBuy,
  SellerProfile,
  FestivalTheme,
  UserSession,
  OrderItem,
  BhaavNegotiation,
  NotificationItem,
  Language
} from '../types';

import { INITIAL_PRODUCTS, INITIAL_REVIEWS, INITIAL_QNAS } from '../data/products';
import { INITIAL_ORDERS } from '../data/orders';
import { INITIAL_SPONSOR_CAMPAIGNS, INITIAL_SCRATCH_CARDS } from '../data/sponsors';
import { INITIAL_COUPONS } from '../data/coupons';
import { INITIAL_GROUP_BUYS } from '../data/groupBuys';
import { INITIAL_SELLERS } from '../data/sellers';
import { FESTIVAL_THEMES } from '../data/festival';

const KEYS = {
  PRODUCTS: 'haat_products_v2',
  REVIEWS: 'haat_reviews_v2',
  QNAS: 'haat_qnas_v2',
  ORDERS: 'haat_orders_v2',
  SCRATCH_CARDS: 'haat_scratch_cards_v2',
  SPONSORS: 'haat_sponsors_v2',
  COUPONS: 'haat_coupons_v2',
  GROUP_BUYS: 'haat_group_buys_v2',
  SELLERS: 'haat_sellers_v2',
  FESTIVAL: 'haat_festival_v2',
  USER: 'haat_user_v2',
  CART: 'haat_cart_v2',
  SAVED_FOR_LATER: 'haat_saved_later_v2',
  BHAAV_NEGOTIATIONS: 'haat_bhaav_negotiations_v2',
  NOTIFICATIONS: 'haat_notifications_v2',
  PINCODE: 'haat_pincode_v2',
  LANGUAGE: 'haat_language_v2',
  DARK_MODE: 'haat_dark_mode_v2',
  RECENTLY_VIEWED: 'haat_recent_v2'
};

const DEFAULT_USER: UserSession = {
  id: 'user-101',
  name: 'Aarav Sharma',
  phone: '9820123456',
  email: 'aarav.sharma@example.in',
  photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  role: 'customer',
  language: 'en',
  addresses: [
    {
      id: 'addr-1',
      fullName: 'Aarav Sharma',
      phone: '9820123456',
      addressLine: 'Flat 402, Shivam Enclave, M.G. Road',
      landmark: 'Near Central Bank',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      addressType: 'home',
      isDefault: true
    },
    {
      id: 'addr-2',
      fullName: 'Aarav Sharma',
      phone: '9820123456',
      addressLine: 'WeWork Enpar, Level 5, Bandra Kurla Complex',
      landmark: 'Opp. NSE',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400051',
      addressType: 'work',
      isDefault: false
    }
  ],
  defaultAddressId: 'addr-1',
  walletBalance: 75,
  scratchCardsDailyCount: 1,
  bhaavOffersDailyCount: 2,
  lastActiveDate: new Date().toISOString().split('T')[0],
  referralCode: 'HAAT-AARAV',
  wishlist: ['prod-1', 'prod-2']
};

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'user-101',
    title: 'Order BB-2026-9421 Shipped!',
    message: 'Your Vedic Gir Cow Ghee is out for local delivery by 7:30 PM today.',
    type: 'order',
    isRead: false,
    createdAt: '2026-11-15T08:35:00Z',
    link: 'orders'
  },
  {
    id: 'notif-2',
    userId: 'user-101',
    title: 'Price Drop Alert on Wishlist!',
    message: 'Kashmiri Organic Mogra Kesar is now 33% OFF for today only.',
    type: 'price_drop',
    isRead: false,
    createdAt: '2026-11-15T09:00:00Z',
    link: 'prod-1'
  },
  {
    id: 'notif-3',
    userId: 'user-101',
    title: 'New Scratch Card Won!',
    message: 'boAt Lifestyle has gifted you a scratch reward. Scratch now to win up to ₹250.',
    type: 'reward',
    isRead: true,
    createdAt: '2026-11-14T11:00:00Z',
    link: 'scratch'
  }
];

function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item) as T;
  } catch (e) {
    console.warn(`Storage get error for ${key}:`, e);
    return defaultValue;
  }
}

function setToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Storage set error for ${key}:`, e);
  }
}

export const Storage = {
  getProducts: (): Product[] => getFromStorage<Product[]>(KEYS.PRODUCTS, INITIAL_PRODUCTS),
  saveProducts: (products: Product[]) => setToStorage(KEYS.PRODUCTS, products),

  getReviews: (): Review[] => getFromStorage<Review[]>(KEYS.REVIEWS, INITIAL_REVIEWS),
  saveReviews: (reviews: Review[]) => setToStorage(KEYS.REVIEWS, reviews),

  getQnas: (): ProductQA[] => getFromStorage<ProductQA[]>(KEYS.QNAS, INITIAL_QNAS),
  saveQnas: (qnas: ProductQA[]) => setToStorage(KEYS.QNAS, qnas),

  getOrders: (): Order[] => getFromStorage<Order[]>(KEYS.ORDERS, INITIAL_ORDERS),
  saveOrders: (orders: Order[]) => setToStorage(KEYS.ORDERS, orders),

  getScratchCards: (): ScratchCard[] => getFromStorage<ScratchCard[]>(KEYS.SCRATCH_CARDS, INITIAL_SCRATCH_CARDS),
  saveScratchCards: (cards: ScratchCard[]) => setToStorage(KEYS.SCRATCH_CARDS, cards),

  getSponsors: (): SponsorCampaign[] => getFromStorage<SponsorCampaign[]>(KEYS.SPONSORS, INITIAL_SPONSOR_CAMPAIGNS),
  saveSponsors: (sponsors: SponsorCampaign[]) => setToStorage(KEYS.SPONSORS, sponsors),

  getCoupons: (): Coupon[] => getFromStorage<Coupon[]>(KEYS.COUPONS, INITIAL_COUPONS),
  saveCoupons: (coupons: Coupon[]) => setToStorage(KEYS.COUPONS, coupons),

  getGroupBuys: (): MohallaGroupBuy[] => getFromStorage<MohallaGroupBuy[]>(KEYS.GROUP_BUYS, INITIAL_GROUP_BUYS),
  saveGroupBuys: (groupBuys: MohallaGroupBuy[]) => setToStorage(KEYS.GROUP_BUYS, groupBuys),

  getSellers: (): SellerProfile[] => getFromStorage<SellerProfile[]>(KEYS.SELLERS, INITIAL_SELLERS),
  saveSellers: (sellers: SellerProfile[]) => setToStorage(KEYS.SELLERS, sellers),

  getFestival: (): FestivalTheme => getFromStorage<FestivalTheme>(KEYS.FESTIVAL, FESTIVAL_THEMES.normal),
  saveFestival: (festival: FestivalTheme) => setToStorage(KEYS.FESTIVAL, festival),

  getUser: (): UserSession => getFromStorage<UserSession>(KEYS.USER, DEFAULT_USER),
  saveUser: (user: UserSession) => setToStorage(KEYS.USER, user),

  getCart: (): OrderItem[] => getFromStorage<OrderItem[]>(KEYS.CART, []),
  saveCart: (cart: OrderItem[]) => setToStorage(KEYS.CART, cart),

  getSavedForLater: (): OrderItem[] => getFromStorage<OrderItem[]>(KEYS.SAVED_FOR_LATER, []),
  saveSavedForLater: (items: OrderItem[]) => setToStorage(KEYS.SAVED_FOR_LATER, items),

  getBhaavNegotiations: (): BhaavNegotiation[] => getFromStorage<BhaavNegotiation[]>(KEYS.BHAAV_NEGOTIATIONS, []),
  saveBhaavNegotiations: (negotiations: BhaavNegotiation[]) => setToStorage(KEYS.BHAAV_NEGOTIATIONS, negotiations),

  getNotifications: (): NotificationItem[] => getFromStorage<NotificationItem[]>(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS),
  saveNotifications: (notifications: NotificationItem[]) => setToStorage(KEYS.NOTIFICATIONS, notifications),

  getPincode: (): string => getFromStorage<string>(KEYS.PINCODE, '400001'),
  savePincode: (pin: string) => setToStorage(KEYS.PINCODE, pin),

  getLanguage: (): Language => getFromStorage<Language>(KEYS.LANGUAGE, 'en'),
  saveLanguage: (lang: Language) => setToStorage(KEYS.LANGUAGE, lang),

  getDarkMode: (): boolean => getFromStorage<boolean>(KEYS.DARK_MODE, false),
  saveDarkMode: (dark: boolean) => setToStorage(KEYS.DARK_MODE, dark),

  getRecentlyViewed: (): string[] => getFromStorage<string[]>(KEYS.RECENTLY_VIEWED, ['prod-1', 'prod-2', 'prod-5']),
  saveRecentlyViewed: (recent: string[]) => setToStorage(KEYS.RECENTLY_VIEWED, recent)
};
