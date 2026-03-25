const { UserService } = require('../../services');

/**
 * Auth resolvers: Register, Login, Get Current User
 */
const authResolvers = {
  Mutation: {
    register: async (_, { name, email, password }) => {
      return await UserService.register(name, email, password);
    },

    login: async (_, { email, password }) => {
      return await UserService.login(email, password);
    }
  }
};

/**
 * User query resolvers
 */
const userQueryResolvers = {
  Query: {
    me: async (_, __, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }
      return await UserService.getMe(context.user.id);
    },

    user: async (_, { id }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }
      return await UserService.getById(id);
    },

    users: async (_, __, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }
      if (context.user.role !== 'admin') {
        throw new Error('Admin access required');
      }
      return await UserService.getAll();
    }
  }
};

/**
 * User management mutations (admin)
 */
const userMutationResolvers = {
  Mutation: {
    updateUserRole: async (_, { id, role }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }
      if (context.user.role !== 'admin') {
        throw new Error('Admin access required');
      }
      return await UserService.updateRole(id, role);
    },

    deleteUser: async (_, { id }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }
      if (context.user.role !== 'admin') {
        throw new Error('Admin access required');
      }
      return await UserService.delete(id);
    }
  }
};

module.exports = {
  authResolvers,
  userQueryResolvers,
  userMutationResolvers
};
