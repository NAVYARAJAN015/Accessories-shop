import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Heart, Eye, ShoppingBag, Star, AlertTriangle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setQuickViewProduct
  } = useStore();

  const [imageError, setImageError] = useState(false);
  const isWishlisted = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOutOfStock) {
      addToCart(product, 1);
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={() => setQuickViewProduct(product)}
      className="group cursor-pointer flex flex-col h-full bg-white border border-stone-200/80 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md hover:border-stone-300"
    >
      {/* Media Container */}
      <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
        {!imageError && product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-stone-200 text-stone-500 p-4 text-center">
            <ShoppingBag className="w-8 h-8 stroke-1 text-stone-400 mb-2" />
            <span className="text-xs font-serif italic text-stone-600">Aura Atelier Studio</span>
            <span className="text-[11px] text-stone-400">{product.name}</span>
          </div>
        )}

        {/* Top Badges / Indicators (Single unboxed text tag) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none">
          {isOutOfStock ? (
            <span className="text-[11px] font-medium tracking-wider uppercase text-stone-600 bg-white/95 px-2 py-0.5 rounded shadow-xs">
              Sold Out
            </span>
          ) : isLowStock ? (
            <span className="text-[11px] font-medium tracking-wider uppercase text-amber-800 bg-amber-50/95 border border-amber-200 px-2 py-0.5 rounded shadow-xs">
              Only {product.stock} left
            </span>
          ) : product.isNew ? (
            <span className="text-[11px] font-medium tracking-wider uppercase text-stone-900 bg-white/95 px-2 py-0.5 rounded shadow-xs">
              New Arrival
            </span>
          ) : null}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-xs transition-colors shadow-xs ${
            isWishlisted
              ? 'bg-white text-rose-600 hover:bg-stone-50'
              : 'bg-white/80 text-stone-700 hover:text-stone-900 hover:bg-white'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          title={isWishlisted ? 'Saved to wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`w-4 h-4 transition-transform active:scale-125 ${
              isWishlisted ? 'fill-current text-rose-600' : ''
            }`}
          />
        </button>

        {/* Quick View Hover Bar */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-stone-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={e => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 hover:bg-white text-stone-900 text-xs font-medium rounded shadow-xs transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between bg-white">
        <div>
          {/* Metadata line without pills */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
            <span className="uppercase tracking-widest text-[10px] font-medium text-stone-500">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-stone-600">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-medium tabular-nums">{product.rating.toFixed(1)}</span>
              <span className="text-stone-400">({product.reviewCount})</span>
            </div>
          </div>

          <h3 className="text-base font-medium text-stone-900 group-hover:text-stone-700 transition-colors line-clamp-1 mb-1">
            {product.name}
          </h3>

          <p className="text-xs text-stone-500 line-clamp-1 mb-3">
            {product.tagline}
          </p>
        </div>

        <div className="pt-3 border-t border-stone-100 flex items-center justify-between mt-auto">
          <div>
            <span className="text-xs text-stone-400 block">Price</span>
            <span className="text-base font-semibold text-stone-900 tabular-nums">
              {formatPrice(product.price)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded transition-all ${
              isOutOfStock
                ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                : 'bg-stone-900 text-white hover:bg-stone-800 active:scale-95'
            }`}
            aria-label={isOutOfStock ? 'Sold out' : `Add ${product.name} to bag`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isOutOfStock ? 'Sold Out' : 'Add to Bag'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
