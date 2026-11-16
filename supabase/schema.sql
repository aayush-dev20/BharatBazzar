-- ==============================================================================
-- HAAT ONLINE MARKETPLACE - PRODUCTION POSTGRES / SUPABASE SCHEMA
-- Includes 29 tables, foreign keys, indexes, and comprehensive Row Level Security (RLS)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone VARCHAR(15) UNIQUE NOT NULL,
  name VARCHAR(120),
  email VARCHAR(255),
  role VARCHAR(20) NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'seller', 'sponsor', 'admin')),
  preferred_language VARCHAR(10) NOT NULL DEFAULT 'en' CHECK (preferred_language IN ('en', 'hi', 'pa', 'mr', 'ta', 'bn', 'te')),
  avatar_url TEXT,
  whatsapp_opt_in BOOLEAN NOT NULL DEFAULT true,
  daily_bhaav_count INT NOT NULL DEFAULT 0,
  daily_scratch_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. ADDRESSES TABLE
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  recipient_name VARCHAR(120) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  street_address TEXT NOT NULL,
  landmark VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  pincode VARCHAR(6) NOT NULL,
  address_type VARCHAR(20) NOT NULL DEFAULT 'home' CHECK (address_type IN ('home', 'work', 'other')),
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. SELLERS TABLE
CREATE TABLE IF NOT EXISTS public.sellers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  shop_name VARCHAR(200) NOT NULL,
  description TEXT,
  logo_url TEXT,
  banner_url TEXT,
  whatsapp_number VARCHAR(15), -- seller custom WhatsApp (normalized 91XXXXXXXXXX)
  pan VARCHAR(10) NOT NULL,
  gstin VARCHAR(15),
  pickup_address TEXT NOT NULL,
  pincode VARCHAR(6) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  operating_hours VARCHAR(100) DEFAULT '9:00 AM - 8:00 PM',
  supports_same_day BOOLEAN NOT NULL DEFAULT false,
  supports_click_collect BOOLEAN NOT NULL DEFAULT false,
  kyc_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'approved', 'rejected', 'suspended')),
  is_verified_local BOOLEAN NOT NULL DEFAULT false,
  rating NUMERIC(3,2) NOT NULL DEFAULT 5.00,
  review_count INT NOT NULL DEFAULT 0,
  follower_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id VARCHAR(60) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  name_hi VARCHAR(120) NOT NULL,
  slug VARCHAR(120) UNIQUE NOT NULL,
  parent_id VARCHAR(60) REFERENCES public.categories(id),
  icon VARCHAR(50),
  display_order INT NOT NULL DEFAULT 0
);

-- 5. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
  category_id VARCHAR(60) NOT NULL REFERENCES public.categories(id),
  title VARCHAR(255) NOT NULL,
  title_hi VARCHAR(255),
  description TEXT NOT NULL,
  brand VARCHAR(120) NOT NULL,
  price INT NOT NULL, -- price in INR paise or rupees (stored in whole rupees)
  mrp INT NOT NULL,
  lowest_bhaav_price INT NOT NULL, -- seller minimum bargain reserve
  stock INT NOT NULL DEFAULT 0,
  is_local_store BOOLEAN NOT NULL DEFAULT false,
  is_second_hand BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  rating NUMERIC(3,2) NOT NULL DEFAULT 0.00,
  review_count INT NOT NULL DEFAULT 0,
  sold_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. VARIANTS TABLE
CREATE TABLE IF NOT EXISTS public.variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  title VARCHAR(120) NOT NULL,
  size VARCHAR(50),
  color VARCHAR(50),
  sku VARCHAR(80) UNIQUE,
  price_delta INT NOT NULL DEFAULT 0, -- relative adjustment to base product price
  stock INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. PRODUCT_IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT false
);

-- 8. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(150),
  comment TEXT NOT NULL,
  image_urls TEXT[] DEFAULT '{}',
  is_verified_purchase BOOLEAN NOT NULL DEFAULT false,
  reported_abuse_count INT NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'hidden', 'flagged')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT one_review_per_user_product UNIQUE (product_id, user_id)
);

-- 9. QUESTIONS (Q&A) TABLE
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT,
  answered_by UUID REFERENCES public.users(id),
  answered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. CARTS TABLE
CREATE TABLE IF NOT EXISTS public.carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES public.variants(id),
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  is_saved_for_later BOOLEAN NOT NULL DEFAULT false,
  negotiated_price INT, -- locked negotiated price if Bhaav-taav was accepted
  negotiated_expiry TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT one_cart_item UNIQUE (user_id, product_id, variant_id, is_saved_for_later)
);

-- 11. WISHLISTS TABLE
CREATE TABLE IF NOT EXISTS public.wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  price_when_saved INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT one_wishlist_entry UNIQUE (user_id, product_id)
);

-- 12. OFFERS (BHAAV-TAAV) TABLE
CREATE TABLE IF NOT EXISTS public.offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  offered_price INT NOT NULL,
  counter_price INT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'countered', 'rejected', 'expired')),
  rounds_count INT NOT NULL DEFAULT 1 CHECK (rounds_count <= 3),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(30) UNIQUE NOT NULL, -- e.g. HT-2026-100234
  customer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  seller_id UUID NOT NULL REFERENCES public.sellers(id) ON DELETE RESTRICT,
  status VARCHAR(30) NOT NULL DEFAULT 'placed' CHECK (status IN (
    'placed', 'pending_whatsapp', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'
  )),
  delivery_type VARCHAR(20) NOT NULL DEFAULT 'standard' CHECK (delivery_type IN ('standard', 'same_day', 'click_and_collect')),
  delivery_slot VARCHAR(50) NOT NULL, -- e.g. "Today 6:00 PM - 8:00 PM"
  delivery_otp VARCHAR(6) NOT NULL,   -- 6-digit delivery verification OTP for COD
  payment_method VARCHAR(20) NOT NULL DEFAULT 'cod' CHECK (payment_method IN ('cod', 'upi_qr_delivery')),
  payment_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'collected', 'refunded_offline')),
  subtotal INT NOT NULL,
  delivery_charge INT NOT NULL DEFAULT 0,
  coupon_discount INT NOT NULL DEFAULT 0,
  scratch_reward_discount INT NOT NULL DEFAULT 0,
  total_amount INT NOT NULL,
  gst_amount INT NOT NULL, -- 18% inclusive GST component
  shipping_address JSONB NOT NULL, -- snapshot of recipient, street, pincode, city, state, mobile
  whatsapp_opt_in BOOLEAN NOT NULL DEFAULT true,
  cancelled_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. ORDER_ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  variant_id UUID REFERENCES public.variants(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  variant_title VARCHAR(120),
  quantity INT NOT NULL CHECK (quantity > 0),
  unit_price INT NOT NULL,
  total_price INT NOT NULL,
  image_url TEXT NOT NULL
);

-- 15. ORDER_EVENTS TABLE (Audit Trail)
CREATE TABLE IF NOT EXISTS public.order_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status VARCHAR(30) NOT NULL,
  notes TEXT,
  actor_id UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. RETURNS TABLE
CREATE TABLE IF NOT EXISTS public.returns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
  reason VARCHAR(50) NOT NULL CHECK (reason IN ('damaged', 'defective', 'wrong_item', 'size_fit_issue', 'quality_not_as_expected', 'other')),
  details TEXT NOT NULL,
  photo_urls TEXT[] DEFAULT '{}',
  action_type VARCHAR(20) NOT NULL DEFAULT 'return' CHECK (action_type IN ('return', 'exchange')),
  status VARCHAR(20) NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'approved', 'rejected', 'picked_up', 'completed')),
  seller_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17. COUPONS TABLE
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(30) UNIQUE NOT NULL,
  seller_id UUID REFERENCES public.sellers(id) ON DELETE CASCADE, -- null for platform-wide
  category_id VARCHAR(60) REFERENCES public.categories(id),
  discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'flat')),
  discount_value INT NOT NULL,
  min_cart_value INT NOT NULL DEFAULT 0,
  max_discount_cap INT,
  usage_limit INT DEFAULT 1000,
  used_count INT NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 18. SPONSORS TABLE
CREATE TABLE IF NOT EXISTS public.sponsors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  company_name VARCHAR(200) NOT NULL,
  contact_person VARCHAR(120) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  email VARCHAR(255) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 19. CAMPAIGNS TABLE
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sponsor_id UUID NOT NULL REFERENCES public.sponsors(id) ON DELETE CASCADE,
  campaign_name VARCHAR(200) NOT NULL,
  budget INT NOT NULL,
  reward_max_per_card INT NOT NULL,
  total_cards_count INT NOT NULL,
  issued_cards_count INT NOT NULL DEFAULT 0,
  scratched_cards_count INT NOT NULL DEFAULT 0,
  redeemed_cards_count INT NOT NULL DEFAULT 0,
  target_category VARCHAR(60) REFERENCES public.categories(id),
  target_city VARCHAR(100),
  platform_fee_percent INT NOT NULL DEFAULT 10,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 20. SCRATCH_CARDS TABLE
CREATE TABLE IF NOT EXISTS public.scratch_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  reward_amount INT NOT NULL,
  is_scratched BOOLEAN NOT NULL DEFAULT false,
  scratched_at TIMESTAMPTZ,
  is_redeemed BOOLEAN NOT NULL DEFAULT false,
  order_id UUID REFERENCES public.orders(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 21. WALLET_ENTRIES TABLE
CREATE TABLE IF NOT EXISTS public.wallet_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount INT NOT NULL,
  entry_type VARCHAR(20) NOT NULL CHECK (entry_type IN ('credit_reward', 'debit_order', 'referral_bonus')),
  reference_id VARCHAR(100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 22. GROUP_BUYS TABLE
CREATE TABLE IF NOT EXISTS public.group_buys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  target_members INT NOT NULL DEFAULT 10,
  current_members INT NOT NULL DEFAULT 1,
  discount_percent INT NOT NULL DEFAULT 20,
  mohalla_name VARCHAR(150) NOT NULL,
  pincode VARCHAR(6) NOT NULL,
  deadline TIMESTAMPTZ NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'expired_cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 23. GROUP_BUY_MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.group_buy_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_buy_id UUID NOT NULL REFERENCES public.group_buys(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT one_member_per_group UNIQUE (group_buy_id, user_id)
);

-- 24. REFERRALS TABLE
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'order_delivered', 'rewarded')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 25. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type VARCHAR(30) NOT NULL CHECK (type IN ('order_status', 'offer_reply', 'price_drop', 'reward_won', 'coupon')),
  title VARCHAR(150) NOT NULL,
  message TEXT NOT NULL,
  link_url TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 26. WHATSAPP_MESSAGES TABLE (Audit log of outgoing/incoming WhatsApp communications)
CREATE TABLE IF NOT EXISTS public.whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('platform', 'seller', 'customer')),
  sender_number VARCHAR(15) NOT NULL,
  recipient_number VARCHAR(15) NOT NULL,
  message_body TEXT NOT NULL,
  template_name VARCHAR(60),
  status VARCHAR(20) NOT NULL DEFAULT 'sent' CHECK (status IN ('draft', 'sent', 'delivered', 'failed')),
  error_log TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 27. LEDGER_ENTRIES TABLE (Haat Khata - Shopkeeper credit recording without lending/interest)
CREATE TABLE IF NOT EXISTS public.ledger_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
  customer_name VARCHAR(120) NOT NULL,
  customer_phone VARCHAR(15) NOT NULL,
  amount INT NOT NULL,
  transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('credit_given', 'payment_received')),
  description TEXT,
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 28. USED_LISTINGS TABLE (Community Resale)
CREATE TABLE IF NOT EXISTS public.used_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  condition VARCHAR(30) NOT NULL CHECK (condition IN ('like_new', 'good', 'fair')),
  price INT NOT NULL,
  city VARCHAR(100) NOT NULL,
  pincode VARCHAR(6) NOT NULL,
  images TEXT[] DEFAULT '{}',
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold', 'reported_hidden')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 29. ARTISAN_PROFILES TABLE (Maker Heritage Stories)
CREATE TABLE IF NOT EXISTS public.artisan_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL UNIQUE REFERENCES public.sellers(id) ON DELETE CASCADE,
  artisan_name VARCHAR(120) NOT NULL,
  craft_tradition VARCHAR(150) NOT NULL,
  region VARCHAR(120) NOT NULL,
  story TEXT NOT NULL,
  portrait_url TEXT NOT NULL,
  workshop_photos TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_seller ON public.products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller ON public.orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_carts_user ON public.carts(user_id);
CREATE INDEX IF NOT EXISTS idx_offers_product ON public.offers(product_id);
CREATE INDEX IF NOT EXISTS idx_offers_user ON public.offers(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS across every table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scratch_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_buys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_buy_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.used_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artisan_profiles ENABLE ROW LEVEL SECURITY;

-- 1. USERS RLS
CREATE POLICY "Users can read and update their own profile"
  ON public.users
  FOR ALL
  USING (auth.uid() = id);

-- 2. ADDRESSES RLS
CREATE POLICY "Users can view and manage their own addresses"
  ON public.addresses
  FOR ALL
  USING (auth.uid() = user_id);

-- 3. SELLERS RLS
CREATE POLICY "Anyone can view approved sellers"
  ON public.sellers
  FOR SELECT
  USING (kyc_status = 'approved');

CREATE POLICY "Sellers can manage their own profile"
  ON public.sellers
  FOR ALL
  USING (auth.uid() = user_id);

-- 4. CATEGORIES RLS
CREATE POLICY "Public can view categories"
  ON public.categories
  FOR SELECT
  USING (true);

-- 5. PRODUCTS & VARIANTS RLS
CREATE POLICY "Public can view active products"
  ON public.products
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Sellers can manage their own products"
  ON public.products
  FOR ALL
  USING (seller_id IN (SELECT id FROM public.sellers WHERE user_id = auth.uid()));

CREATE POLICY "Public can view product variants"
  ON public.variants
  FOR SELECT
  USING (true);

CREATE POLICY "Sellers can manage their product variants"
  ON public.variants
  FOR ALL
  USING (product_id IN (
    SELECT p.id FROM public.products p
    JOIN public.sellers s ON p.seller_id = s.id
    WHERE s.user_id = auth.uid()
  ));

-- 6. PRODUCT IMAGES RLS
CREATE POLICY "Public can view product images"
  ON public.product_images
  FOR SELECT
  USING (true);

CREATE POLICY "Sellers can manage their product images"
  ON public.product_images
  FOR ALL
  USING (product_id IN (
    SELECT p.id FROM public.products p
    JOIN public.sellers s ON p.seller_id = s.id
    WHERE s.user_id = auth.uid()
  ));

-- 7. REVIEWS RLS
CREATE POLICY "Public can view published reviews"
  ON public.reviews
  FOR SELECT
  USING (status = 'published');

CREATE POLICY "Users can manage their own reviews"
  ON public.reviews
  FOR ALL
  USING (auth.uid() = user_id);

-- 8. CARTS RLS
CREATE POLICY "Users can manage their own cart"
  ON public.carts
  FOR ALL
  USING (auth.uid() = user_id);

-- 9. WISHLISTS RLS
CREATE POLICY "Users can manage their own wishlist"
  ON public.wishlists
  FOR ALL
  USING (auth.uid() = user_id);

-- 10. OFFERS (Bhaav-taav) RLS
CREATE POLICY "Customers can view their own offers"
  ON public.offers
  FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Sellers can view and respond to offers on their products"
  ON public.offers
  FOR ALL
  USING (seller_id IN (SELECT id FROM public.sellers WHERE user_id = auth.uid()));

-- 11. ORDERS RLS
-- Crucial rule: A customer cannot read another customer's order.
CREATE POLICY "Customers can only view their own orders"
  ON public.orders
  FOR SELECT
  USING (auth.uid() = customer_id);

CREATE POLICY "Customers can insert orders for themselves"
  ON public.orders
  FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Sellers can view orders assigned to their store"
  ON public.orders
  FOR SELECT
  USING (seller_id IN (SELECT id FROM public.sellers WHERE user_id = auth.uid()));

CREATE POLICY "Sellers can update status of orders assigned to them"
  ON public.orders
  FOR UPDATE
  USING (seller_id IN (SELECT id FROM public.sellers WHERE user_id = auth.uid()));

-- 12. ORDER_ITEMS RLS
CREATE POLICY "Customers can view their order items"
  ON public.order_items
  FOR SELECT
  USING (order_id IN (SELECT id FROM public.orders WHERE customer_id = auth.uid()));

CREATE POLICY "Sellers can view their store order items"
  ON public.order_items
  FOR SELECT
  USING (order_id IN (
    SELECT o.id FROM public.orders o
    JOIN public.sellers s ON o.seller_id = s.id
    WHERE s.user_id = auth.uid()
  ));

-- 13. RETURNS RLS
CREATE POLICY "Customers can manage their returns"
  ON public.returns
  FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Sellers can review returns for their items"
  ON public.returns
  FOR ALL
  USING (seller_id IN (SELECT id FROM public.sellers WHERE user_id = auth.uid()));

-- 14. NOTIFICATIONS RLS
CREATE POLICY "Users can only view their own notifications"
  ON public.notifications
  FOR ALL
  USING (auth.uid() = user_id);

-- 15. HAAT KHATA LEDGER RLS
CREATE POLICY "Sellers can manage their ledger entries"
  ON public.ledger_entries
  FOR ALL
  USING (seller_id IN (SELECT id FROM public.sellers WHERE user_id = auth.uid()));
