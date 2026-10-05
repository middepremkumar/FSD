/* eslint-disable no-unused-vars */
const initialProducts = [
  {
    id: "prod-1",
    title: "Apple iPhone 15 (128 GB) - Blue",
    category: "Mobiles",
    price: 69999,
    originalPrice: 79900,
    rating: { rate: 4.6, count: 4820 },
    dealTag: "Great Indian Deal",
    badge: "Best Seller",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80",
    delivery: "FREE Delivery Tomorrow, 7 AM - 9 PM"
  },
  {
    id: "prod-2",
    title: "Sony WH-1000XM5 Wireless Noise-Cancelling Headphones",
    category: "Audio",
    price: 29990,
    originalPrice: 34990,
    rating: { rate: 4.8, count: 2190 },
    dealTag: "Limited Deal",
    badge: "Amazon's Choice",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    delivery: "FREE Delivery by 9 PM Tomorrow"
  },
  {
    id: "prod-3",
    title: "Apple MacBook Air 13\" M2 Chip (8GB RAM, 256GB SSD) - Starlight",
    category: "Laptops",
    price: 89900,
    originalPrice: 99900,
    rating: { rate: 4.9, count: 1430 },
    dealTag: "Flat ₹10,000 Off",
    badge: "Best Seller",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
    delivery: "FREE Delivery Tomorrow"
  },
  {
    id: "prod-4",
    title: "Samsung Galaxy S24 Ultra 5G (Titanium Gray, 256GB Storage)",
    category: "Mobiles",
    price: 129999,
    originalPrice: 134999,
    rating: { rate: 4.7, count: 3200 },
    dealTag: "Exchange Offer",
    badge: "Top Brand",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80",
    delivery: "FREE Delivery by Today 10 PM"
  },
  {
    id: "prod-5",
    title: "Nike Air Max 270 Men's Athletic Running & Lifestyle Sneakers",
    category: "Fashion",
    price: 12495,
    originalPrice: 14995,
    rating: { rate: 4.5, count: 1870 },
    dealTag: "17% off",
    badge: "Popular Pick",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    delivery: "FREE Delivery Tomorrow"
  },
  {
    id: "prod-6",
    title: "Apple Watch Series 9 GPS 45mm Midnight Aluminum Case",
    category: "Electronics",
    price: 41900,
    originalPrice: 44900,
    rating: { rate: 4.8, count: 1650 },
    dealTag: "Prime Savings",
    badge: "Amazon's Choice",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
    delivery: "FREE Delivery Tomorrow"
  },
  {
    id: "prod-7",
    title: "Echo Dot (5th Gen) Smart Speaker with Alexa & Deep Bass - Charcoal",
    category: "Smart Home",
    price: 4499,
    originalPrice: 5499,
    rating: { rate: 4.6, count: 15420 },
    dealTag: "Deal of the Day",
    badge: "#1 Best Seller",
    image: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=600&auto=format&fit=crop&q=80",
    delivery: "FREE Delivery Tomorrow"
  },
  {
    id: "prod-8",
    title: "Barista Espresso & Cappuccino Coffee Machine with Milk Frother",
    category: "Home & Kitchen",
    price: 15999,
    originalPrice: 21999,
    rating: { rate: 4.4, count: 980 },
    dealTag: "27% off",
    badge: "Deal of the Day",
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&auto=format&fit=crop&q=80",
    delivery: "FREE Delivery Tomorrow"
  },
  {
    id: "prod-9",
    title: "Logitech MX Master 3S Ergonomic Wireless Performance Mouse",
    category: "Electronics",
    price: 8995,
    originalPrice: 10995,
    rating: { rate: 4.9, count: 5210 },
    dealTag: "18% off",
    badge: "Top Rated",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80",
    delivery: "FREE Delivery Tomorrow"
  },
  {
    id: "prod-10",
    title: "Mechanical Gaming Keyboard RGB Backlit with Blue Switches",
    category: "Electronics",
    price: 2999,
    originalPrice: 4999,
    rating: { rate: 4.5, count: 3410 },
    dealTag: "40% off",
    badge: "Gamer's Choice",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
    delivery: "FREE Delivery Tomorrow"
  },
  {
    id: "prod-11",
    title: "Fossil Grant Chronograph Roman Dial Brown Leather Watch",
    category: "Fashion",
    price: 9495,
    originalPrice: 12995,
    rating: { rate: 4.6, count: 2840 },
    dealTag: "27% off",
    badge: "Top Pick",
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop&q=80",
    delivery: "FREE Delivery Tomorrow"
  },
  {
    id: "prod-12",
    title: "Kindle Paperwhite (16 GB) - 6.8\" Glare-Free Display with Warm Light",
    category: "Books & Kindle",
    price: 14999,
    originalPrice: 16999,
    rating: { rate: 4.8, count: 8760 },
    dealTag: "Limited Deal",
    badge: "#1 Best Seller",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
    delivery: "FREE Delivery Tomorrow"
  }
];

let allProducts = [...initialProducts];
let cart = [];
let currentCategory = "All";

document.addEventListener("DOMContentLoaded", () => {
  renderProducts(allProducts);
  fetchProducts();
});

async function fetchProducts() {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    const apiData = await response.json();
    const formattedApi = apiData.map((item) => ({
      id: `api-${item.id}`,
      title: item.title,
      category: item.category.toLowerCase().includes("cloth") || item.category.toLowerCase().includes("jewel") ? "Fashion" : item.category.charAt(0).toUpperCase() + item.category.slice(1),
      price: Math.round(item.price * 84),
      originalPrice: Math.round(item.price * 84 * 1.3),
      dealTag: "Great Indian Deal",
      badge: item.rating?.rate >= 4 ? "Amazon's Choice" : "Best Seller",
      image: item.image,
      rating: item.rating || { rate: 4.2, count: 180 },
      delivery: "FREE Delivery by Tomorrow"
    }));
    allProducts = [...initialProducts, ...formattedApi];
    filterAndRender();
  } catch {
    // If API fails, initialProducts remain intact
    renderProducts(allProducts);
  }
}

function filterAndRender() {
  const query = document.getElementById("searchBox")?.value.toLowerCase().trim() || "";
  const filtered = allProducts.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(query) || (p.category && p.category.toLowerCase().includes(query));
    const matchesCat = currentCategory === "All" || (p.category && p.category.toLowerCase() === currentCategory.toLowerCase());
    return matchesSearch && matchesCat;
  });
  renderProducts(filtered);
}

function renderProducts(products) {
  const grid = document.getElementById("productGrid");
  const noProducts = document.getElementById("noProducts");
  if (!grid) return;

  if (products.length === 0) {
    grid.innerHTML = "";
    if (noProducts) noProducts.style.display = "block";
    return;
  }

  if (noProducts) noProducts.style.display = "none";

  grid.innerHTML = products.map((product) => {
    const price = typeof product.price === "number" ? product.price : Math.round(Number(product.price) || 0);
    const originalPrice = product.originalPrice || Math.round(price * 1.25);
    const discount = Math.max(5, Math.round(((originalPrice - price) / originalPrice) * 100));
    const rate = Math.min(5, Math.max(1, Math.round(product.rating?.rate || 4)));
    const stars = "★".repeat(rate) + "☆".repeat(5 - rate);
    const count = (product.rating?.count || 120).toLocaleString("en-IN");

    return `
      <article class="product-card">
        <div class="card-top-badges">
          <span class="deal-tag">${product.dealTag || "Limited Deal"}</span>
          ${product.badge ? `<span class="custom-badge">${product.badge}</span>` : ""}
        </div>
        <div class="product-image-wrap">
          <img src="${product.image}" alt="${product.title}" onerror="this.src='https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80'">
        </div>
        <div class="category-tag">${product.category || "General"}</div>
        <h3 title="${product.title}">${product.title}</h3>
        <div class="stars">${stars} <span>(${count})</span></div>
        <div class="price-row">
          <span class="currency">₹</span>
          <span class="price">${price.toLocaleString("en-IN")}</span>
          <span class="original-price">₹${originalPrice.toLocaleString("en-IN")}</span>
          <span class="discount-tag">(${discount}% off)</span>
        </div>
        <p class="delivery">${product.delivery || "FREE Delivery Tomorrow"}</p>
        <button class="add-btn" onclick="addToCart('${product.id}')">Add to Cart</button>
      </article>
    `;
  }).join("");
}

function searchProducts(e) {
  if (e) e.preventDefault();
  filterAndRender();
}

function addToCart(productId) {
  const product = allProducts.find((p) => String(p.id) === String(productId));
  if (product) {
    cart.push(product);
    updateCartUI();
  }
}

function removeFromCart() {
  if (cart.length > 0) {
    cart.pop();
    updateCartUI();
  }
}

function updateCartUI() {
  const count = cart.length;
  const cartCount = document.getElementById("cartCount");
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const removeBtn = document.getElementById("removeBtn");
  const buyBtn = document.getElementById("buyBtn");

  if (cartCount) cartCount.textContent = count;
  if (cartItems) cartItems.textContent = `${count} item(s) in cart`;
  if (cartTotal) cartTotal.textContent = count;
  if (removeBtn) removeBtn.disabled = count === 0;
  if (buyBtn) buyBtn.disabled = count === 0;
}

function buyNow() {
  alert(`Order placed successfully for ${cart.length} item(s)! Thank you for shopping with Amazon.`);
}

function scrollToProducts() {
  document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
}

function backToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
