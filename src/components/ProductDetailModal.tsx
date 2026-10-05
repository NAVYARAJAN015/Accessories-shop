import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import {
  X,
  Star,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle,
  ThumbsUp,
  MessageSquarePlus,
  Package
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const {
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    getProductReviews,
    voteReviewHelpful,
    setReviewModalProduct
  } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'care' | 'reviews'>('details');

  if (!product) return null;

  const isWishlisted = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;
  const reviews = getProductReviews(product.id);

  // Calculate rating breakdown
  const ratingDistribution = [5, 4, 3, 2, 1].map(stars => {
    const count = reviews.filter(r => r.rating === stars).length;
    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { stars, count, percentage };
  });

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      addToCart(product, quantity);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden border border-stone-200 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-white text-stone-600 hover:text-stone-900 shadow-sm transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Product Media Gallery */}
          <div className="bg-stone-100 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-stone-200">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-white shadow-xs">
              <img
                src={product.images[0] || '/src/assets/images/hero_accessories_atelier_1791181418156.jpg'}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              {isOutOfStock && (
                <div className="absolute inset-0 bg-stone-900/40 flex items-center justify-center">
                  <span className="bg-white text-stone-900 text-xs uppercase tracking-widest font-semibold px-3 py-1 rounded">
                    Currently Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Quick Guarantees Under Image */}
            <div className="mt-6 pt-6 border-t border-stone-200/80 grid grid-cols-2 gap-4 text-xs text-stone-600">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-800 block">Authenticity Guaranteed</span>
                  <span className="text-[11px] text-stone-500">Serialized provenance certificate</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Truck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-800 block">Insured Courier</span>
                  <span className="text-[11px] text-stone-500">Signature required upon arrival</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contiguous Purchase Module */}
          <div className="p-6 sm:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div>
              {/* Category & SKU line */}
              <div className="flex items-center justify-between text-xs text-stone-400 uppercase tracking-widest mb-1.5">
                <span>{product.category}</span>
                <span className="font-mono text-stone-400">SKU: {product.sku}</span>
              </div>

              {/* Title & Tagline */}
              <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 font-normal mb-1.5">
                {product.name}
              </h2>
              <p className="text-sm text-stone-500 mb-4">{product.tagline}</p>

              {/* Price & Rating Bar */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-200">
                <div className="text-2xl font-serif font-semibold text-stone-900 tabular-nums">
                  {formatPrice(product.price)}
                </div>

                <button
                  onClick={() => setActiveTab('reviews')}
                  className="flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900"
                >
                  <div className="flex items-center text-amber-500">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= Math.round(product.rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-stone-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-stone-800 tabular-nums">
                    {product.rating.toFixed(1)}
                  </span>
                  <span className="text-stone-400">({reviews.length} reviews)</span>
                </button>
              </div>

              {/* Stock Status Indicator */}
              <div className="mb-6 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isOutOfStock
                        ? 'bg-red-500'
                        : isLowStock
                        ? 'bg-amber-500 animate-pulse'
                        : 'bg-emerald-500'
                    }`}
                  />
                  <span className="font-medium text-stone-700">
                    {isOutOfStock
                      ? 'Out of Stock'
                      : isLowStock
                      ? `Only ${product.stock} units remaining in inventory`
                      : `In Stock (${product.stock} units available)`}
                  </span>
                </div>
                <span className="text-stone-400">Ships within 24 hours</span>
              </div>

              {/* Purchase Actions (Quantity + Add to Bag + Wishlist) */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-stone-300 rounded-md bg-stone-50">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={isOutOfStock || quantity <= 1}
                      className="px-3 py-2 text-stone-600 hover:text-stone-900 disabled:opacity-40"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-3 py-2 text-xs font-semibold text-stone-900 tabular-nums min-w-[2rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={isOutOfStock || quantity >= product.stock}
                      className="px-3 py-2 text-stone-600 hover:text-stone-900 disabled:opacity-40"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Bag Button */}
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-md font-medium text-sm transition-colors shadow-xs ${
                      isOutOfStock
                        ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                        : 'bg-stone-900 text-white hover:bg-stone-800 active:scale-98'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{isOutOfStock ? 'Sold Out' : `Add to Bag · ${formatPrice(product.price * quantity)}`}</span>
                  </button>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`p-3 rounded-md border transition-colors ${
                      isWishlisted
                        ? 'border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100'
                        : 'border-stone-300 text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                    }`}
                    aria-label="Wishlist toggle"
                    title={isWishlisted ? 'Saved in wishlist' : 'Save to wishlist'}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current text-rose-600' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Tabs: Specifications & Description / Care / Reviews */}
              <div className="border-t border-stone-200 pt-4">
                <div className="flex items-center gap-4 text-xs border-b border-stone-200 pb-2 mb-4">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`font-medium transition-colors ${
                      activeTab === 'details' ? 'text-stone-900 font-semibold border-b-2 border-stone-900 pb-2 -mb-2.5' : 'text-stone-500 hover:text-stone-900'
                    }`}
                  >
                    Details & Origin
                  </button>
                  <button
                    onClick={() => setActiveTab('care')}
                    className={`font-medium transition-colors ${
                      activeTab === 'care' ? 'text-stone-900 font-semibold border-b-2 border-stone-900 pb-2 -mb-2.5' : 'text-stone-500 hover:text-stone-900'
                    }`}
                  >
                    Care & Warranty
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`font-medium transition-colors flex items-center gap-1 ${
                      activeTab === 'reviews' ? 'text-stone-900 font-semibold border-b-2 border-stone-900 pb-2 -mb-2.5' : 'text-stone-500 hover:text-stone-900'
                    }`}
                  >
                    Reviews ({reviews.length})
                  </button>
                </div>

                {/* Tab 1: Details */}
                {activeTab === 'details' && (
                  <div className="text-xs text-stone-600 space-y-3 leading-relaxed">
                    <p>{product.description}</p>
                    <dl className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-[11px]">
                      <div>
                        <dt className="text-stone-400">Materials</dt>
                        <dd className="font-medium text-stone-800">{product.details.materials}</dd>
                      </div>
                      <div>
                        <dt className="text-stone-400">Origin</dt>
                        <dd className="font-medium text-stone-800">{product.details.origin}</dd>
                      </div>
                      {product.details.dimensions && (
                        <div>
                          <dt className="text-stone-400">Dimensions</dt>
                          <dd className="font-medium text-stone-800">{product.details.dimensions}</dd>
                        </div>
                      )}
                      {product.details.weight && (
                        <div>
                          <dt className="text-stone-400">Weight</dt>
                          <dd className="font-medium text-stone-800">{product.details.weight}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                )}

                {/* Tab 2: Care & Warranty */}
                {activeTab === 'care' && (
                  <div className="text-xs text-stone-600 space-y-3 leading-relaxed">
                    <div>
                      <h4 className="font-semibold text-stone-800 mb-1">Atelier Warranty</h4>
                      <p className="text-stone-500">{product.details.warranty || 'Comprehensive guarantee covering structural and material integrity.'}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-stone-800 mb-1">Care Guidelines</h4>
                      <p className="text-stone-500">{product.details.careGuide || 'Wipe with soft lint-free cloth. Store in bespoke dust cover when not in use.'}</p>
                    </div>
                  </div>
                )}

                {/* Tab 3: Reviews */}
                {activeTab === 'reviews' && (
                  <div className="space-y-4">
                    {/* Review Summary Breakdown */}
                    <div className="flex items-center justify-between bg-stone-50 p-3 rounded-lg border border-stone-200/60">
                      <div>
                        <div className="text-2xl font-serif font-bold text-stone-900 tabular-nums">
                          {product.rating.toFixed(1)}
                        </div>
                        <div className="flex items-center text-amber-500 my-0.5">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star
                              key={s}
                              className={`w-3 h-3 ${
                                s <= Math.round(product.rating)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-stone-300'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-[11px] text-stone-500">Based on {reviews.length} reviews</div>
                      </div>

                      <button
                        onClick={() => setReviewModalProduct(product)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-900 bg-white hover:bg-stone-100 border border-stone-300 rounded shadow-2xs transition-colors"
                      >
                        <MessageSquarePlus className="w-3.5 h-3.5" />
                        <span>Write a Review</span>
                      </button>
                    </div>

                    {/* Review List */}
                    <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                      {reviews.length > 0 ? (
                        reviews.map(rev => (
                          <div key={rev.id} className="p-3 bg-white border border-stone-100 rounded-md">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-semibold text-stone-900">{rev.author}</span>
                                {rev.verifiedBuyer && (
                                  <span className="flex items-center gap-0.5 text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-medium">
                                    <CheckCircle className="w-3 h-3" />
                                    Verified Buyer
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-stone-400">{rev.date}</span>
                            </div>

                            <div className="flex items-center text-amber-500 mb-1">
                              {[1, 2, 3, 4, 5].map(s => (
                                <Star
                                  key={s}
                                  className={`w-3 h-3 ${
                                    s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-200'
                                  }`}
                                />
                              ))}
                            </div>

                            <h5 className="text-xs font-medium text-stone-900 mb-0.5">{rev.title}</h5>
                            <p className="text-xs text-stone-600 leading-normal mb-2">{rev.comment}</p>

                            <button
                              onClick={() => voteReviewHelpful(rev.id)}
                              className={`flex items-center gap-1 text-[11px] transition-colors ${
                                rev.userVotedHelpful
                                  ? 'text-amber-800 font-semibold'
                                  : 'text-stone-400 hover:text-stone-700'
                              }`}
                            >
                              <ThumbsUp className="w-3 h-3" />
                              <span>Helpful ({rev.helpfulCount})</span>
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6 text-xs text-stone-400">
                          No reviews yet for this piece. Be the first verified customer to review!
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
