// "use client";

// import { SavedItemsContext } from "@/context/SavedItems";
// import { client } from "@/sanity/lib/client";
// import {
//   CircularProgress,
//   Pagination,
//   Typography,
//   Box,
//   Select,
//   MenuItem,
//   TextField
// } from "@mui/material";
// import { useContext, useEffect, useMemo, useState } from "react";
// import { Button } from "./ui/button";
// import { useTheme } from "@mui/material/styles";
// import Image from "next/image";
// import { urlFor } from "@/sanity/lib/image";

// export default function CartData() {
//   const { savedItems, updateItemQuantity, removeItem } =
//     useContext(SavedItemsContext);
//   const [cartItems, setCartItems] = useState([]);
//   const [totalItems, setTotalItems] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 6;

//   const [filter, setFilter] = useState("");
//   const [sortOption, setSortOption] = useState("");
//   const [selectedCategories, setSelectedCategories] = useState([]);

//   const theme = useTheme();

//   const capitalize = (str) => {
//     if (!str) return "Unknown";

//     return str.charAt(0).toUpperCase() + str.slice(1);
//   };

//   useEffect(() => {
//     async function fetchCartItems() {
//       try {
//         const savedIds = savedItems?.map((item) => item._id);
//         if (!savedIds.length) {
//           setCartItems([]);
//           setTotalItems(0);
//           setLoading(false);
//           return;
//         }

//         const query = `
//                 *[_type in ["storeProducts", "banner", "featuredProducts"] && _id in $ids && defined(category) && category != ""]{
//                 _id, 
//                 title,
//                 category,
//                 "current_slug":slug.current,
//                 image, 
//                 description, 
//                 price, 
//                 inventory
//                 }`;

//         const docs = await client.fetch(query, { ids: savedIds });

//         const mergedItems = docs.map((doc) => {
//           const savedItem = savedItems.find((item) => item._id === doc._id);
//           return {
//             ...doc,
//             quantity: savedItem?.quantity || 1,
//           };
//         });
//         setCartItems(mergedItems);

//         const totalQty = mergedItems.reduce(
//           (sum, item) => sum + item.quantity,
//           0
//         );
//         setTotalItems(totalQty);
//       } catch (error) {
//         console.error("Error fetching cart items:", error);
//         setCartItems([]);
//         setTotalItems(0);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchCartItems();
//   }, [savedItems]);

//   const handleQuantityChange = (productId, increment) => {
//     updateItemQuantity(productId, increment);
//     setCurrentPage(1);
//   };

//   const handleRemoveItem = (productId) => {
//     removeItem(productId);
//     setCurrentPage(1);
//   };

//   const handleCategoryToggle = (category) => {
//     if (selectedCategories.includes(category)) {
//       setSelectedCategories(
//         selectedCategories.filter((cat) => cat !== category)
//       );
//     } else {
//       setSelectedCategories([...selectedCategories, category]);
//     }
//     setCurrentPage(1);
//   };

//   const calculateTotal = () => {
//     return cartItems.reduce(
//       (sum, item) => sum + (item.price || 0) * item.quantity,
//       0
//     );
//   };

//   const getFilteredData = () => {
//     let filteredData = cartItems;

//     if (selectedCategories.length > 0) {
//       filteredData = filteredData.filter((item) =>
//         selectedCategories.includes(item.category)
//       );
//     }

//     if (filter) {
//       const lowerCaseFilter = filter.toLowerCase();
//       filteredData = filteredData.filter(
//         (item) =>
//           (item.title && item.title.toLowerCase().includes(lowerCaseFilter)) ||
//           (item.category &&
//             item.category.toLowerCase().includes(lowerCaseFilter))
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
//     }
//     return filteredData;
//   };

//   const filteredData = useMemo(
//     () => getFilteredData(),
//     [cartItems, filter, sortOption, selectedCategories]
//   );

//   const paginatedItems = filteredData.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const handlePaginationChange = (event, page) => {
//     setCurrentPage(page);
//     const searchContainer = document.getElementById("search-container");
//     if (searchContainer) {
//       searchContainer.scrollIntoView({ behavior: "smooth" });
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <CircularProgress size={60} />
//       </div>
//     );
//   }

//   if (!cartItems.length) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <p className="text-lg font-semibold text-gray-700">
//           Your Cart is Empty
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full h-full dark:bg-black bg-gray-200">
//       <div className="container mx-auto px-4 py-8 pt-[12vh]">
//         <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-10">
//           Your Cart
//         </h1>
//         <div className="flex justify-between items-center bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
//           <div>
//             <p className="text-xl font-bold text-gray-900 dark:text-white">
//               Cart Total: ${calculateTotal().toFixed(2)}
//             </p>
//             <p className="text-md text-gray-700 dark:text-gray-300 mt-1">
//               Total Items: <span className="font-bold">{totalItems}</span>
//             </p>
//           </div>
//           <button className="bg-gradient-to-r from-blue-500 to-green-500 text-white py-2 px-4 rounded-lg shadow hover:from-blue-600 hover:to-green-600 transition">
//             Proceed to Checkout
//           </button>
//         </div>
//         {cartItems.length > 6 && (
//           <div className="mb-6">
//             <Box
//               id="search-container"
//               sx={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 mb: 4,
//                 flexDirection: { xs: "column", sm: "row" },
//               }}
//             >
//               {/* Search */}
//               <TextField
//                 fullWidth
//                 label="Search by title, category..."
//                 value={filter}
//                 onChange={(e) => setFilter(e.target.value)}
//                 sx={{
//                   bgcolor: "background.paper",
//                   borderRadius: 1,
//                   mb: { xs: 2, sm: 0 },
//                   mr: { sm: 2 },
//                 }}
//               />
//               {/* Sort */}
//               <Select
//                 value={sortOption}
//                 onChange={(e) => setSortOption(e.target.value)}
//                 displayEmpty
//                 sx={{
//                   ".MuiSelect-select": { bgcolor: "background.paper" },
//                   width: { xs: "100%", sm: "auto" },
//                   borderRadius: 1,
//                 }}
//                 renderValue={(selected) => (selected ? selected : "Sort By")}
//               >
//                 <MenuItem value="">Sort By</MenuItem>
//                 <MenuItem value="name">Name</MenuItem>
//                 <MenuItem value="priceLowHigh">Price: Low to High</MenuItem>
//                 <MenuItem value="priceHighLow">Price: High to Low</MenuItem>
//               </Select>
//             </Box>
//             <Box sx={{ width: "100%", px: 2, mb: 4 }}>
//               <div className="flex flex-wrap justify-center gap-2">
//                 {Array.from(new Set(cartItems.map((item) => item.category)))
//                   .filter((category) => category)
//                   .map((category) => (
//                     <Button
//                       key={category}
//                       onClick={() => handleCategoryToggle(category)}
//                       className={`capitalize rounded-full px-4 py-2 font-bold transition ${
//                         selectedCategories.includes(category)
//                           ? "bg-gradient-to-r from-teal-400 to-teal-600 text-white"
//                           : theme.palette.mode === "dark"
//                             ? "bg-gradient-to-r from-gray-700 to-gray-900 text-white"
//                             : "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700"
//                       }`}
//                       aria-pressed={selectedCategories.includes(category)}
//                     >
//                       {capitalize(category)}
//                     </Button>
//                   ))}
//               </div>
//             </Box>
//           </div>
//         )}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {paginatedItems.map((item) => (
//             <div
//               key={item._id}
//               className="border-2 border-gray-300 dark:border-gray-700 rounded-lg shadow-md bg-white dark:bg-gray-800 flex flex-col"
//             >
//               <div className="relative w-full h-[200px] bg-gray-200">
//                 {item.image && (
//                   <Image
//                     src={urlFor(item.image).url()}
//                     alt={item.title}
//                     layout="fill"
//                     objectFit="contain"
//                     className="p-2"
//                   />
//                 )}
//               </div>
//               <div className="p-4 flex flex-col flex-grow">
//                 <Typography
//                   variant="h6"
//                   className="text-lg font-semibold text-gray-900 dark:text-white truncate"
//                 >
//                   {item.title}
//                 </Typography>
//                 <Typography
//                   variant="body2"
//                   className="text-gray-700 dark:text-gray-300 mt-2 flex items-center gap-2"
//                 >
//                   Quantity:
//                   <button
//                     onClick={() => handleQuantityChange(item._id, false)}
//                     className="px-2 py-1 bg-gradient-to-r from-teal-400 to-teal-600 text-white font-semibold rounded-full transition disabled:opacity-50"
//                     disabled={item.quantity <= 1}
//                   >
//                     -
//                   </button>
//                   <span className="font-semibold">{item.quantity}</span>
//                   <button
//                     onClick={()=>handleQuantityChange(item._id, true)}
//                     className="px-2 py-1 bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold rounded-full transition disabled:opacity-50"
//                     disabled={item.inventory && item.quantity >= item.inventory}
//                   >
//                     +
//                   </button>
//                 </Typography>
//                 <Typography
//                   variant="body1"
//                   className="text-gray-700 dark:text-gray-300 mt-2"
//                 >
//                   Total: $
//                   {item.price && (item.price * item.quantity).toFixed(2)}
//                 </Typography>
//                 <button
//                   onClick={() => handleRemoveItem(item._id)}
//                   className="mt-4 bg-gradient-to-r from-red-700 to-red-700 text-white px-3 py-2 rounded-full shadow self-end hover:scale-105 transition"
//                 >
//                   Remove
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//         {filteredData.length > itemsPerPage && (
//           <div className="mt-8 flex justify-center">
//             <Pagination
//               count={Math.ceil(filteredData.length / itemsPerPage)}
//               page={currentPage}
//               onChange={handlePaginationChange}
//               sx={{
//                 "& .MuiPaginationItem-root": {
//                   background: "linear-gradient(to right, #647dee, #7f53ac)",
//                   color: "white",
//                   borderRadius: "50%",
//                   margin: "0 4px",
//                   transition: "all 0.3s ease-in-out",
//                   fontWeight: "bold",
//                   boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
//                 },
//                 "& .MuiPaginationItem-root:hover": {
//                   background: "linear-gradient(to right, #7f53ac, #647dee)",
//                   transform: "scale(1.1)",
//                   boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
//                 },
//                 "& .Mui-selected": {
//                   background: "linear-gradient(to right, #4a90e2, #34d8ac)",
//                   color: "white",
//                   fontWeight: "bold",
//                   border: "2px solid #ffffff",
//                   boxShadow: "0 0 15px rgba(52, 216, 172, 0.8)",
//                   transform: "scale(1.3)",
//                 },
//                 "& .MuiPaginationItem-ellipsis": {
//                   color: "#b0bec5",
//                 },
//               }}
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }









"use client";

import { SavedItemsContext } from "@/context/SavedItems";
import { client } from "@/sanity/lib/client";
import {
  CircularProgress,
  Pagination,
  Typography,
  Box,
  Select,
  MenuItem,
  TextField
} from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

export default function CartData() {
  const { savedItems, updateItemQuantity, removeItem } = useContext(SavedItemsContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [filter, setFilter] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  const theme = useTheme();

  const capitalize = (str) => {
    if (!str) return "Unknown";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  useEffect(() => {
    async function fetchCartItems() {
      try {
        const savedIds = savedItems?.map((item) => item._id);
        if (!savedIds.length) {
          setCartItems([]);
          setTotalItems(0);
          setLoading(false);
          return;
        }

        const query = `
          *[_type in ["storeProducts", "banner", "featuredProducts"] && _id in $ids && defined(category) && category != ""]{
            _id, 
            title,
            category,
            "current_slug": slug.current,
            image, 
            description, 
            price, 
            inventory
          }`;

        const docs = await client.fetch(query, { ids: savedIds });

        const mergedItems = docs.map((doc) => {
          const savedItem = savedItems.find((item) => item._id === doc._id);
          return {
            ...doc,
            quantity: savedItem?.quantity || 1,
          };
        });
        setCartItems(mergedItems);

        const totalQty = mergedItems.reduce((sum, item) => sum + item.quantity, 0);
        setTotalItems(totalQty);
      } catch (error) {
        console.error("Error fetching cart items:", error);
        setCartItems([]);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    }
    fetchCartItems();
  }, [savedItems]);

  const handleQuantityChange = (productId, increment) => {
    updateItemQuantity(productId, increment);
    setCurrentPage(1);
  };

  const handleRemoveItem = (productId) => {
    removeItem(productId);
    setCurrentPage(1);
  };

  const handleCategoryToggle = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((cat) => cat !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
    setCurrentPage(1);
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (sum, item) => sum + (item.price || 0) * item.quantity,
      0
    );
  };

  const getFilteredData = () => {
    let filteredData = cartItems;
    if (selectedCategories.length > 0) {
      filteredData = filteredData.filter((item) =>
        selectedCategories.includes(item.category)
      );
    }
    if (filter) {
      const lowerCaseFilter = filter.toLowerCase();
      filteredData = filteredData.filter(
        (item) =>
          (item.title && item.title.toLowerCase().includes(lowerCaseFilter)) ||
          (item.category && item.category.toLowerCase().includes(lowerCaseFilter))
      );
    }
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
    }
    return filteredData;
  };

  const filteredData = useMemo(
    () => getFilteredData(),
    [cartItems, filter, sortOption, selectedCategories]
  );

  const paginatedItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePaginationChange = (event, page) => {
    setCurrentPage(page);
    const searchContainer = document.getElementById("search-container");
    if (searchContainer) {
      searchContainer.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress size={60} />
      </div>
    );
  }

  if (!cartItems.length) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-gray-700">
          Your Cart is Empty
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full dark:bg-black bg-gray-200">
      <div className="container mx-auto px-4 py-8 pt-[12vh]">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-10">
          Your Cart
        </h1>
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
        {cartItems.length > 6 && (
          <div className="mb-6">
            <Box
              id="search-container"
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 4,
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <TextField
                fullWidth
                label="Search by title, category..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                sx={{
                  bgcolor: "background.paper",
                  borderRadius: 1,
                  mb: { xs: 2, sm: 0 },
                  mr: { sm: 2 },
                }}
              />
              <Select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                displayEmpty
                sx={{
                  ".MuiSelect-select": { bgcolor: "background.paper" },
                  width: { xs: "100%", sm: "auto" },
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
            <Box sx={{ width: "100%", px: 2, mb: 4 }}>
              <div className="flex flex-wrap justify-center gap-2">
                {Array.from(new Set(cartItems.map((item) => item.category)))
                  .filter((category) => category)
                  .map((category) => (
                    <Button
                      key={category}
                      onClick={() => handleCategoryToggle(category)}
                      className={`capitalize rounded-full px-4 py-2 font-bold transition ${
                        selectedCategories.includes(category)
                          ? "bg-gradient-to-r from-teal-400 to-teal-600 text-white"
                          : theme.palette.mode === "dark"
                          ? "bg-gradient-to-r from-gray-700 to-gray-900 text-white"
                          : "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700"
                      }`}
                      aria-pressed={selectedCategories.includes(category)}
                    >
                      {capitalize(category)}
                    </Button>
                  ))}
              </div>
            </Box>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedItems.map((item) => (
            <div
              key={item._id}
              className="border-2 border-gray-300 dark:border-gray-700 rounded-lg shadow-md bg-white dark:bg-gray-800 flex flex-col"
            >
              <div className="relative w-full h-[200px] bg-gray-200">
                {item.image && (
                  <Image
                    src={urlFor(item.image).url()}
                    alt={item.title}
                    layout="fill"
                    objectFit="contain"
                    className="p-2"
                  />
                )}
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <Typography
                  variant="h6"
                  className="text-lg font-semibold text-gray-900 dark:text-white truncate"
                >
                  {item.title}
                </Typography>
                <Typography
                  variant="body2"
                  className="text-gray-700 dark:text-gray-300 mt-2 flex items-center gap-2"
                >
                  Quantity:
                  <button
                    onClick={() => handleQuantityChange(item._id, false)}
                    className="px-2 py-1 bg-gradient-to-r from-teal-400 to-teal-600 text-white font-semibold rounded-full transition disabled:opacity-50"
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item._id, true)}
                    className="px-2 py-1 bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold rounded-full transition disabled:opacity-50"
                    disabled={item.inventory && item.quantity >= item.inventory}
                  >
                    +
                  </button>
                </Typography>
                <Typography
                  variant="body1"
                  className="text-gray-700 dark:text-gray-300 mt-2"
                >
                  Total: ${item.price && (item.price * item.quantity).toFixed(2)}
                </Typography>
                <button
                  onClick={() => handleRemoveItem(item._id)}
                  className="mt-4 bg-gradient-to-r from-red-700 to-red-700 text-white px-3 py-2 rounded-full shadow self-end hover:scale-105 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        {filteredData.length > itemsPerPage && (
          <div className="mt-8 flex justify-center">
            <Pagination
              count={Math.ceil(filteredData.length / itemsPerPage)}
              page={currentPage}
              onChange={handlePaginationChange}
              sx={{
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
          </div>
        )}
      </div>
    </div>
  );
}