import { client } from "@/sanity/lib/client"; // Import Sanity client for querying data
import BannerCarousel from "@/components/BannerCarousel"; // Import the client-side carousel component
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"; // Import Kinde auth utilities

// Function to fetch banner data from Sanity
const getBannerData = async () => {
  const query = `
    *[_type == "banner"] {
      _id,               // The unique ID of the banner (important for add-to-cart)
      title,             // The title of the banner
      author,            // The author of the banner
      "current_slug": slug.current, // The slug for the banner
      image,             // The image associated with the banner
      issues,            // Any issues related to the banner
      description        // A description of the banner
    }
  `;
  return await client.fetch(query); // Execute the query and return the data
};

export default async function Banner() {
  const data = await getBannerData(); // Fetch banner data from Sanity
  const session = getKindeServerSession(); // Get the server session
  const isUserAuthenticated = await session?.isAuthenticated(); // Check if the user is authenticated
  const user = isUserAuthenticated ? await session.getUser() : null; // Fetch user details if authenticated
  const userId = user?.id || null; // Extract user ID if available
  console.log(userId)

  // Check if data is not available and display a loading state
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[90vh] pt-[8vh] dark:bg-black bg-gray-200 flex items-center justify-center">
        <p>Loading...</p> {/* Show a "Loading..." message */}
      </div>
    );
  }

  return (
    <div className="w-full h-[100vh] sm:h-[110vh] md:h-[92vh] pt-[8vh] dark:bg-black bg-gray-200 flex items-center overflow-hidden">
      <div className="container mx-auto px-4 h-full flex flex-col justify-center">
        {/* Pass the data and userId to the client-side BannerCarousel */}
        <BannerCarousel data={data} userId={userId} />
      </div>
    </div>
  );
}