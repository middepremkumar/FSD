import React, { Component, useEffect, useMemo, useState } from "react";
import "./Amazon.css";

// Props: product details are received by this child component.
function ProductCard({ product, onAdd }) {
  return (
    <article className="product-card">
      <div className="deal-tag">Limited Deal</div>
      <div className="product-image-wrap">
        <img src={product.image} alt={product.title} />
      </div>
      <h3>{product.title}</h3>
      <div className="stars">★★★★★ <span>({Math.floor(product.rating?.count || 100)})</span></div>
      <div className="price-row">
        <span className="currency">₹</span>
        <span className="price">{Math.round(product.price * 84).toLocaleString("en-IN")}</span>
      </div>
      <p className="delivery">FREE Delivery <b>Tomorrow</b></p>
      <button className="add-btn" onClick={() => onAdd(product)}>Add to Cart</button>
    </article>
  );
}

// Existing class-component counter retained from the original project.
class ClassCounter extends Component {
  state = { count: 0 };
  render() {
    return (
      <div className="mini-counter">
        <span>Class Counter</span>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Add Item ({this.state.count})
        </button>
      </div>
    );
  }
}

function Amazon({ NavBar }) {
  // useState: cart and search state.
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect: fetch products when the page loads.
  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const addToCart = (product) => setCart((items) => [...items, product]);
  const removeFromCart = () => setCart((items) => items.slice(0, -1));

  // Form + search filtering.
  const handleSearch = (e) => e.preventDefault();
  const filteredProducts = useMemo(() => {
    const q = search.toLowerCase().trim();
    return products.filter((p) => p.title.toLowerCase().includes(q));
  }, [products, search]);

  const buyNow = () => alert("Order placed successfully! Thank you for shopping with Amazon.");

  return (
    <div className="site">
      <NavBar cartCount={cart.length} />

      <main>
        <section className="hero">
          <div className="hero-content">
            00            <p className="hero-kicker">AMAZON SHOPPING</p>
            <h1>Great deals. <span>Every day.</span></h1>
            <p>Shop electronics, fashion, home essentials and more.</p>
            <button onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}>
              Shop today's deals
            </button>
          </div>
          <div className="hero-cards">
            <div><b>Up to 60% off</b><small>Electronics</small></div>
            <div><b>Prime Delivery</b><small>Fast & reliable</small></div>
            <div><b>₹499 onwards</b><small>Top picks</small></div>
          </div>
        </section>

        <section className="quick-row">
          <div><b>🚚 Fast Delivery</b><span>Across India</span></div>
          <div><b>🔒 Secure Payments</b><span>100% protected</span></div>
          <div><b>↩ Easy Returns</b><span>Hassle-free</span></div>
          <div><b>⭐ Prime Benefits</b><span>Exclusive deals</span></div>
        </section>

        <section className="workspace">
          <div className="section-heading">
            <div>
              <p className="eyebrow">TODAY'S PICKS</p>
              <h2>Popular products</h2>
            </div>
            <span>{cart.length} item(s) in cart</span>
          </div>

          {/* Forms: product search */}
          <form className="amazon-search" onSubmit={handleSearch}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products, brands and more"
            />
            <button type="submit">Search</button>
          </form>

          {loading ? (
            <div className="status">Loading Amazon products...</div>
          ) : (
            <div className="product-grid" id="products">
              {/* map(): iterative rendering */}
              {filteredProducts.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} onAdd={addToCart} />
              ))}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="status">No products found. Try another search.</div>
          )}
        </section>

        <section className="cart-panel">
          <div>
            <p className="eyebrow">YOUR SHOPPING CART</p>
            <h2>Cart has {cart.length} item(s)</h2>
            <p>Add products from the cards above and manage your cart here.</p>
          </div>
          <div className="cart-actions">
            <button className="secondary-btn" onClick={removeFromCart} disabled={!cart.length}>Remove Item</button>
            <button className="buy-btn" onClick={buyNow} disabled={!cart.length}>Buy Now</button>
          </div>
        </section>

        <section className="legacy-section">
          <div>
            <h3>React Concepts Demo</h3>
            <p>Your original mini-project counters are retained below.</p>
          </div>
          <ClassCounter />
          <div className="mini-counter">
            <span>Functional Counter</span>
            <button onClick={() => setCart((items) => [...items, { id: Date.now(), title: "Quick Cart Item" }])}>
              Add Item ({cart.length})
            </button>
          </div>
        </section>
      </main>

      <footer>
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Back to top</button>
        <div className="footer-main">
          <div><h3>Get to Know Us</h3><p>About Amazon</p><p>Careers</p><p>Press Releases</p></div>
          <div><h3>Make Money with Us</h3><p>Sell on Amazon</p><p>Advertise Your Products</p><p>Become an Affiliate</p></div>
          <div><h3>Let Us Help You</h3><p>Your Account</p><p>Returns Centre</p><p>Help</p></div>
        </div>
        <div className="footer-bottom">© 2026 Amazon Clone • React Mini Project</div>
      </footer>
    </div>
  );
}

export default Amazon;
