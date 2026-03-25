const { OrderService } = require('../../services');

/**
 * Order query resolvers
 */
const orderQueryResolvers = {
  Query: {
    myOrders: async (_, __, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }
      return await OrderService.getUserOrders(context.user.id);
    },

    allOrders: async (_, __, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }
      if (context.user.role !== 'admin') {
        throw new Error('Admin access required');
      }
      return await OrderService.getAllOrders();
    },

    order: async (_, { id }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }
      return await OrderService.getById(id, context.user.id, context.user.role);
    }
  }
};

/**
 * Order mutation resolvers
 */
const orderMutationResolvers = {
  Mutation: {
    placeOrder: async (_, __, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }
      return await OrderService.placeOrder(context.user.id);
    },

    updateOrderStatus: async (_, { id, status }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }
      if (context.user.role !== 'admin') {
        throw new Error('Admin access required');
      }
      return await OrderService.updateStatus(id, status);
    }
  }
};

module.exports = {
  orderQueryResolvers,
  orderMutationResolvers
};
