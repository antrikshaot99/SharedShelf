const UserService = require('./UserService');     // Handles user-related operations (e.g., authentication, profiles)
const BookService = require('./BookService');     // Manages book-related logic (e.g., listing, details)
const CartService = require('./CartService');     // Handles shopping cart functionality
const OrderService = require('./OrderService');   // Processes orders and order history
const RentalService = require('./RentalService'); // Manages book rentals
const StatsService = require('./StatsService');   // Provides statistics and analytics


module.exports = {
  UserService,
  BookService,
  CartService,
  OrderService,
  RentalService,
  StatsService
};
