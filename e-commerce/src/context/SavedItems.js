// "use client";
// import React, { createContext, useState, useEffect } from "react";

// // Create the context
// export const SavedItemsContext = createContext();

// // Create the provider component
// export const SavedItemsProvider = ({ children }) => {
//   const [savedItems, setSavedItems] = useState([]);

//   useEffect(() => {
//     // Load saved items from localStorage on component mount
//     const saved = JSON.parse(localStorage.getItem("savedItems")) || [];
//     setSavedItems(saved);
//   }, []);

//   // Toggle an item's presence in savedItems
//   const toggleSaveItem = (item) => {
//     let updatedSavedItems;
//     if (savedItems.includes(item._id)) {
//       // Remove (unsave) the item
//       updatedSavedItems = savedItems.filter((id) => id !== item._id);
//     } else {
//       // Add (save) the item
//       updatedSavedItems = [...savedItems, item._id];
//     }
//     setSavedItems(updatedSavedItems);
//     localStorage.setItem("savedItems", JSON.stringify(updatedSavedItems));
//   };

//   return (
//     <SavedItemsContext.Provider value={{ savedItems, toggleSaveItem }}>
//       {children}
//     </SavedItemsContext.Provider>
//   );
// };



"use client";

import React, { createContext, useState, useEffect } from "react";

// Create the context
export const SavedItemsContext = createContext();

// Create the provider component
export const SavedItemsProvider = ({ children }) => {
  const [savedItems, setSavedItems] = useState([]);

  useEffect(() => {
    // Load saved items from localStorage on component mount
    const saved = JSON.parse(localStorage.getItem("savedItems")) || [];
    setSavedItems(saved);
  }, []);

  // Toggle an item's presence in savedItems
  const toggleSaveItem = (item) => {
    let updatedSavedItems;
    const existingItem = savedItems.find((saved) => saved._id === item._id);

    if (existingItem) {
      // If item exists, remove it
      updatedSavedItems = savedItems.filter((id) => id._id !== item._id);
    } else {
      // If item doesn't exist, add it with a default quantity of 1
      updatedSavedItems = [...savedItems, { _id: item._id, quantity: 1 }];
    }

    setSavedItems(updatedSavedItems);
    localStorage.setItem("savedItems", JSON.stringify(updatedSavedItems));
  };

  // Update quantity of an item
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

  // Remove an item entirely
  const removeItem = (productId) => {
    const updatedSavedItems = savedItems.filter((item) => item._id !== productId);
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