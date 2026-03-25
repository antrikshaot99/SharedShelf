# 📚 SharedShelf

<div align="center">
  <img src="assets/logo.png" alt="SharedShelf Logo" width="400">
  
  **Buy, Sell & Rent Books**
</div>

A full-stack web application for buying, selling, and renting books. Built with modern technologies and designed for a seamless user experience.

## ✨ Features

- **User Authentication** - Secure login and registration with JWT-based authentication
- **Book Marketplace** - Browse, search, and discover books from various sellers
- **Book Rentals** - Rent books for short periods at affordable prices
- **Sell Your Books** - List and sell books directly to other users
- **Shopping Cart** - Add books to cart and manage purchases
- **Order Management** - Track your orders and purchase history
- **Admin Dashboard** - Comprehensive admin panel for managing books, users, and orders
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices

## 🏗️ Architecture

SharedShelf follows a modern full-stack architecture:

```
SharedShelf
├── Client (React + Vite)
│   ├── Pages (Landing, Login, Register, etc.)
│   ├── Components (UI components, Forms)
│   ├── GraphQL (Queries & Mutations)
│   └── Context (Authentication, Cart, Orders)
└── Server (Node.js + Express + GraphQL + Sequelize)
    ├── GraphQL (Type Definitions & Resolvers)
    ├── Models (User, Book, Order, Rental, etc.)
    ├── Services (Business logic)
    └── Config (Database configuration)
```

## 🛠️ Tech Stack

### Frontend
- **React** - UI library for building interactive user interfaces
- **Vite** - Next-generation frontend tooling for fast development
- **Apollo Client** - GraphQL client for data management
- **Context API** - State management (Auth, Cart, Orders)
- **CSS** - Styling with modern CSS features

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **GraphQL** - Query language and API layer
- **Sequelize** - ORM for database operations
- **PostgreSQL** - Relational database (recommended)
- **JWT** - Secure token-based authentication

## 📋 Prerequisites

Before you begin, ensure you have:
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **PostgreSQL** (or your preferred database)
- **Git**

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/antrikshaot99/SharedShelf.git
cd sharedshelf
```

### 2. Setup Server

Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

Create a `.env` file in the server directory with the following variables:
```env
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=sharedshelf
DB_PORT=5432
JWT_SECRET=your_secret_key
PORT=4000
NODE_ENV=development
```

Initialize the database:
```bash
npm run db:sync
```

Start the server:
```bash
npm start
```

The GraphQL server will run on `http://localhost:4000/graphql`

### 3. Setup Client

In a new terminal, navigate to the client directory:
```bash
cd client
npm install
```

Create a `.env` file in the client directory:
```env
VITE_API_URL=http://localhost:4000/graphql
```

Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:5173`

## 👤 Default Admin Account

After setup, use these credentials to access the admin dashboard:
```
Email: admin@gmail.com
Password: admin123
```

**Important:** Change these credentials in production!

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 👥 Authors

- **Tamanna Chopra** 
- **Ananya Tuli** 
- **Antriksh Garg** 
- **Tanisha** 

Happy reading! 📖🎉
