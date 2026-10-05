import React from 'react';
import { useStore } from '../context/StoreContext';
import { Package, Truck, CheckCircle2, Clock, ArrowRight, Printer } from 'lucide-react';

export const OrderHistoryView: React.FC = () => {
  const { orders, formatPrice, setActiveView } = useStore();

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-6 border-b border-stone-200 mb-8">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-800 font-medium mb-1">
          <span>Client Transactions</span>
          <span aria-hidden="true">·</span>
          <span>Order History</span>
        </div>
        <h1 className="text-3xl font-serif text-stone-900 font-normal">
          Your Atelier Orders
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Review past orders, track dispatch status, and download certificates of authenticity.
        </p>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map(order => (
            <div
              key={order.id}
              className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs"
            >
              {/* Top Order Bar */}
              <div className="bg-stone-50 p-4 sm:px-6 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-4 text-stone-600">
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase tracking-wider">Order Placed</span>
                    <span className="font-medium text-stone-800">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase tracking-wider">Order Number</span>
                    <span className="font-mono font-medium text-stone-800">#{order.orderNumber}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase tracking-wider">Total</span>
                    <span className="font-semibold text-stone-900 tabular-nums font-serif text-sm">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-medium border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Payment Authorized
                  </span>
                  <button
                    onClick={() => window.print()}
                    className="p-1.5 text-stone-500 hover:text-stone-900 rounded"
                    title="Print Receipt"
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="p-4 sm:px-6 border-b border-stone-100 bg-white">
                <div className="flex items-center justify-between text-xs mb-3">
                  <div className="flex items-center gap-2 text-stone-800">
                    <Truck className="w-4 h-4 text-amber-800" />
                    <span className="font-medium">
                      Estimated Delivery: {order.estimatedDelivery}
                    </span>
                  </div>
                  <span className="font-mono text-stone-500 text-[11px]">
                    Tracking: {order.trackingNumber}
                  </span>
                </div>

                {/* Simulated courier steps */}
                <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-stone-900 mb-1" />
                    <span className="font-semibold text-stone-900">Confirmed</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-stone-900 mb-1" />
                    <span className="font-semibold text-stone-900">Craft Inspected</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-600 animate-pulse mb-1" />
                    <span className="font-medium text-stone-700">Courier Dispatch</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-stone-200 mb-1" />
                    <span className="text-stone-400">Delivered</span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-4 sm:px-6 divide-y divide-stone-100 text-xs">
                {order.items.map(item => (
                  <div key={item.product.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded bg-stone-100 overflow-hidden border border-stone-200">
                        <img
                          src={item.product.images[0] || '/src/assets/images/hero_accessories_atelier_1791181418156.jpg'}
                          alt={item.product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <span className="font-medium text-stone-900 block">{item.product.name}</span>
                        <span className="text-[11px] text-stone-400">
                          SKU: {item.product.sku} · Qty: {item.quantity}
                        </span>
                      </div>
                    </div>

                    <span className="font-medium text-stone-900 tabular-nums">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Shipping Address Footer */}
              <div className="bg-stone-50/50 p-4 sm:px-6 text-[11px] text-stone-500 border-t border-stone-200 flex flex-wrap justify-between items-center gap-2">
                <span>
                  Delivering to: <strong className="text-stone-700">{order.shippingAddress.fullName}</strong>, {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.postalCode}
                </span>
                <span className="font-mono text-stone-400">
                  Payment: {order.paymentDetails.method.toUpperCase()} ({order.paymentDetails.cardNumberMasked || 'Express'})
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-stone-200 rounded-xl p-8 max-w-md mx-auto shadow-xs">
          <Package className="w-12 h-12 stroke-1 text-stone-300 mx-auto mb-3" />
          <h2 className="text-xl font-serif text-stone-900 mb-2">No past orders yet</h2>
          <p className="text-xs text-stone-500 mb-6 leading-relaxed">
            When you complete an order using our secure payment gateway, receipt details and live dispatch progress will be stored here.
          </p>
          <button
            onClick={() => setActiveView('catalog')}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-md transition-colors"
          >
            <span>Browse Accessories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </section>
  );
};
