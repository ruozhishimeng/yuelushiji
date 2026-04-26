import { ArrowLeft, Heart, Star, MapPin, ThumbsUp, Users as UsersIcon, Camera } from 'lucide-react';
import ImageCarousel from './ImageCarousel';
import React, { memo } from 'react';
import {
  formatAveragePrice,
  formatDistance,
  formatPriceLevel,
  formatReviewCount,
  getBusyStatus
} from '../lib/restaurants/display';

const RestaurantDetail = ({ restaurant, onBack, onToggleFavorite, onToggleLike, onMatchingOpen, onEvaluationOpen }) => {
  const busyStatus = getBusyStatus(restaurant);
  const popularDishes = restaurant.hotDishes || [];

  return (
    <div className="flex flex-col h-full bg-brand-paperSoft">
      <div className="flex-none relative h-48">
        <ImageCarousel restaurantName={restaurant.name} images={restaurant.photos} className="h-full" />
        <button
          onClick={onBack}
          aria-label="返回餐厅列表"
          className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-brand-paperSoft/90 shadow-sm transition-all duration-200 hover:bg-brand-paperSoft focus:outline-none focus:ring-2 focus:ring-brand-primary"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-gray-800">{restaurant.name}</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onToggleLike(restaurant.id)}
                    aria-label={restaurant.isLiked ? '取消点赞' : '点赞'}
                    className={`flex items-center space-x-1 transition-colors ${
                      restaurant.isLiked ? 'text-brand-primary' : 'text-gray-500 hover:text-brand-primary'
                    }`}
                  >
                    <ThumbsUp className={`w-5 h-5 ${restaurant.isLiked ? 'fill-current' : ''}`} />
                    <span className="text-sm">{restaurant.likes || 0}</span>
                  </button>
                  <button
                    onClick={() => onToggleFavorite(restaurant.id)}
                    aria-label={restaurant.isFavorite ? '取消收藏餐厅' : '收藏餐厅'}
                    className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-amber-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-warning focus-visible:ring-offset-2"
                  >
                    <Heart
                      className={`w-6 h-6 ${
                        restaurant.isFavorite
                          ? 'text-brand-warning fill-current'
                          : 'text-gray-400 hover:text-brand-warning'
                      }`}
                    />
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-brand-warning fill-current" />
                  <span className="font-medium">{restaurant.rating || '暂无评分'}</span>
                  <span className="text-gray-400">{formatReviewCount(restaurant)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-brand-primary font-medium">
                    {formatPriceLevel(restaurant.priceLevel)}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{formatDistance(restaurant.distance)}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-brand-primary">
                  {formatAveragePrice(restaurant.avgPrice)}
                </span>
                {typeof restaurant.visitCount === 'number' ? (
                  <span className="px-2 py-1 bg-brand-paper text-gray-600 text-xs rounded-full">
                    吃过 {restaurant.visitCount} 次
                  </span>
                ) : null}
                <span className={`flex items-center space-x-1 text-xs ${busyStatus.color}`}>
                  <span className="w-2 h-2 rounded-full bg-current"></span>
                  <span>{busyStatus.text}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="mb-3 p-2 bg-brand-paper rounded-lg">
            <p className="text-sm text-gray-600">{restaurant.location}</p>
            {restaurant.tel && (
              <p className="text-xs text-gray-500 mt-1">电话：{restaurant.tel}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {(restaurant.tags || []).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-brand-primarySoft text-brand-primaryHover text-xs rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">热门菜品</h3>
          {popularDishes.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {popularDishes.map((dish, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-brand-paper rounded-lg">
                  <span className="font-medium text-gray-800">{dish.name}</span>
                  <span className="text-brand-primary font-bold">{dish.price}元</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 bg-brand-paper rounded-lg text-sm text-gray-500">
              暂无真实菜品数据，后续可由学生打卡或商家信息补充。
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">用户评价</h3>
          {restaurant.recentReviews && restaurant.recentReviews.length > 0 ? (
            <div className="space-y-4">
              {restaurant.recentReviews.map((review, index) => (
                <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
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
                                  ? 'text-brand-warning fill-current'
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
          ) : (
            <div className="p-3 bg-brand-paper rounded-lg text-sm text-gray-500">
              暂无真实学生评价。当前商家信息来自高德 POI，评价体系需要接入学生打卡后生成。
            </div>
          )}
        </div>
      </div>

      <div className="flex-none p-4 border-t border-brand-paperDeep bg-brand-paperSoft">
        <div className="flex space-x-2">
          <button
            onClick={() => onMatchingOpen(restaurant)}
            className="flex-1 flex items-center justify-center space-x-2 py-3 bg-brand-paper text-brand-primary rounded-xl hover:bg-brand-primarySoft transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            <UsersIcon className="w-5 h-5" />
            <span>搭一搭</span>
          </button>
          <button
            onClick={(event) => {
              event.stopPropagation();
              onEvaluationOpen(restaurant);
            }}
            className="relative z-20 flex-1 flex items-center justify-center space-x-2 rounded-xl bg-brand-paper py-3 text-brand-primary transition-colors duration-200 hover:bg-brand-primarySoft focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            <Camera className="w-5 h-5" />
            <span>打卡评价</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(RestaurantDetail);
