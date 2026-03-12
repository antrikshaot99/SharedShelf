const { User, Book, Order, OrderItem, CartItem, Rental } = require('../models');
const jwt = require('jsonwebtoken');
const admin = require('../utils/adminCreds');

const JWT_SECRET = 'booknest_secret_key_2026'; // In production, use environment variable

// Helper: Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Helper: Verify authentication
const requireAuth = (context) => {
  if (!context.user) {
    throw new Error('Authentication required');
  }
  return context.user;
};

// Helper: Verify admin role
const requireAdmin = (context) => {
  const user = requireAuth(context);
  if (user.role !== 'admin') {
    throw new Error('Admin access required');
  }
  return user;
};

const resolvers = {
  Query: {
    // ============ USER QUERIES ============
    users: async (_, __, context) => {
      requireAdmin(context);
      return await User.findAll({ attributes: { exclude: ['password'] } });
    },

    user: async (_, { id }, context) => {
      requireAuth(context);
      return await User.findByPk(id, { attributes: { exclude: ['password'] } });
    },

    me: async (_, __, context) => {
      const user = requireAuth(context);
      return await User.findByPk(user.id, { attributes: { exclude: ['password'] } });
    },

    // ============ BOOK QUERIES ============
    books: async (_, { genre, status }) => {
      const where = {};
      if (genre) where.genre = genre;
      if (status) where.status = status;
      return await Book.findAll({ where });
    },

    book: async (_, { id }) => {
      return await Book.findByPk(id);
    },

    genres: async () => {
      const books = await Book.findAll({ attributes: ['genre'], group: ['genre'] });
      return [...new Set(books.map(b => b.genre))];
    },

    // ============ CART QUERIES ============
    myCart: async (_, __, context) => {
      const user = requireAuth(context);
      return await CartItem.findAll({
        where: { user_id: user.id },
        include: [{ model: Book, as: 'Book' }]
      });
    },

    // ============ ORDER QUERIES ============
    myOrders: async (_, __, context) => {
      const user = requireAuth(context);
      return await Order.findAll({
        where: { user_id: user.id },
        include: [{
          model: OrderItem,
          as: 'items',
          include: [{ model: Book }]
        }],
        order: [['createdAt', 'DESC']]
      });
    },

    allOrders: async (_, __, context) => {
      requireAdmin(context);
      return await Order.findAll({
        include: [
          { model: User, as: 'user', attributes: { exclude: ['password'] } },
          {
            model: OrderItem,
            as: 'items',
            include: [{ model: Book }]
          }
        ],
        order: [['createdAt', 'DESC']]
      });
    },

    order: async (_, { id }, context) => {
      const user = requireAuth(context);
      const order = await Order.findByPk(id, {
        include: [{
          model: OrderItem,
          as: 'items',
          include: [{ model: Book }]
        }]
      });
      
      if (!order) throw new Error('Order not found');
      if (order.user_id !== user.id && user.role !== 'admin') {
        throw new Error('Access denied');
      }
      
      return order;
    },

    // ============ RENTAL QUERIES ============
    myRentals: async (_, __, context) => {
      const user = requireAuth(context);
      return await Rental.findAll({
        where: { user_id: user.id },
        include: [{ model: Book, as: 'book' }],
        order: [['createdAt', 'DESC']]
      });
    },

    allRentals: async (_, __, context) => {
      requireAdmin(context);
      return await Rental.findAll({
        include: [
          { model: User, as: 'user', attributes: { exclude: ['password'] } },
          { model: Book, as: 'book' }
        ],
        order: [['createdAt', 'DESC']]
      });
    },

    rental: async (_, { id }, context) => {
      const user = requireAuth(context);
      const rental = await Rental.findByPk(id, {
        include: [{ model: Book, as: 'book' }]
      });
      
      if (!rental) throw new Error('Rental not found');
      if (rental.user_id !== user.id && user.role !== 'admin') {
        throw new Error('Access denied');
      }
      
      return rental;
    },

    // ============ STATS ============
    stats: async (_, __, context) => {
      requireAdmin(context);
      
      const totalUsers = await User.count();
      const totalBooks = await Book.count();
      const genres = await Book.findAll({ attributes: ['genre'], group: ['genre'] });
      const totalOrders = await Order.count();
      const totalRentals = await Rental.count();
      const activeRentals = await Rental.count({ where: { status: 'active' } });
      
      return {
        totalUsers,
        totalBooks,
        totalGenres: genres.length,
        totalOrders,
        totalRentals,
        activeRentals
      };
    }
  },

  Mutation: {
    // ============ AUTH MUTATIONS ============
    register: async (_, { name, email, password }) => {
      const existing = await User.findOne({ where: { email } });
      if (existing) throw new Error('Email already registered');
      
      const user = await User.create({ name, email, password, role: 'user' });
      const token = generateToken(user);
      
      return {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt
        }
      };
    },

    login: async (_, { email, password }) => {
      // Check for hardcoded admin
      if (email === admin.email && password === admin.password) {
        const adminUser = {
          id: 0,
          name: 'Admin',
          email: admin.email,
          role: 'admin'
        };
        const token = generateToken(adminUser);
        return { token, user: adminUser };
      }
      
      const user = await User.findOne({ where: { email } });
      if (!user) throw new Error('Invalid credentials');
      
      const isValid = await user.comparePassword(password);
      if (!isValid) throw new Error('Invalid credentials');
      
      const token = generateToken(user);
      
      return {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt
        }
      };
    },

    // ============ BOOK MUTATIONS ============
    addBook: async (_, args, context) => {
      const user = requireAuth(context);
      
      const book = await Book.create({
        ...args,
        owner_id: user.id,
        status: 'available'
      });
      
      return book;
    },

    updateBook: async (_, { id, ...fields }, context) => {
      requireAuth(context);
      
      const book = await Book.findByPk(id);
      if (!book) throw new Error('Book not found');
      
      await book.update(fields);
      return book;
    },

    deleteBook: async (_, { id }, context) => {
      const user = requireAuth(context);
      
      const book = await Book.findByPk(id);
      if (!book) throw new Error('Book not found');
      
      if (book.owner_id !== user.id && user.role !== 'admin') {
        throw new Error('Access denied');
      }
      
      await book.destroy();
      return book;
    },

    // ============ CART MUTATIONS ============
    addToCart: async (_, { bookId, mode }, context) => {
      const user = requireAuth(context);
      
      const book = await Book.findByPk(bookId);
      if (!book) throw new Error('Book not found');
      
      const existing = await CartItem.findOne({
        where: { user_id: user.id, book_id: bookId, mode }
      });
      
      if (existing) {
        existing.quantity += 1;
        await existing.save();
        return existing;
      }
      
      const cartItem = await CartItem.create({
        user_id: user.id,
        book_id: bookId,
        quantity: 1,
        mode
      });
      
      return await CartItem.findByPk(cartItem.id, {
        include: [{ model: Book }]
      });
    },

    updateCartItem: async (_, { id, quantity }, context) => {
      const user = requireAuth(context);
      
      const cartItem = await CartItem.findOne({
        where: { id, user_id: user.id }
      });
      
      if (!cartItem) throw new Error('Cart item not found');
      
      if (quantity <= 0) {
        await cartItem.destroy();
        return null;
      }
      
      cartItem.quantity = quantity;
      await cartItem.save();
      
      return await CartItem.findByPk(cartItem.id, {
        include: [{ model: Book }]
      });
    },

    removeFromCart: async (_, { id }, context) => {
      const user = requireAuth(context);
      
      const cartItem = await CartItem.findOne({
        where: { id, user_id: user.id }
      });
      
      if (!cartItem) throw new Error('Cart item not found');
      
      await cartItem.destroy();
      return true;
    },

    clearCart: async (_, __, context) => {
      const user = requireAuth(context);
      await CartItem.destroy({ where: { user_id: user.id } });
      return true;
    },

    // ============ ORDER MUTATIONS ============
    placeOrder: async (_, __, context) => {
      const user = requireAuth(context);
      
      const cartItems = await CartItem.findAll({
        where: { user_id: user.id },
        include: [{ model: Book }]
      });
      
      if (cartItems.length === 0) {
        throw new Error('Cart is empty');
      }
      
      let totalAmount = 0;
      const orderType = cartItems[0].mode === 'rent' ? 'rental' : 'purchase';
      
      // Calculate total
      cartItems.forEach(item => {
        const price = item.mode === 'rent' ? item.Book.rent_price : item.Book.price;
        totalAmount += price * item.quantity;
      });
      
      // Create order
      const order = await Order.create({
        user_id: user.id,
        totalAmount,
        status: 'completed',
        orderType
      });
      
      // Create order items
      for (const item of cartItems) {
        const price = item.mode === 'rent' ? item.Book.rent_price : item.Book.price;
        await OrderItem.create({
          order_id: order.id,
          book_id: item.book_id,
          quantity: item.quantity,
          price
        });
        
        // If rental, create rental record
        if (item.mode === 'rent') {
          const dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + 30); // 30 days rental
          
          await Rental.create({
            user_id: user.id,
            book_id: item.book_id,
            startDate: new Date(),
            dueDate,
            status: 'active',
            rentalPrice: price
          });
        }
      }
      
      // Clear cart
      await CartItem.destroy({ where: { user_id: user.id } });
      
      return await Order.findByPk(order.id, {
        include: [{
          model: OrderItem,
          as: 'items',
          include: [{ model: Book }]
        }]
      });
    },

    updateOrderStatus: async (_, { id, status }, context) => {
      requireAdmin(context);
      
      const order = await Order.findByPk(id);
      if (!order) throw new Error('Order not found');
      
      order.status = status;
      await order.save();
      
      return await Order.findByPk(id, {
        include: [{
          model: OrderItem,
          as: 'items',
          include: [{ model: Book }]
        }]
      });
    },

    // ============ RENTAL MUTATIONS ============
    rentBook: async (_, { bookId, days }, context) => {
      const user = requireAuth(context);
      
      const book = await Book.findByPk(bookId);
      if (!book) throw new Error('Book not found');
      if (!book.rent_price) throw new Error('Book not available for rent');
      
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + days);
      
      const rental = await Rental.create({
        user_id: user.id,
        book_id: bookId,
        startDate: new Date(),
        dueDate,
        status: 'active',
        rentalPrice: book.rent_price
      });
      
      return await Rental.findByPk(rental.id, {
        include: [{ model: Book, as: 'book' }]
      });
    },

    returnRental: async (_, { id }, context) => {
      const user = requireAuth(context);
      
      const rental = await Rental.findOne({
        where: { id, user_id: user.id }
      });
      
      if (!rental) throw new Error('Rental not found');
      
      rental.returnDate = new Date();
      rental.status = 'returned';
      await rental.save();
      
      return await Rental.findByPk(id, {
        include: [{ model: Book, as: 'book' }]
      });
    },

    // ============ USER MANAGEMENT ============
    updateUserRole: async (_, { id, role }, context) => {
      requireAdmin(context);
      
      const user = await User.findByPk(id);
      if (!user) throw new Error('User not found');
      
      user.role = role;
      await user.save();
      
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      };
    },

    deleteUser: async (_, { id }, context) => {
      requireAdmin(context);
      
      const user = await User.findByPk(id);
      if (!user) throw new Error('User not found');
      
      await user.destroy();
      
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      };
    }
  }
};

module.exports = resolvers;