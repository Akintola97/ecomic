"use client";

import React, { useContext } from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Badge from "@mui/material/Badge";
import Link from "next/link";
import { SavedItemsContext } from "@/context/SavedItems";

const CartBadge = () => {
  const { savedItems } = useContext(SavedItemsContext);

  const getTotalQuantity = () => {
    return savedItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <Link href="/cart" className="relative">
      <Badge badgeContent={getTotalQuantity()} color="secondary">
        <ShoppingCartIcon className="dark:text-white text-[3.5vmin] hover:text-green-400 hover:text-foreground" />
      </Badge>
    </Link>
  );
};

export default CartBadge;