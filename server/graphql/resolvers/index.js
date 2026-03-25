const { authResolvers, userQueryResolvers, userMutationResolvers } = require('./userResolvers');
const { bookQueryResolvers, bookMutationResolvers } = require('./bookResolvers');
const { cartQueryResolvers, cartMutationResolvers } = require('./cartResolvers');
const { orderQueryResolvers, orderMutationResolvers } = require('./orderResolvers');
const { rentalQueryResolvers, rentalMutationResolvers } = require('./rentalResolvers');
const { statsResolvers } = require('./statsResolvers');

/**
 * Deep merge function for combining resolver sets
 */
const mergeResolvers = (...resolverSets) => {
  const merged = {};

  for (const set of resolverSets) {
    for (const [type, fields] of Object.entries(set)) {
      if (!merged[type]) {
        merged[type] = {};
      }
      merged[type] = {
        ...merged[type],
        ...fields
      };
    }
  }

  return merged;
};

/**
 * Combined resolvers from all domains
 */
const resolvers = mergeResolvers(
  authResolvers,
  userQueryResolvers,
  userMutationResolvers,
  bookQueryResolvers,
  bookMutationResolvers,
  cartQueryResolvers,
  cartMutationResolvers,
  orderQueryResolvers,
  orderMutationResolvers,
  rentalQueryResolvers,
  rentalMutationResolvers,
  statsResolvers
);

module.exports = resolvers;
