import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag, Check, Truck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartTax,
    cartTotal,
    formatPrice,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    setIsCheckoutOpen,
    setActiveView
  } = useStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    if (!res.success) {
      setPromoError(res.message);
    } else {
      setPromoError('');
      setPromoInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const freeShippingThreshold = 200;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-stone-200 animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-stone-900" />
            <h2 className="text-lg font-serif font-medium text-stone-900">Shopping Bag</h2>
            <span className="text-xs text-stone-500 tabular-nums">({cart.length} items)</span>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-stone-400 hover:text-stone-800 rounded-full"
            aria-label="Close bag"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Bar */}
        <div className="bg-stone-50 px-5 py-3 border-b border-stone-200/80 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-stone-700">
              <Truck className="w-3.5 h-3.5 text-amber-800" />
              <span>
                {remainingForFreeShipping === 0
                  ? 'Unlocked complimentary insured delivery!'
                  : `Add ${formatPrice(remainingForFreeShipping)} more for complimentary shipping`}
              </span>
            </div>
            <span className="text-[11px] font-semibold text-stone-500 tabular-nums">
              {Math.round(freeShippingProgress)}%
            </span>
          </div>
          <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-stone-900 h-full transition-all duration-300 rounded-full"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length > 0 ? (
            cart.map(item => (
              <div
                key={item.product.id}
                className="flex items-start gap-4 pb-4 border-b border-stone-100"
              >
                <div className="w-18 h-18 rounded bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                  <img
                    src={item.product.images[0] || '/src/assets/images/hero_accessories_atelier_1791181418156.jpg'}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xs font-semibold text-stone-900 truncate">
                      {item.product.name}
                    </h3>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-stone-400 hover:text-stone-700 p-0.5"
                      title="Remove item"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-[10px] text-stone-400 uppercase tracking-widest block mb-2">
                    {item.product.category} · SKU: {item.product.sku}
                  </span>

                  <div className="flex items-center justify-between">
                    {/* Stepper */}
                    <div className="flex items-center border border-stone-300 rounded text-xs bg-stone-50">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="px-2 py-1 text-stone-600 hover:text-stone-900"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="px-2.5 py-1 font-semibold text-stone-900 tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="px-2 py-1 text-stone-600 hover:text-stone-900 disabled:opacity-30"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-xs font-semibold text-stone-900 tabular-nums">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 text-stone-400">
              <ShoppingBag className="w-12 h-12 stroke-1 mx-auto mb-3 text-stone-300" />
              <p className="text-sm font-medium text-stone-700 mb-1">Your bag is empty</p>
              <p className="text-xs text-stone-400 mb-4">Discover our limited fine goods.</p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setActiveView('catalog');
                }}
                className="px-4 py-2 bg-stone-900 text-white text-xs font-medium rounded hover:bg-stone-800 transition-colors"
              >
                Shop Accessories
              </button>
            </div>
          )}
        </div>

        {/* Drawer Footer & Checkout Action */}
        {cart.length > 0 && (
          <div className="p-5 bg-stone-50 border-t border-stone-200 space-y-4">
            {/* Promo Code Form */}
            <div>
              {appliedPromo ? (
                <div className="flex items-center justify-between bg-amber-50 border border-amber-200 px-3 py-1.5 rounded text-xs text-amber-900">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    <span>
                      Code <strong>{appliedPromo.code}</strong> applied ({appliedPromo.type === 'percent' ? `${appliedPromo.value}% off` : `$${appliedPromo.value} off`})
                    </span>
                  </div>
                  <button
                    onClick={removePromoCode}
                    className="text-stone-500 hover:text-stone-900 text-[11px] underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={e => setPromoInput(e.target.value)}
                    placeholder="Promo code (e.g. AURA10)"
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-stone-900 uppercase"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-xs font-medium bg-stone-900 text-white rounded hover:bg-stone-800 transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
              {promoError && (
                <p className="text-[11px] text-red-600 mt-1">{promoError}</p>
              )}
            </div>

            {/* Price Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-stone-600 border-t border-stone-200/80 pt-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-stone-900 tabular-nums">{formatPrice(cartSubtotal)}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Promotion Discount</span>
                  <span className="font-medium tabular-nums">-{formatPrice(cartDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Insured Shipping</span>
                <span className="font-medium text-stone-900 tabular-nums">
                  {cartShipping === 0 ? 'Complimentary' : formatPrice(cartShipping)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Sales Tax (8.25%)</span>
                <span className="font-medium text-stone-900 tabular-nums">{formatPrice(cartTax)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-stone-900 pt-2 border-t border-stone-200">
                <span>Total</span>
                <span className="tabular-nums font-serif text-base">{formatPrice(cartTotal)}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 px-4 bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm rounded-md transition-colors flex items-center justify-center gap-2 shadow-xs active:scale-98"
            >
              <span>Proceed to Secure Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Trust Signifiers */}
            <div className="flex items-center justify-center gap-4 text-[10px] text-stone-400 uppercase tracking-wider">
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>256-Bit SSL Encrypted</span>
              </div>
              <span>·</span>
              <span>PCI-DSS Level 1</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
