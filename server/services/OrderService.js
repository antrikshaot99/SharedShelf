const { Order, OrderItem, CartItem, Book, Rental, User } = require('../models');
const CartService = require('./CartService');

class OrderService {
  /**
   * Get user's orders
   */
  static async getUserOrders(userId) {
    return await Order.findAll({
      where: { user_id: userId },
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{ model: Book, as: 'book' }]
      }],
      order: [['createdAt', 'DESC']]
    });
  }

  /**
   * Get all orders (admin only)
   */
  static async getAllOrders() {
    return await Order.findAll({
      include: [
        { model: User, as: 'user', attributes: { exclude: ['password'] } },
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Book, as: 'book' }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
  }

  /**
   * Get order by ID
   */
  static async getById(orderId, userId, userRole) {
    const order = await Order.findByPk(orderId, {
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{ model: Book, as: 'book' }]
      }]
    });

    if (!order) {
      throw new Error('Order not found');
    }

    // Authorization check
    if (order.user_id !== userId && userRole !== 'admin') {
      throw new Error('Access denied');
    }

    return order;
  }

  /**
   * Place order from cart
   */
  static async placeOrder(userId) {
    // Get cart items
    const cartItems = await CartItem.findAll({
      where: { user_id: userId },
      include: [{ model: Book, as: 'book' }]
    });

    if (cartItems.length === 0) {
      throw new Error('Cart is empty');
    }

    // Calculate total and determine order type
    let totalAmount = 0;
    const orderType = cartItems[0].mode === 'rent' ? 'rental' : 'purchase';

    cartItems.forEach(item => {
      const price = item.mode === 'rent' ? item.book.rent_price : item.book.price;
      totalAmount += price * item.quantity;
    });

    // Create order
    const order = await Order.create({
      user_id: userId,
      totalAmount,
      status: 'completed',
      orderType
    });

    // Create order items and rentals
    for (const item of cartItems) {
      const price = item.mode === 'rent' ? item.book.rent_price : item.book.price;
      await OrderItem.create({
        order_id: order.id,
        book_id: item.book_id,
        quantity: item.quantity,
        price
      });

      // If rental, create rental record
      if (item.mode === 'rent') {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 30); // 30-day rental period

        await Rental.create({
          user_id: userId,
          book_id: item.book_id,
          startDate: new Date(),
          dueDate,
          status: 'active',
          rentalPrice: price
        });
      }

      // Keep inventory status aligned with completed orders for admin stats.
      await Book.update(
        { status: item.mode === 'rent' ? 'rented' : 'sold' },
        { where: { id: item.book_id } }
      );
    }

    // Clear cart
    await CartService.clear(userId);

    // Return full order with items
    return await Order.findByPk(order.id, {
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{ model: Book, as: 'book' }]
      }]
    });
  }

  /**
   * Update order status (admin only)
   */
  static async updateStatus(orderId, status) {
    const order = await Order.findByPk(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    order.status = status;
    await order.save();

    return await Order.findByPk(orderId, {
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{ model: Book, as: 'book' }]
      }]
    });
  }
}

module.exports = OrderService;
