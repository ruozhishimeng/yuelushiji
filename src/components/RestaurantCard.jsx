import { Heart, ImageOff, Star, MapPin, ThumbsUp, MessageCircle, Camera } from 'lucide-react';
import React, { memo } from 'react';
import {
  formatAveragePrice,
  formatDistance,
  formatPriceLevel,
  formatReviewCount
} from '../lib/restaurants/display';

const RestaurantCard = ({ restaurant, isSelected, onClick, onToggleFavorite, onToggleLike, onMatchingOpen, onEvaluationOpen }) => {
  const coverImage = Array.isArray(restaurant.photos)
    ? restaurant.photos.find(Boolean)
    : null;

  const handleToggleLike = (event) => {
    event.stopPropagation();
    onToggleLike(restaurant.id);
  };

  const handleCardKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleCardKeyDown}
      className={`flex min-h-[124px] cursor-pointer gap-3 rounded-xl border p-3 transition-all duration-200 hover:border-brand-primarySoft hover:bg-brand-primarySubtle/50 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 ${
        isSelected
          ? 'border-brand-primary bg-brand-paper shadow-sm'
          : 'border-brand-paperDeep bg-brand-paperSoft'
      }`}
    >
      <div className="h-24 w-24 flex-none overflow-hidden rounded-lg border border-brand-paperDeep bg-brand-paper">
        {coverImage ? (
          <img
            src={coverImage}
            alt={restaurant.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center text-brand-primary">
            <ImageOff className="mb-1 h-6 w-6" />
            <span className="text-[11px] font-medium">暂无图片</span>
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <h4 className="line-clamp-1 text-base font-semibold text-gray-900">
              {restaurant.name}
            </h4>

            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
              <span className="flex items-center gap-1 font-medium text-gray-800">
                <Star className="h-4 w-4 fill-current text-brand-warning" />
                {restaurant.rating || '暂无评分'}
              </span>
              <span className="text-gray-500">{formatReviewCount(restaurant)}</span>
              <span className="font-semibold text-brand-primary">
                {formatAveragePrice(restaurant.avgPrice)}
              </span>
              <span className="text-gray-500">{formatPriceLevel(restaurant.priceLevel)}</span>
            </div>
          </div>

          <button
            onClick={(event) => {
              event.stopPropagation();
              onToggleFavorite(restaurant.id);
            }}
            aria-label={restaurant.isFavorite ? '取消收藏餐厅' : '收藏餐厅'}
            className="flex h-11 w-11 flex-none items-center justify-center rounded-lg transition-colors hover:bg-amber-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-warning focus-visible:ring-offset-2"
          >
            <Heart
              className={`h-5 w-5 ${
                restaurant.isFavorite
                  ? 'fill-current text-brand-warning'
                  : 'text-gray-400 hover:text-brand-warning'
              }`}
            />
          </button>
        </div>

        <div className="mt-1 flex min-w-0 items-center gap-1 text-xs text-gray-500">
          <MapPin className="h-4 w-4 flex-none text-gray-400" />
          <span className="line-clamp-1">
            {formatDistance(restaurant.distance)} · {restaurant.location}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-end gap-1 pt-2">
            <button
              onClick={handleToggleLike}
              aria-label={restaurant.isLiked ? '取消点赞' : '点赞'}
              className={`flex h-11 items-center gap-1 rounded-lg px-2 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
                restaurant.isLiked
                  ? 'bg-brand-paper text-brand-primary'
                  : 'text-gray-500 hover:bg-brand-primarySubtle hover:text-brand-primary'
              }`}
            >
              <ThumbsUp className={`h-4 w-4 ${restaurant.isLiked ? 'fill-current' : ''}`} />
              <span>{restaurant.likes || 0}</span>
            </button>
            <button
              onClick={(event) => {
                event.stopPropagation();
                onMatchingOpen(restaurant);
              }}
              aria-label={`为${restaurant.name}找饭搭子`}
              title="搭一搭"
              className="flex h-11 w-11 items-center justify-center rounded-lg text-brand-primary transition-colors hover:bg-brand-primarySubtle focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              <MessageCircle className="h-4 w-4" />
            </button>
            <button
              onClick={(event) => {
                event.stopPropagation();
                onEvaluationOpen(restaurant);
              }}
              aria-label={`为${restaurant.name}打卡评价`}
              title="打卡评价"
              className="flex h-11 w-11 items-center justify-center rounded-lg text-brand-primary transition-colors hover:bg-brand-primarySubtle focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              <Camera className="h-4 w-4" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default memo(RestaurantCard);
