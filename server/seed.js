require('dotenv').config();
const { sequelize, Book } = require('./models');

const booksData = [
  // Fiction
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Fiction",
    price: 249.99,
    rent_price: 49.99,
    description: "A classic American novel set in the Jazz Age.",
    status: "available"
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Fiction",
    price: 279.99,
    rent_price: 59.99,
    description: "A gripping tale of racial injustice and childhood innocence.",
    status: "available"
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    genre: "Fiction",
    price: 259.99,
    rent_price: 54.99,
    description: "A story of teenage rebellion and alienation.",
    status: "available"
  },
  {
    title: "Jane Eyre",
    author: "Charlotte Brontë",
    genre: "Fiction",
    price: 289.99,
    rent_price: 64.99,
    description: "A Gothic romance novel following an orphaned governess.",
    status: "available"
  },
  {
    title: "Wuthering Heights",
    author: "Emily Brontë",
    genre: "Fiction",
    price: 269.99,
    rent_price: 59.99,
    description: "A dark and passionate tale of love and revenge.",
    status: "available"
  },

  // Non-fiction
  {
    title: "Sapiens",
    author: "Yuval Noah Harari",
    genre: "Non-fiction",
    price: 349.99,
    rent_price: 79.99,
    description: "A brief history of humankind from the Stone Age to modern times.",
    status: "available"
  },
  {
    title: "Educated",
    author: "Tara Westover",
    genre: "Non-fiction",
    price: 299.99,
    rent_price: 69.99,
    description: "A memoir about a young woman who leaves her survivalist family.",
    status: "available"
  },
  {
    title: "Becoming",
    author: "Michelle Obama",
    genre: "Non-fiction",
    price: 329.99,
    rent_price: 74.99,
    description: "The memoir of former First Lady Michelle Obama.",
    status: "available"
  },
  {
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    genre: "Non-fiction",
    price: 319.99,
    rent_price: 69.99,
    description: "An exploration of the two systems of thought that guide us.",
    status: "available"
  },
  {
    title: "The Immortal Life of Henrietta Lacks",
    author: "Rebecca Skloot",
    genre: "Non-fiction",
    price: 309.99,
    rent_price: 69.99,
    description: "The story of the woman whose cells revolutionized medicine.",
    status: "available"
  },

  // Sci-Fi
  {
    title: "Dune",
    author: "Frank Herbert",
    genre: "Sci-Fi",
    price: 389.99,
    rent_price: 89.99,
    description: "An epic science fiction novel set on a desert planet.",
    status: "available"
  },
  {
    title: "1984",
    author: "George Orwell",
    genre: "Sci-Fi",
    price: 249.99,
    rent_price: 54.99,
    description: "A dystopian novel about totalitarianism and surveillance.",
    status: "available"
  },
  {
    title: "The Martian",
    author: "Andy Weir",
    genre: "Sci-Fi",
    price: 279.99,
    rent_price: 59.99,
    description: "An astronaut fights to survive on Mars with ingenuity and humor.",
    status: "available"
  },
  {
    title: "Foundation",
    author: "Isaac Asimov",
    genre: "Sci-Fi",
    price: 359.99,
    rent_price: 79.99,
    description: "A series about the fall and rise of galactic civilizations.",
    status: "available"
  },
  {
    title: "Neuromancer",
    author: "William Gibson",
    genre: "Sci-Fi",
    price: 299.99,
    rent_price: 64.99,
    description: "A cyberpunk novel that defined the genre.",
    status: "available"
  },

  // Romance
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genre: "Romance",
    price: 239.99,
    rent_price: 49.99,
    description: "A timeless tale of love and social class in Regency England.",
    status: "available"
  },
  {
    title: "The Notebook",
    author: "Nicholas Sparks",
    genre: "Romance",
    price: 269.99,
    rent_price: 59.99,
    description: "A heartwarming love story about two people separated by class.",
    status: "available"
  },
  {
    title: "Outlander",
    author: "Diana Gabaldon",
    genre: "Romance",
    price: 399.99,
    rent_price: 89.99,
    description: "A time-traveling romance set in 18th century Scotland.",
    status: "available"
  },
  {
    title: "The Time Traveler's Wife",
    author: "Audrey Niffenegger",
    genre: "Romance",
    price: 349.99,
    rent_price: 79.99,
    description: "A unique love story complicated by involuntary time travel.",
    status: "available"
  },
  {
    title: "Me Before You",
    author: "Jojo Moyes",
    genre: "Romance",
    price: 289.99,
    rent_price: 64.99,
    description: "A relationship tested by a life-altering illness.",
    status: "available"
  },

  // Mystery
  {
    title: "The Girl with the Dragon Tattoo",
    author: "Stieg Larsson",
    genre: "Mystery",
    price: 379.99,
    rent_price: 84.99,
    description: "A gripping mystery involving a missing woman and corruption.",
    status: "available"
  },
  {
    title: "Murder on the Orient Express",
    author: "Agatha Christie",
    genre: "Mystery",
    price: 249.99,
    rent_price: 54.99,
    description: "A classic whodunit on a luxury train.",
    status: "available"
  },
  {
    title: "The Da Vinci Code",
    author: "Dan Brown",
    genre: "Mystery",
    price: 319.99,
    rent_price: 69.99,
    description: "An art historian and symbologist uncover religious mysteries.",
    status: "available"
  },
  {
    title: "Gone Girl",
    author: "Gillian Flynn",
    genre: "Mystery",
    price: 359.99,
    rent_price: 79.99,
    description: "A psychological thriller about a missing wife and a questionable husband.",
    status: "available"
  },
  {
    title: "The Hound of the Baskervilles",
    author: "Arthur Conan Doyle",
    genre: "Mystery",
    price: 229.99,
    rent_price: 49.99,
    description: "Sherlock Holmes investigates a cursed family.",
    status: "available"
  },

  // Fantasy
  {
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    price: 449.99,
    rent_price: 99.99,
    description: "An epic fantasy saga about hobbits and the fate of the world.",
    status: "available"
  },
  {
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
    genre: "Fantasy",
    price: 289.99,
    rent_price: 64.99,
    description: "A young wizard begins his magical education at Hogwarts.",
    status: "available"
  },
  {
    title: "A Game of Thrones",
    author: "George R.R. Martin",
    genre: "Fantasy",
    price: 379.99,
    rent_price: 84.99,
    description: "A complex political fantasy with multiple perspectives.",
    status: "available"
  },
  {
    title: "The Name of the Wind",
    author: "Patrick Rothfuss",
    genre: "Fantasy",
    price: 329.99,
    rent_price: 74.99,
    description: "The tale of a legendary figure telling his own story.",
    status: "available"
  },
  {
    title: "Mistborn",
    author: "Brandon Sanderson",
    genre: "Fantasy",
    price: 309.99,
    rent_price: 69.99,
    description: "A heist fantasy with magic systems and plot twists.",
    status: "available"
  },

  // Biography
  {
    title: "Steve Jobs",
    author: "Walter Isaacson",
    genre: "Biography",
    price: 369.99,
    rent_price: 79.99,
    description: "The authorized biography of the Apple co-founder.",
    status: "available"
  },
  {
    title: "The Story of My Life",
    author: "Helen Keller",
    genre: "Biography",
    price: 259.99,
    rent_price: 54.99,
    description: "Helen Keller's remarkable autobiography of triumph over adversity.",
    status: "available"
  },
  {
    title: "Leonardo da Vinci",
    author: "Walter Isaacson",
    genre: "Biography",
    price: 429.99,
    rent_price: 99.99,
    description: "A comprehensive biography of the Renaissance master.",
    status: "available"
  },
  {
    title: "Einstein: His Life and Universe",
    author: "Walter Isaacson",
    genre: "Biography",
    price: 399.99,
    rent_price: 89.99,
    description: "The life and work of the legendary physicist.",
    status: "available"
  },
  {
    title: "The Autobiography of Benjamin Franklin",
    author: "Benjamin Franklin",
    genre: "Biography",
    price: 279.99,
    rent_price: 59.99,
    description: "A founding father's account of his life and achievements.",
    status: "available"
  }
];

async function seedDatabase() {
  try {
    // Authenticate the connection
    await sequelize.authenticate();
    console.log('✅ Database connection authenticated');

    // Sync database (without altering existing tables)
    await sequelize.sync({ alter: false });
    console.log('✅ Database synchronized');

    // Clear existing books (optional)
    await Book.destroy({ where: {} });
    console.log('🗑️  Cleared existing books');

    // Create books
    const createdBooks = await Book.bulkCreate(booksData);
    console.log(`✅ Successfully seeded ${createdBooks.length} books into the database`);
    
    // Count books by genre
    const genres = ['Fiction', 'Non-fiction', 'Sci-Fi', 'Romance', 'Mystery', 'Fantasy', 'Biography'];
    console.log('\n📚 Books by genre:');
    for (const genre of genres) {
      const count = await Book.count({ where: { genre } });
      console.log(`   ${genre}: ${count} books`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
