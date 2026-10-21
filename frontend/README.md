# NovaStore Frontend — Modern eCommerce Platform

A high-performance, responsive React 19 + TypeScript + Vite web storefront built for the **Spring Boot 3.4 & Spring Cloud** eCommerce Microservices ecosystem.

---

## 🌟 Key Features & Capabilities

### 1. Direct Spring Microservices & Gateway Connectivity
The frontend communicates directly with the containerized backend microservices via Vite reverse-proxy and Spring Cloud Gateway (`:8080`):
- **Product Service (`:8081`)**: Dynamic catalog querying, keyword search, inventory verification, and category filtering backed by PostgreSQL.
- **User Service (`:8082`)**: MongoDB customer profile management, address synchronization, and account identity.
- **Order Service (`:8083`)**: Multi-item cart management (`/api/cart`), order creation (`/api/orders`), and PostgreSQL order persistence.
- **Notification Service (`:8084`)**: Consumes Kafka events (`order.exchange`), generates OpenPDF invoices with itemized discounts, and dispatches confirmation emails via Gmail SMTP.
- **Keycloak / Auth (`:8443`)**: OAuth2 / OpenID Connect token verification and refresh token session persistence.

### 2. Exclusive Live Mode Architecture
- **Pure Live Execution**: The application operates exclusively in **Live Mode**. Sandbox / mock simulation has been completely removed.
- **Real-Time Data Integrity**: Every user action (catalog browsing, cart updates, checkout, coupon validation, profile editing) interacts directly with live PostgreSQL, MongoDB, Spring Cloud Gateway, and Kafka event brokers.
- **Live Health Monitoring**: The Administrator Portal displays real-time health and port mappings for all distributed services (Eureka, Gateway, Product, User, Order, Notification, Kafka, PostgreSQL, MongoDB, Keycloak).

### 3. Accurate Cart Synchronization & Multi-Quantity Support
- **Exact Unit Integrity**: Shopping cart quantities are synchronized deterministically. Setting item quantity (e.g. 2 units) guarantees that exactly 2 units are checked out and stored in PostgreSQL without duplicate accumulation.
- **Atomic Pre-Checkout Sync**: The backend cart is refreshed and populated with exact line-item quantities immediately prior to order creation.

### 4. Festival Promo Codes & Transparent Pricing
- **Coupon System**:
  - `FESTIVAL`: 10% discount up to ₹200.
  - `SAVE10`: Flat 10% discount on cart subtotal.
  - `WELCOME`: Flat ₹100 discount for initial orders.
- **End-to-End Pricing Pipeline**:
  - The coupon discount is passed into `POST /api/orders` and persisted in the `orders` PostgreSQL table (`sub_total_amount`, `discount_amount`, `coupon_code`, `shipping_charge`, `total_amount`).
  - The discount is carried in the `OrderCreatedEvent` published to Kafka topic `order.exchange`.
  - Both the HTML confirmation email and the attached PDF invoice render an itemized discount line (e.g., `Coupon Discount (FESTIVAL): -INR 200.00`) and the final discounted amount.

### 5. Dynamic Shipping & Delivery Logic
- **Free Delivery Threshold (₹499)**:
  - Orders with subtotal **$\ge$ ₹499** automatically qualify for **FREE Delivery**.
  - Orders with subtotal **$<$ ₹499** incur a standard delivery fee of **₹49.00**.
- **Cross-Component Consistency**:
  - **Product Badges**: Displays `FREE Delivery` for items $\ge$ ₹499 vs `₹49 Delivery` for items $<$ ₹499.
  - **Cart Drawer**: Real-time progress bar towards free delivery and itemized delivery fee breakdown.
  - **Checkout Modal**: Transparent review of subtotal, delivery fee, coupon savings, and final payable amount.
  - **Order Success Modal & Tax Invoice**: Itemized display of Subtotal, Coupon Discount, Delivery Fee (₹49.00 or FREE), and Grand Total.

### 6. Kafka Event-Driven Order Processing & Email Notifications
- Upon placing an order:
  1. Frontend synchronizes customer details with User Service (MongoDB).
  2. Cart items are verified and committed to Order Service (PostgreSQL).
  3. Order Service publishes an `OrderCreatedEvent` to Kafka topic `order.exchange`.
  4. Notification Service asynchronously consumes the event, renders a PDF tax invoice, and sends an HTML confirmation email from `tejasranjansingh007@gmail.com` to the customer.

### 7. Itemized Tax Invoice Modal & Order Success Celebration
- Renders an itemized tax invoice matching `InvoiceService.java`.
- Displays:
  - Unique Invoice & Order Number.
  - Customer Information & Billed-To Address.
  - Purchased item list with Unit Price, Quantity, and Subtotal in INR (₹).
  - Subtotal, Coupon Discount, Delivery Fee, and Grand Total.
  - One-click **Print / Save as PDF** functionality.

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
│   │   ├── OrderSuccessModal.tsx  # Confetti celebration with exact line items & discount breakdown
│   │   ├── InvoiceModal.tsx       # Printable tax invoice modal (Subtotal, Coupon, Delivery, Grand Total)
│   │   ├── UserProfileModal.tsx   # User profile viewer & account switcher
│   │   ├── AdminProductModal.tsx  # Admin inventory CRUD (Create, Update, Delete products)
│   │   ├── AdminDashboardModal.tsx# Microservices portal & health dashboard (Live Only)
│   │   ├── LoginModal.tsx         # Customer & Admin authentication modal
│   │   └── ToastContainer.tsx     # Toast notification banner
│   ├── context/
│   │   └── StoreContext.tsx       # Centralized store (cart, products, coupons, delivery, auth)
│   ├── services/
│   │   ├── api.ts                 # API service client connecting exclusively in Live Mode
│   │   └── mockData.ts            # Seed catalog and verified user credentials
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
| `/api/cart` | `order-service` | `8083` | Cart addition, modification, deletion, and clear |
| `/api/orders` | `order-service` | `8083` | Order creation with pricing/discount payload |
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

---

## 📊 Backend & Observability Dashboard Links

The frontend works directly alongside the containerized backend and observability stack:

| Service / Tool | Port | Direct Link | Purpose |
|---|---|---|---|
| **Frontend Storefront** | `3000` | [http://localhost:3000](http://localhost:3000) | Vite + React 19 UI (dedicated port) |
| **API Gateway** | `8080` | [http://localhost:8080](http://localhost:8080) | Spring Cloud API routing & authentication |
| **Eureka Server** | `8761` | [http://localhost:8761](http://localhost:8761) | Service discovery & registry status |
| **Grafana Dashboard** | `3001` | [http://localhost:3001](http://localhost:3001) | Metrics visualization & live log searching (credentials: `admin`/`admin`) |
| **Prometheus** | `9090` | [http://localhost:9090](http://localhost:9090) | Time-series metrics & Spring Actuator scrapes |
| **Zipkin** | `9411` | [http://localhost:9411](http://localhost:9411) | Distributed trace viewer across microservice calls |
| **Keycloak Auth** | `8443` | [http://localhost:8443](http://localhost:8443) | Identity & Access Management admin console |
| **RabbitMQ UI** | `15672` | [http://localhost:15672](http://localhost:15672) | Queue & exchange monitoring (credentials: `guest`/`guest`) |

