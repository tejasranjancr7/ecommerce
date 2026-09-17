# 🛒 eCommerce Microservices Platform

A production-ready, cloud-native eCommerce backend built with **Spring Boot 3.4**, **Java 21**, and **Spring Cloud 2024**. The system is fully containerised and follows microservices best practices including service discovery, centralised config, distributed tracing, async event streaming, and OAuth2 security.

---

## 📑 Table of Contents

- [System Architecture](#-system-architecture)
- [Services Overview](#-services-overview)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Observability](#-observability)
- [Message Flow](#-message-flow)
- [Security](#-security)
- [Docker Images](#-docker-images)

---

## 🏛️ System Architecture

![System Architecture](./architecture.jpg)

---

## 📦 Services Overview

| Service | Port | Database | Description |
|---|---|---|---|
| **API Gateway** | `8080` | Redis | Single entry point — routing, auth, rate limiting, circuit breaking |
| **Config Server** | `8888` | — | Centralised configuration with hot-reload via RabbitMQ bus |
| **Eureka Server** | `8761` | — | Service registry and load-balanced discovery |
| **User Service** | `8082` | MongoDB | User registration, profile management, Keycloak identity sync |
| **Product Service** | `8081` | PostgreSQL | Product catalogue with CRUD, soft-delete, and keyword search |
| **Order Service** | `8083` | PostgreSQL | Shopping cart + order placement + Kafka event publishing |
| **Notification Service** | `8084` | — | Kafka consumer — reacts to order events (email / invoice hook) |

---

## 🛠️ Tech Stack

### Core
| Technology | Version | Purpose |
|---|---|---|
| Java | 21 | Language (LTS) |
| Spring Boot | 3.4.x | Application framework |
| Spring Cloud | 2024.0.x | Microservices toolkit |
| Maven | 3.x | Build tool |

### Spring Cloud Components
| Component | Purpose |
|---|---|
| Spring Cloud Gateway | Reactive API gateway |
| Spring Cloud Config | Centralised configuration server |
| Spring Cloud Netflix Eureka | Service discovery & registration |
| Spring Cloud Stream (Kafka) | Event-driven messaging |
| Spring Cloud Bus (RabbitMQ) | Config hot-reload broadcast |
| Spring Cloud CircuitBreaker (Resilience4j) | Fault tolerance |
| Spring Cloud OpenFeign | Declarative HTTP inter-service calls |

### Databases
| Database | Used By | Purpose |
|---|---|---|
| PostgreSQL 14 | Product Service, Order Service | Relational data (products, orders, cart) |
| MongoDB | User Service | Document store for user profiles |
| Redis | API Gateway | Rate limiter token store |

### Messaging
| Technology | Used By | Purpose |
|---|---|---|
| Apache Kafka | Order → Notification | Async order event streaming |
| RabbitMQ | All Services ↔ Config Server | Spring Cloud Bus config refresh |

### Security
| Technology | Purpose |
|---|---|
| Keycloak 26.2 | OAuth2 / OpenID Connect auth server |
| Spring Security (OAuth2 Resource Server) | JWT validation at Gateway |

### Observability
| Tool | Purpose | Port |
|---|---|---|
| Zipkin | Distributed request tracing | `9411` |
| Prometheus | Metrics scraping | `9090` |
| Grafana | Metrics & log dashboards | `3000` |
| Loki + Alloy | Log aggregation & shipping | `3100` |
| MinIO | Object storage backend for Loki | `9000` |
| Spring Actuator | Health, metrics, info endpoints | per service |

---

## 📁 Project Structure

```
ecom-microservices-1/
│
├── configserver/               # Spring Cloud Config Server
│   ├── src/main/resources/
│   │   └── config/             # YAML configs served to all services
│   │       ├── product-service.yml
│   │       ├── product-service-docker.yml
│   │       ├── order-service.yml
│   │       ├── order-service-docker.yml
│   │       ├── user-service.yml
│   │       └── user-service-docker.yml
│   └── pom.xml
│
├── eureka/                     # Eureka Discovery Server
│   └── pom.xml
│
├── gateway/                    # API Gateway (Spring Cloud Gateway)
│   ├── src/main/java/.../
│   │   ├── GatewayConfig.java  # Route definitions, rate limiter, circuit breaker
│   │   ├── SecurityConfig.java # OAuth2 JWT validation + role extraction
│   │   ├── JwtAuthFilter.java  # (prototype, not active)
│   │   └── LoggingFilter.java  # (prototype, not active)
│   └── pom.xml
│
├── user/                       # User Service
│   ├── src/main/java/.../
│   │   ├── controllers/UserController.java
│   │   ├── services/
│   │   │   ├── UserService.java
│   │   │   └── KeyCloakAdminService.java
│   │   ├── models/User.java    # MongoDB document
│   │   ├── models/Address.java
│   │   └── repository/UserRepository.java
│   └── pom.xml
│
├── product/                    # Product Service
│   ├── src/main/java/.../
│   │   ├── controllers/ProductController.java
│   │   ├── services/ProductService.java
│   │   ├── models/Product.java # JPA entity (PostgreSQL)
│   │   └── repositories/ProductRepository.java
│   └── pom.xml
│
├── order/                      # Order Service
│   ├── src/main/java/.../
│   │   ├── controllers/
│   │   │   ├── CartController.java
│   │   │   └── OrderController.java
│   │   ├── services/
│   │   │   ├── CartService.java    # Resilience4j Retry
│   │   │   └── OrderService.java   # Kafka event publish
│   │   ├── clients/
│   │   │   ├── ProductServiceClient.java  # Feign
│   │   │   └── UserServiceClient.java     # Feign
│   │   ├── models/
│   │   │   ├── Order.java
│   │   │   ├── OrderItem.java
│   │   │   ├── CartItem.java
│   │   │   └── OrderStatus.java
│   │   └── dtos/OrderCreatedEvent.java    # Kafka payload
│   └── pom.xml
│
├── notification/               # Notification Service
│   ├── src/main/java/.../
│   │   ├── OrderEventConsumer.java     # Kafka Consumer<OrderCreatedEvent>
│   │   └── payload/
│   │       ├── OrderCreatedEvent.java
│   │       ├── OrderItemDTO.java
│   │       └── OrderStatus.java
│   └── pom.xml
│
├── deploy/
│   └── docker/
│       ├── docker-compose.yml          # Full stack compose
│       ├── init-multi-db.sql           # PostgreSQL DB init (product + order schemas)
│       ├── build-projects.sh           # Maven build all services
│       ├── build-images-buildpacks.sh  # Build Docker images via Buildpacks
│       ├── build-images-jib.sh         # Build Docker images via Jib
│       ├── prometheus/prometheus.yml   # Prometheus scrape config
│       ├── grafana/                    # Grafana datasources
│       └── logging/                    # Loki + Alloy config
│
├── architecture.jpg                            # System architecture diagram
├── ecom-microservices.postman_collection.json  # Full API test collection
└── .gitignore
```

---

## ✅ Prerequisites

| Tool | Version | Notes |
|---|---|---|
| Java | 21+ | Required to build/run services |
| Maven | 3.8+ | Or use `mvnw` wrapper per service |
| Docker | 24+ | For running all infrastructure |
| Docker Compose | 2.x | For spinning up the full stack |

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone <repo-url>
cd ecom-microservices-1
```

### 2. Start all infrastructure + services with Docker Compose
```bash
cd deploy/docker
docker-compose up -d
```

This starts **everything** — Postgres, MongoDB, Keycloak, Kafka, Redis, Zipkin, Prometheus, Grafana, Loki, all microservices.

### 3. Build and run individual services locally (for development)

Each service reads config from the Config Server. Start in this order:

```bash
# 1. Config Server (must start first)
cd configserver && ./mvnw spring-boot:run

# 2. Eureka
cd eureka && ./mvnw spring-boot:run

# 3. Business services (any order)
cd product      && ./mvnw spring-boot:run
cd user         && ./mvnw spring-boot:run
cd order        && ./mvnw spring-boot:run
cd notification && ./mvnw spring-boot:run

# 4. Gateway (start last)
cd gateway && ./mvnw spring-boot:run
```

### 4. Build Docker images (Jib — no Docker daemon required)
```bash
cd deploy/docker
./build-projects.sh        # compile all Maven projects
./build-images-jib.sh      # push images to Docker Hub as dcode007/*
```

---

## 🔐 Environment Variables

Set these before running with Docker Compose or as system env vars:

| Variable | Description | Default |
|---|---|---|
| `DB_USER` | PostgreSQL username | `embarkx` |
| `DB_PASSWORD` | PostgreSQL password | `embarkx` |
| `MONGO_URI` | MongoDB connection string | `mongodb://mongo:27017` |
| `RABBITMQ_HOST` | RabbitMQ hostname | `localhost` |
| `RABBITMQ_PORT` | RabbitMQ port | `5672` |
| `RABBITMQ_USERNAME` | RabbitMQ user | `guest` |
| `RABBITMQ_PASSWORD` | RabbitMQ password | `guest` |
| `RABBITMQ_VHOST` | RabbitMQ virtual host | `/` |
| `ZIPKIN_URL` | Zipkin tracing endpoint | `http://zipkin:9411/api/v2/spans` |

---

## 📡 API Reference

All requests go through the **API Gateway on port `8080`** and require a valid **Bearer JWT token** (issued by Keycloak).

> Import `ecom-microservices.postman_collection.json` into Postman for a full ready-to-use collection.

### 👤 User Service — `/api/users`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/users` | ❌ None | Register a new user (creates in Keycloak + MongoDB) |
| `GET` | `/api/users/{id}` | ✅ JWT | Get user profile by ID |
| `PUT` | `/api/users/{id}` | ✅ JWT | Update user profile |

**Create User Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "username": "johndoe",
  "password": "secret123",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "zipcode": "10001"
  }
}
```

---

### 📦 Product Service — `/api/products`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/products` | ✅ JWT | Create a new product |
| `GET` | `/api/products` | ✅ JWT | Get all active products |
| `GET` | `/api/products/{id}` | ✅ JWT | Get product by ID |
| `PUT` | `/api/products/{id}` | ✅ JWT | Update product details |
| `DELETE` | `/api/products/{id}` | ✅ JWT | Soft-delete a product |
| `GET` | `/api/products/search?keyword=` | ✅ JWT | Search products by name |
| `GET` | `/api/products/simulate?fail=true` | ✅ JWT | Trigger circuit breaker test |

**Create Product Request Body:**
```json
{
  "name": "Wireless Headphones",
  "description": "Noise-cancelling Bluetooth headphones",
  "price": 2999.99,
  "stockQuantity": 50,
  "category": "Electronics",
  "imageUrl": "https://example.com/headphones.jpg"
}
```

---

### 🛒 Cart — `/api/cart`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/cart/{userId}` | ✅ JWT | Add item to cart |
| `DELETE` | `/api/cart/{userId}/{productId}` | ✅ JWT | Remove item from cart |
| `GET` | `/api/cart/{userId}` | ✅ JWT | Get cart contents |

**Add to Cart Request Body:**
```json
{
  "productId": "101",
  "quantity": 2
}
```

---

### 📋 Order Service — `/api/orders`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/orders/{userId}` | ✅ JWT | Place order from current cart |

On success: saves order to DB → clears cart → publishes `OrderCreatedEvent` to Kafka.

---

## 📊 Observability

| Tool | URL | Credentials |
|---|---|---|
| Eureka Dashboard | http://localhost:8761 | — |
| RabbitMQ Management | http://localhost:15672 | guest / guest |
| Keycloak Admin | http://localhost:8443 | admin / admin |
| pgAdmin | http://localhost:5050 | pgadmin4@pgadmin.org / admin |
| Zipkin (Traces) | http://localhost:9411 | — |
| Prometheus | http://localhost:9090 | — |
| Grafana (Dashboards) | http://localhost:3000 | anonymous admin |

All services expose:
- `/actuator/health` — health status
- `/actuator/metrics` — metrics
- `/actuator/prometheus` — Prometheus-format metrics
- `/actuator/busrefresh` — trigger config refresh (POST)

---

## 📨 Message Flow

### Order Placed → Notification

```
POST /api/orders/{userId}
        │
        ▼
  OrderService.createOrder()
        │  1. Validates cart is not empty
        │  2. Fetches cart items
        │  3. Calculates total
        │  4. Saves Order + OrderItems to PostgreSQL
        │  5. Clears cart
        │
        ▼
  StreamBridge.send("createOrder-out-0", OrderCreatedEvent)
        │
        ▼  Kafka Topic: order.exchange
        │
        ▼
  NotificationService.orderCreated()  [Consumer]
        │  • Logs orderId + userId
        │  • TODO: Send email
        │  • TODO: Generate invoice
        └─ • TODO: Notify seller
```

### Config Hot-Reload (Spring Cloud Bus)

```
POST /actuator/busrefresh  (any service)
        │
        ▼
  RabbitMQ (Spring Cloud Bus)
        │
        ▼
  All subscribed services refresh config
  without requiring a restart
```

---

## 🔑 Security

Authentication and authorisation is handled by **Keycloak** (realm: `ecom-app`):

1. **Client obtains JWT** from Keycloak via OAuth2 PKCE flow
2. **Gateway validates JWT** using Spring Security OAuth2 Resource Server
3. **Roles are extracted** from `resource_access.oauth2-pkce.roles` claim in the JWT
4. **Roles map** to Spring Security authorities as `ROLE_USER`, `ROLE_ADMIN`, etc.
5. **User registration** (`POST /api/users`) auto-creates the user in Keycloak and assigns the `USER` role

**Keycloak Setup:**
- Realm: `ecom-app`
- Client: `oauth2-pkce`
- Admin credentials: `admin / admin` (change in production!)

---

## 🐳 Docker Images

All services are published to Docker Hub under `dcode007/`:

| Service | Image |
|---|---|
| Config Server | `dcode007/config-server` |
| Eureka Server | `dcode007/eureka-server` |
| API Gateway | `dcode007/gateway-service` |
| User Service | `dcode007/user-service` |
| Product Service | `dcode007/product-service` |
| Order Service | `dcode007/order-service` |
| Notification Service | `dcode007/notification-service` |

All images are built on `gcr.io/distroless/java21` (minimal, secure base image) via **Google Jib**.

---

## 🗃️ Database Schemas

### PostgreSQL — `product` database
```
products: id, name, description, price, stock_quantity,
          category, image_url, active, created_at, updated_at
```

### PostgreSQL — `order` database
```
orders:     id, user_id, total_amount, status, created_at, updated_at
order_item: id, order_id (FK), product_id, quantity, price
cart_item:  id, user_id, product_id, quantity, price
```

### MongoDB — `ecom_user` database
```
users: _id, keycloak_id, first_name, last_name, email,
       phone, role, address { street, city, state, country, zipcode }
```

---

## 📄 License

MIT License — feel free to use, modify, and distribute this project.
