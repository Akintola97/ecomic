"use client";

import { SavedItemsContext } from "@/context/SavedItems";
import { urlFor } from "@/sanity/lib/image";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs";
import {
  CircularProgress,
  Typography,
  Box,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  Select,
  MenuItem,
  Grid,
  Pagination,
} from "@mui/material";
import Image from "next/image";
import { useContext, useState } from "react";
import StoreItemModal from "./StoreItemModal";

export default function StoreModal({ data, isUserAuthenticated }) {
  const [filter, setFilter] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [categoryFilters, setCategoryFilters] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const { savedItems, toggleSaveItem } = useContext(SavedItemsContext);

  const handleOpen = (item) => {
    setSelectedItem(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedItem(null);
  };

  const handleToggleCart = (item) => {
    if (!isUserAuthenticated) return;
    toggleSaveItem(item);
  };

  const isSaved = (itemId) => savedItems.some((item) => item._id === itemId);

  const getFilteredData = () => {
    let filteredData = data;

    const activeFilters = Object.entries(categoryFilters)
      .filter(([_, isActive]) => isActive)
      .map(([category]) => category);
    if (activeFilters.length > 0) {
      filteredData = filteredData.filter((item) =>
        activeFilters.includes(item.category)
      );
    }

    if (filter) {
      filteredData = filteredData.filter(
        (item) =>
          item.title.toLowerCase().includes(filter.toLowerCase()) ||
          item.category.toLowerCase().includes(filter.toLowerCase())
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
        <Box sx={{ width: { xs: "100%", md: "75%" }, p: 2 }}>
          <Box
            id="search-container"
            sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
          >
            <TextField
              fullWidth
              label="Search by title, category..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              sx={{
                bgcolor: "background.paper",
                borderRadius: 1,
              }}
            />
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
          <Grid container spacing={3}>
            {paginatedData?.map((item) => (
              <Grid item key={item._id} xs={12} sm={6} md={4}>
                <div className="border rounded-md shadow-md overflow-hidden bg-white dark:bg-gray-800 flex flex-col items-center w-full transition-transform duration-300 hover:scale-105 hover:shadow-lg">
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
                  <div className="p-4 text-center">
                    <h2 className="font-semibold text-base truncate text-gray-900 dark:text-gray-100">
                      {item.title}
                    </h2>
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold mt-2">
                      ${item.price.toFixed(2)}
                    </p>
                    {isUserAuthenticated ? (
                      <button
                        onClick={() => handleToggleCart(item)}
                        className={`relative py-2 px-4 mt-3 text-sm rounded-full font-bold overflow-hidden group ${isSaved(item._id) ? "bg-gradient-to-r from-red-500 to-red-700 text-white" : "bg-gradient-to-r from-blue-500 to-green-500 text-white"}:`}
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
      <StoreItemModal
        open={open}
        item={selectedItem}
        onClose={handleClose}
        isUserAuthenticated={isUserAuthenticated}
      />
    </div>
  );
}