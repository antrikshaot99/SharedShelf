# 📚 SharedShelf

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

BookNest follows a modern full-stack architecture:

```
BookNest
├── Client (React + Vite)
│   ├── Pages (Landing, Login, Register, etc.)
│   ├── Components (UI components, Forms)
│   ├── GraphQL (Queries & Mutations)
│   ├── Context (Authentication, Cart, Orders)
│   ├── Hooks (Custom React hooks)
│   └── Routes (Protected and public routes)
└── Server (Node.js + Express + GraphQL + Sequelize)
    ├── GraphQL (Type Definitions & Resolvers)
    ├── Models (User, Book, Order, Rental, etc.)
    ├── Services (Business logic)
    ├── Middleware (Authentication, validation)
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
cd booknest
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
DB_NAME=booknest
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

## 📚 API Documentation

### GraphQL Endpoints

The API uses GraphQL for all operations. Access the GraphQL playground at:
```
http://localhost:4000/graphql
```

#### Authentication
- `login(email, password)` - User login
- `register(name, email, password)` - User registration

#### Books
- `getAllBooks()` - Get all books
- `getBook(id)` - Get book details
- `addBook(title, author, price, ...)` - Add a new book (seller)
- `searchBooks(query)` - Search books
- `getGenres()` - Get all book genres

#### Cart
- `addToCart(bookId, quantity)` - Add book to cart
- `removeFromCart(bookId)` - Remove from cart
- `updateCartQuantity(bookId, quantity)` - Update quantity
- `getCart()` - Get cart items

#### Orders
- `createOrder(cartItems)` - Create an order
- `getUserOrders()` - Get user orders
- `getOrderDetails(orderId)` - Get order details

#### Rentals
- `rentBook(bookId, duration)` - Rent a book
- `getUserRentals()` - Get active rentals
- `returnRental(rentalId)` - Return rented book

## 🔧 Configuration

### Database Setup

Make sure PostgreSQL is running and create a database:
```sql
CREATE DATABASE booknest;
```

Sequelize will automatically create tables based on models on first run.

### Environment Variables

**Server (.env)**
- `DB_HOST` - Database host
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 4000)

**Client (.env)**
- `VITE_API_URL` - GraphQL API endpoint

## 👤 Default Admin Account

After setup, use these credentials to access the admin dashboard:
```
Email: admin@booknest.com
Password: admin123
```

**Important:** Change these credentials in production!

## 📁 Project Structure

```
booknest/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── context/        # Context providers
│   │   ├── graphql/        # GraphQL queries & mutations
│   │   └── routes/         # Route configuration
│   └── package.json
├── server/                 # Node.js backend
│   ├── graphql/            # GraphQL schema & resolvers
│   ├── models/             # Sequelize models
│   ├── services/           # Business logic
│   ├── middleware/         # Custom middleware
│   ├── config/             # Configuration files
│   ├── server.js           # Entry point
│   └── package.json
└── README.md              # This file
```

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Protected Routes** - Admin and user-only routes
- **Password Hashing** - Bcrypt for secure password storage
- **Input Validation** - Server-side validation of all inputs
- **CORS** - Cross-origin resource sharing configured
- **Environment Variables** - Sensitive data stored in env files

## 🧪 Testing

To run tests (when implemented):

**Server:**
```bash
cd server
npm test
```

**Client:**
```bash
cd client
npm test
```

## 📦 Deployment

### Deploy to Production

1. **Build the client:**
   ```bash
   cd client
   npm run build
   ```

2. **Set production environment variables** on your hosting platform

3. **Deploy server** to your hosting service (Heroku, AWS, DigitalOcean, etc.)

4. **Deploy client** to a CDN or static hosting (Vercel, Netlify, etc.)

Recommended platforms:
- **Backend:** Heroku, AWS EC2, Railway
- **Frontend:** Vercel, Netlify, GitHub Pages
- **Database:** AWS RDS, Railway, Neon (PostgreSQL)

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋 Support

If you have any questions or need help:
- Open an issue on GitHub
- Check existing documentation
- Review the project architecture

## 👥 Authors

- **Your Name** - Initial work and development

## 🎯 Roadmap

- [ ] User reviews and ratings
- [ ] Advanced book filtering and sorting
- [ ] Payment gateway integration (Stripe)
- [ ] Book recommendations engine
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Real-time chat support

## 📞 Contact

For more information, visit: [GitHub Repository](https://github.com/antrikshaot99/SharedShelf)

---

Happy reading! 📖🎉
