const { Book } = require('../models');

class BookService {
  /**
   * Get all books with optional filters
   */
  static async getAll(genre, status) {
    const where = {};
    if (genre) where.genre = genre;
    if (status) where.status = status;

    return await Book.findAll({ where });
  }

  /**
   * Get book by ID
   */
  static async getById(bookId) {
    const book = await Book.findByPk(bookId);
    if (!book) {
      throw new Error('Book not found');
    }
    return book;
  }

  /**
   * Get all unique genres
   */
  static async getGenres() {
    const books = await Book.findAll({
      attributes: ['genre'],
      group: ['genre']
    });
    return [...new Set(books.map(b => b.genre))];
  }

  /**
   * Add a new book (seller)
   */
  static async create(bookData, userId) {
    const book = await Book.create({
      ...bookData,
      owner_id: userId,
      status: 'available'
    });

    return book;
  }

  /**
   * Update book details
   */
  static async update(bookId, updateData) {
    const book = await Book.findByPk(bookId);
    if (!book) {
      throw new Error('Book not found');
    }

    await book.update(updateData);
    return book;
  }

  /**
   * Delete book (owner or admin)
   */
  static async delete(bookId, userId, userRole) {
    const book = await Book.findByPk(bookId);
    if (!book) {
      throw new Error('Book not found');
    }

    // Authorization check
    if (book.owner_id !== userId && userRole !== 'admin') {
      throw new Error('Access denied');
    }

    const deletedBook = {
      id: book.id,
      title: book.title,
      author: book.author
    };

    await book.destroy();
    return deletedBook;
  }

  /**
   * Get books by seller/owner
   */
  static async getByOwner(userId) {
    return await Book.findAll({
      where: { owner_id: userId }
    });
  }
}

module.exports = BookService;
