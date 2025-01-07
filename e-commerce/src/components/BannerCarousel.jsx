// "use client";

// import { useEffect, useState } from "react";
// import useEmblaCarousel from "embla-carousel-react"; // Embla carousel hook
// import Image from "next/image";
// import { urlFor } from "@/sanity/lib/image";
// import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components"; // Kinde Auth LoginLink component
// import CircularProgress from "@mui/material/CircularProgress"; // Material UI CircularProgress component

// const BannerCarousel = ({ data, userId }) => {
//   const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }); // Initialize Embla carousel with looping
//   const [selectedIndex, setSelectedIndex] = useState(0); // Track the currently selected slide
//   const [dots, setDots] = useState([]); // Dots for navigation
//   const [cartStatus, setCartStatus] = useState({}); // Track cart status for each item
//   const [loading, setLoading] = useState(true); // Loading state for cart status

//   /**
//    * Fetch cart statuses for all items when userId or data changes.
//    */
//   useEffect(() => {
//     const fetchCartStatuses = async () => {
//       if (!userId) {
//         // Set all items as not in cart if the user is not logged in
//         const defaultStatuses = data.reduce((acc, comic) => {
//           acc[comic._id] = false;
//           return acc;
//         }, {});
//         setCartStatus(defaultStatuses);
//         setLoading(false); // Mark loading as complete
//         return;
//       }

//       try {
//         const statuses = await Promise.all(
//           data.map(async (comic) => {
//             const response = await fetch("/api/checkcart", {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify({ userId, productId: comic._id }), // Send userId and productId
//             });

//             if (!response.ok) {
//               throw new Error(`Failed to check cart status for product ${comic._id}`);
//             }

//             const { exists } = await response.json();
//             return { [comic._id]: exists }; // Map product ID to its cart status
//           })
//         );

//         // Combine all statuses into a single object
//         const combinedStatuses = statuses.reduce((acc, status) => {
//           return { ...acc, ...status };
//         }, {});

//         setCartStatus(combinedStatuses); // Update local cart status state
//       } catch (error) {
//         console.error("Error fetching cart statuses:", error);
//       } finally {
//         setLoading(false); // Mark loading as complete
//       }
//     };

//     fetchCartStatuses();
//   }, [userId, data]);

//   /**
//    * Function to toggle cart status for a product.
//    */
//   const toggleCartStatus = async (productId) => {
//     if (!userId) return; // Do nothing if user is not logged in

//     try {
//       const action = cartStatus[productId] ? "removecart" : "addcart"; // Determine action
//       const response = await fetch(`/api/${action}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ userId, productId }),
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to ${cartStatus[productId] ? "remove" : "add"} item to cart`);
//       }

//       // Update local state
//       setCartStatus((prevState) => ({
//         ...prevState,
//         [productId]: !prevState[productId], // Toggle cart status
//       }));
//     } catch (error) {
//       console.error("Error toggling cart status:", error);
//     }
//   };

//   /**
//    * Setup Embla carousel and update dots when the API is ready.
//    */
//   useEffect(() => {
//     if (!emblaApi) return;

//     const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap()); // Update selected index
//     setDots(Array.from({ length: emblaApi.slideNodes().length })); // Generate dots for navigation
//     emblaApi.on("select", onSelect);

//     return () => emblaApi.off("select", onSelect); // Cleanup event listener on unmount
//   }, [emblaApi]);

//   // Show a loading spinner while fetching cart statuses
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <CircularProgress size={60} />
//       </div>
//     );
//   }

//   return (
//     <div className="relative w-full h-full pt-[8vh] flex items-center justify-center">
//       {/* Carousel Wrapper */}
//       <div className="overflow-hidden w-full" ref={emblaRef}>
//         <div className="flex">
//           {/* Carousel Slides */}
//           {data.map((comic) => (
//             <div
//               key={comic._id}
//               className="flex-[0_0_100%] flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 lg:gap-8 h-full"
//             >
//               {/* Image Section */}
//               <div className="w-full md:w-5/12 flex justify-center">
//                 <Image
//                   src={urlFor(comic.image).url()} // Fetch image URL from Sanity
//                   alt={comic.current_slug} // Use slug as alt text
//                   width={200}
//                   height={300}
//                   className="rounded-lg shadow-md object-cover max-w-full sm:w-[250px] sm:h-[375px] md:w-[300px] md:h-[450px] lg:w-[280px] lg:h-[420px]"
//                   priority={true}
//                 />
//               </div>
//               {/* Text Section */}
//               <div className="w-full md:w-6/12 text-center md:text-left">
//                 <h1 className="text-lg sm:text-xl md:text-3xl lg:text-2.5xl font-bold text-gray-900 dark:text-gray-100 mb-2 md:mb-4">
//                   {comic.title}
//                 </h1>
//                 <p className="text-xs sm:text-sm md:text-lg lg:text-base text-gray-700 dark:text-gray-300 mb-2">
//                   <span className="font-semibold">Author:</span> {comic.author}
//                 </p>
//                 <p className="text-xs sm:text-sm md:text-base lg:text-sm text-gray-600 dark:text-gray-400 mb-4">
//                   {comic.description}
//                 </p>
//                 {/* Add to Cart Button */}
//                 {userId ? (
//                   <button
//                     onClick={() => toggleCartStatus(comic._id)}
//                     className={`py-2 px-4 text-sm rounded-full ${
//                       cartStatus[comic._id]
//                         ? "bg-gradient-to-r from-red-500 to-red-700 text-white"
//                         : "bg-gradient-to-r from-blue-500 to-green-500 text-white"
//                     }`}
//                   >
//                     {cartStatus[comic._id] ? "Remove from Cart" : "Add to Cart"}
//                   </button>
//                 ) : (
//                   <LoginLink>
//                     <button className="py-2 px-4 text-sm rounded-full bg-gradient-to-r from-blue-500 to-green-500 text-white">
//                       Add to Cart
//                     </button>
//                   </LoginLink>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Dots Navigation */}
//       <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
//         {dots.map((_, index) => (
//           <button
//             key={index}
//             className={`w-3 h-3 rounded-full ${
//               index === selectedIndex ? "bg-blue-600" : "bg-gray-400 hover:bg-gray-500"
//             }`}
//             onClick={() => emblaApi && emblaApi.scrollTo(index)}
//           ></button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default BannerCarousel;





// "use client";

// import { useEffect, useState } from "react";
// import useEmblaCarousel from "embla-carousel-react"; // Embla carousel hook
// import Image from "next/image";
// import { urlFor } from "@/sanity/lib/image";
// import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components"; // Kinde Auth LoginLink component
// import CircularProgress from "@mui/material/CircularProgress"; // Material UI CircularProgress component

// /**
//  * Renders a carousel of "banner" comics/products.
//  * Allows toggling cart status: add/remove from cart.
//  */
// export default function BannerCarousel({ data, userId }) {
//   const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }); // Initialize Embla carousel with looping
//   const [selectedIndex, setSelectedIndex] = useState(0); // Currently selected slide index
//   const [dots, setDots] = useState([]); // For dot navigation below the carousel
//   const [cartStatus, setCartStatus] = useState({}); // { [productId]: boolean (inCart or not) }
//   const [loading, setLoading] = useState(true); // Show spinner until cart statuses are fetched

//   /**
//    * Fetch cart statuses for all items when userId or data changes.
//    * If user is not logged in, we default everything to false (not in cart).
//    */
//   useEffect(() => {
//     const fetchCartStatuses = async () => {
//       if (!userId) {
//         // If no user, mark everything as "not in cart"
//         const defaultStatuses = data.reduce((acc, comic) => {
//           acc[comic._id] = false;
//           return acc;
//         }, {});
//         setCartStatus(defaultStatuses);
//         setLoading(false);
//         return;
//       }

//       try {
//         // For each item, ask the server if it's in the user's cart
//         const statuses = await Promise.all(
//           data.map(async (comic) => {
//             const response = await fetch("/api/checkcart", {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify({ userId, productId: comic._id }),
//             });
//             if (!response.ok) {
//               throw new Error(`Failed to check cart status for product ${comic._id}`);
//             }
//             const { exists } = await response.json();
//             return { [comic._id]: exists };
//           })
//         );

//         // Combine all statuses into a single object { productId: exists, ... }
//         const combinedStatuses = statuses.reduce((acc, status) => {
//           return { ...acc, ...status };
//         }, {});
//         setCartStatus(combinedStatuses);
//       } catch (error) {
//         console.error("Error fetching cart statuses:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCartStatuses();
//   }, [userId, data]);

//   /**
//    * Toggle cart status for a product.
//    * If it's currently in cart, remove it; otherwise, add it.
//    * Also dispatch "cartUpdated" after success, so your global badge updates.
//    */
//   const toggleCartStatus = async (productId) => {
//     if (!userId) return; // Do nothing if user is not logged in

//     try {
//       // Decide whether to add or remove based on the current status
//       const action = cartStatus[productId] ? "removecart" : "addcart";
//       const response = await fetch(`/api/${action}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId, productId }),
//       });

//       if (!response.ok) {
//         throw new Error(
//           `Failed to ${cartStatus[productId] ? "remove" : "add"} item to cart`
//         );
//       }

//       // Update our local UI state
//       setCartStatus((prev) => ({
//         ...prev,
//         [productId]: !prev[productId],
//       }));

//       // DISPATCH the cartUpdated event so your badge and other listeners re-fetch
//       if (typeof window !== "undefined") {
//         window.dispatchEvent(new Event("cartUpdated"));
//       }
//     } catch (error) {
//       console.error("Error toggling cart status:", error);
//     }
//   };

//   /**
//    * Setup Embla carousel and update dots when the API is ready.
//    */
//   useEffect(() => {
//     if (!emblaApi) return;

//     // Called every time we switch slides
//     const onSelect = () => {
//       setSelectedIndex(emblaApi.selectedScrollSnap());
//     };
//     setDots(Array.from({ length: emblaApi.slideNodes().length })); // # of slides
//     emblaApi.on("select", onSelect);

//     return () => {
//       emblaApi.off("select", onSelect);
//     };
//   }, [emblaApi]);

//   // Show spinner while fetching cart statuses
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <CircularProgress size={60} />
//       </div>
//     );
//   }

//   return (
//     <div className="relative w-full h-full pt-[8vh] flex items-center justify-center">
//       {/* Carousel Wrapper */}
//       <div className="overflow-hidden w-full" ref={emblaRef}>
//         <div className="flex">
//           {/* Carousel Slides */}
//           {data.map((comic) => (
//             <div
//               key={comic._id}
//               className="flex-[0_0_100%] flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 lg:gap-8 h-full"
//             >
//               {/* Image Section */}
//               <div className="w-full md:w-5/12 flex justify-center">
//                 <Image
//                   src={urlFor(comic.image).url()}
//                   alt={comic.current_slug}
//                   width={200}
//                   height={300}
//                   className="rounded-lg shadow-md object-cover max-w-full sm:w-[250px] sm:h-[375px] md:w-[300px] md:h-[450px] lg:w-[280px] lg:h-[420px]"
//                   priority={true}
//                 />
//               </div>

//               {/* Text Section */}
//               <div className="w-full md:w-6/12 text-center md:text-left">
//                 <h1 className="text-lg sm:text-xl md:text-3xl lg:text-2.5xl font-bold text-gray-900 dark:text-gray-100 mb-2 md:mb-4">
//                   {comic.title}
//                 </h1>
//                 <p className="text-xs sm:text-sm md:text-lg lg:text-base text-gray-700 dark:text-gray-300 mb-2">
//                   <span className="font-semibold">Author:</span> {comic.author}
//                 </p>
//                 <p className="text-xs sm:text-sm md:text-base lg:text-sm text-gray-600 dark:text-gray-400 mb-4">
//                   {comic.description}
//                 </p>
//                 {/* Add/Remove Cart Button */}
//                 {userId ? (
//                   <button
//                     onClick={() => toggleCartStatus(comic._id)}
//                     className={`py-2 px-4 text-sm rounded-full ${
//                       cartStatus[comic._id]
//                         ? "bg-gradient-to-r from-red-500 to-red-700 text-white"
//                         : "bg-gradient-to-r from-blue-500 to-green-500 text-white"
//                     }`}
//                   >
//                     {cartStatus[comic._id] ? "Remove from Cart" : "Add to Cart"}
//                   </button>
//                 ) : (
//                   <LoginLink>
//                     <button className="py-2 px-4 text-sm rounded-full bg-gradient-to-r from-blue-500 to-green-500 text-white">
//                       Add to Cart
//                     </button>
//                   </LoginLink>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Dots Navigation */}
//       <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
//         {dots.map((_, index) => (
//           <button
//             key={index}
//             className={`w-3 h-3 rounded-full ${
//               index === selectedIndex ? "bg-blue-600" : "bg-gray-400 hover:bg-gray-500"
//             }`}
//             onClick={() => emblaApi && emblaApi.scrollTo(index)}
//           ></button>
//         ))}
//       </div>
//     </div>
//   );
// }






"use client";

import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react"; // Embla carousel hook
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components"; // Kinde Auth LoginLink component
import CircularProgress from "@mui/material/CircularProgress"; // Material UI CircularProgress component

/**
 * Renders a carousel of "banner" comics/products.
 * Allows toggling cart status: add/remove from cart.
 */
export default function BannerCarousel({ data, userId }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }); // Initialize Embla carousel with looping
  const [selectedIndex, setSelectedIndex] = useState(0); // Currently selected slide index
  const [dots, setDots] = useState([]); // For dot navigation below the carousel
  const [cartStatus, setCartStatus] = useState({}); // { [productId]: boolean (inCart or not) }
  const [loading, setLoading] = useState(true); // Show spinner until cart statuses are fetched

  /**
   * Fetch cart statuses for all items in a single API call.
   * If user is not logged in, default all statuses to false (not in cart).
   */
  const fetchCartStatuses = async () => {
    if (!userId) {
      // If no user, mark everything as "not in cart"
      const defaultStatuses = data.reduce((acc, comic) => {
        acc[comic._id] = false;
        return acc;
      }, {});
      setCartStatus(defaultStatuses);
      setLoading(false);
      return;
    }

    try {
      // Fetch statuses for all products in one request
      const productIds = data.map((comic) => comic._id);
      const response = await fetch("/api/checkcart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productIds }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch cart statuses");
      }

      // Parse the response and update the state
      const statuses = await response.json();
      setCartStatus(statuses);
    } catch (error) {
      console.error("Error fetching cart statuses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartStatuses();
  }, [userId, data]);

  /**
   * Toggle cart status for a product.
   * If it's currently in cart, remove it; otherwise, add it.
   */
  const toggleCartStatus = async (productId) => {
    if (!userId) return; // Do nothing if user is not logged in

    try {
      // Decide whether to add or remove based on the current status
      const action = cartStatus[productId] ? "removecart" : "addcart";
      const response = await fetch(`/api/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to ${cartStatus[productId] ? "remove" : "add"} item to cart`
        );
      }

      // Update the local cart status state
      setCartStatus((prev) => ({
        ...prev,
        [productId]: !prev[productId],
      }));

      // Dispatch the cartUpdated event to update other parts of the app
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("cartUpdated"));
      }
    } catch (error) {
      console.error("Error toggling cart status:", error);
    }
  };

  /**
   * Setup Embla carousel and update dots when the API is ready.
   */
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    setDots(Array.from({ length: emblaApi.slideNodes().length }));
    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  // Show spinner while fetching cart statuses
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress size={60} />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full pt-[8vh] flex items-center justify-center">
      {/* Carousel Wrapper */}
      <div className="overflow-hidden w-full" ref={emblaRef}>
        <div className="flex">
          {/* Carousel Slides */}
          {data.map((comic) => (
            <div
              key={comic._id}
              className="flex-[0_0_100%] flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 lg:gap-8 h-full"
            >
              {/* Image Section */}
              <div className="w-full md:w-5/12 flex justify-center">
                <Image
                  src={urlFor(comic.image).url()}
                  alt={comic.current_slug}
                  width={200}
                  height={300}
                  className="rounded-lg shadow-md object-cover max-w-full sm:w-[250px] sm:h-[375px] md:w-[300px] md:h-[450px] lg:w-[280px] lg:h-[420px]"
                  priority={true}
                />
              </div>

              {/* Text Section */}
              <div className="w-full md:w-6/12 text-center md:text-left">
                <h1 className="text-lg sm:text-xl md:text-3xl lg:text-2.5xl font-bold text-gray-900 dark:text-gray-100 mb-2 md:mb-4">
                  {comic.title}
                </h1>
                <p className="text-xs sm:text-sm md:text-lg lg:text-base text-gray-700 dark:text-gray-300 mb-2">
                  <span className="font-semibold">Author:</span> {comic.author}
                </p>
                <p className="text-xs sm:text-sm md:text-base lg:text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {comic.description}
                </p>
                {/* Add/Remove Cart Button */}
                {userId ? (
                  <button
                    onClick={() => toggleCartStatus(comic._id)}
                    className={`py-2 px-4 text-sm rounded-full ${
                      cartStatus[comic._id]
                        ? "bg-gradient-to-r from-red-500 to-red-700 text-white"
                        : "bg-gradient-to-r from-blue-500 to-green-500 text-white"
                    }`}
                  >
                    {cartStatus[comic._id] ? "Remove from Cart" : "Add to Cart"}
                  </button>
                ) : (
                  <LoginLink>
                    <button className="py-2 px-4 text-sm rounded-full bg-gradient-to-r from-blue-500 to-green-500 text-white">
                      Add to Cart
                    </button>
                  </LoginLink>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots Navigation */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {dots.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === selectedIndex ? "bg-blue-600" : "bg-gray-400 hover:bg-gray-500"
            }`}
            onClick={() => emblaApi && emblaApi.scrollTo(index)}
          ></button>
        ))}
      </div>
    </div>
  );
}