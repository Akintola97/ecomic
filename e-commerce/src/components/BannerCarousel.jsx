"use client";

import { SavedItemsContext } from "@/context/SavedItems";
import { urlFor } from "@/sanity/lib/image";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useContext, useEffect, useState, useRef } from "react";

export default function BannerCarousel({ data, isUserAuthenticated }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [dots, setDots] = useState([]);

  const { savedItems, toggleSaveItem } = useContext(SavedItemsContext);

  const timerRef = useRef(null);

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      if (emblaApi) {
        emblaApi.scrollNext();
      }
    }, 6000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());

    setDots(Array.from({ length: emblaApi.slideNodes().length }));

    emblaApi.on("select", onSelect);

    startTimer();

    return () => {
      emblaApi.off("select", onSelect);
      stopTimer();
    };
  }, [emblaApi]);

  return (
    <div
      className="relative w-full h-screen flex items-center justify-center"
      onMouseEnter={stopTimer}
      onMouseLeave={startTimer}
    >
      <div className="overflow-hidden w-full" ref={emblaRef}>
        <div className="flex">
          {data?.map((comic) => {
            const isSaved = savedItems.some((item) => item._id === comic._id);

            return (
              <div
                key={comic._id}
                className="flex-[0_0_100%] flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 lg:gap-8 h-full"
              >
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
                <div className="w-full md:w-6/12 text-center md:text-left">
                  <h1 className="text-lg sm:text-xl md:text-3xl lg:text-2.5xl font-bold text-gray-900 dark:text-gray-100 mb-2 md:mb-4">
                    {comic.title}
                  </h1>
                  <p className="text-xs sm:text-sm md:text-lg lg:text-base text-gray-700 dark:text-gray-300 mb-2">
                    <span className="font-semibold">Author:</span>{" "}
                    {comic.author}
                  </p>
                  <p className="text-xs sm:text-sm md:text-base lg:text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {comic.description}
                  </p>
                  {isUserAuthenticated ? (
                    <button
                      onClick={() => toggleSaveItem(comic)}
                      className={`py-2 px-4 text-sm rounded-full ${isSaved ? "bg-gradient-to-r from-red-500 to-red-700 text-white" : "bg-gradient-to-r from-blue-500 to-green-500 text-white"}`}
                    >
                      {isSaved ? "Remove from Cart" : "Add to Cart"}
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
            );
          })}
        </div>
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {dots?.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${index === selectedIndex ? "bg-blue-600" : "bg-gray-400 hover:bg-gray-500"}`}
            onClick={() => emblaApi && emblaApi.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
}