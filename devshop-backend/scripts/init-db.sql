-- Drop tables if they exist
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

-- Users table (Vulnerable: Plain text passwords or weak hashes)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL
);

-- Products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL
);

-- Reviews table (Vulnerable: Stored XSS in content)
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    user_email VARCHAR(255),
    content TEXT NOT NULL
);

-- Orders table (Vulnerable: IDOR)
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    total DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING'
);

-- Order items link
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES products(id)
);

-- Seed initial data
INSERT INTO products (name, description, price) VALUES
('Kubek Programisty', 'Ogrzewa dłonie i kompiluje kod', 49.99),
('Klawiatura Mechaniczna', 'Głośna i precyzyjna', 349.00),
('Podkładka RGB', 'Więcej klatek w grach', 89.90);

INSERT INTO users (email, password) VALUES
('admin@devshop.local', 'admin123'),
('user@example.com', 'password');

INSERT INTO orders (user_id, total, status) VALUES
(2, 438.90, 'PAID');

INSERT INTO order_items (order_id, product_id) VALUES
(1, 2),
(1, 3);

INSERT INTO reviews (product_id, user_email, content) VALUES
(1, 'test@example.com', 'Świetny produkt! <script>console.log("XSS success")</script>');
