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




import { NextResponse } from "next/server";
import dbConnect from "@/utils/mongodb";
import Cart from "@/model/Cart";

export async function POST(request) {
  try {
    await dbConnect(); // Ensure the database connection

    const { userId, productId } = await request.json(); // Parse the request body

    // Validate that both userId and productId are provided
    if (!userId || !productId) {
      return NextResponse.json(
        { exists: false, message: "User ID and Product ID are required" },
        { status: 400 }
      );
    }

    // Query the cart to check if the product exists for the user
    const cart = await Cart.findOne({ user: userId });
    const exists = cart?.items.some((item) => item.product === productId) || false;

    // Return the existence status in the response
    return NextResponse.json({ exists }, { status: 200 });
  } catch (error) {
    console.error("Error checking cart item:", error); // Log any errors
    return NextResponse.json(
      { exists: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}