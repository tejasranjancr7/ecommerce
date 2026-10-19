# NovaStore Frontend — Modern eCommerce Platform

A high-performance, responsive React 19 + TypeScript + Vite web storefront built for the **Spring Boot 3.4 & Spring Cloud** eCommerce Microservices ecosystem.

---

## 🌟 Key Features & Capabilities

### 1. Direct Spring Microservices & Gateway Connectivity
The frontend communicates directly with the backend microservices via Vite reverse-proxy and Spring Cloud Gateway:
- **Product Service (`:8081`)**: Dynamic catalog querying, keyword search, inventory verification, and category filtering.
- **User Service (`:8082`)**: MongoDB customer profile management, address synchronization, and account identity.
- **Order Service (`:8083`)**: Multi-item cart management (`/api/cart`), order creation (`/api/orders`), and PostgreSQL order persistence.
- **Notification Service (`:8084`)**: Receives Kafka events (`order.exchange`), generates OpenPDF invoices, and sends order confirmation emails via Gmail SMTP.
- **Keycloak / Auth (`:8443`)**: OAuth2 / OpenID Connect token verification and refresh token session persistence.

### 2. Shipping & Dynamic Delivery Logic
- **Free Delivery Threshold (₹499)**:
  - Orders with subtotal **$\ge$ ₹499** automatically receive **FREE Delivery**.
  - Orders with subtotal **$<$ ₹499** incur a standard delivery fee of **₹49.00**.
- **Cross-Component Consistency**:
  - **Product Badges**: Displays `FREE Delivery` for items $\ge$ ₹499 vs `₹49 Delivery` for items $<$ ₹499.
  - **Cart Drawer**: Real-time progress bar towards free delivery and itemized delivery fee breakdown.
  - **Checkout Modal**: Transparent review of subtotal, delivery fee, and final payable amount.
  - **Order Success Modal & Tax Invoice**: Itemized display of Subtotal, Delivery Fee (₹49.00 or FREE), and Grand Total.

### 3. Festival Promo Codes & Coupons
- **Coupon System**:
  - `FESTIVAL`: 10% discount up to ₹200.
  - `SAVE10`: Flat 10% off cart subtotal.
  - `WELCOME`: Flat ₹100 discount for new orders.
- Applied discounts persist into the checkout calculation, order summary, and generated invoice.

### 4. Kafka Event-Driven Order Processing & Email Notifications
- Upon placing an order:
  1. Frontend synchronizes customer details with User Service (MongoDB).
  2. Cart items are verified and committed to Order Service (PostgreSQL).
  3. Order Service publishes an `OrderCreatedEvent` to Kafka topic `order.exchange`.
  4. Notification Service asynchronously consumes the event, renders a PDF tax invoice, and sends an HTML confirmation email from `tejasranjansingh007@gmail.com` to the customer.

### 5. Verified Tax Invoice Modal
- Renders an itemized tax invoice matching the backend `sample_invoice.jpg` and `InvoiceService.java`.
- Displays:
  - Unique Invoice & Order Number.
  - Customer Information & Billed-To Address.
  - Purchased item list with Unit Price and Subtotal in INR (₹).
  - Subtotal, Coupon Discount, Delivery Fee, and Grand Total.
  - One-click **Print / Save as PDF** functionality.

### 6. Dual Mode Architecture (Live vs. Interactive Sandbox)
- **Live Mode**: Real-time communication with containerized microservices (Eureka, PostgreSQL, MongoDB, Kafka, RabbitMQ).
- **Interactive Sandbox Mode**: Fallback simulation that enables offline catalog browsing, cart operations, user switching, and order placement when backend containers are paused.

---

## 🛠 Tech Stack

- **Framework**: React 19, TypeScript
- **Bundler & Dev Server**: Vite 6 / 8 with proxy routing
- **Styling**: Vanilla CSS design system with custom CSS variables, glassmorphism, responsive grid layouts, and smooth animations
- **Icons**: Lucide React
- **Effects**: Canvas Confetti

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- Docker Desktop (for running the backend microservices)

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev -- --port 3000
```
Open **`http://localhost:3000`** in your browser.

### 3. Build for Production
```bash
npm run build
```
Creates an optimized production bundle in `dist/`.

---

## 📂 Project Architecture

```text
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx             # Header with live service indicators, search, and user profile
│   │   ├── HeroBanner.tsx         # Promotional banner & platform metrics
│   │   ├── CategoryFilter.tsx     # Category filters (Mobiles, Computers, Audio, Wearables, etc.)
│   │   ├── ProductCard.tsx        # Product card with dynamic delivery badges (₹49 vs Free)
│   │   ├── ProductDetailModal.tsx # Quick-view modal with specifications and inventory status
│   │   ├── CartDrawer.tsx         # Slide-in cart with quantity adjustments and coupon input
│   │   ├── CheckoutModal.tsx      # Delivery address confirmation & payment selector
│   │   ├── OrderSuccessModal.tsx  # Confetti order celebration with exact delivery fee breakdown
│   │   ├── InvoiceModal.tsx       # Printable tax invoice modal (Subtotal, Delivery, Grand Total)
│   │   ├── UserProfileModal.tsx   # User profile viewer & account switcher
│   │   ├── AdminProductModal.tsx  # Admin inventory CRUD (Create, Update, Delete products)
│   │   └── ToastContainer.tsx     # Toast notification banner
│   ├── context/
│   │   └── StoreContext.tsx       # Centralized store (cart, products, coupons, delivery, auth)
│   ├── services/
│   │   ├── api.ts                 # API service client connecting to microservices & gateway
│   │   └── mockData.ts            # Verified seed products matching backend PostgreSQL catalog
│   ├── types/
│   │   └── index.ts               # TypeScript data models (Product, Order, User, CartItem, etc.)
│   ├── App.tsx                    # Main storefront page layout
│   ├── main.tsx                   # React root entrypoint
│   └── index.css                  # Core CSS design system
├── vite.config.ts                 # Proxy configuration forwarding API routes to microservices
├── package.json
└── tsconfig.json
```

---

## 🔌 API Proxy Routes (`vite.config.ts`)

| Route | Target Microservice | Port | Description |
|---|---|---|---|
| `/api/products` | `product-service` | `8081` | Product catalog retrieval and management |
| `/api/cart` | `order-service` | `8083` | Cart addition, modification, and deletion |
| `/api/orders` | `order-service` | `8083` | Order creation and order history |
| `/api/users` | `user-service` | `8082` | User profile retrieval and updates |
| `/realms` | `keycloak` | `8443` | OAuth2 / OpenID Connect token endpoints |

---

## 👤 Verified Accounts

- **Primary User / Admin**:
  - **Email**: `tejasranjansingh007@gmail.com`
  - **User ID**: `67d533476a55cf5c8124a59c`
  - **Role**: `ADMIN` / `CUSTOMER`
- **Customer User**:
  - **Email**: `joe@example.com`
  - **User ID**: `67d533476a55cf5c8124a59d`
  - **Role**: `CUSTOMER`
