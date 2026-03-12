-- BookNest Database Setup
-- Run this in your MySQL client before starting the server

CREATE DATABASE IF NOT EXISTS booknest;
USE booknest;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Books Table
CREATE TABLE IF NOT EXISTS books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  genre VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2),
  rent_price DECIMAL(10, 2),
  status ENUM('available', 'rented', 'sold') DEFAULT 'available',
  owner_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Sample Admin User (password: admin123)
-- You should hash passwords in production!
INSERT INTO users (name, email, password, role) VALUES 
('Admin User', 'admin@booknest.com', 'admin123', 'admin')
ON DUPLICATE KEY UPDATE id=id;

-- Sample Books
INSERT INTO books (title, author, genre, price, rent_price, owner_id) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', 'Fiction', 299, 29.9, 1),
('To Kill a Mockingbird', 'Harper Lee', 'Fiction', 349, 34.9, 1),
('1984', 'George Orwell', 'Sci-Fi', 399, 39.9, 1),
('Pride and Prejudice', 'Jane Austen', 'Romance', 279, 27.9, 1),
('The Hobbit', 'J.R.R. Tolkien', 'Fantasy', 449, 44.9, 1)
ON DUPLICATE KEY UPDATE id=id;

SELECT 'Database setup complete!' as message;
