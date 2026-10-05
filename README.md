# 🛍️ Amazon Store - Full-Stack E-Commerce Application

A production-ready full-stack e-commerce web application integrating **React 19 + Vite**, **Node.js + Express 5 REST API**, and a **MySQL Relational Database** with connection pooling and automated fallback resiliency.

[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-v5.2-000000?logo=express&logoColor=white)](https://expressjs.com)
[![React](https://img.shields.io/badge/React-v19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-v8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![MySQL](https://img.shields.io/badge/MySQL-v8.0-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com)
[![Deploy on Railway](https://img.shields.io/badge/Deploy-Railway-0B0D0E?logo=railway&logoColor=white)](https://railway.app)
[![Deploy on Render](https://img.shields.io/badge/Deploy-Render-46E3B7?logo=render&logoColor=white)](https://render.com)

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [REST API Reference](#-rest-api-reference)
- [Database Schema](#-database-schema)
- [Quick Start (Local)](#-quick-start-local)
- [Cloud Deployment Guide](#-cloud-deployment-guide)
  - [Deploy on Railway (Recommended for Full-Stack + MySQL)](#1-deploy-on-railway-recommended)
  - [Deploy on Render (100% Free Forever)](#2-deploy-on-render-free-forever)
- [Environment Variables](#-environment-variables)
- [Curriculum & Lab Suite](#-curriculum--lab-suite)
- [License](#-license)

---

## 🌐 Overview

This application delivers an authentic **Amazon.in** shopping experience backed by a robust full-stack architecture:
- **Frontend:** Responsive React 19 Single Page Application built with Vite and custom modern CSS design tokens.
- **Backend:** Express 5 HTTP REST API with CORS, JSON body parsers, parameterized queries, and transactional order checkout.
- **Database:** MySQL relational database with foreign key constraints, connection pooling via `mysql2/promise`, and an automated in-memory mock fallback store ensuring 100% uptime even when MySQL is offline.

---

## ✨ Key Features

- **Amazon Storefront Design:**
  - Authentic navigation header with search bar, delivery location selector, account & lists dropdown, and order history tracker.
  - Category filtering (Mobiles, Audio, Laptops, Fashion, Smart Wearables, Cameras).
  - Multi-criteria sorting (Featured, Price: Low to High, Price: High to Low, Customer Reviews).
  - Curated collections (Premium Selection, Tech & Gadgets, In-Stock Only).
- **Interactive Shopping Cart & Checkout:**
  - Slideout cart drawer with instant quantity increment/decrement and price recalculation.
  - Multi-step modal checkout collecting customer details, shipping address, and payment method (UPI, Card, Net Banking, COD).
  - Transactional order creation with auto-generated order IDs and live inventory deduction.
  - "Returns & Orders" history tracking drawer with real-time status badges.
- **Product Management (CRUD):**
  - Full create, read, update, and delete (CRUD) operations on products via REST APIs and UI modals.
- **Enterprise Resiliency:**
  - Connection pooling with 600ms fast-probe timeout. If MySQL is unavailable, the application seamlessly serves data from a synchronized fallback in-memory store with zero latency or UI interruptions.

---

## 🏗️ System Architecture

```text
┌────────────────────────────────────────────────────────┐
│                   React 19 Frontend                    │
│    (Vite SPA • Product Catalog • Cart • Checkout)      │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTP / JSON
┌──────────────────────────▼─────────────────────────────┐
│                 Express 5 REST Server                  │
│       (PORT 5000 • Static Assets • API Router)         │
└──────────────┬──────────────────────────┬──────────────┘
               │                          │
    [Connected MySQL]             [Offline Fallback]
               │                          │
┌──────────────▼──────────┐    ┌──────────▼──────────────┐
│  MySQL Database Pool    │    │ Synchronized In-Memory  │
│ (Tables: products,      │    │ Resilient Data Store    │
│  categories, orders)    │    │ (Zero-latency fallback) │
└─────────────────────────┘    └─────────────────────────┘
```

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | Retrieve all products (supports `?category=`, `?search=`, `?sort=`) |
| `GET` | `/api/products/:id` | Fetch single product by ID |
| `POST` | `/api/products` | Create a new product in catalog |
| `PUT` | `/api/products/:id` | Update existing product details |
| `DELETE` | `/api/products/:id` | Delete product by ID |
| `GET` | `/api/categories` | Retrieve list of all categories |
| `GET` | `/api/orders` | Fetch customer order history |
| `POST` | `/api/orders` | Place order (deducts stock and records order items) |
| `GET` | `/api/stats` | Summary statistics (total products, orders, stock) |
| `GET` | `/api/subqueries` | Advanced database aggregation queries |
| `GET` | `/api/health` | Service health status and database connection probe |

---

## 🗄️ Database Schema

The relational schema is defined in [`database/database.sql`](database/database.sql):

- **`categories`**: `category_id (PK)`, `name`, `slug`, `description`
- **`products`**: `product_id (PK)`, `category_id (FK)`, `title`, `price`, `stock_quantity`, `rating_rate`, `rating_count`, `deal_tag`, `badge`, `image`, `delivery_info`
- **`orders`**: `order_id (PK)`, `customer_name`, `customer_email`, `shipping_address`, `payment_method`, `total_amount`, `order_status`, `created_at`
- **`order_items`**: `order_item_id (PK)`, `order_id (FK)`, `product_id (FK)`, `quantity`, `unit_price`

---

## ⚡ Quick Start (Local)

### 1. Prerequisites
- **Node.js** (v18.0 or newer)
- **Git**
- Optional: **MySQL** (via XAMPP, Docker, or native service)

### 2. Clone & Install
```bash
git clone https://github.com/middepremkumar/FSD.git
cd FSD
npm install
```

### 3. Configure Environment
Create a `.env` file in the root directory:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=amazon_fsd_db
DB_PORT=3306
```

### 4. Initialize Database (Optional)
If your local MySQL service is running, run:
```bash
npm run db:init
```
*(If MySQL is not installed, the app will run automatically using its built-in resilient mock store.)*

### 5. Run the Application
Open two terminals or run concurrently:

```bash
# Terminal 1: Backend Express Server
npm run server

# Terminal 2: Frontend Dev Server (with HMR)
npm run dev
```

- **Frontend (Vite Dev):** [http://localhost:5173/](http://localhost:5173/)
- **Unified Production Store:** [http://localhost:5000/](http://localhost:5000/)
- **API Health:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🚀 Cloud Deployment Guide

### 1. Deploy on Railway (Recommended)
*Railway deploys Frontend, Backend, and a live Cloud MySQL Database all in one dashboard.*

1. Go to [railway.app](https://railway.app) and log in with your GitHub account.
2. Click **"+ New Project"** ➔ **"Deploy from GitHub repo"**.
3. Select **`middepremkumar/FSD`** and click **Deploy**.
4. In the project canvas, click **"+ New"** ➔ **"Database"** ➔ **"Add MySQL"**.
5. Click on your **FSD Web Service** ➔ **Variables** ➔ **"Add Reference"** ➔ select **`MYSQL_URL`** (or `DATABASE_URL`).
6. In **Settings** ➔ **Networking**, click **"Generate Domain"** to get your live public URL!

### 2. Deploy on Render (Free Forever)
*Render builds and serves your full-stack app 24/7 at no cost.*

1. Go to [dashboard.render.com](https://dashboard.render.com) and log in.
2. Click **"New +"** ➔ **"Web Service"**.
3. Select your repository: **`middepremkumar/FSD`**.
4. The deployment blueprint will configure automatically from [`render.yaml`](render.yaml):
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
5. Click **"Deploy Web Service"** to receive your live `https://<your-app>.onrender.com` link.

---

## 🔐 Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | Port for the Express backend server |
| `NODE_ENV` | `development` | Set to `production` in live environments |
| `DATABASE_URL` | - | Cloud MySQL connection string (e.g., from Railway or Aiven) |
| `DB_HOST` | `127.0.0.1` | Local MySQL hostname |
| `DB_PORT` | `3306` | MySQL port |
| `DB_USER` | `root` | MySQL username |
| `DB_PASSWORD` | `""` | MySQL password |
| `DB_NAME` | `amazon_fsd_db` | MySQL database name |

---

## 🎓 Curriculum & Lab Suite

The underlying exercises for Unit 4 and Unit 5 remain accessible for academic evaluation:

```bash
npm run 4a        # Lab 4.a: Hello World Route (Express.js)
npm run 4b        # Lab 4.b: Multi-Route Small Website
npm run 4c        # Lab 4.c: Console Hello World via Node.js
npm run 4d        # Lab 4.d: Express.js CRUD API Operations
npm run 4e        # Lab 4.e: MySQL Database Connector & Queries
npm run db:init   # Lab 5.e: Automatic Database Initializer
```

- **Interactive Curriculum Portal:** Visit [http://localhost:5000/portal](http://localhost:5000/portal) to inspect source code and test all standalone lab endpoints.

---

## 📄 License

This project is licensed under the MIT License - feel free to use and adapt it for learning and commercial projects.
