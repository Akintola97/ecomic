import Cart from "@/model/Cart";

const updateCart = async (userId, productId) => {
  try {
    // Find the cart for the user
    let cart = await Cart.findOne({ user: userId });

    // If no cart exists, create a new one
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if the product already exists in the cart
    const existingItem = cart.items.find((item) => item.product === productId);

    // If it exists, increment the quantity
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      // Otherwise, add the product to the cart
      cart.items.push({ product: productId, quantity: 1 });
    }

    // Save the updated cart
    await cart.save();
    return cart;
  } catch (error) {
    console.error("Error in updateCart:", error);
    throw new Error("Error updating the cart");
  }
};

export default updateCart;