const gql = require('graphql-tag');

const bookTypeDefs = gql`
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
`;

module.exports = bookTypeDefs;
