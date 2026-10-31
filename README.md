# AURA Craft & Design — Professional Full-Stack E-Commerce Store

A production-grade, full-stack e-commerce web application engineered for an internship submission. Features end-to-end REST API architecture, Mongoose/MongoDB Atlas database models, JWT authentication with bcrypt password hashing, inventory stock control, shopping cart management, safe order processing with Cash on Delivery (COD), and an interactive admin portal.

---

## 1. Technology Stack

### Frontend
- **Framework & Libraries**: Next.js 15+ (App Router), React 19, Tailwind CSS v4, Lucide Icons, Motion.
- **Vanilla Frontend Option**: Pure HTML5, CSS3, and Vanilla JavaScript client located in `/public/vanilla-frontend/`.
- **Responsive Design**: Mobile-first architecture supporting 320px screens, smartphones, tablets, laptops, and 1440px+ ultra-wide desktop displays without horizontal overflow.

### Backend
- **Runtime & Framework**: Node.js, Express.js REST architecture (with both integrated Next.js API Routes and standalone `/backend` Express server).
- **Security & Auth**: JSON Web Tokens (JWT), `bcryptjs` password hashing, role-based authorization (`customer` vs `admin`), CORS configuration, input validation.

### Database
- **ODM & Database**: MongoDB Atlas & Mongoose 8+.
- **Dual-Mode Persistence Layer**: When `MONGODB_URI` is provided, connects directly to your MongoDB Atlas cluster. When not yet configured in development/sandbox, seamlessly falls back to a high-fidelity local in-memory/JSON store with full schema validation and pre-seeded catalog items so the application runs immediately.

---

## 2. Project Directory Structure

```text
├── app/                              # Next.js App Router (Full-Stack UI & REST APIs)
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts        # POST /api/auth/login
│   │   │   ├── register/route.ts     # POST /api/auth/register
│   │   │   └── me/route.ts           # GET /api/auth/me (Protected)
│   │   ├── products/
│   │   │   ├── route.ts              # GET /api/products, POST /api/products (Admin)
│   │   │   └── [id]/route.ts         # GET, PUT (Admin), DELETE (Admin)
│   │   ├── orders/
│   │   │   ├── route.ts              # POST /api/orders, GET /api/orders (Admin)
│   │   │   ├── my-orders/route.ts    # GET /api/orders/my-orders (Customer)
│   │   │   └── [id]/
│   │   │       ├── route.ts          # GET /api/orders/:id
│   │   │       └── status/route.ts   # PUT /api/orders/:id/status (Admin)
│   │   └── health/route.ts           # GET /api/health (DB & Server diagnostics)
│   ├── globals.css                   # Tailwind v4 configuration
│   ├── layout.tsx                    # Root layout, Google Fonts, SEO metadata
│   └── page.tsx                      # Main interactive storefront
│
├── backend/                          # Standalone Node.js & Express.js REST API
│   ├── config/
│   │   └── db.js                     # Mongoose MongoDB Atlas connection
│   ├── controllers/
│   │   ├── authController.js         # Register, Login, Me
│   │   ├── productController.js      # Product CRUD & search/filters
│   │   └── orderController.js        # Safe inventory deduction & checkout
│   ├── middleware/
│   │   ├── authMiddleware.js         # JWT verification & role authorization
│   │   └── errorMiddleware.js        # Global error and 404 handlers
│   ├── models/
│   │   ├── User.js                   # Mongoose User model with bcrypt hook
│   │   ├── Product.js                # Mongoose Product model
│   │   └── Order.js                  # Mongoose Order model
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   └── orderRoutes.js
│   ├── .env.example
│   ├── package.json
│   ├── seeder.js                     # Database populator for Atlas
│   └── server.js                     # Express app entry point
│
├── components/                       # Modular UI Components
│   ├── Navbar.tsx                    # 3-Zone Top Bar
│   ├── Hero.tsx                      # Editorial Hero showcase
│   ├── ProductCatalog.tsx            # Filters, search, category tabs
│   ├── ProductCard.tsx               # Product card with unboxed metadata
│   ├── ProductDetailModal.tsx        # Technical specs, reviews, stock check
│   ├── CartDrawer.tsx                # Slide-over shopping bag
│   ├── CheckoutModal.tsx             # Address form, phone, COD payment
│   ├── AuthModal.tsx                 # Login/Register with 1-click demo logins
│   ├── OrderHistoryModal.tsx         # Customer order tracking
│   ├── AdminDashboardModal.tsx       # Product CRUD & order status management
│   ├── ApiDocDrawer.tsx              # Live API inspector & database monitor
│   └── Footer.tsx                    # Quiet links and metadata
│
├── lib/
│   ├── auth/jwt.ts                   # Token signing, verify, bcrypt helpers
│   ├── db/
│   │   ├── connection.ts             # MongoDB Atlas connection manager
│   │   └── repository.ts             # Unified repository with safe stock logic
│   ├── models/                       # TypeScript Mongoose models
│   └── types.ts                      # Core interfaces (User, Product, Order)
│
├── public/
│   ├── images/                       # High-resolution commercial product photography
│   └── vanilla-frontend/             # Pure HTML5/CSS3/Vanilla JS Client
│       ├── index.html
│       ├── style.css
│       └── app.js
│
├── .env.example                      # Environment variables template
└── README.md                         # Full documentation
```

---

## 3. Database Models (Mongoose)

### 1. User Model (`User.js` / `User.ts`)
| Field | Type | Attributes | Description |
|---|---|---|---|
| `name` | String | Required, trim, max 60 | Customer full name |
| `email` | String | Required, unique, lowercase | Account email |
| `password` | String | Required, min 6, select: false | Hashed with bcrypt (salt rounds: 10) |
| `role` | String | Enum: `'customer'`, `'admin'` | Default: `'customer'` |
| `phone` | String | Optional | Contact phone number |
| `address` | Object | `{ street, city, postalCode }` | Delivery address |
| `timestamps` | Boolean | True | `createdAt` and `updatedAt` |

### 2. Product Model (`Product.js` / `Product.ts`)
| Field | Type | Attributes | Description |
|---|---|---|---|
| `name` | String | Required, trim, max 120 | Product title |
| `slug` | String | Trim, lowercase | URL-safe slug |
| `description` | String | Required, max 2000 | Detailed description |
| `price` | Number | Required, min 0 | Product unit price |
| `category` | String | Required, trim | Category (`Furniture`, `Lighting`, `Audio`, `Watches`) |
| `stock` | Number | Required, min 0, default: 0 | Available inventory units |
| `imageUrl` | String | Required | High-resolution image path |
| `featured` | Boolean | Default: false | Featured item flag |
| `specs` | Map/Object | Key-value pairs | Technical specs (dimensions, materials, movement) |
| `rating` | Object | `{ average, count }` | Review score and count |

### 3. Order Model (`Order.js` / `Order.ts`)
| Field | Type | Attributes | Description |
|---|---|---|---|
| `orderId` | String | Required, unique | Unique reference (`ORD-XXXX-X`) |
| `user` | ObjectId | Ref: `'User'` | Authenticated user reference (or guest id) |
| `customerName` | String | Required, trim | Recipient name |
| `phone` | String | Required, trim | Delivery courier contact phone |
| `deliveryAddress` | Object | Required | `{ street, city, postalCode }` |
| `items` | Array | Required, min length 1 | `[{ product, name, price, quantity, imageUrl }]` |
| `paymentMethod` | String | Enum | `'Cash on Delivery'` or `'Credit / Debit Card'` |
| `paymentStatus` | String | Enum | `'Pending'` or `'Completed'` |
| `orderStatus` | String | Enum | `'Pending'`, `'Processing'`, `'Shipped'`, `'Delivered'`, `'Cancelled'` |
| `subtotal` | Number | Required, min 0 | Calculated strictly on server |
| `shippingFee` | Number | Default: 0 | Free over $500, else $25 |
| `tax` | Number | Default: 0 | 8% estimated tax |
| `total` | Number | Required, min 0 | Final verified grand total |

---

## 4. REST API Documentation

### Authentication Endpoints
- `POST /api/auth/register` — Register a new customer account.
- `POST /api/auth/login` — Sign in and receive a signed JWT token.
- `GET /api/auth/me` — Retrieve authenticated user profile (Requires `Authorization: Bearer <token>`).

### Product Endpoints
- `GET /api/products` — Retrieve all products. Query parameters:
  - `category`: Filter by category (e.g. `Furniture`, `Lighting`, `Audio`, `Watches`)
  - `search`: Search query string
  - `sort`: `price_asc`, `price_desc`, or `newest`
- `GET /api/products/:id` — Retrieve single product details.
- `POST /api/products` — Create a new product (**Admin only**).
- `PUT /api/products/:id` — Update product price, stock, or details (**Admin only**).
- `DELETE /api/products/:id` — Remove product from catalog (**Admin only**).

### Order Endpoints
- `POST /api/orders` — Create new order with server-validated pricing, inventory deduction, and Cash on Delivery support.
- `GET /api/orders/my-orders` — Get authenticated customer's order history (**Customer only**).
- `GET /api/orders/:id` — Retrieve specific order details (Authorized owner or Admin).
- `GET /api/orders` — View all orders across all customers (**Admin only**).
- `PUT /api/orders/:id/status` — Update order status: `Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled` (**Admin only**). *Cancelling an order automatically restores inventory stock.*

---

## 5. Security & Reliability Highlights

1. **Server-Side Price & Inventory Verification**: The server **never** trusts prices or totals sent by the client. It recalculates item totals directly from database records, validates available stock, and safely deducts inventory.
2. **Password Security**: Passwords are never stored in plain text; they are hashed using `bcrypt` with salt rounds.
3. **JWT Authentication**: Protected routes require valid JSON Web Tokens passed in the standard `Authorization: Bearer <token>` header.
4. **Role-Based Authorization (RBAC)**: Only accounts with `role: 'admin'` can access administrative endpoints (creating/updating/deleting products and updating order fulfillment statuses).
5. **Inventory Restoration**: If an admin marks an order as `Cancelled`, the server safely increments the product inventory back into stock.

---

## 6. Pre-Configured Test Accounts

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Administrator** | `admin@auracraft.com` | `admin123456` | Full catalog CRUD & order management |
| **Customer** | `jane@example.com` | `customer123` | Browsing, ordering, personal order history |

*Note: The UI also provides one-click "Demo Admin" and "Demo Customer" fast-fill buttons in the Sign In modal for instant testing.*

---

## 7. How to Run the Project

### Option A: Running the Integrated Full-Stack Application
```bash
# 1. Install dependencies
npm install

# 2. Run the development server (runs on port 3000)
npm run dev

# 3. Open in browser:
# http://localhost:3000
```

### Option B: Connecting Your MongoDB Atlas Cluster
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Copy your connection string.
3. Add it to your `.env` file:
   ```env
   MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/aura_ecommerce?retryWrites=true&w=majority"
   ```
4. Restart the server. The database status badge will automatically display **MongoDB Atlas Connected**.

### Option C: Running the Standalone Express Server (`/backend`)
```bash
cd backend
npm install
npm run seed     # (Optional) Populates your MongoDB Atlas database with seed data
npm start        # Starts Express on port 5000
```

### Option D: Viewing the Pure Vanilla JS Frontend
Open `http://localhost:3000/vanilla-frontend/index.html` in your browser to experience the pure HTML5/CSS3/Vanilla JS client communicating directly with the `/api` REST endpoints.
