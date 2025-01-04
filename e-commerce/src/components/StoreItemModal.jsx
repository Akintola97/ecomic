"use client"; // Declare this as a client-side component for interactivity

import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
  CircularProgress, // Import CircularProgress for loading spinner
} from "@mui/material"; // Import Material-UI components
import CloseIcon from "@mui/icons-material/Close"; // Close icon
import Image from "next/image"; // Next.js Image component
import { urlFor } from "@/sanity/lib/image"; // Sanity image helper
import { useState, useEffect } from "react"; // React state and effect hooks

const StoreItemModal = ({ open, item, onClose, cartStatus, toggleCartStatus }) => {
  const [loading, setLoading] = useState(true); // State to manage loading when the modal opens

  /**
   * Simulate a loading effect for smoother UX when the modal opens
   */
  useEffect(() => {
    if (open) {
      setLoading(true); // Start loading when the modal opens
      const timer = setTimeout(() => setLoading(false), 500); // Simulate a loading delay
      return () => clearTimeout(timer); // Clear timeout on component unmount
    }
  }, [open]);

  // Return null if no item is provided to prevent rendering
  if (!item) return null;

  return (
    <Dialog
      open={open} // Control visibility of the modal
      onClose={onClose} // Handle modal close
      maxWidth="md" // Set maximum width for the modal
      fullWidth // Ensure the modal spans the full width
    >
      {/* Modal Header */}
      <DialogTitle className="relative bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 p-4">
        <div className="flex justify-between items-center">
          {/* Toggle Cart Button */}
          <Button
            variant="contained"
            onClick={() => toggleCartStatus(item._id)} // Toggle cart status
            className={`py-2 px-4 text-sm rounded-full ${
              cartStatus[item._id]
                ? "bg-gradient-to-r from-red-500 to-red-700 text-white" // Style for "Remove from Cart"
                : "bg-gradient-to-r from-blue-500 to-green-500 text-white" // Style for "Add to Cart"
            }`}
          >
            {cartStatus[item._id] ? "Remove from Cart" : "Add to Cart"}
          </Button>
          {/* Close button */}
          <IconButton
            aria-label="close" // Accessibility label
            onClick={onClose} // Close the modal
            className="hover:bg-red-500 hover:text-white dark:hover:bg-red-700 transition-colors"
            sx={{
              color: "inherit", // Inherit color for light mode
              "&.MuiIconButton-root:hover": {
                color: "white", // White color in dark mode
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </div>
        {/* Centered title */}
        <div className="text-lg font-semibold text-gray-800 dark:text-white text-center mt-2">
          {item.title || "Item Details"}
        </div>
      </DialogTitle>

      {/* Modal Content */}
      <DialogContent className="flex flex-col items-center bg-gray-50 dark:bg-gray-900">
        {loading ? (
          <div className="flex justify-center items-center h-[200px]">
            <CircularProgress size={60} /> {/* Show spinner while loading */}
          </div>
        ) : (
          <div className="w-full flex flex-col items-center gap-6 p-6">
            {/* Item image */}
            <Image
              src={urlFor(item.image).url()} // Generate the image URL
              alt={item.title} // Alt text for accessibility
              width={200} // Image width
              height={200} // Image height
              className="object-contain rounded-lg shadow-md"
            />

            {/* Item description */}
            <div className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed px-4 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
              {item.description || "No description available."}
            </div>

            {/* Item price */}
            <p className="font-bold text-2xl text-blue-600 dark:text-blue-400">
              ${item.price.toFixed(2)}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StoreItemModal;