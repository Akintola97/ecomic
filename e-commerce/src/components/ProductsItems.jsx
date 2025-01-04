// // Import required modules and components
// import { client } from "@/sanity/lib/client"; // Sanity client for fetching data
// import StoreModal from "./StoreModal"; // Client-side modal component

// // Async function to fetch store data from Sanity.io
// const fetchStoreData = async () => {
//   // Fetch all products of type "storeProducts" with specified fields
//   const query = `
//     *[_type == "storeProducts"] {
//       _id, // Unique ID for each product from Sanity
//       title, // Product title
//       category, // Product category
//       "current_slug": slug.current, // Current slug for the product
//       image, // Image object for the product
//       description, // Product description
//       price, // Product price
//       inventory, // Inventory count
//       author, // Author information (if applicable)
//       artist // Artist information (if applicable)
//     }`;
//   return await client.fetch(query); // Execute query using Sanity client
// };

// // Main Store component
// export default async function Store() {
//   const data = await fetchStoreData(); // Fetch data from Sanity

//   return (
//     <div className="w-full min-h-[65vh] md:min-h-[60vh] lg:min-h-[70vh] dark:bg-black bg-gray-200 h-auto flex flex-col justify-center">
//       {/* Title for the Store section */}
//       <h1 className="font-bold text-center text-2xl pt-5 pb-10">
//         Comics
//       </h1>
//       {/* Render the StoreModal component and pass fetched data as props */}
//       <StoreModal data={data} />
//     </div>
//   );
// }






// Import required modules and components
import { client } from "@/sanity/lib/client"; // Sanity client for fetching data
import StoreModal from "./StoreModal"; // Client-side modal component
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"; // Import Kinde auth utilities

// Async function to fetch store data from Sanity.io
const fetchStoreData = async () => {
  // Fetch all products of type "storeProducts" with specified fields
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
  return await client.fetch(query); // Execute query using Sanity client
};

// Main Store component
export default async function Store() {
  const data = await fetchStoreData(); // Fetch data from Sanity

  // Get the server session and extract userId
  const session = await getKindeServerSession();
  const isUserAuthenticated = session?.isAuthenticated();
  const user = isUserAuthenticated ? await session.getUser() : null;
  const userId = user?.id || null; // Extract userId if available

  return (
    <div className="w-full min-h-[65vh] md:min-h-[60vh] lg:min-h-[70vh] dark:bg-black bg-gray-200 h-auto flex flex-col justify-center">
      {/* Title for the Store section */}
      <h1 className="font-bold text-center text-2xl pt-5 pb-10">
        Comics
      </h1>
      {/* Render the StoreModal component and pass fetched data and userId as props */}
      <StoreModal data={data} userId={userId} />
    </div>
  );
}