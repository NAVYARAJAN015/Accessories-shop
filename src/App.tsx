/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ReviewModal } from './components/ReviewModal';
import { WishlistView } from './components/WishlistView';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { InventoryManager } from './components/InventoryManager';
import { OrderHistoryView } from './components/OrderHistoryView';
import { ToastContainer } from './components/ToastContainer';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const {
    activeView,
    quickViewProduct,
    setQuickViewProduct
  } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-stone-900 selection:bg-amber-100 selection:text-stone-900">
      {/* Primary Top Bar */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeView === 'catalog' && (
          <>
            <HeroBanner />
            <ProductCatalog />
          </>
        )}

        {activeView === 'wishlist' && <WishlistView />}

        {activeView === 'orders' && <OrderHistoryView />}

        {activeView === 'inventory' && <InventoryManager />}
      </main>

      {/* Modals & Overlays */}
      <ProductDetailModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      <ReviewModal />
      <CartDrawer />
      <CheckoutModal />
      <ToastContainer />

      {/* Boutique Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
