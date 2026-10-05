import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, Heart, ShieldCheck, Box, Package } from 'lucide-react';
import { CurrencyCode } from '../types';

export const Header: React.FC = () => {
  const {
    activeView,
    setActiveView,
    selectedCategory,
    setSelectedCategory,
    cartItemCount,
    setIsCartOpen,
    wishlist,
    currency,
    setCurrency,
    orders
  } = useStore();

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    setActiveView('catalog');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-stone-200/80 transition-colors">
      {/* Top micro announcement bar */}
      <div className="bg-stone-900 text-stone-300 text-xs py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-3">
        <span>Complimentary insured shipping on all orders over $200</span>
        <span className="text-stone-500">·</span>
        <span className="text-amber-300/90 font-medium">Use code AURA10 for 10% off</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Zone 1: Single element brand wordmark */}
          <button
            onClick={() => {
              setActiveView('catalog');
              setSelectedCategory('all');
            }}
            className="text-2xl sm:text-3xl font-serif tracking-wider font-semibold text-stone-900 hover:text-stone-700 transition-colors shrink-0 text-left focus:outline-none"
          >
            AURA ATELIER
          </button>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
            <button
              onClick={() => handleCategoryClick('all')}
              className={`hover:text-stone-900 transition-colors py-1 relative ${
                activeView === 'catalog' && selectedCategory === 'all'
                  ? 'text-stone-900 font-semibold'
                  : ''
              }`}
            >
              All Pieces
              {activeView === 'catalog' && selectedCategory === 'all' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 rounded-full" />
              )}
            </button>
            <button
              onClick={() => handleCategoryClick('watches')}
              className={`hover:text-stone-900 transition-colors py-1 relative ${
                activeView === 'catalog' && selectedCategory === 'watches'
                  ? 'text-stone-900 font-semibold'
                  : ''
              }`}
            >
              Horology
              {activeView === 'catalog' && selectedCategory === 'watches' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 rounded-full" />
              )}
            </button>
            <button
              onClick={() => handleCategoryClick('leather')}
              className={`hover:text-stone-900 transition-colors py-1 relative ${
                activeView === 'catalog' && selectedCategory === 'leather'
                  ? 'text-stone-900 font-semibold'
                  : ''
              }`}
            >
              Leather Goods
              {activeView === 'catalog' && selectedCategory === 'leather' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 rounded-full" />
              )}
            </button>
            <button
              onClick={() => handleCategoryClick('jewelry')}
              className={`hover:text-stone-900 transition-colors py-1 relative ${
                activeView === 'catalog' && selectedCategory === 'jewelry'
                  ? 'text-stone-900 font-semibold'
                  : ''
              }`}
            >
              Fine Jewelry
              {activeView === 'catalog' && selectedCategory === 'jewelry' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 rounded-full" />
              )}
            </button>
            <button
              onClick={() => handleCategoryClick('eyewear')}
              className={`hover:text-stone-900 transition-colors py-1 relative ${
                activeView === 'catalog' && selectedCategory === 'eyewear'
                  ? 'text-stone-900 font-semibold'
                  : ''
              }`}
            >
              Eyewear
              {activeView === 'catalog' && selectedCategory === 'eyewear' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 rounded-full" />
              )}
            </button>

            {/* Inventory Admin Link */}
            <button
              onClick={() => setActiveView('inventory')}
              className={`hover:text-stone-900 transition-colors py-1 flex items-center gap-1.5 relative ${
                activeView === 'inventory' ? 'text-amber-800 font-semibold' : 'text-stone-500'
              }`}
              title="Admin Inventory Management"
            >
              <Box className="w-3.5 h-3.5" />
              <span>Inventory</span>
              {activeView === 'inventory' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-800 rounded-full" />
              )}
            </button>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Currency selector */}
            <select
              value={currency}
              onChange={e => setCurrency(e.target.value as CurrencyCode)}
              className="text-xs bg-transparent border border-stone-300 rounded px-2 py-1.5 text-stone-700 hover:border-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400 transition-colors cursor-pointer"
              aria-label="Select currency"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
            </select>

            {/* Orders view button */}
            <button
              onClick={() => setActiveView('orders')}
              className={`p-2 text-stone-600 hover:text-stone-900 rounded-md transition-colors relative ${
                activeView === 'orders' ? 'text-stone-900 bg-stone-100' : ''
              }`}
              title="View Order History"
              aria-label="Order History"
            >
              <Package className="w-5 h-5" />
              {orders.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-amber-600 rounded-full" />
              )}
            </button>

            {/* Wishlist toggle */}
            <button
              onClick={() => setActiveView('wishlist')}
              className={`p-2 text-stone-600 hover:text-stone-900 rounded-md transition-colors relative ${
                activeView === 'wishlist' ? 'text-stone-900 bg-stone-100' : ''
              }`}
              title="View Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-stone-900 text-stone-100 text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center tabular-nums">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Bag Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-md transition-colors whitespace-nowrap shadow-xs"
              aria-label={`Shopping bag with ${cartItemCount} items`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Bag</span>
              <span className="bg-stone-700 px-1.5 py-0.2 rounded text-xs tabular-nums">
                {cartItemCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-between overflow-x-auto py-2.5 border-t border-stone-200/60 text-xs font-medium text-stone-600 gap-4 no-scrollbar">
          <button
            onClick={() => handleCategoryClick('all')}
            className={`whitespace-nowrap ${
              activeView === 'catalog' && selectedCategory === 'all' ? 'text-stone-900 font-semibold' : ''
            }`}
          >
            All Pieces
          </button>
          <button
            onClick={() => handleCategoryClick('watches')}
            className={`whitespace-nowrap ${
              activeView === 'catalog' && selectedCategory === 'watches' ? 'text-stone-900 font-semibold' : ''
            }`}
          >
            Horology
          </button>
          <button
            onClick={() => handleCategoryClick('leather')}
            className={`whitespace-nowrap ${
              activeView === 'catalog' && selectedCategory === 'leather' ? 'text-stone-900 font-semibold' : ''
            }`}
          >
            Leather
          </button>
          <button
            onClick={() => handleCategoryClick('jewelry')}
            className={`whitespace-nowrap ${
              activeView === 'catalog' && selectedCategory === 'jewelry' ? 'text-stone-900 font-semibold' : ''
            }`}
          >
            Jewelry
          </button>
          <button
            onClick={() => handleCategoryClick('eyewear')}
            className={`whitespace-nowrap ${
              activeView === 'catalog' && selectedCategory === 'eyewear' ? 'text-stone-900 font-semibold' : ''
            }`}
          >
            Eyewear
          </button>
          <button
            onClick={() => setActiveView('inventory')}
            className={`whitespace-nowrap flex items-center gap-1 ${
              activeView === 'inventory' ? 'text-amber-800 font-semibold' : ''
            }`}
          >
            <Box className="w-3 h-3" />
            Inventory
          </button>
        </div>
      </div>
    </header>
  );
};
