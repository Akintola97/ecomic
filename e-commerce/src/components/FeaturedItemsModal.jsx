"use client";

import { SavedItemsContext } from "@/context/SavedItems";
import { urlFor } from "@/sanity/lib/image";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Fade,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import { useContext, useState } from "react";

export default function FeaturedItemsModal({ data, isUserAuthenticated }) {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const { savedItems, toggleSaveItem, updateItemQuantity } =
    useContext(SavedItemsContext);

  const isSaved = (itemId) => savedItems.some((item) => item._id === itemId);

  const getItemQuantity = (itemId) => {
    const item = savedItems.find((saved) => saved._id === itemId);
    return item ? item.quantity : 0;
  };

  const handleClickOpen = (item) => {
    setSelectedItem(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => setSelectedItem(null), 300);
  };

  const handleToggleItem = (item) => {
    if (!isUserAuthenticated) return;
    toggleSaveItem(item);
  };

  return (
    <>
      <div className="flex items-center gap-6 md:gap-8 overflow-x-auto w-full h-full pl-4 pr-4 md:pl-8 md:pr-8 pb-6 md:pb-8 justify-start md:justify-center">
        {data?.map((item) => {
          const savedItem = savedItems.find((saved) => saved._id === item._id);
          const savedQuantity = savedItem ? savedItem.quantity : 0;

          return (
            <div
              key={item._id}
              className="border rounded-md shadow-md overflow-hidden bg-white dark:bg-gray-800 flex-shrink-0 flex flex-col items-center w-[240px] sm:w-[180px] md:w-[220px] transition-transform duration-300 hover:scale-105 hover:shadow-lg"
            >
              {item?.image && (
                <div
                  className="relative w-full h-[200px] bg-gray-200 cursor-pointer"
                  onClick={() => handleClickOpen(item)}
                >
                  <Image
                    src={urlFor(item.image).url()}
                    alt={item.title}
                    layout="fill"
                    objectFit="contain"
                    className="p-2"
                  />
                </div>
              )}
              <div className="p-4 text-center">
                <h2 className="font-semibold text-base md:text-sm truncate text-gray-900 dark:text-gray-100">
                  {item.title.length > 30
                    ? `${item.title.substring(0, 30)}...`
                    : item.title}
                </h2>
                <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold mt-2">
                  ${item.price.toFixed(2)}
                </p>
                {isUserAuthenticated ? (
                  <div className="mt-3 flex flex-col items-center gap-2">
                    {isSaved(item._id) && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateItemQuantity(item._id, false)}
                          className="px-2 py-1 bg-gradient-4 from-teal-400 to teal-600 text-white font-semibold rounded transition disabled:opacity-50"
                          disabled={savedQuantity <= 1}
                        >
                          -
                        </button>
                        <span className="font-semibold">{savedQuantity}</span>
                        <button
                          onClick={() => updateItemQuantity(item._id, true)}
                          className="px-2 py-1 bg-gradient-to-r from-ble-400 to-blue-600 text-white font-semibold rounded transition disabled:opacity-50"
                          disabled={
                            item.inventory && savedQuantity >= item.inventory
                          }
                        >
                          +
                        </button>
                      </div>
                    )}
                    <button
                      onClick={() => handleToggleItem(item)}
                      className={`py-2 px-4 text-sm rounded-full ${isSaved(item._id) ? "bg-gradient-to-r from-red-500 to-red-700 text-white" : "bg-gradient-to-r from-blue-500 to-green-500 text-white"}`}
                    >
                      {isSaved(item._id) ? "Remove from Cart" : "Add to Cart"}
                    </button>
                  </div>
                ) : (
                  <LoginLink>
                    <button className="py-2 px-4 text-sm rounded-full mt-3 bg-gradient-to-r from-blue-500 to-green-500 text-white">
                      Add to Cart
                    </button>
                  </LoginLink>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 300 }}
      >
        <DialogTitle className="relative bg-gray-100 dark:bg-gray-800 p-4 border-b border-gray-300 dark:border-gray-700">
          <div className="flex justify-between items-center">
            {selectedItem && isUserAuthenticated ? (
              <div className="flex items-center gap-2">
                {isSaved(selectedItem._id) && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateItemQuantity(selectedItem._id, false)
                      }
                      className="px-2 py-1 bg-gradient-to-r from-teal-400 to-teal-600 text-white font-semibold rounded transition disabled:opacity-50"
                      disabled={getItemQuantity(selectedItem._id <= 1)}
                    >
                      -
                    </button>
                    <span className="font-semibold">
                      {getItemQuantity(selectedItem._id)}
                    </span>
                    <button
                      onClick={() => updateItemQuantity(selectedItem._id, true)}
                      className="px-2 py-1 bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold rounded transition disabled:opacity-50"
                      disabled={
                        selectedItem.inventory &&
                        getItemQuantity(selectedItem._id) >=
                          selectedItem.inventory
                      }
                    >
                      +
                    </button>
                  </div>
                )}
                <Button
                  variant="contained"
                  onClick={() => handleToggleItem(selectedItem)}
                  className={`py-2 px-4 text-sm rounded-full ${isSaved(selectedItem._id) ? "bg-gradient-to-r from-red-500 to-red-700 text-white" : "bg-gradient-to-r from-blue-500 to-green-500 text-white"}`}
                >
                  {isSaved(selectedItem._id)
                    ? "Remove from Cart"
                    : "Add to Cart"}
                </Button>
              </div>
            ) : (
              <LoginLink>
                <Button
                  variant="contained"
                  className="py-2 px-4 text-sm rounded-full bg-gradient-to-r from-blue-500 to-green-500 text-white"
                >
                  Add to Cart
                </Button>
              </LoginLink>
            )}
            <IconButton
              aria-label="close"
              onClick={handleClose}
              className="hover:bg-red-500 hover:text-white dark:hover:bg-red-700 transition-colors"
            >
              <CloseIcon />
            </IconButton>
          </div>
          <div className="text-lg font-semibold text-gray-800 dark:text-white text-center mt-2">
            {selectedItem?.title || "Item Details"}
          </div>
        </DialogTitle>
        <DialogContent className="flex flex-col items-center bg-gray-50 dark:bg-gray-900">
          {selectedItem && (
            <div className="w-full flex flex-col items-center gap-6 p-6">
              <Image
                src={urlFor(selectedItem.image).url()}
                alt={selectedItem.title}
                width={200}
                height={200}
                className="object-contain rounded-lg shadow-md"
              />
              <div className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed px-4 max-h-48 overflow-y-auto">
                {selectedItem.description || "No description available"}
              </div>
              <p className="font-bold text-2xl text-blue-600 dark:text-blue-400">
                ${selectedItem.price.toFixed(2)}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}