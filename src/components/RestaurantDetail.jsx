import { ArrowLeft, Star, MapPin, Clock, Users, ThumbsUp, Star as StarIcon, Users as UsersIcon, Camera } from 'lucide-react';
import ImageCarousel from './ImageCarousel';
import React from 'react';

const RestaurantDetail = ({ restaurant, onBack, onToggleFavorite, onToggleLike, onMatchingOpen, onEvaluationOpen }) => {
  const getPriceText = (level) => {
    return '¥'.repeat(level);
  };

  const getDistanceText = (distance) => {
    if (distance < 1000) {
      return `${distance}m`;
    }
    return `${(distance / 1000).toFixed(1)}km`;
  };

  // 繁忙程度逻辑
  const getBusyStatus = () => {
    // 模拟繁忙程度判断逻辑
    if (restaurant.rating >= 4.7) {
      return { status: 'crowded', text: '当前排队较多', color: 'text-red-500' };
    } else if (restaurant.rating >= 4.3) {
      return { status: 'moderate', text: '有少量空位', color: 'text-yellow-500' };
    } else {
      return { status: 'quiet', text: '无需排队', color: 'text-green-500' };
    }
  };

  const busyStatus = getBusyStatus();

  // 模拟热门菜品数据 - 使用真实数据
  const popularDishes = restaurant.hotDishes || [
    { name: '剁椒鱼头', price: 68 },
    { name: '湘味小炒肉', price: 38 },
    { name: '糖醋里脊', price: 32 },
    { name: '麻婆豆腐', price: 22 }
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* 顶部大图横幅 - 固定高度 */}
      <div className="flex-none relative h-48">
        <ImageCarousel restaurantName={restaurant.name} className="h-full" />
        <button
          onClick={onBack}
          className="absolute top-4 left-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={() => onToggleFavorite(restaurant.id)}
          className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-200"
        >
          <Star
            className={`w-5 h-5 ${
              restaurant.isFavorite
                ? 'text-yellow-500 fill-current'
                : 'text-gray-400 hover:text-yellow-500'
            }`}
          />
        </button>
      </div>

      {/* 可滚动内容区域 */}
      <div className="flex-1 overflow-y-auto">
        {/* 核心信息 */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-gray-800">{restaurant.name}</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onToggleLike(restaurant.id)}
                    className={`flex items-center space-x-1 transition-colors ${
                      restaurant.isLiked ? 'text-orange-500' : 'text-gray-500 hover:text-orange-500'
                    }`}
                  >
                    <ThumbsUp className={`w-5 h-5 ${restaurant.isLiked ? 'fill-current' : ''}`} />
                    <span className="text-sm">{restaurant.likes || 0}</span>
                  </button>
                  <button
                    onClick={() => onToggleFavorite(restaurant.id)}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        restaurant.isFavorite
                          ? 'text-yellow-500 fill-current'
                          : 'text-gray-400 hover:text-yellow-500'
                      }`}
                    />
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-medium">{restaurant.rating}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-orange-600 font-medium">
                    {getPriceText(restaurant.priceLevel)}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{getDistanceText(restaurant.distance)}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-orange-600">
                  {restaurant.avgPrice}元
                </span>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  吃过 {restaurant.visitCount} 次
                </span>
                {/* 繁忙程度组件 - 同步显示 */}
                <span className={`flex items-center space-x-1 text-xs ${busyStatus.color}`}>
                  <span className="w-2 h-2 rounded-full bg-current"></span>
                  <span>{busyStatus.text}</span>
                </span>
              </div>
            </div>
          </div>

          {/* 位置描述 */}
          <div className="mb-3 p-2 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">{restaurant.location}</p>
          </div>

          {/* 标签 */}
          <div className="flex flex-wrap gap-2">
            {restaurant.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 热门菜品 */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">热门菜品</h3>
          <div className="grid grid-cols-2 gap-3">
            {popularDishes.map((dish, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-800">{dish.name}</span>
                <span className="text-orange-600 font-bold">{dish.price}元</span>
              </div>
            ))}
          </div>
        </div>

        {/* 用户评价 */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">用户评价</h3>
          <div className="space-y-4">
            {restaurant.recentReviews && restaurant.recentReviews.map((review, index) => (
              <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {review.author.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-700">{review.author}</span>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < review.rating
                                ? 'text-yellow-500 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{review.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 底部按钮组 - 固定在底部 */}
      <div className="flex-none p-4 border-t border-gray-200 bg-white">
        <div className="flex space-x-2">
          <button
            onClick={() => onMatchingOpen(restaurant)}
            className="flex-1 flex items-center justify-center space-x-2 py-3 bg-orange-50 text-orange-600 rounded-xl hover:bg-orange-100 transition-colors duration-200"
          >
            <UsersIcon className="w-5 h-5" />
            <span>搭一搭</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (typeof onEvaluationOpen === 'function') {
                onEvaluationOpen(restaurant);
              } else {
                console.error('onEvaluationOpen is not a function');
              }
            }}
            className="flex-1 flex items-center justify-center space-x-2 py-3 bg-orange-50 text-orange-600 rounded-xl hover:bg-orange-100 transition-colors duration-200 relative z-20"
          >
            <Camera className="w-5 h-5" />
            <span>打卡评价</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;
