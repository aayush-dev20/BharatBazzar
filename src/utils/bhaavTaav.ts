import { Product, BhaavOfferResult } from '../types';
import { formatINR } from './formatters';

/**
 * Bhaav-Taav (Bargaining) engine:
 * 1. Customer offers a price.
 * 2. Accept if near the listed price (within 8%).
 * 3. Counter-offer if above or equal to the seller's minimum price (minBhaavPrice).
 * 4. Otherwise decline.
 */
export function evaluateBhaavOffer(
  product: Product,
  offeredPrice: number,
  language: 'en' | 'hi' = 'en'
): BhaavOfferResult {
  const currentPrice = product.price;
  const minPrice = product.minBhaavPrice;

  // Invalid offer (0 or higher than current price)
  if (offeredPrice >= currentPrice) {
    return {
      status: 'accepted',
      offerPrice: currentPrice,
      message: language === 'hi'
        ? `बधाई हो! आपकी पेशकश ${formatINR(offeredPrice)} स्वीकार कर ली गई है।`
        : `Offer accepted! You can proceed at ${formatINR(offeredPrice)}.`,
      messageHi: `बधाई हो! आपकी पेशकश ${formatINR(offeredPrice)} स्वीकार कर ली गई है।`,
      discountSaved: 0
    };
  }

  if (offeredPrice <= 0) {
    return {
      status: 'declined',
      offerPrice: offeredPrice,
      message: language === 'hi' ? 'कृपया एक मान्य राशि दर्ज करें।' : 'Please enter a valid offer amount.',
      messageHi: 'कृपया एक मान्य राशि दर्ज करें।',
      discountSaved: 0
    };
  }

  // 1. Check if offer is near listed price (within 8% discount)
  const percentBelow = ((currentPrice - offeredPrice) / currentPrice) * 100;
  if (percentBelow <= 8 && offeredPrice >= minPrice) {
    const savings = currentPrice - offeredPrice;
    return {
      status: 'accepted',
      offerPrice: offeredPrice,
      message: language === 'hi'
        ? `सौदा पक्का! विक्रेता ने आपकी ₹${offeredPrice} की बोली स्वीकार कर ली है। आपने ${formatINR(savings)} बचाए!`
        : `Deal sealed! Seller approved your offer of ${formatINR(offeredPrice)}. You saved ${formatINR(savings)}!`,
      messageHi: `सौदा पक्का! विक्रेता ने आपकी ₹${offeredPrice} की बोली स्वीकार कर ली है। आपने ${formatINR(savings)} बचाए!`,
      discountSaved: savings
    };
  }

  // 2. Check if offer is above or equal to seller's minimum acceptable price
  if (offeredPrice >= minPrice) {
    // Generate a smart counter-offer: halfway between the customer's offer and the listed price,
    // rounded to nearest 10 or 50.
    let counter = Math.round((offeredPrice + currentPrice) / 2 / 10) * 10;
    if (counter <= offeredPrice) {
      counter = Math.min(currentPrice, offeredPrice + 50);
    }
    const savings = currentPrice - counter;

    return {
      status: 'counter_offered',
      offerPrice: offeredPrice,
      counterPrice: counter,
      message: language === 'hi'
        ? `विक्रेता की ओर से जवाबी पेशकश: हम ${formatINR(offeredPrice)} में नहीं दे सकते, लेकिन आपके लिए अंतिम मूल्य ${formatINR(counter)} है। क्या आपको यह स्वीकार है?`
        : `Seller counter-offer: We cannot do ${formatINR(offeredPrice)}, but we can let it go for ${formatINR(counter)}! Do you accept?`,
      messageHi: `विक्रेता की ओर से जवाबी पेशकश: हम ${formatINR(offeredPrice)} में नहीं दे सकते, लेकिन आपके लिए अंतिम मूल्य ${formatINR(counter)} है। क्या आपको यह स्वीकार है?`,
      discountSaved: savings
    };
  }

  // 3. Otherwise decline (below seller's minimum)
  return {
    status: 'declined',
    offerPrice: offeredPrice,
    message: language === 'hi'
      ? `माफ कीजिए, यह पेशकश विक्रेता के न्यूनतम सुरक्षित मूल्य से बहुत कम है। कृपया थोड़ी बेहतर बोली लगाएं।`
      : `Offer declined. This is below the seller's minimum reserve price. Please make a closer offer.`,
    messageHi: `माफ कीजिए, यह पेशकश विक्रेता के न्यूनतम सुरक्षित मूल्य से बहुत कम है। कृपया थोड़ी बेहतर बोली लगाएं।`,
    discountSaved: 0
  };
}
