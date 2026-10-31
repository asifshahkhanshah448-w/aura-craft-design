const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Load environment variables
dotenv.config();

// Initialize MongoDB connection
if (process.env.MONGODB_URI) {
  connectDB().catch((err) => {
    console.error(`[Database Connection Failure] ${err.message}`);
  });
} else {
  console.log(
    '[Notice] MONGODB_URI is not set. Please configure MONGODB_URI in your .env file to connect to MongoDB Atlas.'
  );
}

const app = express();

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
  })
);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Route Mounts
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'AURA Full-Stack E-Commerce Express Server',
    database: process.env.MONGODB_URI ? 'Connected to MongoDB Atlas' : 'Pending MONGODB_URI config',
    uptime: `${process.uptime().toFixed(1)}s`,
  });
});

// Root API information endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'AURA E-Commerce REST API is operating smoothly.',
    documentation: '/api/health',
    endpoints: {
      auth: ['POST /api/auth/register', 'POST /api/auth/login', 'GET /api/auth/me'],
      products: ['GET /api/products', 'GET /api/products/:id', 'POST /api/products', 'PUT /api/products/:id', 'DELETE /api/products/:id'],
      orders: ['POST /api/orders', 'GET /api/orders/my-orders', 'GET /api/orders/:id', 'GET /api/orders', 'PUT /api/orders/:id/status'],
    },
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Port configuration & server bootstrap
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `[Express Server] Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
  );
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[Unhandled Rejection Error] ${err.message}`);
});