import { useState, useEffect } from "react";

// ✅ Static images from public folder
const staticImages = [
  "/images/1.jpg", "/images/2.jpg", "/images/3.jpg", "/images/4.jpg",
  "/images/5.jpg", "/images/9.jpg", "/images/10.jpg", "/images/12.jpg",
  "/images/13.jpg", "/images/14.jpg", "/images/15.jpg",
  "/images/6.jpg", "/images/7.jpg", "/images/8.jpg", "/images/11.jpg",
  "/images/18.jpg", "/images/19.jpg",
];

export default function Gallery() {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [dynamicImages, setDynamicImages] = useState([]);

  // Combine static and dynamic images
  const allImages = [...dynamicImages, ...staticImages];

  // Fetch dynamic images from backend
  useEffect(() => {
    const fetchDynamicImages = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/gallery');
        if (response.ok) {
          const data = await response.json();
          // Map backend response to full URLs
          const mapped = data.map(img => `http://localhost:5000${img.url}`);
          setDynamicImages(mapped);
        }
      } catch (err) {
        console.error('Error fetching gallery images:', err);
      }
    };
    fetchDynamicImages();
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (lightboxIndex !== null) {
        if (e.key === "ArrowRight") {
          setLightboxIndex((prev) => (prev + 1) % allImages.length);
        }
        if (e.key === "ArrowLeft") {
          setLightboxIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
        }
        if (e.key === "Escape") {
          setLightboxIndex(null);
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, allImages.length]);

  return (
    <section className="w-full min-h-screen py-10">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold mb-10 text-center text-orange-600 dark:text-orange-400">
          Our Gallery
        </h2>

        {/* Masonry Layout */}
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 px-2">
          {allImages.map((src, index) => (
            <div
              key={index}
              className="relative cursor-pointer group overflow-hidden rounded-lg animate-fadeIn"
              onClick={() => setLightboxIndex(index)}
            >
              <img
                src={src}
                alt={`yoga-${index + 1}`}
                loading="lazy"
                className="w-full rounded-lg shadow-md transform group-hover:scale-105 transition duration-500"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                <p className="text-white text-lg font-medium">View Photo</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 bg-white/90 dark:bg-[#120d07] backdrop-blur-md flex items-center justify-center z-[100] animate-fadeIn"
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="relative w-screen h-screen flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Counter */}
            <p className="absolute top-6 left-6 text-gray-800 dark:text-white text-sm bg-white/50 dark:bg-black/50 px-3 py-1.5 rounded-full shadow">
              {lightboxIndex + 1} / {allImages.length}
            </p>

            {/* Image */}
            <img
              src={allImages[lightboxIndex]}
              alt="Full View"
              className="w-full h-full object-contain"
            />

            {/* Download Button */}
            <a
              href={allImages[lightboxIndex]}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-6 right-6 text-white text-sm font-semibold bg-[#b8860b] px-4 py-2 rounded-full hover:bg-[#9a7009] shadow-lg transition"
            >
              <i className="fas fa-download mr-2"></i> Download
            </a>

            {/* Navigation Arrows */}
            <button
              className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-black/20 text-gray-800 dark:text-white text-2xl hover:bg-black/40 hover:text-orange-400 transition"
              onClick={() =>
                setLightboxIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
              }
            >
              ❮
            </button>
            <button
              className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-black/20 text-gray-800 dark:text-white text-2xl hover:bg-black/40 hover:text-orange-400 transition"
              onClick={() =>
                setLightboxIndex((prev) => (prev + 1) % allImages.length)
              }
            >
              ❯
            </button>
          </div>
        </div>
      )}

      {/* Tailwind fade-in animation */}
      <style>
        {`
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-in-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>
    </section>
  );
}
