import { Search, Filter, Sparkles, MapPin, Heart, Dices, ChevronDown, ChevronUp } from 'lucide-react';
import RestaurantDetail from './RestaurantDetail';
import React, { useEffect, useRef, useState } from 'react';
import RestaurantCard from './RestaurantCard';

const MapSidebar = ({
  restaurants,
  selectedRestaurant,
  searchTerm,
  sortBy,
  activeCategory,
  onSearchChange,
  onSortChange,
  onCategoryFilter,
  onRestaurantSelect,
  onBackToList,
  onSpinClick,
  onToggleFavorite,
  onToggleLike,
  onViewReviews,
  onMatchingOpen,
  onEvaluationOpen
}) => {
  const [showFavorites, setShowFavorites] = useState(false);
  const [showRandomOptions, setShowRandomOptions] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [scrollbar, setScrollbar] = useState({ visible: false, top: 0, height: 0 });
  const scrollHideTimerRef = useRef(null);

  const favoriteRestaurants = restaurants.filter(restaurant => restaurant.isFavorite);
  const displayRestaurants = showFavorites ? favoriteRestaurants : restaurants;

  const handleRandomSelect = (type) => {
    const sourceRestaurants = type === 'favorites' ? favoriteRestaurants : restaurants;
    if (sourceRestaurants.length === 0) return;

    const randomIndex = Math.floor(Math.random() * sourceRestaurants.length);
    onRestaurantSelect(sourceRestaurants[randomIndex]);
    setShowRandomOptions(false);
  };

  const handleFilterChange = (key, value) => {
    if (key === 'sortBy') {
      onSortChange(value);
    } else if (key === 'category') {
      onCategoryFilter(value);
    }

    setShowFilterMenu(false);
  };

  const handleListScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const canScroll = scrollHeight > clientHeight;

    if (!canScroll) {
      setScrollbar({ visible: false, top: 0, height: 0 });
      return;
    }

    const trackHeight = Math.max(clientHeight - 16, 0);
    const thumbHeight = Math.max(36, (clientHeight / scrollHeight) * trackHeight);
    const maxThumbTop = Math.max(trackHeight - thumbHeight, 0);
    const thumbTop = (scrollTop / (scrollHeight - clientHeight)) * maxThumbTop;

    setScrollbar({
      visible: true,
      top: thumbTop,
      height: thumbHeight
    });

    window.clearTimeout(scrollHideTimerRef.current);
    scrollHideTimerRef.current = window.setTimeout(() => {
      setScrollbar(current => ({ ...current, visible: false }));
    }, 700);
  };

  useEffect(() => {
    return () => window.clearTimeout(scrollHideTimerRef.current);
  }, []);

  const isDetailView = Boolean(selectedRestaurant);

  return (
    <div className="fixed bottom-3 left-3 right-3 top-3 z-20 flex w-auto flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg sm:bottom-4 sm:left-4 sm:right-auto sm:top-4 sm:w-[400px]">
      <div className="relative flex-none overflow-hidden bg-brand-primarySubtle h-36 sm:h-40">
        <img
          src="/assets/yuelu-sidebar-hero.png"
          alt="岳麓食纪山水题字"
          className="h-full w-full object-cover object-center"
          loading="eager"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent via-white/75 to-white" />
        <div className="sr-only">
          岳麓食纪，发现大学城真实美食
        </div>
      </div>

      {!isDetailView && (
        <div className="relative z-30 flex-none border-b border-gray-200 bg-white p-4">
          <div className="relative mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="搜索餐厅或美食..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-12 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <button
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  aria-label="打开筛选菜单"
                  className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-brand-primarySubtle hover:text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  title="筛选"
                >
                  <Filter className="w-5 h-5" />
                </button>

                {showFilterMenu && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-[1000]">
                    <div className="p-2">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">排序方式</h4>
                      {[
                        ['distance', '距离最近'],
                        ['price', '价格最低'],
                        ['rating', '评分最高']
                      ].map(([value, label]) => (
                        <button
                          key={value}
                          onClick={() => handleFilterChange('sortBy', value)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                            sortBy === value
                              ? 'bg-brand-primarySoft text-brand-primaryHover'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    <div className="border-t border-gray-100 p-2">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">状态筛选</h4>
                      <div className="px-3 py-2 rounded-lg text-sm text-gray-400">
                        待接入实时排队数据
                      </div>
                    </div>

                    <div className="border-t border-gray-100 p-2">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">美食分类</h4>
                      <div className="space-y-1">
                        {[
                          ['all', '全部'],
                          ['午饭', '午饭/晚饭'],
                          ['奶茶', '奶茶/饮品'],
                          ['快餐', '快餐/简餐'],
                          ['长沙特色', '长沙特色']
                        ].map(([value, label]) => (
                          <button
                            key={value}
                            onClick={() => handleFilterChange('category', value)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                              activeCategory === value
                                ? 'bg-brand-primarySoft text-brand-primaryHover'
                                : 'hover:bg-gray-100'
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        {!isDetailView ? (
          <div className="h-full flex flex-col">
            <div className="relative min-h-0 flex-1 bg-white">
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

              {scrollbar.height > 0 && (
                <div
                  className={`pointer-events-none absolute bottom-2 right-1 top-2 w-1.5 transition-opacity duration-200 ${
                    scrollbar.visible ? 'opacity-100' : 'opacity-0'
                  }`}
                  aria-hidden="true"
                >
                  <div
                    className="absolute right-0 w-1.5 rounded-full bg-slate-400/55"
                    style={{
                      height: `${scrollbar.height}px`,
                      transform: `translateY(${scrollbar.top}px)`
                    }}
                  />
                </div>
              )}
            </div>

            <div className="bg-white border-t border-gray-200 p-4 space-y-3 flex-none">
              <button
                onClick={() => setShowFavorites(!showFavorites)}
                className="flex w-full items-center justify-center space-x-2 rounded-xl border border-gray-200 bg-white px-6 py-4 font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:border-amber-200 hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
              >
                <Heart className="w-5 h-5 fill-current text-brand-warning" />
                <span>{showFavorites ? '查看全部' : '我的收藏'}</span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowRandomOptions(!showRandomOptions)}
                  className="flex w-full items-center justify-center space-x-2 rounded-xl bg-brand-primary px-6 py-4 font-semibold text-white shadow-md transition-all duration-200 hover:bg-brand-primaryHover hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>智选</span>
                  {showRandomOptions ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronUp className="w-4 h-4" />
                  )}
                </button>

                {showRandomOptions && (
                  <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-[1000]">
                    <button
                      onClick={() => {
                        setShowRandomOptions(false);
                        onSpinClick();
                      }}
                      className="flex w-full items-center space-x-2 px-4 py-3 text-left transition-colors hover:bg-brand-primarySubtle"
                    >
                      <Sparkles className="w-5 h-5 text-brand-primary" />
                      <span>真实商家转盘</span>
                    </button>
                    <button
                      onClick={() => handleRandomSelect('all')}
                      className="flex w-full items-center space-x-2 border-t border-gray-100 px-4 py-3 text-left transition-colors hover:bg-brand-primarySubtle"
                    >
                      <Dices className="w-5 h-5 text-brand-primary" />
                      <span>趣味盲选</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <RestaurantDetail
            restaurant={selectedRestaurant}
            onBack={onBackToList}
            onToggleFavorite={onToggleFavorite}
            onToggleLike={onToggleLike}
            onMatchingOpen={onMatchingOpen}
            onEvaluationOpen={onEvaluationOpen}
          />
        )}
      </div>
    </div>
  );
};

export default MapSidebar;
