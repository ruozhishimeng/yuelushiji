import { Star, MapPin, Users, ThumbsUp, MessageCircle, Camera } from 'lucide-react';
import ImageCarousel from './ImageCarousel';
import React from 'react';
import {
  formatAveragePrice,
  formatDistance,
  formatPriceLevel,
  getBusyStatus
} from '../lib/restaurants/display';

const RestaurantCard = ({ restaurant, isSelected, onClick, onToggleFavorite, onToggleLike, onMatchingOpen, onEvaluationOpen }) => {
  const busyStatus = getBusyStatus(restaurant);

  const handleToggleLike = (event) => {
    event.stopPropagation();
    onToggleLike(restaurant.id);
  };

  return (
    <div
      onClick={onClick}
      className={`flex flex-col min-h-[380px] p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
        isSelected
          ? 'border-orange-500 bg-orange-50 shadow-md'
          : 'border-gray-200 bg-white hover:border-orange-300'
      }`}
    >
      <div className="flex-none mb-3">
        <div className="relative">
          <ImageCarousel restaurantName={restaurant.name} images={restaurant.photos} />
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-semibold text-gray-800 text-lg">
                {restaurant.name}
              </h4>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleToggleLike}
                  className={`flex items-center space-x-1 transition-colors ${
                    restaurant.isLiked ? 'text-orange-500' : 'text-gray-500 hover:text-orange-500'
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${restaurant.isLiked ? 'fill-current' : ''}`} />
                  <span className="text-sm">{restaurant.likes || 0}</span>
                </button>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    onToggleFavorite(restaurant.id);
                  }}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
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
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg font-bold text-orange-600">
                {formatAveragePrice(restaurant.avgPrice)}
              </span>
              {typeof restaurant.visitCount === 'number' ? (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  吃过 {restaurant.visitCount} 次
                </span>
              ) : (
                <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full">
                  高德商家
                </span>
              )}
              <span className={`flex items-center space-x-1 text-xs ${busyStatus.color}`}>
                <span className="w-2 h-2 rounded-full bg-current"></span>
                <span>{busyStatus.text}</span>
              </span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="font-medium">{restaurant.rating || '暂无评分'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-orange-600 font-medium">
                  {formatPriceLevel(restaurant.priceLevel)}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{formatDistance(restaurant.distance)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-3 p-2 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 line-clamp-2">{restaurant.location}</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {(restaurant.tags || []).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {restaurant.recentReviews && restaurant.recentReviews.length > 0 ? (
          <div className="border-t border-gray-100 pt-3 mb-3">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">学生评价</span>
            </div>
            <div className="space-y-2">
              {restaurant.recentReviews.slice(0, 2).map((review, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {review.author.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        {review.author}
                      </span>
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
                    <p className="text-sm text-gray-600 line-clamp-2">{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="border-t border-gray-100 pt-3 mb-3">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">暂无真实学生评价</span>
            </div>
            <p className="text-sm text-gray-500">当前仅展示高德商家基础信息，后续可接入学生打卡评价。</p>
          </div>
        )}
      </div>

      <div className="flex-none border-t border-gray-100 pt-3 mt-3">
        <div className="flex space-x-2">
          <button
            onClick={(event) => {
              event.stopPropagation();
              onMatchingOpen(restaurant);
            }}
            className="flex-1 flex items-center justify-center space-x-2 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors duration-200"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-medium">搭一搭</span>
          </button>
          <button
            onClick={(event) => {
              event.stopPropagation();
              onEvaluationOpen(restaurant);
            }}
            className="flex-1 flex items-center justify-center space-x-2 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors duration-200 relative z-20"
          >
            <Camera className="w-4 h-4" />
            <span className="text-sm font-medium">打卡评价</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
