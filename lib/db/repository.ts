import mongoose from 'mongoose';
import { getDatabaseConnection } from './connection';
import UserModel from '../models/User';
import ProductModel from '../models/Product';
import OrderModel from '../models/Order';
import { IUser, IProduct, IOrder, OrderStatus, IOrderItem } from '../types';

// Pre-seeded hashed passwords (bcrypt for 'admin123456' and 'customer123')
const ADMIN_HASHED_PW = '$2b$10$9MVCWUscPWo3YhWugNpXnOXygmkHTx/Ov1o.sqVGnHoh.v7hhijoO'; // admin123456
const CUSTOMER_HASHED_PW = '$2b$10$ZXOAAmYDc79shM0y.Hn3TepB.lrPmIahYLEgxEBMG40xREZgcAncW'; // customer123

interface GlobalStore {
  _memoryUsers?: (IUser & { password: string })[];
  _memoryProducts?: IProduct[];
  _memoryOrders?: IOrder[];
}

const g = globalThis as unknown as GlobalStore;

if (!g._memoryUsers) {
  g._memoryUsers = [
    {
      _id: 'usr_admin_001',
      name: 'Administrator',
      email: 'admin@auracraft.com',
      password: ADMIN_HASHED_PW,
      role: 'admin',
      phone: '+1 (555) 019-2834',
      address: { street: '450 Design Avenue', city: 'San Francisco', postalCode: '94107' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'usr_cust_002',
      name: 'Jane Sterling',
      email: 'jane@example.com',
      password: CUSTOMER_HASHED_PW,
      role: 'customer',
      phone: '+1 (555) 723-9012',
      address: { street: '72 Nordic Way', city: 'Seattle', postalCode: '98101' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
}

if (!g._memoryProducts) {
  g._memoryProducts = [
    {
      _id: 'prod_watch_01',
      name: 'Aeterna Minimal Automatic Watch',
      slug: 'aeterna-minimal-automatic-watch',
      description:
        'Precision-engineered Swiss automatic movement encased in 316L brushed stainless steel, paired with hand-stitched full-grain Italian calfskin. Features scratch-resistant sapphire crystal glass and 50m water resistance.',
      price: 380,
      category: 'Watches',
      stock: 18,
      imageUrl: '/images/minimal_watch.jpg',
      featured: true,
      specs: {
        Movement: 'Automatic Calibre 2824',
        Case: '316L Marine-Grade Stainless Steel',
        Diameter: '39mm',
        Strap: 'Handcrafted Italian Calfskin',
        Glass: 'Double-Domed Sapphire Crystal',
      },
      rating: { average: 4.9, count: 28 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'prod_audio_02',
      name: 'Aura Studio Acoustic Wireless Headphones',
      slug: 'aura-studio-acoustic-wireless-headphones',
      description:
        'Bespoke 45mm neodymium dynamic drivers tuned for acoustic linearity, with tactile anodized brass hardware and plush lambskin memory foam. Engineered for discerning audiophiles with 40-hour battery life.',
      price: 295,
      category: 'Audio',
      stock: 24,
      imageUrl: '/images/acoustic_headphones.jpg',
      featured: true,
      specs: {
        Drivers: '45mm Custom Neodymium',
        Battery: '40 Hours Playback',
        Connectivity: 'Bluetooth 5.3 + 3.5mm Analog',
        Materials: 'Anodized Brass & Lambskin',
        Weight: '275g',
      },
      rating: { average: 4.8, count: 42 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'prod_chair_03',
      name: 'Nordic Boucle & Oak Sculptural Lounge Chair',
      slug: 'nordic-boucle-oak-sculptural-lounge-chair',
      description:
        'Steam-bent European solid white oak frame with hand-finished joinery, upholstered in tactile textured virgin wool-blend boucle. Ergonomically contoured for enduring fireside or reading room comfort.',
      price: 740,
      category: 'Furniture',
      stock: 7,
      imageUrl: '/images/nordic_chair.jpg',
      featured: true,
      specs: {
        Frame: 'FSC-Certified Solid European Oak',
        Upholstery: 'Heavyweight Virgin Wool Boucle',
        Dimensions: '78cm W x 82cm D x 74cm H',
        Joinery: 'Traditional Mortise & Tenon',
        Origin: 'Copenhagen, Denmark',
      },
      rating: { average: 5.0, count: 19 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'prod_lamp_04',
      name: 'Raw Travertine Sculptural Ceramic Table Lamp',
      slug: 'raw-travertine-sculptural-ceramic-table-lamp',
      description:
        'Hand-thrown coarse stoneware ceramic shade with organic texturing, resting upon a hone-finished natural Italian travertine pedestal. Casts an intimate, warm 2700K ambient glow.',
      price: 190,
      category: 'Lighting',
      stock: 15,
      imageUrl: '/images/ceramic_lamp.jpg',
      featured: false,
      specs: {
        Material: 'Textured Stoneware & Natural Travertine',
        Bulb: 'Warm E26 LED (Included, 2700K)',
        Cord: '2.0m Braided Linen Cable with Brass Switch',
        Dimensions: '24cm Diameter x 32cm Height',
      },
      rating: { average: 4.7, count: 16 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'prod_table_05',
      name: 'Fjord Minimalist Solid Oak Dining Table',
      slug: 'fjord-minimalist-solid-oak-dining-table',
      description:
        'Architectural dining centerpiece crafted from sustainably harvested European white oak with soft radius beveling and invisible matte polyurethane sealant. Comfortably seats six to eight guests.',
      price: 1120,
      category: 'Furniture',
      stock: 4,
      imageUrl: '/images/hero_store.jpg',
      featured: false,
      specs: {
        Wood: 'Solid White Oak (Grade A)',
        Finish: 'Matte Natural Sealant (Zero VOC)',
        Dimensions: '200cm L x 90cm W x 75cm H',
        Capacity: '6-8 Guests',
      },
      rating: { average: 4.9, count: 11 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
}

if (!g._memoryOrders) {
  g._memoryOrders = [
    {
      _id: 'ord_demo_101',
      orderId: 'ORD-8921-X',
      user: 'usr_cust_002',
      customerName: 'Jane Sterling',
      phone: '+1 (555) 723-9012',
      deliveryAddress: {
        street: '72 Nordic Way',
        city: 'Seattle',
        postalCode: '98101',
      },
      items: [
        {
          product: 'prod_audio_02',
          name: 'Aura Studio Acoustic Wireless Headphones',
          price: 295,
          quantity: 1,
          imageUrl: '/images/acoustic_headphones.jpg',
        },
      ],
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Pending',
      orderStatus: 'Processing',
      subtotal: 295,
      shippingFee: 0,
      tax: 0,
      total: 295,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ];
}

const memoryUsers = g._memoryUsers;
const memoryProducts = g._memoryProducts;
const memoryOrders = g._memoryOrders;

// Helper to sanitize User object for API responses
export function sanitizeUser(user: (IUser & { password?: string }) | null): IUser | null {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser as IUser;
}

// Convert Mongoose Documents to Plain Types
function toPlainUser(doc: unknown): IUser & { password?: string } {
  const d = doc as { toObject?: () => Record<string, unknown> } & Record<string, unknown>;
  const obj = d && typeof d.toObject === 'function' ? d.toObject() : d;
  return {
    ...obj,
    _id: String(obj._id),
  } as IUser & { password?: string };
}

function toPlainProduct(doc: unknown): IProduct {
  const d = doc as { toObject?: () => Record<string, unknown> } & Record<string, unknown>;
  const obj = d && typeof d.toObject === 'function' ? d.toObject() : d;
  return {
    ...obj,
    _id: String(obj._id),
  } as IProduct;
}

function toPlainOrder(doc: unknown): IOrder {
  const d = doc as { toObject?: () => Record<string, unknown> } & Record<string, unknown>;
  const obj = d && typeof d.toObject === 'function' ? d.toObject() : d;
  const items = Array.isArray(obj.items) ? obj.items : [];
  return {
    ...obj,
    _id: String(obj._id),
    user: String(obj.user),
    items: items.map((it: Record<string, unknown>) => ({
      ...it,
      product: String(it.product),
    })),
  } as unknown as IOrder;
}

let hasAttemptedAtlasSeed = false;

async function ensureAtlasSeedData() {
  if (hasAttemptedAtlasSeed) return;
  try {
    const productCount = await ProductModel.countDocuments();
    if (productCount === 0) {
      console.log('[Seed] Auto-populating initial products into MongoDB Atlas...');
      await ProductModel.insertMany([
        {
          name: 'Aeterna Minimal Automatic Watch',
          slug: 'aeterna-minimal-automatic-watch',
          description:
            'Precision-engineered Swiss automatic movement encased in 316L brushed stainless steel, paired with hand-stitched full-grain Italian calfskin. Features scratch-resistant sapphire crystal glass and 50m water resistance.',
          price: 380,
          category: 'Watches',
          stock: 18,
          imageUrl: '/images/minimal_watch.jpg',
          featured: true,
          specs: {
            Movement: 'Automatic Calibre 2824',
            Case: '316L Marine-Grade Stainless Steel',
            Diameter: '39mm',
            Strap: 'Handcrafted Italian Calfskin',
            Glass: 'Double-Domed Sapphire Crystal',
          },
          rating: { average: 4.9, count: 28 },
        },
        {
          name: 'Aura Studio Acoustic Wireless Headphones',
          slug: 'aura-studio-acoustic-wireless-headphones',
          description:
            'Bespoke 45mm neodymium dynamic drivers tuned for acoustic linearity, with tactile anodized brass hardware and plush lambskin memory foam. Engineered for discerning audiophiles with 40-hour battery life.',
          price: 295,
          category: 'Audio',
          stock: 24,
          imageUrl: '/images/acoustic_headphones.jpg',
          featured: true,
          specs: {
            Drivers: '45mm Custom Neodymium',
            Battery: '40 Hours Playback',
            Connectivity: 'Bluetooth 5.3 + 3.5mm Analog',
            Materials: 'Anodized Brass & Lambskin',
            Weight: '275g',
          },
          rating: { average: 4.8, count: 42 },
        },
        {
          name: 'Nordic Boucle & Oak Sculptural Lounge Chair',
          slug: 'nordic-boucle-oak-sculptural-lounge-chair',
          description:
            'Steam-bent European solid white oak frame with hand-finished joinery, upholstered in tactile textured virgin wool-blend boucle. Ergonomically contoured for enduring fireside or reading room comfort.',
          price: 740,
          category: 'Furniture',
          stock: 7,
          imageUrl: '/images/nordic_chair.jpg',
          featured: true,
          specs: {
            Frame: 'FSC-Certified Solid European Oak',
            Upholstery: 'Heavyweight Virgin Wool Boucle',
            Dimensions: '78cm W x 82cm D x 74cm H',
            Joinery: 'Traditional Mortise & Tenon',
            Origin: 'Copenhagen, Denmark',
          },
          rating: { average: 5.0, count: 19 },
        },
        {
          name: 'Raw Travertine Sculptural Ceramic Table Lamp',
          slug: 'raw-travertine-sculptural-ceramic-table-lamp',
          description:
            'Hand-thrown coarse stoneware ceramic shade with organic texturing, resting upon a hone-finished natural Italian travertine pedestal. Casts an intimate, warm 2700K ambient glow.',
          price: 190,
          category: 'Lighting',
          stock: 15,
          imageUrl: '/images/ceramic_lamp.jpg',
          featured: false,
          specs: {
            Material: 'Textured Stoneware & Natural Travertine',
            Bulb: 'Warm E26 LED (Included, 2700K)',
            Cord: '2.0m Braided Linen Cable with Brass Switch',
            Dimensions: '24cm Diameter x 32cm Height',
          },
          rating: { average: 4.7, count: 16 },
        },
        {
          name: 'Fjord Minimalist Solid Oak Dining Table',
          slug: 'fjord-minimalist-solid-oak-dining-table',
          description:
            'Architectural dining centerpiece crafted from sustainably harvested European white oak with soft radius beveling and invisible matte polyurethane sealant. Comfortably seats six to eight guests.',
          price: 1120,
          category: 'Furniture',
          stock: 4,
          imageUrl: '/images/hero_store.jpg',
          featured: false,
          specs: {
            Wood: 'Solid White Oak (Grade A)',
            Finish: 'Matte Natural Sealant (Zero VOC)',
            Dimensions: '200cm L x 90cm W x 75cm H',
            Capacity: '6-8 Guests',
          },
          rating: { average: 4.9, count: 11 },
        },
      ]);
    }

    const userCount = await UserModel.countDocuments();
    if (userCount === 0) {
      console.log('[Seed] Auto-populating initial admin and customer into MongoDB Atlas...');
      await UserModel.collection.insertMany([
        {
          name: 'Administrator',
          email: 'admin@auracraft.com',
          password: ADMIN_HASHED_PW,
          role: 'admin',
          phone: '+1 (555) 019-2834',
          address: { street: '450 Design Avenue', city: 'San Francisco', postalCode: '94107' },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Jane Sterling',
          email: 'jane@example.com',
          password: CUSTOMER_HASHED_PW,
          role: 'customer',
          phone: '+1 (555) 723-9012',
          address: { street: '72 Nordic Way', city: 'Seattle', postalCode: '98101' },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }
    hasAttemptedAtlasSeed = true;
  } catch (err) {
    console.warn('[Seed] Could not auto-seed Atlas collections:', err);
  }
}

export const Repository = {
  // DB status check
  async getStatus() {
    return getDatabaseConnection();
  },

  // USERS
  async findUserByEmail(email: string): Promise<(IUser & { password?: string }) | null> {
    const conn = await getDatabaseConnection();
    if (conn.isConnected && mongoose.connection.readyState === 1) {
      try {
        await ensureAtlasSeedData();
        const user = await UserModel.findOne({ email: email.toLowerCase() }).select('+password');
        if (user) return toPlainUser(user);
      } catch (err) {
        console.warn('[Repository] Mongoose findUserByEmail error, falling back to memory store:', err);
      }
    }
    const found = memoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    return found ? { ...found } : null;
  },

  async findUserById(id: string): Promise<IUser | null> {
    const conn = await getDatabaseConnection();
    if (conn.isConnected && mongoose.connection.readyState === 1) {
      try {
        const user = await UserModel.findById(id);
        if (user) return sanitizeUser(toPlainUser(user));
      } catch (err) {
        console.warn('[Repository] Mongoose findUserById error, falling back to memory store:', err);
      }
    }
    const found = memoryUsers.find((u) => u._id === id);
    return sanitizeUser(found || null);
  },

  async createUser(userData: {
    name: string;
    email: string;
    passwordHash: string;
    role?: 'customer' | 'admin';
    phone?: string;
    address?: { street?: string; city?: string; postalCode?: string };
  }): Promise<IUser> {
    const conn = await getDatabaseConnection();
    if (conn.isConnected && mongoose.connection.readyState === 1) {
      try {
        const newUser = new UserModel({
          name: userData.name,
          email: userData.email.toLowerCase(),
          password: userData.passwordHash,
          role: userData.role || 'customer',
          phone: userData.phone || '',
          address: userData.address || {},
        });
        await newUser.save();
        const plain = toPlainUser(newUser);
        return sanitizeUser(plain)!;
      } catch (err) {
        console.warn('[Repository] Mongoose createUser error, falling back to memory store:', err);
      }
    }

    const newUser: IUser & { password: string } = {
      _id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: userData.passwordHash,
      role: userData.role || 'customer',
      phone: userData.phone || '',
      address: userData.address || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    memoryUsers.push(newUser);
    return sanitizeUser(newUser)!;
  },

  // PRODUCTS
  async getProducts(params?: {
    search?: string;
    category?: string;
    sort?: string;
    limit?: number;
  }): Promise<IProduct[]> {
    const conn = await getDatabaseConnection();
    if (conn.isConnected && mongoose.connection.readyState === 1) {
      try {
        await ensureAtlasSeedData();
        const query: Record<string, unknown> = {};
        if (params?.category && params.category !== 'all') {
          query.category = { $regex: new RegExp(`^${params.category}$`, 'i') };
        }
        if (params?.search) {
          query.$or = [
            { name: { $regex: params.search, $options: 'i' } },
            { description: { $regex: params.search, $options: 'i' } },
          ];
        }

        let mQuery = ProductModel.find(query);
        if (params?.sort === 'price_asc') mQuery = mQuery.sort({ price: 1 });
        else if (params?.sort === 'price_desc') mQuery = mQuery.sort({ price: -1 });
        else mQuery = mQuery.sort({ createdAt: -1 });

        if (params?.limit) mQuery = mQuery.limit(params.limit);
        const results = await mQuery.exec();
        return results.map((r) => toPlainProduct(r));
      } catch (err) {
        console.warn('[Repository] Mongoose getProducts error, falling back to memory store:', err);
      }
    }

    let items = [...memoryProducts];

    if (params?.category && params.category !== 'all') {
      items = items.filter(
        (p) => p.category.toLowerCase() === params.category!.toLowerCase()
      );
    }

    if (params?.search) {
      const q = params.search.toLowerCase();
      items = items.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    if (params?.sort === 'price_asc') {
      items.sort((a, b) => a.price - b.price);
    } else if (params?.sort === 'price_desc') {
      items.sort((a, b) => b.price - a.price);
    } else {
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    if (params?.limit) {
      items = items.slice(0, params.limit);
    }

    return items;
  },

  async getProductById(id: string): Promise<IProduct | null> {
    const conn = await getDatabaseConnection();
    if (conn.isConnected && mongoose.connection.readyState === 1) {
      try {
        const prod = await ProductModel.findById(id);
        if (prod) return toPlainProduct(prod);
      } catch (err) {
        console.warn('[Repository] Mongoose getProductById error, falling back to memory store:', err);
      }
    }
    const found = memoryProducts.find((p) => p._id === id);
    return found ? { ...found } : null;
  },

  async createProduct(data: Partial<IProduct>): Promise<IProduct> {
    const conn = await getDatabaseConnection();
    if (conn.isConnected && mongoose.connection.readyState === 1) {
      try {
        const newProd = new ProductModel({
          ...data,
          slug: data.slug || data.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        });
        await newProd.save();
        return toPlainProduct(newProd);
      } catch (err) {
        console.warn('[Repository] Mongoose createProduct error, falling back to memory store:', err);
      }
    }

    const newProd: IProduct = {
      _id: `prod_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: data.name || 'Untitled Product',
      slug: data.slug || data.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'product',
      description: data.description || '',
      price: Number(data.price) || 0,
      category: data.category || 'General',
      stock: Number(data.stock) || 0,
      imageUrl: data.imageUrl || '/images/hero_store.jpg',
      featured: Boolean(data.featured),
      specs: data.specs || {},
      rating: { average: 5.0, count: 1 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    memoryProducts.unshift(newProd);
    return newProd;
  },

  async updateProduct(id: string, updates: Partial<IProduct>): Promise<IProduct | null> {
    const conn = await getDatabaseConnection();
    if (conn.isConnected && mongoose.connection.readyState === 1) {
      try {
        const updated = await ProductModel.findByIdAndUpdate(id, { $set: updates }, { new: true });
        if (updated) return toPlainProduct(updated);
      } catch (err) {
        console.warn('[Repository] Mongoose updateProduct error, falling back to memory store:', err);
      }
    }

    const index = memoryProducts.findIndex((p) => p._id === id);
    if (index === -1) return null;
    memoryProducts[index] = {
      ...memoryProducts[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return memoryProducts[index];
  },

  async deleteProduct(id: string): Promise<boolean> {
    const conn = await getDatabaseConnection();
    if (conn.isConnected && mongoose.connection.readyState === 1) {
      try {
        const res = await ProductModel.findByIdAndDelete(id);
        if (res) return true;
      } catch (err) {
        console.warn('[Repository] Mongoose deleteProduct error, falling back to memory store:', err);
      }
    }

    const index = memoryProducts.findIndex((p) => p._id === id);
    if (index === -1) return false;
    memoryProducts.splice(index, 1);
    return true;
  },

  // ORDERS
  async createOrder(orderInput: {
    userId: string;
    customerName: string;
    phone: string;
    deliveryAddress: { street: string; city: string; postalCode: string };
    items: { product: string; quantity: number }[];
    paymentMethod?: 'Cash on Delivery' | 'Credit / Debit Card';
  }): Promise<{ order?: IOrder; error?: string }> {
    // 1. Safe server-side validation: verify items and check inventory
    const orderItems: IOrderItem[] = [];
    let calculatedSubtotal = 0;

    for (const item of orderInput.items) {
      const product = await this.getProductById(item.product);
      if (!product) {
        return { error: `Product with ID ${item.product} does not exist.` };
      }
      if (product.stock < item.quantity) {
        return {
          error: `Insufficient inventory for "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}.`,
        };
      }
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        imageUrl: product.imageUrl,
      });
      calculatedSubtotal += product.price * item.quantity;
    }

    // 2. Safe inventory deduction
    for (const item of orderInput.items) {
      const product = await this.getProductById(item.product);
      if (product) {
        const newStock = Math.max(0, product.stock - item.quantity);
        await this.updateProduct(product._id, { stock: newStock });
      }
    }

    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}`;
    const shippingFee = calculatedSubtotal >= 500 ? 0 : 25; // Free shipping above $500
    const tax = Math.round(calculatedSubtotal * 0.08 * 100) / 100; // 8% tax
    const total = Math.round((calculatedSubtotal + shippingFee + tax) * 100) / 100;

    const conn = await getDatabaseConnection();
    if (conn.isConnected && mongoose.connection.readyState === 1) {
      try {
        const newOrder = new OrderModel({
          orderId,
          user: orderInput.userId,
          customerName: orderInput.customerName,
          phone: orderInput.phone,
          deliveryAddress: orderInput.deliveryAddress,
          items: orderItems,
          paymentMethod: orderInput.paymentMethod || 'Cash on Delivery',
          paymentStatus: 'Pending',
          orderStatus: 'Pending',
          subtotal: calculatedSubtotal,
          shippingFee,
          tax,
          total,
        });
        await newOrder.save();
        return { order: toPlainOrder(newOrder) };
      } catch (err) {
        console.warn('[Repository] Mongoose createOrder error, falling back to memory store:', err);
      }
    }

    const inMemoryOrder: IOrder = {
      _id: `ord_${Date.now()}`,
      orderId,
      user: orderInput.userId,
      customerName: orderInput.customerName,
      phone: orderInput.phone,
      deliveryAddress: orderInput.deliveryAddress,
      items: orderItems,
      paymentMethod: orderInput.paymentMethod || 'Cash on Delivery',
      paymentStatus: 'Pending',
      orderStatus: 'Pending',
      subtotal: calculatedSubtotal,
      shippingFee,
      tax,
      total,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    memoryOrders.unshift(inMemoryOrder);
    return { order: inMemoryOrder };
  },

  async getMyOrders(userId: string): Promise<IOrder[]> {
    const conn = await getDatabaseConnection();
    if (conn.isConnected && mongoose.connection.readyState === 1) {
      try {
        const orders = await OrderModel.find({ user: userId }).sort({ createdAt: -1 });
        return orders.map((o) => toPlainOrder(o));
      } catch (err) {
        console.warn('[Repository] Mongoose getMyOrders error, falling back to memory store:', err);
      }
    }
    return memoryOrders.filter((o) => o.user === userId);
  },

  async getOrderById(idOrOrderId: string): Promise<IOrder | null> {
    const conn = await getDatabaseConnection();
    if (conn.isConnected && mongoose.connection.readyState === 1) {
      try {
        const order = await OrderModel.findOne({
          $or: [{ _id: idOrOrderId }, { orderId: idOrOrderId }],
        });
        if (order) return toPlainOrder(order);
      } catch (err) {
        console.warn('[Repository] Mongoose getOrderById error, falling back to memory store:', err);
      }
    }
    const found = memoryOrders.find(
      (o) => o._id === idOrOrderId || o.orderId === idOrOrderId
    );
    return found ? { ...found } : null;
  },

  async getAllOrders(): Promise<IOrder[]> {
    const conn = await getDatabaseConnection();
    if (conn.isConnected && mongoose.connection.readyState === 1) {
      try {
        const orders = await OrderModel.find({}).sort({ createdAt: -1 });
        return orders.map((o) => toPlainOrder(o));
      } catch (err) {
        console.warn('[Repository] Mongoose getAllOrders error, falling back to memory store:', err);
      }
    }
    return [...memoryOrders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async updateOrderStatus(idOrOrderId: string, status: OrderStatus): Promise<IOrder | null> {
    const conn = await getDatabaseConnection();
    if (conn.isConnected && mongoose.connection.readyState === 1) {
      try {
        const order = await OrderModel.findOne({
          $or: [{ _id: idOrOrderId }, { orderId: idOrOrderId }],
        });
        if (order) {
          // If cancelling, restore product stock
          if (status === 'Cancelled' && order.orderStatus !== 'Cancelled') {
            for (const item of order.items) {
              const prod = await ProductModel.findById(item.product);
              if (prod) {
                prod.stock += item.quantity;
                await prod.save();
              }
            }
          }

          order.orderStatus = status;
          await order.save();
          return toPlainOrder(order);
        }
      } catch (err) {
        console.warn('[Repository] Mongoose updateOrderStatus error, falling back to memory store:', err);
      }
    }

    const order = memoryOrders.find(
      (o) => o._id === idOrOrderId || o.orderId === idOrOrderId
    );
    if (!order) return null;

    // Restore stock if cancelled
    if (status === 'Cancelled' && order.orderStatus !== 'Cancelled') {
      for (const item of order.items) {
        const prod = memoryProducts.find((p) => p._id === item.product);
        if (prod) {
          prod.stock += item.quantity;
        }
      }
    }

    order.orderStatus = status;
    order.updatedAt = new Date().toISOString();
    return { ...order };
  },
};
