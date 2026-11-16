export interface PincodeInfo {
  pincode: string;
  city: string;
  state: string;
  isEligibleForLocal: boolean;
}

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry'
];

/**
 * Validates 6-digit Indian Postal PIN code
 * First digit must be 1 to 9 (not 0)
 */
export function isValidPincode(pincode: string): boolean {
  return /^[1-9][0-9]{5}$/.test(pincode.trim());
}

/**
 * Validates 10-digit Indian mobile number
 * Must start with 6, 7, 8, or 9
 */
export function isValidIndianMobile(phone: string): boolean {
  const cleaned = phone.replace(/[^0-9]/g, '');
  return /^[6-9]\d{9}$/.test(cleaned);
}

/**
 * Looks up city/state based on Indian PIN prefix
 */
export function lookupPincode(pincode: string): PincodeInfo | null {
  if (!isValidPincode(pincode)) {
    return null;
  }

  const prefix = pincode.substring(0, 2);
  const fullPin = pincode.trim();

  // Common Indian Metro & Tier-1/2 PIN ranges
  if (fullPin.startsWith('110')) {
    return { pincode: fullPin, city: 'New Delhi', state: 'Delhi', isEligibleForLocal: true };
  }
  if (fullPin.startsWith('400')) {
    return { pincode: fullPin, city: 'Mumbai', state: 'Maharashtra', isEligibleForLocal: true };
  }
  if (fullPin.startsWith('411')) {
    return { pincode: fullPin, city: 'Pune', state: 'Maharashtra', isEligibleForLocal: true };
  }
  if (fullPin.startsWith('560')) {
    return { pincode: fullPin, city: 'Bengaluru', state: 'Karnataka', isEligibleForLocal: true };
  }
  if (fullPin.startsWith('500')) {
    return { pincode: fullPin, city: 'Hyderabad', state: 'Telangana', isEligibleForLocal: true };
  }
  if (fullPin.startsWith('600')) {
    return { pincode: fullPin, city: 'Chennai', state: 'Tamil Nadu', isEligibleForLocal: true };
  }
  if (fullPin.startsWith('700')) {
    return { pincode: fullPin, city: 'Kolkata', state: 'West Bengal', isEligibleForLocal: true };
  }
  if (fullPin.startsWith('380')) {
    return { pincode: fullPin, city: 'Ahmedabad', state: 'Gujarat', isEligibleForLocal: true };
  }
  if (fullPin.startsWith('302')) {
    return { pincode: fullPin, city: 'Jaipur', state: 'Rajasthan', isEligibleForLocal: true };
  }
  if (fullPin.startsWith('226')) {
    return { pincode: fullPin, city: 'Lucknow', state: 'Uttar Pradesh', isEligibleForLocal: true };
  }
  if (fullPin.startsWith('800')) {
    return { pincode: fullPin, city: 'Patna', state: 'Bihar', isEligibleForLocal: true };
  }
  if (fullPin.startsWith('452')) {
    return { pincode: fullPin, city: 'Indore', state: 'Madhya Pradesh', isEligibleForLocal: true };
  }

  // Zone by first 2 digits
  const numPrefix = parseInt(prefix, 10);
  let state = 'India';
  let city = 'Your City';

  if (numPrefix >= 11 && numPrefix <= 11) { state = 'Delhi'; city = 'Delhi'; }
  else if (numPrefix >= 12 && numPrefix <= 13) { state = 'Haryana'; city = 'Gurugram / Faridabad'; }
  else if (numPrefix >= 14 && numPrefix <= 16) { state = 'Punjab'; city = 'Amritsar / Ludhiana'; }
  else if (numPrefix >= 17 && numPrefix <= 17) { state = 'Himachal Pradesh'; city = 'Shimla'; }
  else if (numPrefix >= 18 && numPrefix <= 19) { state = 'Jammu and Kashmir'; city = 'Srinagar / Jammu'; }
  else if (numPrefix >= 20 && numPrefix <= 28) { state = 'Uttar Pradesh'; city = 'Noida / Lucknow'; }
  else if (numPrefix >= 30 && numPrefix <= 34) { state = 'Rajasthan'; city = 'Jaipur / Jodhpur'; }
  else if (numPrefix >= 36 && numPrefix <= 39) { state = 'Gujarat'; city = 'Surat / Vadodara'; }
  else if (numPrefix >= 40 && numPrefix <= 44) { state = 'Maharashtra'; city = 'Mumbai / Nagpur'; }
  else if (numPrefix >= 45 && numPrefix <= 49) { state = 'Madhya Pradesh'; city = 'Bhopal / Indore'; }
  else if (numPrefix >= 50 && numPrefix <= 53) { state = 'Andhra Pradesh'; city = 'Visakhapatnam'; }
  else if (numPrefix >= 56 && numPrefix <= 59) { state = 'Karnataka'; city = 'Bengaluru / Mysuru'; }
  else if (numPrefix >= 60 && numPrefix <= 64) { state = 'Tamil Nadu'; city = 'Chennai / Coimbatore'; }
  else if (numPrefix >= 67 && numPrefix <= 69) { state = 'Kerala'; city = 'Kochi / Thiruvananthapuram'; }
  else if (numPrefix >= 70 && numPrefix <= 74) { state = 'West Bengal'; city = 'Kolkata / Siliguri'; }
  else if (numPrefix >= 75 && numPrefix <= 77) { state = 'Odisha'; city = 'Bhubaneswar'; }
  else if (numPrefix >= 78 && numPrefix <= 79) { state = 'Assam'; city = 'Guwahati'; }
  else if (numPrefix >= 80 && numPrefix <= 85) { state = 'Bihar'; city = 'Patna / Gaya'; }

  return {
    pincode: fullPin,
    city,
    state,
    isEligibleForLocal: true
  };
}
