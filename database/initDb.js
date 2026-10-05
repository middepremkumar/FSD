/**
 * ============================================================================
 * 5.e: Automatic Database Initializer from Node.js
 * File: database/initDb.js
 * Description: Reads database/database.sql and executes the entire SQL script
 *              against the configured MySQL server.
 * ============================================================================
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initializeDatabase() {
  console.log('------------------------------------------------------------');
  console.log('📦 Starting Database Initialization (5.e)...');
  console.log('------------------------------------------------------------');

  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const port = Number(process.env.DB_PORT) || 3306;

  console.log(`Connecting to MySQL Server at ${host}:${port} as ${user}...`);

  let connection;
  try {
    // Connect without specifying database first to allow creating it
    connection = await mysql.createConnection({
      host,
      user,
      password,
      port,
      multipleStatements: true
    });

    console.log('✅ Connected to MySQL server successfully!');

    const sqlFilePath = path.join(__dirname, 'database.sql');
    if (!fs.existsSync(sqlFilePath)) {
      throw new Error(`File not found: ${sqlFilePath}`);
    }

    const sqlScript = fs.readFileSync(sqlFilePath, 'utf-8');
    console.log(`📄 Executing script from: ${sqlFilePath}`);

    await connection.query(sqlScript);

    console.log('🎉 Database and tables created & seeded successfully!');
    console.log('Database Name: amazon_fsd_db');

    // Run quick verification query
    await connection.query('USE amazon_fsd_db');
    const [products] = await connection.query('SELECT product_id, title, price, stock_quantity FROM products LIMIT 5');
    console.log('\nSample records in "products" table:');
    console.table(products);

  } catch (error) {
    console.error('\n❌ Database Initialization Failed!');
    console.error(`Reason: ${error.message}`);
    console.log('\n💡 Troubleshooting Tips:');
    console.log('1. Make sure your MySQL Server / XAMPP / WAMP is running.');
    console.log('2. Check DB_USER and DB_PASSWORD in .env or defaults (user: root, password: "")');
    console.log('3. You can also run database/database.sql directly in MySQL Workbench or phpMyAdmin.');
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔒 Connection closed.');
    }
  }
}

initializeDatabase();
