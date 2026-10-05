# MySQL Lab Guide (Unit 5)

This directory contains complete SQL scripts and programs for **Unit 5: Introduction to MySQL**.

---

## Files Overview

| Exercise | Description | File |
| :--- | :--- | :--- |
| **5.a** | Create Database and Table using MySQL Command Line Client | [`5a_create_db_cli.sql`](file:///c:/Users/DELL/Desktop/kumar/FSD-main%20%281%29/FSD-main/database/5a_create_db_cli.sql) |
| **5.b** | Create table, insert data, and update data | [`5b_crud_queries.sql`](file:///c:/Users/DELL/Desktop/kumar/FSD-main%20%281%29/FSD-main/database/5b_crud_queries.sql) |
| **5.c** | Subqueries in MySQL Command Line Client (Scalar, IN, EXISTS, Derived, Correlated) | [`5c_subqueries.sql`](file:///c:/Users/DELL/Desktop/kumar/FSD-main%20%281%29/FSD-main/database/5c_subqueries.sql) |
| **5.d** | MySQL Workbench script file (Views, Delimiters, Stored Procedures, Transactions) | [`5d_workbench_script.sql`](file:///c:/Users/DELL/Desktop/kumar/FSD-main%20%281%29/FSD-main/database/5d_workbench_script.sql) |
| **5.e** | Database directory in Project and initialization SQL file integrated with API | [`database.sql`](file:///c:/Users/DELL/Desktop/kumar/FSD-main%20%281%29/FSD-main/database/database.sql) & [`db.js`](file:///c:/Users/DELL/Desktop/kumar/FSD-main%20%281%29/FSD-main/database/db.js) |

---

## 1. Running in MySQL Command Line Client (CLI)

1. Open **MySQL Command Line Client** from your Start Menu or command prompt:
   ```bash
   mysql -u root -p
   ```
2. Enter your MySQL password (press `Enter` if blank).
3. To execute any script file directly in the CLI, use the `source` command:
   ```sql
   source c:/Users/DELL/Desktop/kumar/FSD-main (1)/FSD-main/database/5a_create_db_cli.sql;
   source c:/Users/DELL/Desktop/kumar/FSD-main (1)/FSD-main/database/5b_crud_queries.sql;
   source c:/Users/DELL/Desktop/kumar/FSD-main (1)/FSD-main/database/5c_subqueries.sql;
   source c:/Users/DELL/Desktop/kumar/FSD-main (1)/FSD-main/database/database.sql;
   ```

---

## 2. Running in MySQL Workbench (5.d)

1. Launch **MySQL Workbench**.
2. Click your local MySQL connection (e.g., `Local instance MySQL80` or `3306`).
3. Go to **File -> Open SQL Script...** (or press `Ctrl + Shift + O`).
4. Select [`database/5d_workbench_script.sql`](file:///c:/Users/DELL/Desktop/kumar/FSD-main%20%281%29/FSD-main/database/5d_workbench_script.sql).
5. Click the yellow **Lightning Bolt** button (or press `Ctrl + Shift + Enter`) to run the entire script.
6. The query results, stored procedures, view data, and audit logs will be displayed in the result tabs below.

---

## 3. Initializing Database from Node.js (5.e)

If you have MySQL running locally, you can initialize the database with a single npm command:

```bash
npm run db:init
```

This reads [`database/database.sql`](file:///c:/Users/DELL/Desktop/kumar/FSD-main%20%281%29/FSD-main/database/database.sql) and sets up the tables and initial seed data for the Express API.
