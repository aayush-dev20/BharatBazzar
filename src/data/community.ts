/**
 * COMMUNITY, ARTISANS, RESALE & HAAT KHATA DATA
 */

export interface ArtisanProfile {
  id: string;
  sellerId: string;
  artisanName: string;
  craftTradition: string;
  region: string;
  yearsOfHeritage: number;
  story: string;
  storyHi: string;
  portraitUrl: string;
  workshopPhotos: string[];
}

export interface UsedListing {
  id: string;
  sellerName: string;
  sellerPhone: string;
  title: string;
  description: string;
  condition: 'like_new' | 'good' | 'fair';
  price: number;
  originalPrice: number;
  city: string;
  pincode: string;
  images: string[];
  reportedCount: number;
  createdAt: string;
}

export interface MohallaActivity {
  id: string;
  neighborhood: string;
  pincode: string;
  buyerName: string;
  productName: string;
  price: number;
  timeAgo: string;
  isGroupBuy?: boolean;
}

export interface LedgerEntry {
  id: string;
  sellerId: string;
  customerName: string;
  customerPhone: string;
  amount: number;
  type: 'credit_given' | 'payment_received';
  description: string;
  date: string;
}

export const INITIAL_ARTISANS: ArtisanProfile[] = [
  {
    id: 'art-1',
    sellerId: 'seller-2',
    artisanName: 'Ramprasad Sharma',
    craftTradition: 'Traditional Moradabad Brass Lost-Wax Casting & Engraving',
    region: 'Moradabad, Uttar Pradesh (The Brass City)',
    yearsOfHeritage: 48,
    story: 'Four generations of my family have smelted virgin brass in Gali Peetal Wali. Every diya and temple bell is engraved by hand using traditional chisels (tilli), tuned to reverberate for over 15 seconds.',
    storyHi: 'मुरादाबाद की पीतल नगरी में हमारी चौथी पीढ़ी शुद्ध पीतल से पूजा के बर्तन और दीये ढालती है। हर घंटी को हाथ से तराशा जाता है ताकि उसकी गूंज 15 सेकंड से अधिक रहे।',
    portraitUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=80',
    workshopPhotos: [
      'https://images.unsplash.com/photo-1605883746291-0a8ce1fa1458?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'art-2',
    sellerId: 'seller-3',
    artisanName: 'Venkatesh S.',
    craftTradition: 'Kanchipuram Pure Mulberry Silk Handloom Weaving',
    region: 'Kanchipuram, Tamil Nadu',
    yearsOfHeritage: 36,
    story: 'We weave using the traditional Korvai technique, interlocking the body and border silk threads separately. A single pure zari bridal saree takes up to 22 days of meticulous handloom craftsmanship.',
    storyHi: 'कांचीपुरम के हथकरघे पर हम पारंपरिक कोरवई तकनीक से शुद्ध शहतूत सिल्क साड़ियां बुनते हैं। एक साड़ी तैयार करने में 22 दिन की मेहनत लगती है।',
    portraitUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
    workshopPhotos: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'art-3',
    sellerId: 'seller-5',
    artisanName: 'Sohan Lal Kumhar',
    craftTradition: 'Jaipur Quartz-Glazed Blue Pottery',
    region: 'Kot Jewar, Jaipur, Rajasthan',
    yearsOfHeritage: 29,
    story: 'Unlike traditional clay pottery, our blue pottery uses crushed quartz stone powder, Fuller’s earth, and natural gum, fired at low temperatures and hand-painted with Persian floral motifs.',
    storyHi: 'जयपुर की प्रसिद्ध नीली मिट्टी के बर्तन बिना चाक के क्वार्ट्ज पाउडर और मुल्तानी मिट्टी से हाथ से गढ़े और रंगे जाते हैं।',
    portraitUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80',
    workshopPhotos: [
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80'
    ]
  }
];

export const INITIAL_USED_LISTINGS: UsedListing[] = [
  {
    id: 'used-1',
    sellerName: 'Sunil Mehta',
    sellerPhone: '9820112233',
    title: 'Brass Gramophone Showpiece (Working Condition)',
    description: 'Vintage brass gramophone replica, used for 6 months as drawing room decor. Flawless polish.',
    condition: 'like_new',
    price: 1850,
    originalPrice: 4500,
    city: 'Mumbai',
    pincode: '400050',
    images: ['https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80'],
    reportedCount: 0,
    createdAt: '2026-11-12'
  },
  {
    id: 'used-2',
    sellerName: 'Priya Narayanan',
    sellerPhone: '9840334455',
    title: 'Solid Teakwood Pooja Mandir with Brass Bells',
    description: 'Relocating to another city. Compact wall-hanging wooden temple in excellent condition.',
    condition: 'good',
    price: 2400,
    originalPrice: 6500,
    city: 'Chennai',
    pincode: '600004',
    images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80'],
    reportedCount: 0,
    createdAt: '2026-11-14'
  },
  {
    id: 'used-3',
    sellerName: 'Amit Saxena',
    sellerPhone: '9811445566',
    title: 'Handmade Copper Water Dispenser (5 Litres with Brass Tap)',
    description: 'Used for 3 months, cleaned regularly with lemon and salt. Works perfectly.',
    condition: 'good',
    price: 850,
    originalPrice: 2200,
    city: 'Delhi',
    pincode: '110001',
    images: ['https://images.unsplash.com/photo-1577705998148-6da4f3963bc8?w=800&auto=format&fit=crop&q=80'],
    reportedCount: 0,
    createdAt: '2026-11-15'
  }
];

export const INITIAL_MOHALLA_FEED: MohallaActivity[] = [
  {
    id: 'act-1',
    neighborhood: 'Indiranagar Cluster',
    pincode: '560038',
    buyerName: 'Aarav S.',
    productName: 'Kashmiri Mogra Saffron (5g)',
    price: 1999,
    timeAgo: '4 mins ago',
    isGroupBuy: true
  },
  {
    id: 'act-2',
    neighborhood: 'Bandra West Neighborhood',
    pincode: '400050',
    buyerName: 'Fatima Z.',
    productName: 'Moradabad Brass Peacock Diya',
    price: 1450,
    timeAgo: '18 mins ago'
  },
  {
    id: 'act-3',
    neighborhood: 'Kothrud Mohalla',
    pincode: '411038',
    buyerName: 'Sanjay P.',
    productName: 'Pure Gir Cow A2 Vedic Bilona Ghee',
    price: 1850,
    timeAgo: '32 mins ago',
    isGroupBuy: true
  },
  {
    id: 'act-4',
    neighborhood: 'Salt Lake Sector V',
    pincode: '700091',
    buyerName: 'Debolina B.',
    productName: 'Chanderi Handloom Kurta Set',
    price: 2499,
    timeAgo: '1 hour ago'
  }
];

export const INITIAL_LEDGER_ENTRIES: LedgerEntry[] = [
  {
    id: 'led-1',
    sellerId: 'seller-1',
    customerName: 'Ramesh Bhai (Grocery Regular)',
    customerPhone: '9820011223',
    amount: 1450,
    type: 'credit_given',
    description: '2x Tellicherry Pepper + 1kg Gir Cow Ghee',
    date: '2026-11-10'
  },
  {
    id: 'led-2',
    sellerId: 'seller-1',
    customerName: 'Ramesh Bhai (Grocery Regular)',
    customerPhone: '9820011223',
    amount: 1000,
    type: 'payment_received',
    description: 'Partial payment via UPI',
    date: '2026-11-14'
  },
  {
    id: 'led-3',
    sellerId: 'seller-2',
    customerName: 'Pandit Ji (Mandir Samiti)',
    customerPhone: '9811223344',
    amount: 3200,
    type: 'credit_given',
    description: 'Moradabad Brass Temple Bell + Pooja Thali',
    date: '2026-11-12'
  }
];
