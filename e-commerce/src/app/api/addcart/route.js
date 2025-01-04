import { NextResponse } from "next/server";
import dbConnect from "@/utils/mongodb";
import updateCart from "@/app/api/cartupdate/route.js"; // Import the updateCart function


export async function POST(request) {
  try {
    // Ensure the database is connected
    await dbConnect();

    // Parse the request body
    const body = await request.json();
    console.log("Request body:", body);

    const { userId, productId } = body;

    // Validate request payload
    if (!userId || !productId) {
      console.error("Invalid payload:", body);
      return NextResponse.json(
        { message: "User ID and Product ID are required" },
        { status: 400 }
      );
    }

    // Use the updateCart function to update the cart
    const updatedCart = await updateCart(userId, productId);

    // Return the updated cart as the response
    return NextResponse.json(updatedCart, { status: 200 });
  } catch (error) {
    console.error("Error updating the cart:", error);

    // Return an error response in case of failure
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}