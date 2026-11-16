# Haat (हाट) — India's Online Marketplace

> **Complete Full-Stack Platform Delivered (All 4 Phases)**
> Architectural design • Jost + Hind typography • Concrete `#edeeec`, Slate `#243b42`, Brass `#b08d57` • Prices in ₹ (Indian Numbering).

---

## 🌟 Product Vision & Differentiators

Haat is India's online bazaar, built for shoppers across metros, tier-2 and tier-3 towns.
Three core differentiators traditional e-commerce platforms lack:
1. **Bhaav-taav (भाव-ताव 2.0)**: Live interactive bargaining with 3 counter rounds, 30-min countdown, and seller dashboard inbox.
2. **Local Stores**: Same-day delivery & click-and-collect from verified neighborhood merchants by 6-digit PIN code.
3. **Open Sponsorship**: Brand-funded scratch card pools directly rewarding shoppers with wallet discounts.

---

## 🏛️ All 4 Phases Complete & Implemented

### Phase 1: Core Commerce & WhatsApp Click-to-Chat
- **Payment Architecture**: Zero online payment gateway (strict requirement). Orders are fulfilled as **Cash on Delivery (COD)** or **Doorstep UPI QR**.
- **PaymentProvider Interface**: [PaymentProvider.ts](file:///c:/Users/datbo/Desktop/BharatBazaar/src/services/payment/PaymentProvider.ts) with `CODPaymentProvider` generating and verifying 6-digit numeric Delivery OTPs.
- **Centralized WhatsApp Number**: Fallback configured in `.env` as `WHATSAPP_NUMBER=919234725874`.
- **Database First**: Orders are saved to the database first (`placed` or `pending_whatsapp`).
- **Multi-Seller Cart Splitting**: Carts with items from multiple sellers automatically split into separate orders with separate `wa.me` links routed to each seller's registered number.
- **Strict Character & Encoding Control**: Full support for Hindi text (`हाट ऑर्डर`), ₹, &, #, and line breaks under 1,500 characters.
- **Accounts**: Passwordless Mobile OTP login (`^[6-9]\d{9}$`), address book with 6-digit PIN validation.
- **Catalog**: 40 realistic products across 5 categories, variants (size/color) with reactive pricing and stock, zoom gallery.
- **2G Lite Mode**: Text-only toggle for slow networks.

### Phase 2: Bhaav-Taav 2.0, Deals & Moderation
- **Bhaav-Taav 2.0**: Up to 3 counter-offer rounds, 30-minute lock-in countdown timer, daily limit (5/day), social proof ticker (*"120 people bargained today"*).
- **Seller Bhaav Inbox**: Live dashboard tab allowing sellers to Accept (locks price in customer cart for 24 hours), Counter-Offer, or Decline.
- **Coupons Engine**: Platform and seller coupon creation (percentage or flat, minimum cart value, expiry, usage caps).
- **Reviews & Verified Buyer Badges**: Genuine reviews with photos, verified purchase badge, and abuse reporting.
- **7-Day Returns & Exchanges**: Structured return request submission with seller approval/rejection.
- **In-App Notification Center**: Unread badges for orders, offers, rewards, and price drops.
- **Marketplace Admin Panel**: Seller KYC verification, catalog moderation, review moderation, coupon manager, festival mode switcher (Diwali, Holi, Eid, Standard), and GMV/order analytics.

### Phase 3: Sponsors, Scratch Cards & Social Commerce
- **Brand Sponsorship Pools**: Any sponsor can fund scratch card pools (budget, reward per card, card count, plus 10% platform fee).
- **Interactive Canvas Scratch Card**: Realistic coin abrasion effect with confetti celebration and instant wallet balance credit.
- **Anti-Fraud & Limits**: Rewards generated server-side, applied only on carts $\ge ₹299$, daily scratch limits.
- **WhatsApp Referrals**: Invite friends via WhatsApp; both receive scratch cards upon the friend's first delivered order.
- **Mohalla Group Buy**: Community group deals with live member counters ("7 of 10 joined"), progress bars, discount tiers, and deadline countdowns.
- **Delivery Slots**: Morning (7–11 AM), Afternoon (12–4 PM), Evening (5–9 PM).

### Phase 4: Voice Listing, Haat Khata, Artisans, Resale & PWA
- **Hindi Voice Listing**: Sellers can speak product name, stock, and price in Hindi/English (`hi-IN`) — automatically parsed into a draft product listing.
- **Haat Khata (खाता बही)**: Shopkeeper credit ledger recording credit given and payments received. Includes one-click **Send WhatsApp Reminder** to customers with polite payment request templates. *(Strictly record-keeping; no lending or interest).*
- **Local Artisan Section**: Master artisan stories, portraits, and craft traditions from Moradabad, Kanchipuram, and Jaipur.
- **Community Resale**: Second-hand listings clearly marked `"PRE-OWNED / USED"` with condition details and report abuse flags.
- **Mohalla Activity Feed**: Live verified purchases from neighbors across the neighborhood.
- **15-Second Maker Craft Video**: Product page craft video preview modal.
- **7 Indian Languages**: Full UI localization for English, Hindi, Punjabi, Marathi, Tamil, Bengali, Telugu.
- **PWA Ready**: Web App Manifest (`manifest.json`) and Service Worker (`sw.js`) for offline cart and asset caching.

---

## 👥 Seed Data & Test Accounts

The platform includes **40 realistic Indian products**, **5 verified sellers**, **3 sponsor campaigns**, and one-click test accounts:

| Role | Name | Phone Number | Profile / Shop |
| :--- | :--- | :--- | :--- |
| **Customer** | Aarav Sharma | `9876543210` | Indiranagar, Bengaluru (Default Home & Work addresses) |
| **Seller** | Ramprasad Sharma | `9812345678` | Moradabad Artisan Collective (Brass & Metalcraft) |
| **Seller** | Ghulam Mohammad | `9819001122` | Pampore Spice Hub & Local Kirana (Saffron & Spices) |
| **Seller** | Venkatesh S. | `9840223344` | Kanchi Weavers Guild (Handloom Silk Sarees) |
| **Seller** | Harish Bajaj | `9833445566` | Apex Retail Electronics Hub (Electronics & Cables) |
| **Seller** | Sohan Lal Kumhar | `9829112233` | Jaipur Blue Crafts Studio (Blue Pottery & Clay) |
| **Sponsor** | Vikram Tata | `9834567890` | Tata Consumer Brands Campaign |
| **Admin** | Marketplace Officer | `9899999999` | Haat Platform Governance & Moderation |

---

## 🚀 Quickstart & Setup Steps

```bash
# 1. Clone & enter directory
cd BharatBazaar

# 2. Setup environment variables
cp .env.example .env

# 3. Install dependencies
npm install

# 4. Run automated acceptance test suite (25/25 tests)
npm test

# 5. Build for production
npm run build

# 6. Start development server
npm run dev
```

Open **[http://localhost:3000/](http://localhost:3000/)** in your browser.

---

## 🧪 Automated Test Suite (25 Tests Passing)

All tests are in [tests/acceptance.test.ts](file:///c:/Users/datbo/Desktop/BharatBazaar/tests/acceptance.test.ts):
```
✔ 1. WhatsApp Click-to-Chat & Message Building (6 tests)
✔ 2. Multi-Seller Cart Splitting & Orders (4 tests)
✔ 3. Security & Customer Data Isolation (RLS) (2 tests)
✔ 4. PaymentProvider (COD & Delivery OTP) (3 tests)
✔ 5. Bhaav-Taav (Bargaining) Logic Rules (3 tests)
✔ 6. Coupons & Return Policies Validation (2 tests)
✔ 7. Haat Khata (Shopkeeper Credit Ledger) Rules (2 tests)
✔ 8. Sponsors, Scratch Cards & Mohalla Group Buy (3 tests)
# tests 25
# pass 25
# fail 0
```
