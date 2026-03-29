// Exporting a function that defines the Book model
// sequelize → DB connection instance
// DataTypes → used to define column types
module.exports = (sequelize, DataTypes) => {

  // Defining the 'Book' model (table)
  const Book = sequelize.define('Book', {

    // Primary key (unique identifier)
    id: {
      type: DataTypes.INTEGER,      // Integer type
      primaryKey: true,             // Marks as primary key
      autoIncrement: true           // Auto increases (1,2,3...)
    },

    // Book title
    title: {
      type: DataTypes.STRING,       // String type
      allowNull: false,             // Cannot be null
      validate: {
        len: [1, 255]               // Length must be between 1 and 255 characters
      }
    },

    // Author name
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 255]
      }
    },

    // Genre (e.g., Fiction, Horror)
    genre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 100]
      }
    },

    // Selling price of book
    price: {
      type: DataTypes.DECIMAL(10, 2), // Decimal with precision (10 digits, 2 after decimal)
      allowNull: true,                // Optional field
      validate: {
        min: 0                        // Price cannot be negative
      }
    },

    // Rent price of book
    rent_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0
      }
    },

    // Status of the book
    status: {
      type: DataTypes.ENUM('available', 'rented', 'sold'), // Only these values allowed
      defaultValue: 'available'                            // Default value
    },

    // Foreign key referencing users table
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',   // Refers to 'users' table
        key: 'id'         // References 'id' column
      }
    },

    // Description of the book
    description: {
      type: DataTypes.TEXT,   // Large text field
      allowNull: true
    },

    // URL/path of book cover image
    coverImage: {
      type: DataTypes.STRING,
      allowNull: true
    }

  }, {

    // Table name in database
    tableName: 'books',

    // Disables createdAt and updatedAt columns
    timestamps: false,

    // Indexes to improve query performance
    indexes: [

      // Index on status column (fast filtering by status)
      {
        fields: ['status'],
        name: 'idx_book_status'
      },

      // Index on genre column
      {
        fields: ['genre'],
        name: 'idx_book_genre'
      },

      // Index on author column
      {
        fields: ['author'],
        name: 'idx_book_author'
      },

      // Index on owner_id (useful for user-specific queries)
      {
        fields: ['owner_id'],
        name: 'idx_book_owner'
      },

      // Index on title (search optimization)
      {
        fields: ['title'],
        name: 'idx_book_title'
      },

      // Composite index on status + genre
      // Useful for queries like: WHERE status='available' AND genre='fiction'
      {
        fields: ['status', 'genre'],
        name: 'idx_book_status_genre'
      }
    ]
  });

  // Return the model so it can be used elsewhere
  return Book;
};