import React, { createContext, useState, useContext } from "react";

// Create OrderContext
const OrderContext = createContext();

// Provider Component
export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]); // To store all confirmed orders

  // Add a new order to the orders array
  const addOrder = (order) => {
    console.log("Adding new order:", order);
    setOrders((prevOrders) => [...prevOrders, order]);
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

// Custom Hook for Consuming the Order Context
export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};
