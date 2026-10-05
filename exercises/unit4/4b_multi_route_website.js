/**
 * ============================================================================
 * 4.b: Small Website with Multiple Routes using Express.js
 * File: exercises/unit4/4b_multi_route_website.js
 * Description: Express.js application serving a multi-page website with
 *              distinct routes: Home, About, Products, Services, Contact, and 404.
 * Run command: node exercises/unit4/4b_multi_route_website.js
 * Or: npm run 4b
 * ============================================================================
 */

import express from 'express';

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware to parse URL-encoded form data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Reusable Layout Generator for consistent website look & feel
function renderPage(title, activeRoute, contentHtml) {
  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Products', path: '/products' },
    { label: 'Services', path: '/services' },
    { label: 'Contact', path: '/contact' }
  ];

  const navLinks = navItems.map(item => `
    <a href="${item.path}" class="${activeRoute === item.path ? 'active' : ''}">${item.label}</a>
  `).join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title} - Express Multi-Route Site</title>
      <style>
        :root {
          --amazon-dark: #131921;
          --amazon-nav: #232f3e;
          --amazon-orange: #ff9900;
          --amazon-yellow: #febd69;
          --card-bg: #ffffff;
          --text-color: #333333;
        }
        * { box-sizing: border-box; }
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background-color: #eaeded;
          color: var(--text-color);
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        header {
          background-color: var(--amazon-dark);
          color: #fff;
          padding: 12px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .logo {
          font-size: 24px;
          font-weight: 800;
          color: #fff;
          text-decoration: none;
        }
        .logo span { color: var(--amazon-orange); }
        .tagline {
          font-size: 13px;
          color: #bbb;
        }
        nav {
          background-color: var(--amazon-nav);
          display: flex;
          gap: 12px;
          padding: 8px 24px;
          flex-wrap: wrap;
        }
        nav a {
          color: #ffffff;
          text-decoration: none;
          padding: 8px 14px;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 600;
          transition: background 0.2s;
        }
        nav a:hover, nav a.active {
          background-color: rgba(255, 255, 255, 0.15);
          color: var(--amazon-yellow);
          border: 1px solid var(--amazon-yellow);
        }
        main {
          flex: 1;
          max-width: 1000px;
          width: 100%;
          margin: 28px auto;
          padding: 0 16px;
        }
        .card {
          background: var(--card-bg);
          border-radius: 8px;
          padding: 32px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
          margin-bottom: 24px;
        }
        h1 {
          color: var(--amazon-dark);
          margin-top: 0;
          border-bottom: 2px solid #eee;
          padding-bottom: 12px;
        }
        .badge {
          background: #e7f3ff;
          color: #0066c0;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
        }
        footer {
          background-color: var(--amazon-dark);
          color: #999;
          text-align: center;
          padding: 16px;
          font-size: 13px;
          margin-top: auto;
        }
        /* Grid */
        .grid-3 {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        .grid-card {
          background: #f8f9fa;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 18px;
        }
        .price {
          color: #b12704;
          font-size: 20px;
          font-weight: bold;
        }
        /* Form */
        .form-group {
          margin-bottom: 16px;
        }
        label {
          display: block;
          font-weight: 600;
          margin-bottom: 6px;
        }
        input[type="text"], input[type="email"], textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 14px;
        }
        button.btn-primary {
          background: var(--amazon-orange);
          border: 1px solid #a88734;
          color: #111;
          padding: 10px 24px;
          font-size: 15px;
          font-weight: bold;
          border-radius: 6px;
          cursor: pointer;
        }
        button.btn-primary:hover {
          background: #dd8400;
        }
      </style>
    </head>
    <body>
      <header>
        <a href="/" class="logo">Amazon<span>Express</span></a>
        <div class="tagline">Lab 4.b: Multi-Route Express Application</div>
      </header>
      <nav>
        ${navLinks}
      </nav>
      <main>
        ${contentHtml}
      </main>
      <footer>
        &copy; 2026 AmazonExpress Lab 4.b • Full Stack Development (Express.js Routes Demo)
      </footer>
    </body>
    </html>
  `;
}

// ----------------------------------------------------------------------------
// Route 1: Home Page ('/')
// ----------------------------------------------------------------------------
app.get('/', (req, res) => {
  const content = `
    <div class="card">
      <span class="badge">Route: GET /</span>
      <h1>Welcome to AmazonExpress Home</h1>
      <p>This is the landing route of our multi-page website powered entirely by <strong>Node.js and Express.js</strong>.</p>
      <p>Express makes route management simple, flexible, and powerful. Explore each section using the navigation bar above!</p>
      
      <div class="grid-3">
        <div class="grid-card">
          <h3>⚡ Fast Routing</h3>
          <p>Each page is rendered dynamically using Express route handlers.</p>
        </div>
        <div class="grid-card">
          <h3>📦 Clean Architecture</h3>
          <p>Separation of concerns with clean templates and middleware.</p>
        </div>
        <div class="grid-card">
          <h3>🛒 Shop Integration</h3>
          <p>Ready to connect with our MySQL database catalog.</p>
        </div>
      </div>
    </div>
  `;
  res.send(renderPage('Home', '/', content));
});

// ----------------------------------------------------------------------------
// Route 2: About Us ('/about')
// ----------------------------------------------------------------------------
app.get('/about', (req, res) => {
  const content = `
    <div class="card">
      <span class="badge">Route: GET /about</span>
      <h1>About AmazonExpress</h1>
      <p>AmazonExpress is a demonstration platform designed for the Full Stack Development curriculum.</p>
      <h3>Our Tech Stack:</h3>
      <ul>
        <li><strong>Runtime:</strong> Node.js (V8 JavaScript Engine)</li>
        <li><strong>Web Framework:</strong> Express.js 5</li>
        <li><strong>Frontend:</strong> Modern Responsive HTML5 & CSS3</li>
        <li><strong>Database Layer:</strong> MySQL 8.x / mysql2</li>
      </ul>
      <p>Created to illustrate URL routing, query handling, and HTTP request lifecycles.</p>
    </div>
  `;
  res.send(renderPage('About Us', '/about', content));
});

// ----------------------------------------------------------------------------
// Route 3: Products Catalog ('/products')
// ----------------------------------------------------------------------------
app.get('/products', (req, res) => {
  const sampleProducts = [
    { title: 'Apple iPhone 15 (128 GB)', cat: 'Mobiles', price: '₹69,999', tag: 'Best Seller' },
    { title: 'Sony WH-1000XM5 Headphones', cat: 'Audio', price: '₹29,990', tag: 'Top Choice' },
    { title: 'Apple MacBook Air 13" M2', cat: 'Laptops', price: '₹89,900', tag: 'Great Offer' },
    { title: 'Samsung Galaxy S24 Ultra 5G', cat: 'Mobiles', price: '₹1,29,999', tag: 'Flagship' }
  ];

  const cards = sampleProducts.map(p => `
    <div class="grid-card">
      <span class="badge">${p.tag}</span>
      <h3>${p.title}</h3>
      <p>Category: <strong>${p.cat}</strong></p>
      <div class="price">${p.price}</div>
    </div>
  `).join('');

  const content = `
    <div class="card">
      <span class="badge">Route: GET /products</span>
      <h1>Featured Products</h1>
      <p>Browse our top-rated electronics and lifestyle selections.</p>
      <div class="grid-3">
        ${cards}
      </div>
    </div>
  `;
  res.send(renderPage('Products', '/products', content));
});

// ----------------------------------------------------------------------------
// Route 4: Services ('/services')
// ----------------------------------------------------------------------------
app.get('/services', (req, res) => {
  const content = `
    <div class="card">
      <span class="badge">Route: GET /services</span>
      <h1>Our Customer Services</h1>
      <div class="grid-3">
        <div class="grid-card">
          <h3>🚀 Prime Express Delivery</h3>
          <p>Guaranteed 1-day or same-day delivery to over 100+ cities across India.</p>
        </div>
        <div class="grid-card">
          <h3>🔒 100% Secure Checkout</h3>
          <p>Protected by 256-bit SSL encryption with UPI, Net Banking, and Card support.</p>
        </div>
        <div class="grid-card">
          <h3>🔄 Easy 7-Day Returns</h3>
          <p>Hassle-free doorstep pickup with instant refund initiation.</p>
        </div>
      </div>
    </div>
  `;
  res.send(renderPage('Services', '/services', content));
});

// ----------------------------------------------------------------------------
// Route 5: Contact Us - GET (Form) & POST (Submission)
// ----------------------------------------------------------------------------
app.get('/contact', (req, res) => {
  const content = `
    <div class="card">
      <span class="badge">Route: GET /contact</span>
      <h1>Contact Support</h1>
      <p>Have questions or feedback? Fill in the form below and submit.</p>
      <form action="/contact" method="POST">
        <div class="form-group">
          <label for="name">Your Name</label>
          <input type="text" id="name" name="name" required placeholder="e.g. Rahul Sharma">
        </div>
        <div class="form-group">
          <label for="email">Email Address</label>
          <input type="email" id="email" name="email" required placeholder="name@example.com">
        </div>
        <div class="form-group">
          <label for="message">Message</label>
          <textarea id="message" name="message" rows="4" required placeholder="How can we assist you?"></textarea>
        </div>
        <button type="submit" class="btn-primary">Send Message</button>
      </form>
    </div>
  `;
  res.send(renderPage('Contact', '/contact', content));
});

// Handle form submission via POST
app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  const content = `
    <div class="card">
      <span class="badge" style="background:#d4edda;color:#155724;">Route: POST /contact</span>
      <h1 style="color:#155724;">Thank You, ${name || 'Customer'}!</h1>
      <p>Your message has been received successfully by the Express backend.</p>
      <div style="background:#f8f9fa;padding:16px;border-radius:6px;border-left:4px solid #28a745;">
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      </div>
      <p style="margin-top:20px;">
        <a href="/contact" style="color:#0066c0;">⬅ Send another message</a>
      </p>
    </div>
  `;
  res.send(renderPage('Message Received', '/contact', content));
});

// ----------------------------------------------------------------------------
// Route 6: 404 Not Found Handler
// ----------------------------------------------------------------------------
app.use((req, res) => {
  const content = `
    <div class="card" style="text-align: center;">
      <h1 style="color:#b12704;font-size:48px;">404</h1>
      <h2>Page Not Found</h2>
      <p>The requested URL <code>${req.originalUrl}</code> does not exist on this server.</p>
      <p><a href="/" class="btn-primary" style="display:inline-block;text-decoration:none;margin-top:10px;">Return to Home</a></p>
    </div>
  `;
  res.status(404).send(renderPage('404 Not Found', '', content));
});

app.listen(PORT, () => {
  console.log('============================================================');
  console.log(`🌐 [Lab 4.b] Multi-Route Website running at: http://localhost:${PORT}`);
  console.log('Available routes:');
  console.log(` - http://localhost:${PORT}/         (Home)`);
  console.log(` - http://localhost:${PORT}/about    (About)`);
  console.log(` - http://localhost:${PORT}/products (Products)`);
  console.log(` - http://localhost:${PORT}/services (Services)`);
  console.log(` - http://localhost:${PORT}/contact  (Contact GET/POST)`);
  console.log('============================================================');
});
