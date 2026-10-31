'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  Package,
  Layers,
  DollarSign,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Server,
} from 'lucide-react';
import { IProduct, IOrder, OrderStatus } from '@/lib/types';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  authToken: string | null;
  onRefreshProducts: () => void;
}

export default function AdminDashboardModal({
  isOpen,
  onClose,
  authToken,
  onRefreshProducts,
}: AdminDashboardModalProps) {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'server'>('products');
  const [products, setProducts] = useState<IProduct[]>([]);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // New product form states
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('Furniture');
  const [newProductPrice, setNewProductPrice] = useState('450');
  const [newProductStock, setNewProductStock] = useState('10');
  const [newProductDescription, setNewProductDescription] = useState('');
  const [newProductImageUrl, setNewProductImageUrl] = useState('/images/hero_store.jpg');

  // Edit stock inline
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editStockVal, setEditStockVal] = useState<number>(0);
  const [editPriceVal, setEditPriceVal] = useState<number>(0);

  const fetchAdminData = useCallback(async () => {
    if (!authToken) return;
    setIsLoading(true);
    setStatusMessage('');

    try {
      // 1. Fetch products
      const pRes = await fetch('/api/products');
      const pData = await pRes.json();
      if (pData.success) {
        setProducts(pData.products || []);
      }

      // 2. Fetch all orders (admin-protected)
      const oRes = await fetch('/api/orders', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const oData = await oRes.json();
      if (oData.success) {
        setOrders(oData.orders || []);
      }
    } catch {
      setStatusMessage('Error loading admin dataset.');
    } finally {
      setIsLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    let cancelled = false;
    if (isOpen && authToken) {
      const load = async () => {
        try {
          const pRes = await fetch('/api/products');
          const pData = await pRes.json();
          if (!cancelled && pData.success) {
            setProducts(pData.products || []);
          }

          const oRes = await fetch('/api/orders', {
            headers: { Authorization: `Bearer ${authToken}` },
          });
          const oData = await oRes.json();
          if (!cancelled && oData.success) {
            setOrders(oData.orders || []);
          }
        } catch {
          if (!cancelled) {
            setStatusMessage('Error loading admin dataset.');
          }
        } finally {
          if (!cancelled) {
            setIsLoading(false);
          }
        }
      };
      load();
    }
    return () => {
      cancelled = true;
    };
  }, [isOpen, authToken]);

  if (!isOpen) return null;

  // Handle Create Product
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) return;

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          name: newProductName,
          category: newProductCategory,
          price: parseFloat(newProductPrice),
          stock: parseInt(newProductStock, 10),
          description: newProductDescription,
          imageUrl: newProductImageUrl,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsCreatingProduct(false);
        setNewProductName('');
        setNewProductDescription('');
        fetchAdminData();
        onRefreshProducts();
      } else {
        alert(data.message || 'Failed to create product.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error';
      alert(msg);
    }
  };

  // Handle Update Product
  const handleSaveProductEdit = async (productId: string) => {
    if (!authToken) return;

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          stock: editStockVal,
          price: editPriceVal,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setEditingProductId(null);
        fetchAdminData();
        onRefreshProducts();
      } else {
        alert(data.message || 'Failed to update product.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error';
      alert(msg);
    }
  };

  // Handle Delete Product
  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product from the catalog?')) return;
    if (!authToken) return;

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const data = await res.json();
      if (data.success) {
        fetchAdminData();
        onRefreshProducts();
      } else {
        alert(data.message || 'Failed to delete product.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error';
      alert(msg);
    }
  };

  // Handle Update Order Status
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    if (!authToken) return;

    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (data.success) {
        fetchAdminData();
        onRefreshProducts();
      } else {
        alert(data.message || 'Failed to update order status.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error';
      alert(msg);
    }
  };

  // KPIs
  const totalRevenue = orders.reduce((sum, o) => (o.orderStatus !== 'Cancelled' ? sum + o.total : sum), 0);
  const lowStockCount = products.filter((p) => p.stock <= 5).length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg shadow-2xl max-w-5xl w-full border border-stone-200 overflow-hidden my-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-900 text-stone-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono tracking-widest text-amber-400">
                ADMIN CONSOLE
              </span>
              <span className="text-stone-400 text-xs">· Role-Based Authorization Active</span>
            </div>
            <h2 className="text-lg font-semibold text-white">Store & Inventory Operations</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation & Refresh */}
        <div className="flex items-center justify-between px-6 border-b border-stone-200 bg-stone-50">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('products')}
              className={`py-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'products'
                  ? 'border-stone-900 text-stone-900'
                  : 'border-transparent text-stone-500 hover:text-stone-900'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Products ({products.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'orders'
                  ? 'border-stone-900 text-stone-900'
                  : 'border-transparent text-stone-500 hover:text-stone-900'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Orders ({orders.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('server')}
              className={`py-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'server'
                  ? 'border-stone-900 text-stone-900'
                  : 'border-transparent text-stone-500 hover:text-stone-900'
              }`}
            >
              <Server className="w-4 h-4" />
              <span>Database & Architecture</span>
            </button>
          </div>

          <button
            onClick={fetchAdminData}
            title="Refresh Data"
            className="p-1.5 text-stone-500 hover:text-stone-900 rounded hover:bg-stone-200 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-stone-50/50 border-b border-stone-200 text-xs">
          <div className="bg-white p-3.5 rounded border border-stone-200">
            <div className="flex items-center justify-between text-stone-500 mb-1">
              <span>Gross Sales</span>
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-base font-semibold text-stone-900 tabular-nums">
              ${totalRevenue.toFixed(2)}
            </div>
          </div>
          <div className="bg-white p-3.5 rounded border border-stone-200">
            <div className="flex items-center justify-between text-stone-500 mb-1">
              <span>Total Orders</span>
              <Layers className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div className="text-base font-semibold text-stone-900 tabular-nums">
              {orders.length}
            </div>
          </div>
          <div className="bg-white p-3.5 rounded border border-stone-200">
            <div className="flex items-center justify-between text-stone-500 mb-1">
              <span>Active Catalog</span>
              <Package className="w-3.5 h-3.5 text-stone-600" />
            </div>
            <div className="text-base font-semibold text-stone-900 tabular-nums">
              {products.length} Items
            </div>
          </div>
          <div className="bg-white p-3.5 rounded border border-stone-200">
            <div className="flex items-center justify-between text-stone-500 mb-1">
              <span>Low Inventory</span>
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div className="text-base font-semibold text-stone-900 tabular-nums">
              {lowStockCount} Items (≤5)
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-grow">
          {statusMessage && (
            <div className="mb-4 p-3 bg-amber-50 text-amber-800 text-xs rounded border border-amber-200">
              {statusMessage}
            </div>
          )}

          {/* TAB 1: PRODUCTS */}
          {activeTab === 'products' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-stone-900">
                  Catalog Inventory & Pricing Management
                </h3>
                <button
                  onClick={() => setIsCreatingProduct(!isCreatingProduct)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-stone-900 rounded hover:bg-stone-800 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isCreatingProduct ? 'Cancel' : 'Add New Product'}</span>
                </button>
              </div>

              {/* Create Product Form Drawer */}
              {isCreatingProduct && (
                <form
                  onSubmit={handleCreateProduct}
                  className="bg-stone-50 p-5 rounded-lg border border-stone-200 mb-6 text-xs space-y-4"
                >
                  <h4 className="font-semibold text-stone-900 uppercase text-[11px] tracking-wider">
                    New Product Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-stone-700 mb-1 font-medium">Name *</label>
                      <input
                        type="text"
                        required
                        value={newProductName}
                        onChange={(e) => setNewProductName(e.target.value)}
                        placeholder="e.g. Sculptural Ceramic Vessel"
                        className="w-full p-2 bg-white border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-stone-900"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 mb-1 font-medium">Category *</label>
                      <select
                        value={newProductCategory}
                        onChange={(e) => setNewProductCategory(e.target.value)}
                        className="w-full p-2 bg-white border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-stone-900"
                      >
                        <option value="Furniture">Furniture</option>
                        <option value="Lighting">Lighting</option>
                        <option value="Audio">Audio</option>
                        <option value="Watches">Watches</option>
                        <option value="Decor">Decor</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-stone-700 mb-1 font-medium">Price ($) *</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={newProductPrice}
                        onChange={(e) => setNewProductPrice(e.target.value)}
                        className="w-full p-2 bg-white border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-stone-900 tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 mb-1 font-medium">Initial Stock *</label>
                      <input
                        type="number"
                        required
                        value={newProductStock}
                        onChange={(e) => setNewProductStock(e.target.value)}
                        className="w-full p-2 bg-white border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-stone-900 tabular-nums"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-stone-700 mb-1 font-medium">Image URL *</label>
                      <input
                        type="text"
                        required
                        value={newProductImageUrl}
                        onChange={(e) => setNewProductImageUrl(e.target.value)}
                        placeholder="/images/nordic_chair.jpg"
                        className="w-full p-2 bg-white border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-stone-900 font-mono text-[11px]"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-stone-700 mb-1 font-medium">Description *</label>
                      <textarea
                        required
                        rows={2}
                        value={newProductDescription}
                        onChange={(e) => setNewProductDescription(e.target.value)}
                        placeholder="Detailed materials, craftsmanship notes, dimensions..."
                        className="w-full p-2 bg-white border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-stone-900"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsCreatingProduct(false)}
                      className="px-3 py-1.5 border border-stone-300 rounded text-stone-700 hover:bg-stone-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-stone-900 text-white rounded font-medium hover:bg-stone-800"
                    >
                      Publish to Catalog
                    </button>
                  </div>
                </form>
              )}

              {/* Products Table */}
              <div className="overflow-x-auto border border-stone-200 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-medium uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3">Object</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Price</th>
                      <th className="py-2.5 px-3">Stock</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {products.map((p) => {
                      const isEditing = editingProductId === p._id;
                      return (
                        <tr key={p._id} className="hover:bg-stone-50/70 transition-colors">
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2.5">
                              <div className="relative w-8 h-8 rounded bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                                <Image
                                  src={p.imageUrl}
                                  alt={p.name}
                                  fill
                                  className="object-cover"
                                  sizes="32px"
                                />
                              </div>
                              <span className="font-semibold text-stone-900 line-clamp-1">
                                {p.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-stone-600 uppercase text-[11px]">
                            {p.category}
                          </td>
                          <td className="py-2.5 px-3 font-medium tabular-nums text-stone-900">
                            {isEditing ? (
                              <input
                                type="number"
                                step="0.01"
                                value={editPriceVal}
                                onChange={(e) => setEditPriceVal(parseFloat(e.target.value) || 0)}
                                className="w-20 px-1 py-0.5 border border-stone-300 rounded font-mono"
                              />
                            ) : (
                              `$${p.price.toFixed(2)}`
                            )}
                          </td>
                          <td className="py-2.5 px-3">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editStockVal}
                                onChange={(e) => setEditStockVal(parseInt(e.target.value, 10) || 0)}
                                className="w-16 px-1 py-0.5 border border-stone-300 rounded font-mono"
                              />
                            ) : (
                              <span
                                className={`font-semibold tabular-nums ${
                                  p.stock <= 5 ? 'text-amber-700' : 'text-stone-900'
                                }`}
                              >
                                {p.stock} units
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            {isEditing ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleSaveProductEdit(p._id)}
                                  className="px-2 py-0.5 bg-emerald-700 text-white rounded text-[11px] font-medium"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingProductId(null)}
                                  className="px-2 py-0.5 border border-stone-300 rounded text-[11px]"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => {
                                    setEditingProductId(p._id);
                                    setEditStockVal(p.stock);
                                    setEditPriceVal(p.price);
                                  }}
                                  className="text-stone-500 hover:text-stone-900 p-1"
                                  title="Edit stock & price"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(p._id)}
                                  className="text-stone-400 hover:text-rose-600 p-1"
                                  title="Delete product"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS */}
          {activeTab === 'orders' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-stone-900">
                  Customer Orders & Fulfillment Workflow
                </h3>
                <span className="text-xs text-stone-500">
                  Cancelling an order automatically restores inventory stock.
                </span>
              </div>

              {orders.length === 0 ? (
                <div className="p-8 text-center text-xs text-stone-500 border border-stone-200 rounded">
                  No orders recorded in database yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      className="border border-stone-200 rounded-lg p-4 bg-stone-50/50 text-xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-2.5 mb-2.5">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-semibold text-stone-900">
                            {order.orderId}
                          </span>
                          <span className="text-stone-500 font-medium">
                            {order.customerName} ({order.phone})
                          </span>
                        </div>

                        {/* Status Transition Selector */}
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-stone-500">Update Status:</span>
                          <select
                            value={order.orderStatus}
                            onChange={(e) =>
                              handleUpdateOrderStatus(order.orderId, e.target.value as OrderStatus)
                            }
                            className="bg-white border border-stone-300 rounded px-2 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-stone-900"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled (Restores Stock)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold block mb-1">
                            Items Ordered ({order.items.reduce((s, i) => s + i.quantity, 0)})
                          </span>
                          <div className="space-y-1">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-stone-700">
                                <span>
                                  {item.quantity}x {item.name}
                                </span>
                                <span className="tabular-nums font-medium">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="border-t md:border-t-0 md:border-l border-stone-200 pt-2 md:pt-0 md:pl-4 text-stone-600">
                          <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold block mb-1">
                            Delivery Destination & Payment
                          </span>
                          <p>
                            {order.deliveryAddress.street}, {order.deliveryAddress.city}{' '}
                            {order.deliveryAddress.postalCode}
                          </p>
                          <div className="flex justify-between items-center mt-2 font-semibold text-stone-900">
                            <span>
                              {order.paymentMethod} ({order.paymentStatus})
                            </span>
                            <span className="tabular-nums text-sm">${order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SERVER & DB ARCHITECTURE */}
          {activeTab === 'server' && (
            <div className="space-y-6 text-xs text-stone-700">
              <div className="border border-stone-200 rounded-lg p-5 bg-stone-50">
                <h4 className="font-semibold text-stone-900 mb-2 text-sm flex items-center gap-2">
                  <Server className="w-4 h-4 text-stone-800" />
                  MongoDB Atlas & Mongoose Connection Specs
                </h4>
                <p className="mb-4 text-stone-600 leading-relaxed">
                  The application is engineered with a dual-mode persistence architecture:
                </p>
                <ul className="list-disc list-inside space-y-1.5 text-stone-600 mb-4 pl-1">
                  <li>
                    <strong>Active Sandbox Mode:</strong> Thread-safe in-memory database with pre-hashed bcrypt accounts and full Mongoose schema compliance. No external network credentials required for immediate testing.
                  </li>
                  <li>
                    <strong>Production MongoDB Atlas Mode:</strong> When you set{' '}
                    <code className="bg-stone-200 px-1 py-0.5 rounded font-mono text-[11px]">
                      MONGODB_URI
                    </code>{' '}
                    in your environment or <code className="bg-stone-200 px-1 py-0.5 rounded font-mono text-[11px]">.env</code>, the app connects directly to MongoDB Atlas cluster with automatic connection pooling and pre-save password hooks.
                  </li>
                </ul>

                <div className="p-3 bg-stone-900 text-stone-100 rounded font-mono text-[11px] overflow-x-auto">
                  MONGODB_URI=&quot;mongodb+srv://&lt;username&gt;:&lt;password&gt;@cluster0.mongodb.net/aura_ecommerce?retryWrites=true&amp;w=majority&quot;
                </div>
              </div>

              <div className="border border-stone-200 rounded-lg p-5 bg-white">
                <h4 className="font-semibold text-stone-900 mb-2 text-sm">
                  Standalone Express.js Backend Files
                </h4>
                <p className="text-stone-600 mb-3">
                  The complete backend codebase is organized in the <code className="font-mono bg-stone-100 px-1">/backend</code> folder:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px] text-stone-700">
                  <div className="p-2 bg-stone-50 rounded border border-stone-200">server.js (Express)</div>
                  <div className="p-2 bg-stone-50 rounded border border-stone-200">config/db.js</div>
                  <div className="p-2 bg-stone-50 rounded border border-stone-200">models/User.js</div>
                  <div className="p-2 bg-stone-50 rounded border border-stone-200">models/Product.js</div>
                  <div className="p-2 bg-stone-50 rounded border border-stone-200">models/Order.js</div>
                  <div className="p-2 bg-stone-50 rounded border border-stone-200">middleware/auth.js</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
