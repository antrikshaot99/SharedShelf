const gql = require('graphql-tag');

const rentalTypeDefs = gql`
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
`;

module.exports = rentalTypeDefs;
