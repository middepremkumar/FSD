# Amazon Shopping - Full Stack Development (FSD) Suite

A full-stack e-commerce web application and lab implementation integrating **React 19 + Vite**, **Node.js + Express 5**, and **MySQL Database**.

---

## 🌟 Key Features

- **Full-Stack Architecture:** React frontend seamlessly communicates with Express REST API endpoints (`/api/products`, `/api/categories`, `/api/orders`, `/api/health`).
- **Real-World E-Commerce:**
  - Dynamic product catalog with categories, search, and sorting.
  - Interactive slideout shopping cart drawer with quantity adjustments.
  - Realistic multi-step checkout modal with shipping details and payment selection.
  - Real order placement generating order IDs, tracking timestamps, and stock deduction.
  - "Returns & Orders" history tracking modal.
  - Full Product CRUD (Add, Edit, Delete) with live database persistence.
  - Delivery location selector across Indian metro cities.
- **Resilient Database Layer:**
  - Production-ready MySQL connection pooling with `mysql2/promise`.
  - Automatic fallback in-memory store mirroring `database.sql` schemas and queries when MySQL is offline.
  - Automatic database seeder (`npm run db:init`).
- **Complete Lab Curriculum Suite:**
  - All exercises for **Unit 4 (Express.js)** and **Unit 5 (MySQL)** runnable standalone or directly from the Unified Lab Portal on port 5000.

---

## 🚀 How to Run

### 1. Start the Backend API & Lab Portal
```bash
npm run server
```
- Lab Portal: [http://localhost:5000/](http://localhost:5000/)
- React App: [http://localhost:5000/app](http://localhost:5000/app)

### 2. Start the Frontend in Development Mode (Vite)
```bash
npm run dev
```
- Open [http://localhost:5173/](http://localhost:5173/)

### 3. Initialize MySQL Database (Optional if MySQL is running)
```bash
npm run db:init
```

---

## 🧪 Unit 4 & Unit 5 Standalone Commands

```bash
npm run 4a        # Lab 4.a: Hello World Route (Port 5000)
npm run 4b        # Lab 4.b: Multi-Route Website (Port 3002)
npm run 4c        # Lab 4.c: Console Hello World (Port 5000)
npm run 4d        # Lab 4.d: Express CRUD Operations (Port 3004)
npm run 4e        # Lab 4.e: MySQL Database Connector (Port 3005)
npm run db:init   # Lab 5.e: Automatic Database Initializer
```
