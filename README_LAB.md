# Full Stack Development (FSD) Lab Suite

Complete real-world implementation for **Unit 4: Node.js and Express.js** and **Unit 5: MySQL Database**.

---

## 🚀 Quick Start

### 1. Launch the Unified Lab Portal & API Server (Port 5000)
```bash
npm run server
```
- Open [http://localhost:5000/](http://localhost:5000/) in your browser.
- Interactive dashboard to view source code, launch live endpoints, and test APIs.
- Built-in React app also accessible at [http://localhost:5000/app](http://localhost:5000/app).

### 2. Frontend React Shopping App (Vite Dev Server - Port 5173)
```bash
npm run dev
```
- Open [http://localhost:5173/](http://localhost:5173/) to view the Amazon Shopping frontend.
- Proxies `/api` and `/lab` directly to the Express backend on port 5000.

---

## 📋 Unit 4: Introduction to Node.js & Express.js

| Experiment | Description | Standalone File | NPM Command | Unified Portal Route |
| :--- | :--- | :--- | :--- | :--- |
| **4.a** | 'Hello World' message in route through browser | [`exercises/unit4/4a_hello_world_route.js`](exercises/unit4/4a_hello_world_route.js) | `npm run 4a` | [http://localhost:5000/lab/4a](http://localhost:5000/lab/4a) |
| **4.b** | Website with multiple routes using Express.js | [`exercises/unit4/4b_multi_route_website.js`](exercises/unit4/4b_multi_route_website.js) | `npm run 4b` | [http://localhost:5000/lab/4b](http://localhost:5000/lab/4b) |
| **4.c** | Print 'Hello World' in browser console via Express | [`exercises/unit4/4c_hello_world_console.js`](exercises/unit4/4c_hello_world_console.js) | `npm run 4c` | [http://localhost:5000/lab/4c](http://localhost:5000/lab/4c) |
| **4.d** | CRUD operations using Express.js (GET, POST, PUT, DELETE) | [`exercises/unit4/4d_crud_express.js`](exercises/unit4/4d_crud_express.js) | `npm run 4d` | [http://localhost:5000/lab/4d](http://localhost:5000/lab/4d) |
| **4.e** | API and Database connection using Express & MySQL driver | [`exercises/unit4/4e_express_mysql.js`](exercises/unit4/4e_express_mysql.js) | `npm run 4e` | [http://localhost:5000/lab/4e](http://localhost:5000/lab/4e) |

---

## 🗄️ Unit 5: Introduction to MySQL

| Experiment | Description | File |
| :--- | :--- | :--- |
| **5.a** | Create Database and Table using MySQL Command line client | [`database/5a_create_db_cli.sql`](database/5a_create_db_cli.sql) |
| **5.b** | MySQL queries to create table, insert data, and update data | [`database/5b_crud_queries.sql`](database/5b_crud_queries.sql) |
| **5.c** | Subqueries in MySQL CLI (Scalar, IN, NOT IN, EXISTS, Derived Tables, Correlated) | [`database/5c_subqueries.sql`](database/5c_subqueries.sql) |
| **5.d** | MySQL Workbench script file (Views, Delimiters, Stored Procedures, ACID Transactions) | [`database/5d_workbench_script.sql`](database/5d_workbench_script.sql) |
| **5.e** | Database directory in Project and `database.sql` initialization integrated with API | [`database/database.sql`](database/database.sql) & [`database/db.js`](database/db.js) |

### Automatic Database Initialization:
If MySQL is running locally:
```bash
npm run db:init
```
This executes [`database/database.sql`](database/database.sql) automatically and seeds all initial tables.
If MySQL is not currently running, the system automatically runs in a resilient mock store mode mirroring 100% of the database schema so the application never breaks.

---

## ⚡ REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Check API server health and MySQL connection status |
| `GET` | `/api/stats` | Retrieve catalog statistics, order counts, and revenue |
| `GET` | `/api/categories` | List all product categories |
| `GET` | `/api/products` | Retrieve all products (supports `?category=...&search=...&sort=...`) |
| `GET` | `/api/products/:id` | Retrieve single product by ID |
| `POST` | `/api/products` | Add new product to catalog |
| `PUT` | `/api/products/:id` | Update product details |
| `DELETE` | `/api/products/:id` | Delete product from catalog |
| `GET` | `/api/orders` | Retrieve list of placed customer orders |
| `POST` | `/api/orders` | Checkout and place new order |
| `PATCH` | `/api/orders/:id/status` | Update order tracking status |
