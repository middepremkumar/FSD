-- ============================================================================
-- 5.a: Create Database and Table using MySQL Command Line Client
-- File: database/5a_create_db_cli.sql
-- Description: Step-by-step commands to execute in the MySQL Command Line Client
-- ============================================================================

/*
--------------------------------------------------------------------------------
HOW TO EXECUTE IN MYSQL COMMAND LINE CLIENT:
--------------------------------------------------------------------------------
1. Open the "MySQL Command Line Client" from your Start Menu, OR open CMD/PowerShell:
   > mysql -u root -p
2. Enter your password when prompted (press Enter if no password).
3. You will see the MySQL prompt:
   mysql>
4. Run each command below line by line or source this file using:
   mysql> source c:/Users/DELL/Desktop/kumar/FSD-main (1)/FSD-main/database/5a_create_db_cli.sql;
--------------------------------------------------------------------------------
*/

-- Step 1: Display all existing databases
SHOW DATABASES;

-- Step 2: Create a new database named 'fsd_lab_store'
CREATE DATABASE IF NOT EXISTS fsd_lab_store;

-- Step 3: Verify the database was created
SHOW DATABASES;

-- Step 4: Select and switch to the new database
USE fsd_lab_store;

-- Step 5: Verify the currently selected database
SELECT DATABASE();

-- Step 6: Create the 'customers' table
CREATE TABLE IF NOT EXISTS customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    city VARCHAR(50) DEFAULT 'Bengaluru',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 7: Create the 'products' table inside the database
CREATE TABLE IF NOT EXISTS products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    stock INT NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 8: Show all tables created inside the database
SHOW TABLES;

-- Step 9: Describe the schema / structure of the created tables
DESCRIBE customers;
DESCRIBE products;

-- Step 10: Show the complete CREATE TABLE DDL definition
SHOW CREATE TABLE products;
