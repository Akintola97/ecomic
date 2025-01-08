import { client } from "@/sanity/lib/client";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import BannerCarousel from "./BannerCarousel";
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
  const data = await client.fetch(query);
  return data;
};

export default async function HeroData() {
  // Fetch user authentication status
  const { isAuthenticated } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();

  // Fetch data
  const data = await getBannerData();

  return (
    <div className="w-full h-[100vh] sm:h-[110vh] md:h-[92vh] pt-[8vh] dark:bg-black bg-gray-200 flex items-center overflow-hidden">
      <div className="container mx-auto px-4 h-full flex flex-col justify-center">
        <BannerCarousel data={data} isUserAuthenticated={isUserAuthenticated} />
      </div>
    </div>
  );
}