import { SponsorCampaign, ScratchCard } from '../types';

export const INITIAL_SPONSOR_CAMPAIGNS: SponsorCampaign[] = [
  {
    id: 'camp-1',
    brandName: 'Tata Consumer (Tata Tea Premium)',
    category: 'Beverages & FMCG',
    maxReward: 100,
    totalCards: 1000,
    cardsIssued: 480,
    cardsScratched: 395,
    totalBudget: 55000, // 50,000 pool + 5,000 fee (10%)
    platformFee: 5000,
    status: 'active',
    createdAt: '2026-11-01'
  },
  {
    id: 'camp-2',
    brandName: 'boAt Lifestyle',
    category: 'Consumer Electronics',
    maxReward: 250,
    totalCards: 500,
    cardsIssued: 310,
    cardsScratched: 260,
    totalBudget: 68750, // 62,500 pool + 6,250 fee (10%)
    platformFee: 6250,
    status: 'active',
    createdAt: '2026-11-05'
  },
  {
    id: 'camp-3',
    brandName: 'Fabindia Artisans Fund',
    category: 'Handlooms & Crafts',
    maxReward: 150,
    totalCards: 750,
    cardsIssued: 220,
    cardsScratched: 180,
    totalBudget: 49500,
    platformFee: 4500,
    status: 'active',
    createdAt: '2026-11-08'
  },
  {
    id: 'camp-4',
    brandName: 'Amul - The Taste of India',
    category: 'Dairy & Local Farm Goods',
    maxReward: 50,
    totalCards: 2000,
    cardsIssued: 1100,
    cardsScratched: 950,
    totalBudget: 55000,
    platformFee: 5000,
    status: 'active',
    createdAt: '2026-11-02'
  }
];

export const INITIAL_SCRATCH_CARDS: ScratchCard[] = [
  {
    id: 'sc-1',
    campaignId: 'camp-1',
    sponsorName: 'Tata Tea Premium',
    sponsorCategory: 'Desh Ki Chai',
    rewardAmount: 50,
    isScratched: false,
    tagline: 'Enjoy Kadak Chai with your local BharatBazaar order!',
    taglineHi: 'कड़क चाय का स्वाद, भारत बाज़ार के हर ऑर्डर के साथ!',
    couponCode: 'TATATEA50'
  },
  {
    id: 'sc-2',
    campaignId: 'camp-2',
    sponsorName: 'boAt Lifestyle',
    sponsorCategory: 'Audio & Tech',
    rewardAmount: 100,
    isScratched: false,
    tagline: 'Plug into Nirvana. Unlock ₹100 instant wallet cash.',
    taglineHi: 'शानदार म्यूज़िक, शानदार बचत। ₹100 का इंस्टेंट कैश रिवॉर्ड।',
    couponCode: 'BOAT100'
  },
  {
    id: 'sc-3',
    campaignId: 'camp-4',
    sponsorName: 'Amul Milk & Ghee',
    sponsorCategory: 'Dairy Goodness',
    rewardAmount: 25,
    isScratched: true,
    scratchedAt: '2026-11-14T10:30:00Z',
    tagline: 'Amul doodh peeta hai India!',
    taglineHi: 'अमुल दूध पीता है इंडिया!',
    couponCode: 'AMUL25'
  }
];
