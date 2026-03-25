const { CartItem, Book } = require('../models');
const BookService = require('./BookService');

class CartService {
  /**
   * Get user's cart items
   */
  static async getCart(userId) {
    return await CartItem.findAll({
      where: { user_id: userId },
      include: [{ model: Book, as: 'book' }]
    });
  }

  /**
   * Add item to cart
   */
  static async addItem(userId, bookId, mode) {
    // Verify book exists
    await BookService.getById(bookId);

    // Check if item already in cart
    const existing = await CartItem.findOne({
      where: { user_id: userId, book_id: bookId, mode }
    });

    if (existing) {
      existing.quantity += 1;
      await existing.save();
      return await CartItem.findByPk(existing.id, {
        include: [{ model: Book, as: 'book' }]
      });
    }

    // Create new cart item
    const cartItem = await CartItem.create({
      user_id: userId,
      book_id: bookId,
      quantity: 1,
      mode
    });

    return await CartItem.findByPk(cartItem.id, {
      include: [{ model: Book, as: 'book' }]
    });
  }

  /**
   * Update cart item quantity
   */
  static async updateItem(cartItemId, userId, quantity) {
    const cartItem = await CartItem.findOne({
      where: { id: cartItemId, user_id: userId }
    });

    if (!cartItem) {
      throw new Error('Cart item not found');
    }

    // Delete if quantity <= 0
    if (quantity <= 0) {
      await cartItem.destroy();
      return null;
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    return await CartItem.findByPk(cartItemId, {
      include: [{ model: Book, as: 'book' }]
    });
  }

  /**
   * Remove item from cart
   */
  static async removeItem(cartItemId, userId) {
    const cartItem = await CartItem.findOne({
      where: { id: cartItemId, user_id: userId }
    });

    if (!cartItem) {
      throw new Error('Cart item not found');
    }

    await cartItem.destroy();
    return true;
  }

  /**
   * Clear entire cart
   */
  static async clear(userId) {
    const deletedCount = await CartItem.destroy({
      where: { user_id: userId }
    });

    return deletedCount > 0;
  }

  /**
   * Calculate cart total
   */
  static async calculateTotal(userId) {
    const items = await this.getCart(userId);
    let total = 0;

    items.forEach(item => {
      const price = item.mode === 'rent' ? item.book?.rent_price : item.book?.price;
      total += price * item.quantity;
    });

    return total;
  }
}

module.exports = CartService;
