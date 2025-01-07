// import { NextResponse } from "next/server";
// import dbConnect from "@/utils/mongodb";
// import Cart from "@/model/Cart";

// export async function POST(request) {
//   try {
//     await dbConnect(); // Ensure the database is connected

//     const { userId, productId } = await request.json();

//     if (!userId || !productId) {
//       return NextResponse.json(
//         { exists: false, message: "User ID and Product ID are required" },
//         { status: 400 }
//       );
//     }

//     // Check if the item exists in the user's cart
//     const cart = await Cart.findOne({ user: userId });
//     const exists = cart?.items.some((item) => item.product === productId) || false;

//     return NextResponse.json({ exists }, { status: 200 });
//   } catch (error) {
//     console.error("Error checking cart item:", error);
//     return NextResponse.json(
//       { exists: false, message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }




// import { NextResponse } from "next/server";
// import dbConnect from "@/utils/mongodb";
// import Cart from "@/model/Cart";

// export async function POST(request) {
//   try {
//     await dbConnect(); // Ensure the database connection

//     const { userId, productId } = await request.json(); // Parse the request body

//     // Validate that both userId and productId are provided
//     if (!userId || !productId) {
//       return NextResponse.json(
//         { exists: false, message: "User ID and Product ID are required" },
//         { status: 400 }
//       );
//     }

//     // Query the cart to check if the product exists for the user
//     const cart = await Cart.findOne({ user: userId });
//     const exists = cart?.items.some((item) => item.product === productId) || false;

//     // Return the existence status in the response
//     return NextResponse.json({ exists }, { status: 200 });
//   } catch (error) {
//     console.error("Error checking cart item:", error); // Log any errors
//     return NextResponse.json(
//       { exists: false, message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }



import { NextResponse } from "next/server";
import dbConnect from "@/utils/mongodb";
import Cart from "@/model/Cart";

/**
 * API Endpoint to check if items are in the user's cart.
 * Accepts a list of product IDs and returns the cart status for each item.
 */
export async function POST(request) {
  try {
    // Ensure the database connection
    await dbConnect();

    // Parse the request body
    const { userId, productIds } = await request.json();

    // Validate the input
    if (!userId || !Array.isArray(productIds)) {
      return NextResponse.json(
        { message: "User ID and Product IDs are required" },
        { status: 400 }
      );
    }

    // Query the cart for the user
    const cart = await Cart.findOne({ user: userId });

    // Create a response object with product IDs and their statuses
    const statuses = productIds.reduce((acc, productId) => {
      acc[productId] = cart?.items.some((item) => item.product === productId) || false;
      return acc;
    }, {});

    // Return the statuses as a JSON response
    return NextResponse.json(statuses, { status: 200 });
  } catch (error) {
    console.error("Error checking cart items:", error);

    // Return a generic error message
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}