"use client";

import { LoginLink } from "@kinde-oss/kinde-auth-nextjs";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { SavedItemsContext } from "@/context/SavedItems";

export default function StoreItemModal({
  open,
  item,
  onClose,
  isUserAuthenticated,
}) {
  const [loading, setLoading] = useState(true);
  const { savedItems, toggleSaveItem } = useContext(SavedItemsContext);

  const isSaved = (itemId) => savedItems.some((item) => item._id === itemId);

  useEffect(() => {
    if (open) {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!item) return null;

  const handleToggleItem = () => {
    if (!isUserAuthenticated) return;
    toggleSaveItem(item);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="relative bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 p-4">
        <div className="flex justify-between items-center">
          {isUserAuthenticated ? (
            <Button
              variant="contained"
              onClick={handleToggleItem}
              className={`py-2 px-4 text-sm rounded-full ${isSaved(item._id) ? "bg-gradient-to-r from-red-500 to-red-700 text-white" : "bg-gradient-to-r from-blue-500 to-green-500 text-white"}`}
            >
              {isSaved(item._id) ? "Remove from Cart" : "Add to Cart"}
            </Button>
          ) : (
            <Button
              variant="contained"
              className="bg-gradient-to-r from-blue-500 to-green-500 text-white"
            >
              Please <LoginLink>Login</LoginLink>
            </Button>
          )}
          <IconButton
            aria-label="close"
            onClick={onClose}
            className="hover:bg-red-500 dark:hover:bg-red-700 transition-colors"
            sx={{
              color: "inherit",
              "&.MuiIconButton-root:hover": {
                color: "white",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </div>
        <div className="text-lg font-semibold text-gray-800 dark:text-white text-center mt-2">
          {item.title || "Item Details"}
        </div>
      </DialogTitle>
      <DialogContent className="flex flex-col items-center bg-gray-50 dark:bg-gray-900">
        {loading ? (
          <div className="flex justify-center items-center h-[200px]">
            <CircularProgress size={60} />
          </div>
        ) : (
          <div className="w-full flex flex-col items-center gap-6 p-6">
            <Image
              src={urlFor(item.image).url()}
              alt={item.title}
              width={200}
              height={200}
              className="object-contain rounded-lg shadow-md"
            />
            <div className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed px-4 max-h-48 overflow-y-auto">
              {item.description || "No description available"}
            </div>
            <p className="font-bold text-2xl text-blue-600 dark:text-blue-400">
              ${item.price.toFixed(2)}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}