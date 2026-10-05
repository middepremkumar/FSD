import React, { Component, useEffect, useMemo, useState, useCallback } from "react";
import "./Amazon.css";
import { INITIAL_PRODUCTS, SAMPLE_PRESETS } from "./productsData";
import NavBarComponent from "./NavBar";

// Props: product details are received by this child component.
function ProductCard({ product, onAdd, onQuickView, onEdit, onDelete }) {
  const currentPrice = typeof product.price === "number" ? product.price : Math.round(Number(product.price) || 0);
  const originalPrice = product.original_price || product.originalPrice || Math.round(currentPrice * 1.25);
  const discountPercent = Math.max(5, Math.round(((originalPrice - currentPrice) / originalPrice) * 100));
  const ratingRate = product.rating_rate || product.rating?.rate || 4.5;
  const ratingCount = product.rating_count || product.rating?.count || 120;
  const stock = product.stock_quantity !== undefined ? product.stock_quantity : (product.stock || 20);

  return (
    <article className="product-card">
      <div className="card-top-badges">
        <span className="deal-tag">{product.deal_tag || product.dealTag || "Limited Deal"}</span>
        {product.badge && <span className="custom-badge">{product.badge}</span>}
      </div>

      <div className="product-image-wrap" onClick={() => onQuickView(product)} title="Click for Quick View">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80";
          }}
        />
        <span className="quick-view-hint">👁️ Quick View</span>
      </div>

      <div className="card-header-row">
        <span className="category-tag">{product.category_name || product.category || "General"}</span>
        <div className="card-admin-actions">
          <button 
            type="button" 
            className="action-icon-btn edit" 
            title="Edit product" 
            onClick={(e) => { e.stopPropagation(); onEdit(product); }}
          >
            ✏️
          </button>
          <button 
            type="button" 
            className="action-icon-btn delete" 
            title="Delete product" 
            onClick={(e) => { e.stopPropagation(); onDelete(product); }}
          >
            🗑️
          </button>
        </div>
      </div>

      <h3 title={product.title} onClick={() => onQuickView(product)}>{product.title}</h3>

      <div className="stars">
        {"★".repeat(Math.min(5, Math.max(1, Math.round(ratingRate))))}
        {"☆".repeat(Math.max(0, 5 - Math.min(5, Math.max(1, Math.round(ratingRate)))))}
        <span>({ratingCount.toLocaleString("en-IN")})</span>
      </div>

      <div className="price-row">
        <span className="currency">₹</span>
        <span className="price">{currentPrice.toLocaleString("en-IN")}</span>
        <span className="original-price">₹{originalPrice.toLocaleString("en-IN")}</span>
        <span className="discount-tag">({discountPercent}% off)</span>
      </div>

      <div className="stock-info">
        {stock > 0 ? (
          stock <= 15 ? (
            <span className="low-stock">Only {stock} left in stock - order soon!</span>
          ) : (
            <span className="in-stock">In Stock ({stock} units)</span>
          )
        ) : (
          <span className="out-of-stock">Currently unavailable</span>
        )}
      </div>

      <p className="delivery">{product.delivery_info || product.delivery || "FREE Delivery Tomorrow"}</p>

      <div className="card-buttons">
        <button 
          className="add-btn" 
          onClick={() => onAdd(product)}
          disabled={stock <= 0}
        >
          {stock > 0 ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </article>
  );
}

// Existing class-component counter retained for curriculum requirements
class ClassCounter extends Component {
  state = { count: 0 };
  render() {
    return (
      <div className="mini-counter">
        <span>Class Component Counter</span>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Count: {this.state.count} (+1)
        </button>
      </div>
    );
  }
}

const DEFAULT_CATEGORIES = ["All", "Mobiles", "Laptops", "Audio", "Fashion", "Smart Wearables", "Cameras"];

function Amazon({ NavBar = NavBarComponent }) {
  // State: Cart, Products, Filters
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(false);
  const [apiHealth, setApiHealth] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [subqueryFilter, setSubqueryFilter] = useState("none");

  // Selected item states
  const [activeProduct, setActiveProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [ordersList, setOrdersList] = useState([]);
  const [orderConfirmation, setOrderConfirmation] = useState(null);
  const [deliveryLocation, setDeliveryLocation] = useState("Mumbai 400001");

  // Form State for Add Product
  const [newProduct, setNewProduct] = useState({
    title: "",
    category_id: 1,
    category_name: "Mobiles",
    price: "",
    original_price: "",
    stock_quantity: 25,
    deal_tag: "Great Indian Deal",
    badge: "Best Seller",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
    delivery_info: "FREE Delivery Tomorrow"
  });

  // Checkout Form State
  const [checkoutData, setCheckoutData] = useState({
    customer_name: "Rahul Sharma",
    customer_email: "rahul.sharma@example.com",
    shipping_address: "Flat 402, Sunshine Heights, Andheri West, Mumbai",
    pincode: "400053",
    payment_method: "UPI"
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Fetch initial products and categories from backend API
  const loadBackendData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Health check
      const healthRes = await fetch("/api/health");
      if (healthRes.ok) {
        const healthData = await healthRes.json();
        setApiHealth(healthData);
      }

      // 2. Categories
      const catRes = await fetch("/api/categories");
      if (catRes.ok) {
        const catData = await catRes.json();
        if (catData.data && catData.data.length > 0) {
          const catNames = ["All", ...catData.data.map(c => c.name)];
          setCategories(catNames);
        }
      }

      // 3. Products
      const prodRes = await fetch("/api/products");
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        if (prodData.data && prodData.data.length > 0) {
          setProducts(prodData.data);
        }
      }
    } catch {
      // Graceful fallback to initial products if backend is loading
      setProducts(INITIAL_PRODUCTS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBackendData();
    console.log("%c===================================================================", "color:#ff9900;font-weight:bold;");
    console.log("%c🛒 Amazon.in - E-Commerce Platform Online", "color:#10b981;font-size:15px;font-weight:bold;");
    console.log("%c⚡ Fast delivery, secure payments & 24/7 customer service", "color:#38bdf8;font-size:12px;");
    console.log("%c===================================================================", "color:#ff9900;font-weight:bold;");
  }, [loadBackendData]);

  // Load orders when orders modal is requested
  const loadOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const json = await res.json();
        setOrdersList(json.data || []);
      }
    } catch {
      // Fallback empty orders
    }
  };

  const handleOpenOrders = () => {
    loadOrders();
    setIsOrdersOpen(true);
  };

  // Cart operations
  const addToCart = (product) => {
    setCart((prevCart) => {
      const prodId = product.product_id || product.id;
      const existing = prevCart.find((item) => (item.product_id || item.id) === prodId);
      if (existing) {
        return prevCart.map((item) =>
          (item.product_id || item.id) === prodId
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    showToast(`🛒 "${product.title.slice(0, 30)}..." added to cart!`);
  };

  const updateCartQuantity = (productId, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if ((item.product_id || item.id) === productId) {
            const newQty = (item.quantity || 1) + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => (item.product_id || item.id) !== productId));
    showToast("Item removed from cart.");
  };

  const totalCartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      return sum + price * (item.quantity || 1);
    }, 0);
  }, [cart]);

  // Filter & Sort Products (Integrated with Unit 5.c SQL Subqueries)
  const filteredProducts = useMemo(() => {
    const q = search.toLowerCase().trim();
    let result = products.filter((p) => {
      const title = (p.title || "").toLowerCase();
      const cat = (p.category_name || p.category || "").toLowerCase();
      const matchesSearch = !q || title.includes(q) || cat.includes(q);
      const matchesCategory =
        selectedCategory === "All" ||
        cat === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });

    // Unit 5.c SQL Subquery filters
    if (subqueryFilter === "above_avg") {
      const avg = products.length > 0 ? (products.reduce((sum, p) => sum + (Number(p.price) || 0), 0) / products.length) : 0;
      result = result.filter(p => Number(p.price) > avg);
    } else if (subqueryFilter === "in_tech") {
      result = result.filter(p => [1, 3].includes(Number(p.category_id)) || ["mobiles", "laptops"].includes((p.category_name || p.category || "").toLowerCase()));
    } else if (subqueryFilter === "exists_stock") {
      result = result.filter(p => (Number(p.stock_quantity) || 0) > 0);
    }

    if (sortBy === "price_asc") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === "rating") {
      result.sort((a, b) => (b.rating_rate || 4.5) - (a.rating_rate || 4.5));
    }

    return result;
  }, [products, search, selectedCategory, sortBy, subqueryFilter]);

  // ADD PRODUCT (CREATE via API)
  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    if (!newProduct.title.trim() || !newProduct.price) {
      alert("Please provide at least a product title and price.");
      return;
    }

    const payload = {
      title: newProduct.title.trim(),
      category_id: Number(newProduct.category_id) || 1,
      price: Number(newProduct.price),
      original_price: newProduct.original_price ? Number(newProduct.original_price) : Math.round(Number(newProduct.price) * 1.25),
      stock_quantity: Number(newProduct.stock_quantity) || 20,
      deal_tag: newProduct.deal_tag || "Special Offer",
      badge: newProduct.badge || "New Arrival",
      image: newProduct.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
      delivery_info: newProduct.delivery_info || "FREE Delivery Tomorrow"
    };

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        showToast("✅ Product successfully published to database!");
        loadBackendData();
      } else {
        // Fallback local update
        setProducts([
          { product_id: Date.now(), ...payload, category_name: newProduct.category_name },
          ...products
        ]);
        showToast("Product added to local catalog.");
      }
    } catch {
      setProducts([
        { product_id: Date.now(), ...payload, category_name: newProduct.category_name },
        ...products
      ]);
      showToast("Product added to catalog (offline store).");
    }

    setIsAddModalOpen(false);
    // Reset form
    setNewProduct({
      title: "",
      category_id: 1,
      category_name: "Mobiles",
      price: "",
      original_price: "",
      stock_quantity: 25,
      deal_tag: "Great Indian Deal",
      badge: "Best Seller",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
      delivery_info: "FREE Delivery Tomorrow"
    });
  };

  // EDIT PRODUCT (UPDATE via API)
  const handleEditClick = (product) => {
    setEditingProduct({
      product_id: product.product_id || product.id,
      title: product.title,
      price: product.price,
      category_id: product.category_id || 1,
      stock_quantity: product.stock_quantity || 20,
      badge: product.badge || "",
      deal_tag: product.deal_tag || product.dealTag || ""
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const res = await fetch(`/api/products/${editingProduct.product_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProduct)
      });
      const json = await res.json();
      if (json.success) {
        showToast(`✅ Product #${editingProduct.product_id} updated successfully!`);
        loadBackendData();
      } else {
        throw new Error(json.message);
      }
    } catch {
      // Local fallback
      setProducts((prev) =>
        prev.map((p) =>
          (p.product_id || p.id) === editingProduct.product_id
            ? { ...p, ...editingProduct }
            : p
        )
      );
      showToast("Product updated in catalog.");
    }
    setIsEditModalOpen(false);
  };

  // DELETE PRODUCT (DELETE via API)
  const handleDeleteProduct = async (product) => {
    const id = product.product_id || product.id;
    if (!window.confirm(`Are you sure you want to delete "${product.title}"?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        showToast(`🗑️ Product #${id} deleted.`);
        loadBackendData();
      } else {
        throw new Error(json.message);
      }
    } catch {
      setProducts((prev) => prev.filter((p) => (p.product_id || p.id) !== id));
      showToast("Product removed from catalog.");
    }
  };

  // CHECKOUT & PLACE ORDER (POST to /api/orders)
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const orderPayload = {
      customer_name: checkoutData.customer_name,
      customer_email: checkoutData.customer_email,
      shipping_address: `${checkoutData.shipping_address}, ${checkoutData.pincode}`,
      payment_method: checkoutData.payment_method,
      items: cart.map((item) => ({
        id: item.product_id || item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity || 1
      }))
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload)
      });
      const data = await res.json();

      if (data.success) {
        setOrderConfirmation({
          orderId: data.orderId || Math.floor(1000 + Math.random() * 9000),
          total: cartSubtotal,
          itemCount: totalCartCount,
          items: [...cart],
          delivery: data.estimatedDelivery || "Tomorrow, 9 AM - 9 PM"
        });
        setCart([]);
        setIsCheckoutOpen(false);
        setIsCartOpen(false);
        loadBackendData(); // refresh stock
      } else {
        throw new Error(data.message);
      }
    } catch {
      // Resilient offline order creation
      setOrderConfirmation({
        orderId: Math.floor(1000 + Math.random() * 9000),
        total: cartSubtotal,
        itemCount: totalCartCount,
        items: [...cart],
        delivery: "Tomorrow, 9 AM - 9 PM"
      });
      setCart([]);
      setIsCheckoutOpen(false);
      setIsCartOpen(false);
    }
  };

  const applyPreset = (preset) => {
    const catMap = {
      "Mobiles": 1,
      "Audio": 2,
      "Laptops": 3,
      "Fashion": 4,
      "Smart Wearables": 5,
      "Cameras": 6,
      "Electronics": 1,
      "Home & Kitchen": 4
    };
    setNewProduct((prev) => ({
      ...prev,
      title: preset.title,
      category_id: catMap[preset.category] || 1,
      category_name: preset.category,
      price: preset.price,
      original_price: preset.originalPrice,
      deal_tag: preset.dealTag,
      image: preset.image
    }));
  };

  return (
    <div className="site">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Navigation Bar */}
      <NavBar 
        cartCount={totalCartCount} 
        onOpenCart={() => setIsCartOpen(true)}
        onOpenOrders={handleOpenOrders}
        search={search}
        setSearch={setSearch}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        apiHealth={apiHealth}
        deliveryLocation={deliveryLocation}
        onOpenLocation={() => setIsLocationOpen(true)}
      />

      <main>
        {/* Amazon Hero Banner */}
        <section className="hero">
          <div className="hero-content">
            <p className="hero-kicker">GREAT INDIAN FESTIVAL</p>
            <h1>Great deals. <span>Every day.</span></h1>
            <p>Shop top brands across Mobiles, Laptops, Audio, Smartwatches and Fashion with fast doorstep delivery.</p>
            <div className="hero-buttons">
              <button 
                className="hero-primary-btn" 
                onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
              >
                Shop Today's Deals ➔
              </button>
              <button 
                className="hero-secondary-btn" 
                onClick={() => setIsAddModalOpen(true)}
              >
                ➕ Add New Product
              </button>
            </div>
          </div>
          <div className="hero-cards">
            <div><b>Up to 60% off</b><small>Electronics & Laptops</small></div>
            <div><b>Prime Fast</b><small>Express 1-Day Delivery</small></div>
            <div><b>₹499 onwards</b><small>Best Seller Deals</small></div>
          </div>
        </section>

        {/* Feature Highlights Row */}
        <section className="quick-row">
          <div><b>🚚 Fast Delivery</b><span>Across India with live tracking</span></div>
          <div><b>🔒 Secure Payments</b><span>UPI, Cards & Net Banking</span></div>
          <div><b>↩ 7-Day Easy Returns</b><span>Hassle-free replacement</span></div>
          <div><b>⭐ Prime Membership</b><span>Exclusive prices & early access</span></div>
        </section>

        {/* Catalog Section */}
        <section className="workspace" id="products">
          <div className="section-heading">
            <div>
              <p className="eyebrow">AMAZON CATALOG</p>
              <h2>
                {selectedCategory === "All" ? "All Products" : selectedCategory} ({filteredProducts.length})
              </h2>
            </div>
            <div className="section-heading-actions">
              {/* Sort By Dropdown */}
              <div className="sort-box">
                <label>Sort by:</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="featured">Featured</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Avg. Customer Review</option>
                </select>
              </div>

              <button className="add-product-trigger-btn" onClick={() => setIsAddModalOpen(true)}>
                <span>➕</span> Add Product
              </button>

              <button className="cart-summary-trigger" onClick={() => setIsCartOpen(true)}>
                🛒 {totalCartCount} item(s) • ₹{cartSubtotal.toLocaleString("en-IN")}
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="category-filter-bar">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-pill ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Curated Collections Filters */}
          <div className="subquery-filter-banner">
            <span className="subquery-title">⚡ Curated Collections:</span>
            <button 
              type="button" 
              className={`subquery-btn ${subqueryFilter === "none" ? "active" : ""}`}
              onClick={() => {
                setSubqueryFilter("none");
                showToast("Showing all products.");
              }}
            >
              All Products
            </button>
            <button 
              type="button" 
              className={`subquery-btn ${subqueryFilter === "above_avg" ? "active" : ""}`}
              onClick={() => {
                setSubqueryFilter("above_avg");
                showToast("Showing premium picks priced above average.");
              }}
              title="Premium selection priced above average"
            >
              💎 Premium Selection
            </button>
            <button 
              type="button" 
              className={`subquery-btn ${subqueryFilter === "in_tech" ? "active" : ""}`}
              onClick={() => {
                setSubqueryFilter("in_tech");
                showToast("Showing Mobiles & Laptops.");
              }}
              title="Explore Mobiles and Laptops"
            >
              📱 Tech & Gadgets
            </button>
            <button 
              type="button" 
              className={`subquery-btn ${subqueryFilter === "exists_stock" ? "active" : ""}`}
              onClick={() => {
                setSubqueryFilter("exists_stock");
                showToast("Showing items available in stock.");
              }}
              title="Items available in stock"
            >
              📦 In-Stock Only
            </button>
          </div>

          {/* Search bar inside section */}
          <div className="search-bar-row">
            <form 
              className="amazon-search" 
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products by title, model, or specs..."
              />
              {search && (
                <button type="button" className="clear-search-btn" onClick={() => setSearch("")}>
                  ✕
                </button>
              )}
              <button type="submit">Search</button>
            </form>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="status">
              <div className="spinner" />
              <p>Fetching catalog from Express backend...</p>
            </div>
          ) : (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <ProductCard 
                  key={product.product_id || product.id} 
                  product={product} 
                  onAdd={addToCart}
                  onQuickView={(p) => { setActiveProduct(p); setIsQuickViewOpen(true); }}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteProduct}
                />
              ))}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="status empty-state">
              <h3>No products found</h3>
              <p>We couldn't find any products matching "{search || selectedCategory}".</p>
              <button 
                className="reset-filters-btn"
                onClick={() => { setSearch(""); setSelectedCategory("All"); }}
              >
                Clear all filters
              </button>
            </div>
          )}
        </section>

        {/* Amazon Prime Promotional Banner */}
        <section className="prime-banner-section" style={{ background: "#232f3e", color: "#fff", padding: "24px 32px", borderRadius: "12px", margin: "24px 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h3 style={{ color: "#ff9900", margin: "0 0 6px 0", fontSize: "20px" }}>Amazon Prime Benefits</h3>
            <p style={{ margin: 0, color: "#cbd5e1", fontSize: "14px" }}>Enjoy unlimited FREE fast delivery, award-winning movies, TV shows, and exclusive deals.</p>
          </div>
          <button 
            type="button" 
            className="hero-primary-btn"
            onClick={() => showToast("Prime membership active! Free 1-Day Delivery enabled.")}
          >
            Explore Prime Deals ➔
          </button>
        </section>
      </main>

      {/* ==================================================================== */}
      {/* SLIDEOUT CART DRAWER */}
      {/* ==================================================================== */}
      {isCartOpen && (
        <div className="drawer-overlay" onClick={() => setIsCartOpen(false)}>
          <aside className="cart-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h2>Shopping Cart ({totalCartCount} items)</h2>
              <button className="drawer-close-btn" onClick={() => setIsCartOpen(false)}>✕</button>
            </div>

            {cart.length === 0 ? (
              <div className="empty-cart-view">
                <div className="empty-cart-icon">🛒</div>
                <h3>Your Amazon Cart is empty</h3>
                <p>Explore today's top picks and add items to your cart.</p>
                <button 
                  className="start-shopping-btn" 
                  onClick={() => setIsCartOpen(false)}
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="drawer-items-list">
                  {cart.map((item) => {
                    const id = item.product_id || item.id;
                    const price = Number(item.price) || 0;
                    return (
                      <div key={id} className="cart-item-row">
                        <img src={item.image} alt={item.title} className="cart-item-thumb" />
                        <div className="cart-item-details">
                          <h4 title={item.title}>{item.title}</h4>
                          <span className="cart-item-cat">{item.category_name || item.category}</span>
                          <div className="cart-item-price">₹{price.toLocaleString("en-IN")}</div>
                          <div className="quantity-controls">
                            <button 
                              className="qty-btn" 
                              onClick={() => updateCartQuantity(id, -1)}
                            >
                              -
                            </button>
                            <span className="qty-number">{item.quantity || 1}</span>
                            <button 
                              className="qty-btn" 
                              onClick={() => updateCartQuantity(id, 1)}
                            >
                              +
                            </button>
                            <button 
                              className="remove-link-btn" 
                              onClick={() => removeFromCart(id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="drawer-footer">
                  <div className="summary-line">
                    <span>Subtotal:</span>
                    <strong>₹{cartSubtotal.toLocaleString("en-IN")}</strong>
                  </div>
                  <div className="summary-line text-green">
                    <span>Prime Delivery:</span>
                    <span>FREE</span>
                  </div>
                  <div className="summary-line total-line">
                    <span>Total Amount:</span>
                    <span>₹{cartSubtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <button 
                    className="proceed-checkout-btn" 
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsCheckoutOpen(true);
                    }}
                  >
                    Proceed to Buy ({totalCartCount} items)
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}

      {/* ==================================================================== */}
      {/* CHECKOUT MODAL */}
      {/* ==================================================================== */}
      {isCheckoutOpen && (
        <div className="modal-overlay" onClick={() => setIsCheckoutOpen(false)}>
          <div className="modal-content checkout-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Secure Checkout & Payment</h3>
              <button className="modal-close-btn" onClick={() => setIsCheckoutOpen(false)}>✕</button>
            </div>

            <form onSubmit={handlePlaceOrder}>
              <div className="checkout-grid">
                <div className="checkout-left">
                  <h4>1. Shipping & Customer Details</h4>
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input 
                      required 
                      value={checkoutData.customer_name} 
                      onChange={(e) => setCheckoutData({ ...checkoutData, customer_name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Email Address *</label>
                    <input 
                      type="email" 
                      required 
                      value={checkoutData.customer_email} 
                      onChange={(e) => setCheckoutData({ ...checkoutData, customer_email: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Street Address *</label>
                    <input 
                      required 
                      value={checkoutData.shipping_address} 
                      onChange={(e) => setCheckoutData({ ...checkoutData, shipping_address: e.target.value })}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>City & Pincode *</label>
                      <input 
                        required 
                        value={checkoutData.pincode} 
                        onChange={(e) => setCheckoutData({ ...checkoutData, pincode: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Country</label>
                      <input disabled value="India" />
                    </div>
                  </div>

                  <h4>2. Select Payment Method</h4>
                  <div className="payment-options">
                    {["UPI", "Credit / Debit Card", "Net Banking", "Cash on Delivery"].map((method) => (
                      <label key={method} className="payment-radio-label">
                        <input 
                          type="radio" 
                          name="payment" 
                          value={method} 
                          checked={checkoutData.payment_method === method}
                          onChange={(e) => setCheckoutData({ ...checkoutData, payment_method: e.target.value })}
                        />
                        <span>{method}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="checkout-right">
                  <div className="order-summary-card">
                    <h4>Order Summary</h4>
                    <div className="checkout-items-preview">
                      {cart.map((item) => (
                        <div key={item.product_id || item.id} className="preview-item">
                          <span>{item.title.slice(0, 24)}... × {item.quantity || 1}</span>
                          <b>₹{((Number(item.price) || 0) * (item.quantity || 1)).toLocaleString("en-IN")}</b>
                        </div>
                      ))}
                    </div>
                    <div className="summary-calc">
                      <div><span>Items Total:</span> <span>₹{cartSubtotal.toLocaleString("en-IN")}</span></div>
                      <div><span>Delivery:</span> <span className="text-green">FREE</span></div>
                      <div className="summary-total-bold"><span>Order Total:</span> <span>₹{cartSubtotal.toLocaleString("en-IN")}</span></div>
                    </div>
                    <button type="submit" className="place-order-btn">
                      Place Your Order (₹{cartSubtotal.toLocaleString("en-IN")})
                    </button>
                    <p className="secure-badge">🔒 256-bit SSL Secure Checkout</p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* ORDER CONFIRMATION MODAL */}
      {/* ==================================================================== */}
      {orderConfirmation && (
        <div className="modal-overlay" onClick={() => setOrderConfirmation(null)}>
          <div className="modal-content order-success-modal" onClick={(e) => e.stopPropagation()}>
            <div className="success-icon">🎉</div>
            <h2>Order Placed Successfully!</h2>
            <p className="order-id-tag">Order ID: #{orderConfirmation.orderId}</p>
            <p>Thank you for shopping with Amazon. A confirmation email and SMS with delivery tracking details have been sent.</p>
            
            <div className="confirmation-box">
              <div><span>Estimated Delivery:</span> <strong>{orderConfirmation.delivery}</strong></div>
              <div><span>Total Amount Paid:</span> <strong>₹{orderConfirmation.total.toLocaleString("en-IN")}</strong></div>
              <div><span>Items Count:</span> <strong>{orderConfirmation.itemCount} item(s)</strong></div>
            </div>

            <div className="modal-actions" style={{ justifyContent: "center" }}>
              <button 
                className="modal-submit-btn" 
                onClick={() => {
                  setOrderConfirmation(null);
                  handleOpenOrders();
                }}
              >
                View Your Orders
              </button>
              <button 
                className="modal-cancel-btn" 
                onClick={() => setOrderConfirmation(null)}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* ORDERS & RETURNS HISTORY MODAL */}
      {/* ==================================================================== */}
      {isOrdersOpen && (
        <div className="modal-overlay" onClick={() => setIsOrdersOpen(false)}>
          <div className="modal-content orders-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📦 Your Orders & History</h3>
              <button className="modal-close-btn" onClick={() => setIsOrdersOpen(false)}>✕</button>
            </div>

            {ordersList.length === 0 ? (
              <div className="empty-state">
                <p>No recent orders found.</p>
              </div>
            ) : (
              <div className="orders-timeline">
                {ordersList.map((order) => {
                  const statusColors = {
                    delivered: "badge-green",
                    shipped: "badge-blue",
                    processing: "badge-amber",
                    cancelled: "badge-red"
                  };
                  return (
                    <div key={order.order_id} className="order-card">
                      <div className="order-card-header">
                        <div>
                          <small>ORDER PLACED</small>
                          <div>{new Date(order.created_at || Date.now()).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</div>
                        </div>
                        <div>
                          <small>TOTAL</small>
                          <div>₹{Number(order.total_amount).toLocaleString("en-IN")}</div>
                        </div>
                        <div>
                          <small>SHIP TO</small>
                          <div>{order.customer_name}</div>
                        </div>
                        <div className="order-id-col">
                          <small>ORDER # {order.order_id}</small>
                          <span className={`status-pill ${statusColors[order.order_status] || "badge-blue"}`}>
                            {order.order_status ? order.order_status.toUpperCase() : "PROCESSING"}
                          </span>
                        </div>
                      </div>

                      <div className="order-card-body">
                        {order.items && order.items.length > 0 ? (
                          order.items.map((it, idx) => (
                            <div key={idx} className="order-item-inline">
                              {it.image && <img src={it.image} alt={it.title} />}
                              <div>
                                <b>{it.title}</b>
                                <div>Qty: {it.quantity} • ₹{Number(it.unit_price).toLocaleString("en-IN")}</div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="order-item-inline">
                            <div><b>Amazon Prime Assorted Package</b> (Status: {order.order_status})</div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* QUICK VIEW / PRODUCT DETAILS MODAL */}
      {/* ==================================================================== */}
      {isQuickViewOpen && activeProduct && (
        <div className="modal-overlay" onClick={() => setIsQuickViewOpen(false)}>
          <div className="modal-content quickview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Product Overview</h3>
              <button className="modal-close-btn" onClick={() => setIsQuickViewOpen(false)}>✕</button>
            </div>
            <div className="quickview-body">
              <div className="quickview-img-col">
                <img src={activeProduct.image} alt={activeProduct.title} />
              </div>
              <div className="quickview-info-col">
                <span className="deal-tag">{activeProduct.deal_tag || activeProduct.dealTag || "Limited Deal"}</span>
                <h2>{activeProduct.title}</h2>
                <div className="category-tag">{activeProduct.category_name || activeProduct.category}</div>
                <div className="stars">
                  {"★".repeat(Math.round(activeProduct.rating_rate || activeProduct.rating?.rate || 4))}
                  <span>({(activeProduct.rating_count || activeProduct.rating?.count || 120).toLocaleString("en-IN")} ratings)</span>
                </div>
                <div className="price-row">
                  <span className="currency">₹</span>
                  <span className="price">{Number(activeProduct.price).toLocaleString("en-IN")}</span>
                </div>
                <p className="delivery">{activeProduct.delivery_info || activeProduct.delivery || "FREE Delivery Tomorrow"}</p>
                <div className="stock-info">
                  <span className="in-stock">Stock Available: {activeProduct.stock_quantity || 20} units</span>
                </div>
                <div className="quickview-actions">
                  <button 
                    className="add-btn" 
                    onClick={() => {
                      addToCart(activeProduct);
                      setIsQuickViewOpen(false);
                    }}
                  >
                    Add to Cart
                  </button>
                  <button 
                    className="buy-btn" 
                    onClick={() => {
                      addToCart(activeProduct);
                      setIsQuickViewOpen(false);
                      setIsCheckoutOpen(true);
                    }}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* ADD PRODUCT MODAL (CREATE) */}
      {/* ==================================================================== */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Product to Database</h3>
              <button className="modal-close-btn" onClick={() => setIsAddModalOpen(false)}>✕</button>
            </div>

            {/* Sample presets */}
            <div className="preset-section">
              <p>⚡ Quick Fill with Sample Presets:</p>
              <div className="preset-chips">
                {SAMPLE_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="preset-chip-btn"
                    onClick={() => applyPreset(preset)}
                  >
                    {preset.title.split(" ").slice(0, 2).join(" ")}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleAddProductSubmit}>
              <div className="form-group">
                <label>Product Title *</label>
                <input
                  required
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                  placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={newProduct.category_id}
                    onChange={(e) => {
                      const id = Number(e.target.value);
                      const name = categories[id] || "General";
                      setNewProduct({ ...newProduct, category_id: id, category_name: name });
                    }}
                  >
                    <option value={1}>Mobiles</option>
                    <option value={2}>Audio</option>
                    <option value={3}>Laptops</option>
                    <option value={4}>Fashion</option>
                    <option value={5}>Smart Wearables</option>
                    <option value={6}>Cameras</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Deal Tag / Badge</label>
                  <select
                    value={newProduct.deal_tag}
                    onChange={(e) => setNewProduct({ ...newProduct, deal_tag: e.target.value })}
                  >
                    <option value="Limited Deal">Limited Deal</option>
                    <option value="Deal of the Day">Deal of the Day</option>
                    <option value="Great Indian Deal">Great Indian Deal</option>
                    <option value="Best Seller">Best Seller</option>
                    <option value="Prime Exclusive">Prime Exclusive</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="e.g. 24999"
                  />
                </div>

                <div className="form-group">
                  <label>Stock Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={newProduct.stock_quantity}
                    onChange={(e) => setNewProduct({ ...newProduct, stock_quantity: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="modal-cancel-btn" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="modal-submit-btn">
                  Publish to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* EDIT PRODUCT MODAL (UPDATE) */}
      {/* ==================================================================== */}
      {isEditModalOpen && editingProduct && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Product #{editingProduct.product_id}</h3>
              <button className="modal-close-btn" onClick={() => setIsEditModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  required
                  value={editingProduct.title}
                  onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Stock Quantity</label>
                  <input
                    type="number"
                    value={editingProduct.stock_quantity}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock_quantity: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Badge</label>
                  <input
                    value={editingProduct.badge}
                    onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Deal Tag</label>
                  <input
                    value={editingProduct.deal_tag}
                    onChange={(e) => setEditingProduct({ ...editingProduct, deal_tag: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="modal-cancel-btn" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="modal-submit-btn">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* DELIVERY LOCATION MODAL */}
      {/* ==================================================================== */}
      {isLocationOpen && (
        <div className="modal-overlay" onClick={() => setIsLocationOpen(false)}>
          <div className="modal-content location-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Choose your delivery location</h3>
              <button className="modal-close-btn" onClick={() => setIsLocationOpen(false)}>✕</button>
            </div>
            <p style={{ color: "#475569", fontSize: "14px" }}>
              Select a delivery location to see product availability and delivery options across India.
            </p>
            <div className="city-options-grid">
              {[
                { city: "Mumbai", pin: "400001" },
                { city: "New Delhi", pin: "110001" },
                { city: "Bengaluru", pin: "560001" },
                { city: "Hyderabad", pin: "500001" },
                { city: "Chennai", pin: "600001" },
                { city: "Kolkata", pin: "700001" },
                { city: "Pune", pin: "411001" },
                { city: "Ahmedabad", pin: "380001" }
              ].map((loc) => (
                <button
                  key={loc.pin}
                  className={`loc-chip ${deliveryLocation.includes(loc.city) ? "active" : ""}`}
                  onClick={() => {
                    setDeliveryLocation(`${loc.city} ${loc.pin}`);
                    showToast(`📍 Delivery location set to ${loc.city} (${loc.pin})`);
                    setIsLocationOpen(false);
                  }}
                >
                  📍 {loc.city} ({loc.pin})
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer>
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          Back to top
        </button>
        <div className="footer-main">
          <div>
            <h3>Get to Know Us</h3>
            <p>About Amazon</p>
            <p>Careers</p>
            <p>Press Releases</p>
            <p>Amazon Science</p>
          </div>
          <div>
            <h3>Connect with Us</h3>
            <p>Facebook</p>
            <p>Twitter</p>
            <p>Instagram</p>
          </div>
          <div>
            <h3>Make Money with Us</h3>
            <p>Sell on Amazon</p>
            <p>Sell under Amazon Accelerator</p>
            <p>Protect and Build Your Brand</p>
            <p>Amazon Global Selling</p>
          </div>
          <div>
            <h3>Let Us Help You</h3>
            <p>COVID-19 and Amazon</p>
            <p>Your Account</p>
            <p>Returns Centre</p>
            <p>100% Purchase Protection</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 1996-2026, Amazon.com, Inc. or its affiliates</p>
          <p style={{ color: "#94a3b8", fontSize: "12px", marginTop: "4px" }}>
            Conditions of Use & Sale • Privacy Notice • Interest-Based Ads
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Amazon;
