const gql = require('graphql-tag');

const orderTypeDefs = gql`
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
    createdAt: String
  }
`;

module.exports = orderTypeDefs;
