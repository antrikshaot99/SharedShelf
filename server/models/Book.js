module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 255]
      }
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 255]
      }
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 100]
      }
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0
      }
    },
    rent_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0
      }
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
    timestamps: false,
    indexes: [
      {
        fields: ['status'],
        name: 'idx_book_status'
      },
      {
        fields: ['genre'],
        name: 'idx_book_genre'
      },
      {
        fields: ['author'],
        name: 'idx_book_author'
      },
      {
        fields: ['owner_id'],
        name: 'idx_book_owner'
      },
      {
        fields: ['title'],
        name: 'idx_book_title'
      },
      {
        fields: ['status', 'genre'],
        name: 'idx_book_status_genre'
      }
    ]
  });

  return Book;
};
