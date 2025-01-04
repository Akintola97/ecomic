import { client } from "@/sanity/lib/client"; // Import the Sanity client for fetching data
import FeaturedItemsModal from "./FeaturedItemsModal"; // Import the client-side modal component
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"; // Import server session handler

// Function to fetch featured products data from the Sanity backend
const featuredData = async () => {
  const query = `
    *[_type == "featuredProducts"] {
      _id,             // Unique ID for the product (required for Add-to-Cart)
      title,           // Product title
      category,        // Product category
      "current_slug": slug.current, // Slug for unique identification
      image,           // Product image
      description,     // Product description
      price,           // Product price
      inventory        // Product inventory count
    }`;
  return await client.fetch(query); // Fetch data using the Sanity client and return it
};

// Server-side component to fetch and render featured items
export default async function FeaturedItems() {
  const data = await featuredData(); // Fetch the data on the server side
  const session = getKindeServerSession(); // Get the Kinde session
  const isUserAuthenticated = await session?.isAuthenticated(); // Check if the user is authenticated
  const user = isUserAuthenticated ? await session.getUser() : null; // Get user details if authenticated
  const userId = user?.id || null; // Extract user ID if available

  return (
    <div className="w-full min-h-[65vh] md:min-h-[60vh] lg:min-h-[70vh] h-auto flex flex-col justify-center">
      <h1 className="font-bold text-center text-2xl pt-5 pb-10">
        Featured Items
      </h1>
      {/* Pass the userId and data to the client-side modal component */}
      <FeaturedItemsModal data={data} userId={userId} />
    </div>
  );
}