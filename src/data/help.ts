import { HelpArticle } from '../types';

export const INITIAL_HELP_ARTICLES: HelpArticle[] = [
  {
    id: 'help-1',
    category: 'Bhaav-Taav 2.0',
    question: 'How does Bhaav-Taav bargaining work on Haat?',
    answer: 'Every product has a listed price and a secret seller floor price. When you submit an offer, our system reviews it. If it is within 8% of listed price, it is accepted immediately. If lower but above seller reserve, the seller or automated negotiation engine makes up to 3 counter-offers. You have 30 minutes to accept and order.'
  },
  {
    id: 'help-2',
    category: 'Delivery & Local Stores',
    question: 'How does Same-Day Delivery from Local Stores work?',
    answer: 'Items tagged "Local Store" are in stock at nearby neighborhood kiranas or partner stores. When you enter a valid 6-digit Indian PIN code, orders placed before 4:00 PM are dispatched for same-day delivery by 8:00 PM.'
  },
  {
    id: 'help-3',
    category: 'Payments (COD)',
    question: 'Why does Haat not require online payment at checkout?',
    answer: 'To ensure complete safety and trust across Indian towns, all orders are placed as Cash on Delivery (or Pay at Doorstep by UPI QR). You inspect your parcel when the delivery agent arrives and pay either in cash or by scanning the agent’s UPI QR code.'
  },
  {
    id: 'help-4',
    category: 'Returns & Exchanges',
    question: 'Can I return an item within 7 days?',
    answer: 'Yes! You can request a 7-day doorstep return or exchange directly from your Order History. Choose your reason, upload an optional photo, and the seller approves within 24 hours. A delivery partner picks up the item from your address.'
  },
  {
    id: 'help-5',
    category: 'Scratch Cards & Rewards',
    question: 'How do Brand-Sponsored Scratch Cards work?',
    answer: 'Brand partners (like Tata Consumer, boAt, Amul) sponsor reward pools for shoppers. Scratch the card on canvas to unlock wallet cash. Rewards can be applied on any cart of ₹299 or higher.'
  },
  {
    id: 'help-6',
    category: 'Mohalla Group Buy',
    question: 'What is Mohalla Group Buy?',
    answer: 'A society or neighborhood group buy enables residents of the same apartment complex or area to order items together. Once the target number of buyers join before the deadline, all participants unlock 20-30% bulk factory discounts!'
  }
];
