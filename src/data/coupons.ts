import { Coupon } from '../types';

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'HAAT100',
    discountType: 'flat',
    discountValue: 100,
    minCartAmount: 699,
    expiryDate: '2026-12-31',
    usageLimit: 5000,
    timesUsed: 412,
    createdBy: 'admin',
    isActive: true
  },
  {
    code: 'DESI15',
    discountType: 'percent',
    discountValue: 15,
    minCartAmount: 499,
    maxDiscount: 250,
    expiryDate: '2026-12-15',
    usageLimit: 2000,
    timesUsed: 180,
    createdBy: 'admin',
    isActive: true
  },
  {
    code: 'KIRANA50',
    discountType: 'flat',
    discountValue: 50,
    minCartAmount: 399,
    expiryDate: '2026-11-30',
    usageLimit: 1000,
    timesUsed: 95,
    category: 'catKirana',
    createdBy: 'seller-1',
    isActive: true
  },
  {
    code: 'BOAT200',
    discountType: 'flat',
    discountValue: 200,
    minCartAmount: 1200,
    expiryDate: '2026-11-25',
    usageLimit: 500,
    timesUsed: 88,
    sellerId: 'seller-4',
    createdBy: 'seller-4',
    isActive: true
  }
];
