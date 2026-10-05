import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Review,
  CartItem,
  Order,
  InventoryLog,
  CurrencyCode
} from '../types';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS } from '../data/initialProducts';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface PromoDiscount {
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  minSpend?: number;
}

const AVAILABLE_PROMOS: Record<string, PromoDiscount> = {
  AURA10: { code: 'AURA10', type: 'percent', value: 10 },
  WELCOME20: { code: 'WELCOME20', type: 'percent', value: 20, minSpend: 150 },
  LUXE50: { code: 'LUXE50', type: 'fixed', value: 50, minSpend: 300 }
};

const CURRENCY_RATES: Record<CurrencyCode, { symbol: string; rate: number }> = {
  USD: { symbol: '$', rate: 1 },
  EUR: { symbol: '€', rate: 0.92 },
  GBP: { symbol: '£', rate: 0.79 },
  JPY: { symbol: '¥', rate: 154 }
};

interface StoreContextType {
  // Navigation & Views
  activeView: 'catalog' | 'inventory' | 'orders' | 'wishlist';
  setActiveView: (view: 'catalog' | 'inventory' | 'orders' | 'wishlist') => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;

  // Products & Inventory
  products: Product[];
  inventoryLogs: InventoryLog[];
  updateStock: (productId: string, newStock: number, reason?: string) => void;
  adjustStockDelta: (productId: string, delta: number, reason?: string) => void;
  restockAllLowStock: (defaultAmount?: number) => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  resetInventoryToDefaults: () => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  moveAllWishlistToCart: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => boolean;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  appliedPromo: PromoDiscount | null;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  cartSubtotal: number;
  cartDiscount: number;
  cartShipping: number;
  cartTax: number;
  cartTotal: number;
  cartItemCount: number;

  // Currency
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (amountInUSD: number) => string;

  // Reviews
  reviews: Review[];
  getProductReviews: (productId: string) => Review[];
  addReview: (reviewData: Omit<Review, 'id' | 'date' | 'helpfulCount'>) => void;
  voteReviewHelpful: (reviewId: string) => void;

  // Orders & Payment
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status' | 'trackingNumber' | 'estimatedDelivery'>) => Order;

  // UI state
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  reviewModalProduct: Product | null;
  setReviewModalProduct: (product: Product | null) => void;
  lastCompletedOrder: Order | null;
  setLastCompletedOrder: (order: Order | null) => void;

  // Toasts
  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products & Inventory Persistence
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('aura_products_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_PRODUCTS;
  });

  const [inventoryLogs, setInventoryLogs] = useState<InventoryLog[]>(() => {
    try {
      const saved = localStorage.getItem('aura_inventory_logs');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: 'log-init-1',
        productId: 'prod-002',
        productName: 'Riviera Tuscan Leather Tote',
        sku: 'LTH-TOT-02',
        changeType: 'adjustment',
        delta: -5,
        previousStock: 8,
        newStock: 3,
        reason: 'Reserved for private preview showroom',
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        id: 'log-init-2',
        productId: 'prod-006',
        productName: 'Como Twill Silk Scarf',
        sku: 'SCF-LMO-06',
        changeType: 'order_sale',
        delta: -4,
        previousStock: 4,
        newStock: 0,
        reason: 'Customer online order #AUR-7014 batch fulfillment',
        timestamp: new Date(Date.now() - 86400000 * 4).toISOString()
      }
    ];
  });

  // Wishlist Persistence
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('aura_wishlist');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return ['prod-001', 'prod-003'];
  });

  // Cart Persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('aura_cart');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  // Reviews Persistence
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem('aura_reviews');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_REVIEWS;
  });

  // Orders Persistence
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('aura_orders');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  // UI State
  const [activeView, setActiveView] = useState<'catalog' | 'inventory' | 'orders' | 'wishlist'>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [appliedPromo, setAppliedPromo] = useState<PromoDiscount | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [reviewModalProduct, setReviewModalProduct] = useState<Product | null>(null);
  const [lastCompletedOrder, setLastCompletedOrder] = useState<Order | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync products to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aura_products_v1', JSON.stringify(products));
    } catch {
      // ignore
    }
  }, [products]);

  // Sync logs
  useEffect(() => {
    try {
      localStorage.setItem('aura_inventory_logs', JSON.stringify(inventoryLogs));
    } catch {
      // ignore
    }
  }, [inventoryLogs]);

  // Sync wishlist
  useEffect(() => {
    try {
      localStorage.setItem('aura_wishlist', JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  // Sync cart
  useEffect(() => {
    try {
      localStorage.setItem('aura_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Sync reviews
  useEffect(() => {
    try {
      localStorage.setItem('aura_reviews', JSON.stringify(reviews));
    } catch {
      // ignore
    }
  }, [reviews]);

  // Sync orders
  useEffect(() => {
    try {
      localStorage.setItem('aura_orders', JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  // Toast Helpers
  const showToast = (message: string, type: ToastMessage['type'] = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Currency Formatter
  const formatPrice = (amountInUSD: number): string => {
    const curr = CURRENCY_RATES[currency];
    const converted = amountInUSD * curr.rate;
    if (currency === 'JPY') {
      return `${curr.symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${curr.symbol}${converted.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  // Inventory Management
  const updateStock = (productId: string, newStock: number, reason = 'Direct manual stock update') => {
    const safeStock = Math.max(0, newStock);
    const targetProduct = products.find(p => p.id === productId);
    if (!targetProduct) return;

    const previousStock = targetProduct.stock;
    const delta = safeStock - previousStock;

    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, stock: safeStock } : p))
    );

    const logEntry: InventoryLog = {
      id: `log-${Date.now()}`,
      productId,
      productName: targetProduct.name,
      sku: targetProduct.sku,
      changeType: delta >= 0 ? 'restock' : 'adjustment',
      delta,
      previousStock,
      newStock: safeStock,
      reason,
      timestamp: new Date().toISOString()
    };

    setInventoryLogs(prev => [logEntry, ...prev]);
    showToast(`Updated ${targetProduct.name} stock to ${safeStock} units`, 'info');
  };

  const adjustStockDelta = (productId: string, delta: number, reason?: string) => {
    const p = products.find(prod => prod.id === productId);
    if (!p) return;
    updateStock(productId, p.stock + delta, reason || `Quick adjustment (${delta > 0 ? '+' : ''}${delta})`);
  };

  const restockAllLowStock = (defaultAmount = 15) => {
    let restockedCount = 0;
    const newLogs: InventoryLog[] = [];

    setProducts(prev =>
      prev.map(p => {
        if (p.stock <= p.lowStockThreshold) {
          restockedCount++;
          const newStock = p.stock + defaultAmount;
          newLogs.push({
            id: `log-${Date.now()}-${p.id}`,
            productId: p.id,
            productName: p.name,
            sku: p.sku,
            changeType: 'restock',
            delta: defaultAmount,
            previousStock: p.stock,
            newStock,
            reason: `Batch restock of critical inventory (+${defaultAmount} units)`,
            timestamp: new Date().toISOString()
          });
          return { ...p, stock: newStock };
        }
        return p;
      })
    );

    if (newLogs.length > 0) {
      setInventoryLogs(prev => [...newLogs, ...prev]);
      showToast(`Restocked ${restockedCount} low-stock accessories by +${defaultAmount} units`, 'success');
    } else {
      showToast('All products are currently adequately stocked', 'info');
    }
  };

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setProducts(prev => [newProduct, ...prev]);
    setInventoryLogs(prev => [
      {
        id: `log-${Date.now()}`,
        productId: newProduct.id,
        productName: newProduct.name,
        sku: newProduct.sku,
        changeType: 'initial',
        delta: newProduct.stock,
        previousStock: 0,
        newStock: newProduct.stock,
        reason: 'New product line onboarded to catalog',
        timestamp: new Date().toISOString()
      },
      ...prev
    ]);
    showToast(`Added "${newProduct.name}" to accessories catalog`, 'success');
  };

  const updateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => (p.id === updated.id ? updated : p)));
    showToast(`Updated product details for ${updated.name}`, 'info');
  };

  const deleteProduct = (productId: string) => {
    const p = products.find(prod => prod.id === productId);
    setProducts(prev => prev.filter(prod => prod.id !== productId));
    setCart(prev => prev.filter(item => item.product.id !== productId));
    setWishlist(prev => prev.filter(id => id !== productId));
    showToast(`Deleted ${p?.name || 'product'} from catalog`, 'warning');
  };

  const resetInventoryToDefaults = () => {
    setProducts(INITIAL_PRODUCTS);
    setReviews(INITIAL_REVIEWS);
    showToast('Catalog & Inventory reset to factory sample data', 'info');
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    const p = products.find(item => item.id === productId);
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast(`Removed ${p?.name || 'item'} from wishlist`, 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast(`Saved ${p?.name || 'item'} to your wishlist`, 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const clearWishlist = () => {
    setWishlist([]);
    showToast('Cleared your wishlist', 'info');
  };

  const moveAllWishlistToCart = () => {
    let addedCount = 0;
    wishlist.forEach(id => {
      const p = products.find(prod => prod.id === id);
      if (p && p.stock > 0) {
        addToCart(p, 1);
        addedCount++;
      }
    });
    if (addedCount > 0) {
      showToast(`Moved ${addedCount} available item(s) from wishlist to your bag`, 'success');
      setIsCartOpen(true);
    } else {
      showToast('No in-stock items found in wishlist to move', 'warning');
    }
  };

  // Cart Operations
  const addToCart = (product: Product, quantity = 1): boolean => {
    // Check available stock
    const currentStock = product.stock;
    const existingCartItem = cart.find(item => item.product.id === product.id);
    const existingQuantity = existingCartItem ? existingCartItem.quantity : 0;

    if (currentStock <= 0) {
      showToast(`Sorry, ${product.name} is currently out of stock`, 'error');
      return false;
    }

    if (existingQuantity + quantity > currentStock) {
      showToast(`Cannot add more: Only ${currentStock} available in inventory`, 'warning');
      return false;
    }

    setCart(prev => {
      const index = prev.findIndex(item => item.product.id === product.id);
      if (index >= 0) {
        const next = [...prev];
        next[index] = {
          ...next[index],
          quantity: next[index].quantity + quantity
        };
        return next;
      }
      return [...prev, { product, quantity }];
    });

    showToast(`Added ${product.name} (${quantity}) to shopping bag`, 'success');
    return true;
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast('Item removed from bag', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const item = cart.find(c => c.product.id === productId);
    const product = products.find(p => p.id === productId);

    if (product && quantity > product.stock) {
      showToast(`Only ${product.stock} units available in stock`, 'warning');
      return;
    }

    setCart(prev =>
      prev.map(i => (i.product.id === productId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
  };

  // Promo codes
  const applyPromoCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    const promo = AVAILABLE_PROMOS[clean];

    if (!promo) {
      return { success: false, message: 'Invalid or expired promotional code.' };
    }

    if (promo.minSpend && cartSubtotal < promo.minSpend) {
      return {
        success: false,
        message: `Code ${promo.code} requires a minimum order of $${promo.minSpend}.`
      };
    }

    setAppliedPromo(promo);
    showToast(`Promo code "${promo.code}" applied successfully!`, 'success');
    return { success: true, message: 'Promo code applied!' };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    showToast('Promotional code removed', 'info');
  };

  // Cart Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const cartDiscount = appliedPromo
    ? appliedPromo.type === 'percent'
      ? (cartSubtotal * appliedPromo.value) / 100
      : Math.min(appliedPromo.value, cartSubtotal)
    : 0;

  // Free shipping over $200
  const cartShipping = cartSubtotal > 0 && cartSubtotal >= 200 ? 0 : cartSubtotal > 0 ? 15 : 0;
  const cartTax = Math.round((cartSubtotal - cartDiscount) * 0.0825 * 100) / 100;
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartShipping + (cartSubtotal > 0 ? cartTax : 0));
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Reviews
  const getProductReviews = (productId: string) => {
    return reviews.filter(r => r.productId === productId);
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'date' | 'helpfulCount'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      helpfulCount: 0
    };

    setReviews(prev => [newReview, ...prev]);

    // Recalculate product rating
    setProducts(prev =>
      prev.map(p => {
        if (p.id === reviewData.productId) {
          const currentReviews = reviews.filter(r => r.productId === p.id);
          const allRatings = [...currentReviews.map(r => r.rating), reviewData.rating];
          const newAvg = Number((allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(1));
          return {
            ...p,
            rating: newAvg,
            reviewCount: allRatings.length
          };
        }
        return p;
      })
    );

    showToast('Your verified review was published! Thank you for your feedback.', 'success');
  };

  const voteReviewHelpful = (reviewId: string) => {
    setReviews(prev =>
      prev.map(r => {
        if (r.id === reviewId) {
          const wasVoted = r.userVotedHelpful;
          return {
            ...r,
            helpfulCount: wasVoted ? r.helpfulCount - 1 : r.helpfulCount + 1,
            userVotedHelpful: !wasVoted
          };
        }
        return r;
      })
    );
  };

  // Orders & Payment Gateway Execution
  const createOrder = (
    orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status' | 'trackingNumber' | 'estimatedDelivery'>
  ): Order => {
    const orderNumber = `AUR-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const estDelivery = new Date(Date.now() + 86400000 * 4).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: now.toISOString(),
      status: 'confirmed',
      trackingNumber: `AT-${Math.floor(100000000 + Math.random() * 900000000)}`,
      estimatedDelivery: estDelivery
    };

    // Deduct stock from inventory in real time & record logs!
    const newLogs: InventoryLog[] = [];
    setProducts(prev =>
      prev.map(p => {
        const cartItem = orderData.items.find(ci => ci.product.id === p.id);
        if (cartItem) {
          const safeNewStock = Math.max(0, p.stock - cartItem.quantity);
          newLogs.push({
            id: `log-${Date.now()}-${p.id}`,
            productId: p.id,
            productName: p.name,
            sku: p.sku,
            changeType: 'order_sale',
            delta: -cartItem.quantity,
            previousStock: p.stock,
            newStock: safeNewStock,
            reason: `Order #${orderNumber} payment verified & confirmed`,
            timestamp: new Date().toISOString()
          });
          return {
            ...p,
            stock: safeNewStock
          };
        }
        return p;
      })
    );

    if (newLogs.length > 0) {
      setInventoryLogs(prev => [...newLogs, ...prev]);
    }

    setOrders(prev => [newOrder, ...prev]);
    setLastCompletedOrder(newOrder);
    clearCart();

    return newOrder;
  };

  return (
    <StoreContext.Provider
      value={{
        activeView,
        setActiveView,
        selectedCategory,
        setSelectedCategory,
        products,
        inventoryLogs,
        updateStock,
        adjustStockDelta,
        restockAllLowStock,
        addProduct,
        updateProduct,
        deleteProduct,
        resetInventoryToDefaults,
        wishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        moveAllWishlistToCart,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        appliedPromo,
        applyPromoCode,
        removePromoCode,
        cartSubtotal,
        cartDiscount,
        cartShipping,
        cartTax,
        cartTotal,
        cartItemCount,
        currency,
        setCurrency,
        formatPrice,
        reviews,
        getProductReviews,
        addReview,
        voteReviewHelpful,
        orders,
        createOrder,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        quickViewProduct,
        setQuickViewProduct,
        reviewModalProduct,
        setReviewModalProduct,
        lastCompletedOrder,
        setLastCompletedOrder,
        toasts,
        showToast,
        dismissToast
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
