# 📚 SharedShelf

<div align="center">
  <img src="logo.png" alt="SharedShelf Logo" width="200">
  
  **Buy, Sell & Rent Books**
</div>

A full-stack web application for buying, selling, and renting books. Built with modern technologies and designed for a seamless user experience.

## ✨ Features

- **User Authentication** – Secure registration and login with Firebase Authentication + JWT tokens
- **Google Sign-In** – Quick login with your Google account
- **Book Marketplace** – Browse, search, and filter books by genre and availability
- **Buy & Rent Books** – Smart filtering ensures you only see books available for purchase or rental
- **Book Ownership** – Your own listed books are automatically excluded from the marketplace
- **Sell Your Books** – List books for sale with custom pricing
- **Shopping Cart** – Add books, manage quantities, and checkout smoothly
- **Order Management** – Track purchases and rental history
- **Admin Dashboard** – Full admin panel with analytics, user management, book management, and order tracking
- **Role-Based Access** – Automatic routing to Admin Dashboard or User Dashboard based on role
- **Responsive Design** – Optimized for desktop, tablet, and mobile devices

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
- **React 19.2** - UI library with modern hooks and features
- **Vite 7.3** - Lightning-fast frontend tooling
- **Apollo Client 4.1** - GraphQL client with advanced caching
- **Firebase SDK 13.9** - Real-time authentication
- **Context API** - State management (Auth, Cart, Orders)
- **CSS3** - Modern styling with CSS variables and Grid/Flexbox

### Backend
- **Node.js** - JavaScript runtime
- **Express 5.2** - Minimalist web framework
- **Apollo Server 5.4** - GraphQL API server
- **Sequelize 6.37** - Promise-based ORM for databases
- **MySQL 8.0** - Relational database
- **Firebase Admin SDK 13.9** - Server-side Firebase operations
- **JWT** - Secure token-based authentication

## 📋 Prerequisites

Before you begin, ensure you have:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MySQL 8.0** (with root access)
- **Git**
- **Firebase Project** (with Authentication enabled)
  - Go to https://console.firebase.google.com
  - Create a new project
  - Enable Google Sign-In in Authentication methods
  - Get your Firebase config credentials

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

Create a `.env` file in the server directory:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=sharedshelf
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_secret_jwt_key_here

# Environment
NODE_ENV=development
PORT=5000

# Firebase Configuration
FIREBASE_PROJECT_ID=your-firebase-project-id

# Admin Credentials
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=admin123

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

Initialize the database:
```bash
npm run setup
```

Start the server:
```bash
npm run dev
```

The GraphQL server will run on `http://localhost:5000/graphql`

### 3. Setup Client

In a new terminal, navigate to the client directory:
```bash
cd client
npm install
```

Create a `.env` file in the client directory:
```env
VITE_API_URL=http://localhost:5000/graphql
```

Update Firebase configuration in `client/src/firebase.js` with your Firebase credentials:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_ID",
  appId: "YOUR_APP_ID"
};
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

## 🎯 Key Features Explained

### Book Filtering
- **Buy Mode**: Shows only books with prices (excludes your listings)
- **Rent Mode**: Shows only books with rental prices (excludes your rentals)
- **Your Listings Tab**: Quick access to view and manage your own books

### Admin Dashboard
- **Overview Tab**: Real-time analytics, revenue tracking, genre breakdown
- **Books Tab**: Manage listings, edit prices, change status
- **Users Tab**: Promote/demote user roles, manage accounts
- **Orders Tab**: Track all orders and revenue metrics

### Authentication Flow
1. User signs in with Firebase
2. Firebase token validated on backend
3. Database user fetched via GraphQL query
4. Role-based routing applied
5. State persists in AuthContext with automatic hydration

## 🗄️ Database Setup

### Initialize MySQL Database
```bash
# Connect to MySQL
mysql -u root -p

# Create database
CREATE DATABASE sharedshelf;
USE sharedshelf;

# Tables are auto-created by Sequelize on first run
```

### Update Admin User Role
If you created a user that should be admin:
```bash
cd server
node updateAdminRole.js
```

## 🚀 Deployment

### Environment Variables to Update
- `FIREBASE_PROJECT_ID` - Your Firebase project ID
- `DB_HOST`, `DB_USER`, `DB_PASSWORD` - Production database credentials
- `JWT_SECRET` - Use a strong random string
- `EMAIL_*` - Configure email service for notifications
- `ADMIN_EMAIL`, `ADMIN_PASSWORD` - Secure credentials

### Build for Production
```bash
# Client
cd client
npm run build

# Server
cd server
npm install --production
NODE_ENV=production npm start
```

## 🐛 Troubleshooting

### Issue: Firebase token verification failed
**Solution**: Ensure `FIREBASE_PROJECT_ID` matches your Firebase project ID

### Issue: "Cannot find module" errors
**Solution**: Delete `node_modules` and `package-lock.json`, then run `npm install`

### Issue: MySQL connection fails
**Solution**: Check MySQL is running and credentials in `.env` are correct

### Issue: Google Sign-In not working
**Solution**: Enable Google Sign-In in Firebase Console > Authentication > Sign-in method

## 📚 API Documentation

### Key GraphQL Queries
- `me` - Get current user info
- `books` - Fetch all books with filtering
- `users` - Get all users (admin only)
- `stats` - Get dashboard statistics (admin only)

### Key GraphQL Mutations
- `register` - Create new user account
- `login` - Authenticate with email/password
- `addBook` - List a new book for sale/rent
- `addToCart` - Add book to shopping cart
- `checkout` - Complete a purchase

## 🤝 Contributing

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
