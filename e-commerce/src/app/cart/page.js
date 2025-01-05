export const dynamic = "force-dynamic";
"use client"; // Declare this as a client-side component for interactivity

import { useEffect, useState } from "react"; // React hooks for managing state and side effects
// import { useSearchParams } from "next/navigation"; // Hook to access query parameters in the URL
import { useSearchParams } from 'next/navigation'
import Image from "next/image"; // Next.js component for optimized image rendering
import { Pagination } from "@mui/material"; // Material UI component for pagination
import { urlFor } from "@/sanity/lib/image"; // Helper function to generate Sanity image URLs

const CartPage = () => {
  // Access query parameters from the URL
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId"); // Extract the userId parameter from the URL
  console.log("User ID in Cart Page:", userId); // Log the userId for debugging

  const [cartItems, setCartItems] = useState([]); // React state to manage the cart items
  const [totalItems, setTotalItems] = useState(0); // State to store the total quantity of items in the cart
  const [loading, setLoading] = useState(true); // Loading state for displaying a spinner or message
  const [currentPage, setCurrentPage] = useState(1); // State to track the current page for pagination
  const itemsPerPage = 6; // Number of items displayed per page

  // Fetch cart data when the component mounts or userId changes
  useEffect(() => {
    if (!userId) {
      console.error("User ID is required to fetch cart.");
      setLoading(false); // Stop loading if no userId is provided
      return;
    }

    const fetchCart = async () => {
      try {
        const response = await fetch("/api/getcart", {
          method: "POST", // Use POST to send the userId in the request body
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }), // Send userId to the backend
        });

        if (!response.ok) {
          throw new Error("Failed to fetch cart items");
        }

        const data = await response.json(); // Parse the JSON response
        setCartItems(Array.isArray(data) ? data : []); // Ensure the data is an array

        // Calculate the total quantity of items in the cart
        const totalQuantity = data.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        setTotalItems(totalQuantity); // Update the totalItems state
      } catch (error) {
        console.error("Error fetching cart:", error);
        setCartItems([]); // Default to an empty array in case of an error
      } finally {
        setLoading(false); // Stop the loading spinner
      }
    };

    fetchCart(); // Fetch the cart data
  }, [userId]); // Effect depends on the userId


  const handleQuantityChange = async (productId, increment) => {
    try {
      const response = await fetch("/api/updatequantity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, productId, increment }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update item quantity");
      }
  
      // Update local cart state
      setCartItems((prevItems) => {
        const updatedItems = prevItems.map((item) =>
          item._id === productId
            ? { ...item, quantity: increment ? item.quantity + 1 : item.quantity - 1 }
            : item
        );
  
        // Filter out items with quantity <= 0
        return updatedItems.filter((item) => item.quantity > 0);
      });
  
      // Update the total item count based on the increment
      setTotalItems((prevTotal) =>
        increment ? prevTotal + 1 : Math.max(prevTotal - 1, 0)
      );

      // **IMPORTANT**: Dispatch "cartUpdated" to refresh the badge
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("cartUpdated"));
      }
    } catch (error) {
      console.error("Error updating item quantity:", error);
    }
  };

  // Handle removing an item from the cart
  const handleRemoveItem = async (productId) => {
    try {
      const response = await fetch("/api/removecart", {
        method: "POST", // Use POST for item removal
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, productId }), // Send userId and productId
      });

      if (!response.ok) {
        throw new Error("Failed to remove item from cart");
      }

      setCartItems(
        (prevItems) => prevItems.filter((item) => item._id !== productId) // Remove the item
      );

      // Update total items count
      setTotalItems(
        (prevTotal) =>
          prevTotal -
          (cartItems.find((item) => item._id === productId)?.quantity || 0)
      );

      // **IMPORTANT**: Dispatch "cartUpdated" to refresh the badge
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("cartUpdated"));
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  // Calculate the total cost of all items in the cart
  const calculateTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // Handle pagination changes
  const handlePaginationChange = (event, page) => {
    setCurrentPage(page); // Update the current page
  };

  // Slice to show only items for the current page
  const paginatedItems = cartItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Render loading state while fetching data
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-gray-700">Loading cart...</p>
      </div>
    );
  }

  // Render a message if the user is not logged in
  if (!userId) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-gray-700">
          Please log in to view your cart.
        </p>
      </div>
    );
  }

  // Render a message if the cart is empty
  if (!cartItems.length) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-gray-700">
          Your cart is empty.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-[12vh]">
      {/* Header */}
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-10">
        Your Cart
      </h1>

      {/* Summary Section */}
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <div>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            Cart Total: ${calculateTotal().toFixed(2)}
          </p>
          <p className="text-md text-gray-700 dark:text-gray-300 mt-1">
            Total Items: <span className="font-bold">{totalItems}</span>
          </p>
        </div>
        <button className="bg-gradient-to-r from-blue-500 to-green-500 text-white py-2 px-4 rounded-lg shadow hover:from-blue-600 hover:to-green-600 transition">
          Proceed to Checkout
        </button>
      </div>

      {/* Cart Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedItems.map((item) => (
          <div
            key={item._id}
            className="border rounded-lg shadow-md bg-white dark:bg-gray-800 flex flex-col"
          >
            {/* Image Section */}
            <div className="relative w-full h-[200px] bg-gray-200">
              <Image
                src={urlFor(item.image).url()}
                alt={item.title}
                layout="fill"
                objectFit="contain"
                className="p-2"
              />
            </div>
            {/* Text Section */}
            <div className="p-4 flex flex-col">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {item.title}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mt-2 flex items-center gap-2">
                Quantity:
                <button
                  onClick={() => handleQuantityChange(item._id, false)}
                  className="px-2 py-1 bg-gradient-to-r from-teal-400 to-teal-600 text-white font-semibold rounded transition"
                >
                  -
                </button>
                <span className="font-semibold">{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item._id, true)}
                  className="px-2 py-1 bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold rounded transition"
                >
                  +
                </button>
              </p>
              <p className="text-gray-700 dark:text-gray-300 mt-2">
                Total: ${item.price * item.quantity}
              </p>
              <button
                onClick={() => handleRemoveItem(item._id)}
                className="mt-4 bg-gradient-to-r from-red-500 to-red-700 text-white px-3 py-2 rounded-full shadow self-end hover:scale-105 transition"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {cartItems.length > itemsPerPage && (
        <div className="mt-8 flex justify-center">
          <Pagination
            count={Math.ceil(cartItems.length / itemsPerPage)} // Total number of pages
            page={currentPage} // Current page number
            onChange={handlePaginationChange} // Handle page changes
            sx={{
              "& .MuiPaginationItem-root": {
                background: "linear-gradient(to right, #647dee, #7f53ac)", // Purple gradient
                color: "white",
                borderRadius: "50%",
                margin: "0 4px",
                transition: "all 0.3s ease-in-out",
                fontWeight: "bold",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
              },
              "& .MuiPaginationItem-root:hover": {
                background: "linear-gradient(to right, #7f53ac, #647dee)", // Gradient hover
                transform: "scale(1.1)", // Slight zoom
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)", // Enhanced shadow
              },
              "& .Mui-selected": {
                background: "linear-gradient(to right, #4a90e2, #34d8ac)", // Bright blue-green
                color: "white",
                fontWeight: "bold",
                border: "2px solid #ffffff",
                boxShadow: "0 0 15px rgba(52, 216, 172, 0.8)", // Glow effect
                transform: "scale(1.3)", // Highlight
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default CartPage;