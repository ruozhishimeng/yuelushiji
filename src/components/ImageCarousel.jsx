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
      <div className={`h-32 rounded-lg bg-brand-paper border border-brand-paperDeep flex flex-col items-center justify-center text-brand-primary ${className}`}>
        <ImageOff className="w-8 h-8 mb-2" />
        <span className="text-xs font-medium">暂无真实图片</span>
      </div>
    );
  }

  return (
    <div className={`relative h-32 rounded-lg overflow-hidden bg-brand-paper ${className}`}>
      <img
        src={validImages[currentIndex]}
        alt={`${restaurantName} - 图片 ${currentIndex + 1}/${validImages.length}`}
        className="w-full h-full object-cover"
        loading="lazy"
      />

      {validImages.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/45 text-white hover:bg-black/65 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="上一张"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/45 text-white hover:bg-black/65 focus:outline-none focus:ring-2 focus:ring-white"
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
