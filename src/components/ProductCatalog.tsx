import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Search, SlidersHorizontal, RotateCcw, PackageSearch } from 'lucide-react';
import { ProductCategory } from '../types';

export const ProductCatalog: React.FC = () => {
  const { products, selectedCategory, setSelectedCategory, formatPrice } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(1000);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('featured');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  const categories: { label: string; value: string }[] = [
    { label: 'All Accessories', value: 'all' },
    { label: 'Horology', value: 'watches' },
    { label: 'Leather Goods', value: 'leather' },
    { label: 'Fine Jewelry', value: 'jewelry' },
    { label: 'Eyewear', value: 'eyewear' },
    { label: 'Silk Scarves', value: 'scarves' },
    { label: 'Tactile Hardware', value: 'hardware' }
  ];

  // Filtering and sorting
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        // Category filter
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchMaterials = p.details.materials.toLowerCase().includes(q);
          const matchSku = p.sku.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchMaterials && !matchSku) {
            return false;
          }
        }

        // In-stock only
        if (inStockOnly && p.stock <= 0) {
          return false;
        }

        // Price range
        if (p.price > maxPriceFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        // featured: bestsellers first
        if (a.isBestseller && !b.isBestseller) return -1;
        if (!a.isBestseller && b.isBestseller) return 1;
        return 0;
      });
  }, [products, selectedCategory, searchQuery, inStockOnly, maxPriceFilter, sortBy]);

  const hasActiveFilters = selectedCategory !== 'all' || searchQuery !== '' || inStockOnly || maxPriceFilter < 1000 || sortBy !== 'featured';

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setInStockOnly(false);
    setMaxPriceFilter(1000);
    setSortBy('featured');
  };

  return (
    <section id="catalog-section" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Editorial Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-800 font-medium mb-1.5">
            <span>Curated Catalog</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{filteredProducts.length} Pieces Available</span>
          </div>
          <h2 className="text-3xl font-serif font-normal text-stone-900 tracking-tight">
            The Permanent Collection
          </h2>
        </div>

        {/* Search bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search leather, watches, titanium..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-stone-300 rounded-md placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Filter and Category Bar */}
      <div className="space-y-4 mb-8">
        {/* Interactive Segmented Category Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map(cat => {
            const isActive = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-300 hover:text-stone-900'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Secondary Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-stone-600">
          <div className="flex flex-wrap items-center gap-6">
            {/* In-Stock Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={e => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded text-stone-900 border-stone-300 focus:ring-stone-800 accent-stone-900"
              />
              <span className="font-medium text-stone-700">In Stock Only</span>
            </label>

            {/* Price Max Slider */}
            <div className="flex items-center gap-2.5">
              <span className="text-stone-500">Max:</span>
              <input
                type="range"
                min="50"
                max="1000"
                step="25"
                value={maxPriceFilter}
                onChange={e => setMaxPriceFilter(Number(e.target.value))}
                className="w-24 sm:w-32 accent-stone-900 cursor-pointer"
              />
              <span className="font-medium text-stone-900 tabular-nums">
                {formatPrice(maxPriceFilter)}
              </span>
            </div>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-stone-500 hover:text-stone-900 transition-colors underline underline-offset-2"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset all filters</span>
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-stone-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-white border border-stone-300 rounded px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-900 cursor-pointer"
            >
              <option value="featured">Featured Atelier Pieces</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Customer Rating</option>
              <option value="newest">Newest Additions</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center bg-white border border-stone-200 rounded-lg p-8 max-w-lg mx-auto">
          <PackageSearch className="w-12 h-12 stroke-1 text-stone-400 mx-auto mb-3" />
          <h3 className="text-lg font-serif text-stone-900 mb-1">No matching accessories found</h3>
          <p className="text-sm text-stone-500 mb-6">
            Try adjusting your search query, increasing your price range, or toggling off the in-stock filter.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 text-xs font-medium text-stone-900 bg-stone-100 hover:bg-stone-200 rounded transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </section>
  );
};
