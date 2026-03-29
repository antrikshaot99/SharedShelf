// Exporting a function that defines the CartItem model
// sequelize → DB connection instance
// DataTypes → used to define column types
module.exports = (sequelize, DataTypes) => {

  // Defining the 'CartItem' model (table)
  const CartItem = sequelize.define('CartItem', {

    // Primary key (unique identifier for each cart item)
    id: {
      type: DataTypes.INTEGER,   // Integer type
      primaryKey: true,          // Marks as primary key
      autoIncrement: true        // Auto increments (1,2,3...)
    },

    // Foreign key referencing 'users' table
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,          // Cannot be null (every cart item must belong to a user)
      references: {
        model: 'users',          // Refers to 'users' table
        key: 'id'                // References 'id' column
      }
    },

    // Foreign key referencing 'books' table
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false,          // Cannot be null (every cart item must have a book)
      references: {
        model: 'books',          // Refers to 'books' table
        key: 'id'                // References 'id' column
      }
    },

    // Quantity of the book in cart
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1            // Default quantity is 1
    },

    // Mode of transaction (buy or rent)
    mode: {
      type: DataTypes.ENUM('buy', 'rent'), // Restricts values to 'buy' or 'rent'
      defaultValue: 'buy'                  // Default is 'buy'
    }

  }, {

    // Table name in database
    tableName: 'cart_items',

    // Disables automatic createdAt and updatedAt columns
    timestamps: false
  });

  // Return the model so it can be used in other parts of the app
  return CartItem;
};