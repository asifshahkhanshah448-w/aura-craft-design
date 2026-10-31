'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ProductCatalog from '@/components/ProductCatalog';
import ProductDetailModal from '@/components/ProductDetailModal';
import CartDrawer from '@/components/CartDrawer';
import CheckoutModal from '@/components/CheckoutModal';
import AuthModal from '@/components/AuthModal';
import OrderHistoryModal from '@/components/OrderHistoryModal';
import AdminDashboardModal from '@/components/AdminDashboardModal';
import ApiDocDrawer from '@/components/ApiDocDrawer';
import Footer from '@/components/Footer';
import { IProduct, ICartItem, IUser, IOrder } from '@/lib/types';

export default function HomePage() {
  // Products state
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<string[]>(['all', 'Furniture', 'Lighting', 'Audio', 'Watches']);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);

  // Selected product for detail modal
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

  // Cart state (persisted in localStorage)
  const [cartItems, setCartItems] = useState<ICartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('aura_cart');
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  // Auth state
  const [authToken, setAuthToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem('aura_token') || null;
      } catch {
        return null;
      }
    }
    return null;
  });

  const [currentUser, setCurrentUser] = useState<IUser | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const u = localStorage.getItem('aura_user');
        return u ? JSON.parse(u) : null;
      } catch {
        return null;
      }
    }
    return null;
  });

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isApiDocsOpen, setIsApiDocsOpen] = useState(false);

  // System & DB mode
  const [dbMode, setDbMode] = useState<string>('Mongoose / Dual-Mode');

  useEffect(() => {
    // Health check for DB mode
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data.database) {
          setDbMode(data.database.isConnected ? 'MongoDB Atlas Connected' : 'Local Storage Mode');
        }
      })
      .catch(() => {});
  }, []);

  // Sync cart to localStorage
  const saveCart = (newItems: ICartItem[]) => {
    setCartItems(newItems);
    try {
      localStorage.setItem('aura_cart', JSON.stringify(newItems));
    } catch {
      // safe fallback
    }
  };

  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  // Fetch Products
  useEffect(() => {
    let cancelled = false;
    const fetchCatalog = async () => {
      try {
        const params = new URLSearchParams();
        if (activeCategory !== 'all') params.append('category', activeCategory);
        if (searchQuery) params.append('search', searchQuery);
        if (sortBy) params.append('sort', sortBy);

        const res = await fetch(`/api/products?${params.toString()}`);
        const data = await res.json();
        if (!cancelled && data.success && data.products) {
          setProducts(data.products);

          // Dynamically compute unique categories
          const rawCats: string[] = data.products.map((p: IProduct) => p.category);
          const unique = Array.from(new Set(rawCats));
          setCategories(['all', ...unique]);
        }
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        if (!cancelled) {
          setIsLoadingProducts(false);
        }
      }
    };
    fetchCatalog();
    return () => {
      cancelled = true;
    };
  }, [activeCategory, searchQuery, sortBy, refreshTrigger]);

  const loadProducts = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // Cart operations
  const handleAddToCart = (product: IProduct, quantity: number = 1) => {
    if (product.stock <= 0) return;

    const existingIndex = cartItems.findIndex((item) => item.product._id === product._id);
    let updated: ICartItem[];

    if (existingIndex > -1) {
      updated = [...cartItems];
      const newQty = updated[existingIndex].quantity + quantity;
      if (newQty > product.stock) {
        alert(`Cannot add more than available stock (${product.stock} units).`);
        return;
      }
      updated[existingIndex].quantity = newQty;
    } else {
      updated = [...cartItems, { product, quantity: Math.min(quantity, product.stock) }];
    }

    saveCart(updated);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    const updated = cartItems
      .map((item) => {
        if (item.product._id === productId) {
          const newQty = item.quantity + delta;
          if (newQty > item.product.stock) {
            alert(`Maximum available stock is ${item.product.stock} units.`);
            return item;
          }
          return { ...item, quantity: newQty };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);

    saveCart(updated);
  };

  const handleRemoveFromCart = (productId: string) => {
    const updated = cartItems.filter((item) => item.product._id !== productId);
    saveCart(updated);
  };

  // Auth handlers
  const handleAuthSuccess = (token: string, user: IUser) => {
    setAuthToken(token);
    setCurrentUser(user);
    try {
      localStorage.setItem('aura_token', token);
      localStorage.setItem('aura_user', JSON.stringify(user));
    } catch {
      // safe fallback
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    setCurrentUser(null);
    try {
      localStorage.removeItem('aura_token');
      localStorage.removeItem('aura_user');
    } catch {
      // safe fallback
    }
  };

  // Order success handler
  const handleOrderSuccess = (order: IOrder) => {
    // Clear cart
    saveCart([]);
    // Refresh products to show updated inventory stock
    loadProducts();
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 selection:bg-stone-900 selection:text-stone-50">
      {/* 3-Zone Top Navigation Bar */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenApiDocs={() => setIsApiDocsOpen(true)}
      />

      {/* Main Page Body */}
      <main className="flex-grow">
        {/* Hero Section */}
        <Hero
          onExplore={() => {
            const catalogEl = document.getElementById('catalog');
            catalogEl?.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenApiDocs={() => setIsApiDocsOpen(true)}
          dbMode={dbMode}
        />

        {/* Curated Product Catalog Section */}
        <ProductCatalog
          products={products}
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onAddToCart={(p) => handleAddToCart(p, 1)}
          onSelectProduct={(p) => setSelectedProduct(p)}
          isLoading={isLoadingProducts}
        />

        {/* Craftsmanship & Editorial Story Section */}
        <section id="craftsmanship" className="border-t border-stone-200 bg-white py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold block mb-2">
                The Workshop Standard
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight leading-snug">
                Restraint over novelty. Precision joinery and enduring materials.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs text-stone-600 leading-relaxed">
              <div className="p-6 bg-stone-50 rounded-lg border border-stone-200">
                <span className="font-semibold text-stone-900 text-sm block mb-2">
                  01. Sourced Timber & Travertine
                </span>
                <p>
                  We partner exclusively with FSC-certified forestry cooperatives across Denmark and
                  Sweden. Each dining surface and frame is milled from solid white oak, finished with
                  organic vegetable oils that patina richly over decades.
                </p>
              </div>

              <div className="p-6 bg-stone-50 rounded-lg border border-stone-200">
                <span className="font-semibold text-stone-900 text-sm block mb-2">
                  02. Acoustic & Horological Engineering
                </span>
                <p>
                  From custom 45mm neodymium dynamic drivers with brass acoustic chambers to Swiss
                  calibre 2824 automatic movements, our technical pieces balance mechanical durability
                  with understated tactile warmth.
                </p>
              </div>

              <div className="p-6 bg-stone-50 rounded-lg border border-stone-200">
                <span className="font-semibold text-stone-900 text-sm block mb-2">
                  03. Safe Order Fulfillment & COD
                </span>
                <p>
                  Every order is protected by server-side price validation, instant inventory
                  reservation, and flexible Cash on Delivery with full door-to-door courier verification.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        authToken={authToken}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Order History Modal */}
      <OrderHistoryModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        authToken={authToken}
        onRequireAuth={() => setIsAuthOpen(true)}
      />

      {/* Admin Dashboard Modal */}
      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        authToken={authToken}
        onRefreshProducts={loadProducts}
      />

      {/* API & DB Health Drawer */}
      <ApiDocDrawer isOpen={isApiDocsOpen} onClose={() => setIsApiDocsOpen(false)} />

      {/* Footer */}
      <Footer
        onOpenApiDocs={() => setIsApiDocsOpen(true)}
        onOpenAdmin={() => {
          if (currentUser?.role === 'admin') {
            setIsAdminOpen(true);
          } else {
            setIsAuthOpen(true);
          }
        }}
      />
    </div>
  );
}
