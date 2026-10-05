/**
 * ============================================================================
 * 4.d: Complete CRUD Operations using Express.js
 * File: exercises/unit4/4d_crud_express.js
 * Description: Implements Create, Read, Update, and Delete (CRUD) REST operations
 *              on products with input validation and an interactive browser dashboard.
 * Run command: node exercises/unit4/4d_crud_express.js
 * Or: npm run 4d
 * ============================================================================
 */

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3004;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-Memory Data Store for CRUD Demonstration
let products = [
  {
    id: 1,
    title: 'Apple iPhone 15 (128 GB)',
    category: 'Mobiles',
    price: 69999.00,
    stock: 25,
    dealTag: 'Great Indian Deal'
  },
  {
    id: 2,
    title: 'Sony WH-1000XM5 Wireless Headphones',
    category: 'Audio',
    price: 29990.00,
    stock: 18,
    dealTag: 'Limited Deal'
  },
  {
    id: 3,
    title: 'Apple MacBook Air 13" M2',
    category: 'Laptops',
    price: 89900.00,
    stock: 12,
    dealTag: 'Flat ₹10,000 Off'
  },
  {
    id: 4,
    title: 'Samsung Galaxy S24 Ultra 5G',
    category: 'Mobiles',
    price: 129999.00,
    stock: 15,
    dealTag: 'Exchange Offer'
  }
];

let nextId = 5;

// ============================================================================
// REST API CRUD ENDPOINTS
// ============================================================================

// 1. READ ALL (GET /api/products)
app.get('/api/products', (req, res) => {
  const { category, search } = req.query;
  let result = [...products];

  if (category) {
    result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    result = result.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
  }

  res.status(200).json({
    success: true,
    count: result.length,
    data: result
  });
});

// 2. READ ONE BY ID (GET /api/products/:id)
app.get('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: `Product with ID ${id} not found.`
    });
  }

  res.status(200).json({
    success: true,
    data: product
  });
});

// 3. CREATE PRODUCT (POST /api/products)
app.post('/api/products', (req, res) => {
  const { title, category, price, stock, dealTag } = req.body;

  // Validation
  if (!title || price === undefined || price === null) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error: "title" and "price" are required.'
    });
  }

  if (isNaN(Number(price)) || Number(price) < 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error: "price" must be a positive number.'
    });
  }

  const newProduct = {
    id: nextId++,
    title: title.trim(),
    category: category ? category.trim() : 'General',
    price: parseFloat(Number(price).toFixed(2)),
    stock: stock ? parseInt(stock, 10) : 10,
    dealTag: dealTag ? dealTag.trim() : 'New Arrival'
  };

  products.push(newProduct);

  res.status(201).json({
    success: true,
    message: 'Product created successfully (CREATE operation).',
    data: newProduct
  });
});

// 4. UPDATE PRODUCT (PUT /api/products/:id)
app.put('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = products.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: `Product with ID ${id} not found for update.`
    });
  }

  const { title, category, price, stock, dealTag } = req.body;

  // Update existing fields if provided
  if (title !== undefined) products[index].title = title.trim();
  if (category !== undefined) products[index].category = category.trim();
  if (price !== undefined) {
    if (isNaN(Number(price)) || Number(price) < 0) {
      return res.status(400).json({ success: false, message: 'Invalid price value.' });
    }
    products[index].price = parseFloat(Number(price).toFixed(2));
  }
  if (stock !== undefined) products[index].stock = parseInt(stock, 10);
  if (dealTag !== undefined) products[index].dealTag = dealTag.trim();

  res.status(200).json({
    success: true,
    message: `Product with ID ${id} updated successfully (UPDATE operation).`,
    data: products[index]
  });
});

// 5. DELETE PRODUCT (DELETE /api/products/:id)
app.delete('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = products.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: `Product with ID ${id} not found for deletion.`
    });
  }

  const deletedProduct = products.splice(index, 1)[0];

  res.status(200).json({
    success: true,
    message: `Product '${deletedProduct.title}' deleted successfully (DELETE operation).`,
    deletedId: id
  });
});

// ============================================================================
// BROWSER INTERFACE FOR INTERACTIVE CRUD TESTING (GET /)
// ============================================================================
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Lab 4.d - Express CRUD Dashboard</title>
      <style>
        :root {
          --dark: #131921;
          --orange: #ff9900;
          --bg: #f3f4f6;
          --text: #1f2937;
        }
        * { box-sizing: border-box; }
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: var(--bg);
          color: var(--text);
          padding: 24px;
        }
        .header {
          background: var(--dark);
          color: white;
          padding: 20px 28px;
          border-radius: 10px;
          margin-bottom: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .header h1 { margin: 0; font-size: 24px; }
        .header .badge {
          background: var(--orange);
          color: #111;
          padding: 6px 12px;
          border-radius: 20px;
          font-weight: 700;
          font-size: 13px;
        }
        .grid {
          display: grid;
          grid-template-columns: 360px 1fr;
          gap: 24px;
        }
        @media(max-width: 900px) { .grid { grid-template-columns: 1fr; } }
        .panel {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        }
        .form-group {
          margin-bottom: 14px;
        }
        label { display: block; font-weight: 600; margin-bottom: 4px; font-size: 13px; }
        input, select {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
        }
        button {
          background: var(--orange);
          border: none;
          color: #111;
          font-weight: 700;
          padding: 10px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: 0.2s;
        }
        button:hover { background: #e68a00; }
        button.btn-danger { background: #ef4444; color: white; }
        button.btn-danger:hover { background: #dc2626; }
        button.btn-secondary { background: #e5e7eb; color: #374151; }
        button.btn-secondary:hover { background: #d1d5db; }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 12px;
        }
        th, td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
          font-size: 14px;
        }
        th { background: #f9fafb; font-weight: 600; }
        .price { font-weight: bold; color: #b12704; }
        .log-box {
          background: #111827;
          color: #10b981;
          font-family: monospace;
          padding: 14px;
          border-radius: 6px;
          margin-top: 20px;
          max-height: 180px;
          overflow-y: auto;
          font-size: 12px;
          white-space: pre-wrap;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h1>Lab 4.d: Express.js CRUD Operations</h1>
          <div style="font-size: 13px; opacity: 0.8; margin-top: 4px;">Interactive Live Demonstration of GET, POST, PUT, and DELETE</div>
        </div>
        <span class="badge">Express REST API</span>
      </div>

      <div class="grid">
        <!-- FORM PANEL -->
        <div class="panel">
          <h3 id="formTitle">➕ Add New Product (POST)</h3>
          <form id="productForm" onsubmit="handleSubmit(event)">
            <input type="hidden" id="editId">
            <div class="form-group">
              <label>Product Title *</label>
              <input type="text" id="title" required placeholder="e.g. Sony Wireless Earbuds">
            </div>
            <div class="form-group">
              <label>Category</label>
              <input type="text" id="category" placeholder="e.g. Audio">
            </div>
            <div class="form-group">
              <label>Price (₹) *</label>
              <input type="number" id="price" required step="0.01" placeholder="e.g. 14999.00">
            </div>
            <div class="form-group">
              <label>Stock Quantity</label>
              <input type="number" id="stock" value="20">
            </div>
            <div class="form-group">
              <label>Deal Tag / Badge</label>
              <input type="text" id="dealTag" placeholder="e.g. Best Seller">
            </div>

            <div style="display:flex; gap: 8px;">
              <button type="submit" id="submitBtn">Save Product (Create)</button>
              <button type="button" class="btn-secondary" id="cancelBtn" style="display:none;" onclick="resetForm()">Cancel</button>
            </div>
          </form>

          <div style="margin-top: 24px;">
            <label>API Activity Log:</label>
            <div class="log-box" id="apiLog">Ready. Perform CRUD actions to see requests.</div>
          </div>
        </div>

        <!-- PRODUCTS LIST PANEL -->
        <div class="panel">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h3 style="margin: 0;">📦 Product Inventory (READ)</h3>
            <button class="btn-secondary" onclick="fetchProducts()">🔄 Refresh</button>
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
            <tbody id="productsTableBody">
              <!-- Dynamically populated -->
            </tbody>
          </table>
        </div>
      </div>

      <script>
        function log(message) {
          const box = document.getElementById('apiLog');
          const time = new Date().toLocaleTimeString();
          box.textContent = '[' + time + '] ' + message + '\\n\\n' + box.textContent;
        }

        async function fetchProducts() {
          try {
            const res = await fetch('/api/products');
            const data = await res.json();
            const tbody = document.getElementById('productsTableBody');
            tbody.innerHTML = '';

            data.data.forEach(p => {
              const tr = document.createElement('tr');
              tr.innerHTML = \`
                <td><b>#\${p.id}</b></td>
                <td>\${p.title}</td>
                <td><span style="background:#e5e7eb;padding:2px 8px;border-radius:4px;font-size:12px;">\${p.category}</span></td>
                <td class="price">₹\${Number(p.price).toLocaleString('en-IN')}</td>
                <td>\${p.stock}</td>
                <td>
                  <button style="padding:4px 8px;font-size:12px;" onclick='startEdit(\${JSON.stringify(p)})'>✏️ Edit</button>
                  <button class="btn-danger" style="padding:4px 8px;font-size:12px;" onclick="deleteProduct(\${p.id})">🗑️ Delete</button>
                </td>
              \`;
              tbody.appendChild(tr);
            });
            log('GET /api/products -> ' + data.count + ' items loaded');
          } catch (err) {
            log('Error fetching products: ' + err.message);
          }
        }

        async function handleSubmit(e) {
          e.preventDefault();
          const editId = document.getElementById('editId').value;
          const payload = {
            title: document.getElementById('title').value,
            category: document.getElementById('category').value,
            price: parseFloat(document.getElementById('price').value),
            stock: parseInt(document.getElementById('stock').value, 10),
            dealTag: document.getElementById('dealTag').value
          };

          if (editId) {
            // PUT /api/products/:id
            const res = await fetch('/api/products/' + editId, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
            const data = await res.json();
            log('PUT /api/products/' + editId + ' -> ' + JSON.stringify(data));
          } else {
            // POST /api/products
            const res = await fetch('/api/products', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
            const data = await res.json();
            log('POST /api/products -> ' + JSON.stringify(data));
          }

          resetForm();
          fetchProducts();
        }

        function startEdit(product) {
          document.getElementById('editId').value = product.id;
          document.getElementById('title').value = product.title;
          document.getElementById('category').value = product.category;
          document.getElementById('price').value = product.price;
          document.getElementById('stock').value = product.stock;
          document.getElementById('dealTag').value = product.dealTag || '';

          document.getElementById('formTitle').textContent = '✏️ Update Product #' + product.id + ' (PUT)';
          document.getElementById('submitBtn').textContent = 'Update Product';
          document.getElementById('cancelBtn').style.display = 'inline-block';
        }

        function resetForm() {
          document.getElementById('productForm').reset();
          document.getElementById('editId').value = '';
          document.getElementById('formTitle').textContent = '➕ Add New Product (POST)';
          document.getElementById('submitBtn').textContent = 'Save Product (Create)';
          document.getElementById('cancelBtn').style.display = 'none';
        }

        async function deleteProduct(id) {
          if (!confirm('Are you sure you want to delete Product #' + id + '? (DELETE)')) return;
          try {
            const res = await fetch('/api/products/' + id, { method: 'DELETE' });
            const data = await res.json();
            log('DELETE /api/products/' + id + ' -> ' + JSON.stringify(data));
            fetchProducts();
          } catch (err) {
            log('Delete failed: ' + err.message);
          }
        }

        window.onload = fetchProducts;
      </script>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log('============================================================');
  console.log(`📦 [Lab 4.d] Express CRUD Server running at: http://localhost:${PORT}`);
  console.log(`👉 Open http://localhost:${PORT} to test CRUD operations interactively!`);
  console.log('API Endpoints:');
  console.log(` - GET    http://localhost:${PORT}/api/products`);
  console.log(` - GET    http://localhost:${PORT}/api/products/:id`);
  console.log(` - POST   http://localhost:${PORT}/api/products`);
  console.log(` - PUT    http://localhost:${PORT}/api/products/:id`);
  console.log(` - DELETE http://localhost:${PORT}/api/products/:id`);
  console.log('============================================================');
});
