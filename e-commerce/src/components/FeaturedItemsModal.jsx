// // "use client";

// // import { useState, useEffect } from "react";
// // import Image from "next/image";
// // import Dialog from "@mui/material/Dialog";
// // import DialogTitle from "@mui/material/DialogTitle";
// // import DialogContent from "@mui/material/DialogContent";
// // import Fade from "@mui/material/Fade";
// // import { IconButton, Button, CircularProgress } from "@mui/material";
// // import CloseIcon from "@mui/icons-material/Close";
// // import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
// // import { urlFor } from "@/sanity/lib/image";

// // /**
// //  * A horizontal scrolling row of featured items,
// //  * each clickable to open a modal with more details.
// //  * Also allows add/remove from cart (toggleCartStatus).
// //  */
// // export default function FeaturedItemsModal({ data, userId }) {
// //   const [open, setOpen] = useState(false); // Control the MUI Dialog
// //   const [selectedItem, setSelectedItem] = useState(null); // Currently selected item for the modal
// //   const [cartStatus, setCartStatus] = useState({}); // { [productId]: boolean (inCart or not) }
// //   const [loading, setLoading] = useState(true); // True until we fetch cart statuses

// //   /**
// //    * Check if each item is in the user's cart.
// //    */
// //   const checkAllCartStatuses = async () => {
// //     if (!userId) {
// //       // If user not logged in, set everything to false
// //       const defaultStatuses = data.reduce((acc, item) => {
// //         acc[item._id] = false;
// //         return acc;
// //       }, {});
// //       setCartStatus(defaultStatuses);
// //       setLoading(false);
// //       return;
// //     }

// //     try {
// //       const statuses = await Promise.all(
// //         data.map(async (item) => {
// //           const response = await fetch("/api/checkcart", {
// //             method: "POST",
// //             headers: { "Content-Type": "application/json" },
// //             body: JSON.stringify({ userId, productId: item._id }),
// //           });
// //           if (!response.ok) {
// //             throw new Error(`Failed to check cart status for product ${item._id}`);
// //           }
// //           const { exists } = await response.json();
// //           return { [item._id]: exists };
// //         })
// //       );

// //       // Combine statuses
// //       const combinedStatuses = statuses.reduce((acc, status) => {
// //         return { ...acc, ...status };
// //       }, {});
// //       setCartStatus(combinedStatuses);
// //     } catch (error) {
// //       console.error("Error checking cart statuses:", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   /**
// //    * On mount or when userId/data changes, fetch statuses.
// //    */
// //   useEffect(() => {
// //     checkAllCartStatuses();
// //   }, [userId, data]);

// //   /**
// //    * Add item to cart and dispatch "cartUpdated".
// //    */
// //   const addToCart = async (productId) => {
// //     try {
// //       const response = await fetch("/api/addcart", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ userId, productId }),
// //       });
// //       if (!response.ok) {
// //         throw new Error("Failed to add item to cart");
// //       }
// //       setCartStatus((prev) => ({ ...prev, [productId]: true }));

// //       // Dispatch cartUpdated
// //       if (typeof window !== "undefined") {
// //         window.dispatchEvent(new Event("cartUpdated"));
// //       }
// //     } catch (error) {
// //       console.error("Error adding item to cart:", error);
// //     }
// //   };

// //   /**
// //    * Remove item from cart and dispatch "cartUpdated".
// //    */
// //   const removeFromCart = async (productId) => {
// //     try {
// //       const response = await fetch("/api/removecart", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ userId, productId }),
// //       });
// //       if (!response.ok) {
// //         throw new Error("Failed to remove item from cart");
// //       }
// //       setCartStatus((prev) => ({ ...prev, [productId]: false }));

// //       // Dispatch cartUpdated
// //       if (typeof window !== "undefined") {
// //         window.dispatchEvent(new Event("cartUpdated"));
// //       }
// //     } catch (error) {
// //       console.error("Error removing item from cart:", error);
// //     }
// //   };

// //   /**
// //    * Toggle in-cart status for a product.
// //    */
// //   const toggleCartStatus = (productId) => {
// //     if (!userId) return; // if not logged in, do nothing
// //     if (cartStatus[productId]) {
// //       removeFromCart(productId);
// //     } else {
// //       addToCart(productId);
// //     }
// //   };

// //   /**
// //    * Handlers for opening/closing the modal.
// //    */
// //   const handleClickOpen = (item) => {
// //     setSelectedItem(item);
// //     setOpen(true);
// //   };
// //   const handleClose = () => {
// //     setOpen(false);
// //     setTimeout(() => setSelectedItem(null), 300); // Wait for fade-out
// //   };

// //   // Show spinner while loading statuses
// //   if (loading) {
// //     return (
// //       <div className="flex justify-center items-center h-screen">
// //         <CircularProgress size={60} />
// //       </div>
// //     );
// //   }

// //   return (
// //     <>
// //       {/* Horizontal scrolling container for featured items */}
// //       <div className="flex items-center gap-6 md:gap-8 overflow-x-auto w-full h-full pl-4 pr-4 md:pl-8 md:pr-8 pb-6 md:pb-8 scrollbar-thin scrollbar-thumb-blue-500 justify-start md:justify-center">
// //         {data.map((item) => (
// //           <div
// //             key={item._id}
// //             className="border rounded-md shadow-md overflow-hidden bg-white dark:bg-gray-800 flex-shrink-0 flex flex-col items-center w-[240px] sm:w-[180px] md:w-[220px] transition-transform duration-300 hover:scale-105 hover:shadow-lg"
// //           >
// //             {/* Image Section (open modal on click) */}
// //             {item.image && (
// //               <div
// //                 className="relative w-full h-[200px] bg-gray-200 cursor-pointer"
// //                 onClick={() => handleClickOpen(item)}
// //               >
// //                 <Image
// //                   src={urlFor(item.image).url()}
// //                   alt={item.title}
// //                   layout="fill"
// //                   objectFit="contain"
// //                   className="p-2"
// //                 />
// //               </div>
// //             )}
// //             {/* Item Title & Price & Add/Remove Button */}
// //             <div className="p-4 text-center">
// //               <h2 className="font-semibold text-base md:text-sm truncate text-gray-900 dark:text-gray-100">
// //                 {item.title.length > 30
// //                   ? `${item.title.substring(0, 30)}...`
// //                   : item.title}
// //               </h2>
// //               <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold mt-2">
// //                 ${item.price.toFixed(2)}
// //               </p>
// //               {userId ? (
// //                 <button
// //                   onClick={() => toggleCartStatus(item._id)}
// //                   className={`py-2 px-4 text-sm rounded-full mt-3 ${
// //                     cartStatus[item._id]
// //                       ? "bg-gradient-to-r from-red-500 to-red-700 text-white"
// //                       : "bg-gradient-to-r from-blue-500 to-green-500 text-white"
// //                   }`}
// //                 >
// //                   {cartStatus[item._id] ? "Remove from Cart" : "Add to Cart"}
// //                 </button>
// //               ) : (
// //                 <LoginLink>
// //                   <button className="py-2 px-4 text-sm rounded-full mt-3 bg-gradient-to-r from-blue-500 to-green-500 text-white">
// //                     Add to Cart
// //                   </button>
// //                 </LoginLink>
// //               )}
// //             </div>
// //           </div>
// //         ))}
// //       </div>

// //       {/* Material UI Modal */}
// //       <Dialog
// //         open={open}
// //         onClose={handleClose}
// //         maxWidth="md"
// //         fullWidth
// //         TransitionComponent={Fade}
// //         TransitionProps={{ timeout: 300 }}
// //       >
// //         <DialogTitle className="relative bg-gray-100 dark:bg-gray-800 p-4 border-b border-gray-300 dark:border-gray-700">
// //           <div className="flex justify-between items-center">
// //             {selectedItem && userId ? (
// //               <Button
// //                 variant="contained"
// //                 onClick={() => toggleCartStatus(selectedItem._id)}
// //                 className={`py-2 px-4 text-sm rounded-full ${
// //                   cartStatus[selectedItem._id]
// //                     ? "bg-gradient-to-r from-red-500 to-red-700 text-white"
// //                     : "bg-gradient-to-r from-blue-500 to-green-500 text-white"
// //                 }`}
// //               >
// //                 {cartStatus[selectedItem._id] ? "Remove from Cart" : "Add to Cart"}
// //               </Button>
// //             ) : (
// //               <LoginLink>
// //                 <Button
// //                   variant="contained"
// //                   className="py-2 px-4 text-sm rounded-full bg-gradient-to-r from-blue-500 to-green-500 text-white"
// //                 >
// //                   Add to Cart
// //                 </Button>
// //               </LoginLink>
// //             )}
// //             <IconButton
// //               aria-label="close"
// //               onClick={handleClose}
// //               className="hover:bg-red-500 hover:text-white dark:hover:bg-red-700 transition-colors"
// //             >
// //               <CloseIcon />
// //             </IconButton>
// //           </div>
// //           <div className="text-lg font-semibold text-gray-800 dark:text-white text-center mt-2">
// //             {selectedItem?.title || "Item Details"}
// //           </div>
// //         </DialogTitle>
// //         <DialogContent className="flex flex-col items-center bg-gray-50 dark:bg-gray-900">
// //           {selectedItem && (
// //             <div className="w-full flex flex-col items-center gap-6 p-6">
// //               <Image
// //                 src={urlFor(selectedItem.image).url()}
// //                 alt={selectedItem.title}
// //                 width={200}
// //                 height={200}
// //                 className="object-contain rounded-lg shadow-md"
// //               />
// //               <div className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed px-4 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
// //                 {selectedItem.description || "No description available."}
// //               </div>
// //               <p className="font-bold text-2xl text-blue-600 dark:text-blue-400">
// //                 ${selectedItem.price.toFixed(2)}
// //               </p>
// //             </div>
// //           )}
// //         </DialogContent>
// //       </Dialog>
// //     </>
// //   );
// // }









// // components/FeaturedItemsModal.jsx
// "use client";

// import { useState, useContext } from "react";
// import Image from "next/image";
// import Dialog from "@mui/material/Dialog";
// import DialogTitle from "@mui/material/DialogTitle";
// import DialogContent from "@mui/material/DialogContent";
// import Fade from "@mui/material/Fade";
// import { IconButton, Button } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
// import { urlFor } from "@/sanity/lib/image";
// import { SavedItemsContext } from "@/context/SavedItems";

// /**
//  * A horizontal scrolling row of featured items,
//  * each clickable to open a modal with more details.
//  * Uses local storage (SavedItemsContext) to add/remove items from "cart,"
//  * mirroring the logic from your BannerCarousel (no remote API calls).
//  */
// export default function FeaturedItemsModal({ data, isUserAuthenticated }) {
//   // MUI Dialog state
//   const [open, setOpen] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);

//   // --- Local Storage Logic via Context ---
//   const { savedItems, toggleSaveItem, updateItemQuantity, removeItem } = useContext(SavedItemsContext);

//   // Helper: check if item is saved (in local storage)
//   const isSaved = (itemId) => savedItems.some((item) => item._id === itemId);

//   // Handlers for modal open/close
//   const handleClickOpen = (item) => {
//     setSelectedItem(item);
//     setOpen(true);
//   };
//   const handleClose = () => {
//     setOpen(false);
//     setTimeout(() => setSelectedItem(null), 300); // Wait for fade-out
//   };

//   // Toggle item in cart
//   const handleToggleItem = (item) => {
//     if (!isUserAuthenticated) return; // Not logged in => do nothing
//     toggleSaveItem(item);
//   };

//   return (
//     <>
//       {/* Horizontal scrolling container for featured items */}
//       <div className="flex items-center gap-6 md:gap-8 overflow-x-auto w-full h-full pl-4 pr-4 md:pl-8 md:pr-8 pb-6 md:pb-8 scrollbar-thin scrollbar-thumb-blue-500 justify-start md:justify-center">
//         {data.map((item) => {
//           const savedItem = savedItems.find((saved) => saved._id === item._id);
//           const savedQuantity = savedItem ? savedItem.quantity : 0;

//           return (
//             <div
//               key={item._id}
//               className="border rounded-md shadow-md overflow-hidden bg-white dark:bg-gray-800 flex-shrink-0 flex flex-col items-center w-[240px] sm:w-[180px] md:w-[220px] transition-transform duration-300 hover:scale-105 hover:shadow-lg"
//             >
//               {/* Image Section (open modal on click) */}
//               {item.image && (
//                 <div
//                   className="relative w-full h-[200px] bg-gray-200 cursor-pointer"
//                   onClick={() => handleClickOpen(item)}
//                 >
//                   <Image
//                     src={urlFor(item.image).url()}
//                     alt={item.title}
//                     layout="fill"
//                     objectFit="contain"
//                     className="p-2"
//                   />
//                 </div>
//               )}

//               {/* Item Title & Price & Add/Remove Button */}
//               <div className="p-4 text-center">
//                 <h2 className="font-semibold text-base md:text-sm truncate text-gray-900 dark:text-gray-100">
//                   {item.title.length > 30 ? `${item.title.substring(0, 30)}...` : item.title}
//                 </h2>
//                 <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold mt-2">
//                   ${item.price.toFixed(2)}
//                 </p>

//                 {/* Show Add/Remove or Login button */}
//                 {isUserAuthenticated ? (
//                   <div className="mt-3 flex flex-col items-center gap-2">
//                     {/* Quantity Controls */}
//                     {isSaved(item._id) && (
//                       <div className="flex items-center gap-2">
//                         <button
//                           onClick={() => updateItemQuantity(item._id, false)}
//                           className="px-2 py-1 bg-gradient-to-r from-teal-400 to-teal-600 text-white font-semibold rounded transition disabled:opacity-50"
//                           disabled={savedQuantity <= 1}
//                         >
//                           -
//                         </button>
//                         <span className="font-semibold">{savedQuantity}</span>
//                         <button
//                           onClick={() => updateItemQuantity(item._id, true)}
//                           className="px-2 py-1 bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold rounded transition disabled:opacity-50"
//                           disabled={item.inventory && savedQuantity >= item.inventory}
//                         >
//                           +
//                         </button>
//                       </div>
//                     )}

//                     {/* Add/Remove Button */}
//                     <button
//                       onClick={() => handleToggleItem(item)}
//                       className={`py-2 px-4 text-sm rounded-full ${
//                         isSaved(item._id)
//                           ? "bg-gradient-to-r from-red-500 to-red-700 text-white"
//                           : "bg-gradient-to-r from-blue-500 to-green-500 text-white"
//                       }`}
//                     >
//                       {isSaved(item._id) ? "Remove from Cart" : "Add to Cart"}
//                     </button>
//                   </div>
//                 ) : (
//                   <LoginLink>
//                     <button className="py-2 px-4 text-sm rounded-full mt-3 bg-gradient-to-r from-blue-500 to-green-500 text-white">
//                       Add to Cart
//                     </button>
//                   </LoginLink>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Material UI Modal */}
//       <Dialog
//         open={open}
//         onClose={handleClose}
//         maxWidth="md"
//         fullWidth
//         TransitionComponent={Fade}
//         TransitionProps={{ timeout: 300 }}
//       >
//         <DialogTitle className="relative bg-gray-100 dark:bg-gray-800 p-4 border-b border-gray-300 dark:border-gray-700">
//           <div className="flex justify-between items-center">
//             {selectedItem && isUserAuthenticated ? (
//               <div className="flex items-center gap-2">
//                 {/* Quantity Controls */}
//                 {isSaved(selectedItem._id) && (
//                   <div className="flex items-center gap-2">
//                     <button
//                       onClick={() => updateItemQuantity(selectedItem._id, false)}
//                       className="px-2 py-1 bg-gradient-to-r from-teal-400 to-teal-600 text-white font-semibold rounded transition disabled:opacity-50"
//                       disabled={selectedItem.quantity <= 1}
//                     >
//                       -
//                     </button>
//                     <span className="font-semibold">{selectedItem.quantity}</span>
//                     <button
//                       onClick={() => updateItemQuantity(selectedItem._id, true)}
//                       className="px-2 py-1 bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold rounded transition disabled:opacity-50"
//                       disabled={selectedItem.inventory && selectedItem.quantity >= selectedItem.inventory}
//                     >
//                       +
//                     </button>
//                   </div>
//                 )}

//                 {/* Add/Remove Button */}
//                 <Button
//                   variant="contained"
//                   onClick={() => handleToggleItem(selectedItem)}
//                   className={`py-2 px-4 text-sm rounded-full ${
//                     isSaved(selectedItem._id)
//                       ? "bg-gradient-to-r from-red-500 to-red-700 text-white"
//                       : "bg-gradient-to-r from-blue-500 to-green-500 text-white"
//                   }`}
//                 >
//                   {isSaved(selectedItem._id) ? "Remove from Cart" : "Add to Cart"}
//                 </Button>
//               </div>
//             ) : (
//               <LoginLink>
//                 <Button
//                   variant="contained"
//                   className="py-2 px-4 text-sm rounded-full bg-gradient-to-r from-blue-500 to-green-500 text-white"
//                 >
//                   Add to Cart
//                 </Button>
//               </LoginLink>
//             )}
//             <IconButton
//               aria-label="close"
//               onClick={handleClose}
//               className="hover:bg-red-500 hover:text-white dark:hover:bg-red-700 transition-colors"
//             >
//               <CloseIcon />
//             </IconButton>
//           </div>
//           <div className="text-lg font-semibold text-gray-800 dark:text-white text-center mt-2">
//             {selectedItem?.title || "Item Details"}
//           </div>
//         </DialogTitle>
//         <DialogContent className="flex flex-col items-center bg-gray-50 dark:bg-gray-900">
//           {selectedItem && (
//             <div className="w-full flex flex-col items-center gap-6 p-6">
//               <Image
//                 src={urlFor(selectedItem.image).url()}
//                 alt={selectedItem.title}
//                 width={200}
//                 height={200}
//                 className="object-contain rounded-lg shadow-md"
//               />
//               <div className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed px-4 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
//                 {selectedItem.description || "No description available."}
//               </div>
//               <p className="font-bold text-2xl text-blue-600 dark:text-blue-400">
//                 ${selectedItem.price.toFixed(2)}
//               </p>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }



// components/FeaturedItemsModal.jsx
"use client";

import { useState, useContext } from "react";
import Image from "next/image";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Fade from "@mui/material/Fade";
import { IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { urlFor } from "@/sanity/lib/image";
import { SavedItemsContext } from "@/context/SavedItems";

/**
 * A horizontal scrolling row of featured items,
 * each clickable to open a modal with more details.
 * Uses SavedItemsContext to add/remove items from "cart,"
 * mirroring the logic from your BannerCarousel (no remote API calls).
 */
export default function FeaturedItemsModal({ data, isUserAuthenticated }) {
  // MUI Dialog state
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // --- Local Storage Logic via Context ---
  const { savedItems, toggleSaveItem, updateItemQuantity, removeItem } = useContext(SavedItemsContext);

  // Helper: check if item is saved (in local storage)
  const isSaved = (itemId) => savedItems.some((item) => item._id === itemId);

  /**
   * Retrieve the current quantity of an item.
   * @param {string} itemId - The ID of the item.
   * @returns {number} - The quantity of the item in the cart.
   */
  const getItemQuantity = (itemId) => {
    const item = savedItems.find((saved) => saved._id === itemId);
    return item ? item.quantity : 0;
  };

  // Handlers for modal open/close
  const handleClickOpen = (item) => {
    setSelectedItem(item);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setTimeout(() => setSelectedItem(null), 300); // Wait for fade-out
  };

  // Toggle item in cart
  const handleToggleItem = (item) => {
    if (!isUserAuthenticated) return; // Not logged in => do nothing
    toggleSaveItem(item);
  };

  return (
    <>
      {/* Horizontal scrolling container for featured items */}
      <div className="flex items-center gap-6 md:gap-8 overflow-x-auto w-full h-full pl-4 pr-4 md:pl-8 md:pr-8 pb-6 md:pb-8 scrollbar-thin scrollbar-thumb-blue-500 justify-start md:justify-center">
        {data.map((item) => {
          const savedItem = savedItems.find((saved) => saved._id === item._id);
          const savedQuantity = savedItem ? savedItem.quantity : 0;

          return (
            <div
              key={item._id}
              className="border rounded-md shadow-md overflow-hidden bg-white dark:bg-gray-800 flex-shrink-0 flex flex-col items-center w-[240px] sm:w-[180px] md:w-[220px] transition-transform duration-300 hover:scale-105 hover:shadow-lg"
            >
              {/* Image Section (open modal on click) */}
              {item.image && (
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

              {/* Item Title & Price & Add/Remove Button */}
              <div className="p-4 text-center">
                <h2 className="font-semibold text-base md:text-sm truncate text-gray-900 dark:text-gray-100">
                  {item.title.length > 30 ? `${item.title.substring(0, 30)}...` : item.title}
                </h2>
                <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold mt-2">
                  ${item.price.toFixed(2)}
                </p>

                {/* Show Add/Remove or Login button */}
                {isUserAuthenticated ? (
                  <div className="mt-3 flex flex-col items-center gap-2">
                    {/* Quantity Controls */}
                    {isSaved(item._id) && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateItemQuantity(item._id, false)}
                          className="px-2 py-1 bg-gradient-to-r from-teal-400 to-teal-600 text-white font-semibold rounded transition disabled:opacity-50"
                          disabled={savedQuantity <= 1}
                        >
                          -
                        </button>
                        <span className="font-semibold">{savedQuantity}</span>
                        <button
                          onClick={() => updateItemQuantity(item._id, true)}
                          className="px-2 py-1 bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold rounded transition disabled:opacity-50"
                          disabled={item.inventory && savedQuantity >= item.inventory}
                        >
                          +
                        </button>
                      </div>
                    )}

                    {/* Add/Remove Button */}
                    <button
                      onClick={() => handleToggleItem(item)}
                      className={`py-2 px-4 text-sm rounded-full ${
                        isSaved(item._id)
                          ? "bg-gradient-to-r from-red-500 to-red-700 text-white"
                          : "bg-gradient-to-r from-blue-500 to-green-500 text-white"
                      }`}
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

      {/* Material UI Modal */}
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
                {/* Quantity Controls */}
                {isSaved(selectedItem._id) && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateItemQuantity(selectedItem._id, false)}
                      className="px-2 py-1 bg-gradient-to-r from-teal-400 to-teal-600 text-white font-semibold rounded transition disabled:opacity-50"
                      disabled={getItemQuantity(selectedItem._id) <= 1}
                    >
                      -
                    </button>
                    <span className="font-semibold">{getItemQuantity(selectedItem._id)}</span>
                    <button
                      onClick={() => updateItemQuantity(selectedItem._id, true)}
                      className="px-2 py-1 bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold rounded transition disabled:opacity-50"
                      disabled={selectedItem.inventory && getItemQuantity(selectedItem._id) >= selectedItem.inventory}
                    >
                      +
                    </button>
                  </div>
                )}

                {/* Add/Remove Button */}
                <Button
                  variant="contained"
                  onClick={() => handleToggleItem(selectedItem)}
                  className={`py-2 px-4 text-sm rounded-full ${
                    isSaved(selectedItem._id)
                      ? "bg-gradient-to-r from-red-500 to-red-700 text-white"
                      : "bg-gradient-to-r from-blue-500 to-green-500 text-white"
                  }`}
                >
                  {isSaved(selectedItem._id) ? "Remove from Cart" : "Add to Cart"}
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
              <div className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed px-4 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
                {selectedItem.description || "No description available."}
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