import { NextResponse } from "next/server";
import dbConnect from "@/utils/mongodb";
import Cart from "@/model/Cart";
import { client } from "@/sanity/lib/client";

export async function POST(request) {
  try {
    await dbConnect(); // Ensure database connection
    console.log("Database connected.");

    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      console.error("User ID is missing.");
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }
    console.log("User ID:", userId);

    // Retrieve the user's cart from MongoDB
    const cart = await Cart.findOne({ user: userId });
    console.log("Cart fetched from MongoDB:", cart);

    if (!cart || cart.items.length === 0) {
      console.log("Cart is empty or not found.");
      return NextResponse.json(
        { message: "Cart is empty", items: [] },
        { status: 200 }
      );
    }

    // Extract product IDs from the cart
    const productIds = cart.items.map((item) => item.product);
    console.log("Product IDs in cart:", productIds);

    // Fetch product details from Sanity.io
    const query = `
      *[_type in ["storeProducts","banner","featuredProducts"] && _id in $productIds] {
        _id,
        title,
        category,
        "current_slug": slug.current,
        image,
        description,
        price,
        inventory
      }
    `;
    const products = await client.fetch(query, { productIds });
    console.log("Products fetched from Sanity:", products);

    // Combine product details with quantities from the cart
    const cartWithDetails = cart.items.map((cartItem) => {
      const product = products.find((prod) => prod._id === cartItem.product);
      return product
        ? {
            ...product,
            quantity: cartItem.quantity,
          }
        : null;
    }).filter(Boolean); // Remove unmatched items
    console.log("Final cart with details:", cartWithDetails);

    return NextResponse.json(cartWithDetails, { status: 200 });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}