const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123456', salt);
    const customerPassword = await bcrypt.hash('customer123', salt);

    const users = await User.insertMany([
      {
        name: 'Administrator',
        email: 'admin@auracraft.com',
        password: adminPassword,
        role: 'admin',
        phone: '+1 (555) 019-2834',
        address: { street: '450 Design Avenue', city: 'San Francisco', postalCode: '94107' },
      },
      {
        name: 'Jane Sterling',
        email: 'jane@example.com',
        password: customerPassword,
        role: 'customer',
        phone: '+1 (555) 723-9012',
        address: { street: '72 Nordic Way', city: 'Seattle', postalCode: '98101' },
      },
    ]);

    const adminUser = users[0]._id;

    await Product.insertMany([
      {
        name: 'Aeterna Minimal Automatic Watch',
        slug: 'aeterna-minimal-automatic-watch',
        description: 'Precision-engineered Swiss automatic movement encased in 316L brushed stainless steel, paired with hand-stitched full-grain Italian calfskin.',
        price: 380,
        category: 'Watches',
        stock: 18,
        imageUrl: '/images/minimal_watch.jpg',
        featured: true,
        specs: { Movement: 'Automatic Calibre 2824', Case: '316L Stainless Steel', Diameter: '39mm' },
      },
      {
        name: 'Aura Studio Acoustic Wireless Headphones',
        slug: 'aura-studio-acoustic-wireless-headphones',
        description: 'Bespoke 45mm neodymium dynamic drivers tuned for acoustic linearity, with tactile anodized brass hardware and plush lambskin memory foam.',
        price: 295,
        category: 'Audio',
        stock: 24,
        imageUrl: '/images/acoustic_headphones.jpg',
        featured: true,
        specs: { Drivers: '45mm Custom Neodymium', Battery: '40 Hours Playback' },
      },
      {
        name: 'Nordic Boucle & Oak Sculptural Lounge Chair',
        slug: 'nordic-boucle-oak-sculptural-lounge-chair',
        description: 'Steam-bent European solid white oak frame with hand-finished joinery, upholstered in tactile textured virgin wool-blend boucle.',
        price: 740,
        category: 'Furniture',
        stock: 7,
        imageUrl: '/images/nordic_chair.jpg',
        featured: true,
        specs: { Frame: 'Solid European Oak', Upholstery: 'Virgin Wool Boucle' },
      },
      {
        name: 'Raw Travertine Sculptural Ceramic Table Lamp',
        slug: 'raw-travertine-sculptural-ceramic-table-lamp',
        description: 'Hand-thrown coarse stoneware ceramic shade with organic texturing, casting an intimate, warm 2700K ambient glow.',
        price: 190,
        category: 'Lighting',
        stock: 15,
        imageUrl: '/images/ceramic_lamp.jpg',
        featured: false,
        specs: { Material: 'Stoneware & Travertine', Bulb: 'Warm E26 LED' },
      },
      {
        name: 'Fjord Minimalist Solid Oak Dining Table',
        slug: 'fjord-minimalist-solid-oak-dining-table',
        description: 'Architectural dining centerpiece crafted from sustainably harvested European white oak with soft radius beveling.',
        price: 1120,
        category: 'Furniture',
        stock: 4,
        imageUrl: '/images/hero_store.jpg',
        featured: false,
        specs: { Wood: 'Solid White Oak', Capacity: '6-8 Guests' },
      },
    ]);

    console.log('[Seed] Data successfully imported into MongoDB Atlas!');
    process.exit();
  } catch (error) {
    console.error(`[Seed Error] ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('[Seed] Data successfully destroyed!');
    process.exit();
  } catch (error) {
    console.error(`[Seed Error] ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
