// AURA Craft & Design — Vanilla JS E-Commerce Frontend Client
(function () {
  const API_BASE = '/api';

  // Application State
  const state = {
    products: [],
    cart: JSON.parse(localStorage.getItem('aura_cart') || '[]'),
    activeCategory: 'all',
    searchQuery: '',
    sortBy: 'newest',
    authToken: localStorage.getItem('aura_token') || null,
    currentUser: JSON.parse(localStorage.getItem('aura_user') || 'null'),
  };

  // DOM Elements
  const productGrid = document.getElementById('product-grid');
  const cartBadge = document.getElementById('cart-badge');
  const cartBtn = document.getElementById('cart-btn');
  const cartDrawer = document.getElementById('cart-drawer');
  const closeCartBtn = document.getElementById('close-cart-btn');
  const cartItemsContainer = document.getElementById('cart-items');
  const cartSubtotalEl = document.getElementById('cart-subtotal');
  const checkoutTriggerBtn = document.getElementById('checkout-trigger-btn');
  const checkoutModal = document.getElementById('checkout-modal');
  const closeCheckoutBtn = document.getElementById('close-checkout-btn');
  const checkoutForm = document.getElementById('checkout-form');
  const categoryTabs = document.getElementById('category-tabs');
  const searchInput = document.getElementById('search-input');
  const sortSelect = document.getElementById('sort-select');
  const authBtn = document.getElementById('auth-btn');

  // Initialize
  function init() {
    setupEventListeners();
    updateCartUI();
    updateAuthUI();
    fetchProducts();
  }

  // Fetch Products from REST API
  async function fetchProducts() {
    try {
      productGrid.innerHTML = '<div class="loading-state">Loading objects...</div>';
      const params = new URLSearchParams();
      if (state.activeCategory !== 'all') params.append('category', state.activeCategory);
      if (state.searchQuery) params.append('search', state.searchQuery);
      if (state.sortBy) params.append('sort', state.sortBy);

      const res = await fetch(`${API_BASE}/products?${params.toString()}`);
      const data = await res.json();

      if (data.success && data.products) {
        state.products = data.products;
        renderProducts();
      } else {
        productGrid.innerHTML = '<div class="error-state">Failed to load products.</div>';
      }
    } catch (err) {
      productGrid.innerHTML = `<div class="error-state">Error connecting to API: ${err.message}</div>`;
    }
  }

  // Render Product Cards
  function renderProducts() {
    if (state.products.length === 0) {
      productGrid.innerHTML = '<div class="empty-state">No objects match your criteria.</div>';
      return;
    }

    productGrid.innerHTML = state.products
      .map((product) => {
        const inStock = product.stock > 0;
        return `
        <article class="product-card" data-id="${product._id}">
          <div class="product-image-wrap">
            <img src="${product.imageUrl}" alt="${product.name}" loading="lazy">
          </div>
          <div class="product-card-body">
            <div class="product-category-row">
              <span>${product.category.toUpperCase()}</span>
              <span>${inStock ? `${product.stock} available` : 'Out of stock'}</span>
            </div>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-desc">${product.description}</p>
            <div class="product-footer">
              <span class="product-price tabular">$${product.price.toFixed(2)}</span>
              <button class="btn btn-outline btn-add-cart" data-id="${product._id}" ${!inStock ? 'disabled' : ''}>
                ${inStock ? 'Add to Bag' : 'Sold Out'}
              </button>
            </div>
          </div>
        </article>
      `;
      })
      .join('');
  }

  // Add Item to Cart
  function addToCart(productId) {
    const product = state.products.find((p) => p._id === productId);
    if (!product || product.stock <= 0) return;

    const existingIndex = state.cart.findIndex((item) => item.product._id === productId);
    if (existingIndex > -1) {
      if (state.cart[existingIndex].quantity < product.stock) {
        state.cart[existingIndex].quantity += 1;
      } else {
        alert(`Cannot add more than available inventory (${product.stock}).`);
        return;
      }
    } else {
      state.cart.push({ product, quantity: 1 });
    }

    saveCart();
    updateCartUI();
    openCart();
  }

  function updateQuantity(productId, delta) {
    const item = state.cart.find((i) => i.product._id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      state.cart = state.cart.filter((i) => i.product._id !== productId);
    } else if (item.quantity > item.product.stock) {
      item.quantity = item.product.stock;
      alert(`Max available stock reached (${item.product.stock})`);
    }

    saveCart();
    updateCartUI();
  }

  function saveCart() {
    localStorage.setItem('aura_cart', JSON.stringify(state.cart));
  }

  function updateCartUI() {
    const totalCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalCount;

    const subtotal = state.cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;

    if (state.cart.length === 0) {
      cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your shopping bag is empty.</p>';
      checkoutTriggerBtn.disabled = true;
    } else {
      checkoutTriggerBtn.disabled = false;
      cartItemsContainer.innerHTML = state.cart
        .map(
          (item) => `
        <div class="cart-item-row" style="display:flex; gap:1rem; margin-bottom:1rem; border-bottom:1px solid #f5f5f4; padding-bottom:1rem;">
          <img src="${item.product.imageUrl}" alt="${item.product.name}" style="width:60px; height:60px; object-fit:cover; border-radius:4px;">
          <div style="flex-grow:1;">
            <div style="font-weight:600; font-size:0.9rem;">${item.product.name}</div>
            <div style="font-size:0.85rem; color:#78716c;" class="tabular">$${item.product.price.toFixed(2)}</div>
            <div style="display:flex; align-items:center; gap:0.5rem; margin-top:0.35rem;">
              <button class="btn btn-outline" style="padding:0.15rem 0.5rem;" onclick="window.auraApp.updateQuantity('${item.product._id}', -1)">-</button>
              <span class="tabular">${item.quantity}</span>
              <button class="btn btn-outline" style="padding:0.15rem 0.5rem;" onclick="window.auraApp.updateQuantity('${item.product._id}', 1)">+</button>
            </div>
          </div>
        </div>
      `
        )
        .join('');
    }
  }

  function openCart() {
    cartDrawer.classList.remove('hidden');
  }

  function closeCart() {
    cartDrawer.classList.add('hidden');
  }

  function updateAuthUI() {
    if (state.currentUser) {
      authBtn.textContent = state.currentUser.name.split(' ')[0];
    } else {
      authBtn.textContent = 'Sign In';
    }
  }

  // Place Order Handler
  async function handleCheckout(e) {
    e.preventDefault();

    if (state.cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    const payload = {
      customerName: document.getElementById('checkout-name').value,
      phone: document.getElementById('checkout-phone').value,
      deliveryAddress: {
        street: document.getElementById('checkout-street').value,
        city: document.getElementById('checkout-city').value,
        postalCode: document.getElementById('checkout-postal').value,
      },
      items: state.cart.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
      paymentMethod: 'Cash on Delivery',
    };

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (state.authToken) headers['Authorization'] = `Bearer ${state.authToken}`;

      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.order) {
        alert(`Order confirmed successfully!\nOrder ID: ${data.order.orderId}\nTotal: $${data.order.total.toFixed(2)}\nPayment: Cash on Delivery upon arrival.`);
        state.cart = [];
        saveCart();
        updateCartUI();
        checkoutModal.classList.add('hidden');
        closeCart();
        fetchProducts(); // Refresh stock counts
      } else {
        alert(`Order failed: ${data.message || 'Unknown error'}`);
      }
    } catch (err) {
      alert(`Network error: ${err.message}`);
    }
  }

  function setupEventListeners() {
    cartBtn.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);

    checkoutTriggerBtn.addEventListener('click', () => {
      closeCart();
      checkoutModal.classList.remove('hidden');
    });

    closeCheckoutBtn.addEventListener('click', () => {
      checkoutModal.classList.add('hidden');
    });

    checkoutForm.addEventListener('submit', handleCheckout);

    // Event delegation for Add to Cart
    productGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-add-cart');
      if (btn) {
        const id = btn.getAttribute('data-id');
        addToCart(id);
      }
    });

    // Category Tabs
    categoryTabs.addEventListener('click', (e) => {
      const tab = e.target.closest('.tab');
      if (!tab) return;
      categoryTabs.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      state.activeCategory = tab.getAttribute('data-category');
      fetchProducts();
    });

    // Search input
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        state.searchQuery = e.target.value.trim();
        fetchProducts();
      }, 300);
    });

    // Sort Select
    sortSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      fetchProducts();
    });
  }

  // Expose global methods for inline HTML onclick handlers
  window.auraApp = {
    updateQuantity,
  };

  document.addEventListener('DOMContentLoaded', init);
})();
