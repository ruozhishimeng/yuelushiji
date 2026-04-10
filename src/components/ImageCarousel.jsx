import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const ImageCarousel = ({ restaurantName, className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  // 根据餐厅名称生成不同类型的图片URL
  const getImageUrl = (index) => {
    // 根据餐厅名称判断类型
    if (restaurantName.includes('奶茶') || restaurantName.includes('茶颜')) {
      return `https://loremflickr.com/400/300/tea?random=${index}`;
    } else if (restaurantName.includes('烧烤') || restaurantName.includes('剁椒') || restaurantName.includes('麻辣烫')) {
      return `https://loremflickr.com/400/300/meat?random=${index}`;
    } else {
      return `https://loremflickr.com/400/300/rice?random=${index}`;
    }
  };

  // 生成3张图片URL
  const images = [
    getImageUrl(1),
    getImageUrl(2),
    getImageUrl(3)
  ];

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleImageClick = () => {
    setShowPreview(true);
  };

  return (
    <>
      <div className={`relative ${className}`}>
        {/* 图片容器 */}
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={images[currentIndex]}
            alt={`${restaurantName} ${currentIndex + 1}`}
            className="w-full h-32 mx-auto object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={handleImageClick}
            style={{ zIndex: 1 }} // 确保图片层级低于下拉菜单
          />
          
          {/* 左右箭头 */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* 指示器 */}
        {images.length > 1 && (
          <div className="flex justify-center space-x-1 mt-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-orange-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* 大图预览模态框 */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setShowPreview(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={images[currentIndex]}
              alt={`${restaurantName} 预览`}
              className="max-w-full max-h-full mx-auto object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ImageCarousel;
