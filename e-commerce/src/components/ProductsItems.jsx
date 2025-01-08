// Import required modules and components
import { client } from "@/sanity/lib/client"; // Sanity client for fetching data
import StoreModal from "./StoreModal"; // Client-side modal component
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"; // Import Kinde auth utilities

// Async function to fetch store data from Sanity.io
const fetchStoreData = async () => {
  const query = `
    *[_type == "storeProducts"] {
      _id, // Unique ID for each product from Sanity
      title, // Product title
      category, // Product category
      "current_slug": slug.current, // Current slug for the product
      image, // Image object for the product
      description, // Product description
      price, // Product price
      inventory, // Inventory count
      author, // Author information (if applicable)
      artist // Artist information (if applicable)
    }`;
  const data = await client.fetch(query);
  return data;
};

export default async function HeroData() {
  // Fetch user authentication status
  const { isAuthenticated } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();

  // Fetch data
  const data = await fetchStoreData();

  return (
    <div className="w-full min-h-[65vh] md:min-h-[60vh] lg:min-h-[70vh] dark:bg-black bg-gray-200 h-auto flex flex-col justify-center">
      <h1 className="font-bold text-center text-2xl pt-10 pb-5">Comics</h1>
      <StoreModal data={data} isUserAuthenticated={isUserAuthenticated} />
    </div>
  );
}