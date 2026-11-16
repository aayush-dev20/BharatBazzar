import { FestivalTheme } from '../types';

export const FESTIVAL_THEMES: Record<string, FestivalTheme> = {
  normal: {
    mode: 'normal',
    title: 'Haat | भारत बाज़ार',
    subtitle: 'India’s architectural marketplace: local stores, brand scratch cards, and real bargaining.',
    greeting: 'Welcome to Haat',
    bannerUrl: '',
    accentBadge: 'Daily Fresh Deals'
  },
  diwali: {
    mode: 'diwali',
    title: '🪔 Haat Diwali Dhamaka Utsav',
    subtitle: 'Celebrate the Festival of Lights with extra 20% Bhaav-Taav discounts, handloom sarees & pure brass gifts!',
    greeting: 'शुभ दीपावली! Happy Diwali!',
    bannerUrl: 'https://images.unsplash.com/photo-1514195037031-83d60ed3b448?w=1200&auto=format&fit=crop&q=80',
    accentBadge: 'Diwali Festive Specials'
  },
  holi: {
    mode: 'holi',
    title: '🎨 Haat Rang-Barse Holi Mela',
    subtitle: 'Organic herbal gulal, natural thandai spices, and sweets delivered same-day to your society.',
    greeting: 'होली की हार्दिक शुभकामनाएं! Happy Holi!',
    bannerUrl: 'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=1200&auto=format&fit=crop&q=80',
    accentBadge: 'Holi Colors & Treats'
  },
  eid: {
    mode: 'eid',
    title: '🌙 Haat Eid-ul-Fitr Mubarak Sale',
    subtitle: 'Special festive rates on Kashmiri Mogra Kesar, pure Gir cow ghee, and festive handlooms.',
    greeting: 'ईद मुबारक! Eid Mubarak!',
    bannerUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&auto=format&fit=crop&q=80',
    accentBadge: 'Eid Festive Treats'
  },
  independence: {
    mode: 'independence',
    title: '🇮🇳 Haat Swadeshi Mahotsav',
    subtitle: 'Honoring Indian weavers, local coppersmiths, and village organic farms with 0% platform markups.',
    greeting: 'जय हिन्द! Celebrate Made in India',
    bannerUrl: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=1200&auto=format&fit=crop&q=80',
    accentBadge: '100% Swadeshi Products'
  }
};
