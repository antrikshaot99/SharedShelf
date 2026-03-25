const { BookService } = require('../../services');

/**
 * Book query resolvers
 */
const bookQueryResolvers = {
  Query: {
    books: async (_, { genre, status }) => {
      return await BookService.getAll(genre, status);
    },

    book: async (_, { id }) => {
      return await BookService.getById(id);
    },

    genres: async () => {
      return await BookService.getGenres();
    }
  }
};

/**
 * Book mutation resolvers
 */
const bookMutationResolvers = {
  Mutation: {
    addBook: async (_, args, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }
      return await BookService.create(args, context.user.id);
    },

    updateBook: async (_, { id, ...fields }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }
      return await BookService.update(id, fields);
    },

    deleteBook: async (_, { id }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }
      return await BookService.delete(id, context.user.id, context.user.role);
    }
  }
};

module.exports = {
  bookQueryResolvers,
  bookMutationResolvers
};
