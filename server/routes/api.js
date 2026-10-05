/**
 * ============================================================================
 * Full Stack API Routes
 * File: server/routes/api.js
 * Description: REST API endpoints for Products, Categories, Orders, and System Stats.
 *              Seamlessly integrates with database/db.js (MySQL pool with graceful fallback).
 * ============================================================================
 */

import express from 'express';
import { executeQuery, testConnection } from '../../database/db.js';

const router = express.Router();

// ----------------------------------------------------------------------------
// Health & DB Status Endpoint
// ----------------------------------------------------------------------------
router.get('/health', async (req, res) => {
  const dbStatus = await testConnection();
  res.json({
    status: 'UP',
    service: 'Amazon FSD API Server',
    timestamp: new Date().toISOString(),
    database: dbStatus
  });
});

// ----------------------------------------------------------------------------
// EXERCISE 4.a: Hello World Route in Express API
// ----------------------------------------------------------------------------
router.get('/hello', (req, res) => {
  res.json({
    success: true,
    concept: 'Unit 4.a (Hello World Route)',
    message: 'Hello World from Amazon Express.js Backend Server!',
    timestamp: new Date().toISOString()
  });
});

// ----------------------------------------------------------------------------
// EXERCISE 5.c: Live MySQL Subqueries in API
// ----------------------------------------------------------------------------
router.get('/subqueries', async (req, res) => {
  try {
    // 1. Scalar Subquery: Products priced above storewide average
    const aboveAvg = await executeQuery(`
      SELECT p.product_id, p.title, p.price, c.name AS category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      WHERE p.price > (SELECT AVG(price) FROM products)
      ORDER BY p.price DESC
      LIMIT 5
    `);

    // 2. IN Subquery: Products belonging to high-tech categories
    const inCategories = await executeQuery(`
      SELECT p.product_id, p.title, p.price, c.name AS category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      WHERE p.category_id IN (SELECT category_id FROM categories WHERE slug IN ('mobiles', 'laptops'))
      ORDER BY p.product_id ASC
      LIMIT 5
    `);

    // 3. EXISTS Subquery: Categories that currently have available inventory
    const existsRes = await executeQuery(`
      SELECT c.category_id, c.name, c.description
      FROM categories c
      WHERE EXISTS (
        SELECT 1 FROM products p 
        WHERE p.category_id = c.category_id AND p.stock_quantity > 0
      )
    `);

    res.json({
      success: true,
      concept: 'Unit 5.c (Subqueries in MySQL)',
      scalarSubquery: {
        title: 'Scalar Subquery: Above Average Price',
        sql: 'SELECT * FROM products WHERE price > (SELECT AVG(price) FROM products)',
        data: aboveAvg.data || []
      },
      inSubquery: {
        title: 'IN Subquery: Mobiles & Laptops Only',
        sql: "SELECT * FROM products WHERE category_id IN (SELECT category_id FROM categories WHERE slug IN ('mobiles', 'laptops'))",
        data: inCategories.data || []
      },
      existsSubquery: {
        title: 'EXISTS Subquery: In-Stock Categories',
        sql: 'SELECT * FROM categories c WHERE EXISTS (SELECT 1 FROM products p WHERE p.category_id = c.category_id AND p.stock_quantity > 0)',
        data: existsRes.data || []
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ----------------------------------------------------------------------------
// Full Curriculum Concepts Matrix
// ----------------------------------------------------------------------------
router.get('/concepts', async (req, res) => {
  const dbStatus = await testConnection();
  res.json({
    success: true,
    title: 'Amazon Shopping - Full Stack Development Curriculum Matrix',
    database: dbStatus,
    unit4: {
      title: 'Unit 4: Node.js and Express.js',
      concepts: [
        { id: '4a', name: 'Hello World Route', route: '/api/hello', description: 'Express route returning Hello World greeting' },
        { id: '4b', name: 'Multi-Route Architecture', routes: ['/api/products', '/api/categories', '/api/orders', '/api/stats'], description: 'Modular Express router structure' },
        { id: '4c', name: 'Browser Console Hello World', description: 'Client & Server console logging on application bootstrap' },
        { id: '4d', name: 'CRUD Operations', operations: ['GET /api/products', 'POST /api/products', 'PUT /api/products/:id', 'DELETE /api/products/:id'], description: 'Full RESTful CRUD for products' },
        { id: '4e', name: 'MySQL Connection Pool', file: 'database/db.js', description: 'mysql2 connection pool provider with resilient mock fallback' }
      ]
    },
    unit5: {
      title: 'Unit 5: Introduction to MySQL',
      concepts: [
        { id: '5a', name: 'Create Database & Tables', file: 'database/database.sql', description: 'DDL schemas for products, categories, orders' },
        { id: '5b', name: 'CRUD Queries', file: 'database/5b_crud_queries.sql', description: 'INSERT, SELECT, UPDATE, DELETE queries' },
        { id: '5c', name: 'Subqueries', route: '/api/subqueries', description: 'Scalar, IN, and EXISTS subqueries in business logic' },
        { id: '5d', name: 'MySQL Workbench Script', file: 'database/5d_workbench_script.sql', description: 'Views, Stored Procedures, ACID Transactions' },
        { id: '5e', name: 'Database Directory & Integration', file: 'database/database.sql', description: 'Directly powers the Express API endpoints' }
      ]
    }
  });
});

// ----------------------------------------------------------------------------
// Dashboard Stats Endpoint
// ----------------------------------------------------------------------------
router.get('/stats', async (req, res) => {
  try {
    const productsRes = await executeQuery('SELECT * FROM products');
    const categoriesRes = await executeQuery('SELECT * FROM categories');
    const ordersRes = await executeQuery('SELECT * FROM orders');

    const products = productsRes.data || [];
    const categories = categoriesRes.data || [];
    const orders = ordersRes.data || [];

    const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
    const lowStockCount = products.filter(p => (Number(p.stock_quantity) || 0) <= 20).length;

    res.json({
      success: true,
      stats: {
        totalProducts: products.length,
        totalCategories: categories.length,
        totalOrders: orders.length,
        totalRevenue: Math.round(totalRevenue),
        lowStockCount
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ----------------------------------------------------------------------------
// GET /api/categories
// ----------------------------------------------------------------------------
router.get('/categories', async (req, res) => {
  try {
    const result = await executeQuery('SELECT * FROM categories ORDER BY category_id ASC');
    res.json({
      success: true,
      source: result.source,
      count: result.data.length,
      data: result.data
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ----------------------------------------------------------------------------
// GET /api/products (READ ALL - with optional category and search filters)
// ----------------------------------------------------------------------------
router.get('/products', async (req, res) => {
  try {
    const { category, search, sort } = req.query;

    let sql = `
      SELECT 
        p.product_id, 
        p.code, 
        p.title, 
        p.category_id,
        c.name AS category_name, 
        p.price, 
        p.original_price, 
        p.rating_rate, 
        p.rating_count, 
        p.deal_tag, 
        p.badge, 
        p.image, 
        p.delivery_info, 
        p.stock_quantity 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
    `;
    const params = [];
    const conditions = [];

    if (category && category !== 'All') {
      conditions.push('(c.name = ? OR c.slug = ?)');
      params.push(category, category.toLowerCase());
    }

    if (search && search.trim()) {
      conditions.push('p.title LIKE ?');
      params.push(`%${search.trim()}%`);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    if (sort === 'price_asc') {
      sql += ' ORDER BY p.price ASC';
    } else if (sort === 'price_desc') {
      sql += ' ORDER BY p.price DESC';
    } else if (sort === 'rating') {
      sql += ' ORDER BY p.rating_rate DESC';
    } else {
      sql += ' ORDER BY p.product_id ASC';
    }

    const result = await executeQuery(sql, params);
    res.json({
      success: true,
      source: result.source,
      count: result.data.length,
      data: result.data
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ----------------------------------------------------------------------------
// GET /api/products/:id (READ ONE)
// ----------------------------------------------------------------------------
router.get('/products/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const sql = `
      SELECT 
        p.product_id, p.code, p.title, p.category_id, c.name AS category_name,
        p.price, p.original_price, p.rating_rate, p.rating_count,
        p.deal_tag, p.badge, p.image, p.delivery_info, p.stock_quantity
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      WHERE p.product_id = ?
    `;
    const result = await executeQuery(sql, [id]);

    if (!result.data || result.data.length === 0) {
      return res.status(404).json({ success: false, message: `Product #${id} not found.` });
    }

    res.json({ success: true, source: result.source, data: result.data[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ----------------------------------------------------------------------------
// POST /api/products (CREATE)
// ----------------------------------------------------------------------------
router.post('/products', async (req, res) => {
  try {
    const { 
      title, 
      category_id, 
      price, 
      original_price, 
      stock_quantity, 
      deal_tag, 
      badge, 
      image, 
      delivery_info 
    } = req.body;

    if (!title || price === undefined) {
      return res.status(400).json({ success: false, message: 'Title and price are required.' });
    }

    const sql = `
      INSERT INTO products (
        title, category_id, price, original_price, stock_quantity, 
        deal_tag, badge, image, delivery_info
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      title.trim(),
      Number(category_id) || 1,
      Number(price),
      original_price ? Number(original_price) : Math.round(Number(price) * 1.25),
      Number(stock_quantity) || 20,
      deal_tag || 'Special Offer',
      badge || 'New Arrival',
      image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
      delivery_info || 'FREE Delivery Tomorrow'
    ];

    const result = await executeQuery(sql, params);

    res.status(201).json({
      success: true,
      message: 'Product successfully added.',
      source: result.source,
      insertId: result.data.insertId
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ----------------------------------------------------------------------------
// PUT /api/products/:id (UPDATE)
// ----------------------------------------------------------------------------
router.put('/products/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { title, price, category_id, stock_quantity, badge, deal_tag } = req.body;

    if (!title || price === undefined) {
      return res.status(400).json({ success: false, message: 'Title and price are required.' });
    }

    const sql = `
      UPDATE products 
      SET title = ?, price = ?, category_id = ?, stock_quantity = ?, badge = ?, deal_tag = ?
      WHERE product_id = ?
    `;
    const params = [
      title.trim(),
      Number(price),
      Number(category_id) || 1,
      Number(stock_quantity) || 20,
      badge || 'Updated',
      deal_tag || 'Deal',
      id
    ];

    const result = await executeQuery(sql, params);

    res.json({
      success: true,
      message: `Product #${id} updated successfully.`,
      source: result.source,
      result: result.data
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ----------------------------------------------------------------------------
// DELETE /api/products/:id (DELETE)
// ----------------------------------------------------------------------------
router.delete('/products/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const sql = `DELETE FROM products WHERE product_id = ?`;
    const result = await executeQuery(sql, [id]);

    res.json({
      success: true,
      message: `Product #${id} removed.`,
      source: result.source,
      result: result.data
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ----------------------------------------------------------------------------
// GET /api/orders (READ ALL ORDERS)
// ----------------------------------------------------------------------------
router.get('/orders', async (req, res) => {
  try {
    const result = await executeQuery('SELECT * FROM orders ORDER BY order_id DESC');
    res.json({
      success: true,
      source: result.source,
      count: result.data.length,
      data: result.data
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ----------------------------------------------------------------------------
// POST /api/orders (CREATE ORDER & CHECKOUT)
// ----------------------------------------------------------------------------
router.post('/orders', async (req, res) => {
  try {
    const { 
      customer_name, 
      customer_email, 
      shipping_address, 
      payment_method, 
      items 
    } = req.body;

    if (!customer_name || !customer_email || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Customer name, email, and at least one order item are required.'
      });
    }

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => {
      const price = Number(item.price || item.unit_price) || 0;
      const qty = Number(item.quantity) || 1;
      return sum + (price * qty);
    }, 0);

    // 1. Insert Order
    const orderSql = `
      INSERT INTO orders (customer_name, customer_email, shipping_address, payment_method, total_amount)
      VALUES (?, ?, ?, ?, ?)
    `;
    const orderParams = [
      customer_name.trim(),
      customer_email.trim(),
      shipping_address || 'India',
      payment_method || 'Cash on Delivery',
      totalAmount
    ];

    const orderRes = await executeQuery(orderSql, orderParams);
    const orderId = orderRes.data.insertId;

    // 2. Insert Order Items & decrement stock
    for (const item of items) {
      const productId = Number(item.id || item.product_id);
      const qty = Number(item.quantity) || 1;
      const unitPrice = Number(item.price || item.unit_price) || 0;

      await executeQuery(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)`,
        [orderId, productId, qty, unitPrice]
      );
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      orderId,
      totalAmount,
      itemCount: items.length,
      estimatedDelivery: 'Tomorrow, between 9 AM and 7 PM',
      source: orderRes.source
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ----------------------------------------------------------------------------
// PATCH /api/orders/:id/status (UPDATE ORDER STATUS)
// ----------------------------------------------------------------------------
router.patch('/orders/:id/status', async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required.' });
    }

    const sql = `UPDATE orders SET order_status = ? WHERE order_id = ?`;
    const result = await executeQuery(sql, [status, id]);

    res.json({
      success: true,
      message: `Order #${id} status updated to '${status}'.`,
      source: result.source,
      result: result.data
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
