const typeDefs = `#graphql

type User {
  id: ID!
  name: String!
  email: String!
  role: String!
}

type AuthPayload {
  token: String!
  user: User!
}

type Book {
  id: ID!
  title: String!
  author: String!
  genre: String!
  price: Float
  rent_price: Float
  status: String
  owner_id: ID
  description: String
  coverImage: String
}

type CartItem {
  id: ID!
  user_id: ID!
  book_id: ID!
  book: Book!
  quantity: Int!
  mode: String!
}

type OrderItem {
  id: ID!
  book_id: ID!
  book: Book
  quantity: Int!
  price: Float!
}

type Order {
  id: ID!
  user_id: ID!
  user: User
  items: [OrderItem!]!
  totalAmount: Float!
  status: String!
  orderType: String!
}

type Rental {
  id: ID!
  user_id: ID!
  book_id: ID!
  user: User
  book: Book
  startDate: String!
  dueDate: String!
  returnDate: String
  status: String!
  rentalPrice: Float!
}

type Stats {
  totalUsers: Int
  totalBooks: Int
  totalGenres: Int
  totalOrders: Int
  totalRentals: Int
  activeRentals: Int
}

type Query {
  # User queries
  users: [User]
  user(id: ID!): User
  me: User
  
  # Book queries
  books(genre: String, status: String): [Book]
  book(id: ID!): Book
  genres: [String!]
  
  # Cart queries
  myCart: [CartItem]
  
  # Order queries
  myOrders: [Order]
  allOrders: [Order]
  order(id: ID!): Order
  
  # Rental queries
  myRentals: [Rental]
  allRentals: [Rental]
  rental(id: ID!): Rental
  
  # Stats
  stats: Stats
}

type Mutation {
  # Auth mutations
  register(name: String!, email: String!, password: String!): AuthPayload!
  login(email: String!, password: String!): AuthPayload!
  
  # Book mutations
  addBook(
    title: String!
    author: String!
    genre: String!
    price: Float
    rent_price: Float
    description: String
    coverImage: String
  ): Book!
  
  updateBook(
    id: ID!
    title: String
    author: String
    genre: String
    price: Float
    rent_price: Float
    status: String
    description: String
    coverImage: String
  ): Book!
  
  deleteBook(id: ID!): Book!
  
  # Cart mutations
  addToCart(bookId: ID!, mode: String!): CartItem!
  updateCartItem(id: ID!, quantity: Int!): CartItem!
  removeFromCart(id: ID!): Boolean!
  clearCart: Boolean!
  
  # Order mutations
  placeOrder: Order!
  updateOrderStatus(id: ID!, status: String!): Order!
  
  # Rental mutations
  rentBook(bookId: ID!, days: Int!): Rental!
  returnRental(id: ID!): Rental!
  
  # User management (admin)
  updateUserRole(id: ID!, role: String!): User!
  deleteUser(id: ID!): User!
}

`;

module.exports = typeDefs;