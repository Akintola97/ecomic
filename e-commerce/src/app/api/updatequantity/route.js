// import { NextResponse } from "next/server";
// import dbConnect from "@/utils/mongodb";
// import Cart from "@/model/Cart";

// export async function POST(request) {
//   try {
//     await dbConnect(); // Ensure the database connection

//     const { userId, productId, increment } = await request.json(); // Parse the request body

//     // Validate the inputs
//     if (!userId || !productId || typeof increment !== "boolean") {
//       return NextResponse.json(
//         { success: false, message: "Invalid request data" },
//         { status: 400 }
//       );
//     }

//     // Find the cart for the user
//     const cart = await Cart.findOne({ user: userId });

//     if (!cart) {
//       return NextResponse.json(
//         { success: false, message: "Cart not found" },
//         { status: 404 }
//       );
//     }

//     // Find the specific item and adjust its quantity
//     const item = cart.items.find((item) => item.product === productId);
//     if (item) {
//       item.quantity = increment
//         ? item.quantity + 1
//         : Math.max(item.quantity - 1, 1); // Ensure quantity doesn't go below 1
//     } else {
//       return NextResponse.json(
//         { success: false, message: "Item not found in cart" },
//         { status: 404 }
//       );
//     }

//     // Save the updated cart
//     await cart.save();

//     return NextResponse.json({ success: true, message: "Quantity updated" });
//   } catch (error) {
//     console.error("Error updating quantity:", error);
//     return NextResponse.json(
//       { success: false, message: "Internal server error" },
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

    const { userId, productId, increment } = await request.json(); // Parse the request body

    // Validate the inputs
    if (!userId || !productId || typeof increment !== "boolean") {
      return NextResponse.json(
        { success: false, message: "Invalid request data" },
        { status: 400 }
      );
    }

    // Find the cart for the user
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return NextResponse.json(
        { success: false, message: "Cart not found" },
        { status: 404 }
      );
    }

    // Find the specific item and adjust its quantity
    const item = cart.items.find((item) => item.product === productId);
    if (item) {
      if (increment) {
        // Increment the quantity
        item.quantity += 1;
      } else {
        // Decrement the quantity
        item.quantity -= 1;

        // Remove the item if its quantity becomes 0
        if (item.quantity <= 0) {
          cart.items = cart.items.filter((item) => item.product !== productId);
        }
      }
    } else {
      return NextResponse.json(
        { success: false, message: "Item not found in cart" },
        { status: 404 }
      );
    }

    // Save the updated cart
    await cart.save();

    return NextResponse.json({ success: true, message: "Quantity updated" });
  } catch (error) {
    console.error("Error updating quantity:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}