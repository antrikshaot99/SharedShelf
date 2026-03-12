module.exports = (sequelize, DataTypes) => {
  const CartItem = sequelize.define('CartItem', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'books',
        key: 'id'
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    mode: {
      type: DataTypes.ENUM('buy', 'rent'),
      defaultValue: 'buy'
    }
  }, {
    tableName: 'cart_items',
    timestamps: false
  });

  return CartItem;
};
