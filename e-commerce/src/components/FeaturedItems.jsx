import { client } from "@/sanity/lib/client";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import FeaturedItemsModal from "./FeaturedItemsModal";
// Function to fetch banner data from Sanity

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
  const data = client.fetch(query); // Fetch data using the Sanity client and return it
  return data;
};

export default async function HeroData() {
  // Fetch user authentication status
  const { isAuthenticated } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();

  // Fetch data
  const data = await featuredData();

  return (
    <div className="w-full min-h-[65vh] md:min-h-[60vh] lg:min-h-[70vh] h-auto flex flex-col justify-center">
    <h1 className="font-bold text-center text-2xl pt-5 pb-10">
      Featured Items
    </h1>
    <FeaturedItemsModal data={data} isUserAuthenticated={isUserAuthenticated} />
    </div>
  );
}