"use client";

import { useState, useEffect, useCallback } from "react";
// Material-UI components
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

/**
 * Displays a shopping cart icon with a dynamic item-count badge using Material UI.
 * Expects a userId (string) or null/undefined if not logged in.
 */
export default function CartBadge({ userId }) {
  const [totalItems, setTotalItems] = useState(0);

  /**
   * Fetches cart data from /api/getcart and calculates total quantity.
   */
  const fetchCartData = useCallback(async () => {
    // If there's no user, reset the badge to 0
    if (!userId) {
      setTotalItems(0);
      return;
    }

    try {
      const response = await fetch("/api/getcart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch cart items");
      }

      // Assuming /api/getcart returns an array of items with { quantity, ... }
      const data = await response.json();
      if (Array.isArray(data)) {
        const totalQuantity = data.reduce(
          (sum, item) => sum + (item.quantity || 0),
          0
        );
        setTotalItems(totalQuantity);
      } else {
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setTotalItems(0);
    }
  }, [userId]);

  /**
   * On mount, fetch immediately & listen for cart-updates from anywhere in the app.
   */
  useEffect(() => {
    fetchCartData();

    function handleCartUpdated() {
      fetchCartData();
    }

    window.addEventListener("cartUpdated", handleCartUpdated);
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdated);
    };
  }, [fetchCartData]);

  return (
    <Badge badgeContent={totalItems} color="error" overlap="rectangular">
      <ShoppingCartIcon style={{ fontSize: 28 }} />
    </Badge>
  );
}