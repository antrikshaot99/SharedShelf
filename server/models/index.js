const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('../config/db').config;

// Initialize Sequelize with MySQL connection
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.user,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Import models
const User = require('./User')(sequelize, DataTypes);
const Book = require('./Book')(sequelize, DataTypes);
const Order = require('./Order')(sequelize, DataTypes);
const OrderItem = require('./OrderItem')(sequelize, DataTypes);
const CartItem = require('./CartItem')(sequelize, DataTypes);
const Rental = require('./Rental')(sequelize, DataTypes);

// Define relationships
User.hasMany(Book, { foreignKey: 'owner_id', as: 'books' });
Book.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });

User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });
OrderItem.belongsTo(Book, { foreignKey: 'book_id' });

User.hasMany(CartItem, { foreignKey: 'user_id', as: 'cart' });
CartItem.belongsTo(User, { foreignKey: 'user_id' });
CartItem.belongsTo(Book, { foreignKey: 'book_id' });

User.hasMany(Rental, { foreignKey: 'user_id', as: 'rentals' });
Rental.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Rental.belongsTo(Book, { foreignKey: 'book_id', as: 'book' });

// Sync database
sequelize.sync({ alter: false }) // Set to true in development if needed
  .then(() => console.log('📚 Database synced successfully'))
  .catch(err => console.error('Database sync error:', err));

module.exports = {
  sequelize,
  User,
  Book,
  Order,
  OrderItem,
  CartItem,
  Rental
};
