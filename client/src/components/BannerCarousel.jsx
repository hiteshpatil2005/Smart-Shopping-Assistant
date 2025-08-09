import React, { useState, useEffect } from "react";

const BannerCarousel = () => {
  const banners = [
    "/banners/banner-1.jpg",
    "/banners/banner-2.webp",
    "/banners/banner-3.png",
    "/banners/banner-4.webp",
    "/banners/banner-5.webp"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <div className="px-4 sm:px-8 md:px-16">
      <div className="relative w-full h-[220px] sm:h-[320px] md:h-[450px] overflow-hidden">
        {/* Slides */}
        {banners.map((banner, index) => (
          <img
            key={index}
            src={banner}
            alt={`Banner ${index + 1}`}
            className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {/* Navigation dots */}
        <div className="absolute bottom-4 w-full flex justify-center space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentIndex ? "bg-white" : "bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BannerCarousel;
