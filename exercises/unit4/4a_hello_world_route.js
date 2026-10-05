/**
 * ============================================================================
 * 4.a: Hello World in Route through Browser using Express
 * File: exercises/unit4/4a_hello_world_route.js
 * Description: An Express.js program that defines a route returning a 'Hello World'
 *              message displayed directly in the web browser.
 * Run command: node exercises/unit4/4a_hello_world_route.js
 * Or: npm run 4a
 * ============================================================================
 */

import express from 'express';

const app = express();
const PORT = process.env.PORT || 3001;

// Route: Root path ('/') returning 'Hello World' message to the browser
app.get('/', (req, res) => {
  // Send formatted HTML with the Hello World message
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Lab 4.a - Express Hello World</title>
      <style>
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background: linear-gradient(135deg, #131921 0%, #232f3e 100%);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
        }
        .card {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 16px;
          padding: 40px;
          max-width: 600px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
          text-align: center;
        }
        .badge {
          display: inline-block;
          background: #ff9900;
          color: #111;
          font-weight: 700;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 13px;
          margin-bottom: 20px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        h1 {
          font-size: 38px;
          margin: 0 0 16px;
          color: #00ff88;
        }
        p {
          font-size: 16px;
          color: #d1d5db;
          line-height: 1.6;
        }
        .code-box {
          background: #0f141c;
          border-radius: 8px;
          padding: 16px;
          text-align: left;
          font-family: 'Courier New', Courier, monospace;
          color: #f6a623;
          margin: 20px 0;
          border: 1px solid #333;
        }
        a.btn {
          display: inline-block;
          background: #ff9900;
          color: #111;
          font-weight: 600;
          text-decoration: none;
          padding: 10px 24px;
          border-radius: 8px;
          margin-top: 10px;
          transition: background 0.2s;
        }
        a.btn:hover {
          background: #e68a00;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="badge">Exercise 4.a • Node.js & Express.js</div>
        <h1>Hello World</h1>
        <p>This message is rendered through the browser route using Express.js!</p>
        
        <div class="code-box">
          <code>
            // Route Implementation:<br>
            app.get('/', (req, res) => {<br>
            &nbsp;&nbsp;res.send('Hello World');<br>
            });
          </code>
        </div>

        <p><a href="/raw" class="btn">View Raw Text Response ➔</a></p>
      </div>
    </body>
    </html>
  `);
});

// Route: Raw plain-text response for minimal verification
app.get('/raw', (req, res) => {
  res.type('text/plain');
  res.send('Hello World');
});

app.listen(PORT, () => {
  console.log('============================================================');
  console.log(`🚀 [Lab 4.a] Server running at: http://localhost:${PORT}`);
  console.log(`👉 Open http://localhost:${PORT} in your browser to see 'Hello World'`);
  console.log('============================================================');
});
