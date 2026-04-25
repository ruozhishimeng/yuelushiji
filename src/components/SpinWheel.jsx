import React, { useState, useRef } from 'react';
import { X, Sparkles } from 'lucide-react';

const SpinWheel = ({ restaurants, onResult, onClose }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const wheelRef = useRef(null);

  const hasRestaurants = restaurants.length > 0;
  const segmentAngle = hasRestaurants ? 360 / restaurants.length : 0;

  const handleSpin = () => {
    if (isSpinning || !hasRestaurants) return;

    setIsSpinning(true);
    
    // 随机选择餐厅
    const randomIndex = Math.floor(Math.random() * restaurants.length);
    const selected = restaurants[randomIndex];
    
    // 计算目标角度
    const targetAngle = randomIndex * segmentAngle;
    const spins = 5; // 转5圈
    const finalRotation = spins * 360 + targetAngle;
    
    setRotation(finalRotation);
    
    setTimeout(() => {
      setSelectedRestaurant(selected);
      setIsSpinning(false);
    }, 3000);
  };

  const handleConfirm = () => {
    if (selectedRestaurant) {
      onResult(selectedRestaurant);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-brand-primary" />
            <span>今天吃什么？</span>
          </h2>
          <button
            onClick={onClose}
            aria-label="关闭智选转盘"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* 转盘 */}
        <div className="relative w-64 h-64 mx-auto mb-6">
          <div
            ref={wheelRef}
            className="w-full h-full rounded-full border-8 border-brand-primary relative overflow-hidden shadow-lg"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? 'transform 3s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none'
            }}
          >
            {hasRestaurants ? restaurants.map((restaurant, index) => {
              const angle = index * segmentAngle;
              const nextAngle = (index + 1) * segmentAngle;
              
              return (
                <div
                  key={restaurant.id}
                  className="absolute w-full h-full"
                  style={{
                    clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((angle * Math.PI) / 180)}% ${50 + 50 * Math.sin((angle * Math.PI) / 180)}%, ${50 + 50 * Math.cos((nextAngle * Math.PI) / 180)}% ${50 + 50 * Math.sin((nextAngle * Math.PI) / 180)}%)`
                  }}
                >
                  <div
                    className={`w-full h-full flex items-center justify-center text-white font-bold text-sm ${
                      index % 2 === 0 ? 'bg-brand-primary' : 'bg-brand-primaryHover'
                    }`}
                    style={{
                      transform: `rotate(${angle + segmentAngle / 2}deg)`,
                      transformOrigin: 'center'
                    }}
                  >
                    <span
                      style={{
                        transform: `rotate(${-angle - segmentAngle / 2}deg)`,
                        transformOrigin: 'center'
                      }}
                    >
                      {restaurant.name.length > 6 ? restaurant.name.substring(0, 6) + '...' : restaurant.name}
                    </span>
                  </div>
                </div>
              );
            }) : (
              <div className="w-full h-full flex items-center justify-center text-sm text-brand-primary bg-brand-primarySubtle">
                暂无可选商家
              </div>
            )}
          </div>
          
          {/* 指针 */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
            <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-brand-danger"></div>
          </div>
        </div>

        {/* 控制按钮 */}
        <div className="text-center">
          {!selectedRestaurant ? (
            <button
              onClick={handleSpin}
              disabled={isSpinning || !hasRestaurants}
              className={`px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 ${
                isSpinning || !hasRestaurants
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-brand-primary hover:bg-brand-primaryHover shadow-md'
              }`}
            >
              {isSpinning ? '转盘转动中...' : '开始转盘'}
            </button>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-brand-primarySubtle rounded-xl">
                <h3 className="text-lg font-bold text-brand-primaryHover mb-2">
                  推荐结果
                </h3>
                <p className="text-xl font-semibold text-gray-800">
                  {selectedRestaurant.name}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedRestaurant.location}
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleSpin}
                  className="flex-1 px-4 py-2 border border-brand-primary text-brand-primary rounded-xl hover:bg-brand-primarySubtle transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary"
                >
                  重新选择
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 px-4 py-2 bg-brand-primary text-white rounded-xl hover:bg-brand-primaryHover transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
                >
                  就这家了！
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpinWheel;
