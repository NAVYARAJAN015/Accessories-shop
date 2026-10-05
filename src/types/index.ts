export type ProductCategory = 'watches' | 'leather' | 'jewelry' | 'eyewear' | 'scarves' | 'hardware';

export interface ProductDetails {
  materials: string;
  origin: string;
  dimensions?: string;
  weight?: string;
  warranty?: string;
  finish?: string;
  careGuide?: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  tagline: string;
  category: ProductCategory;
  price: number;
  cost: number; // for inventory profit margin tracking
  stock: number;
  lowStockThreshold: number;
  description: string;
  details: ProductDetails;
  images: string[];
  isNew?: boolean;
  isBestseller?: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  email: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verifiedBuyer: boolean;
  helpfulCount: number;
  recommended: boolean;
  userVotedHelpful?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export type PaymentMethodType = 'card' | 'apple_pay' | 'google_pay' | 'paypal';

export interface PaymentDetails {
  method: PaymentMethodType;
  cardholderName?: string;
  cardNumberMasked?: string;
  cardBrand?: 'visa' | 'mastercard' | 'amex' | 'discover' | 'generic';
  expiryMonth?: string;
  expiryYear?: string;
  transactionId: string;
  authCode: string;
  tokenSimulated: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  shippingAddress: ShippingAddress;
  shippingMethod: 'standard' | 'express' | 'overnight';
  paymentDetails: PaymentDetails;
  status: 'confirmed' | 'processing' | 'shipped' | 'delivered';
  trackingNumber: string;
  estimatedDelivery: string;
}

export interface InventoryLog {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  changeType: 'order_sale' | 'restock' | 'adjustment' | 'initial';
  delta: number;
  previousStock: number;
  newStock: number;
  reason: string;
  timestamp: string;
}

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY';
