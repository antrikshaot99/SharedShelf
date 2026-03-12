module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define('OrderItem', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'orders',
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
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
    tableName: 'order_items',
    timestamps: false
  });

  return OrderItem;
};
