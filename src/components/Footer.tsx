import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Shield, Sparkles, Box, Mail, Check } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveView, setSelectedCategory, showToast } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
    showToast('Subscribed to Atelier Gazette private previews', 'success');
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800 text-xs mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <h2 className="text-2xl font-serif tracking-wider font-semibold text-white">
              AURA ATELIER
            </h2>
            <p className="text-stone-400 leading-relaxed font-light text-xs">
              Makers of artisanal timepieces, Tuscan full-grain leather goods, Japanese titanium eyewear, and heirloom accessories.
            </p>
            <div className="text-[11px] text-stone-500 space-y-1">
              <p>Ateliers: Florence · Geneva · Sabae</p>
              <p>Corporate Office: Park Avenue, New York</p>
            </div>
          </div>

          {/* Catalog Col */}
          <div className="space-y-3">
            <h3 className="font-semibold text-stone-100 uppercase tracking-widest text-[11px]">
              The Collection
            </h3>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('watches');
                    setActiveView('catalog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Horology & Chronographs
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('leather');
                    setActiveView('catalog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Tuscan Leather Bags & Wallets
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('jewelry');
                    setActiveView('catalog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Fine Vermeil Jewelry & Rings
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('eyewear');
                    setActiveView('catalog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Japanese Beta-Titanium Eyewear
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('scarves');
                    setActiveView('catalog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Como Silk Twill Scarves
                </button>
              </li>
            </ul>
          </div>

          {/* Client Experience */}
          <div className="space-y-3">
            <h3 className="font-semibold text-stone-100 uppercase tracking-widest text-[11px]">
              Services & Portals
            </h3>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button
                  onClick={() => {
                    setActiveView('wishlist');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Client Wishlist
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('orders');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Order Status & Tracking
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('inventory');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>Admin Inventory Manager</span>
                </button>
              </li>
              <li>
                <span className="text-stone-500">256-Bit SSL Encrypted Checkout</span>
              </li>
              <li>
                <span className="text-stone-500">Complimentary Global Repairs</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / Gazette */}
          <div className="space-y-3">
            <h3 className="font-semibold text-stone-100 uppercase tracking-widest text-[11px]">
              Atelier Gazette
            </h3>
            <p className="text-stone-400 text-xs">
              Receive confidential private previews of limited edition drops and archive restorations.
            </p>
            {subscribed ? (
              <div className="p-3 bg-stone-900 border border-stone-800 rounded text-emerald-400 flex items-center gap-2 text-xs">
                <Check className="w-4 h-4" />
                <span>You are registered for private previews.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={e => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-3 py-2 bg-stone-900 border border-stone-800 text-white rounded text-xs focus:outline-none focus:border-stone-600"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-white text-stone-950 font-medium rounded hover:bg-stone-200 transition-colors"
                  >
                    Join
                  </button>
                </div>
                <span className="text-[10px] text-stone-500 block">We honor client confidentiality. Never shared.</span>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <p>© {new Date().getFullYear()} AURA ATELIER Fine Accessories Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Terms of Provenance</span>
            <span>Insured Courier Policy</span>
            <span>Privacy Standard</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
