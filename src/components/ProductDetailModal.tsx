import React, { useState } from 'react';
import { Product, Review, ProductQA, Language, ProductVariant } from '../types';
import { translations } from '../data/translations';
import { formatINR, calculateDiscount, calculateEMI, getDeliveryEstimate } from '../utils/formatters';
import { isValidPincode, lookupPincode } from '../utils/pincodes';
import { buildProductInquiryWhatsAppUrl } from '../services/whatsapp/whatsappService';
import {
  X,
  Star,
  Heart,
  Share2,
  Tag,
  ShoppingCart,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  HelpCircle,
  MessageCircle,
  Flag,
  Flame,
  Check,
  PlayCircle
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  reviews: Review[];
  qnas: ProductQA[];
  allProducts: Product[];
  language: Language;
  pincode: string;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onClose: () => void;
  onAddToCart: (product: Product, quantity?: number, variant?: ProductVariant) => void;
  onBuyNow: (product: Product, variant?: ProductVariant) => void;
  onOpenBhaav: (product: Product) => void;
  onAddReview: (review: Omit<Review, 'id' | 'date'>) => void;
  onAddQuestion: (productId: string, question: string) => void;
  onSelectSimilarProduct: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  reviews,
  qnas,
  allProducts,
  language,
  pincode,
  isWishlisted,
  onToggleWishlist,
  onClose,
  onAddToCart,
  onBuyNow,
  onOpenBhaav,
  onAddReview,
  onAddQuestion,
  onSelectSimilarProduct
}) => {
  const t = translations[language];

  // Gallery Active Image
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Variant Selection
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product?.variants && product.variants.length > 0 ? product.variants[0] : undefined
  );

  // Review Form state
  const [ratingInput, setRatingInput] = useState<number>(5);
  const [userNameInput, setUserNameInput] = useState<string>('');
  const [commentInput, setCommentInput] = useState<string>('');
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);

  // Q&A Question input
  const [questionInput, setQuestionInput] = useState('');
  const [questionSubmitted, setQuestionSubmitted] = useState(false);

  if (!product) return null;

  const productReviews = reviews.filter(r => r.productId === product.id);
  const productQnas = qnas.filter(q => q.productId === product.id);

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentMrp = selectedVariant ? selectedVariant.mrp : product.mrp;
  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;

  const discount = calculateDiscount(currentPrice, currentMrp);
  const emi = calculateEMI(currentPrice, 6);
  const hasValidPin = isValidPincode(pincode);
  const pinDetails = lookupPincode(pincode);
  const delivery = getDeliveryEstimate(product.isLocalStore, hasValidPin, language);

  const galleryImages = product.images && product.images.length > 0 ? product.images : [product.imageUrl];

  // Frequently bought together item
  const frequentlyBought = allProducts.find(p => p.id !== product.id && p.category === product.category) || allProducts[0];

  // Customers also viewed
  const similarProducts = allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);

  const handleShareWhatsApp = () => {
    const productName = language === 'hi' ? product.nameHi : product.name;
    const shareText = encodeURIComponent(
      `Check out ${productName} by ${product.brand} on Haat for ${formatINR(currentPrice)} (Bhaav-Taav available! Cash on Delivery):\n${window.location.origin}`
    );
    window.open(`https://wa.me/?text=${shareText}`, '_blank');
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userNameInput.trim() || !commentInput.trim()) return;

    onAddReview({
      productId: product.id,
      userId: `user-${Date.now().toString().slice(-4)}`,
      userName: userNameInput.trim(),
      rating: ratingInput,
      comment: commentInput.trim(),
      verifiedPurchase: true
    });

    setReviewSubmitted(true);
    setCommentInput('');
  };

  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionInput.trim()) return;

    onAddQuestion(product.id, questionInput.trim());
    setQuestionSubmitted(true);
    setQuestionInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-ink/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-surface dark:bg-charcoal-800 border border-subtle rounded max-h-[94vh] flex flex-col overflow-hidden">
        {/* Breadcrumb Header Bar */}
        <div className="p-3.5 border-b border-subtle flex items-center justify-between text-xs bg-concrete/40 dark:bg-charcoal-900">
          <div className="flex items-center gap-1.5 text-ink-muted dark:text-zinc-400 overflow-hidden text-ellipsis whitespace-nowrap">
            <span>Haat</span>
            <span>/</span>
            <span>{product.category}</span>
            {product.subCategory && (
              <>
                <span>/</span>
                <span>{product.subCategory}</span>
              </>
            )}
            <span>/</span>
            <span className="font-semibold text-ink dark:text-zinc-200 truncate">{product.brand}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-ink-muted hover:text-ink dark:text-zinc-400 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Main Top Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left: Multi-photo Gallery (5 cols) */}
            <div className="md:col-span-5 space-y-3">
              <div className="relative aspect-square rounded border border-subtle overflow-hidden bg-concrete dark:bg-charcoal-900 group">
                <img
                  src={galleryImages[activeImageIdx] || product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />
                {product.isLocalStore && (
                  <span className="absolute top-3 left-3 bg-slate-deep text-white text-xs font-semibold px-2.5 py-1 rounded border border-brass flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-brass" />
                    <span>Local Store</span>
                  </span>
                )}
                {discount > 0 && (
                  <span className="absolute bottom-3 left-3 bg-brick text-white text-xs font-bold px-2 py-0.5 rounded">
                    {discount}% OFF
                  </span>
                )}
              </div>

              {/* Thumbnail Strip (up to 6 photos) */}
              {galleryImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`w-14 h-14 rounded border-2 overflow-hidden shrink-0 transition ${
                        activeImageIdx === idx ? 'border-brass' : 'border-subtle opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Short 15s Product Video Button */}
              <button
                type="button"
                onClick={() => setShowVideoModal(true)}
                className="w-full py-1.5 px-3 bg-concrete/60 dark:bg-charcoal-700/60 hover:border-brass border border-subtle rounded text-xs font-semibold text-slate-deep dark:text-brass flex items-center justify-center gap-1.5 transition"
              >
                <PlayCircle className="w-4 h-4 text-brass" />
                <span>Watch 15s Craft Story Video</span>
              </button>

              {/* Action buttons (Wishlist & WhatsApp) */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onToggleWishlist(product.id)}
                  className={`py-2 px-3 border border-subtle rounded text-xs font-medium flex items-center justify-center gap-2 transition ${
                    isWishlisted ? 'bg-brick-light/50 text-brick border-brick/40' : 'hover:bg-concrete text-ink dark:text-zinc-200'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-brick text-brick' : ''}`} />
                  <span>{isWishlisted ? 'Saved to Wishlist' : 'Save to Wishlist'}</span>
                </button>

                <button
                  onClick={handleShareWhatsApp}
                  className="py-2 px-3 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded text-xs font-medium flex items-center justify-center gap-1.5 transition"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share on WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Right: Product Info, Variants, Bhaav-Taav (7 cols) */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-ink-muted mb-1">
                  <span className="font-bold text-slate-deep dark:text-brass uppercase tracking-wider">
                    {product.brand}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5 font-bold text-amber-700 dark:text-brass bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.2 rounded">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{product.rating}</span>
                  </span>
                  <span>({productReviews.length} verified reviews)</span>
                </div>

                <h1 className="text-lg sm:text-2xl font-heading font-bold text-ink dark:text-zinc-100 leading-tight">
                  {language === 'hi' ? product.nameHi : product.name}
                </h1>

                {/* Seller & Local partner attribution */}
                <p className="text-xs text-ink-muted mt-1 flex items-center gap-1.5">
                  <span>Sold by:</span>
                  <strong className="text-slate-deep dark:text-zinc-200">{product.sellerName}</strong>
                  {product.isLocalStore && (
                    <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                      (⚡ Dispatches from your local city cluster)
                    </span>
                  )}
                </p>
              </div>

              {/* Price & GST */}
              <div className="p-3 bg-concrete/60 dark:bg-charcoal-900 border border-subtle rounded">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-heading font-bold text-slate-deep dark:text-brass">
                    {formatINR(currentPrice)}
                  </span>
                  {currentMrp > currentPrice && (
                    <span className="text-sm text-ink-light line-through">
                      {formatINR(currentMrp)}
                    </span>
                  )}
                  {discount > 0 && (
                    <span className="text-xs font-semibold text-brick">
                      {discount}% OFF
                    </span>
                  )}
                </div>
                <div className="mt-1 flex items-center gap-3 text-xs text-ink-muted dark:text-zinc-400">
                  <span>All prices inclusive of GST</span>
                  <span>•</span>
                  <span>EMI from <strong>{formatINR(emi)}/mo</strong></span>
                </div>
              </div>

              {/* Size & Color Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-ink dark:text-zinc-300 block">
                    Choose Variant / Option:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => {
                      const isSelected = selectedVariant?.id === v.id;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setSelectedVariant(v)}
                          className={`py-1.5 px-3 rounded text-xs border font-medium transition flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-slate-deep text-white border-slate-deep dark:bg-brass dark:text-slate-deep'
                              : 'bg-surface dark:bg-charcoal-700 text-ink dark:text-zinc-200 border-subtle hover:border-brass'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                          <span>{v.size || v.color}</span>
                          <span className="text-[10px] opacity-80 font-mono">({formatINR(v.price)})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Delivery Estimate Box */}
              <div className="p-3 border border-subtle rounded space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-ink dark:text-zinc-200 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-brass" />
                    <span>Delivery Details</span>
                  </span>
                  <span className="text-[11px] text-ink-muted">
                    {pinDetails ? `${pinDetails.city} (${pinDetails.pincode})` : 'Enter PIN in header'}
                  </span>
                </div>

                <p className={`font-semibold ${delivery.isSameDay ? 'text-emerald-700 dark:text-emerald-400' : 'text-ink-muted'}`}>
                  {delivery.text}
                </p>

                <p className="text-[11px] text-ink-muted">
                  • Cash on Delivery & Doorstep UPI QR accepted. No prepayment required.
                </p>
              </div>

              {/* Stock Status */}
              <div className="text-xs">
                {currentStock > 0 ? (
                  <span className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>In Stock ({currentStock} available)</span>
                  </span>
                ) : (
                  <span className="text-brick font-medium">Out of Stock</span>
                )}
              </div>

              {/* Actions */}
              <div className="pt-2 space-y-2.5">
                {/* Bhaav-Taav 2.0 Button */}
                <button
                  onClick={() => onOpenBhaav(product)}
                  className="w-full py-2.5 px-4 bg-brass-light hover:bg-brass/25 dark:bg-charcoal-700 border-2 border-brass text-slate-deep dark:text-brass text-xs font-bold tracking-wider uppercase rounded flex items-center justify-center gap-2 transition"
                >
                  <Tag className="w-4 h-4 text-brass" />
                  <span>Make an Offer (Bhaav-Taav 2.0)</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onAddToCart(product, 1, selectedVariant)}
                    disabled={currentStock <= 0}
                    className="py-2.5 px-4 bg-concrete hover:bg-zinc-200 dark:bg-charcoal-700 text-ink dark:text-zinc-100 text-xs font-semibold uppercase tracking-wider rounded flex items-center justify-center gap-2 transition disabled:opacity-50"
                  >
                    <ShoppingCart className="w-4 h-4 text-slate-deep dark:text-brass" />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    onClick={() => onBuyNow(product, selectedVariant)}
                    disabled={currentStock <= 0}
                    className="py-2.5 px-4 bg-slate-deep hover:bg-slate-hover text-white text-xs font-semibold uppercase tracking-wider rounded flex items-center justify-center gap-2 transition disabled:opacity-50"
                  >
                    <span>Buy Now (COD)</span>
                    <ArrowRight className="w-4 h-4 text-brass" />
                  </button>
                </div>

                {/* WhatsApp Click-to-Chat Direct Actions */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href={buildProductInquiryWhatsAppUrl({
                      sellerWhatsApp: (product as any).sellerWhatsApp || '919234725874',
                      productTitle: product.name,
                      productPrice: currentPrice,
                      productId: product.id,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-2.5 border border-emerald-600/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-[11px] font-semibold rounded flex items-center justify-center gap-1.5 transition text-center"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Ask on WhatsApp</span>
                  </a>
                  <a
                    href={buildProductInquiryWhatsAppUrl({
                      sellerWhatsApp: (product as any).sellerWhatsApp || '919234725874',
                      productTitle: product.name,
                      productPrice: currentPrice,
                      productId: product.id,
                      isBhaavTaav: true,
                      offeredPrice: Math.round(currentPrice * 0.9),
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-2.5 border border-brass/50 text-slate-deep dark:text-brass hover:bg-brass-light/20 text-[11px] font-semibold rounded flex items-center justify-center gap-1.5 transition text-center"
                  >
                    <Tag className="w-3.5 h-3.5 text-brass" />
                    <span>Bhaav on WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Frequently Bought Together Recommendation */}
          {frequentlyBought && (
            <div className="pt-4 border-t border-subtle">
              <h3 className="text-xs font-heading font-semibold uppercase tracking-wider text-ink dark:text-zinc-200 mb-2">
                Frequently Bought Together
              </h3>
              <div className="p-3 bg-concrete/40 dark:bg-charcoal-700/40 border border-subtle rounded flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img src={frequentlyBought.imageUrl} alt={frequentlyBought.name} className="w-12 h-12 object-cover rounded border" />
                  <div>
                    <h4 className="font-semibold text-ink dark:text-zinc-200 line-clamp-1">{frequentlyBought.name}</h4>
                    <span className="font-bold text-slate-deep dark:text-brass">{formatINR(frequentlyBought.price)}</span>
                  </div>
                </div>
                <button
                  onClick={() => onAddToCart(frequentlyBought, 1)}
                  className="py-1 px-3 bg-slate-deep text-white text-[11px] font-semibold uppercase rounded"
                >
                  Add Both to Cart
                </button>
              </div>
            </div>
          )}

          {/* Product Q&A (Customer asks, seller answers) */}
          <div className="pt-6 border-t border-subtle space-y-3 text-xs">
            <h3 className="text-sm font-heading font-semibold uppercase tracking-wider text-ink dark:text-zinc-200 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-brass" />
              <span>Customer Questions & Answers</span>
            </h3>

            {productQnas.length === 0 ? (
              <p className="text-ink-muted italic">No questions yet. Be the first to ask the seller!</p>
            ) : (
              <div className="space-y-3">
                {productQnas.map((q) => (
                  <div key={q.id} className="p-3 bg-concrete/30 dark:bg-charcoal-700/30 rounded border border-subtle space-y-1.5">
                    <p className="font-semibold text-ink dark:text-zinc-100 flex items-center gap-1.5">
                      <span className="font-bold text-slate-deep dark:text-brass">Q:</span>
                      <span>{q.question}</span>
                      <span className="text-[10px] text-ink-muted font-normal ml-auto">Asked by {q.askedBy}</span>
                    </p>
                    {q.answers.map((a) => (
                      <div key={a.id} className="pl-4 border-l-2 border-brass/50 text-ink-muted dark:text-zinc-300">
                        <span className="font-bold text-emerald-700 dark:text-emerald-400">A: </span>
                        <span>{a.answer}</span>
                        <span className="block text-[10px] text-ink-light pt-0.5">• {a.answeredBy}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* Ask Question Form */}
            <form onSubmit={handleSubmitQuestion} className="flex gap-2 pt-2">
              <input
                type="text"
                value={questionInput}
                onChange={(e) => setQuestionInput(e.target.value)}
                placeholder="Have a question? Ask the seller or community..."
                className="flex-1 px-3 py-1.5 bg-concrete dark:bg-charcoal-700 border border-subtle rounded text-xs"
              />
              <button
                type="submit"
                className="py-1.5 px-3 bg-slate-deep text-white text-xs font-semibold uppercase rounded"
              >
                Ask Question
              </button>
            </form>
            {questionSubmitted && (
              <span className="text-[11px] text-emerald-700 block">Question submitted! The seller will answer shortly.</span>
            )}
          </div>

          {/* Customer Reviews Section */}
          <div className="pt-6 border-t border-subtle space-y-4">
            <h3 className="text-sm font-heading font-semibold uppercase tracking-wider text-ink dark:text-zinc-200">
              Verified Customer Reviews ({productReviews.length})
            </h3>

            <div className="space-y-3">
              {productReviews.map(r => (
                <div key={r.id} className="p-3 bg-concrete/40 dark:bg-charcoal-700/40 border border-subtle rounded text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-ink dark:text-zinc-200">{r.userName}</span>
                      {r.verifiedPurchase && (
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-400 flex items-center gap-0.5">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Verified Purchase</span>
                        </span>
                      )}
                    </div>
                    <button className="text-[10px] text-ink-muted hover:text-brick flex items-center gap-0.5">
                      <Flag className="w-3 h-3" />
                      <span>Report Abuse</span>
                    </button>
                  </div>

                  <div className="flex items-center text-brass gap-0.5">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} className={`w-3.5 h-3.5 ${star <= r.rating ? 'fill-current' : 'text-zinc-300'}`} />
                    ))}
                  </div>

                  <p className="text-ink-muted dark:text-zinc-300">{r.comment}</p>
                </div>
              ))}
            </div>

            {/* Write Review */}
            <div className="p-3 bg-concrete/50 dark:bg-charcoal-900 rounded border border-subtle space-y-2 text-xs">
              <span className="font-semibold uppercase tracking-wider block">Write a Verified Review</span>
              {reviewSubmitted ? (
                <p className="text-emerald-700">Thank you! Your verified review has been published.</p>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <button key={s} type="button" onClick={() => setRatingInput(s)} className="text-brass">
                        <Star className={`w-4 h-4 ${s <= ratingInput ? 'fill-current' : 'text-zinc-300'}`} />
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={userNameInput}
                    onChange={(e) => setUserNameInput(e.target.value)}
                    placeholder="Your Full Name"
                    className="w-full px-2.5 py-1.5 bg-surface dark:bg-charcoal-800 border border-subtle rounded text-xs"
                    required
                  />
                  <textarea
                    rows={2}
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Describe your experience with this item..."
                    className="w-full px-2.5 py-1.5 bg-surface dark:bg-charcoal-800 border border-subtle rounded text-xs"
                    required
                  />
                  <button
                    type="submit"
                    className="py-1 px-3 bg-slate-deep text-white text-xs font-semibold uppercase rounded"
                  >
                    Submit Review
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 15s Craft Video Player Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm bg-surface dark:bg-charcoal-800 border border-subtle rounded p-4 space-y-3 text-xs text-center">
            <div className="flex justify-between items-center border-b border-subtle pb-2">
              <span className="font-heading font-bold text-xs uppercase tracking-wider text-slate-deep dark:text-brass flex items-center gap-1.5">
                <PlayCircle className="w-4 h-4 text-brass" />
                <span>15-Second Maker Craft Reel</span>
              </span>
              <button onClick={() => setShowVideoModal(false)}><X className="w-4 h-4" /></button>
            </div>

            <div className="relative aspect-[9/16] max-h-[380px] mx-auto rounded overflow-hidden bg-black flex items-center justify-center">
              <img
                src={product.imageUrl}
                alt=""
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 flex flex-col justify-between p-3 text-white text-left">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="bg-brick px-2 py-0.5 rounded font-mono font-bold">15s REEL</span>
                  <span className="font-mono">0:15 / 0:15</span>
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm leading-tight">{product.name}</h4>
                  <p className="text-[10px] text-zinc-300 mt-0.5">By {product.sellerName}</p>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-ink-muted">
              Live craft process recorded by the artisan at the workshop.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
