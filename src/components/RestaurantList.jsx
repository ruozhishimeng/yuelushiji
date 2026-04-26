import { Heart, MapPin } from 'lucide-react';
import React, { useCallback, useRef, useState } from 'react';
import RestaurantCard from './RestaurantCard';

const RestaurantList = ({ restaurants, selectedRestaurant, showFavorites, onToggleShowFavorites, onRestaurantSelect, onToggleFavorite, onToggleLike, onViewReviews, onMatchingOpen, onEvaluationOpen }) => {
  const [scrollbarVisible, setScrollbarVisible] = useState(false);
  const thumbRef = useRef(null);
  const scrollHideTimerRef = useRef(null);

  const favoriteRestaurants = restaurants.filter(restaurant => restaurant.isFavorite);
  const displayRestaurants = showFavorites ? favoriteRestaurants : restaurants;

  const handleListScroll = useCallback((event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const canScroll = scrollHeight > clientHeight;

    if (!canScroll) {
      setScrollbarVisible(false);
      return;
    }

    const trackHeight = Math.max(clientHeight - 16, 0);
    const thumbHeight = Math.max(36, (clientHeight / scrollHeight) * trackHeight);
    const maxThumbTop = Math.max(trackHeight - thumbHeight, 0);
    const thumbTop = (scrollTop / (scrollHeight - clientHeight)) * maxThumbTop;

    if (thumbRef.current) {
      thumbRef.current.style.height = `${thumbHeight}px`;
      thumbRef.current.style.transform = `translateY(${thumbTop}px)`;
    }

    setScrollbarVisible(true);
    window.clearTimeout(scrollHideTimerRef.current);
    scrollHideTimerRef.current = window.setTimeout(() => {
      setScrollbarVisible(false);
    }, 700);
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="relative min-h-0 flex-1 bg-brand-paperSoft">
        <div
          onScroll={handleListScroll}
          className="no-scrollbar h-full overflow-y-auto p-4"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              {showFavorites ? `收藏餐厅 (${favoriteRestaurants.length})` : `附近美食 (${restaurants.length})`}
            </h3>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <MapPin className="w-4 h-4" />
              <span>岳麓大学城</span>
            </div>
          </div>

          {displayRestaurants.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">
                {showFavorites ? '暂无收藏的餐厅' : '暂无搜索结果'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {displayRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  isSelected={selectedRestaurant?.id === restaurant.id}
                  onClick={() => onRestaurantSelect(restaurant)}
                  onToggleFavorite={onToggleFavorite}
                  onToggleLike={onToggleLike}
                  onViewReviews={onViewReviews}
                  onMatchingOpen={onMatchingOpen}
                  onEvaluationOpen={onEvaluationOpen}
                />
              ))}
            </div>
          )}
        </div>

        {scrollbarVisible && (
          <div
            className="pointer-events-none absolute bottom-2 right-1 top-2 w-1.5"
            aria-hidden="true"
          >
            <div
              ref={thumbRef}
              className="absolute right-0 w-1.5 rounded-full bg-slate-400/55 transition-transform duration-75"
              style={{ height: '36px' }}
            />
          </div>
        )}
      </div>

      <div className="bg-brand-paperSoft border-t border-brand-paperDeep p-4 flex-none">
        <button
          onClick={onToggleShowFavorites}
          className="flex w-full items-center justify-center space-x-2 rounded-xl border border-brand-paperDeep bg-brand-paperSoft px-6 py-4 font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:border-amber-200 hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
        >
          <Heart className="w-5 h-5 fill-current text-brand-warning" />
          <span>{showFavorites ? '查看全部' : '我的收藏'}</span>
        </button>
      </div>
    </div>
  );
};

export default RestaurantList;