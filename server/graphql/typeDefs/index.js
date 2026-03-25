const gql = require('graphql-tag');
const userTypeDefs = require('./userTypeDefs');
const bookTypeDefs = require('./bookTypeDefs');
const cartTypeDefs = require('./cartTypeDefs');
const orderTypeDefs = require('./orderTypeDefs');
const rentalTypeDefs = require('./rentalTypeDefs');
const statsTypeDefs = require('./statsTypeDefs');

/**
 * Root Query and Mutation types with all domain-specific queries and mutations
 */
const rootTypeDefs = gql`
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
    updateCartItem(id: ID!, quantity: Int!): CartItem
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

/**
 * Combine all TypeDefs
 */
const typeDefs = [
  rootTypeDefs,
  userTypeDefs,
  bookTypeDefs,
  cartTypeDefs,
  orderTypeDefs,
  rentalTypeDefs,
  statsTypeDefs
];

module.exports = typeDefs;
