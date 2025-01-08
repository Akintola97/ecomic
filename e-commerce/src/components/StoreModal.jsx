"use client";

import { useState, useEffect, useContext } from "react";
import Image from "next/image";
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
} from "@mui/material"; // Material-UI
import { urlFor } from "@/sanity/lib/image";
import StoreItemModal from "./StoreItemModal";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";

// --- Local Storage Context (same logic as BannerCarousel) ---
import { SavedItemsContext } from "@/context/SavedItems";

/**
 * Displays a grid of store items with filtering, searching, sorting, and pagination,
 * and uses local storage (SavedItemsContext) to add/remove from "cart".
 */
export default function StoreModal({ data, isUserAuthenticated }) {
  // MUI states for filtering/sorting
  const [filter, setFilter] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [categoryFilters, setCategoryFilters] = useState({});

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Modal control
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // --- Access local storage cart logic ---
  const { savedItems, toggleSaveItem } = useContext(SavedItemsContext);

  /**
   * We no longer do fetch calls or track 'cartStatus' in local state,
   * because local storage is managed by SavedItemsContext.
   * So there's no need for a "loading" or "checkAllCartStatuses" anymore.
   */

  // If you still want a brief loading spinner (for data fetch, etc.), you can conditionally handle that here.
  // For now, we'll assume your "data" is ready.

  // Modal open/close
  const handleOpen = (item) => {
    setSelectedItem(item);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedItem(null);
  };

  /**
   * Toggle local storage "cart" (saved items) for this product.
   * If user is not authenticated, do nothing (the UI shows a LoginLink).
   */
  const handleToggleCart = (item) => {
    if (!isUserAuthenticated) return;
    toggleSaveItem(item);
  };

  // Helper to see if an item is "in cart" from local storage
  // const isSaved = (item) => savedItems.includes(item._id);
  const isSaved = (itemId) => savedItems.some((item) => item._id === itemId);

  /**
   * Filtering & Sorting
   */
  const getFilteredData = () => {
    let filteredData = data;

    // Category filters
    const activeFilters = Object.entries(categoryFilters)
      .filter(([_, isActive]) => isActive)
      .map(([category]) => category);
    if (activeFilters.length > 0) {
      filteredData = filteredData.filter((item) =>
        activeFilters.includes(item.category)
      );
    }

    // Search filter
    if (filter) {
      filteredData = filteredData.filter(
        (item) =>
          item.title.toLowerCase().includes(filter.toLowerCase()) ||
          item.category.toLowerCase().includes(filter.toLowerCase())
      );
    }

    // Sorting
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
      // No sorting
    }
    return filteredData;
  };

  // Paginate
  const filteredData = getFilteredData();
  const paginatedData = filteredData.slice(
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

  // If you want a loading spinner while data is empty:
  if (!data.length) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress size={60} />
      </div>
    );
  }

  return (
    <div className="w-full min-h-[65vh] md:min-h-[60vh] lg:min-h-[70vh] dark:bg-black bg-gray-200">
      <Box
        sx={{
          display: "flex",
          p: 2,
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* Sidebar Filters */}
        <Box sx={{ width: { xs: "100%", md: "25%" }, px: 2 }}>
          <Typography
            variant="h6"
            className="dark:text-white text-black"
            marginBottom={2}
          >
            Filter by Category:
          </Typography>
          <FormGroup>
            {Array.from(new Set(data.map((item) => item.category))).map(
              (category) => (
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
              )
            )}
          </FormGroup>
        </Box>

        {/* Main Area */}
        <Box sx={{ width: { xs: "100%", md: "75%" }, p: 2 }}>
          {/* Search & Sort */}
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
                <div className="border rounded-md shadow-md overflow-hidden bg-white dark:bg-gray-800 flex flex-col items-center w-full transition-transform duration-300 hover:scale-105 hover:shadow-lg">
                  {/* Clickable Image to open modal */}
                  <div
                    className="relative w-full h-[200px] bg-gray-200 cursor-pointer"
                    onClick={() => handleOpen(item)}
                  >
                    <Image
                      src={urlFor(item.image).url()}
                      alt={item.title}
                      layout="fill"
                      objectFit="contain"
                      className="p-2"
                    />
                  </div>
                  {/* Item details */}
                  <div className="p-4 text-center">
                    <h2 className="font-semibold text-base truncate text-gray-900 dark:text-gray-100">
                      {item.title}
                    </h2>
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold mt-2">
                      ${item.price.toFixed(2)}
                    </p>

                    {/* Add/Remove button OR prompt login */}
                    {isUserAuthenticated ? (
                      <button
                        onClick={() => handleToggleCart(item)}
                        className={`relative py-2 px-4 mt-3 text-sm rounded-full font-bold overflow-hidden group ${
                          isSaved(item._id)
                            ? "bg-gradient-to-r from-red-500 to-red-700 text-white"
                            : "bg-gradient-to-r from-blue-500 to-green-500 text-white"
                        }`}
                      >
                        <span className="absolute inset-0 transition-transform duration-300 transform scale-x-0 group-hover:scale-x-100 bg-white opacity-10"></span>
                        <span className="relative z-10">
                          {isSaved(item._id)
                            ? "Remove from Cart"
                            : "Add to Cart"}
                        </span>
                      </button>
                    ) : (
                      <LoginLink>
                        <button className="py-2 px-4 mt-3 text-sm rounded-full font-bold bg-gradient-to-r from-blue-500 to-green-500 text-white">
                          Add to Cart
                        </button>
                      </LoginLink>
                    )}
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
        onClose={handleClose}
        isUserAuthenticated={isUserAuthenticated}
      />
    </div>
  );
}
