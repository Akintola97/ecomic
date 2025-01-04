// import { NextResponse } from "next/server";
// import dbConnect from "@/utils/mongodb";
// import Cart from "@/model/Cart";

// export async function POST(request) {
//   try {
//     await dbConnect(); // Ensure the database connection
//     const { userId, productId } = await request.json(); // Parse the request body

//     // Validate inputs
//     if (!userId || !productId) {
//       return NextResponse.json(
//         { success: false, message: "User ID and Product ID are required" },
//         { status: 400 }
//       );
//     }

//     // Find the user's cart
//     const cart = await Cart.findOne({ user: userId });

//     if (!cart) {
//       return NextResponse.json(
//         { success: false, message: "Cart not found" },
//         { status: 404 }
//       );
//     }

//     // Remove the item from the cart
//     cart.items = cart.items.filter((item) => item.product !== productId);

//     // Save the updated cart
//     await cart.save();

//     return NextResponse.json({ success: true, message: "Item removed from cart" });
//   } catch (error) {
//     console.error("Error removing item from cart:", error);
//     return NextResponse.json(
//       { success: false, message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }







import { NextResponse } from "next/server"; // Import Next.js's server response utility
import dbConnect from "@/utils/mongodb"; // Import the MongoDB connection utility
import Cart from "@/model/Cart"; // Import the Cart model for interacting with the database

export async function POST(request) {
  try {
    await dbConnect(); // Ensure the database connection is established

    // Parse the request body to extract userId and productId
    const { userId, productId } = await request.json();

    // Validate the inputs to ensure both userId and productId are provided
    if (!userId || !productId) {
      return NextResponse.json(
        { success: false, message: "User ID and Product ID are required" },
        { status: 400 } // Respond with a 400 status code for bad request
      );
    }

    // Find the cart associated with the userId
    const cart = await Cart.findOne({ user: userId });

    // If no cart is found, return an appropriate response
    if (!cart) {
      return NextResponse.json(
        { success: false, message: "Cart not found" },
        { status: 404 } // Respond with a 404 status code if the cart doesn't exist
      );
    }

    // Remove the specified product from the cart's items
    cart.items = cart.items.filter((item) => item.product !== productId);

    // Save the updated cart to the database
    await cart.save();

    // Return a success response indicating the item was removed
    return NextResponse.json({ success: true, message: "Item removed from cart" });
  } catch (error) {
    // Log any errors that occur during the process
    console.error("Error removing item from cart:", error);

    // Return a 500 response indicating an internal server error
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}