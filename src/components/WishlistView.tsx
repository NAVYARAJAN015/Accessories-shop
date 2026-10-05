import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Heart, Trash2, ShoppingBag, ArrowRight, Share2, Check } from 'lucide-react';

export const WishlistView: React.FC = () => {
  const {
    wishlist,
    products,
    toggleWishlist,
    clearWishlist,
    addToCart,
    moveAllWishlistToCart,
    formatPrice,
    setActiveView,
    setQuickViewProduct,
    showToast
  } = useStore();

  const [copied, setCopied] = useState(false);

  const wishlistProducts = wishlist
    .map(id => products.find(p => p.id === id))
    .filter((p): p is typeof products[0] => Boolean(p));

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    showToast('Wishlist link copied to clipboard', 'info');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-stone-200 mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-800 font-medium mb-1">
            <span>Personal Curation</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{wishlistProducts.length} Saved Items</span>
          </div>
          <h1 className="text-3xl font-serif text-stone-900 font-normal">
            Your Atelier Wishlist
          </h1>
        </div>

        {wishlistProducts.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-stone-700 bg-white border border-stone-300 rounded-md hover:bg-stone-50 transition-colors shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied' : 'Share Wishlist'}</span>
            </button>

            <button
              onClick={moveAllWishlistToCart}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-stone-900 rounded-md hover:bg-stone-800 transition-colors shadow-xs"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Move All In-Stock to Bag</span>
            </button>
          </div>
        )}
      </div>

      {wishlistProducts.length > 0 ? (
        <div className="space-y-4">
          <div className="divide-y divide-stone-200 bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
            {wishlistProducts.map(product => {
              const isOutOfStock = product.stock <= 0;
              const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;

              return (
                <div
                  key={product.id}
                  className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50/60 transition-colors"
                >
                  <div
                    onClick={() => setQuickViewProduct(product)}
                    className="flex items-center gap-4 cursor-pointer flex-1"
                  >
                    <div className="w-20 h-20 rounded-md bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                      <img
                        src={product.images[0] || '/src/assets/images/hero_accessories_atelier_1791181418156.jpg'}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-stone-400 block mb-0.5">
                        {product.category} · {product.sku}
                      </span>
                      <h3 className="text-base font-medium text-stone-900 hover:text-stone-700">
                        {product.name}
                      </h3>
                      <p className="text-xs text-stone-500 line-clamp-1">{product.tagline}</p>
                      <div className="mt-1 flex items-center gap-2 text-xs">
                        <span className="font-semibold text-stone-900 tabular-nums">
                          {formatPrice(product.price)}
                        </span>
                        <span className="text-stone-300">·</span>
                        {isOutOfStock ? (
                          <span className="text-red-700 font-medium">Currently Out of Stock</span>
                        ) : isLowStock ? (
                          <span className="text-amber-800 font-medium">Only {product.stock} units left</span>
                        ) : (
                          <span className="text-emerald-700">In Stock ({product.stock})</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                    <button
                      onClick={() => addToCart(product, 1)}
                      disabled={isOutOfStock}
                      className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-md transition-colors shadow-2xs ${
                        isOutOfStock
                          ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                          : 'bg-stone-900 text-white hover:bg-stone-800'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{isOutOfStock ? 'Sold Out' : 'Add to Bag'}</span>
                    </button>

                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-md transition-colors"
                      title="Remove from Wishlist"
                      aria-label="Remove item from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={clearWishlist}
              className="text-xs text-stone-500 hover:text-stone-800 underline underline-offset-4"
            >
              Clear entire wishlist
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-stone-200 rounded-xl p-8 max-w-md mx-auto shadow-xs">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-6 h-6 stroke-1" />
          </div>
          <h2 className="text-xl font-serif text-stone-900 mb-2">Your wishlist is empty</h2>
          <p className="text-xs text-stone-500 mb-6 leading-relaxed">
            Save timepieces, fine jewelry, and leather accessories as you browse to compare materials or purchase later.
          </p>
          <button
            onClick={() => setActiveView('catalog')}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-md transition-colors"
          >
            <span>Explore The Collection</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </section>
  );
};
