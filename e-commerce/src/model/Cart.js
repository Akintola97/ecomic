import mongoose from "mongoose"; // Import mongoose to define and manage MongoDB schemas and models

// Define the schema for individual cart items
const cartItemSchema = new mongoose.Schema({
  product: {
    type: String, // Store product IDs as strings (e.g., from Sanity.io)
    required: true, // Make this field mandatory
  },
  quantity: {
    type: Number, // Store the quantity of the product as a number
    required: true, // Make this field mandatory
    min: 1, // Ensure that at least 1 item is added to the cart
  },
});

// Define the schema for the cart
const cartSchema = new mongoose.Schema(
  {
    user: {
      type: String, // Store the user ID (e.g., from Kinde Auth) as a string
      required: true, // Make this field mandatory
      unique: true, // Ensure each user has only one cart
    },
    items: [cartItemSchema], // Define the cart items as an array of cartItemSchema
    totalItems: {
      type: Number, // Store the total number of items in the cart
      default: 0, // Initialize the total to 0 when the cart is created
    },
  },
  {
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields to the schema
  }
);

// Middleware to calculate and update totalItems before saving the cart document
cartSchema.pre("save", function (next) {
  // `this` refers to the current cart document being saved
  this.totalItems = this.items.reduce(
    (sum, item) => sum + item.quantity, // Sum up the quantity of all items in the cart
    0 // Start the sum at 0
  );
  next(); // Call the next middleware or complete the save operation
});

// Define the Cart model
// If the model already exists (in case of hot-reloading), use it; otherwise, create a new model
const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);

export default Cart; // Export the Cart model for use in other parts of the application