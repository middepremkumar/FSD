-- ============================================================================
-- 5.b: MySQL Queries to Create Table, Insert Data, and Update Data
-- File: database/5b_crud_queries.sql
-- Description: Comprehensive SQL script demonstrating table creation (DDL),
--              data insertion (DML), data modification (UPDATE), and verification.
-- ============================================================================

-- Ensure database is selected
CREATE DATABASE IF NOT EXISTS fsd_lab_store;
USE fsd_lab_store;

-- ----------------------------------------------------------------------------
-- PART 1: CREATE TABLE
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS inventory_items;

CREATE TABLE inventory_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    supplier VARCHAR(100) DEFAULT 'Amazon Direct',
    status ENUM('In Stock', 'Low Stock', 'Out of Stock') DEFAULT 'In Stock',
    last_restocked TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

DESCRIBE inventory_items;

-- ----------------------------------------------------------------------------
-- PART 2: INSERT DATA
-- ----------------------------------------------------------------------------

-- 2.1 Single Row Insert
INSERT INTO inventory_items (item_name, category, unit_price, quantity, supplier, status)
VALUES ('Apple iPhone 15', 'Electronics', 69999.00, 45, 'Apple India', 'In Stock');

-- 2.2 Insert with specific columns (allowing default values)
INSERT INTO inventory_items (item_name, category, unit_price, quantity)
VALUES ('Sony WH-1000XM5 Headphones', 'Audio', 29990.00, 18);

-- 2.3 Multiple Rows Batch Insert
INSERT INTO inventory_items (item_name, category, unit_price, quantity, supplier, status) VALUES
('MacBook Air M2', 'Computers', 89900.00, 12, 'Apple India', 'In Stock'),
('Samsung Galaxy S24 Ultra', 'Electronics', 129999.00, 5, 'Samsung Electronics', 'Low Stock'),
('Nike Air Max 270', 'Footwear', 12495.00, 35, 'Nike Retail', 'In Stock'),
('Logitech MX Master 3S Mouse', 'Accessories', 8995.00, 2, 'Logitech', 'Low Stock'),
('Dell UltraSharp 27" 4K Monitor', 'Computers', 45000.00, 0, 'Dell India', 'Out of Stock');

-- Display records immediately after insertion
SELECT '--- Inventory after initial INSERT ---' AS Step;
SELECT item_id, item_name, category, unit_price, quantity, status FROM inventory_items;

-- ----------------------------------------------------------------------------
-- PART 3: UPDATE DATA
-- ----------------------------------------------------------------------------

-- 3.1 Update price for a specific product by ID
UPDATE inventory_items
SET unit_price = 66999.00
WHERE item_id = 1;

-- 3.2 Update quantity and status for low-stock product
UPDATE inventory_items
SET quantity = quantity + 20,
    status = 'In Stock'
WHERE item_id = 4;

-- 3.3 Bulk Update: Apply a 10% promotional discount to all 'Computers'
UPDATE inventory_items
SET unit_price = unit_price * 0.90
WHERE category = 'Computers';

-- 3.4 Conditional Update: Set status to 'Out of Stock' for all items where quantity is 0
UPDATE inventory_items
SET status = 'Out of Stock'
WHERE quantity = 0;

-- ----------------------------------------------------------------------------
-- PART 4: VERIFICATION
-- ----------------------------------------------------------------------------
SELECT '--- Inventory after UPDATE operations ---' AS Step;
SELECT 
    item_id, 
    item_name, 
    category, 
    unit_price, 
    quantity, 
    status, 
    last_restocked 
FROM inventory_items
ORDER BY item_id ASC;
