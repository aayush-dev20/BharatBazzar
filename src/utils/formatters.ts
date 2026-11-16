/**
 * Formats a number according to the Indian numbering system:
 * e.g., 149999 -> ₹1,49,999
 */
export function formatINR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₹0';
  }
  
  const rounded = Math.round(amount);
  const isNegative = rounded < 0;
  const absVal = Math.abs(rounded).toString();
  
  if (absVal.length <= 3) {
    return `${isNegative ? '-' : ''}₹${absVal}`;
  }
  
  // Last 3 digits
  const last3 = absVal.slice(-3);
  const remaining = absVal.slice(0, -3);
  
  // Groups of 2 digits
  const formattedRemaining = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  
  return `${isNegative ? '-' : ''}₹${formattedRemaining},${last3}`;
}

/**
 * Calculates monthly EMI for a given principal, duration in months, and annual interest rate
 */
export function calculateEMI(principal: number, months: number = 6, annualRatePercent: number = 14): number {
  if (principal <= 0 || months <= 0) return 0;
  const monthlyRate = annualRatePercent / (12 * 100);
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  return Math.round(emi);
}

/**
 * Calculates percentage discount
 */
export function calculateDiscount(price: number, mrp: number): number {
  if (!mrp || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

/**
 * Generates delivery estimate string based on whether it is a local store and PIN
 */
export function getDeliveryEstimate(isLocalStore: boolean, hasValidPincode: boolean, language: 'en' | 'hi' = 'en'): {
  isSameDay: boolean;
  text: string;
} {
  if (isLocalStore && hasValidPincode) {
    return {
      isSameDay: true,
      text: language === 'hi' 
        ? '⚡ आज ही डिलीवरी (शाम 8 बजे तक)' 
        : '⚡ Same-Day Delivery by 8:00 PM'
    };
  }

  // Standard delivery: 2-3 days out
  const today = new Date();
  const deliveryDate = new Date(today);
  deliveryDate.setDate(today.getDate() + 3);

  const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
  const dateStr = deliveryDate.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', options);

  return {
    isSameDay: false,
    text: language === 'hi'
      ? `डिलीवरी: ${dateStr} तक (2-3 दिन)`
      : `Delivery by ${dateStr} (2-3 business days)`
  };
}

/**
 * Formats date for orders
 */
export function formatDate(isoString: string, language: 'en' | 'hi' = 'en'): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return isoString;
  }
}
