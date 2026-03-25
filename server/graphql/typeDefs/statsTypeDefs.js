const gql = require('graphql-tag');

const statsTypeDefs = gql`
  type Stats {
    totalUsers: Int
    totalBooks: Int
    totalGenres: Int
    totalOrders: Int
    totalRentals: Int
    activeRentals: Int
  }
`;

module.exports = statsTypeDefs;
