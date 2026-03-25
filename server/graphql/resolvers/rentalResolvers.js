const { RentalService } = require('../../services');

/**
 * Rental query resolvers
 */
const rentalQueryResolvers = {
  Query: {
    myRentals: async (_, __, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }
      return await RentalService.getUserRentals(context.user.id);
    },

    allRentals: async (_, __, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }
      if (context.user.role !== 'admin') {
        throw new Error('Admin access required');
      }
      return await RentalService.getAllRentals();
    },

    rental: async (_, { id }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }
      return await RentalService.getById(id, context.user.id, context.user.role);
    }
  }
};

/**
 * Rental mutation resolvers
 */
const rentalMutationResolvers = {
  Mutation: {
    rentBook: async (_, { bookId, days }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }
      return await RentalService.rentBook(context.user.id, bookId, days);
    },

    returnRental: async (_, { id }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }
      return await RentalService.returnRental(id, context.user.id);
    }
  }
};

module.exports = {
  rentalQueryResolvers,
  rentalMutationResolvers
};
