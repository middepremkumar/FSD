/**
 * ============================================================================
 * 4.e & 5.e: MySQL Database Connector & Resilient Pool Provider
 * File: database/db.js
 * Description: Establishes connection between Express API and MySQL using mysql2.
 *              Provides connection caching, query execution, transactions, and
 *              an in-memory resilient fallback dataset matching database.sql.
 * ============================================================================
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Default MySQL configuration (can be overridden via environment variables, DATABASE_URL, or .env)
export const dbConfig = process.env.DATABASE_URL
  ? process.env.DATABASE_URL
  : {
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'amazon_fsd_db',
      port: Number(process.env.DB_PORT) || 3306,
      waitForConnections: false,
      connectionLimit: 5,
      queueLimit: 0,
      connectTimeout: 1000
    };

// ============================================================================
// Fallback Mock Dataset (100% synchronized with database.sql)
// ============================================================================
export const fallbackCategories = [
  { category_id: 1, name: 'Mobiles', slug: 'mobiles', description: 'Smartphones, accessories, and wearables' },
  { category_id: 2, name: 'Audio', slug: 'audio', description: 'Headphones, earphones, and Bluetooth speakers' },
  { category_id: 3, name: 'Laptops', slug: 'laptops', description: 'Notebooks, MacBooks, and gaming laptops' },
  { category_id: 4, name: 'Fashion', slug: 'fashion', description: 'Sneakers, clothing, and lifestyle apparel' },
  { category_id: 5, name: 'Smart Wearables', slug: 'wearables', description: 'Smartwatches, fitness bands, and trackers' },
  { category_id: 6, name: 'Cameras', slug: 'cameras', description: 'Mirrorless cameras, action cams, and lenses' }
];

export let fallbackProducts = [
  {
    product_id: 1,
    code: 'prod-1',
    title: 'Apple iPhone 15 (128 GB) - Blue',
    category_id: 1,
    category_name: 'Mobiles',
    price: 69999.00,
    original_price: 79900.00,
    rating_rate: 4.6,
    rating_count: 4820,
    deal_tag: 'Great Indian Deal',
    badge: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80',
    delivery_info: 'FREE Delivery Tomorrow, 7 AM - 9 PM',
    stock_quantity: 40
  },
  {
    product_id: 2,
    code: 'prod-2',
    title: 'Sony WH-1000XM5 Wireless Noise-Cancelling Headphones',
    category_id: 2,
    category_name: 'Audio',
    price: 29990.00,
    original_price: 34990.00,
    rating_rate: 4.8,
    rating_count: 2190,
    deal_tag: 'Limited Deal',
    badge: "Amazon's Choice",
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    delivery_info: 'FREE Delivery by 9 PM Tomorrow',
    stock_quantity: 30
  },
  {
    product_id: 3,
    code: 'prod-3',
    title: 'Apple MacBook Air 13" M2 Chip (8GB RAM, 256GB SSD) - Starlight',
    category_id: 3,
    category_name: 'Laptops',
    price: 89900.00,
    original_price: 99900.00,
    rating_rate: 4.9,
    rating_count: 1430,
    deal_tag: 'Flat ₹10,000 Off',
    badge: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
    delivery_info: 'FREE Delivery Tomorrow',
    stock_quantity: 15
  },
  {
    product_id: 4,
    code: 'prod-4',
    title: 'Samsung Galaxy S24 Ultra 5G (Titanium Gray, 256GB Storage)',
    category_id: 1,
    category_name: 'Mobiles',
    price: 129999.00,
    original_price: 134999.00,
    rating_rate: 4.7,
    rating_count: 3200,
    deal_tag: 'Exchange Offer',
    badge: 'Top Brand',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80',
    delivery_info: 'FREE Delivery by Today 10 PM',
    stock_quantity: 20
  },
  {
    product_id: 5,
    code: 'prod-5',
    title: "Nike Air Max 270 Men's Athletic Running & Lifestyle Sneakers",
    category_id: 4,
    category_name: 'Fashion',
    price: 12495.00,
    original_price: 14995.00,
    rating_rate: 4.5,
    rating_count: 1870,
    deal_tag: '17% off',
    badge: 'Popular Pick',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    delivery_info: 'FREE Delivery Tomorrow',
    stock_quantity: 50
  },
  {
    product_id: 6,
    code: 'prod-6',
    title: 'Apple Watch Series 9 GPS 45mm Midnight Aluminium Case',
    category_id: 5,
    category_name: 'Smart Wearables',
    price: 41900.00,
    original_price: 44900.00,
    rating_rate: 4.7,
    rating_count: 980,
    deal_tag: 'Bank Offer',
    badge: "Amazon's Choice",
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    delivery_info: 'FREE Delivery Tomorrow',
    stock_quantity: 25
  },
  {
    product_id: 7,
    code: 'prod-7',
    title: 'Sony Alpha 7 IV Full-Frame Mirrorless Interchangeable Lens Camera',
    category_id: 6,
    category_name: 'Cameras',
    price: 214990.00,
    original_price: 242490.00,
    rating_rate: 4.9,
    rating_count: 410,
    deal_tag: 'Special Price',
    badge: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80',
    delivery_info: 'FREE Delivery Tomorrow',
    stock_quantity: 10
  },
  {
    product_id: 8,
    code: 'prod-8',
    title: "Levi's Men's 511 Slim Fit Jeans (Dark Indigo Wash)",
    category_id: 4,
    category_name: 'Fashion',
    price: 2599.00,
    original_price: 3999.00,
    rating_rate: 4.3,
    rating_count: 3120,
    deal_tag: '35% off',
    badge: 'Trending',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80',
    delivery_info: 'FREE Delivery by Today 8 PM',
    stock_quantity: 80
  }
];

export let fallbackOrders = [
  {
    order_id: 1,
    customer_name: 'Rahul Sharma',
    customer_email: 'rahul.sharma@example.com',
    shipping_address: 'Flat 402, Sunshine Heights, Andheri West, Mumbai 400053',
    payment_method: 'UPI',
    total_amount: 69999.00,
    order_status: 'delivered',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    items: [
      {
        order_item_id: 1,
        product_id: 1,
        title: 'Apple iPhone 15 (128 GB) - Blue',
        quantity: 1,
        unit_price: 69999.00,
        image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    order_id: 2,
    customer_name: 'Priya Patel',
    customer_email: 'priya.patel@example.com',
    shipping_address: 'B-12, Green Park Avenue, Ahmedabad 380015',
    payment_method: 'Credit Card',
    total_amount: 29990.00,
    order_status: 'shipped',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    items: [
      {
        order_item_id: 2,
        product_id: 2,
        title: 'Sony WH-1000XM5 Wireless Noise-Cancelling Headphones',
        quantity: 1,
        unit_price: 29990.00,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    order_id: 3,
    customer_name: 'Amit Verma',
    customer_email: 'amit.verma@example.com',
    shipping_address: 'Flat 104, Cyber City Suites, Bengaluru 560100',
    payment_method: 'Cash on Delivery',
    total_amount: 12495.00,
    order_status: 'processing',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    items: [
      {
        order_item_id: 3,
        product_id: 5,
        title: "Nike Air Max 270 Men's Athletic Running & Lifestyle Sneakers",
        quantity: 1,
        unit_price: 12495.00,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80'
      }
    ]
  }
];

let nextOrderId = 4;
let nextOrderItemId = 4;

let pool = null;
let lastTestedAt = 0;
let cachedStatus = null;
const CACHE_TTL_SUCCESS_MS = 10000;
const CACHE_TTL_FAIL_MS = 30000; // Cache offline/fallback for 30s so requests are instant (0ms delay)

// Initialize MySQL pool safely
try {
  pool = mysql.createPool(dbConfig);
} catch (err) {
  cachedStatus = {
    connected: false,
    mode: 'mock_fallback',
    message: 'MySQL pool could not be initialized.',
    error: err.message
  };
}

/**
 * Fast connection probe with timeout race
 */
export async function testConnection(forceFresh = false) {
  const now = Date.now();
  const ttl = cachedStatus?.connected ? CACHE_TTL_SUCCESS_MS : CACHE_TTL_FAIL_MS;
  if (!forceFresh && cachedStatus && (now - lastTestedAt < ttl)) {
    return cachedStatus;
  }

  if (!pool) {
    cachedStatus = {
      connected: false,
      mode: 'mock_fallback',
      message: 'MySQL pool not initialized. Running in resilient mock store mode.',
      error: 'No pool'
    };
    lastTestedAt = now;
    return cachedStatus;
  }

  try {
    // 600ms strict timeout race to guarantee zero UI blocking
    const probePromise = (async () => {
      const conn = await pool.getConnection();
      const [rows] = await conn.query('SELECT 1 + 1 AS result, VERSION() AS mysql_version');
      conn.release();
      return rows;
    })();

    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('MySQL connection probe timed out (service likely not running)')), 600)
    );

    const rows = await Promise.race([probePromise, timeoutPromise]);

    cachedStatus = {
      connected: true,
      mode: 'mysql',
      version: rows[0]?.mysql_version,
      database: dbConfig.database,
      host: dbConfig.host,
      message: 'Successfully connected to MySQL database!'
    };
  } catch (error) {
    cachedStatus = {
      connected: false,
      mode: 'mock_fallback',
      message: 'MySQL is not running locally. Running in resilient fallback mode.',
      error: error.message,
      troubleshooting: 'To connect to real MySQL: Start MySQL in XAMPP or Services, then run: npm run db:init'
    };
  }

  lastTestedAt = now;
  return cachedStatus;
}

/**
 * Unified Query Runner (Queries MySQL, or falls back gracefully)
 */
export async function executeQuery(sql, params = []) {
  const status = await testConnection();

  if (status.connected && pool) {
    try {
      const [results, fields] = await pool.query(sql, params);
      return {
        source: 'mysql',
        data: results,
        fields
      };
    } catch (sqlErr) {
      console.warn(`[MySQL Error] ${sqlErr.message}. Falling back to resilient store.`);
    }
  }

  // Graceful Fallback operations for CRUD when MySQL is not active
  const lowerSql = sql.trim().toLowerCase();

  // 1. SELECT QUERIES
  if (lowerSql.startsWith('select')) {
    // Categories
    if (lowerSql.includes('from categories')) {
      return { source: 'fallback_mock', data: fallbackCategories };
    }

    // Orders
    if (lowerSql.includes('from orders')) {
      if (lowerSql.includes('where order_id =') || lowerSql.includes('where order_id=')) {
        const id = Number(params[0]);
        const order = fallbackOrders.find(o => o.order_id === id);
        return { source: 'fallback_mock', data: order ? [order] : [] };
      }
      return { source: 'fallback_mock', data: [...fallbackOrders].reverse() };
    }

    // Single Product
    if (lowerSql.includes('where p.product_id =') || lowerSql.includes('where product_id =') || lowerSql.includes('where product_id=')) {
      const id = Number(params[0]);
      const prod = fallbackProducts.find(p => p.product_id === id);
      return { source: 'fallback_mock', data: prod ? [prod] : [] };
    }

    // Products list with dynamic filtering
    let results = [...fallbackProducts];

    // Check if category filter was passed in params
    if (params.length > 0 && lowerSql.includes('(c.name = ? or c.slug = ?)')) {
      const categoryParam = String(params[0]).toLowerCase();
      results = results.filter(p => 
        (p.category_name && p.category_name.toLowerCase() === categoryParam) ||
        (p.category && p.category.toLowerCase() === categoryParam)
      );
    }

    // Check if search query was passed
    if (lowerSql.includes('p.title like ?')) {
      const searchParamIndex = lowerSql.includes('(c.name = ? or c.slug = ?)') ? 2 : 0;
      const searchRaw = params[searchParamIndex];
      if (searchRaw) {
        const searchStr = String(searchRaw).replace(/%/g, '').toLowerCase().trim();
        results = results.filter(p => 
          p.title.toLowerCase().includes(searchStr) || 
          (p.category_name && p.category_name.toLowerCase().includes(searchStr))
        );
      }
    }

    return { source: 'fallback_mock', data: results };
  }

  // 2. INSERT QUERIES
  if (lowerSql.startsWith('insert into products')) {
    const newId = fallbackProducts.length ? Math.max(...fallbackProducts.map(p => p.product_id)) + 1 : 1;
    const cat = fallbackCategories.find(c => c.category_id === Number(params[1])) || fallbackCategories[0];

    const newProduct = {
      product_id: newId,
      code: `prod-${newId}`,
      title: params[0] || 'New Product',
      category_id: cat.category_id,
      category_name: cat.name,
      price: Number(params[2]) || 999.00,
      original_price: params[3] ? Number(params[3]) : Math.round((Number(params[2]) || 999) * 1.25),
      stock_quantity: Number(params[4]) || 20,
      deal_tag: params[5] || 'Special Deal',
      badge: params[6] || 'New Arrival',
      image: params[7] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
      delivery_info: params[8] || 'FREE Delivery Tomorrow',
      rating_rate: 4.8,
      rating_count: 1
    };

    fallbackProducts.unshift(newProduct);
    return {
      source: 'fallback_mock',
      data: { insertId: newId, affectedRows: 1, message: 'Inserted into mock catalog store' }
    };
  }

  if (lowerSql.startsWith('insert into orders')) {
    const orderId = nextOrderId++;
    const newOrder = {
      order_id: orderId,
      customer_name: params[0],
      customer_email: params[1],
      shipping_address: params[2] || 'India',
      payment_method: params[3] || 'Cash on Delivery',
      total_amount: Number(params[4]),
      order_status: 'processing',
      created_at: new Date().toISOString(),
      items: []
    };
    fallbackOrders.push(newOrder);
    return {
      source: 'fallback_mock',
      data: { insertId: orderId, affectedRows: 1 }
    };
  }

  if (lowerSql.startsWith('insert into order_items')) {
    const itemId = nextOrderItemId++;
    const orderId = Number(params[0]);
    const productId = Number(params[1]);
    const quantity = Number(params[2]);
    const unitPrice = Number(params[3]);

    const order = fallbackOrders.find(o => o.order_id === orderId);
    const prod = fallbackProducts.find(p => p.product_id === productId);

    if (order) {
      order.items.push({
        order_item_id: itemId,
        product_id: productId,
        title: prod ? prod.title : `Product #${productId}`,
        quantity,
        unit_price: unitPrice,
        image: prod ? prod.image : ''
      });
    }

    // Decrement stock
    if (prod && prod.stock_quantity >= quantity) {
      prod.stock_quantity -= quantity;
    }

    return {
      source: 'fallback_mock',
      data: { insertId: itemId, affectedRows: 1 }
    };
  }

  // 3. UPDATE QUERIES
  if (lowerSql.startsWith('update products')) {
    const id = Number(params[params.length - 1]);
    const index = fallbackProducts.findIndex(p => p.product_id === id);
    if (index !== -1) {
      if (params[0] !== undefined) fallbackProducts[index].title = params[0];
      if (params[1] !== undefined) fallbackProducts[index].price = Number(params[1]);
      if (params[2] !== undefined) {
        fallbackProducts[index].category_id = Number(params[2]);
        const cat = fallbackCategories.find(c => c.category_id === Number(params[2]));
        if (cat) fallbackProducts[index].category_name = cat.name;
      }
      if (params[3] !== undefined) fallbackProducts[index].stock_quantity = Number(params[3]);
      if (params[4] !== undefined) fallbackProducts[index].badge = params[4];
      if (params[5] !== undefined) fallbackProducts[index].deal_tag = params[5];

      return {
        source: 'fallback_mock',
        data: { affectedRows: 1, message: 'Updated product in catalog store' }
      };
    }
    return { source: 'fallback_mock', data: { affectedRows: 0 } };
  }

  if (lowerSql.startsWith('update orders')) {
    const statusVal = params[0];
    const orderId = Number(params[1]);
    const order = fallbackOrders.find(o => o.order_id === orderId);
    if (order) {
      order.order_status = statusVal;
      return { source: 'fallback_mock', data: { affectedRows: 1 } };
    }
    return { source: 'fallback_mock', data: { affectedRows: 0 } };
  }

  // 4. DELETE QUERIES
  if (lowerSql.startsWith('delete from products')) {
    const id = Number(params[0]);
    const beforeLen = fallbackProducts.length;
    fallbackProducts = fallbackProducts.filter(p => p.product_id !== id);
    return {
      source: 'fallback_mock',
      data: { affectedRows: beforeLen - fallbackProducts.length, message: 'Deleted from catalog store' }
    };
  }

  return { source: 'fallback_mock', data: [] };
}

export default {
  pool,
  dbConfig,
  testConnection,
  executeQuery,
  fallbackCategories,
  fallbackProducts,
  fallbackOrders
};
