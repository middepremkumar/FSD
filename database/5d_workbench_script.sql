-- ============================================================================
-- 5.d: MySQL Workbench Script File
-- File: database/5d_workbench_script.sql
-- Description: Advanced script file crafted for MySQL Workbench.
--              Includes Views, Stored Procedures with DELIMITERs, Triggers,
--              and Transaction Control Blocks (ACID compliance).
--
-- HOW TO USE IN MYSQL WORKBENCH:
-- 1. Open MySQL Workbench.
-- 2. Connect to your MySQL Connection (e.g. Local instance 3306).
-- 3. Go to File -> Open SQL Script... (Ctrl + Shift + O)
-- 4. Select this file: database/5d_workbench_script.sql
-- 5. Click the yellow Lightning Bolt icon (Execute all) or press Ctrl + Shift + Enter.
-- ============================================================================

-- Disable safe update warnings for workbench scripting
SET SQL_SAFE_UPDATES = 0;

-- Step 1: Initialize Database
CREATE DATABASE IF NOT EXISTS workbench_fsd_db;
USE workbench_fsd_db;

-- Step 2: Create Relational Tables
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;

CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE audit_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    action_type VARCHAR(50) NOT NULL,
    description TEXT,
    log_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Sample Products
INSERT INTO products (name, category, price, stock) VALUES
('Apple iPhone 15', 'Electronics', 69999.00, 20),
('Sony WH-1000XM5', 'Audio', 29990.00, 15),
('Samsung Galaxy S24', 'Electronics', 79999.00, 10),
('Dell XPS 13', 'Computers', 115000.00, 8);

-- ----------------------------------------------------------------------------
-- PART 3: CREATE A VIEW (MySQL Workbench Visual Schema Viewable)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW vw_product_summary AS
SELECT 
    product_id,
    name,
    category,
    price,
    stock,
    CASE 
        WHEN stock = 0 THEN 'Out of Stock'
        WHEN stock <= 10 THEN 'Reorder Soon'
        ELSE 'Sufficient Stock'
    END AS inventory_status
FROM products;

-- ----------------------------------------------------------------------------
-- PART 4: STORED PROCEDURE WITH DELIMITER
-- ----------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_PlaceOrder;

DELIMITER //

CREATE PROCEDURE sp_PlaceOrder(
    IN p_product_id INT,
    IN p_quantity INT,
    OUT p_status_message VARCHAR(255)
)
proc_label: BEGIN
    DECLARE v_available_stock INT;
    DECLARE v_unit_price DECIMAL(10, 2);
    DECLARE v_total DECIMAL(10, 2);

    -- Check if product exists and fetch stock & price
    SELECT stock, price INTO v_available_stock, v_unit_price
    FROM products
    WHERE product_id = p_product_id;

    IF v_available_stock IS NULL THEN
        SET p_status_message = 'ERROR: Product does not exist.';
        LEAVE proc_label;
    END IF;

    IF v_available_stock < p_quantity THEN
        SET p_status_message = CONCAT('ERROR: Insufficient stock. Only ', v_available_stock, ' units available.');
        LEAVE proc_label;
    END IF;

    -- Calculate total price
    SET v_total = v_unit_price * p_quantity;

    -- Start Transaction for ACID safety
    START TRANSACTION;

        -- 1. Deduct stock
        UPDATE products 
        SET stock = stock - p_quantity
        WHERE product_id = p_product_id;

        -- 2. Insert order record
        INSERT INTO orders (product_id, quantity, total_price)
        VALUES (p_product_id, p_quantity, v_total);

        -- 3. Insert audit entry
        INSERT INTO audit_logs (action_type, description)
        VALUES ('ORDER_PLACED', CONCAT('Order placed for Product ID ', p_product_id, ', Quantity: ', p_quantity, ', Total: ₹', v_total));

    COMMIT;

    SET p_status_message = CONCAT('SUCCESS: Order placed for ', p_quantity, ' unit(s). Total: ₹', v_total);

END //

DELIMITER ;

-- ----------------------------------------------------------------------------
-- PART 5: TRIGGER FOR AUDIT TRAIL
-- ----------------------------------------------------------------------------
DROP TRIGGER IF EXISTS trg_after_product_insert;

DELIMITER //

CREATE TRIGGER trg_after_product_insert
AFTER INSERT ON products
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (action_type, description)
    VALUES ('PRODUCT_ADDED', CONCAT('New product created: ', NEW.name, ' (ID: ', NEW.product_id, ') at ₹', NEW.price));
END //

DELIMITER ;

-- ----------------------------------------------------------------------------
-- PART 6: TESTING STORED PROCEDURE & TRANSACTIONS
-- ----------------------------------------------------------------------------

-- Add a product to fire the trigger
INSERT INTO products (name, category, price, stock) 
VALUES ('Apple AirPods Pro', 'Audio', 24900.00, 30);

-- Call Stored Procedure to place order
CALL sp_PlaceOrder(1, 2, @result_msg);
SELECT @result_msg AS 'Order Execution Result';

-- Call again to test stock deduction
CALL sp_PlaceOrder(2, 5, @result_msg2);
SELECT @result_msg2 AS 'Second Order Execution Result';

-- View data through the View
SELECT * FROM vw_product_summary;

-- View Orders
SELECT * FROM orders;

-- View Audit Log entries generated automatically
SELECT * FROM audit_logs ORDER BY log_timestamp DESC;
