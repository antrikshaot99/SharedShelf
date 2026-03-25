const { Rental, Book, User } = require('../models');
const BookService = require('./BookService');

class RentalService {
  /**
   * Get user's rental history
   */
  static async getUserRentals(userId) {
    return await Rental.findAll({
      where: { user_id: userId },
      include: [{ model: Book, as: 'book' }],
      order: [['startDate', 'DESC']]
    });
  }

  /**
   * Get all rentals (admin only)
   */
  static async getAllRentals() {
    return await Rental.findAll({
      include: [
        { model: User, as: 'user', attributes: { exclude: ['password'] } },
        { model: Book, as: 'book' }
      ],
      order: [['startDate', 'DESC']]
    });
  }

  /**
   * Get rental by ID
   */
  static async getById(rentalId, userId, userRole) {
    const rental = await Rental.findByPk(rentalId, {
      include: [{ model: Book, as: 'book' }]
    });

    if (!rental) {
      throw new Error('Rental not found');
    }

    // Authorization check
    if (rental.user_id !== userId && userRole !== 'admin') {
      throw new Error('Access denied');
    }

    return rental;
  }

  /**
   * Create rental for a book
   */
  static async rentBook(userId, bookId, daysToRent) {
    // Verify book exists
    const book = await BookService.getById(bookId);

    if (!book.rent_price) {
      throw new Error('Book not available for rent');
    }

    const startDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + daysToRent);

    const rental = await Rental.create({
      user_id: userId,
      book_id: bookId,
      startDate,
      dueDate,
      status: 'active',
      rentalPrice: book.rent_price
    });

    // Mark inventory as rented while an active rental exists.
    await Book.update(
      { status: 'rented' },
      { where: { id: bookId } }
    );

    return await Rental.findByPk(rental.id, {
      include: [{ model: Book, as: 'book' }]
    });
  }

  /**
   * Return rental
   */
  static async returnRental(rentalId, userId) {
    const rental = await Rental.findOne({
      where: { id: rentalId, user_id: userId }
    });

    if (!rental) {
      throw new Error('Rental not found');
    }

    rental.returnDate = new Date();
    rental.status = 'returned';
    await rental.save();

    // Returned rentals make the book available again.
    await Book.update(
      { status: 'available' },
      { where: { id: rental.book_id } }
    );

    return await Rental.findByPk(rentalId, {
      include: [{ model: Book, as: 'book' }]
    });
  }

  /**
   * Check if rental is overdue
   */
  static async isOverdue(rentalId) {
    const rental = await Rental.findByPk(rentalId);
    if (!rental || rental.status !== 'active') {
      return false;
    }

    return new Date() > new Date(rental.dueDate);
  }

  /**
   * Calculate late fees
   */
  static async calculateLateFee(rentalId, dailyLateFeePercentage = 0.1) {
    const rental = await Rental.findByPk(rentalId);
    if (!rental || rental.status !== 'active') {
      return 0;
    }

    const dueDate = new Date(rental.dueDate);
    const today = new Date();

    if (today <= dueDate) {
      return 0;
    }

    const daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
    return rental.rentalPrice * dailyLateFeePercentage * daysOverdue;
  }
}

module.exports = RentalService;
