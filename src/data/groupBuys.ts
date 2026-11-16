import { MohallaGroupBuy } from '../types';

export const INITIAL_GROUP_BUYS: MohallaGroupBuy[] = [
  {
    id: 'gb-1',
    productId: 'prod-4', // A2 Gir Cow Ghee
    neighborhood: 'Gokuldham Co-op Society, Goregaon East (Mumbai 400063)',
    targetCount: 10,
    joinedCount: 7,
    groupDiscountPercent: 20, // 20% off for 10 buyers
    deadline: '2026-11-18T20:00:00Z',
    members: [
      { userId: 'user-101', userName: 'Aarav Sharma', joinedAt: '2026-11-14T09:00:00Z' },
      { userId: 'user-102', userName: 'Bhide Master', joinedAt: '2026-11-14T11:20:00Z' },
      { userId: 'user-103', userName: 'Madhavi B.', joinedAt: '2026-11-14T14:40:00Z' },
      { userId: 'user-104', userName: 'Taarak Mehta', joinedAt: '2026-11-15T08:15:00Z' },
      { userId: 'user-105', userName: 'Anjali T.', joinedAt: '2026-11-15T10:00:00Z' },
      { userId: 'user-106', userName: 'Dr. Hathi', joinedAt: '2026-11-15T12:30:00Z' },
      { userId: 'user-107', userName: 'Komal Hathi', joinedAt: '2026-11-15T16:45:00Z' }
    ]
  },
  {
    id: 'gb-2',
    productId: 'prod-7', // MP Sharbati Atta 10kg
    neighborhood: 'Green Glen Layout, Bellandur (Bengaluru 560103)',
    targetCount: 8,
    joinedCount: 5,
    groupDiscountPercent: 25,
    deadline: '2026-11-19T18:00:00Z',
    members: [
      { userId: 'user-201', userName: 'Karthik Raja', joinedAt: '2026-11-15T07:00:00Z' },
      { userId: 'user-202', userName: 'Deepa Swaminathan', joinedAt: '2026-11-15T09:30:00Z' },
      { userId: 'user-203', userName: 'Rahul Nair', joinedAt: '2026-11-15T11:00:00Z' },
      { userId: 'user-204', userName: 'Sneha Rao', joinedAt: '2026-11-15T14:10:00Z' },
      { userId: 'user-205', userName: 'Vikram Joshi', joinedAt: '2026-11-15T17:20:00Z' }
    ]
  }
];
