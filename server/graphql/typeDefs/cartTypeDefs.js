const gql = require('graphql-tag');

const cartTypeDefs = gql`
  type CartItem {
    id: ID!
    user_id: ID!
    book_id: ID!
    book: Book!
    quantity: Int!
    mode: String!
  }
`;

module.exports = cartTypeDefs;
