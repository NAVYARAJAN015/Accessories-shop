import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Lock,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  Truck,
  ArrowRight,
  ArrowLeft,
  Printer,
  Smartphone,
  AlertCircle,
  Eye,
  KeyRound
} from 'lucide-react';
import { PaymentMethodType, ShippingAddress, Order } from '../types';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartTax,
    cartTotal,
    formatPrice,
    currency,
    createOrder,
    lastCompletedOrder,
    setLastCompletedOrder,
    setActiveView
  } = useStore();

  const [step, setStep] = useState<'shipping' | 'payment' | 'authenticating' | 'confirmation'>('shipping');

  // Customer & Shipping Form
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: 'Lady Eleanor Vance',
    email: 'eleanor.vance@atelier-archive.com',
    phone: '+1 (555) 234-8901',
    address: '450 Park Avenue, Penthouse 12B',
    city: 'New York',
    state: 'NY',
    postalCode: '10022',
    country: 'United States'
  });

  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express' | 'overnight'>('standard');

  // Payment Form
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('card');
  const [cardholderName, setCardholderName] = useState('ELEANOR VANCE');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8892');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('842');
  const [cardBrand, setCardBrand] = useState<'visa' | 'mastercard' | 'amex'>('visa');
  const [savePaymentDetails, setSavePaymentDetails] = useState(true);

  // 3D Secure / Authentication simulation state
  const [authProgressMessage, setAuthProgressMessage] = useState('Initializing 256-bit TLS handshake...');
  const [otpCode, setOtpCode] = useState('482910');
  const [showOtpPrompt, setShowOtpPrompt] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (!isCheckoutOpen) return null;

  // Handle card number formatting and brand recognition
  const handleCardNumberChange = (raw: string) => {
    const cleaned = raw.replace(/\D/g, '').slice(0, 16);
    // Format with spaces
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);

    if (cleaned.startsWith('4')) {
      setCardBrand('visa');
    } else if (cleaned.startsWith('5') || cleaned.startsWith('2')) {
      setCardBrand('mastercard');
    } else if (cleaned.startsWith('3')) {
      setCardBrand('amex');
    }
  };

  const handleExpiryChange = (raw: string) => {
    const cleaned = raw.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 3) {
      setCardExpiry(`${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`);
    } else {
      setCardExpiry(cleaned);
    }
  };

  // Submit shipping
  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  // Authorize Payment
  const handlePaymentAuthorize = () => {
    setStep('authenticating');
    setAuthProgressMessage('Encrypting payment token via AES-GCM-256...');

    setTimeout(() => {
      setAuthProgressMessage('Simulating 3D Secure 2.0 Challenge with Card Issuer...');
      setShowOtpPrompt(true);
    }, 900);
  };

  const handleConfirmOtp = () => {
    setShowOtpPrompt(false);
    setAuthProgressMessage('Payment authorized! Deducting inventory and generating receipt...');

    setTimeout(() => {
      // Execute order creation (which also deducts real inventory stock in StoreContext)
      const order = createOrder({
        items: [...cart],
        subtotal: cartSubtotal,
        discount: cartDiscount,
        shipping: shippingMethod === 'overnight' ? 35 : shippingMethod === 'express' ? 20 : cartShipping,
        tax: cartTax,
        total: cartTotal + (shippingMethod === 'overnight' ? 35 : shippingMethod === 'express' ? 20 : 0),
        currency,
        shippingAddress,
        shippingMethod,
        paymentDetails: {
          method: paymentMethod,
          cardholderName,
          cardNumberMasked: paymentMethod === 'card' ? `•••• •••• •••• ${cardNumber.replace(/\s/g, '').slice(-4) || '8892'}` : undefined,
          cardBrand: paymentMethod === 'card' ? cardBrand : undefined,
          transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          authCode: `AUTH-${Math.floor(100000 + Math.random() * 900000)}`,
          tokenSimulated: `tok_sec_${Math.random().toString(36).substr(2, 12)}`
        }
      });

      setConfirmedOrder(order);
      setStep('confirmation');
    }, 1200);
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setStep('shipping');
    setShowOtpPrompt(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden border border-stone-200 my-6">
        {/* Top Header */}
        <div className="bg-stone-900 text-stone-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span className="font-serif tracking-wider text-base font-medium">AURA ATELIER</span>
            <span className="text-stone-500 text-xs">|</span>
            <span className="text-xs text-stone-300 font-light flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Secure Payment Gateway (PCI-DSS)
            </span>
          </div>

          {step !== 'authenticating' && (
            <button
              onClick={handleClose}
              className="text-stone-400 hover:text-white p-1 rounded-md"
              aria-label="Close checkout"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Multi-step Breadcrumb */}
        {step !== 'confirmation' && step !== 'authenticating' && (
          <div className="px-6 py-3 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-xs text-stone-500">
            <div className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold ${
                step === 'shipping' ? 'bg-stone-900 text-white' : 'bg-emerald-600 text-white'
              }`}>
                {step === 'payment' ? '✓' : '1'}
              </span>
              <span className={step === 'shipping' ? 'font-semibold text-stone-900' : 'text-stone-600'}>
                Shipping & Contact
              </span>
            </div>
            <div className="h-0.5 w-12 bg-stone-200" />
            <div className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold ${
                step === 'payment' ? 'bg-stone-900 text-white' : 'bg-stone-200 text-stone-600'
              }`}>
                2
              </span>
              <span className={step === 'payment' ? 'font-semibold text-stone-900' : 'text-stone-400'}>
                Payment & Tokenization
              </span>
            </div>
          </div>
        )}

        {/* STEP 1: Shipping and Contact */}
        {step === 'shipping' && (
          <form onSubmit={handleShippingSubmit} className="p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-lg font-serif text-stone-900 mb-1">Shipping & Delivery Details</h3>
              <p className="text-xs text-stone-500">
                All accessories are dispatched in tamper-evident sealed packaging with insurance.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.fullName}
                    onChange={e => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={shippingAddress.email}
                    onChange={e => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Phone Number (For Courier)</label>
                  <input
                    type="tel"
                    required
                    value={shippingAddress.phone}
                    onChange={e => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Country</label>
                  <select
                    value={shippingAddress.country}
                    onChange={e => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-stone-900"
                  >
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="France">France</option>
                    <option value="Germany">Germany</option>
                    <option value="Japan">Japan</option>
                    <option value="Italy">Italy</option>
                    <option value="Canada">Canada</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.address}
                  onChange={e => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                  placeholder="Street address or P.O. Box"
                  className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.city}
                    onChange={e => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">State / Province</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.state}
                    onChange={e => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Postal Code</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.postalCode}
                    onChange={e => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>
              </div>

              {/* Delivery Speed Options */}
              <div className="pt-3">
                <label className="block font-medium text-stone-700 mb-2">Select Insured Delivery Service</label>
                <div className="space-y-2">
                  <label className={`flex items-center justify-between p-3 rounded border cursor-pointer transition-colors ${
                    shippingMethod === 'standard' ? 'border-stone-900 bg-stone-50' : 'border-stone-200 hover:bg-stone-50/50'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="shippingMethod"
                        checked={shippingMethod === 'standard'}
                        onChange={() => setShippingMethod('standard')}
                        className="accent-stone-900"
                      />
                      <div>
                        <span className="font-semibold text-stone-900 block">Standard Insured Courier (3-5 Days)</span>
                        <span className="text-stone-500 text-[11px]">Direct signature required upon receipt</span>
                      </div>
                    </div>
                    <span className="font-semibold text-stone-900 tabular-nums">
                      {cartShipping === 0 ? 'Complimentary' : formatPrice(15)}
                    </span>
                  </label>

                  <label className={`flex items-center justify-between p-3 rounded border cursor-pointer transition-colors ${
                    shippingMethod === 'express' ? 'border-stone-900 bg-stone-50' : 'border-stone-200 hover:bg-stone-50/50'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="shippingMethod"
                        checked={shippingMethod === 'express'}
                        onChange={() => setShippingMethod('express')}
                        className="accent-stone-900"
                      />
                      <div>
                        <span className="font-semibold text-stone-900 block">Priority Air Express (2 Business Days)</span>
                        <span className="text-stone-500 text-[11px]">Expedited flight dispatch with GPS tracking</span>
                      </div>
                    </div>
                    <span className="font-semibold text-stone-900 tabular-nums">{formatPrice(20)}</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
              <button
                type="button"
                onClick={handleClose}
                className="text-xs text-stone-500 hover:text-stone-900"
              >
                Return to Bag
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-md text-xs font-medium transition-colors shadow-xs"
              >
                <span>Continue to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Payment Gateway Form */}
        {step === 'payment' && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-serif text-stone-900 mb-1">Encrypted Payment Gateway</h3>
                <p className="text-xs text-stone-500">
                  Select payment instrument. Card credentials are encrypted via browser Web Crypto API.
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-stone-400 block uppercase tracking-wider">Total Due</span>
                <span className="text-lg font-serif font-bold text-stone-900 tabular-nums">
                  {formatPrice(cartTotal + (shippingMethod === 'express' ? 20 : 0))}
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-3 gap-2.5 text-xs">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                  paymentMethod === 'card'
                    ? 'border-stone-900 bg-stone-50 font-semibold text-stone-900 shadow-2xs'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50/50'
                }`}
              >
                <CreditCard className="w-5 h-5 mb-1" />
                <span>Credit / Debit</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('apple_pay')}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                  paymentMethod === 'apple_pay'
                    ? 'border-stone-900 bg-stone-50 font-semibold text-stone-900 shadow-2xs'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50/50'
                }`}
              >
                <Smartphone className="w-5 h-5 mb-1" />
                <span>Apple Pay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('paypal')}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                  paymentMethod === 'paypal'
                    ? 'border-stone-900 bg-stone-50 font-semibold text-stone-900 shadow-2xs'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50/50'
                }`}
              >
                <Lock className="w-5 h-5 mb-1" />
                <span>PayPal Express</span>
              </button>
            </div>

            {/* Credit Card Form */}
            {paymentMethod === 'card' ? (
              <div className="space-y-4 text-xs bg-stone-50/70 p-4 rounded-lg border border-stone-200">
                <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
                  <span>Enter Card Details</span>
                  <div className="flex items-center gap-1.5 font-mono text-[10px]">
                    <span className={`px-1.5 py-0.5 rounded ${cardBrand === 'visa' ? 'bg-blue-900 text-white font-bold' : 'bg-stone-200 text-stone-600'}`}>
                      VISA
                    </span>
                    <span className={`px-1.5 py-0.5 rounded ${cardBrand === 'mastercard' ? 'bg-red-700 text-white font-bold' : 'bg-stone-200 text-stone-600'}`}>
                      MC
                    </span>
                    <span className={`px-1.5 py-0.5 rounded ${cardBrand === 'amex' ? 'bg-cyan-800 text-white font-bold' : 'bg-stone-200 text-stone-600'}`}>
                      AMEX
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    required
                    value={cardholderName}
                    onChange={e => setCardholderName(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded font-mono tracking-wider focus:outline-none focus:ring-1 focus:ring-stone-900 uppercase"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={e => handleCardNumberChange(e.target.value)}
                      placeholder="4000 1234 5678 9010"
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded font-mono tracking-wider focus:outline-none focus:ring-1 focus:ring-stone-900 pr-10"
                    />
                    <CreditCard className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Expiration (MM/YY)</label>
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={e => handleExpiryChange(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded font-mono text-center focus:outline-none focus:ring-1 focus:ring-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Security Code (CVV)</label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        maxLength={4}
                        value={cardCvv}
                        onChange={e => setCardCvv(e.target.value.replace(/\D/g, ''))}
                        placeholder="•••"
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded font-mono text-center focus:outline-none focus:ring-1 focus:ring-stone-900"
                      />
                      <Lock className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                </div>

                <label className="flex items-center gap-2 pt-1 cursor-pointer select-none text-stone-600">
                  <input
                    type="checkbox"
                    checked={savePaymentDetails}
                    onChange={e => setSavePaymentDetails(e.target.checked)}
                    className="accent-stone-900 rounded"
                  />
                  <span>Save encrypted payment profile for expedited future bespoke orders</span>
                </label>
              </div>
            ) : (
              <div className="p-6 bg-stone-50 border border-stone-200 rounded-lg text-center space-y-2 text-xs">
                <Smartphone className="w-8 h-8 text-stone-700 mx-auto mb-2" />
                <p className="font-semibold text-stone-900">
                  {paymentMethod === 'apple_pay' ? 'Apple Pay Express Authorization' : 'PayPal One-Click Gateway'}
                </p>
                <p className="text-stone-500 text-[11px] max-w-sm mx-auto">
                  Biometric authorization will verify your linked account and debit{' '}
                  <strong>{formatPrice(cartTotal + (shippingMethod === 'express' ? 20 : 0))}</strong> securely.
                </p>
              </div>
            )}

            {/* Navigation and Authorize Button */}
            <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep('shipping')}
                className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Shipping</span>
              </button>

              <button
                type="button"
                onClick={handlePaymentAuthorize}
                className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-md text-xs font-semibold tracking-wide transition-colors shadow-sm"
              >
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  Authorize & Pay {formatPrice(cartTotal + (shippingMethod === 'express' ? 20 : 0))}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Authenticating / 3D Secure Verification Simulation */}
        {step === 'authenticating' && (
          <div className="p-8 sm:p-12 text-center space-y-6">
            {!showOtpPrompt ? (
              <div className="space-y-4">
                <div className="w-14 h-14 border-3 border-stone-200 border-t-stone-900 rounded-full animate-spin mx-auto" />
                <h3 className="text-lg font-serif text-stone-900">Processing Secure Authorization</h3>
                <p className="text-xs text-stone-500 font-mono animate-pulse">{authProgressMessage}</p>
              </div>
            ) : (
              <div className="max-w-md mx-auto bg-stone-50 p-6 rounded-xl border border-stone-300 text-left space-y-4 shadow-sm animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span className="font-semibold text-xs text-stone-900">3D Secure 2.0 Verification</span>
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono">Issuer Auth Protocol</span>
                </div>

                <div className="text-xs text-stone-600 space-y-1">
                  <p>
                    A verification code has been simulated for cardholder{' '}
                    <strong>{cardholderName}</strong> for authorization amount{' '}
                    <strong>{formatPrice(cartTotal + (shippingMethod === 'express' ? 20 : 0))}</strong>.
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Enter One-Time Security Passcode (OTP)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={otpCode}
                      onChange={e => setOtpCode(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white border border-stone-300 rounded font-mono text-center tracking-widest text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-stone-900"
                    />
                    <button
                      type="button"
                      onClick={handleConfirmOtp}
                      className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-medium transition-colors"
                    >
                      Authenticate
                    </button>
                  </div>
                </div>

                <p className="text-[10px] text-stone-400">
                  Simulated sandbox verification. Click Authenticate to complete the live transaction.
                </p>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: Order Confirmation & Receipt Screen */}
        {step === 'confirmation' && confirmedOrder && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
                Payment Authorized & Verified
              </span>
              <h3 className="text-2xl font-serif text-stone-900 font-normal">
                Order #{confirmedOrder.orderNumber} Confirmed
              </h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                A confirmation receipt and serialized certificate of craftsmanship have been dispatched to{' '}
                <strong className="text-stone-700">{confirmedOrder.shippingAddress.email}</strong>.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-stone-50 rounded-lg p-5 border border-stone-200 text-xs space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200 text-stone-500">
                <span>Tracking ID: <strong className="text-stone-800 font-mono">{confirmedOrder.trackingNumber}</strong></span>
                <span>Estimated Delivery: <strong className="text-stone-800">{confirmedOrder.estimatedDelivery}</strong></span>
              </div>

              {/* Items List */}
              <div className="space-y-2 pt-1">
                {confirmedOrder.items.map(item => (
                  <div key={item.product.id} className="flex justify-between items-center text-stone-800">
                    <span className="truncate pr-4">
                      {item.product.name} <span className="text-stone-400 font-mono text-[11px]">× {item.quantity}</span>
                    </span>
                    <span className="font-medium tabular-nums">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="pt-3 border-t border-stone-200 space-y-1 text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="tabular-nums">{formatPrice(confirmedOrder.subtotal)}</span>
                </div>
                {confirmedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span>
                    <span className="tabular-nums">-{formatPrice(confirmedOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping ({confirmedOrder.shippingMethod})</span>
                  <span className="tabular-nums">
                    {confirmedOrder.shipping === 0 ? 'Complimentary' : formatPrice(confirmedOrder.shipping)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span className="tabular-nums">{formatPrice(confirmedOrder.tax)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-stone-900 pt-1.5 border-t border-stone-200">
                  <span>Total Authorized</span>
                  <span className="font-serif text-base tabular-nums">{formatPrice(confirmedOrder.total)}</span>
                </div>
              </div>

              {/* Payment Details Metadata */}
              <div className="pt-2 border-t border-stone-200 text-[11px] text-stone-400 flex flex-wrap justify-between">
                <span>Auth: {confirmedOrder.paymentDetails.authCode}</span>
                <span>Txn: {confirmedOrder.paymentDetails.transactionId}</span>
                <span>Token: {confirmedOrder.paymentDetails.tokenSimulated}</span>
              </div>
            </div>

            {/* Post-Checkout Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 bg-white border border-stone-300 rounded transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Receipt</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    setActiveView('orders');
                  }}
                  className="px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-100 border border-stone-300 rounded transition-colors"
                >
                  View in Orders
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    setActiveView('catalog');
                  }}
                  className="px-5 py-2 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
