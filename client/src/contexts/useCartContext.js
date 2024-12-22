import React, { createContext, useState, useContext } from 'react';

// Create the CartContext
const CartContext = createContext();

// Provider Component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    console.log('Received product in Context cart:', product);
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item._id === product._id);
      if (existingItem) {
        console.log(`${product.name} already exists in the Cart`);
        return prevItems.map((item) =>
            item._id === product._id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        console.log(`${product.name} first time in the Cart`);
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (_id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== _id));
  };

  const updateQuantity = (_id, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === _id ? { ...item, quantity } : item
      )
    );
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom Hook for Consuming the Cart Context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
