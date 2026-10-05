/**
 * ============================================================================
 * Unified Full Stack Development Server & Lab Portal
 * File: server/index.js
 * Description: Integrates Unit 4 (Express & Node.js) and Unit 5 (MySQL & API Integration)
 *              into a unified server with an interactive browser portal on Port 5000.
 * ============================================================================
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import apiRouter from './routes/api.js';
import { testConnection } from '../database/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve built React assets if dist exists
const distPath = path.join(projectRoot, 'dist');
if (fs.existsSync(distPath)) {
  app.use('/assets', express.static(path.join(distPath, 'assets')));
}

// Mount Main Full-Stack API Router
app.use('/api', apiRouter);

// ----------------------------------------------------------------------------
// EXERCISE 4.a: Hello World Route in Browser
// ----------------------------------------------------------------------------
app.get('/lab/4a', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Lab 4.a - Hello World Route</title>
      <style>
        body { font-family: -apple-system, sans-serif; text-align: center; padding: 60px 20px; background: #0f172a; color: white; min-height: 100vh; margin: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .card { background: #1e293b; border: 1px solid #334155; padding: 40px; border-radius: 16px; max-width: 600px; width: 100%; box-shadow: 0 10px 25px rgba(0,0,0,0.4); }
        h1 { color: #10b981; font-size: 52px; margin: 16px 0; }
        h2 { color: #ff9900; margin: 0; font-size: 20px; }
        p { color: #94a3b8; font-size: 16px; }
        a { color: #38bdf8; text-decoration: none; font-weight: 600; display: inline-block; margin-top: 20px; }
        a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <div class="card">
        <h2>Lab 4.a: Express.js Route</h2>
        <h1>Hello World</h1>
        <p>Rendered directly through the browser route using Express.js!</p>
        <a href="/">⬅ Back to Lab Portal</a>
      </div>
    </body>
    </html>
  `);
});

// ----------------------------------------------------------------------------
// EXERCISE 4.b: Small Website with Multiple Routes
// ----------------------------------------------------------------------------
const lab4bRouter = express.Router();

function render4bLayout(title, activePath, content) {
  const nav = [
    { label: 'Home', path: '/lab/4b' },
    { label: 'About Us', path: '/lab/4b/about' },
    { label: 'Products', path: '/lab/4b/products' },
    { label: 'Services', path: '/lab/4b/services' },
    { label: 'Contact', path: '/lab/4b/contact' }
  ];
  const links = nav.map(n => `<a href="${n.path}" style="color: ${activePath === n.path ? '#ff9900' : '#fff'}; font-weight: bold; text-decoration: none; margin-right: 18px; padding-bottom: 4px; border-bottom: ${activePath === n.path ? '2px solid #ff9900' : 'none'};">${n.label}</a>`).join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${title} - Lab 4.b Multi-Route Website</title>
      <style>
        body { margin: 0; font-family: -apple-system, sans-serif; background: #eaeded; color: #1e293b; display: flex; flex-direction: column; min-height: 100vh; }
        header { background: #131921; color: white; padding: 14px 28px; display: flex; align-items: center; justify-content: space-between; }
        nav { background: #232f3e; padding: 10px 28px; }
        main { max-width: 1000px; margin: 30px auto; padding: 30px; background: white; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); flex: 1; width: 100%; box-sizing: border-box; }
        footer { background: #131921; color: #94a3b8; text-align: center; padding: 16px; font-size: 13px; margin-top: auto; }
        .back-link { color: #ff9900; text-decoration: none; font-size: 13px; font-weight: 700; }
      </style>
    </head>
    <body>
      <header>
        <div style="font-size: 22px; font-weight: 800; color: #fff;">amazon<span style="color:#ff9900;">.in</span> <small style="font-size: 13px; color:#cbd5e1; font-weight: normal;">• Lab 4.b Multi-Route Site</small></div>
        <a href="/" class="back-link">⬅ Back to Lab Portal</a>
      </header>
      <nav>${links}</nav>
      <main>
        <h2>${title}</h2>
        ${content}
      </main>
      <footer>Lab 4.b: Multi-route Express application running on Port ${PORT}</footer>
    </body>
    </html>
  `;
}

lab4bRouter.get('/', (req, res) => {
  res.send(render4bLayout('Home Page', '/lab/4b', `
    <p>Welcome to the <strong>Express.js Multi-Route Website</strong> (Exercise 4.b).</p>
    <p>This application demonstrates client request routing through Express handlers, separate URL paths, and dynamic templating.</p>
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 24px;">
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #cbd5e1;"><b>Fast Routing</b><p style="font-size: 13px; color: #64748b; margin-top: 6px;">Native Express.js router handling distinct endpoints.</p></div>
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #cbd5e1;"><b>Clean Layouts</b><p style="font-size: 13px; color: #64748b; margin-top: 6px;">Unified header, navigation, and content architecture.</p></div>
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #cbd5e1;"><b>Full Stack Ready</b><p style="font-size: 13px; color: #64748b; margin-top: 6px;">Integrated with MySQL and REST data services.</p></div>
    </div>
  `));
});

lab4bRouter.get('/about', (req, res) => {
  res.send(render4bLayout('About Us', '/lab/4b/about', `
    <p>We are building full-stack web applications using Node.js, Express.js, and MySQL.</p>
    <p>Unit 4 covers backend server architecture, middleware, routing, and REST APIs.</p>
  `));
});

lab4bRouter.get('/products', (req, res) => {
  res.send(render4bLayout('Featured Products', '/lab/4b/products', `
    <p>Browse top gadgets and tech catalog items:</p>
    <ul>
      <li><strong>Apple iPhone 15:</strong> 128 GB - ₹69,999</li>
      <li><strong>Sony WH-1000XM5:</strong> Wireless Headphones - ₹29,990</li>
      <li><strong>Apple MacBook Air:</strong> 13" M2 Chip - ₹89,900</li>
      <li><strong>Samsung Galaxy S24 Ultra:</strong> 256GB - ₹1,29,999</li>
    </ul>
    <p><a href="/app" style="color:#0284c7; font-weight:bold;">Switch to full React Shopping App ➔</a></p>
  `));
});

lab4bRouter.get('/services', (req, res) => {
  res.send(render4bLayout('Our Services', '/lab/4b/services', `
    <p>We offer reliable e-commerce and full-stack solutions:</p>
    <ul>
      <li>Fast 1-Day Prime Delivery</li>
      <li>256-bit Secure Online Transactions</li>
      <li>24/7 Dedicated Customer Support</li>
      <li>Seamless Cloud & Database Backups</li>
    </ul>
  `));
});

lab4bRouter.get('/contact', (req, res) => {
  res.send(render4bLayout('Contact Us', '/lab/4b/contact', `
    <p>Have questions or feedback? Reach out to our lab team:</p>
    <form style="display:flex; flex-direction:column; gap: 12px; max-width: 400px; margin-top: 16px;">
      <input placeholder="Your Name" style="padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px;" />
      <input type="email" placeholder="Your Email" style="padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px;" />
      <textarea rows="4" placeholder="Your Message" style="padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px;"></textarea>
      <button type="button" onclick="alert('Message received! Thank you for reaching out.')" style="background:#ff9900; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;">Send Message</button>
    </form>
  `));
});

app.use('/lab/4b', lab4bRouter);

// ----------------------------------------------------------------------------
// EXERCISE 4.c: Browser Console Hello World
// ----------------------------------------------------------------------------
app.get('/lab/4c', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Lab 4.c - Console Hello World</title>
      <style>
        body { font-family: -apple-system, sans-serif; background: #0d1117; color: #c9d1d9; padding: 40px 20px; text-align: center; }
        .box { max-width: 600px; margin: 40px auto; background: #161b22; border: 1px solid #30363d; padding: 30px; border-radius: 12px; }
        .code { background: #000; color: #7ee787; padding: 14px; border-radius: 6px; font-family: monospace; margin: 20px 0; text-align: left; }
        button { background: #238636; color: white; border: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 14px; }
        button:hover { background: #2ea043; }
        a { color: #58a6ff; text-decoration: none; font-weight: 600; display: inline-block; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="box">
        <h2 style="color: #58a6ff; margin-top: 0;">Lab 4.c: Browser Console Hello World</h2>
        <p>Press <strong>F12</strong> (or <strong>Ctrl + Shift + I</strong>) -> click <strong>Console</strong> tab to inspect the log output.</p>
        <div class="code" id="mirror">> Console output initializing...</div>
        <button onclick="logHello()">Trigger console.log("Hello World")</button>
        <div><a href="/">⬅ Back to Lab Portal</a></div>
      </div>
      <script>
        function logHello() {
          console.log("Hello World");
          console.info("%c[Lab 4.c] Hello World from Express.js!", "color: #00ff88; font-size: 16px; font-weight: bold;");
          document.getElementById('mirror').innerHTML = '> [' + new Date().toLocaleTimeString() + '] console.log("Hello World") executed!';
        }
        window.onload = logHello;
      </script>
    </body>
    </html>
  `);
});

// ----------------------------------------------------------------------------
// EXERCISE 4.d: Interactive Live CRUD Operations Dashboard
// ----------------------------------------------------------------------------
app.get('/lab/4d', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Lab 4.d - Express CRUD Dashboard</title>
      <style>
        body { font-family: -apple-system, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 24px; }
        .container { max-width: 1100px; margin: 0 auto; }
        header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #ff9900; padding-bottom: 16px; margin-bottom: 24px; }
        h1 { margin: 0; font-size: 24px; color: #fff; }
        h1 span { color: #ff9900; }
        .grid { display: grid; grid-template-columns: 360px 1fr; gap: 24px; }
        .panel { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 20px; }
        .form-group { margin-bottom: 12px; }
        label { display: block; font-size: 12px; font-weight: 700; color: #94a3b8; margin-bottom: 4px; }
        input, select { width: 100%; padding: 8px 12px; border-radius: 6px; border: 1px solid #475569; background: #0f172a; color: #fff; box-sizing: border-box; }
        button { background: #ff9900; color: #111; border: none; padding: 10px 16px; border-radius: 6px; font-weight: 700; cursor: pointer; }
        button.secondary { background: #475569; color: #fff; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 13px; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #334155; }
        th { color: #94a3b8; background: #0f172a; }
        .log-box { background: #020617; border: 1px solid #334155; color: #38bdf8; font-family: monospace; font-size: 11px; padding: 12px; border-radius: 6px; max-height: 140px; overflow-y: auto; margin-top: 16px; }
        a { color: #38bdf8; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <header>
          <h1>Lab 4.d: Express.js <span>CRUD Operations</span></h1>
          <a href="/">⬅ Back to Lab Portal</a>
        </header>

        <div class="grid">
          <!-- Form -->
          <div class="panel">
            <h3 id="formTitle" style="margin-top:0;">➕ Add Product (CREATE)</h3>
            <form id="crudForm" onsubmit="handleCrudSubmit(event)">
              <input type="hidden" id="editId" />
              <div class="form-group">
                <label>Title *</label>
                <input id="prodTitle" required placeholder="Product Title" />
              </div>
              <div class="form-group">
                <label>Category</label>
                <select id="prodCategory">
                  <option value="1">Mobiles</option>
                  <option value="2">Audio</option>
                  <option value="3">Laptops</option>
                  <option value="4">Fashion</option>
                  <option value="5">Smart Wearables</option>
                  <option value="6">Cameras</option>
                </select>
              </div>
              <div class="form-group">
                <label>Price (₹) *</label>
                <input id="prodPrice" type="number" required placeholder="Price in ₹" />
              </div>
              <div class="form-group">
                <label>Stock</label>
                <input id="prodStock" type="number" value="25" />
              </div>
              <div style="display:flex; gap: 8px; margin-top: 14px;">
                <button type="submit" id="saveBtn">Save Product</button>
                <button type="button" class="secondary" id="cancelBtn" style="display:none;" onclick="resetCrudForm()">Cancel</button>
              </div>
            </form>

            <div class="log-box" id="activityLog">Activity Log ready.</div>
          </div>

          <!-- Table -->
          <div class="panel">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <h3 style="margin:0;">📦 Current Database Inventory (READ)</h3>
              <button class="secondary" onclick="loadTableData()">🔄 Refresh</button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="tableBody">
                <tr><td colspan="6" style="text-align:center;">Loading records...</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <script>
        function log(msg) {
          const el = document.getElementById('activityLog');
          el.innerHTML = '[' + new Date().toLocaleTimeString() + '] ' + msg + '<br>' + el.innerHTML;
        }

        async function loadTableData() {
          try {
            const res = await fetch('/api/products');
            const json = await res.json();
            const tbody = document.getElementById('tableBody');
            tbody.innerHTML = '';
            json.data.forEach(p => {
              const tr = document.createElement('tr');
              tr.innerHTML = \`
                <td>#\${p.product_id || p.id}</td>
                <td><b>\${p.title}</b></td>
                <td>\${p.category_name || p.category || 'General'}</td>
                <td style="color:#ff9900; font-weight:bold;">₹\${Number(p.price).toLocaleString('en-IN')}</td>
                <td>\${p.stock_quantity || 20}</td>
                <td>
                  <button style="padding:4px 8px; font-size:11px;" onclick="editProduct(\${p.product_id || p.id}, '\${p.title.replace(/'/g, "\\\\'")}', \${p.price}, \${p.stock_quantity || 20})">✏️ Edit</button>
                  <button style="padding:4px 8px; font-size:11px; background:#ef4444; color:white;" onclick="deleteProduct(\${p.product_id || p.id})">🗑️ Delete</button>
                </td>
              \`;
              tbody.appendChild(tr);
            });
            log('GET /api/products -> ' + json.data.length + ' records fetched.');
          } catch (e) {
            log('Error fetching products: ' + e.message);
          }
        }

        async function handleCrudSubmit(e) {
          e.preventDefault();
          const id = document.getElementById('editId').value;
          const title = document.getElementById('prodTitle').value;
          const category_id = document.getElementById('prodCategory').value;
          const price = document.getElementById('prodPrice').value;
          const stock = document.getElementById('prodStock').value;

          if (id) {
            // PUT
            const res = await fetch('/api/products/' + id, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ title, price, category_id, stock_quantity: stock })
            });
            const j = await res.json();
            log('PUT /api/products/' + id + ' -> ' + JSON.stringify(j));
          } else {
            // POST
            const res = await fetch('/api/products', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ title, price, category_id, stock_quantity: stock })
            });
            const j = await res.json();
            log('POST /api/products -> ' + JSON.stringify(j));
          }

          resetCrudForm();
          loadTableData();
        }

        function editProduct(id, title, price, stock) {
          document.getElementById('editId').value = id;
          document.getElementById('prodTitle').value = title;
          document.getElementById('prodPrice').value = price;
          document.getElementById('prodStock').value = stock;
          document.getElementById('formTitle').innerText = '✏️ Edit Product #' + id + ' (UPDATE)';
          document.getElementById('saveBtn').innerText = 'Update Product';
          document.getElementById('cancelBtn').style.display = 'inline-block';
        }

        function resetCrudForm() {
          document.getElementById('editId').value = '';
          document.getElementById('prodTitle').value = '';
          document.getElementById('prodPrice').value = '';
          document.getElementById('prodStock').value = '25';
          document.getElementById('formTitle').innerText = '➕ Add Product (CREATE)';
          document.getElementById('saveBtn').innerText = 'Save Product';
          document.getElementById('cancelBtn').style.display = 'none';
        }

        async function deleteProduct(id) {
          if (!confirm('Delete Product #' + id + '?')) return;
          const res = await fetch('/api/products/' + id, { method: 'DELETE' });
          const j = await res.json();
          log('DELETE /api/products/' + id + ' -> ' + JSON.stringify(j));
          loadTableData();
        }

        loadTableData();
      </script>
    </body>
    </html>
  `);
});

// ----------------------------------------------------------------------------
// EXERCISE 4.e: MySQL Database Connector & Pool Provider Live Dashboard
// ----------------------------------------------------------------------------
app.get('/lab/4e', async (req, res) => {
  const dbStatus = await testConnection();

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Lab 4.e - Express MySQL Connection Pool</title>
      <style>
        body { font-family: -apple-system, sans-serif; background: #0f172a; color: #f8fafc; padding: 30px 20px; margin: 0; }
        .container { max-width: 800px; margin: 0 auto; }
        header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #ff9900; padding-bottom: 16px; margin-bottom: 24px; }
        .card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 24px; margin-bottom: 20px; }
        .status-badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; border-radius: 20px; font-weight: bold; font-size: 14px; background: ${dbStatus.connected ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}; color: ${dbStatus.connected ? '#34d399' : '#fbbf24'}; border: 1px solid ${dbStatus.connected ? '#10b981' : '#f59e0b'}; }
        pre { background: #020617; border: 1px solid #334155; padding: 16px; border-radius: 8px; color: #38bdf8; font-family: monospace; overflow-x: auto; }
        button { background: #ff9900; border: none; padding: 10px 18px; border-radius: 6px; font-weight: bold; cursor: pointer; color: #111; }
        a { color: #38bdf8; text-decoration: none; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="container">
        <header>
          <h2 style="margin:0;">Lab 4.e: Express & MySQL <span style="color:#ff9900;">Connector</span></h2>
          <a href="/">⬅ Back to Lab Portal</a>
        </header>

        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <h3>Connection Status</h3>
            <span class="status-badge">${dbStatus.connected ? '🟢 Connected to MySQL' : '🟡 In-Memory Resilient Store Active'}</span>
          </div>
          <p style="color:#94a3b8; font-size:14px;">${dbStatus.message}</p>
          <pre>${JSON.stringify(dbStatus, null, 2)}</pre>
          <button onclick="testPing()">⚡ Re-test Connection</button>
        </div>

        <div class="card">
          <h3>Execute Real Query via Pool</h3>
          <p style="color:#94a3b8; font-size:14px;">Run query on database layer:</p>
          <div style="display:flex; gap: 8px; margin-bottom: 12px;">
            <input id="sqlInput" value="SELECT * FROM products LIMIT 3" style="flex:1; padding:10px; border-radius:6px; border:1px solid #475569; background:#0f172a; color:#fff;" />
            <button onclick="runQuery()">Run Query</button>
          </div>
          <pre id="queryOutput">Click 'Run Query' above.</pre>
        </div>
      </div>

      <script>
        async function testPing() {
          const res = await fetch('/api/health');
          const json = await res.json();
          alert(json.database.message);
          location.reload();
        }

        async function runQuery() {
          const out = document.getElementById('queryOutput');
          out.textContent = 'Executing...';
          const res = await fetch('/api/products');
          const json = await res.json();
          out.textContent = JSON.stringify(json, null, 2);
        }
      </script>
    </body>
    </html>
  `);
});

// ----------------------------------------------------------------------------
// Serve Built React App at /app
// ----------------------------------------------------------------------------
app.use('/app', express.static(distPath));

app.use('/app', (req, res) => {
  const indexHtml = path.join(distPath, 'index.html');
  if (fs.existsSync(indexHtml)) {
    res.sendFile(indexHtml);
  } else {
    res.redirect('http://localhost:5173');
  }
});

// ----------------------------------------------------------------------------
// API Endpoint to fetch source code of exercises for interactive preview
// ----------------------------------------------------------------------------
app.get('/api/exercise-source/:id', (req, res) => {
  const fileMap = {
    '4a': path.join(projectRoot, 'exercises', 'unit4', '4a_hello_world_route.js'),
    '4b': path.join(projectRoot, 'exercises', 'unit4', '4b_multi_route_website.js'),
    '4c': path.join(projectRoot, 'exercises', 'unit4', '4c_hello_world_console.js'),
    '4d': path.join(projectRoot, 'exercises', 'unit4', '4d_crud_express.js'),
    '4e': path.join(projectRoot, 'exercises', 'unit4', '4e_express_mysql.js'),
    '5a': path.join(projectRoot, 'database', '5a_create_db_cli.sql'),
    '5b': path.join(projectRoot, 'database', '5b_crud_queries.sql'),
    '5c': path.join(projectRoot, 'database', '5c_subqueries.sql'),
    '5d': path.join(projectRoot, 'database', '5d_workbench_script.sql'),
    '5e': path.join(projectRoot, 'database', 'database.sql')
  };

  const filePath = fileMap[req.params.id];
  if (!filePath || !fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Exercise file not found' });
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  res.json({
    id: req.params.id,
    fileName: path.basename(filePath),
    code: content
  });
});

// ----------------------------------------------------------------------------
// ROOT ROUTE: Main Amazon Shopping React App (GET /)
// ----------------------------------------------------------------------------
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

app.get('/', (req, res) => {
  const indexHtml = path.join(distPath, 'index.html');
  if (fs.existsSync(indexHtml)) {
    return res.sendFile(indexHtml);
  }
  res.redirect('http://localhost:5173');
});

// ----------------------------------------------------------------------------
// LAB PORTAL ROUTE: Interactive Curriculum Portal (GET /portal)
// ----------------------------------------------------------------------------
app.get(['/portal', '/lab-portal'], async (req, res) => {
  const dbStatus = await testConnection();

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>FSD Lab Suite - Unit 4 (Express.js) & Unit 5 (MySQL)</title>
      <style>
        :root {
          --dark-1: #0f172a;
          --dark-2: #1e293b;
          --dark-3: #334155;
          --accent: #ff9900;
          --accent-blue: #38bdf8;
          --accent-green: #10b981;
          --text: #f1f5f9;
          --text-muted: #94a3b8;
        }
        * { box-sizing: border-box; }
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background: var(--dark-1);
          color: var(--text);
          line-height: 1.5;
        }
        header {
          background: linear-gradient(90deg, #131921 0%, #232f3e 100%);
          border-bottom: 2px solid var(--accent);
          padding: 20px 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }
        .logo-area h1 {
          margin: 0;
          font-size: 24px;
          color: #fff;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .logo-area h1 span { color: var(--accent); }
        .logo-area p { margin: 4px 0 0; color: var(--text-muted); font-size: 13px; }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .app-link-btn {
          background: var(--accent);
          color: #111;
          font-weight: 700;
          font-size: 13px;
          padding: 8px 18px;
          border-radius: 20px;
          text-decoration: none;
          transition: transform 0.15s;
        }
        .app-link-btn:hover {
          transform: translateY(-2px);
        }
        .db-status-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: ${dbStatus.connected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)'};
          color: ${dbStatus.connected ? '#34d399' : '#fbbf24'};
          border: 1px solid ${dbStatus.connected ? '#10b981' : '#f59e0b'};
          padding: 6px 14px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 13px;
        }
        .container {
          max-width: 1280px;
          margin: 28px auto;
          padding: 0 20px;
        }
        .nav-tabs {
          display: flex;
          gap: 12px;
          border-bottom: 1px solid var(--dark-3);
          margin-bottom: 24px;
          overflow-x: auto;
        }
        .nav-tab {
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 15px;
          font-weight: 700;
          padding: 12px 18px;
          cursor: pointer;
          border-bottom: 3px solid transparent;
          transition: 0.2s;
          white-space: nowrap;
        }
        .nav-tab.active {
          color: var(--accent);
          border-bottom-color: var(--accent);
        }
        .exercise-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
          gap: 20px;
        }
        .card {
          background: var(--dark-2);
          border: 1px solid var(--dark-3);
          border-radius: 12px;
          padding: 22px;
          display: flex;
          flex-direction: column;
          transition: transform 0.2s, border-color 0.2s;
        }
        .card:hover {
          transform: translateY(-2px);
          border-color: var(--accent-blue);
        }
        .card-tag {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 6px;
        }
        .card h3 {
          margin: 0 0 10px;
          font-size: 17px;
          color: #fff;
        }
        .card p {
          color: var(--text-muted);
          font-size: 13px;
          flex: 1;
          margin: 0 0 16px;
        }
        .action-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--dark-3);
          color: #fff;
          padding: 8px 14px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          border: none;
          transition: background 0.15s;
        }
        .btn:hover { background: #475569; }
        .btn-primary { background: var(--accent); color: #111; }
        .btn-primary:hover { background: #e68a00; }
        .btn-blue { background: #0284c7; }
        .btn-blue:hover { background: #0369a1; }
        #codeModal {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.8);
          z-index: 999;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .modal-content {
          background: #0d1117;
          border: 1px solid #30363d;
          border-radius: 12px;
          max-width: 900px;
          width: 100%;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
        }
        .modal-header {
          padding: 16px 20px;
          border-bottom: 1px solid #30363d;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .modal-header h3 { margin: 0; color: var(--accent-blue); font-size: 16px; }
        .close-btn { background: none; border: none; color: #fff; font-size: 22px; cursor: pointer; }
        pre.code-view {
          margin: 0;
          padding: 20px;
          overflow: auto;
          color: #f1f5f9;
          font-family: 'Consolas', 'Courier New', monospace;
          font-size: 13px;
          line-height: 1.5;
        }
      </style>
    </head>
    <body>
      <header>
        <div class="logo-area">
          <h1>Full Stack Development <span>Lab Suite</span></h1>
          <p>Unit 4: Node.js & Express.js &nbsp;•&nbsp; Unit 5: MySQL Database & Integration</p>
        </div>
        <div class="header-actions">
          <div class="db-status-badge">
            <span>${dbStatus.connected ? '🟢' : '🟡'}</span>
            <span>${dbStatus.connected ? 'MySQL Active' : 'Resilient In-Memory'}</span>
          </div>
          <a href="/app" class="app-link-btn">🛍️ Launch React Shopping App ➔</a>
        </div>
      </header>

      <div class="container">
        <!-- TABS -->
        <div class="nav-tabs">
          <button class="nav-tab active" onclick="switchTab('unit4', this)">Unit 4: Node.js & Express.js</button>
          <button class="nav-tab" onclick="switchTab('unit5', this)">Unit 5: MySQL Database</button>
          <button class="nav-tab" onclick="switchTab('liveApi', this)">Live API & CRUD Tester</button>
        </div>

        <!-- UNIT 4 GRID -->
        <div id="unit4" class="tab-content">
          <div class="exercise-grid">
            <!-- 4.a -->
            <div class="card">
              <div class="card-tag">Exercise 4.a</div>
              <h3>Hello World Route in Browser</h3>
              <p>Implements the 'hello world' message in the route through the browser using Express.js.</p>
              <div class="action-row">
                <a href="/lab/4a" target="_blank" class="btn btn-primary">🚀 Run Live (/lab/4a)</a>
                <button class="btn" onclick="viewCode('4a')">📄 View Code</button>
              </div>
            </div>

            <!-- 4.b -->
            <div class="card">
              <div class="card-tag">Exercise 4.b</div>
              <h3>Small Website with Multiple Routes</h3>
              <p>Multi-route website (Home, About, Products, Services, Contact) built with Express.js routing.</p>
              <div class="action-row">
                <a href="/lab/4b" target="_blank" class="btn btn-primary">🚀 Run Live (/lab/4b)</a>
                <button class="btn" onclick="viewCode('4b')">📄 View Code</button>
              </div>
            </div>

            <!-- 4.c -->
            <div class="card">
              <div class="card-tag">Exercise 4.c</div>
              <h3>Print Hello World in Browser Console</h3>
              <p>Prints 'hello world' in the browser developer tools console via Express route script.</p>
              <div class="action-row">
                <a href="/lab/4c" target="_blank" class="btn btn-primary">🚀 Run Live (/lab/4c)</a>
                <button class="btn" onclick="viewCode('4c')">📄 View Code</button>
              </div>
            </div>

            <!-- 4.d -->
            <div class="card">
              <div class="card-tag">Exercise 4.d</div>
              <h3>CRUD Operations using Express.js</h3>
              <p>Create, Read, Update, and Delete REST endpoints with live form, table, and interactive logs.</p>
              <div class="action-row">
                <a href="/lab/4d" target="_blank" class="btn btn-primary">🚀 Run Live (/lab/4d)</a>
                <button class="btn" onclick="viewCode('4d')">📄 View Code</button>
              </div>
            </div>

            <!-- 4.e -->
            <div class="card">
              <div class="card-tag">Exercise 4.e</div>
              <h3>Express - MySQL Connection Driver</h3>
              <p>Establishes database connection pooling, latency diagnostics, and live query execution.</p>
              <div class="action-row">
                <a href="/lab/4e" target="_blank" class="btn btn-primary">🚀 Run Live (/lab/4e)</a>
                <button class="btn" onclick="viewCode('4e')">📄 View Code</button>
              </div>
            </div>
          </div>
        </div>

        <!-- UNIT 5 GRID -->
        <div id="unit5" class="tab-content" style="display: none;">
          <div class="exercise-grid">
            <!-- 5.a -->
            <div class="card">
              <div class="card-tag">Exercise 5.a</div>
              <h3>Create Database & Table in MySQL CLI</h3>
              <p>Interactive script and commands for creating databases and tables inside MySQL Command Line Client.</p>
              <div class="action-row">
                <button class="btn btn-blue" onclick="viewCode('5a')">📄 View SQL Script</button>
              </div>
            </div>

            <!-- 5.b -->
            <div class="card">
              <div class="card-tag">Exercise 5.b</div>
              <h3>CREATE, INSERT, and UPDATE Queries</h3>
              <p>MySQL DDL and DML queries for creating tables, inserting sample data, and executing conditional updates.</p>
              <div class="action-row">
                <button class="btn btn-blue" onclick="viewCode('5b')">📄 View SQL Script</button>
              </div>
            </div>

            <!-- 5.c -->
            <div class="card">
              <div class="card-tag">Exercise 5.c</div>
              <h3>Subqueries in MySQL CLI</h3>
              <p>Comprehensive subquery implementations: Scalar, IN, NOT IN, EXISTS, Derived Tables, and Correlated.</p>
              <div class="action-row">
                <button class="btn btn-blue" onclick="viewCode('5c')">📄 View SQL Script</button>
              </div>
            </div>

            <!-- 5.d -->
            <div class="card">
              <div class="card-tag">Exercise 5.d</div>
              <h3>MySQL Workbench Script File</h3>
              <p>Delimiters, Views, ACID Stored Procedures, Triggers, and execution workflow in MySQL Workbench.</p>
              <div class="action-row">
                <button class="btn btn-blue" onclick="viewCode('5d')">📄 View SQL Script</button>
              </div>
            </div>

            <!-- 5.e -->
            <div class="card">
              <div class="card-tag">Exercise 5.e</div>
              <h3>Database Directory & API Integration</h3>
              <p>database/ directory with database.sql, auto-initializer (initDb.js), and integrated Express API connection.</p>
              <div class="action-row">
                <button class="btn btn-blue" onclick="viewCode('5e')">📄 View database.sql</button>
                <a href="/api/products" target="_blank" class="btn btn-primary">🔗 Test /api/products</a>
              </div>
            </div>
          </div>
        </div>

        <!-- LIVE API TESTER -->
        <div id="liveApi" class="tab-content" style="display: none;">
          <div class="card">
            <h3>⚡ Live Full Stack REST API & Order Tester</h3>
            <p>Query the integrated Express API that connects directly to the database layer.</p>
            <div style="display: flex; gap: 10px; margin-bottom: 16px; flex-wrap: wrap;">
              <button class="btn btn-primary" onclick="testLiveApi('/api/products')">GET /api/products</button>
              <button class="btn btn-primary" onclick="testLiveApi('/api/categories')">GET /api/categories</button>
              <button class="btn btn-primary" onclick="testLiveApi('/api/orders')">GET /api/orders</button>
              <button class="btn btn-primary" onclick="testLiveApi('/api/stats')">GET /api/stats</button>
              <button class="btn btn-primary" onclick="testLiveApi('/api/health')">GET /api/health</button>
              <button class="btn btn-blue" onclick="testSampleOrder()">🛒 POST Sample /api/orders</button>
            </div>
            <pre id="apiOutput" style="background: #020617; border: 1px solid var(--dark-3); border-radius: 8px; padding: 16px; color: #38bdf8; max-height: 400px; overflow: auto; font-family: monospace;">Click any button above to execute an API request in real time.</pre>
          </div>
        </div>
      </div>

      <!-- MODAL FOR VIEWING CODE -->
      <div id="codeModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3 id="modalTitle">File Code</h3>
            <button class="close-btn" onclick="closeModal()">&times;</button>
          </div>
          <pre class="code-view" id="modalCode">Loading...</pre>
        </div>
      </div>

      <script>
        function switchTab(tabId, btn) {
          document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
          document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
          document.getElementById(tabId).style.display = 'block';
          btn.classList.add('active');
        }

        async function viewCode(exerciseId) {
          const modal = document.getElementById('codeModal');
          const title = document.getElementById('modalTitle');
          const codeEl = document.getElementById('modalCode');
          
          modal.style.display = 'flex';
          codeEl.textContent = 'Loading code for exercise ' + exerciseId + '...';

          try {
            const res = await fetch('/api/exercise-source/' + exerciseId);
            const data = await res.json();
            title.textContent = data.fileName + ' (' + exerciseId.toUpperCase() + ')';
            codeEl.textContent = data.code;
          } catch (e) {
            codeEl.textContent = 'Failed to load code: ' + e.message;
          }
        }

        function closeModal() {
          document.getElementById('codeModal').style.display = 'none';
        }

        async function testLiveApi(url) {
          const out = document.getElementById('apiOutput');
          out.textContent = 'Fetching ' + url + '...';
          try {
            const res = await fetch(url);
            const json = await res.json();
            out.textContent = 'HTTP ' + res.status + '\\n' + JSON.stringify(json, null, 2);
          } catch (err) {
            out.textContent = 'Error: ' + err.message;
          }
        }

        async function testSampleOrder() {
          const out = document.getElementById('apiOutput');
          out.textContent = 'Executing POST /api/orders...';
          try {
            const res = await fetch('/api/orders', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                customer_name: 'Lab Test User',
                customer_email: 'test@example.com',
                shipping_address: 'Room 204, IT Block, University Campus',
                payment_method: 'UPI',
                items: [
                  { id: 1, title: 'Apple iPhone 15', price: 69999, quantity: 1 }
                ]
              })
            });
            const json = await res.json();
            out.textContent = 'HTTP ' + res.status + '\\n' + JSON.stringify(json, null, 2);
          } catch (err) {
            out.textContent = 'Error: ' + err.message;
          }
        }
      </script>
    </body>
    </html>
  `);
});

// SPA Fallback: Serve built React index.html for all client-side navigation
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/lab')) {
    const indexHtml = path.join(distPath, 'index.html');
    if (fs.existsSync(indexHtml)) {
      return res.sendFile(indexHtml);
    }
  }
  next();
});

const server = app.listen(PORT, () => {
  console.log('============================================================');
  console.log(`🛍️ [Amazon Store] Server running at: http://localhost:${PORT}`);
  console.log(`🛒 [Frontend Dev Server] Running at: http://localhost:5173`);
  console.log('============================================================');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use by another application or terminal.`);
    console.error(`   👉 You can close the other terminal or run: npx kill-port ${PORT}`);
  } else {
    console.error('❌ Server error:', err.message);
  }
});
