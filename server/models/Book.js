module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    rent_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('available', 'rented', 'sold'),
      defaultValue: 'available'
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    coverImage: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'books',
    timestamps: false
  });

  return Book;
};
