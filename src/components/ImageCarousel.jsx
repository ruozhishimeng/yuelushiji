import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';
import React, { useMemo, useState } from 'react';

const ImageCarousel = ({ restaurantName, images = [], className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const validImages = useMemo(
    () => (Array.isArray(images) ? images.filter(Boolean) : []),
    [images]
  );

  const handlePrev = (event) => {
    event.stopPropagation();
    setCurrentIndex(prev => (prev === 0 ? validImages.length - 1 : prev - 1));
  };

  const handleNext = (event) => {
    event.stopPropagation();
    setCurrentIndex(prev => (prev === validImages.length - 1 ? 0 : prev + 1));
  };

  if (validImages.length === 0) {
    return (
      <div className={`h-32 rounded-lg bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-100 flex flex-col items-center justify-center text-orange-500 ${className}`}>
        <ImageOff className="w-8 h-8 mb-2" />
        <span className="text-xs font-medium">暂无真实图片</span>
      </div>
    );
  }

  return (
    <div className={`relative h-32 rounded-lg overflow-hidden bg-gray-100 ${className}`}>
      <img
        src={validImages[currentIndex]}
        alt={restaurantName}
        className="w-full h-full object-cover"
        loading="lazy"
      />

      {validImages.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60"
            aria-label="上一张"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60"
            aria-label="下一张"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
            {validImages.map((_, index) => (
              <span
                key={index}
                className={`w-1.5 h-1.5 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageCarousel;
