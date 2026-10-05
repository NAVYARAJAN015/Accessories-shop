import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, ProductCategory } from '../types';
import {
  Box,
  AlertTriangle,
  TrendingUp,
  Package,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Edit,
  Trash2,
  CheckCircle2,
  DollarSign,
  History,
  ArrowUpRight,
  ArrowDownRight,
  X
} from 'lucide-react';

export const InventoryManager: React.FC = () => {
  const {
    products,
    updateStock,
    adjustStockDelta,
    restockAllLowStock,
    addProduct,
    updateProduct,
    deleteProduct,
    resetInventoryToDefaults,
    inventoryLogs,
    formatPrice
  } = useStore();

  const [activeTab, setActiveTab] = useState<'inventory' | 'audit_logs'>('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockStatusFilter, setStockStatusFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [restockProduct, setRestockProduct] = useState<Product | null>(null);
  const [restockAmount, setRestockAmount] = useState<number>(10);
  const [restockNote, setRestockNote] = useState('Supplier shipment received');

  // New product form
  const [newProductData, setNewProductData] = useState({
    name: '',
    sku: '',
    tagline: '',
    category: 'leather' as ProductCategory,
    price: 250,
    cost: 100,
    stock: 12,
    lowStockThreshold: 5,
    description: '',
    materials: '',
    origin: ''
  });

  // Calculate high-level KPIs
  const totalSkus = products.length;
  const totalUnits = products.reduce((acc, p) => acc + p.stock, 0);
  const lowStockItems = products.filter(p => p.stock > 0 && p.stock <= p.lowStockThreshold);
  const outOfStockItems = products.filter(p => p.stock <= 0);
  const totalValuationCost = products.reduce((acc, p) => acc + p.stock * p.cost, 0);
  const totalValuationRetail = products.reduce((acc, p) => acc + p.stock * p.price, 0);
  const averageMargin = products.length > 0
    ? Math.round(
        products.reduce((acc, p) => acc + ((p.price - p.cost) / p.price) * 100, 0) / products.length
      )
    : 0;

  // Filter products for the table
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;

      if (stockStatusFilter === 'low_stock') {
        if (p.stock <= 0 || p.stock > p.lowStockThreshold) return false;
      } else if (stockStatusFilter === 'out_of_stock') {
        if (p.stock > 0) return false;
      } else if (stockStatusFilter === 'in_stock') {
        if (p.stock <= 0) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [products, categoryFilter, stockStatusFilter, searchQuery]);

  const handleGenerateSku = () => {
    const prefix = newProductData.category.slice(0, 3).toUpperCase();
    const random = Math.floor(10 + Math.random() * 90);
    setNewProductData(prev => ({ ...prev, sku: `${prefix}-ART-${random}` }));
  };

  const handleSaveNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductData.name || !newProductData.sku) return;

    addProduct({
      name: newProductData.name,
      sku: newProductData.sku,
      tagline: newProductData.tagline || 'Artisanal atelier handcrafted piece',
      category: newProductData.category,
      price: Number(newProductData.price),
      cost: Number(newProductData.cost),
      stock: Number(newProductData.stock),
      lowStockThreshold: Number(newProductData.lowStockThreshold),
      description: newProductData.description || 'Crafted with premium materials for discerning collectors.',
      details: {
        materials: newProductData.materials || 'Full-Grain Leather, Brass Hardware',
        origin: newProductData.origin || 'Florence, Italy',
        warranty: 'Lifetime Atelier Guarantee'
      },
      images: ['/src/assets/images/hero_accessories_atelier_1791181418156.jpg'],
      rating: 5.0,
      reviewCount: 0
    });

    setIsAddModalOpen(false);
    setNewProductData({
      name: '',
      sku: '',
      tagline: '',
      category: 'leather',
      price: 250,
      cost: 100,
      stock: 12,
      lowStockThreshold: 5,
      description: '',
      materials: '',
      origin: ''
    });
  };

  const handleSaveEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    updateProduct(editingProduct);
    setEditingProduct(null);
  };

  const handleExecuteRestock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockProduct) return;
    updateStock(restockProduct.id, restockProduct.stock + Number(restockAmount), restockNote);
    setRestockProduct(null);
    setRestockAmount(10);
  };

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-stone-200 mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-800 font-semibold mb-1">
            <span>Atelier Operations</span>
            <span aria-hidden="true">·</span>
            <span>Live Stock Engine</span>
          </div>
          <h1 className="text-3xl font-serif text-stone-900 font-normal">
            Inventory & Warehouse Management
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'inventory'
                ? 'bg-stone-900 text-white shadow-2xs'
                : 'bg-white text-stone-700 border border-stone-300 hover:bg-stone-50'
            }`}
          >
            Inventory Table
          </button>

          <button
            onClick={() => setActiveTab('audit_logs')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'audit_logs'
                ? 'bg-stone-900 text-white shadow-2xs'
                : 'bg-white text-stone-700 border border-stone-300 hover:bg-stone-50'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Audit Log ({inventoryLogs.length})</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-amber-800 hover:bg-amber-900 rounded-md transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Accessory</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* KPI 1 */}
        <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span>Total Units Stocked</span>
            <Box className="w-4 h-4 text-stone-400" />
          </div>
          <div className="text-2xl font-serif font-bold text-stone-900 tabular-nums">
            {totalUnits.toLocaleString()}
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">Across {totalSkus} distinct SKUs</span>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span>Critical & Low Stock</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-serif font-bold text-stone-900 tabular-nums">
            {lowStockItems.length + outOfStockItems.length}
          </div>
          <span className="text-[11px] text-amber-800 mt-1 block">
            {outOfStockItems.length} out of stock · {lowStockItems.length} low
          </span>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span>Wholesale Inventory Value</span>
            <DollarSign className="w-4 h-4 text-stone-400" />
          </div>
          <div className="text-2xl font-serif font-bold text-stone-900 tabular-nums">
            {formatPrice(totalValuationCost)}
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">
            Retail value: {formatPrice(totalValuationRetail)}
          </span>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span>Avg Gross Margin</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-serif font-bold text-stone-900 tabular-nums">
            {averageMargin}%
          </div>
          <span className="text-[11px] text-emerald-700 mt-1 block">Healthy luxury markup tier</span>
        </div>
      </div>

      {/* Critical Stock Alert Banner */}
      {(lowStockItems.length > 0 || outOfStockItems.length > 0) && (
        <div className="mb-8 p-4 bg-amber-50 border border-amber-200/90 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-950">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-900">
                Action Required: {outOfStockItems.length + lowStockItems.length} pieces require warehouse restock
              </p>
              <p className="text-amber-800 text-[11px] mt-0.5">
                {outOfStockItems.length > 0 && `${outOfStockItems.map(p => p.name).join(', ')} currently sold out.`}
              </p>
            </div>
          </div>

          <button
            onClick={() => restockAllLowStock(15)}
            className="self-start sm:self-center px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded font-medium transition-colors shadow-2xs whitespace-nowrap"
          >
            Restock All Low Pieces (+15 units)
          </button>
        </div>
      )}

      {/* TAB 1: Inventory Table */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          {/* Search and Filters Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-stone-200">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search SKU or product title..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="bg-stone-50 border border-stone-300 rounded px-2.5 py-1.5 text-stone-700 focus:outline-none"
              >
                <option value="all">All Categories</option>
                <option value="watches">Horology</option>
                <option value="leather">Leather Goods</option>
                <option value="jewelry">Fine Jewelry</option>
                <option value="eyewear">Eyewear</option>
                <option value="scarves">Silk Scarves</option>
                <option value="hardware">Hardware</option>
              </select>

              {/* Status Filter */}
              <select
                value={stockStatusFilter}
                onChange={e => setStockStatusFilter(e.target.value as any)}
                className="bg-stone-50 border border-stone-300 rounded px-2.5 py-1.5 text-stone-700 focus:outline-none"
              >
                <option value="all">All Stock Statuses</option>
                <option value="in_stock">In Stock (&gt;0)</option>
                <option value="low_stock">Low Stock (≤5)</option>
                <option value="out_of_stock">Out of Stock (0)</option>
              </select>

              <button
                onClick={resetInventoryToDefaults}
                className="p-1.5 text-stone-400 hover:text-stone-800 rounded"
                title="Reset to Factory Sample Data"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg border border-stone-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-100/70 border-b border-stone-200 text-stone-600 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">SKU / Code</th>
                    <th className="py-3 px-4">Accessory Details</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Stock Level</th>
                    <th className="py-3 px-4">Unit Cost</th>
                    <th className="py-3 px-4">Retail Price</th>
                    <th className="py-3 px-4">Margin</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200/80">
                  {filteredProducts.map(product => {
                    const isOutOfStock = product.stock <= 0;
                    const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;
                    const marginPercent = Math.round(((product.price - product.cost) / product.price) * 100);

                    return (
                      <tr key={product.id} className="hover:bg-stone-50/50 transition-colors">
                        <td className="py-3 px-4 font-mono font-medium text-stone-700 whitespace-nowrap">
                          {product.sku}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                              <img
                                src={product.images[0] || '/src/assets/images/hero_accessories_atelier_1791181418156.jpg'}
                                alt={product.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <span className="font-semibold text-stone-900 block">{product.name}</span>
                              <span className="text-[11px] text-stone-400">{product.details.origin}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 capitalize text-stone-600">
                          {product.category}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            {/* Stock Stepper */}
                            <div className="flex items-center border border-stone-300 rounded bg-stone-50">
                              <button
                                onClick={() => adjustStockDelta(product.id, -1, 'Manual warehouse deduction (-1)')}
                                disabled={product.stock <= 0}
                                className="px-2 py-0.5 text-stone-600 hover:text-stone-900 disabled:opacity-30"
                                title="Subtract 1 unit"
                              >
                                -
                              </button>
                              <span
                                className={`px-2 py-0.5 font-bold tabular-nums min-w-[2rem] text-center ${
                                  isOutOfStock
                                    ? 'text-red-700 bg-red-50'
                                    : isLowStock
                                    ? 'text-amber-800 bg-amber-50'
                                    : 'text-stone-900'
                                }`}
                              >
                                {product.stock}
                              </span>
                              <button
                                onClick={() => adjustStockDelta(product.id, 1, 'Manual warehouse addition (+1)')}
                                className="px-2 py-0.5 text-stone-600 hover:text-stone-900"
                                title="Add 1 unit"
                              >
                                +
                              </button>
                            </div>

                            {/* Status label without pill badge */}
                            <span className="text-[11px]">
                              {isOutOfStock ? (
                                <span className="text-red-600 font-medium">Sold Out</span>
                              ) : isLowStock ? (
                                <span className="text-amber-700 font-medium">Low Stock</span>
                              ) : (
                                <span className="text-emerald-700">Healthy</span>
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 tabular-nums text-stone-600">
                          {formatPrice(product.cost)}
                        </td>
                        <td className="py-3 px-4 tabular-nums font-semibold text-stone-900">
                          {formatPrice(product.price)}
                        </td>
                        <td className="py-3 px-4 tabular-nums text-emerald-700 font-medium">
                          {marginPercent}%
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setRestockProduct(product);
                                setRestockAmount(10);
                              }}
                              className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded text-[11px] font-medium"
                              title="Restock units"
                            >
                              Restock
                            </button>

                            <button
                              onClick={() => setEditingProduct(product)}
                              className="p-1 text-stone-400 hover:text-stone-800 rounded"
                              title="Edit product"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => deleteProduct(product.id)}
                              className="p-1 text-stone-400 hover:text-red-600 rounded"
                              title="Delete product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredProducts.length === 0 && (
              <div className="p-8 text-center text-stone-400">
                No items match your filter criteria.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Audit Logs */}
      {activeTab === 'audit_logs' && (
        <div className="bg-white rounded-lg border border-stone-200 overflow-hidden shadow-2xs">
          <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-xs">
            <div className="font-semibold text-stone-800">
              Real-Time Stock Audit History ({inventoryLogs.length} events logged)
            </div>
            <span className="text-stone-400">Chronological stock mutations</span>
          </div>

          <div className="divide-y divide-stone-200 text-xs">
            {inventoryLogs.map(log => {
              const isSale = log.changeType === 'order_sale';
              const isRestock = log.changeType === 'restock';

              return (
                <div key={log.id} className="p-4 flex items-center justify-between hover:bg-stone-50/50">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isSale ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                      }`}
                    >
                      {isSale ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>

                    <div>
                      <div className="font-medium text-stone-900 flex items-center gap-2">
                        <span>{log.productName}</span>
                        <span className="font-mono text-stone-400 text-[11px]">({log.sku})</span>
                      </div>
                      <span className="text-[11px] text-stone-500">{log.reason}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`font-semibold tabular-nums block ${
                        log.delta > 0 ? 'text-emerald-700' : 'text-stone-800'
                      }`}
                    >
                      {log.delta > 0 ? `+${log.delta}` : log.delta} units
                    </span>
                    <span className="text-[10px] text-stone-400">
                      Balance: {log.newStock} units · {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL 1: Add New Product */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-stone-200 p-6">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-900"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-serif text-stone-900 mb-1">Add New Accessory to Catalog</h3>
            <p className="text-xs text-stone-500 mb-6">Create a bespoke product with instant stock tracking.</p>

            <form onSubmit={handleSaveNewProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    value={newProductData.name}
                    onChange={e => setNewProductData({ ...newProductData, name: e.target.value })}
                    placeholder="e.g. Como Woven Silk Tie"
                    className="w-full px-3 py-2 border border-stone-300 rounded focus:ring-1 focus:ring-stone-900"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-medium text-stone-700">SKU / Code</label>
                    <button
                      type="button"
                      onClick={handleGenerateSku}
                      className="text-[10px] text-amber-800 hover:underline"
                    >
                      Auto-generate
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={newProductData.sku}
                    onChange={e => setNewProductData({ ...newProductData, sku: e.target.value })}
                    placeholder="e.g. SCF-TIE-11"
                    className="w-full px-3 py-2 border border-stone-300 rounded font-mono uppercase focus:ring-1 focus:ring-stone-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Category</label>
                  <select
                    value={newProductData.category}
                    onChange={e => setNewProductData({ ...newProductData, category: e.target.value as ProductCategory })}
                    className="w-full px-2.5 py-2 border border-stone-300 rounded bg-white"
                  >
                    <option value="watches">Horology</option>
                    <option value="leather">Leather</option>
                    <option value="jewelry">Jewelry</option>
                    <option value="eyewear">Eyewear</option>
                    <option value="scarves">Scarves</option>
                    <option value="hardware">Hardware</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Retail Price ($)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newProductData.price}
                    onChange={e => setNewProductData({ ...newProductData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-300 rounded"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Unit Cost ($)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newProductData.cost}
                    onChange={e => setNewProductData({ ...newProductData, cost: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-300 rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Initial Stock (Units)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={newProductData.stock}
                    onChange={e => setNewProductData({ ...newProductData, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-300 rounded"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Low Stock Alert Threshold</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newProductData.lowStockThreshold}
                    onChange={e => setNewProductData({ ...newProductData, lowStockThreshold: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-300 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Materials & Origin</label>
                <input
                  type="text"
                  value={newProductData.materials}
                  onChange={e => setNewProductData({ ...newProductData, materials: e.target.value })}
                  placeholder="e.g. Mulberry Silk, Florence, Italy"
                  className="w-full px-3 py-2 border border-stone-300 rounded"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 text-white rounded font-medium hover:bg-stone-800"
                >
                  Publish & Stock Piece
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Restock Product Dialog */}
      {restockProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-stone-200 p-6">
            <button
              onClick={() => setRestockProduct(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-900"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-serif text-stone-900 mb-1">Restock Inventory</h3>
            <p className="text-xs text-stone-500 mb-4">
              {restockProduct.name} ({restockProduct.sku}) · Current stock: <strong>{restockProduct.stock} units</strong>
            </p>

            <form onSubmit={handleExecuteRestock} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Quantity to Add</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={restockAmount}
                  onChange={e => setRestockAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-stone-300 rounded text-sm font-semibold"
                />
                <span className="text-[11px] text-stone-400 mt-1 block">
                  New total stock will be {restockProduct.stock + Number(restockAmount)} units.
                </span>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Audit Log Reason</label>
                <input
                  type="text"
                  required
                  value={restockNote}
                  onChange={e => setRestockNote(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setRestockProduct(null)}
                  className="px-4 py-2 border border-stone-300 rounded text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 text-white rounded font-medium hover:bg-stone-800"
                >
                  Confirm Restock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Edit Product Dialog */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-stone-200 p-6">
            <button
              onClick={() => setEditingProduct(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-900"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-serif text-stone-900 mb-1">Edit Accessory Specs</h3>
            <p className="text-xs text-stone-500 mb-4">{editingProduct.sku}</p>

            <form onSubmit={handleSaveEditProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Retail Price ($)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-300 rounded"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Unit Cost ($)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.cost}
                    onChange={e => setEditingProduct({ ...editingProduct, cost: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-300 rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Stock Level</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.stock}
                    onChange={e => setEditingProduct({ ...editingProduct, stock: Math.max(0, Number(e.target.value)) })}
                    className="w-full px-3 py-2 border border-stone-300 rounded"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Low Stock Threshold</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.lowStockThreshold}
                    onChange={e => setEditingProduct({ ...editingProduct, lowStockThreshold: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-300 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description}
                  onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 border border-stone-300 rounded text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 text-white rounded font-medium hover:bg-stone-800"
                >
                  Save Modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
