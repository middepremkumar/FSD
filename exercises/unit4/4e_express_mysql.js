/**
 * ============================================================================
 * 4.e: Establish Connection between API and Database using Express & MySQL Driver
 * File: exercises/unit4/4e_express_mysql.js
 * Description: Demonstrates connection setup, connection pooling, and error handling
 *              between an Express API and a MySQL database using the mysql2 driver.
 * Run command: node exercises/unit4/4e_express_mysql.js
 * Or: npm run 4e
 * ============================================================================
 */

import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3005;

app.use(cors());
app.use(express.json());

// MySQL Connection Configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'amazon_fsd_db',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 4000
};

// Create the MySQL connection pool
const pool = mysql.createPool(dbConfig);

// Cache connection check result
let connectionState = {
  tested: false,
  isConnected: false,
  details: null,
  error: null
};

/**
 * Helper to check MySQL connection health
 */
async function checkMySQLConnection() {
  const startTime = Date.now();
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(`
      SELECT 
        VERSION() AS server_version, 
        DATABASE() AS current_database,
        NOW() AS server_time,
        CURRENT_USER() AS connected_user
    `);
    connection.release();

    const latency = Date.now() - startTime;
    connectionState = {
      tested: true,
      isConnected: true,
      latencyMs: latency,
      details: rows[0],
      config: {
        host: dbConfig.host,
        port: dbConfig.port,
        user: dbConfig.user,
        database: dbConfig.database
      },
      error: null
    };
    return connectionState;
  } catch (err) {
    connectionState = {
      tested: true,
      isConnected: false,
      latencyMs: Date.now() - startTime,
      details: null,
      config: {
        host: dbConfig.host,
        port: dbConfig.port,
        user: dbConfig.user,
        database: dbConfig.database
      },
      error: {
        code: err.code || 'UNKNOWN_ERROR',
        message: err.message
      }
    };
    return connectionState;
  }
}

// ----------------------------------------------------------------------------
// API Route 1: Check Connection Status
// ----------------------------------------------------------------------------
app.get('/api/db/connection-status', async (req, res) => {
  const status = await checkMySQLConnection();
  if (status.isConnected) {
    res.status(200).json({
      status: 'ONLINE',
      message: 'Express API is successfully connected to MySQL Database!',
      ...status
    });
  } else {
    res.status(503).json({
      status: 'OFFLINE_OR_UNREACHABLE',
      message: 'Failed to connect to MySQL database server.',
      troubleshooting: [
        '1. Ensure MySQL server is running (Start Apache & MySQL in XAMPP, or start MySQL Windows service).',
        '2. Verify DB_USER and DB_PASSWORD credentials in your environment or .env file.',
        '3. Make sure database amazon_fsd_db exists (Run: npm run db:init or execute database/database.sql).'
      ],
      ...status
    });
  }
});

// ----------------------------------------------------------------------------
// API Route 2: Test Query (SELECT 1 + 1)
// ----------------------------------------------------------------------------
app.get('/api/db/test-query', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS arithmetic_test, NOW() AS current_server_time');
    res.json({
      success: true,
      query: 'SELECT 1 + 1 AS arithmetic_test, NOW() AS current_server_time',
      results: rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      code: error.code
    });
  }
});

// ----------------------------------------------------------------------------
// API Route 3: Query Table Data (Products)
// ----------------------------------------------------------------------------
app.get('/api/db/products', async (req, res) => {
  try {
    const [products] = await pool.query(`
      SELECT 
        p.product_id, 
        p.title, 
        c.name AS category_name, 
        p.price, 
        p.stock_quantity,
        p.deal_tag
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      LIMIT 10
    `);

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error executing query on MySQL table "products".',
      error: error.message,
      hint: 'Run "npm run db:init" to create and seed the tables in MySQL.'
    });
  }
});

// ----------------------------------------------------------------------------
// Visual Browser Interface (GET /)
// ----------------------------------------------------------------------------
app.get('/', async (req, res) => {
  const status = await checkMySQLConnection();

  const isConnected = status.isConnected;
  const statusColor = isConnected ? '#10b981' : '#f59e0b';
  const statusBadge = isConnected ? '🟢 CONNECTED' : '🟡 STANDBY / NOT CONNECTED';

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Lab 4.e - Express MySQL Database Connection</title>
      <style>
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #0b0f19;
          color: #e2e8f0;
          padding: 30px;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
        }
        .header {
          background: #1e293b;
          border: 1px solid #334155;
          padding: 24px;
          border-radius: 12px;
          margin-bottom: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .header h1 { margin: 0; font-size: 24px; color: #38bdf8; }
        .status-badge {
          background: ${isConnected ? '#064e3b' : '#78350f'};
          color: ${statusColor};
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 700;
          font-size: 14px;
          border: 1px solid ${statusColor};
        }
        .card {
          background: #1e293b;
          border: 1px solid #334155;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
        }
        h2 { color: #f8fafc; font-size: 18px; margin-top: 0; }
        table.config-table {
          width: 100%;
          border-collapse: collapse;
          margin: 16px 0;
        }
        table.config-table td {
          padding: 10px 12px;
          border-bottom: 1px solid #334155;
          font-size: 14px;
        }
        table.config-table td.label {
          color: #94a3b8;
          width: 180px;
          font-weight: 600;
        }
        .btn {
          background: #38bdf8;
          color: #0b0f19;
          border: none;
          font-weight: 700;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        }
        .btn:hover { background: #0ea5e9; }
        .log-box {
          background: #020617;
          border: 1px solid #1e293b;
          border-radius: 8px;
          padding: 16px;
          color: #38bdf8;
          font-family: 'Consolas', monospace;
          font-size: 13px;
          white-space: pre-wrap;
          margin-top: 14px;
        }
        .tip-box {
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid #f59e0b;
          padding: 16px;
          border-radius: 8px;
          color: #fbbf24;
          font-size: 14px;
          line-height: 1.5;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div>
            <h1>Exercise 4.e: Express & MySQL Driver Connection</h1>
            <div style="font-size: 13px; color: #94a3b8; margin-top: 4px;">Express.js 5 + mysql2 Connection Pool Architecture</div>
          </div>
          <div class="status-badge">${statusBadge}</div>
        </div>

        <div class="card">
          <h2>📡 Connection Configuration Parameters</h2>
          <table class="config-table">
            <tr>
              <td class="label">Database Host:</td>
              <td><code>${dbConfig.host}</code></td>
            </tr>
            <tr>
              <td class="label">Database Port:</td>
              <td><code>${dbConfig.port}</code></td>
            </tr>
            <tr>
              <td class="label">Database User:</td>
              <td><code>${dbConfig.user}</code></td>
            </tr>
            <tr>
              <td class="label">Target Database:</td>
              <td><code>${dbConfig.database}</code></td>
            </tr>
            <tr>
              <td class="label">Connection Latency:</td>
              <td>${status.latencyMs} ms</td>
            </tr>
            ${isConnected ? `
            <tr>
              <td class="label">MySQL Server Version:</td>
              <td><strong>${status.details.server_version}</strong></td>
            </tr>
            ` : `
            <tr>
              <td class="label">Last Error Message:</td>
              <td style="color: #ef4444;"><code>${status.error?.message || 'Connection refused'}</code></td>
            </tr>
            `}
          </table>

          ${!isConnected ? `
          <div class="tip-box">
            <strong>💡 MySQL Server Offline / Not Found:</strong><br>
            If MySQL is installed on your computer (e.g., via XAMPP, WAMP, or MySQL Server), please start the MySQL service and run:
            <br><code>npm run db:init</code> to initialize the database tables.
          </div>
          ` : ''}
        </div>

        <div class="card">
          <h2>🧪 Interactive Test Endpoints</h2>
          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <button class="btn" onclick="callApi('/api/db/connection-status')">Check Connection Status</button>
            <button class="btn" onclick="callApi('/api/db/test-query')">Execute SELECT 1+1</button>
            <button class="btn" onclick="callApi('/api/db/products')">Query Products Table</button>
          </div>

          <div class="log-box" id="output">Click an endpoint button above to test the Express - MySQL connection in real time.</div>
        </div>
      </div>

      <script>
        async function callApi(url) {
          const out = document.getElementById('output');
          out.textContent = 'Calling ' + url + '...';
          try {
            const res = await fetch(url);
            const data = await res.json();
            out.textContent = 'HTTP ' + res.status + '\\n' + JSON.stringify(data, null, 2);
          } catch (e) {
            out.textContent = 'Fetch failed: ' + e.message;
          }
        }
      </script>
    </body>
    </html>
  `);
});

app.listen(PORT, async () => {
  console.log('============================================================');
  console.log(`🔌 [Lab 4.e] Express MySQL Connection Server running at: http://localhost:${PORT}`);
  console.log(`👉 Open http://localhost:${PORT} in your browser to inspect connection health`);
  console.log('============================================================');
  
  // Test connection on boot
  const initialCheck = await checkMySQLConnection();
  if (initialCheck.isConnected) {
    console.log('✅ Connected to MySQL Server successfully!');
    console.log(`   MySQL Version: ${initialCheck.details.server_version}`);
  } else {
    console.log('ℹ️  MySQL Server not detected on localhost:3306. Note: Server is running in standby mode.');
  }
});
