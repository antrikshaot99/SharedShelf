const gql = require('graphql-tag');

const userTypeDefs = gql`
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
`;

module.exports = userTypeDefs;
