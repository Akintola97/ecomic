// "use client"; // Declare this as a client-side component for interactivity

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import Dialog from "@mui/material/Dialog";
// import DialogTitle from "@mui/material/DialogTitle";
// import DialogContent from "@mui/material/DialogContent";
// import Fade from "@mui/material/Fade";
// import { IconButton, Button, CircularProgress } from "@mui/material"; // Material UI components
// import CloseIcon from "@mui/icons-material/Close";
// import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components"; // Kinde Auth LoginLink component
// import { urlFor } from "@/sanity/lib/image";

// const FeaturedItemsModal = ({ data, userId }) => {
//   const [open, setOpen] = useState(false); // State to track if the modal is open
//   const [selectedItem, setSelectedItem] = useState(null); // State to track the currently selected item
//   const [cartStatus, setCartStatus] = useState({}); // State to track cart status of each item
//   const [loading, setLoading] = useState(true); // Loading state for fetching cart statuses

//   /**
//    * Function to fetch the cart status of all items.
//    */
//   const checkAllCartStatuses = async () => {
//     if (!userId) {
//       setLoading(false); // Skip fetching statuses if the user is not logged in
//       return;
//     }

//     try {
//       const statuses = await Promise.all(
//         data.map(async (item) => {
//           const response = await fetch("/api/checkcart", {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ userId, productId: item._id }), // Send userId and productId to the API
//           });

//           if (!response.ok) {
//             throw new Error(`Failed to check cart status for product ${item._id}`);
//           }

//           const { exists } = await response.json(); // Parse the response to get cart status
//           return { [item._id]: exists }; // Map product ID to cart status
//         })
//       );

//       const combinedStatuses = statuses.reduce((acc, status) => {
//         return { ...acc, ...status };
//       }, {});

//       setCartStatus(combinedStatuses); // Update the cart status state
//     } catch (error) {
//       console.error("Error checking cart statuses:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /**
//    * Fetch cart statuses when the component mounts or `userId` changes.
//    */
//   useEffect(() => {
//     checkAllCartStatuses();
//   }, [userId, data]);

//   /**
//    * Function to add an item to the cart.
//    */
//   const addToCart = async (productId) => {
//     try {
//       const response = await fetch("/api/addcart", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ userId, productId }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to add item to cart");
//       }

//       setCartStatus((prevState) => ({
//         ...prevState,
//         [productId]: true, // Update state to reflect added status
//       }));
//     } catch (error) {
//       console.error("Error adding item to cart:", error);
//     }
//   };

//   /**
//    * Function to remove an item from the cart.
//    */
//   const removeFromCart = async (productId) => {
//     try {
//       const response = await fetch("/api/removecart", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ userId, productId }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to remove item from cart");
//       }

//       setCartStatus((prevState) => ({
//         ...prevState,
//         [productId]: false, // Update state to reflect removed status
//       }));
//     } catch (error) {
//       console.error("Error removing item from cart:", error);
//     }
//   };

//   /**
//    * Toggle the cart status of an item.
//    */
//   const toggleCartStatus = (productId) => {
//     if (!userId) return; // Do nothing if the user is not logged in

//     if (cartStatus[productId]) {
//       removeFromCart(productId);
//     } else {
//       addToCart(productId);
//     }
//   };

//   /**
//    * Open the modal and set the selected item.
//    */
//   const handleClickOpen = (item) => {
//     setSelectedItem(item);
//     setOpen(true);
//   };

//   /**
//    * Close the modal and clear the selected item after fade-out.
//    */
//   const handleClose = () => {
//     setOpen(false);
//     setTimeout(() => setSelectedItem(null), 300);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <CircularProgress size={60} /> {/* Material UI CircularProgress spinner */}
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* Horizontal scrolling container for featured items */}
//       <div className="flex items-center gap-6 md:gap-8 overflow-x-auto w-full h-full pl-4 pr-4 md:pl-8 md:pr-8 pb-6 md:pb-8 scrollbar-thin scrollbar-thumb-blue-500 justify-start md:justify-center">
//         {data.map((item) => (
//           <div
//             key={item._id}
//             className="border rounded-md shadow-md overflow-hidden bg-white dark:bg-gray-800 flex-shrink-0 flex flex-col items-center w-[240px] sm:w-[180px] md:w-[220px] transition-transform duration-300 hover:scale-105 hover:shadow-lg"
//           >
//             {/* Clickable Image Section */}
//             {item.image && (
//               <div
//                 className="relative w-full h-[200px] bg-gray-200 cursor-pointer"
//                 onClick={() => handleClickOpen(item)} // Open the modal when the image is clicked
//               >
//                 <Image
//                   src={urlFor(item.image).url()}
//                   alt={item.title}
//                   layout="fill"
//                   objectFit="contain"
//                   className="p-2"
//                 />
//               </div>
//             )}
//             {/* Item Details and Add to Cart Button */}
//             <div className="p-4 text-center">
//               <h2 className="font-semibold text-base md:text-sm truncate text-gray-900 dark:text-gray-100">
//                 {item.title.length > 30
//                   ? `${item.title.substring(0, 30)}...`
//                   : item.title}
//               </h2>
//               <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold mt-2">
//                 ${item.price.toFixed(2)}
//               </p>
//               {userId ? (
//                 <button
//                   onClick={() => toggleCartStatus(item._id)} // Toggle cart status without opening modal
//                   className={`py-2 px-4 text-sm rounded-full mt-3 ${
//                     cartStatus[item._id]
//                       ? "bg-gradient-to-r from-red-500 to-red-700 text-white"
//                       : "bg-gradient-to-r from-blue-500 to-green-500 text-white"
//                   }`}
//                 >
//                   {cartStatus[item._id] ? "Remove from Cart" : "Add to Cart"}
//                 </button>
//               ) : (
//                 <LoginLink>
//                   <button className="py-2 px-4 text-sm rounded-full mt-3 bg-gradient-to-r from-blue-500 to-green-500 text-white">
//                     Add to Cart
//                   </button>
//                 </LoginLink>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Modal */}
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
//             {selectedItem && userId ? (
//               <Button
//                 variant="contained"
//                 onClick={() => toggleCartStatus(selectedItem._id)}
//                 className={`py-2 px-4 text-sm rounded-full ${
//                   cartStatus[selectedItem._id]
//                     ? "bg-gradient-to-r from-red-500 to-red-700 text-white"
//                     : "bg-gradient-to-r from-blue-500 to-green-500 text-white"
//                 }`}
//               >
//                 {cartStatus[selectedItem._id] ? "Remove from Cart" : "Add to Cart"}
//               </Button>
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
// };

// export default FeaturedItemsModal;






// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import Dialog from "@mui/material/Dialog";
// import DialogTitle from "@mui/material/DialogTitle";
// import DialogContent from "@mui/material/DialogContent";
// import Fade from "@mui/material/Fade";
// import { IconButton, Button, CircularProgress } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
// import { urlFor } from "@/sanity/lib/image";

// /**
//  * A horizontal scrolling row of featured items,
//  * each clickable to open a modal with more details.
//  * Also allows add/remove from cart (toggleCartStatus).
//  */
// export default function FeaturedItemsModal({ data, userId }) {
//   const [open, setOpen] = useState(false); // Control the MUI Dialog
//   const [selectedItem, setSelectedItem] = useState(null); // Currently selected item for the modal
//   const [cartStatus, setCartStatus] = useState({}); // { [productId]: boolean (inCart or not) }
//   const [loading, setLoading] = useState(true); // True until we fetch cart statuses

//   /**
//    * Check if each item is in the user's cart.
//    */
//   const checkAllCartStatuses = async () => {
//     if (!userId) {
//       // If user not logged in, set everything to false
//       const defaultStatuses = data.reduce((acc, item) => {
//         acc[item._id] = false;
//         return acc;
//       }, {});
//       setCartStatus(defaultStatuses);
//       setLoading(false);
//       return;
//     }

//     try {
//       const statuses = await Promise.all(
//         data.map(async (item) => {
//           const response = await fetch("/api/checkcart", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ userId, productId: item._id }),
//           });
//           if (!response.ok) {
//             throw new Error(`Failed to check cart status for product ${item._id}`);
//           }
//           const { exists } = await response.json();
//           return { [item._id]: exists };
//         })
//       );

//       // Combine statuses
//       const combinedStatuses = statuses.reduce((acc, status) => {
//         return { ...acc, ...status };
//       }, {});
//       setCartStatus(combinedStatuses);
//     } catch (error) {
//       console.error("Error checking cart statuses:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /**
//    * On mount or when userId/data changes, fetch statuses.
//    */
//   useEffect(() => {
//     checkAllCartStatuses();
//   }, [userId, data]);

//   /**
//    * Add item to cart and dispatch "cartUpdated".
//    */
//   const addToCart = async (productId) => {
//     try {
//       const response = await fetch("/api/addcart", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId, productId }),
//       });
//       if (!response.ok) {
//         throw new Error("Failed to add item to cart");
//       }
//       setCartStatus((prev) => ({ ...prev, [productId]: true }));

//       // Dispatch cartUpdated
//       if (typeof window !== "undefined") {
//         window.dispatchEvent(new Event("cartUpdated"));
//       }
//     } catch (error) {
//       console.error("Error adding item to cart:", error);
//     }
//   };

//   /**
//    * Remove item from cart and dispatch "cartUpdated".
//    */
//   const removeFromCart = async (productId) => {
//     try {
//       const response = await fetch("/api/removecart", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId, productId }),
//       });
//       if (!response.ok) {
//         throw new Error("Failed to remove item from cart");
//       }
//       setCartStatus((prev) => ({ ...prev, [productId]: false }));

//       // Dispatch cartUpdated
//       if (typeof window !== "undefined") {
//         window.dispatchEvent(new Event("cartUpdated"));
//       }
//     } catch (error) {
//       console.error("Error removing item from cart:", error);
//     }
//   };

//   /**
//    * Toggle in-cart status for a product.
//    */
//   const toggleCartStatus = (productId) => {
//     if (!userId) return; // if not logged in, do nothing
//     if (cartStatus[productId]) {
//       removeFromCart(productId);
//     } else {
//       addToCart(productId);
//     }
//   };

//   /**
//    * Handlers for opening/closing the modal.
//    */
//   const handleClickOpen = (item) => {
//     setSelectedItem(item);
//     setOpen(true);
//   };
//   const handleClose = () => {
//     setOpen(false);
//     setTimeout(() => setSelectedItem(null), 300); // Wait for fade-out
//   };

//   // Show spinner while loading statuses
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <CircularProgress size={60} />
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* Horizontal scrolling container for featured items */}
//       <div className="flex items-center gap-6 md:gap-8 overflow-x-auto w-full h-full pl-4 pr-4 md:pl-8 md:pr-8 pb-6 md:pb-8 scrollbar-thin scrollbar-thumb-blue-500 justify-start md:justify-center">
//         {data.map((item) => (
//           <div
//             key={item._id}
//             className="border rounded-md shadow-md overflow-hidden bg-white dark:bg-gray-800 flex-shrink-0 flex flex-col items-center w-[240px] sm:w-[180px] md:w-[220px] transition-transform duration-300 hover:scale-105 hover:shadow-lg"
//           >
//             {/* Image Section (open modal on click) */}
//             {item.image && (
//               <div
//                 className="relative w-full h-[200px] bg-gray-200 cursor-pointer"
//                 onClick={() => handleClickOpen(item)}
//               >
//                 <Image
//                   src={urlFor(item.image).url()}
//                   alt={item.title}
//                   layout="fill"
//                   objectFit="contain"
//                   className="p-2"
//                 />
//               </div>
//             )}
//             {/* Item Title & Price & Add/Remove Button */}
//             <div className="p-4 text-center">
//               <h2 className="font-semibold text-base md:text-sm truncate text-gray-900 dark:text-gray-100">
//                 {item.title.length > 30
//                   ? `${item.title.substring(0, 30)}...`
//                   : item.title}
//               </h2>
//               <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold mt-2">
//                 ${item.price.toFixed(2)}
//               </p>
//               {userId ? (
//                 <button
//                   onClick={() => toggleCartStatus(item._id)}
//                   className={`py-2 px-4 text-sm rounded-full mt-3 ${
//                     cartStatus[item._id]
//                       ? "bg-gradient-to-r from-red-500 to-red-700 text-white"
//                       : "bg-gradient-to-r from-blue-500 to-green-500 text-white"
//                   }`}
//                 >
//                   {cartStatus[item._id] ? "Remove from Cart" : "Add to Cart"}
//                 </button>
//               ) : (
//                 <LoginLink>
//                   <button className="py-2 px-4 text-sm rounded-full mt-3 bg-gradient-to-r from-blue-500 to-green-500 text-white">
//                     Add to Cart
//                   </button>
//                 </LoginLink>
//               )}
//             </div>
//           </div>
//         ))}
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
//             {selectedItem && userId ? (
//               <Button
//                 variant="contained"
//                 onClick={() => toggleCartStatus(selectedItem._id)}
//                 className={`py-2 px-4 text-sm rounded-full ${
//                   cartStatus[selectedItem._id]
//                     ? "bg-gradient-to-r from-red-500 to-red-700 text-white"
//                     : "bg-gradient-to-r from-blue-500 to-green-500 text-white"
//                 }`}
//               >
//                 {cartStatus[selectedItem._id] ? "Remove from Cart" : "Add to Cart"}
//               </Button>
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





"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Fade from "@mui/material/Fade";
import { IconButton, Button, CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { urlFor } from "@/sanity/lib/image";

/**
 * A horizontal scrolling row of featured items,
 * each clickable to open a modal with more details.
 * Also allows add/remove from cart (toggleCartStatus).
 */
export default function FeaturedItemsModal({ data, userId }) {
  const [open, setOpen] = useState(false); // Control the MUI Dialog
  const [selectedItem, setSelectedItem] = useState(null); // Currently selected item for the modal
  const [cartStatus, setCartStatus] = useState({}); // { [productId]: boolean (inCart or not) }
  const [loading, setLoading] = useState(true); // True until cart statuses are fetched

  /**
   * Fetch cart statuses for all items in a single batch API call.
   * If user is not logged in, default all items to "not in cart".
   */
  const fetchCartStatuses = async () => {
    if (!userId) {
      // Default all items to "not in cart" if user is not logged in
      const defaultStatuses = data.reduce((acc, item) => {
        acc[item._id] = false;
        return acc;
      }, {});
      setCartStatus(defaultStatuses);
      setLoading(false);
      return;
    }

    try {
      // Collect all product IDs and make a single API request
      const productIds = data.map((item) => item._id);
      const response = await fetch("/api/checkcart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productIds }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch cart statuses");
      }

      // Parse the response and update the state
      const statuses = await response.json();
      setCartStatus(statuses);
    } catch (error) {
      console.error("Error fetching cart statuses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartStatuses();
  }, [userId, data]);

  /**
   * Add an item to the cart.
   */
  const addToCart = async (productId) => {
    try {
      const response = await fetch("/api/addcart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId }),
      });
      if (!response.ok) {
        throw new Error("Failed to add item to cart");
      }
      setCartStatus((prev) => ({ ...prev, [productId]: true }));

      // Dispatch a "cartUpdated" event
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("cartUpdated"));
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  /**
   * Remove an item from the cart.
   */
  const removeFromCart = async (productId) => {
    try {
      const response = await fetch("/api/removecart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId }),
      });
      if (!response.ok) {
        throw new Error("Failed to remove item from cart");
      }
      setCartStatus((prev) => ({ ...prev, [productId]: false }));

      // Dispatch a "cartUpdated" event
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("cartUpdated"));
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  /**
   * Toggle the in-cart status for a product.
   */
  const toggleCartStatus = (productId) => {
    if (!userId) return; // Do nothing if the user is not logged in
    if (cartStatus[productId]) {
      removeFromCart(productId);
    } else {
      addToCart(productId);
    }
  };

  /**
   * Handlers for opening/closing the modal.
   */
  const handleClickOpen = (item) => {
    setSelectedItem(item);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setTimeout(() => setSelectedItem(null), 300); // Wait for fade-out
  };

  // Show spinner while fetching cart statuses
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress size={60} />
      </div>
    );
  }

  return (
    <>
      {/* Horizontal scrolling container for featured items */}
      <div className="flex items-center gap-6 md:gap-8 overflow-x-auto w-full h-full pl-4 pr-4 md:pl-8 md:pr-8 pb-6 md:pb-8 scrollbar-thin scrollbar-thumb-blue-500 justify-start md:justify-center">
        {data.map((item) => (
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
                {item.title.length > 30
                  ? `${item.title.substring(0, 30)}...`
                  : item.title}
              </h2>
              <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold mt-2">
                ${item.price.toFixed(2)}
              </p>
              {userId ? (
                <button
                  onClick={() => toggleCartStatus(item._id)}
                  className={`py-2 px-4 text-sm rounded-full mt-3 ${
                    cartStatus[item._id]
                      ? "bg-gradient-to-r from-red-500 to-red-700 text-white"
                      : "bg-gradient-to-r from-blue-500 to-green-500 text-white"
                  }`}
                >
                  {cartStatus[item._id] ? "Remove from Cart" : "Add to Cart"}
                </button>
              ) : (
                <LoginLink>
                  <button className="py-2 px-4 text-sm rounded-full mt-3 bg-gradient-to-r from-blue-500 to-green-500 text-white">
                    Add to Cart
                  </button>
                </LoginLink>
              )}
            </div>
          </div>
        ))}
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
            {selectedItem && userId ? (
              <Button
                variant="contained"
                onClick={() => toggleCartStatus(selectedItem._id)}
                className={`py-2 px-4 text-sm rounded-full ${
                  cartStatus[selectedItem._id]
                    ? "bg-gradient-to-r from-red-500 to-red-700 text-white"
                    : "bg-gradient-to-r from-blue-500 to-green-500 text-white"
                }`}
              >
                {cartStatus[selectedItem._id] ? "Remove from Cart" : "Add to Cart"}
              </Button>
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