const { StatsService } = require('../../services');

/**
 * Stats resolvers (admin dashboard)
 */
const statsResolvers = {
  Query: {
    stats: async (_, __, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }
      if (context.user.role !== 'admin') {
        throw new Error('Admin access required');
      }
      return await StatsService.getStats();
    }
  }
};

module.exports = {
  statsResolvers
};
