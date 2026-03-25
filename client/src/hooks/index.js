import { useQuery } from "@apollo/client";
import { GET_MY_ORDERS, GET_MY_RENTALS } from "../graphql/queries";

/**
 * Custom hook for fetching user's orders
 */
export const useOrders = () => {
  const { loading, error, data, refetch } = useQuery(GET_MY_ORDERS);
  const orders = data?.myOrders || [];

  return {
    orders,
    loading,
    error,
    refetch
  };
};

/**
 * Custom hook for fetching user's rentals
 */
export const useRentals = () => {
  const { loading, error, data, refetch } = useQuery(GET_MY_RENTALS);
  const rentals = data?.myRentals || [];

  return {
    rentals,
    loading,
    error,
    refetch
  };
};
