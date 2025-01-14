"use client";

import { createContext, useEffect, useState } from "react";

export const SavedItemsContext = createContext();

export const SavedItemsProvider = ({ children }) => {
  const [savedItems, setSavedItems] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedItems")) || [];
    setSavedItems(saved);
  }, []);

  const toggleSaveItem = (item) => {
    let updatedSavedItems;

    const existingItem = savedItems.find((saved) => saved._id === item._id);

    if (existingItem) {
      updatedSavedItems = savedItems.filter((id) => id._id !== item._id);
    } else {
      updatedSavedItems = [...savedItems, { _id: item._id, quantity: 1 }];
    }
    setSavedItems(updatedSavedItems);
    localStorage.setItem("savedItems", JSON.stringify(updatedSavedItems));
  };

  const updateItemQuantity = (productId, increment) => {
    const updatedSavedItems = savedItems.map((item) => {
      if (item._id === productId) {
        const newQty = increment ? item.quantity + 1 : item.quantity - 1;
        return { ...item, quantity: newQty > 0 ? newQty : 1 };
      }
      return item;
    });
    setSavedItems(updatedSavedItems);
    localStorage.setItem("savedItems", JSON.stringify(updatedSavedItems));
  };

  const removeItem = (productId) => {
    const updatedSavedItems = savedItems.filter(
      (item) => item._id !== productId
    );
    setSavedItems(updatedSavedItems);
    localStorage.setItem("savedItems", JSON.stringify(updatedSavedItems));
  };

  return (
    <SavedItemsContext.Provider
      value={{ savedItems, toggleSaveItem, updateItemQuantity, removeItem }}
    >
      {children}
    </SavedItemsContext.Provider>
  );
};