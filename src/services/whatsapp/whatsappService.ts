/**
 * HAAT WHATSAPP INTEGRATION SERVICE
 *
 * Implements WhatsApp order connection (Phase A click-to-chat):
 * - Fallback to WHATSAPP_NUMBER (919234725874)
 * - Per-seller number routing
 * - Multi-seller order splitting & individual messages
 * - Proper URL encoding for Hindi, ₹, &, #, and line breaks
 * - Max ~1500 characters constraint enforcement with smart truncation
 * - Order status templates for sellers to message customers
 */

// Default marketplace WhatsApp fallback
export const DEFAULT_MARKETPLACE_WHATSAPP =
  (typeof process !== 'undefined' && process.env?.WHATSAPP_NUMBER) || '919234725874';

export const APP_BASE_URL =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_APP_URL) || 'http://localhost:3000';

/**
 * Normalises an Indian mobile number to 91XXXXXXXXXX
 * Handles formats: +919876543210, 09876543210, 9876543210, 91 98765-43210
 */
export function normalizeWhatsAppNumber(rawNumber: string | undefined | null): string {
  if (!rawNumber) return DEFAULT_MARKETPLACE_WHATSAPP;
  // Strip all non-digit characters
  const clean = rawNumber.replace(/\D/g, '');

  if (clean.length === 10) {
    return `91${clean}`;
  }
  if (clean.length === 11 && clean.startsWith('0')) {
    return `91${clean.substring(1)}`;
  }
  if (clean.length === 12 && clean.startsWith('91')) {
    return clean;
  }
  return clean || DEFAULT_MARKETPLACE_WHATSAPP;
}

export interface OrderItemSummary {
  title: string;
  variantTitle?: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderMessagePayload {
  orderNumber: string;
  sellerWhatsApp?: string;
  customerName: string;
  customerPhone: string;
  streetAddress: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  deliverySlot: string;
  deliveryCharge: number;
  discount: number;
  totalAmount: number;
  items: OrderItemSummary[];
  language?: string;
  trackingUrl?: string;
}

/**
 * Builds the WhatsApp order summary message for customer to send to seller
 */
export function buildOrderWhatsAppText(data: OrderMessagePayload): string {
  const isHindi = data.language === 'hi';
  const siteUrl = data.trackingUrl || `${APP_BASE_URL}/orders/${data.orderNumber}`;

  let header = '';
  if (isHindi) {
    header = `हाट ऑर्डर ${data.orderNumber}\n`;
  } else {
    header = `Haat order ${data.orderNumber}\n`;
  }

  // Build items block with length management
  let itemsText = '';
  const itemLines: string[] = [];

  data.items.forEach((item, idx) => {
    const itemTotal = item.unitPrice * item.quantity;
    const vStr = item.variantTitle ? ` (${item.variantTitle})` : '';
    itemLines.push(`${idx + 1}. ${item.title}${vStr} x${item.quantity} = ₹${itemTotal.toLocaleString('en-IN')}`);
  });

  // Calculate length budget for items (~800 chars)
  let truncatedCount = 0;
  const maxItemBudget = 800;
  let currentBudget = 0;
  const includedLines: string[] = [];

  for (const line of itemLines) {
    if (currentBudget + line.length < maxItemBudget) {
      includedLines.push(line);
      currentBudget += line.length;
    } else {
      truncatedCount++;
    }
  }

  itemsText = includedLines.join('\n');
  if (truncatedCount > 0) {
    itemsText += `\n(+ ${truncatedCount} ${isHindi ? 'अन्य सामान' : 'more items'})`;
  }

  let financials = '';
  if (isHindi) {
    financials = `डिलीवरी: ₹${data.deliveryCharge} | छूट: ₹${data.discount} | कुल योग: ₹${data.totalAmount.toLocaleString('en-IN')}\nभुगतान: कैश ऑन डिलीवरी (COD)`;
  } else {
    financials = `Delivery: ₹${data.deliveryCharge} | Discount: ₹${data.discount} | Total: ₹${data.totalAmount.toLocaleString('en-IN')}\nPayment: Cash on delivery`;
  }

  const addressLine = `${data.customerName}, ${data.customerPhone}, ${data.streetAddress}${data.landmark ? `, ${data.landmark}` : ''}, ${data.city}, ${data.pincode}, ${data.state}`;

  let footer = '';
  if (isHindi) {
    footer = `स्लॉट: ${data.deliverySlot}\nट्रैक करें: ${siteUrl}`;
  } else {
    footer = `Slot: ${data.deliverySlot}\nTrack: ${siteUrl}`;
  }

  const fullMessage = `${header}${itemsText}\n${financials}\n${addressLine}\n${footer}`;

  // Strict constraint: keep message under 1500 characters
  if (fullMessage.length > 1500) {
    return fullMessage.substring(0, 1450) + `...\nTrack: ${siteUrl}`;
  }

  return fullMessage;
}

/**
 * Generates the clickable wa.me URL with strict character encoding
 * for Hindi characters, ₹, &, #, and line breaks.
 */
export function buildOrderWhatsAppUrl(data: OrderMessagePayload): {
  url: string;
  targetNumber: string;
  messageText: string;
} {
  const targetNumber = normalizeWhatsAppNumber(data.sellerWhatsApp);
  const messageText = buildOrderWhatsAppText(data);
  // encodeURIComponent strictly encodes ₹, &, #, newlines and unicode characters
  const encodedText = encodeURIComponent(messageText);
  const url = `https://wa.me/${targetNumber}?text=${encodedText}`;

  return {
    url,
    targetNumber,
    messageText,
  };
}

/**
 * Product page "Ask on WhatsApp" prefilled link generator
 */
export function buildProductInquiryWhatsAppUrl(params: {
  sellerWhatsApp?: string;
  productTitle: string;
  productPrice: number;
  productId: string;
  isBhaavTaav?: boolean;
  offeredPrice?: number;
}): string {
  const targetNumber = normalizeWhatsAppNumber(params.sellerWhatsApp);
  let text = '';

  if (params.isBhaavTaav && params.offeredPrice) {
    text = `नमस्ते! मैं हाट पर "${params.productTitle}" (लिस्टेड: ₹${params.productPrice.toLocaleString('en-IN')}) के लिए ₹${params.offeredPrice.toLocaleString('en-IN')} का भाव-ताव ऑफर देना चाहता हूँ। क्या आप यह स्वीकार करेंगे?\nलिंक: ${APP_BASE_URL}/products/${params.productId}`;
  } else {
    text = `नमस्ते! मैं हाat पर इस उत्पाद के बारे में पूछना चाहता हूँ: "${params.productTitle}" (₹${params.productPrice.toLocaleString('en-IN')}).\nलिंक: ${APP_BASE_URL}/products/${params.productId}`;
  }

  return `https://wa.me/${targetNumber}?text=${encodeURIComponent(text)}`;
}

/**
 * Seller dashboard "Message customer" template builder
 */
export type OrderNotificationStatus =
  | 'confirmed'
  | 'packed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'ready_for_pickup';

export function buildSellerCustomerWhatsAppUrl(params: {
  customerPhone: string;
  customerName: string;
  orderNumber: string;
  status: OrderNotificationStatus;
  deliveryOtp?: string;
  shopName: string;
  pickupAddress?: string;
}): string {
  const targetNumber = normalizeWhatsAppNumber(params.customerPhone);
  const { customerName, orderNumber, status, deliveryOtp, shopName } = params;
  let text = '';

  switch (status) {
    case 'confirmed':
      text = `नमस्ते ${customerName}! आपका हाट ऑर्डर #${orderNumber} (${shopName} से) कन्फर्म हो गया है और तैयारी में है। धन्यवाद!`;
      break;

    case 'packed':
      text = `नमस्ते ${customerName}! आपका ऑर्डर #${orderNumber} पैक कर दिया गया है और जल्द ही डिस्पैच किया जाएगा।`;
      break;

    case 'shipped':
      text = `नमस्ते ${customerName}! आपका ऑर्डर #${orderNumber} कूरियर/डिलीवरी पार्टनर को सौंप दिया गया है। ट्रैक करें: ${APP_BASE_URL}/orders/${orderNumber}`;
      break;

    case 'out_for_delivery':
      text = `नमस्ते ${customerName}! आपका ऑर्डर #${orderNumber} आज डिलीवर होने वाला है।\nडिलीवरी सत्यापन OTP: ${deliveryOtp || '123456'}\nकृपया पार्सल प्राप्त करने के बाद ही डिलीवरी पार्टनर के साथ OTP साझा करें।`;
      break;

    case 'delivered':
      text = `नमस्ते ${customerName}! आपका ऑर्डर #${orderNumber} सफलतापूर्वक डिलीवर हो गया है। हाट पर खरीदारी के लिए आपका धन्यवाद! यदि कोई समस्या हो तो आप 7 दिनों के भीतर रिटर्न दर्ज कर सकते हैं।`;
      break;

    case 'ready_for_pickup':
      text = `नमस्ते ${customerName}! आपका क्लिक & कलेक्ट ऑर्डर #${orderNumber} दुकान पर तैयार है।\nपता: ${params.pickupAddress || 'हमारा स्टोर'}\nकृपया स्टोर खुलने के समय में पिकअप करें।`;
      break;
  }

  return `https://wa.me/${targetNumber}?text=${encodeURIComponent(text)}`;
}
