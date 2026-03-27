import { useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { AuthContext } from "./AuthContext";
import { OrderContext } from "./OrderContextValue";
import { PLACE_ORDER } from "../graphql/mutations";
import { GET_MY_ORDERS } from "../graphql/queries";

// Re-export OrderContext for use in components
export { OrderContext };

function formatOrderDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString();
}

function normalizeOrder(order) {
  return {
    ...order,
    date: formatOrderDate(order.createdAt),
    items: (order.items || []).map((item) => ({
      ...item,
      title: item.book?.title || "",
      author: item.book?.author || "",
    })),
  };
}

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const { isLoggedIn } = useContext(AuthContext);

  const { refetch } = useQuery(GET_MY_ORDERS, {
    skip: !isLoggedIn,
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      setOrders((data?.myOrders || []).map(normalizeOrder));
    },
    onError: () => {
      setOrders([]);
    },
  });

  const [placeOrderMutation, { loading: isPlacingOrder }] = useMutation(PLACE_ORDER);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    let isActive = true;

    refetch()
      .then((result) => {
        if (!isActive) return;
        setOrders((result?.data?.myOrders || []).map(normalizeOrder));
      })
      .catch(() => {
        if (!isActive) return;
        setOrders([]);
      });

    return () => {
      isActive = false;
    };
  }, [isLoggedIn, refetch]);

  const placeOrder = async () => {
    const result = await placeOrderMutation();
    const createdOrder = result?.data?.placeOrder;

    if (createdOrder) {
      setOrders((previousOrders) => [normalizeOrder(createdOrder), ...previousOrders]);
    }

    const refreshed = await refetch();
    setOrders((refreshed?.data?.myOrders || []).map(normalizeOrder));

    return createdOrder;
  };

  return (
    <OrderContext.Provider value={{ orders, placeOrder, isPlacingOrder, refetchOrders: refetch }}>
      {children}
    </OrderContext.Provider>
  );
}