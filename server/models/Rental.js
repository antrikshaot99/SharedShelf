module.exports = (sequelize, DataTypes) => {
  const Rental = sequelize.define('Rental', {
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
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    returnDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('active', 'returned', 'overdue'),
      defaultValue: 'active'
    },
    rentalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
    tableName: 'rentals',
    timestamps: false
  });

  return Rental;
};
