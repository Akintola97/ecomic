// // "use client"; // Declare this as a client-side component for interactivity

// // import React, { useState, useEffect } from "react";
// // import {
// //   Box,
// //   Typography,
// //   Grid,
// //   TextField,
// //   Select,
// //   MenuItem,
// //   FormGroup,
// //   FormControlLabel,
// //   Checkbox,
// //   Pagination,
// //   CircularProgress, // Import CircularProgress for the loading spinner
// // } from "@mui/material"; // Import Material-UI components
// // import { urlFor } from "@/sanity/lib/image"; // Sanity image helper
// // import StoreItemModal from "./StoreItemModal"; // Modal component
// // import Image from "next/image"; // Import optimized Image component
// // import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components"; // Import LoginLink from Kinde Auth

// // const StoreModal = ({ data, userId }) => {
// //   const [filter, setFilter] = useState(""); // State for search filter
// //   const [sortOption, setSortOption] = useState(""); // State for sorting option
// //   const [categoryFilters, setCategoryFilters] = useState({}); // State for category filters
// //   const [open, setOpen] = useState(false); // State to control modal visibility
// //   const [selectedItem, setSelectedItem] = useState(null); // State to store selected item
// //   const [currentPage, setCurrentPage] = useState(1); // State for pagination
// //   const [cartStatus, setCartStatus] = useState({}); // Track cart status for each product
// //   const [loading, setLoading] = useState(true); // Loading state for fetching cart statuses
// //   const itemsPerPage = 12; // Number of items per page

// //   /**
// //    * Initialize cart statuses for all items
// //    * - If `userId` is not available, default all statuses to `false`
// //    * - Otherwise, fetch the statuses from the backend
// //    */
// //   const initializeCartStatuses = async () => {
// //     if (!userId) {
// //       // Default all statuses to `false` for unauthenticated users
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
// //             headers: {
// //               "Content-Type": "application/json",
// //             },
// //             body: JSON.stringify({ userId, productId: item._id }),
// //           });

// //           if (!response.ok) {
// //             throw new Error(
// //               `Failed to check cart status for product ${item._id}`
// //             );
// //           }

// //           const { exists } = await response.json();
// //           return { [item._id]: exists };
// //         })
// //       );

// //       const combinedStatuses = statuses.reduce((acc, status) => {
// //         return { ...acc, ...status };
// //       }, {});

// //       setCartStatus(combinedStatuses); // Update the cart status state
// //     } catch (error) {
// //       console.error("Error fetching cart statuses:", error);
// //     } finally {
// //       setLoading(false); // Stop loading spinner once statuses are fetched
// //     }
// //   };

// //   /**
// //    * Fetch cart statuses or set defaults when `userId` or `data` changes
// //    */
// //   useEffect(() => {
// //     initializeCartStatuses();
// //   }, [userId, data]);

// //   /**
// //    * Add a product to the cart
// //    */
// //   const handleAddToCart = async (productId) => {
// //     try {
// //       const response = await fetch("/api/addcart", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ userId, productId }),
// //       });

// //       if (!response.ok) {
// //         throw new Error("Failed to add item to cart");
// //       }

// //       setCartStatus((prevState) => ({
// //         ...prevState,
// //         [productId]: true, // Mark the product as added to the cart
// //       }));
// //     } catch (error) {
// //       console.error("Error adding item to cart:", error);
// //     }
// //   };

// //   /**
// //    * Remove a product from the cart
// //    */
// //   const handleRemoveFromCart = async (productId) => {
// //     try {
// //       const response = await fetch("/api/removecart", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ userId, productId }),
// //       });

// //       if (!response.ok) {
// //         throw new Error("Failed to remove item from cart");
// //       }

// //       setCartStatus((prevState) => ({
// //         ...prevState,
// //         [productId]: false, // Mark the product as removed from the cart
// //       }));
// //     } catch (error) {
// //       console.error("Error removing item from cart:", error);
// //     }
// //   };

// //   /**
// //    * Toggle product in and out of the cart
// //    * Redirect to login if the user is not logged in
// //    */
// //   const toggleCartStatus = (productId) => {
// //     if (!userId) return; // If user is not logged in, do nothing (handled by LoginLink)

// //     if (cartStatus[productId]) {
// //       handleRemoveFromCart(productId); // Remove from cart if already added
// //     } else {
// //       handleAddToCart(productId); // Add to cart if not added
// //     }
// //   };

// //   /**
// //    * Open modal for a specific product
// //    * Triggered only when clicking the image
// //    */
// //   const handleOpen = (item) => {
// //     setSelectedItem(item);
// //     setOpen(true);
// //   };

// //   /**
// //    * Close modal and clear selected item
// //    */
// //   const handleClose = () => {
// //     setOpen(false);
// //     setSelectedItem(null);
// //   };

// //   /**
// //    * Handle pagination changes
// //    */
// //   const handlePaginationChange = (event, page) => {
// //     setCurrentPage(page);
// //     const searchContainer = document.getElementById("search-container");
// //     if (searchContainer) {
// //       searchContainer.scrollIntoView({ behavior: "smooth" });
// //     }
// //   };

// //   // Filter and sort the data
// //   const getFilteredData = () => {
// //     let filteredData = data;

// //     const activeFilters = Object.entries(categoryFilters)
// //       .filter(([_, isActive]) => isActive)
// //       .map(([category]) => category);

// //     if (activeFilters.length > 0) {
// //       filteredData = filteredData.filter((item) =>
// //         activeFilters.includes(item.category)
// //       );
// //     }

// //     if (filter) {
// //       filteredData = filteredData.filter(
// //         (item) =>
// //           item.title.toLowerCase().includes(filter.toLowerCase()) ||
// //           item.category.toLowerCase().includes(filter.toLowerCase())
// //       );
// //     }

// //     switch (sortOption) {
// //       case "name":
// //         filteredData.sort((a, b) => a.title.localeCompare(b.title));
// //         break;
// //       case "priceLowHigh":
// //         filteredData.sort((a, b) => a.price - b.price);
// //         break;
// //       case "priceHighLow":
// //         filteredData.sort((a, b) => b.price - a.price);
// //         break;
// //       default:
// //         break;
// //     }

// //     return filteredData;
// //   };

// //   const filteredData = getFilteredData();
// //   const paginatedData = filteredData.slice(
// //     (currentPage - 1) * itemsPerPage,
// //     currentPage * itemsPerPage
// //   );

// //   if (loading) {
// //     return (
// //       <div className="flex justify-center items-center h-screen">
// //         <CircularProgress size={60} />
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="w-full min-h-[65vh] md:min-h-[60vh] lg:min-h-[70vh] dark:bg-black bg-gray-200">
// //       <Box sx={{ display: "flex", p: 2, flexDirection: { xs: "column", md: "row" } }}>
// //         {/* Sidebar for Filters */}
// //         <Box sx={{ width: { xs: "100%", md: "25%" }, px: 2 }}>
// //           <Typography variant="h6" className="dark:text-white text-black" marginBottom={2}>
// //             Filter by Category:
// //           </Typography>
// //           <FormGroup>
// //             {Array.from(new Set(data.map((item) => item.category))).map((category) => (
// //               <FormControlLabel
// //                 key={category}
// //                 control={
// //                   <Checkbox
// //                     checked={categoryFilters[category] || false}
// //                     onChange={(e) =>
// //                       setCategoryFilters({
// //                         ...categoryFilters,
// //                         [category]: e.target.checked,
// //                       })
// //                     }
// //                     name={category}
// //                     className="dark:text-white text-black"
// //                   />
// //                 }
// //                 label={
// //                   <Typography className="dark:text-white text-black">
// //                     {category.charAt(0).toUpperCase() + category.slice(1)}
// //                   </Typography>
// //                 }
// //               />
// //             ))}
// //           </FormGroup>
// //         </Box>

// //         {/* Main Content Area */}
// //         <Box sx={{ width: { xs: "100%", md: "75%" }, p: 2 }}>
// //           <Box id="search-container" sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
// //             {/* Search and Sort */}
// //             <TextField
// //               fullWidth
// //               label="Search by title, category..."
// //               value={filter}
// //               onChange={(e) => setFilter(e.target.value)}
// //               sx={{ bgcolor: "background.paper", borderRadius: 1 }}
// //             />
// //             <Select
// //               value={sortOption}
// //               onChange={(e) => setSortOption(e.target.value)}
// //               displayEmpty
// //               sx={{
// //                 ".MuiSelect-select": { bgcolor: "background.paper" },
// //                 width: { xs: "100%", sm: "auto" },
// //                 ml: 2,
// //                 borderRadius: 1,
// //               }}
// //               renderValue={(selected) => (selected ? selected : "Sort By")}
// //             >
// //               <MenuItem value="">Sort By</MenuItem>
// //               <MenuItem value="name">Name</MenuItem>
// //               <MenuItem value="priceLowHigh">Price: Low to High</MenuItem>
// //               <MenuItem value="priceHighLow">Price: High to Low</MenuItem>
// //             </Select>
// //           </Box>

// //           {/* Products Grid */}
// //           <Grid container spacing={3}>
// //             {paginatedData.map((item) => (
// //               <Grid item key={item._id} xs={12} sm={6} md={4}>
// //                 <div className="border rounded-md shadow-md overflow-hidden bg-white dark:bg-gray-800 flex flex-col items-center w-full transition-transform duration-300 hover:scale-105 hover:shadow-lg">
// //                   {/* Image Section (Triggers Modal) */}
// //                   <div
// //                     className="relative w-full h-[200px] bg-gray-200 cursor-pointer"
// //                     onClick={() => handleOpen(item)} // Open modal when image is clicked
// //                   >
// //                     <Image
// //                       src={urlFor(item.image).url()}
// //                       alt={item.title}
// //                       layout="fill"
// //                       objectFit="contain"
// //                       className="p-2"
// //                     />
// //                   </div>

// //                   {/* Item Details and Add to Cart Button */}
// //                   <div className="p-4 text-center">
// //                     <h2 className="font-semibold text-base truncate text-gray-900 dark:text-gray-100">
// //                       {item.title}
// //                     </h2>
// //                     <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold mt-2">
// //                       ${item.price.toFixed(2)}
// //                     </p>
// //                     {userId ? (
// //                       <button
// //                         onClick={() => toggleCartStatus(item._id)}
// //                         className={`relative py-2 px-4 mt-3 text-sm rounded-full font-bold overflow-hidden group ${
// //                           cartStatus[item._id]
// //                             ? "bg-gradient-to-r from-red-500 to-red-700 text-white"
// //                             : "bg-gradient-to-r from-blue-500 to-green-500 text-white"
// //                         }`}
// //                       >
// //                         <span className="absolute inset-0 transition-transform duration-300 transform scale-x-0 group-hover:scale-x-100 bg-white opacity-10"></span>
// //                         <span className="relative z-10">
// //                           {cartStatus[item._id]
// //                             ? "Remove from Cart"
// //                             : "Add to Cart"}
// //                         </span>
// //                       </button>
// //                     ) : (
// //                       <LoginLink>
// //                         <button className="py-2 px-4 mt-3 text-sm rounded-full font-bold bg-gradient-to-r from-blue-500 to-green-500 text-white">
// //                           Add to Cart
// //                         </button>
// //                       </LoginLink>
// //                     )}
// //                   </div>
// //                 </div>
// //               </Grid>
// //             ))}
// //           </Grid>

// //           {/* Pagination */}
// //           {paginatedData.length > 0 && (
// //             <Pagination
// //               count={Math.ceil(filteredData.length / itemsPerPage)}
// //               page={currentPage}
// //               onChange={handlePaginationChange}
// //               sx={{
// //                 mt: 6,
// //                 display: "flex",
// //                 justifyContent: "center",
// //                 "& .MuiPaginationItem-root": {
// //                   background: "linear-gradient(to right, #647dee, #7f53ac)",
// //                   color: "white",
// //                   borderRadius: "50%",
// //                   margin: "0 4px",
// //                   transition: "all 0.3s ease-in-out",
// //                   fontWeight: "bold",
// //                   boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
// //                 },
// //                 "& .MuiPaginationItem-root:hover": {
// //                   background: "linear-gradient(to right, #7f53ac, #647dee)",
// //                   transform: "scale(1.1)",
// //                   boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
// //                 },
// //                 "& .Mui-selected": {
// //                   background: "linear-gradient(to right, #4a90e2, #34d8ac)",
// //                   color: "white",
// //                   fontWeight: "bold",
// //                   border: "2px solid #ffffff",
// //                   boxShadow: "0 0 15px rgba(52, 216, 172, 0.8)",
// //                   transform: "scale(1.3)",
// //                 },
// //                 "& .MuiPaginationItem-ellipsis": {
// //                   color: "#b0bec5",
// //                 },
// //               }}
// //             />
// //           )}
// //         </Box>
// //       </Box>

// //       {/* Modal */}
// //       <StoreItemModal
// //         open={open}
// //         item={selectedItem}
// //         onClose={handleClose}
// //         toggleCartStatus={toggleCartStatus}
// //         cartStatus={cartStatus}
// //       />
// //     </div>
// //   );
// // };

// // export default StoreModal;






// // "use client";

// // import React, { useState, useEffect } from "react";
// // import {
// //   Box,
// //   Typography,
// //   Grid,
// //   TextField,
// //   Select,
// //   MenuItem,
// //   FormGroup,
// //   FormControlLabel,
// //   Checkbox,
// //   Pagination,
// //   CircularProgress,
// // } from "@mui/material"; // Material-UI
// // import { urlFor } from "@/sanity/lib/image";
// // import StoreItemModal from "./StoreItemModal";
// // import Image from "next/image";
// // import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";

// // /**
// //  * Displays a grid of store items with filtering, searching, sorting, and pagination.
// //  */
// // export default function StoreModal({ data, userId }) {
// //   const [filter, setFilter] = useState("");
// //   const [sortOption, setSortOption] = useState("");
// //   const [categoryFilters, setCategoryFilters] = useState({});
// //   const [open, setOpen] = useState(false);
// //   const [selectedItem, setSelectedItem] = useState(null);
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [cartStatus, setCartStatus] = useState({});
// //   const [loading, setLoading] = useState(true);

// //   const itemsPerPage = 12;

// //   /**
// //    * If user is not logged in, set all items to false.
// //    * Otherwise, check the cart for each item.
// //    */
// //   const initializeCartStatuses = async () => {
// //     if (!userId) {
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
// //             throw new Error(`Failed to check cart status for ${item._id}`);
// //           }
// //           const { exists } = await response.json();
// //           return { [item._id]: exists };
// //         })
// //       );
// //       const combinedStatuses = statuses.reduce((acc, status) => {
// //         return { ...acc, ...status };
// //       }, {});
// //       setCartStatus(combinedStatuses);
// //     } catch (error) {
// //       console.error("Error fetching cart statuses:", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     initializeCartStatuses();
// //   }, [userId, data]);

// //   /**
// //    * Add a product to cart. Also dispatch "cartUpdated".
// //    */
// //   const handleAddToCart = async (productId) => {
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
// //    * Remove a product from cart. Also dispatch "cartUpdated".
// //    */
// //   const handleRemoveFromCart = async (productId) => {
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
// //    * Toggle cart status for a product (add or remove).
// //    */
// //   const toggleCartStatus = (productId) => {
// //     if (!userId) return; // If not logged in, do nothing
// //     if (cartStatus[productId]) {
// //       handleRemoveFromCart(productId);
// //     } else {
// //       handleAddToCart(productId);
// //     }
// //   };

// //   const handleOpen = (item) => {
// //     setSelectedItem(item);
// //     setOpen(true);
// //   };
// //   const handleClose = () => {
// //     setOpen(false);
// //     setSelectedItem(null);
// //   };

// //   /**
// //    * Pagination
// //    */
// //   const handlePaginationChange = (event, page) => {
// //     setCurrentPage(page);
// //     const searchContainer = document.getElementById("search-container");
// //     if (searchContainer) {
// //       searchContainer.scrollIntoView({ behavior: "smooth" });
// //     }
// //   };

// //   /**
// //    * Filtering & Sorting
// //    */
// //   const getFilteredData = () => {
// //     let filteredData = data;

// //     // Category filters
// //     const activeFilters = Object.entries(categoryFilters)
// //       .filter(([_, isActive]) => isActive)
// //       .map(([category]) => category);
// //     if (activeFilters.length > 0) {
// //       filteredData = filteredData.filter((item) =>
// //         activeFilters.includes(item.category)
// //       );
// //     }

// //     // Search filter
// //     if (filter) {
// //       filteredData = filteredData.filter(
// //         (item) =>
// //           item.title.toLowerCase().includes(filter.toLowerCase()) ||
// //           item.category.toLowerCase().includes(filter.toLowerCase())
// //       );
// //     }

// //     // Sorting
// //     switch (sortOption) {
// //       case "name":
// //         filteredData.sort((a, b) => a.title.localeCompare(b.title));
// //         break;
// //       case "priceLowHigh":
// //         filteredData.sort((a, b) => a.price - b.price);
// //         break;
// //       case "priceHighLow":
// //         filteredData.sort((a, b) => b.price - a.price);
// //         break;
// //       default:
// //         // no sorting
// //         break;
// //     }

// //     return filteredData;
// //   };

// //   const filteredData = getFilteredData();
// //   const paginatedData = filteredData.slice(
// //     (currentPage - 1) * itemsPerPage,
// //     currentPage * itemsPerPage
// //   );

// //   if (loading) {
// //     return (
// //       <div className="flex justify-center items-center h-screen">
// //         <CircularProgress size={60} />
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="w-full min-h-[65vh] md:min-h-[60vh] lg:min-h-[70vh] dark:bg-black bg-gray-200">
// //       <Box sx={{ display: "flex", p: 2, flexDirection: { xs: "column", md: "row" } }}>
// //         {/* Sidebar Filters */}
// //         <Box sx={{ width: { xs: "100%", md: "25%" }, px: 2 }}>
// //           <Typography variant="h6" className="dark:text-white text-black" marginBottom={2}>
// //             Filter by Category:
// //           </Typography>
// //           <FormGroup>
// //             {Array.from(new Set(data.map((item) => item.category))).map((category) => (
// //               <FormControlLabel
// //                 key={category}
// //                 control={
// //                   <Checkbox
// //                     checked={!!categoryFilters[category]}
// //                     onChange={(e) =>
// //                       setCategoryFilters({
// //                         ...categoryFilters,
// //                         [category]: e.target.checked,
// //                       })
// //                     }
// //                     name={category}
// //                     className="dark:text-white text-black"
// //                   />
// //                 }
// //                 label={
// //                   <Typography className="dark:text-white text-black">
// //                     {category.charAt(0).toUpperCase() + category.slice(1)}
// //                   </Typography>
// //                 }
// //               />
// //             ))}
// //           </FormGroup>
// //         </Box>

// //         {/* Main Area */}
// //         <Box sx={{ width: { xs: "100%", md: "75%" }, p: 2 }}>
// //           <Box
// //             id="search-container"
// //             sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
// //           >
// //             {/* Search */}
// //             <TextField
// //               fullWidth
// //               label="Search by title, category..."
// //               value={filter}
// //               onChange={(e) => setFilter(e.target.value)}
// //               sx={{ bgcolor: "background.paper", borderRadius: 1 }}
// //             />
// //             {/* Sort */}
// //             <Select
// //               value={sortOption}
// //               onChange={(e) => setSortOption(e.target.value)}
// //               displayEmpty
// //               sx={{
// //                 ".MuiSelect-select": { bgcolor: "background.paper" },
// //                 width: { xs: "100%", sm: "auto" },
// //                 ml: 2,
// //                 borderRadius: 1,
// //               }}
// //               renderValue={(selected) => (selected ? selected : "Sort By")}
// //             >
// //               <MenuItem value="">Sort By</MenuItem>
// //               <MenuItem value="name">Name</MenuItem>
// //               <MenuItem value="priceLowHigh">Price: Low to High</MenuItem>
// //               <MenuItem value="priceHighLow">Price: High to Low</MenuItem>
// //             </Select>
// //           </Box>

// //           {/* Products Grid */}
// //           <Grid container spacing={3}>
// //             {paginatedData.map((item) => (
// //               <Grid item key={item._id} xs={12} sm={6} md={4}>
// //                 <div className="border rounded-md shadow-md overflow-hidden bg-white dark:bg-gray-800 flex flex-col items-center w-full transition-transform duration-300 hover:scale-105 hover:shadow-lg">
// //                   {/* Clickable Image to open modal */}
// //                   <div
// //                     className="relative w-full h-[200px] bg-gray-200 cursor-pointer"
// //                     onClick={() => handleOpen(item)}
// //                   >
// //                     <Image
// //                       src={urlFor(item.image).url()}
// //                       alt={item.title}
// //                       layout="fill"
// //                       objectFit="contain"
// //                       className="p-2"
// //                     />
// //                   </div>
// //                   {/* Item details and cart button */}
// //                   <div className="p-4 text-center">
// //                     <h2 className="font-semibold text-base truncate text-gray-900 dark:text-gray-100">
// //                       {item.title}
// //                     </h2>
// //                     <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold mt-2">
// //                       ${item.price.toFixed(2)}
// //                     </p>
// //                     {userId ? (
// //                       <button
// //                         onClick={() => toggleCartStatus(item._id)}
// //                         className={`relative py-2 px-4 mt-3 text-sm rounded-full font-bold overflow-hidden group ${
// //                           cartStatus[item._id]
// //                             ? "bg-gradient-to-r from-red-500 to-red-700 text-white"
// //                             : "bg-gradient-to-r from-blue-500 to-green-500 text-white"
// //                         }`}
// //                       >
// //                         <span className="absolute inset-0 transition-transform duration-300 transform scale-x-0 group-hover:scale-x-100 bg-white opacity-10"></span>
// //                         <span className="relative z-10">
// //                           {cartStatus[item._id] ? "Remove from Cart" : "Add to Cart"}
// //                         </span>
// //                       </button>
// //                     ) : (
// //                       <LoginLink>
// //                         <button className="py-2 px-4 mt-3 text-sm rounded-full font-bold bg-gradient-to-r from-blue-500 to-green-500 text-white">
// //                           Add to Cart
// //                         </button>
// //                       </LoginLink>
// //                     )}
// //                   </div>
// //                 </div>
// //               </Grid>
// //             ))}
// //           </Grid>

// //           {/* Pagination */}
// //           {paginatedData.length > 0 && (
// //             <Pagination
// //               count={Math.ceil(filteredData.length / itemsPerPage)}
// //               page={currentPage}
// //               onChange={handlePaginationChange}
// //               sx={{
// //                 mt: 6,
// //                 display: "flex",
// //                 justifyContent: "center",
// //                 "& .MuiPaginationItem-root": {
// //                   background: "linear-gradient(to right, #647dee, #7f53ac)",
// //                   color: "white",
// //                   borderRadius: "50%",
// //                   margin: "0 4px",
// //                   transition: "all 0.3s ease-in-out",
// //                   fontWeight: "bold",
// //                   boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
// //                 },
// //                 "& .MuiPaginationItem-root:hover": {
// //                   background: "linear-gradient(to right, #7f53ac, #647dee)",
// //                   transform: "scale(1.1)",
// //                   boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
// //                 },
// //                 "& .Mui-selected": {
// //                   background: "linear-gradient(to right, #4a90e2, #34d8ac)",
// //                   color: "white",
// //                   fontWeight: "bold",
// //                   border: "2px solid #ffffff",
// //                   boxShadow: "0 0 15px rgba(52, 216, 172, 0.8)",
// //                   transform: "scale(1.3)",
// //                 },
// //                 "& .MuiPaginationItem-ellipsis": {
// //                   color: "#b0bec5",
// //                 },
// //               }}
// //             />
// //           )}
// //         </Box>
// //       </Box>

// //       {/* Modal for item details */}
// //       <StoreItemModal
// //         open={open}
// //         item={selectedItem}
// //         onClose={handleClose}
// //         toggleCartStatus={toggleCartStatus}
// //         cartStatus={cartStatus}
// //       />
// //     </div>
// //   );
// // }







// // "use client";

// // import React, { useState, useEffect } from "react";
// // import {
// //   Box,
// //   Typography,
// //   Grid,
// //   TextField,
// //   Select,
// //   MenuItem,
// //   FormGroup,
// //   FormControlLabel,
// //   Checkbox,
// //   Pagination,
// //   CircularProgress,
// // } from "@mui/material"; // Material-UI
// // import { urlFor } from "@/sanity/lib/image";
// // import StoreItemModal from "./StoreItemModal";
// // import Image from "next/image";
// // import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";

// // /**
// //  * Displays a grid of store items with filtering, searching, sorting, and pagination.
// //  */
// // export default function StoreModal({ data, userId }) {
// //   const [filter, setFilter] = useState("");
// //   const [sortOption, setSortOption] = useState("");
// //   const [categoryFilters, setCategoryFilters] = useState({});
// //   const [open, setOpen] = useState(false);
// //   const [selectedItem, setSelectedItem] = useState(null);
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [cartStatus, setCartStatus] = useState({});
// //   const [loading, setLoading] = useState(true);

// //   const itemsPerPage = 12;

// //   /**
// //    * Fetch cart statuses in a single API call
// //    */
// //   const initializeCartStatuses = async () => {
// //     if (!userId) {
// //       // If user not logged in, default all items to "not in cart"
// //       const defaultStatuses = data.reduce((acc, item) => {
// //         acc[item._id] = false;
// //         return acc;
// //       }, {});
// //       setCartStatus(defaultStatuses);
// //       setLoading(false);
// //       return;
// //     }

// //     try {
// //       // Fetch cart statuses for all products in a single batch
// //       const productIds = data.map((item) => item._id);
// //       const response = await fetch("/api/checkcart", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ userId, productIds }),
// //       });

// //       if (!response.ok) {
// //         throw new Error("Failed to fetch cart statuses.");
// //       }

// //       const statuses = await response.json();
// //       setCartStatus(statuses); // Update cartStatus state
// //     } catch (error) {
// //       console.error("Error fetching cart statuses:", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     initializeCartStatuses();
// //   }, [userId, data]);

// //   /**
// //    * Add a product to cart
// //    */
// //   const handleAddToCart = async (productId) => {
// //     try {
// //       const response = await fetch("/api/addcart", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ userId, productId }),
// //       });

// //       if (!response.ok) {
// //         throw new Error("Failed to add item to cart.");
// //       }

// //       setCartStatus((prev) => ({ ...prev, [productId]: true }));

// //       // Dispatch cartUpdated event
// //       if (typeof window !== "undefined") {
// //         window.dispatchEvent(new Event("cartUpdated"));
// //       }
// //     } catch (error) {
// //       console.error("Error adding item to cart:", error);
// //     }
// //   };

// //   /**
// //    * Remove a product from cart
// //    */
// //   const handleRemoveFromCart = async (productId) => {
// //     try {
// //       const response = await fetch("/api/removecart", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ userId, productId }),
// //       });

// //       if (!response.ok) {
// //         throw new Error("Failed to remove item from cart.");
// //       }

// //       setCartStatus((prev) => ({ ...prev, [productId]: false }));

// //       // Dispatch cartUpdated event
// //       if (typeof window !== "undefined") {
// //         window.dispatchEvent(new Event("cartUpdated"));
// //       }
// //     } catch (error) {
// //       console.error("Error removing item from cart:", error);
// //     }
// //   };

// //   /**
// //    * Toggle cart status for a product
// //    */
// //   const toggleCartStatus = (productId) => {
// //     if (!userId) return; // Do nothing if user not logged in
// //     if (cartStatus[productId]) {
// //       handleRemoveFromCart(productId);
// //     } else {
// //       handleAddToCart(productId);
// //     }
// //   };

// //   /**
// //    * Pagination handler
// //    */
// //   const handlePaginationChange = (event, page) => {
// //     setCurrentPage(page);
// //     const searchContainer = document.getElementById("search-container");
// //     if (searchContainer) {
// //       searchContainer.scrollIntoView({ behavior: "smooth" });
// //     }
// //   };

// //   /**
// //    * Get filtered, sorted, and paginated data
// //    */
// //   const getFilteredData = () => {
// //     let filteredData = data;

// //     // Apply category filters
// //     const activeFilters = Object.entries(categoryFilters)
// //       .filter(([_, isActive]) => isActive)
// //       .map(([category]) => category);

// //     if (activeFilters.length > 0) {
// //       filteredData = filteredData.filter((item) =>
// //         activeFilters.includes(item.category)
// //       );
// //     }

// //     // Apply search filter
// //     if (filter) {
// //       filteredData = filteredData.filter(
// //         (item) =>
// //           item.title.toLowerCase().includes(filter.toLowerCase()) ||
// //           item.category.toLowerCase().includes(filter.toLowerCase())
// //       );
// //     }

// //     // Apply sorting
// //     switch (sortOption) {
// //       case "name":
// //         filteredData.sort((a, b) => a.title.localeCompare(b.title));
// //         break;
// //       case "priceLowHigh":
// //         filteredData.sort((a, b) => a.price - b.price);
// //         break;
// //       case "priceHighLow":
// //         filteredData.sort((a, b) => b.price - a.price);
// //         break;
// //       default:
// //         break;
// //     }

// //     return filteredData;
// //   };

// //   const filteredData = getFilteredData();
// //   const paginatedData = filteredData.slice(
// //     (currentPage - 1) * itemsPerPage,
// //     currentPage * itemsPerPage
// //   );

// //   if (loading) {
// //     return (
// //       <div className="flex justify-center items-center h-screen">
// //         <CircularProgress size={60} />
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="w-full min-h-[65vh] md:min-h-[60vh] lg:min-h-[70vh] dark:bg-black bg-gray-200">
// //       <Box sx={{ display: "flex", p: 2, flexDirection: { xs: "column", md: "row" } }}>
// //         {/* Filters */}
// //         <Box sx={{ width: { xs: "100%", md: "25%" }, px: 2 }}>
// //           <Typography variant="h6" className="dark:text-white text-black" marginBottom={2}>
// //             Filter by Category:
// //           </Typography>
// //           <FormGroup>
// //             {Array.from(new Set(data.map((item) => item.category))).map((category) => (
// //               <FormControlLabel
// //                 key={category}
// //                 control={
// //                   <Checkbox
// //                     checked={!!categoryFilters[category]}
// //                     onChange={(e) =>
// //                       setCategoryFilters({
// //                         ...categoryFilters,
// //                         [category]: e.target.checked,
// //                       })
// //                     }
// //                     name={category}
// //                   />
// //                 }
// //                 label={category.charAt(0).toUpperCase() + category.slice(1)}
// //               />
// //             ))}
// //           </FormGroup>
// //         </Box>

// //         {/* Main content */}
// //         <Box sx={{ width: { xs: "100%", md: "75%" }, p: 2 }}>
// //           <Box
// //             id="search-container"
// //             sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
// //           >
// //             <TextField
// //               fullWidth
// //               label="Search by title, category..."
// //               value={filter}
// //               onChange={(e) => setFilter(e.target.value)}
// //             />
// //             <Select
// //               value={sortOption}
// //               onChange={(e) => setSortOption(e.target.value)}
// //               displayEmpty
// //               sx={{ ml: 2 }}
// //               renderValue={(selected) => (selected ? selected : "Sort By")}
// //             >
// //               <MenuItem value="">Sort By</MenuItem>
// //               <MenuItem value="name">Name</MenuItem>
// //               <MenuItem value="priceLowHigh">Price: Low to High</MenuItem>
// //               <MenuItem value="priceHighLow">Price: High to Low</MenuItem>
// //             </Select>
// //           </Box>

// //           {/* Product Grid */}
// //           <Grid container spacing={3}>
// //             {paginatedData.map((item) => (
// //               <Grid item key={item._id} xs={12} sm={6} md={4}>
// //                 <div className="border rounded-md shadow-md overflow-hidden bg-white dark:bg-gray-800 flex flex-col items-center w-full hover:scale-105">
// //                   <div
// //                     className="relative w-full h-[200px] bg-gray-200 cursor-pointer"
// //                     onClick={() => setOpen(true)}
// //                   >
// //                     <Image
// //                       src={urlFor(item.image).url()}
// //                       alt={item.title}
// //                       layout="fill"
// //                       objectFit="contain"
// //                       className="p-2"
// //                     />
// //                   </div>
// //                   <div className="p-4 text-center">
// //                     <h2 className="truncate">{item.title}</h2>
// //                     <p>${item.price.toFixed(2)}</p>
// //                     {userId ? (
// //                       <button
// //                         onClick={() => toggleCartStatus(item._id)}
// //                         className={`py-2 px-4 ${
// //                           cartStatus[item._id] ? "bg-red-500" : "bg-green-500"
// //                         }`}
// //                       >
// //                         {cartStatus[item._id] ? "Remove" : "Add"}
// //                       </button>
// //                     ) : (
// //                       <LoginLink>
// //                         <button className="py-2 px-4 bg-blue-500">Add</button>
// //                       </LoginLink>
// //                     )}
// //                   </div>
// //                 </div>
// //               </Grid>
// //             ))}
// //           </Grid>

// //           {/* Pagination */}
// //           <Pagination
// //             count={Math.ceil(filteredData.length / itemsPerPage)}
// //             page={currentPage}
// //             onChange={handlePaginationChange}
// //             sx={{ mt: 6 }}
// //           />
// //         </Box>
// //       </Box>

// //       {/* Modal */}
// //       <StoreItemModal
// //         open={open}
// //         item={selectedItem}
// //         onClose={() => setOpen(false)}
// //         toggleCartStatus={toggleCartStatus}
// //         cartStatus={cartStatus}
// //       />
// //     </div>
// //   );
// // }








// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   Grid,
//   TextField,
//   Select,
//   MenuItem,
//   FormGroup,
//   FormControlLabel,
//   Checkbox,
//   Pagination,
//   CircularProgress,
// } from "@mui/material"; // Material-UI
// import { urlFor } from "@/sanity/lib/image";
// import StoreItemModal from "./StoreItemModal";
// import Image from "next/image";
// import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";

// export default function StoreModal({ data, userId }) {
//   const [filter, setFilter] = useState("");
//   const [sortOption, setSortOption] = useState("");
//   const [categoryFilters, setCategoryFilters] = useState({});
//   const [open, setOpen] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [cartStatus, setCartStatus] = useState({});
//   const [loading, setLoading] = useState(true);

//   const itemsPerPage = 12;

//   const initializeCartStatuses = async () => {
//     if (!userId) {
//       const defaultStatuses = data.reduce((acc, item) => {
//         acc[item._id] = false;
//         return acc;
//       }, {});
//       setCartStatus(defaultStatuses);
//       setLoading(false);
//       return;
//     }

//     try {
//       const productIds = data.map((item) => item._id);
//       const response = await fetch("/api/checkcart", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId, productIds }),
//       });

//       if (!response.ok) throw new Error("Failed to fetch cart statuses.");

//       const statuses = await response.json();
//       setCartStatus(statuses);
//     } catch (error) {
//       console.error("Error fetching cart statuses:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     initializeCartStatuses();
//   }, [userId, data]);

//   const handleAddToCart = async (productId) => {
//     try {
//       const response = await fetch("/api/addcart", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId, productId }),
//       });

//       if (!response.ok) throw new Error("Failed to add item to cart.");

//       setCartStatus((prev) => ({ ...prev, [productId]: true }));
//       if (typeof window !== "undefined") window.dispatchEvent(new Event("cartUpdated"));
//     } catch (error) {
//       console.error("Error adding item to cart:", error);
//     }
//   };

//   const handleRemoveFromCart = async (productId) => {
//     try {
//       const response = await fetch("/api/removecart", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId, productId }),
//       });

//       if (!response.ok) throw new Error("Failed to remove item from cart.");

//       setCartStatus((prev) => ({ ...prev, [productId]: false }));
//       if (typeof window !== "undefined") window.dispatchEvent(new Event("cartUpdated"));
//     } catch (error) {
//       console.error("Error removing item from cart:", error);
//     }
//   };

//   const toggleCartStatus = (productId) => {
//     if (!userId) return;
//     if (cartStatus[productId]) handleRemoveFromCart(productId);
//     else handleAddToCart(productId);
//   };

//   const handlePaginationChange = (event, page) => {
//     setCurrentPage(page);
//     const searchContainer = document.getElementById("search-container");
//     if (searchContainer) searchContainer.scrollIntoView({ behavior: "smooth" });
//   };

//   const handleOpenModal = (item) => {
//     setSelectedItem(item);
//     setOpen(true);
//   };

//   const handleCloseModal = () => {
//     setOpen(false);
//     setSelectedItem(null);
//   };

//   const getFilteredData = () => {
//     let filteredData = data;

//     const activeFilters = Object.entries(categoryFilters)
//       .filter(([_, isActive]) => isActive)
//       .map(([category]) => category);

//     if (activeFilters.length > 0) {
//       filteredData = filteredData.filter((item) =>
//         activeFilters.includes(item.category)
//       );
//     }

//     if (filter) {
//       filteredData = filteredData.filter(
//         (item) =>
//           item.title.toLowerCase().includes(filter.toLowerCase()) ||
//           item.category.toLowerCase().includes(filter.toLowerCase())
//       );
//     }

//     switch (sortOption) {
//       case "name":
//         filteredData.sort((a, b) => a.title.localeCompare(b.title));
//         break;
//       case "priceLowHigh":
//         filteredData.sort((a, b) => a.price - b.price);
//         break;
//       case "priceHighLow":
//         filteredData.sort((a, b) => b.price - a.price);
//         break;
//       default:
//         break;
//     }

//     return filteredData;
//   };

//   const filteredData = getFilteredData();
//   const paginatedData = filteredData.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <CircularProgress size={60} />
//       </div>
//     );
//   }

//   return (
//     <div className="w-full min-h-[65vh] md:min-h-[60vh] lg:min-h-[70vh] dark:bg-black bg-gray-200">
//       <Box sx={{ display: "flex", p: 2, flexDirection: { xs: "column", md: "row" } }}>
//         {/* Filters */}
//         <Box sx={{ width: { xs: "100%", md: "25%" }, px: 2 }}>
//           <Typography variant="h6" marginBottom={2}>
//             Filter by Category:
//           </Typography>
//           <FormGroup>
//             {Array.from(new Set(data.map((item) => item.category))).map((category) => (
//               <FormControlLabel
//                 key={category}
//                 control={
//                   <Checkbox
//                     checked={!!categoryFilters[category]}
//                     onChange={(e) =>
//                       setCategoryFilters({
//                         ...categoryFilters,
//                         [category]: e.target.checked,
//                       })
//                     }
//                   />
//                 }
//                 label={category.charAt(0).toUpperCase() + category.slice(1)}
//               />
//             ))}
//           </FormGroup>
//         </Box>

//         {/* Main content */}
//         <Box sx={{ width: { xs: "100%", md: "75%" }, p: 2 }}>
//           <Box
//             id="search-container"
//             sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
//           >
//             <TextField
//               fullWidth
//               label="Search by title, category..."
//               value={filter}
//               onChange={(e) => setFilter(e.target.value)}
//             />
//             <Select
//               value={sortOption}
//               onChange={(e) => setSortOption(e.target.value)}
//               displayEmpty
//               sx={{ ml: 2 }}
//             >
//               <MenuItem value="">Sort By</MenuItem>
//               <MenuItem value="name">Name</MenuItem>
//               <MenuItem value="priceLowHigh">Price: Low to High</MenuItem>
//               <MenuItem value="priceHighLow">Price: High to Low</MenuItem>
//             </Select>
//           </Box>

//           {/* Product Grid */}
//           <Grid container spacing={3}>
//             {paginatedData.map((item) => (
//               <Grid item key={item._id} xs={12} sm={6} md={4}>
//                 <div
//                   className="border rounded-md shadow-md overflow-hidden bg-white dark:bg-gray-800 flex flex-col items-center w-full hover:scale-105"
//                   onClick={() => handleOpenModal(item)}
//                 >
//                   <div className="relative w-full h-[200px] bg-gray-200 cursor-pointer">
//                     <Image
//                       src={urlFor(item.image).url()}
//                       alt={item.title}
//                       layout="fill"
//                       objectFit="contain"
//                       className="p-2"
//                     />
//                   </div>
//                   <div className="p-4 text-center">
//                     <h2>{item.title}</h2>
//                     <p>${item.price.toFixed(2)}</p>
//                   </div>
//                 </div>
//               </Grid>
//             ))}
//           </Grid>

//           {/* Pagination */}
//           <Pagination
//             count={Math.ceil(filteredData.length / itemsPerPage)}
//             page={currentPage}
//             onChange={handlePaginationChange}
//             sx={{ mt: 6 }}
//           />
//         </Box>
//       </Box>

//       {/* Modal */}
//       <StoreItemModal
//         open={open}
//         item={selectedItem}
//         onClose={handleCloseModal}
//         toggleCartStatus={toggleCartStatus}
//         cartStatus={cartStatus}
//       />
//     </div>
//   );
// }




"use client"; // Indicates this component runs on the client-side

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Pagination,
  CircularProgress,
} from "@mui/material"; // Material-UI components
import { urlFor } from "@/sanity/lib/image"; // Sanity helper for image URLs
import StoreItemModal from "./StoreItemModal"; // Modal component for item details
import Image from "next/image"; // Next.js image optimization
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components"; // Authentication

/**
 * Displays a paginated, filterable, and searchable product grid with modal functionality.
 */
export default function StoreModal({ data, userId }) {
  const [filter, setFilter] = useState(""); // Search filter
  const [sortOption, setSortOption] = useState(""); // Sorting options
  const [categoryFilters, setCategoryFilters] = useState({}); // Category-based filters
  const [open, setOpen] = useState(false); // Modal open state
  const [selectedItem, setSelectedItem] = useState(null); // Selected item for modal
  const [currentPage, setCurrentPage] = useState(1); // Current pagination page
  const [cartStatus, setCartStatus] = useState({}); // Tracks cart statuses for items
  const [loading, setLoading] = useState(true); // Loading state for fetching cart statuses

  const itemsPerPage = 12; // Number of items per page

  /**
   * Fetch cart statuses for all items in a single API call
   */
  const initializeCartStatuses = async () => {
    if (!userId) {
      // If user is not logged in, default all items to "not in cart"
      const defaultStatuses = data.reduce((acc, item) => {
        acc[item._id] = false;
        return acc;
      }, {});
      setCartStatus(defaultStatuses);
      setLoading(false);
      return;
    }

    try {
      const productIds = data.map((item) => item._id); // Extract product IDs
      const response = await fetch("/api/checkcart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productIds }),
      });

      if (!response.ok) throw new Error("Failed to fetch cart statuses.");

      const statuses = await response.json();
      setCartStatus(statuses); // Set cart statuses
    } catch (error) {
      console.error("Error fetching cart statuses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeCartStatuses(); // Initialize cart statuses on load
  }, [userId, data]);

  /**
   * Add a product to the cart
   */
  const handleAddToCart = async (productId) => {
    try {
      const response = await fetch("/api/addcart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId }),
      });

      if (!response.ok) throw new Error("Failed to add item to cart.");

      setCartStatus((prev) => ({ ...prev, [productId]: true }));
      if (typeof window !== "undefined") window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  /**
   * Remove a product from the cart
   */
  const handleRemoveFromCart = async (productId) => {
    try {
      const response = await fetch("/api/removecart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId }),
      });

      if (!response.ok) throw new Error("Failed to remove item from cart.");

      setCartStatus((prev) => ({ ...prev, [productId]: false }));
      if (typeof window !== "undefined") window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  /**
   * Toggle cart status for a product
   */
  const toggleCartStatus = (productId) => {
    if (!userId) return;
    if (cartStatus[productId]) handleRemoveFromCart(productId);
    else handleAddToCart(productId);
  };

  /**
   * Handle pagination change
   */
  const handlePaginationChange = (event, page) => {
    setCurrentPage(page);
    const searchContainer = document.getElementById("search-container");
    if (searchContainer) searchContainer.scrollIntoView({ behavior: "smooth" });
  };

  /**
   * Open the modal and set the selected item
   */
  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setOpen(true);
  };

  /**
   * Close the modal and reset the selected item
   */
  const handleCloseModal = () => {
    setOpen(false);
    setSelectedItem(null);
  };

  /**
   * Apply filters, sorting, and pagination to the data
   */
  const getFilteredData = () => {
    let filteredData = data;

    // Apply category filters
    const activeFilters = Object.entries(categoryFilters)
      .filter(([_, isActive]) => isActive)
      .map(([category]) => category);

    if (activeFilters.length > 0) {
      filteredData = filteredData.filter((item) =>
        activeFilters.includes(item.category)
      );
    }

    // Apply search filter
    if (filter) {
      filteredData = filteredData.filter(
        (item) =>
          item.title.toLowerCase().includes(filter.toLowerCase()) ||
          item.category.toLowerCase().includes(filter.toLowerCase())
      );
    }

    // Apply sorting
    switch (sortOption) {
      case "name":
        filteredData.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "priceLowHigh":
        filteredData.sort((a, b) => a.price - b.price);
        break;
      case "priceHighLow":
        filteredData.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    return filteredData;
  };

  const filteredData = getFilteredData();
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress size={60} />
      </div>
    );
  }

  return (
    <div className="w-full min-h-[65vh] md:min-h-[60vh] lg:min-h-[70vh] dark:bg-black bg-gray-200">
      <Box sx={{ display: "flex", p: 2, flexDirection: { xs: "column", md: "row" } }}>
        {/* Sidebar Filters */}
        <Box sx={{ width: { xs: "100%", md: "25%" }, px: 2 }}>
          <Typography variant="h6" className="dark:text-white text-black" marginBottom={2}>
            Filter by Category:
          </Typography>
          <FormGroup>
            {Array.from(new Set(data.map((item) => item.category))).map((category) => (
              <FormControlLabel
                key={category}
                control={
                  <Checkbox
                    checked={!!categoryFilters[category]}
                    onChange={(e) =>
                      setCategoryFilters({
                        ...categoryFilters,
                        [category]: e.target.checked,
                      })
                    }
                    name={category}
                    className="dark:text-white text-black"
                  />
                }
                label={
                  <Typography className="dark:text-white text-black">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Typography>
                }
              />
            ))}
          </FormGroup>
        </Box>

        {/* Main Area */}
        <Box sx={{ width: { xs: "100%", md: "75%" }, p: 2 }}>
          <Box
            id="search-container"
            sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
          >
            {/* Search */}
            <TextField
              fullWidth
              label="Search by title, category..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              sx={{ bgcolor: "background.paper", borderRadius: 1 }}
            />
            {/* Sort */}
            <Select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              displayEmpty
              sx={{
                ".MuiSelect-select": { bgcolor: "background.paper" },
                width: { xs: "100%", sm: "auto" },
                ml: 2,
                borderRadius: 1,
              }}
              renderValue={(selected) => (selected ? selected : "Sort By")}
            >
              <MenuItem value="">Sort By</MenuItem>
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="priceLowHigh">Price: Low to High</MenuItem>
              <MenuItem value="priceHighLow">Price: High to Low</MenuItem>
            </Select>
          </Box>

          {/* Products Grid */}
          <Grid container spacing={3}>
            {paginatedData.map((item) => (
              <Grid item key={item._id} xs={12} sm={6} md={4}>
                <div
                  className="border rounded-md shadow-md overflow-hidden bg-white dark:bg-gray-800 flex flex-col items-center w-full transition-transform duration-300 hover:scale-105 hover:shadow-lg"
                  onClick={() => handleOpenModal(item)}
                >
                  <div className="relative w-full h-[200px] bg-gray-200 cursor-pointer">
                    <Image
                      src={urlFor(item.image).url()}
                      alt={item.title}
                      layout="fill"
                      objectFit="contain"
                      className="p-2"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h2 className="font-semibold text-base truncate text-gray-900 dark:text-gray-100">
                      {item.title}
                    </h2>
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold mt-2">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {paginatedData.length > 0 && (
            <Pagination
              count={Math.ceil(filteredData.length / itemsPerPage)}
              page={currentPage}
              onChange={handlePaginationChange}
              sx={{
                mt: 6,
                display: "flex",
                justifyContent: "center",
                "& .MuiPaginationItem-root": {
                  background: "linear-gradient(to right, #647dee, #7f53ac)",
                  color: "white",
                  borderRadius: "50%",
                  margin: "0 4px",
                  transition: "all 0.3s ease-in-out",
                  fontWeight: "bold",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                },
                "& .MuiPaginationItem-root:hover": {
                  background: "linear-gradient(to right, #7f53ac, #647dee)",
                  transform: "scale(1.1)",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                },
                "& .Mui-selected": {
                  background: "linear-gradient(to right, #4a90e2, #34d8ac)",
                  color: "white",
                  fontWeight: "bold",
                  border: "2px solid #ffffff",
                  boxShadow: "0 0 15px rgba(52, 216, 172, 0.8)",
                  transform: "scale(1.3)",
                },
                "& .MuiPaginationItem-ellipsis": {
                  color: "#b0bec5",
                },
              }}
            />
          )}
        </Box>
      </Box>

      {/* Modal for item details */}
      <StoreItemModal
        open={open}
        item={selectedItem}
        onClose={handleCloseModal}
        toggleCartStatus={toggleCartStatus}
        cartStatus={cartStatus}
      />
    </div>
  );
}