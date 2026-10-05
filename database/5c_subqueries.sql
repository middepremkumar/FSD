-- ============================================================================
-- 5.c: MySQL Queries to Implement Subqueries in MySQL Command Line Client
-- File: database/5c_subqueries.sql
-- Description: Practical implementations of various types of Subqueries:
--              1. Scalar Subquery (Single value returned)
--              2. Subquery using IN / NOT IN
--              3. Subquery using EXISTS / NOT EXISTS
--              4. Subquery in FROM clause (Derived Table)
--              5. Correlated Subquery (Evaluated once per outer row)
--              6. Subquery with ANY / ALL comparison operators
-- ============================================================================

CREATE DATABASE IF NOT EXISTS fsd_lab_store;
USE fsd_lab_store;

-- Setup tables and sample dataset for demonstrating subqueries
DROP TABLE IF EXISTS sales;
DROP TABLE IF EXISTS store_products;
DROP TABLE IF EXISTS store_categories;

CREATE TABLE store_categories (
    cat_id INT PRIMARY KEY,
    cat_name VARCHAR(50) NOT NULL
);

CREATE TABLE store_products (
    prod_id INT PRIMARY KEY,
    prod_name VARCHAR(100) NOT NULL,
    cat_id INT,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL,
    FOREIGN KEY (cat_id) REFERENCES store_categories(cat_id)
);

CREATE TABLE sales (
    sale_id INT PRIMARY KEY,
    prod_id INT,
    quantity INT NOT NULL,
    sale_date DATE NOT NULL,
    FOREIGN KEY (prod_id) REFERENCES store_products(prod_id)
);

-- Seed Categories
INSERT INTO store_categories VALUES 
(1, 'Mobiles'),
(2, 'Laptops'),
(3, 'Audio'),
(4, 'Accessories'),
(5, 'Gaming'); -- Note: No products in Gaming to test NOT IN / NOT EXISTS

-- Seed Products
INSERT INTO store_products VALUES
(101, 'iPhone 15', 1, 79900.00, 25),
(102, 'Samsung S24', 1, 74999.00, 30),
(103, 'MacBook Air M2', 2, 99900.00, 15),
(104, 'Dell Inspiron 15', 2, 49990.00, 20),
(105, 'Sony WH-1000XM5', 3, 29990.00, 40),
(106, 'boAt Rockerz', 3, 1499.00, 100),
(107, 'Logitech Mouse', 4, 1299.00, 50);

-- Seed Sales
INSERT INTO sales VALUES
(1, 101, 2, '2026-03-01'),
(2, 103, 1, '2026-03-02'),
(3, 105, 3, '2026-03-03'),
(4, 101, 1, '2026-03-04');

-- ----------------------------------------------------------------------------
-- 1. SCALAR SUBQUERY
-- Find all products whose price is greater than the overall average product price
-- ----------------------------------------------------------------------------
SELECT '--- 1. Products priced above the overall average price ---' AS Query_Name;

SELECT prod_name, price, (SELECT ROUND(AVG(price), 2) FROM store_products) AS overall_avg_price
FROM store_products
WHERE price > (SELECT AVG(price) FROM store_products);

-- ----------------------------------------------------------------------------
-- 2. SUBQUERY WITH 'IN'
-- Find all products that belong to 'Mobiles' or 'Laptops' categories
-- ----------------------------------------------------------------------------
SELECT '--- 2. Products in Mobiles or Laptops using IN ---' AS Query_Name;

SELECT prod_id, prod_name, price
FROM store_products
WHERE cat_id IN (
    SELECT cat_id 
    FROM store_categories 
    WHERE cat_name IN ('Mobiles', 'Laptops')
);

-- ----------------------------------------------------------------------------
-- 3. SUBQUERY WITH 'NOT IN'
-- Find categories that have NO products assigned
-- ----------------------------------------------------------------------------
SELECT '--- 3. Categories with NO products using NOT IN ---' AS Query_Name;

SELECT cat_id, cat_name
FROM store_categories
WHERE cat_id NOT IN (
    SELECT DISTINCT cat_id 
    FROM store_products 
    WHERE cat_id IS NOT NULL
);

-- ----------------------------------------------------------------------------
-- 4. SUBQUERY WITH 'EXISTS'
-- Find products that have been sold at least once (record exists in sales table)
-- ----------------------------------------------------------------------------
SELECT '--- 4. Products that have at least one sale using EXISTS ---' AS Query_Name;

SELECT p.prod_id, p.prod_name, p.price
FROM store_products p
WHERE EXISTS (
    SELECT 1 
    FROM sales s 
    WHERE s.prod_id = p.prod_id
);

-- ----------------------------------------------------------------------------
-- 5. SUBQUERY WITH 'NOT EXISTS'
-- Find products that have NEVER been sold
-- ----------------------------------------------------------------------------
SELECT '--- 5. Products that have NEVER been sold using NOT EXISTS ---' AS Query_Name;

SELECT p.prod_id, p.prod_name, p.price
FROM store_products p
WHERE NOT EXISTS (
    SELECT 1 
    FROM sales s 
    WHERE s.prod_id = p.prod_id
);

-- ----------------------------------------------------------------------------
-- 6. SUBQUERY IN 'FROM' CLAUSE (Derived Table / Inline View)
-- Calculate average price per category, then list categories with avg > 40,000
-- ----------------------------------------------------------------------------
SELECT '--- 6. Categories where average product price > 40,000 using Derived Table ---' AS Query_Name;

SELECT 
    cat_summary.cat_name,
    cat_summary.avg_category_price,
    cat_summary.item_count
FROM (
    SELECT 
        c.cat_name, 
        ROUND(AVG(p.price), 2) AS avg_category_price,
        COUNT(p.prod_id) AS item_count
    FROM store_categories c
    JOIN store_products p ON c.cat_id = p.cat_id
    GROUP BY c.cat_id, c.cat_name
) AS cat_summary
WHERE cat_summary.avg_category_price > 40000.00;

-- ----------------------------------------------------------------------------
-- 7. CORRELATED SUBQUERY
-- Find products priced higher than the average price of their OWN category
-- ----------------------------------------------------------------------------
SELECT '--- 7. Products priced higher than their own category average ---' AS Query_Name;

SELECT 
    p1.prod_id,
    p1.prod_name,
    p1.cat_id,
    p1.price,
    (SELECT ROUND(AVG(p2.price), 2) FROM store_products p2 WHERE p2.cat_id = p1.cat_id) AS cat_avg
FROM store_products p1
WHERE p1.price > (
    SELECT AVG(p2.price) 
    FROM store_products p2 
    WHERE p2.cat_id = p1.cat_id
);

-- ----------------------------------------------------------------------------
-- 8. SUBQUERY WITH 'ALL'
-- Find products that cost more than ALL products in the 'Audio' category
-- ----------------------------------------------------------------------------
SELECT '--- 8. Products that cost more than ALL Audio products ---' AS Query_Name;

SELECT prod_name, price
FROM store_products
WHERE price > ALL (
    SELECT price 
    FROM store_products 
    WHERE cat_id = (SELECT cat_id FROM store_categories WHERE cat_name = 'Audio')
);
