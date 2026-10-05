-- ============================================================================
-- 5.e: Database Initialization SQL Script for API Integration
-- Project: Amazon Shopping Full Stack Development (FSD)
-- File: database/database.sql
-- Description: Creates the database, creates required tables (categories, products, orders),
--              and populates initial sample data for the Express API.
-- ============================================================================

-- Step 1: Create Database if it does not already exist
CREATE DATABASE IF NOT EXISTS amazon_fsd_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

-- Step 2: Switch to the database
USE amazon_fsd_db;

-- Step 3: Disable foreign key checks during re-creation
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------------------------------------------------------
-- Table 1: categories
-- ----------------------------------------------------------------------------
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Table 2: products
-- ----------------------------------------------------------------------------
CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    category_id INT,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    original_price DECIMAL(10, 2) DEFAULT NULL,
    rating_rate DECIMAL(3, 1) DEFAULT 4.5,
    rating_count INT DEFAULT 0,
    deal_tag VARCHAR(100) DEFAULT NULL,
    badge VARCHAR(100) DEFAULT NULL,
    image TEXT,
    delivery_info VARCHAR(255) DEFAULT 'FREE Delivery Tomorrow',
    stock_quantity INT NOT NULL DEFAULT 25,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_product_category FOREIGN KEY (category_id) 
        REFERENCES categories(category_id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Table 3: orders (Demonstrating relational transactions)
-- ----------------------------------------------------------------------------
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(150) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    order_status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Table 4: order_items
-- ----------------------------------------------------------------------------
CREATE TABLE order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_order_header FOREIGN KEY (order_id) 
        REFERENCES orders(order_id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_order_product FOREIGN KEY (product_id) 
        REFERENCES products(product_id) 
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================================
-- Seed Data: Insert Initial Categories
-- ============================================================================
INSERT INTO categories (category_id, name, slug, description) VALUES
(1, 'Mobiles', 'mobiles', 'Smartphones, accessories, and wearables'),
(2, 'Audio', 'audio', 'Headphones, earphones, and Bluetooth speakers'),
(3, 'Laptops', 'laptops', 'Notebooks, MacBooks, and gaming laptops'),
(4, 'Fashion', 'fashion', 'Sneakers, clothing, and lifestyle apparel'),
(5, 'Smart Wearables', 'wearables', 'Smartwatches, fitness bands, and trackers'),
(6, 'Cameras', 'cameras', 'Mirrorless cameras, action cams, and lenses');

-- ============================================================================
-- Seed Data: Insert Initial Products (Matching Project Catalog)
-- ============================================================================
INSERT INTO products (code, title, category_id, price, original_price, rating_rate, rating_count, deal_tag, badge, image, delivery_info, stock_quantity) VALUES
('prod-1', 'Apple iPhone 15 (128 GB) - Blue', 1, 69999.00, 79900.00, 4.6, 4820, 'Great Indian Deal', 'Best Seller', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80', 'FREE Delivery Tomorrow, 7 AM - 9 PM', 40),
('prod-2', 'Sony WH-1000XM5 Wireless Noise-Cancelling Headphones', 2, 29990.00, 34990.00, 4.8, 2190, 'Limited Deal', 'Amazon\'s Choice', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80', 'FREE Delivery by 9 PM Tomorrow', 30),
('prod-3', 'Apple MacBook Air 13" M2 Chip (8GB RAM, 256GB SSD) - Starlight', 3, 89900.00, 99900.00, 4.9, 1430, 'Flat ₹10,000 Off', 'Best Seller', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80', 'FREE Delivery Tomorrow', 15),
('prod-4', 'Samsung Galaxy S24 Ultra 5G (Titanium Gray, 256GB Storage)', 1, 129999.00, 134999.00, 4.7, 3200, 'Exchange Offer', 'Top Brand', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80', 'FREE Delivery by Today 10 PM', 20),
('prod-5', 'Nike Air Max 270 Men\'s Athletic Running & Lifestyle Sneakers', 4, 12495.00, 14995.00, 4.5, 1870, '17% off', 'Popular Pick', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80', 'FREE Delivery Tomorrow', 50),
('prod-6', 'Apple Watch Series 9 GPS 45mm Midnight Aluminium Case', 5, 41900.00, 44900.00, 4.7, 980, 'Bank Offer', 'Amazon\'s Choice', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80', 'FREE Delivery Tomorrow', 25),
('prod-7', 'Sony Alpha 7 IV Full-Frame Mirrorless Interchangeable Lens Camera', 6, 214990.00, 242490.00, 4.9, 410, 'Special Price', 'Best Seller', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80', 'FREE Delivery Tomorrow', 10),
('prod-8', 'Levi\'s Men\'s 511 Slim Fit Jeans (Dark Indigo Wash)', 4, 2599.00, 3999.00, 4.3, 3120, '35% off', 'Trending', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80', 'FREE Delivery by Today 8 PM', 80);

-- ============================================================================
-- Seed Data: Sample Orders
-- ============================================================================
INSERT INTO orders (customer_name, customer_email, total_amount, order_status) VALUES
('Rahul Sharma', 'rahul.sharma@example.com', 69999.00, 'delivered'),
('Priya Patel', 'priya.patel@example.com', 29990.00, 'shipped'),
('Amit Verma', 'amit.verma@example.com', 12495.00, 'processing');

INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
(1, 1, 1, 69999.00),
(2, 2, 1, 29990.00),
(3, 5, 1, 12495.00);

-- Verify records:
SELECT 'Database initialized successfully!' AS Status;
SELECT COUNT(*) AS total_categories FROM categories;
SELECT COUNT(*) AS total_products FROM products;
SELECT COUNT(*) AS total_orders FROM orders;
