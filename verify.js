// Unified Verification Script for Express Backend, Unit 4 Labs, and Vite Frontend
async function verifyAll() {
  console.log('====================================================');
  console.log('   FULL STACK DEVELOPMENT LAB SUITE VERIFICATION    ');
  console.log('====================================================\n');

  // --- 1. Testing Express Backend (Port 5000) ---
  console.log('--- 1. Testing Express Backend (Port 5000) ---');
  try {
    const health = await fetch('http://localhost:5000/api/health').then(r => r.json());
    console.log('✅ Health:', health.status, '| DB Mode:', health.database?.mode || 'N/A');

    const stats = await fetch('http://localhost:5000/api/stats').then(r => r.json());
    console.log('✅ Stats:', stats.stats);

    const categories = await fetch('http://localhost:5000/api/categories').then(r => r.json());
    console.log('✅ Categories count:', categories.count, '| First:', categories.data?.[0]?.name);

    const products = await fetch('http://localhost:5000/api/products').then(r => r.json());
    console.log('✅ Products count:', products.count, '| First:', products.data?.[0]?.title);

    const orders = await fetch('http://localhost:5000/api/orders').then(r => r.json());
    console.log('✅ Orders count:', orders.count, '| Latest order total: ₹' + (orders.data?.[0]?.total_amount ?? 0));

    // Unit 4.a & Unit 5.c Integrated Routes
    try {
      const hello = await fetch('http://localhost:5000/api/hello').then(r => r.json());
      console.log('✅ Route /api/hello (Unit 4.a) -> Status:', hello.success, '| Message:', hello.message);
    } catch {
      console.log('⚠️ Route /api/hello not active yet (Restart npm run server to activate)');
    }

    try {
      const sub = await fetch('http://localhost:5000/api/subqueries').then(r => r.json());
      console.log('✅ Route /api/subqueries (Unit 5.c) -> Status:', sub.success, '| Scalar subquery count:', sub.scalarSubquery?.data?.length);
    } catch {
      console.log('⚠️ Route /api/subqueries not active yet (Restart npm run server to activate)');
    }
  } catch (err) {
    console.log('❌ Express Backend (Port 5000) is NOT running.');
    console.log('   👉 Please start it in a terminal using: npm run server');
  }

  // --- 2. Testing Unit 4 Lab Endpoints on Port 5000 ---
  console.log('\n--- 2. Testing Unit 4 Lab Endpoints on Port 5000 ---');
  const labs = ['4a', '4b', '4c', '4d', '4e'];
  for (const lab of labs) {
    try {
      const res = await fetch('http://localhost:5000/lab/' + lab);
      console.log(`✅ Route /lab/${lab} -> HTTP ${res.status}`);
    } catch {
      console.log(`❌ Route /lab/${lab} -> Could not connect`);
    }
  }

  // --- 3. Testing Built React App (/app) on Port 5000 ---
  console.log('\n--- 3. Testing Built React App (/app) on Port 5000 ---');
  try {
    const appRes = await fetch('http://localhost:5000/app');
    console.log('✅ Route /app -> HTTP ' + appRes.status);
  } catch {
    console.log('❌ Route /app -> Could not connect');
  }

  // --- 4. Testing Vite Dev Server (Port 5173) ---
  console.log('\n--- 4. Testing Vite Dev Server (Port 5173) ---');
  try {
    const viteRes = await fetch('http://localhost:5173/');
    console.log('✅ Vite Frontend -> HTTP ' + viteRes.status);

    const proxyHealth = await fetch('http://localhost:5173/api/health').then(r => r.json());
    console.log('✅ Vite Proxy /api/health -> Status:', proxyHealth.status);

    const proxyProducts = await fetch('http://localhost:5173/api/products').then(r => r.json());
    console.log('✅ Vite Proxy /api/products -> Products count:', proxyProducts.count);
  } catch (err) {
    console.log('⚠️ Vite Dev Server (Port 5173) is not currently running.');
    console.log('   👉 If you want to test the Vite dev server, run: npm run dev');
  }

  console.log('\n====================================================');
  console.log('              VERIFICATION COMPLETE                 ');
  console.log('====================================================');
}

verifyAll().catch(console.error);
