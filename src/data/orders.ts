import { Order } from '../types';

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'BB-2026-8812',
    userId: 'user-101', // Aarav Sharma
    customerName: 'Aarav Sharma',
    customerPhone: '9820123456',
    items: [
      {
        productId: 'prod-1',
        productName: 'Kashmiri Organic Mogra Kesar - 2g',
        productNameHi: 'कश्मीरी जैविक मोगरा केसर - 2 ग्राम',
        price: 920,
        mrp: 1499,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=800&auto=format&fit=crop&q=80',
        isLocalStore: true,
        wasBargained: true,
        originalPrice: 999
      },
      {
        productId: 'prod-2',
        productName: 'Authentic Pure Brass Masala Dabba',
        productNameHi: 'हस्तनिर्मित शुद्ध पीतल का मसाला डिब्बा',
        price: 1899,
        mrp: 2799,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80',
        isLocalStore: true,
        wasBargained: false
      }
    ],
    itemTotal: 2819,
    deliveryFee: 0, // Free delivery (> ₹499)
    walletDiscount: 50,
    finalTotal: 2769,
    paymentMethod: 'upi',
    paymentDetails: {
      upiId: 'aarav@okaxis'
    },
    shippingAddress: {
      fullName: 'Aarav Sharma',
      phone: '9820123456',
      addressLine: 'Flat 402, Shivam Enclave, M.G. Road',
      landmark: 'Near Central Bank',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      addressType: 'home'
    },
    status: 'delivered',
    isSameDayDelivery: true,
    estimatedDelivery: 'Delivered on 14 Nov 2026',
    createdAt: '2026-11-14T09:15:00Z'
  },
  {
    id: 'BB-2026-9421',
    userId: 'user-101', // Aarav Sharma
    customerName: 'Aarav Sharma',
    customerPhone: '9820123456',
    items: [
      {
        productId: 'prod-4',
        productName: 'A2 Vedic Bilona Gir Cow Ghee - 1000ml',
        productNameHi: 'वैदिक बिलोना A2 गिर गाय का शुद्ध देसी घी - 1 लीटर',
        price: 1549,
        mrp: 2199,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1589927986086-3d10fb5555ca?w=800&auto=format&fit=crop&q=80',
        isLocalStore: true
      }
    ],
    itemTotal: 1549,
    deliveryFee: 0,
    walletDiscount: 25,
    finalTotal: 1524,
    paymentMethod: 'cod',
    shippingAddress: {
      fullName: 'Aarav Sharma',
      phone: '9820123456',
      addressLine: 'Flat 402, Shivam Enclave, M.G. Road',
      landmark: 'Near Central Bank',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      addressType: 'home'
    },
    status: 'shipped',
    isSameDayDelivery: true,
    estimatedDelivery: 'Arriving Today by 7:30 PM',
    createdAt: '2026-11-15T08:30:00Z'
  },
  {
    id: 'BB-2026-9502',
    userId: 'user-102', // Meera Iyer
    customerName: 'Meera Iyer',
    customerPhone: '9840198765',
    items: [
      {
        productId: 'prod-5',
        productName: 'boAt Airdopes 141 ANC True Wireless Earbuds',
        productNameHi: 'boAt एयरडोप्स 141 ANC वायरलेस ईयरबड्स',
        price: 1299,
        mrp: 3990,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
        isLocalStore: true,
        wasBargained: true,
        originalPrice: 1399
      }
    ],
    itemTotal: 1299,
    deliveryFee: 0,
    walletDiscount: 100,
    finalTotal: 1199,
    paymentMethod: 'card',
    paymentDetails: {
      cardLast4: '4192'
    },
    shippingAddress: {
      fullName: 'Meera Iyer',
      phone: '9840198765',
      addressLine: 'Plot 18, 4th Cross, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
      addressType: 'home'
    },
    status: 'packed',
    isSameDayDelivery: true,
    estimatedDelivery: 'Out for dispatch today',
    createdAt: '2026-11-15T10:45:00Z'
  }
];
