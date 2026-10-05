/**
 * ============================================================================
 * 4.c: Print 'Hello World' in Browser Console using Express.js
 * File: exercises/unit4/4c_hello_world_console.js
 * Description: An Express.js program that serves a web page containing client-side
 *              JavaScript to output 'Hello World' directly to the browser DevTools console.
 * Run command: node exercises/unit4/4c_hello_world_console.js
 * Or: npm run 4c
 * ============================================================================
 */

import express from 'express';

const app = express();
const PORT = process.env.PORT || 3003;

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Lab 4.c - Express Browser Console Hello World</title>
      <style>
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background: #0d1117;
          color: #c9d1d9;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 20px;
        }
        .container {
          background: #161b22;
          border: 1px solid #30363d;
          border-radius: 12px;
          padding: 32px;
          max-width: 680px;
          width: 100%;
          box-shadow: 0 16px 36px rgba(0,0,0,0.6);
        }
        .badge {
          display: inline-block;
          background: #238636;
          color: #ffffff;
          font-size: 12px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 20px;
          text-transform: uppercase;
        }
        h1 {
          color: #58a6ff;
          margin: 12px 0;
          font-size: 28px;
        }
        p {
          line-height: 1.6;
        }
        .instructions {
          background: #21262d;
          border-left: 4px solid #58a6ff;
          padding: 16px;
          border-radius: 0 6px 6px 0;
          margin: 20px 0;
        }
        .console-preview {
          background: #000000;
          border: 1px solid #30363d;
          border-radius: 6px;
          padding: 16px;
          font-family: 'Consolas', 'Courier New', monospace;
          font-size: 14px;
          color: #7ee787;
          margin-top: 16px;
          overflow-x: auto;
        }
        .log-entry {
          margin: 4px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .log-entry::before {
          content: '>';
          color: #58a6ff;
          font-weight: bold;
        }
        .btn {
          background: #238636;
          color: #fff;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 14px;
        }
        .btn:hover { background: #2ea043; }
        kbd {
          background: #30363d;
          border: 1px solid #484f58;
          border-radius: 4px;
          padding: 2px 6px;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <span class="badge">Exercise 4.c</span>
        <h1>Hello World in Browser Console</h1>
        <p>This Express route returns an HTML page that immediately executes <code>console.log()</code> in the browser runtime.</p>
        
        <div class="instructions">
          <strong>🔍 How to View in Browser:</strong>
          <ol style="margin: 8px 0 0; padding-left: 20px;">
            <li>Press <kbd>F12</kbd> (or <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>I</kbd>).</li>
            <li>Click on the <strong>"Console"</strong> tab.</li>
            <li>You will see the <strong>"Hello World"</strong> message printed!</li>
          </ol>
        </div>

        <h3>Interactive Console Log Mirror:</h3>
        <div class="console-preview" id="consoleMirror">
          <div style="color: #8b949e;">// Live Browser Console Output:</div>
        </div>

        <button class="btn" onclick="triggerLog()">⚡ Trigger console.log("Hello World") Again</button>
      </div>

      <!-- SCRIPT EXECUTED IN BROWSER CONSOLE VIA EXPRESS -->
      <script>
        function triggerLog() {
          // 1. Core requirement: print Hello World to the browser console
          console.log("Hello World");

          // 2. Styled message for high visibility in developer tools
          console.info(
            "%c[Express Lab 4.c] Hello World!", 
            "background: #238636; color: white; padding: 6px 12px; border-radius: 4px; font-weight: bold; font-size: 14px;"
          );

          // 3. Mirror on screen for instant visual confirmation
          const mirror = document.getElementById('consoleMirror');
          const time = new Date().toLocaleTimeString();
          const entry = document.createElement('div');
          entry.className = 'log-entry';
          entry.textContent = '[' + time + '] Hello World';
          mirror.appendChild(entry);
        }

        // Run automatically when the page loads
        window.addEventListener('DOMContentLoaded', () => {
          triggerLog();
        });
      </script>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log('============================================================');
  console.log(`💻 [Lab 4.c] Console Log Server running at: http://localhost:${PORT}`);
  console.log('👉 Open your browser, press F12, and check the Console tab!');
  console.log('============================================================');
});
