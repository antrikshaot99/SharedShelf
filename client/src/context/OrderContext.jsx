import { createContext, useState } from "react";

export const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(
    JSON.parse(localStorage.getItem("orders")) || []
  );

  const placeOrder = (items) => {
    const newOrder = {
      id: Date.now(),
      items,
      date: new Date().toLocaleString(),
    };

    const updated = [...orders, newOrder];
    setOrders(updated);
    localStorage.setItem("orders", JSON.stringify(updated));
  };

  return (
    <OrderContext.Provider value={{ orders, placeOrder }}>
      {children}
    </OrderContext.Provider>
  );
}