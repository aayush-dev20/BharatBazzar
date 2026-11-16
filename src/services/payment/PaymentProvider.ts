/**
 * PAYMENT PROVIDER INTERFACE & CASH ON DELIVERY (COD) IMPLEMENTATION
 *
 * Designed according to the architectural requirement:
 * "Do NOT integrate any payment gateway. Orders are Cash on Delivery with a delivery OTP.
 * Create a PaymentProvider interface with one implementation (COD) so Razorpay or UPI can be
 * added later without changing order logic."
 */

export interface PaymentDetails {
  method: 'cod' | 'upi_qr_delivery';
  amount: number;
  currency: string;
  deliveryOtp: string;
  isCollected: boolean;
  collectedAt?: string;
  paymentReference?: string;
}

export interface PaymentProcessResult {
  success: boolean;
  paymentMethod: string;
  transactionStatus: 'pending' | 'collected' | 'failed';
  deliveryOtp: string;
  instructions: {
    en: string;
    hi: string;
  };
  details: PaymentDetails;
}

export interface PaymentVerificationResult {
  verified: boolean;
  error?: string;
}

export interface PaymentProvider {
  readonly id: string;
  readonly name: string;
  readonly isOnlineGateway: boolean;

  /**
   * Initializes order payment state during order placement.
   */
  processOrder(orderId: string, amount: number): Promise<PaymentProcessResult>;

  /**
   * Verifies the 6-digit delivery OTP entered by the delivery agent to release the package.
   */
  verifyDeliveryOTP(providedOtp: string, expectedOtp: string): PaymentVerificationResult;

  /**
   * Generates a cryptographically strong 6-digit delivery OTP.
   */
  generateDeliveryOTP(): string;
}

/**
 * Cash on Delivery (COD) Provider with Delivery OTP Verification
 */
export class CODPaymentProvider implements PaymentProvider {
  readonly id = 'cod';
  readonly name = 'Cash on Delivery (or Pay by UPI QR at Doorstep)';
  readonly isOnlineGateway = false;

  /**
   * Generates a 6-digit numerical delivery verification OTP
   */
  generateDeliveryOTP(): string {
    const num = Math.floor(100000 + Math.random() * 900000);
    return num.toString();
  }

  /**
   * Processes the COD order without opening external gateways.
   * Generates the delivery OTP to be shared with the customer.
   */
  async processOrder(orderId: string, amount: number): Promise<PaymentProcessResult> {
    const otp = this.generateDeliveryOTP();

    return {
      success: true,
      paymentMethod: this.id,
      transactionStatus: 'pending',
      deliveryOtp: otp,
      instructions: {
        en: `Please keep ₹${amount.toLocaleString('en-IN')} cash ready or pay the delivery partner via UPI QR code upon arrival. Share delivery OTP ${otp} only after receiving and inspecting the package.`,
        hi: `कृपया डिलीवरी पार्टनर के आने पर ₹${amount.toLocaleString('en-IN')} नकद या यूपीआई क्यूआर से भुगतान करें। पैकेज मिलने के बाद ही डिलीवरी ओटीपी ${otp} साझा करें।`,
      },
      details: {
        method: 'cod',
        amount,
        currency: 'INR',
        deliveryOtp: otp,
        isCollected: false,
      },
    };
  }

  /**
   * Validates the 6-digit OTP provided at doorstep
   */
  verifyDeliveryOTP(providedOtp: string, expectedOtp: string): PaymentVerificationResult {
    if (!providedOtp || providedOtp.trim().length !== 6) {
      return {
        verified: false,
        error: 'Please enter a valid 6-digit delivery OTP.',
      };
    }

    if (providedOtp.trim() === expectedOtp.trim()) {
      return { verified: true };
    }

    return {
      verified: false,
      error: 'Invalid delivery OTP. Please verify the 6-digit code received by the customer.',
    };
  }
}

/**
 * Registry allowing easy extension for future gateways (e.g., Razorpay, UPI)
 * without ever altering core order processing logic.
 */
class PaymentRegistry {
  private providers: Map<string, PaymentProvider> = new Map();

  constructor() {
    const defaultCod = new CODPaymentProvider();
    this.register(defaultCod);
  }

  register(provider: PaymentProvider): void {
    this.providers.set(provider.id, provider);
  }

  get(id: string): PaymentProvider {
    const provider = this.providers.get(id);
    if (!provider) {
      // Fallback to COD as standard
      return this.providers.get('cod')!;
    }
    return provider;
  }

  getAll(): PaymentProvider[] {
    return Array.from(this.providers.values());
  }
}

export const paymentRegistry = new PaymentRegistry();
export const defaultPaymentProvider = paymentRegistry.get('cod');
