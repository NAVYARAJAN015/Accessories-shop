import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, Sparkles, Shield, Clock, Award } from 'lucide-react';
import { heroImg } from '../data/initialProducts';

export const HeroBanner: React.FC = () => {
  const { setSelectedCategory, setActiveView } = useStore();

  const handleExplore = () => {
    setActiveView('catalog');
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-stone-900 text-stone-100">
      {/* Background with measured contrast overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImg}
          alt="Aura Atelier luxury accessories craftsmanship flatlay"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-40 brightness-90 transform scale-105 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-900/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="max-w-2xl">
          {/* Subtle unboxed kicker */}
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-300/90 font-medium mb-4">
            <span>Edition Spring / Summer 2026</span>
            <span aria-hidden="true">·</span>
            <span>Artisanal Atelier</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal tracking-tight text-white leading-[1.1] mb-6 text-balance">
            Objects of enduring restraint & tactile precision.
          </h1>

          <p className="text-base sm:text-lg text-stone-300 font-light leading-relaxed mb-8 max-w-xl">
            Each timepiece, Tuscan leather tote, and titanium frame is shaped in limited ateliers across Florence, Geneva, and Sabae. Made for quiet distinction, guaranteed for a lifetime.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={handleExplore}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 text-sm font-medium text-stone-950 bg-stone-100 hover:bg-white rounded-md transition-colors shadow-sm"
            >
              <span>Explore The Collection</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setSelectedCategory('watches');
                handleExplore();
              }}
              className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-medium text-stone-200 hover:text-white border border-stone-700 hover:border-stone-500 rounded-md transition-colors"
            >
              <span>View Horology</span>
            </button>
          </div>

          {/* Adjacency Trust Guarantees */}
          <div className="grid grid-cols-3 gap-6 pt-12 mt-12 border-t border-stone-800/80 text-xs text-stone-400">
            <div>
              <p className="font-semibold text-stone-200 uppercase tracking-wider text-[11px] mb-1">
                Tuscan & Swiss Origin
              </p>
              <p className="text-stone-400 text-xs leading-normal">Certified single-origin ateliers</p>
            </div>
            <div>
              <p className="font-semibold text-stone-200 uppercase tracking-wider text-[11px] mb-1">
                Lifetime Warranty
              </p>
              <p className="text-stone-400 text-xs leading-normal">Repairs and recalibration</p>
            </div>
            <div>
              <p className="font-semibold text-stone-200 uppercase tracking-wider text-[11px] mb-1">
                Insured Delivery
              </p>
              <p className="text-stone-400 text-xs leading-normal">Complimentary courier over $200</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
