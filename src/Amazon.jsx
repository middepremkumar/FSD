import React, { Component, useState } from "react";
import "./Amazon.css";


// Class Component Counter
class ClassCounter extends Component {
  state = {
    count: 0
  };

  render() {
    return (
      <div className="counter-box">
        <h3>Cart (Class Counter)</h3>

        <button
          onClick={() =>
            this.setState({ count: this.state.count + 1 })
          }
        >
          Add Item ({this.state.count})
        </button>
      </div>
    );
  }
}


// Main Functional Component
function Amazon() {

  const [count, setCount] = useState(0);


  // Event Handling
  const buyNow = () => {
    alert("Order Placed Successfully!");
  };


  // Conditional Rendering
  const isPrime = true;


  const product = "iPhone 16";
  const price = 79999;


  return (

    <div className="amazon-container">


      <h1>
        Amazon Online Shopping
      </h1>

      <div className="product-card">


        <img
          src="https://m.media-amazon.com/images/I/71d7rfSl0wL._SL1500_.jpg"
          alt="iPhone 16"
          className="product-image"
        />


        <h2>
          {product}
        </h2>


        <p className="price">
          ₹{price}
        </p>


        <p className="rating">
          ⭐⭐⭐⭐⭐ (2450 Reviews)
        </p>


      </div>




      {/* Class Counter */}

      <ClassCounter />



      {/* Functional Counter */}

      <div className="counter-box">

        <h3>
          Cart (Functional Counter)
        </h3>


        <button
          onClick={() => setCount(count + 1)}
        >
          Add Item ({count})
        </button>

      </div>





      {/* Buy Button */}

      <button
        className="buy-btn"
        onClick={buyNow}
      >
        Buy Now
      </button>





      {/* Conditional Rendering */}

      {
        isPrime ?

        <h3 className="prime">
          Prime Delivery Available
        </h3>

        :

        <h3 className="normal">
          Normal Delivery
        </h3>
      }



    </div>
  );
}


export default Amazon;