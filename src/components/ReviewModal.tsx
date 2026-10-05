import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Star, CheckCircle, Sparkles } from 'lucide-react';

export const ReviewModal: React.FC = () => {
  const { reviewModalProduct, setReviewModalProduct, addReview } = useStore();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [author, setAuthor] = useState('');
  const [email, setEmail] = useState('');
  const [recommended, setRecommended] = useState(true);
  const [verifiedBuyer, setVerifiedBuyer] = useState(true);

  if (!reviewModalProduct) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !comment.trim() || !author.trim()) return;

    addReview({
      productId: reviewModalProduct.id,
      author: author.trim(),
      email: email.trim(),
      rating,
      title: title.trim(),
      comment: comment.trim(),
      verifiedBuyer,
      recommended
    });

    setReviewModalProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden border border-stone-200 p-6 sm:p-8">
        <button
          onClick={() => setReviewModalProduct(null)}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-900 rounded-full"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="text-[11px] uppercase tracking-widest font-semibold text-amber-800">
            Customer Feedback
          </span>
          <h3 className="text-xl font-serif text-stone-900 font-normal">
            Review {reviewModalProduct.name}
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            Share your experience with fit, materials, tactile feel, and daily wear.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Rating Stars */}
          <div>
            <label className="block font-medium text-stone-700 mb-1.5">Overall Rating</label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map(star => {
                const isFilled = (hoverRating !== null ? hoverRating : rating) >= star;
                return (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1 text-stone-300 hover:scale-110 transition-transform focus:outline-none"
                    aria-label={`${star} stars`}
                  >
                    <Star
                      className={`w-6 h-6 ${
                        isFilled ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                      }`}
                    />
                  </button>
                );
              })}
              <span className="ml-2 font-medium text-stone-700">
                {rating === 5 ? '5 Stars - Exceptional' : `${rating} Stars`}
              </span>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block font-medium text-stone-700 mb-1">Headline / Summary</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Masterful finish, exquisite weight"
              className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-900"
            />
          </div>

          {/* Comment */}
          <div>
            <label className="block font-medium text-stone-700 mb-1">Written Review</label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Describe craftsmanship, leather patina, hardware comfort, or daily styling..."
              className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-900 resize-none"
            />
          </div>

          {/* Author Name and Email */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-stone-700 mb-1">Your Name or Alias</label>
              <input
                type="text"
                required
                value={author}
                onChange={e => setAuthor(e.target.value)}
                placeholder="e.g. Eleanor W."
                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>
            <div>
              <label className="block font-medium text-stone-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="e.g. eleanor@example.com"
                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>
          </div>

          {/* Recommendation & Verified checkbox */}
          <div className="pt-2 border-t border-stone-100 flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer select-none text-stone-700">
              <input
                type="checkbox"
                checked={recommended}
                onChange={e => setRecommended(e.target.checked)}
                className="rounded text-stone-900 focus:ring-stone-900 accent-stone-900"
              />
              <span>I recommend this piece to discerning buyers</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none text-stone-700">
              <input
                type="checkbox"
                checked={verifiedBuyer}
                onChange={e => setVerifiedBuyer(e.target.checked)}
                className="rounded text-stone-900 focus:ring-stone-900 accent-stone-900"
              />
              <span>Mark as Verified Purchase</span>
            </label>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setReviewModalProduct(null)}
              className="px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-50 rounded-md font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-stone-900 text-white hover:bg-stone-800 rounded-md font-medium transition-colors"
            >
              Publish Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
