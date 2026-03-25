const { User, Book, Order, Rental } = require('../models');

class StatsService {
  /**
   * Get comprehensive dashboard statistics (admin only)
   */
  static async getStats() {
    const totalUsers = await User.count();
    const totalBooks = await Book.count();
    const genres = await Book.findAll({
      attributes: ['genre'],
      group: ['genre']
    });
    const totalOrders = await Order.count();
    const totalRentals = await Rental.count();
    const activeRentals = await Rental.count({
      where: { status: 'active' }
    });

    return {
      totalUsers,
      totalBooks,
      totalGenres: genres.length,
      totalOrders,
      totalRentals,
      activeRentals
    };
  }

  /**
   * Get user-specific statistics
   */
  static async getUserStats(userId) {
    const purchasedBooks = await Order.count({
      where: { user_id: userId, orderType: 'purchase' }
    });

    const rentedBooks = await Rental.count({
      where: { user_id: userId }
    });

    const activeRentals = await Rental.count({
      where: { user_id: userId, status: 'active' }
    });

    return {
      purchasedBooks,
      rentedBooks,
      activeRentals
    };
  }

  /**
   * Get book statistics by genre
   */
  static async getGenreStats() {
    const books = await Book.findAll({
      attributes: ['genre'],
      group: ['genre']
    });

    const genreStats = {};
    for (const book of books) {
      const count = await Book.count({
        where: { genre: book.genre }
      });
      genreStats[book.genre] = count;
    }

    return genreStats;
  }

  /**
   * Get revenue statistics (admin dashboard)
   */
  static async getRevenueStats() {
    const orders = await Order.findAll({
      attributes: ['totalAmount', 'createdAt']
    });

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

    return {
      totalRevenue,
      totalOrders: orders.length,
      averageOrderValue
    };
  }
}

module.exports = StatsService;
