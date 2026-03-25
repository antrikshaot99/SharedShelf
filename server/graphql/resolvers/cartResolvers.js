const { CartService } = require('../../services');

/**
 * Cart query resolvers
 */
const cartQueryResolvers = {
  Query: {
    myCart: async (_, __, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }
      return await CartService.getCart(context.user.id);
    }
  }
};

/**
 * Cart mutation resolvers
 */
const cartMutationResolvers = {
  Mutation: {
    addToCart: async (_, { bookId, mode }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }
      return await CartService.addItem(context.user.id, bookId, mode);
    },

    updateCartItem: async (_, { id, quantity }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }
      return await CartService.updateItem(id, context.user.id, quantity);
    },

    removeFromCart: async (_, { id }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }
      return await CartService.removeItem(id, context.user.id);
    },

    clearCart: async (_, __, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }
      return await CartService.clear(context.user.id);
    }
  }
};

module.exports = {
  cartQueryResolvers,
  cartMutationResolvers
};
