import React, { useState, useEffect } from 'react';
import { UserRole, Language, UserSession } from '../types';
import { translations } from '../data/translations';
import { isValidIndianMobile } from '../utils/pincodes';
import { X, Smartphone, CheckCircle2, ShieldCheck, ArrowRight, UserCheck, Lock } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserSession;
  language: Language;
  onLoginSuccess: (user: UserSession) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  language,
  onLoginSuccess
}) => {
  const t = translations[language];

  const [mobileNumber, setMobileNumber] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidIndianMobile(mobileNumber)) {
      setErrorMsg(language === 'hi'
        ? 'कृपया 6, 7, 8 या 9 से शुरू होने वाला 10-अंकीय वैध भारतीय मोबाइल नंबर दर्ज करें।'
        : 'Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.');
      return;
    }

    // Generate simulated 6-digit OTP
    const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(mockOtp);
    setErrorMsg('');
    setStep('otp');
    setTimer(30);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== generatedOtp && otpCode !== '123456') {
      setErrorMsg(language === 'hi' ? 'अमान्य ओटीपी कोड। कृपया पुनः प्रयास करें।' : 'Invalid OTP. Please enter the 6-digit code shown or 123456.');
      return;
    }

    // Success: Update or create user session
    const updatedUser: UserSession = {
      ...currentUser,
      phone: mobileNumber,
      name: name.trim() || (selectedRole === 'seller' ? 'Shree Kirana Partner' : selectedRole === 'admin' ? 'Haat Administrator' : 'Aarav Sharma'),
      role: selectedRole
    };

    onLoginSuccess(updatedUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-surface dark:bg-charcoal-800 border border-subtle rounded p-6 shadow-none">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-ink-muted hover:text-ink dark:text-zinc-400"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded bg-slate-deep text-brass flex items-center justify-center">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-heading font-semibold text-ink dark:text-zinc-100">
              {language === 'hi' ? 'मोबाइल ओटीपी लॉगिन / साइन अप' : 'Mobile OTP Login & Signup'}
            </h2>
            <p className="text-[11px] text-ink-muted dark:text-zinc-400">
              {language === 'hi' ? 'पासवर्ड की आवश्यकता नहीं • सुरक्षित 6-अंकीय ओटीपी' : 'Passwordless authentication • Fast Indian mobile OTP'}
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mt-3 p-2.5 bg-brick-light dark:bg-brick/20 border border-brick/40 rounded text-xs text-brick dark:text-brick-light">
            {errorMsg}
          </div>
        )}

        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="mt-4 space-y-3.5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink dark:text-zinc-300 mb-1">
                {language === 'hi' ? 'आपका नाम (वैकल्पिक)' : 'Your Full Name'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aarav Sharma"
                className="w-full px-3 py-2 bg-concrete/60 dark:bg-charcoal-700 border border-subtle rounded text-xs text-ink dark:text-zinc-100 focus:outline-none focus:border-brass"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink dark:text-zinc-300 mb-1">
                {language === 'hi' ? '10-अंकीय भारतीय मोबाइल नंबर' : '10-Digit Mobile Number *'}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-ink-muted">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="9820123456"
                  className="w-full pl-11 pr-3 py-2 bg-concrete/60 dark:bg-charcoal-700 border border-subtle rounded text-xs text-ink dark:text-zinc-100 focus:outline-none focus:border-brass font-mono font-medium"
                  required
                  autoFocus
                />
              </div>
              <span className="text-[10px] text-ink-muted dark:text-zinc-400 mt-1 block">
                {language === 'hi' ? '6, 7, 8 या 9 से शुरू होना चाहिए' : 'Must start with 6, 7, 8, or 9'}
              </span>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink dark:text-zinc-300 mb-1">
                {language === 'hi' ? 'भूमिका चुनें' : 'Select Account Role'}
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['customer', 'seller', 'sponsor', 'admin'] as UserRole[]).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={`py-1.5 px-1 text-[11px] font-semibold uppercase rounded border transition text-center ${
                      selectedRole === role
                        ? 'bg-slate-deep text-white border-slate-deep dark:bg-brass dark:text-slate-deep'
                        : 'bg-concrete/40 dark:bg-charcoal-700 text-ink-muted border-subtle hover:text-ink'
                    }`}
                  >
                    {role === 'customer' ? 'Buyer' : role === 'seller' ? 'Seller' : role === 'sponsor' ? 'Sponsor' : 'Admin'}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Demo Credentials */}
            <div className="pt-2 border-t border-subtle">
              <span className="text-[10px] uppercase font-semibold text-ink-muted dark:text-zinc-400 block mb-1.5">
                {language === 'hi' ? 'टेस्ट खाते (एक-क्लिक लॉगिन)' : 'Test Accounts (One-Click Fill)'}
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setName('Aarav Sharma');
                    setMobileNumber('9876543210');
                    setSelectedRole('customer');
                  }}
                  className="px-2 py-1 text-[11px] text-left border border-subtle rounded bg-concrete/40 dark:bg-charcoal-700 hover:border-brass text-ink dark:text-zinc-200"
                >
                  <span className="font-semibold block">Customer</span>
                  <span className="text-[10px] text-ink-muted">9876543210</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setName('Ramprasad Sharma (Moradabad)');
                    setMobileNumber('9812345678');
                    setSelectedRole('seller');
                  }}
                  className="px-2 py-1 text-[11px] text-left border border-subtle rounded bg-concrete/40 dark:bg-charcoal-700 hover:border-brass text-ink dark:text-zinc-200"
                >
                  <span className="font-semibold block">Seller (Verified)</span>
                  <span className="text-[10px] text-ink-muted">9812345678</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setName('Vikram Tata (Sponsor)');
                    setMobileNumber('9834567890');
                    setSelectedRole('sponsor');
                  }}
                  className="px-2 py-1 text-[11px] text-left border border-subtle rounded bg-concrete/40 dark:bg-charcoal-700 hover:border-brass text-ink dark:text-zinc-200"
                >
                  <span className="font-semibold block">Sponsor</span>
                  <span className="text-[10px] text-ink-muted">9834567890</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setName('Haat Platform Officer');
                    setMobileNumber('9899999999');
                    setSelectedRole('admin');
                  }}
                  className="px-2 py-1 text-[11px] text-left border border-subtle rounded bg-concrete/40 dark:bg-charcoal-700 hover:border-brass text-ink dark:text-zinc-200"
                >
                  <span className="font-semibold block">Marketplace Admin</span>
                  <span className="text-[10px] text-ink-muted">9899999999</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-slate-deep hover:bg-slate-hover text-white text-xs font-semibold tracking-wider uppercase rounded flex items-center justify-center gap-1.5 transition mt-2"
            >
              <span>{language === 'hi' ? 'ओटीपी प्राप्त करें' : 'Get Mobile OTP'}</span>
              <ArrowRight className="w-4 h-4 text-brass" />
            </button>
          </form>
        ) : (
          /* Step: Enter OTP */
          <form onSubmit={handleVerifyOtp} className="mt-4 space-y-4">
            <div className="p-3 bg-brass-light/40 dark:bg-brass/10 border border-brass/30 rounded text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-deep dark:text-brass">
                  {language === 'hi' ? 'एसएमएस भेजा गया' : 'SMS Sent via MSG91 simulator'}
                </span>
                <span className="text-[10px] text-ink-muted">To +91 {mobileNumber}</span>
              </div>
              <p className="text-[11px] text-ink-muted dark:text-zinc-300">
                Your OTP code is: <strong className="font-mono text-sm text-slate-deep dark:text-brass">{generatedOtp}</strong>
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink dark:text-zinc-300 mb-1">
                {language === 'hi' ? '6-अंकीय ओटीपी दर्ज करें' : 'Enter 6-Digit OTP *'}
              </label>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="123456"
                className="w-full px-3 py-2 text-center text-lg tracking-widest font-mono font-bold bg-concrete/60 dark:bg-charcoal-700 border border-subtle rounded text-ink dark:text-zinc-100 focus:outline-none focus:border-brass"
                required
                autoFocus
              />
            </div>

            <div className="flex items-center justify-between text-xs text-ink-muted dark:text-zinc-400">
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="underline hover:text-ink dark:hover:text-zinc-200"
              >
                {language === 'hi' ? 'नंबर बदलें' : 'Change Number'}
              </button>

              <span>
                {timer > 0 ? (
                  <span>Resend in {timer}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
                      setGeneratedOtp(newOtp);
                      setTimer(30);
                    }}
                    className="text-brass hover:underline font-semibold"
                  >
                    Resend OTP
                  </button>
                )}
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-slate-deep hover:bg-slate-hover text-white text-xs font-semibold tracking-wider uppercase rounded flex items-center justify-center gap-1.5 transition"
            >
              <CheckCircle2 className="w-4 h-4 text-brass" />
              <span>{language === 'hi' ? 'सत्यापित करें और आगे बढ़ें' : 'Verify OTP & Log In'}</span>
            </button>
          </form>
        )}

        <div className="mt-4 pt-3 border-t border-subtle flex items-center justify-center gap-1.5 text-[10px] text-ink-muted dark:text-zinc-500">
          <ShieldCheck className="w-3.5 h-3.5 text-brass" />
          <span>DPDP Act 2023 compliant. No spam or unsolicited marketing calls.</span>
        </div>
      </div>
    </div>
  );
};
