import { Search, Filter, Sparkles, MapPin, StarIcon, Dices, ChevronDown, ChevronUp } from 'lucide-react';
import RestaurantDetail from './RestaurantDetail';
import React, { useState } from 'react';
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

  const isDetailView = Boolean(selectedRestaurant);

  return (
    <div className="fixed left-3 right-3 top-3 bottom-3 z-20 flex w-auto flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl sm:left-4 sm:right-auto sm:top-4 sm:bottom-4 sm:w-[400px]">
      <div className="p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white flex-none">
        <h1 className="text-2xl font-bold mb-2">岳麓食纪</h1>
        <p className="text-orange-100 text-sm">发现大学城真实美食</p>
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
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <button
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                  title="筛选"
                >
                  <Filter className="w-5 h-5" />
                </button>

                {showFilterMenu && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-[1000]">
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
                              ? 'bg-orange-100 text-orange-700'
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
                                ? 'bg-orange-100 text-orange-700'
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
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
              <div className="flex items-center justify-between mb-4">
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
                  <StarIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">
                    {showFavorites ? '暂无收藏的餐厅' : '暂无搜索结果'}
                  </p>
                </div>
              ) : (
                displayRestaurants.map((restaurant) => (
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
                ))
              )}
            </div>

            <div className="bg-white border-t border-gray-200 p-4 space-y-3 flex-none">
              <button
                onClick={() => setShowFavorites(!showFavorites)}
                className="w-full flex items-center justify-center space-x-2 py-4 px-6 rounded-xl bg-yellow-500 text-white font-semibold shadow-lg transition-all duration-300 hover:bg-yellow-600 hover:shadow-xl hover:scale-105"
              >
                <StarIcon className="w-5 h-5 fill-current" />
                <span>{showFavorites ? '查看全部' : '我的收藏'}</span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowRandomOptions(!showRandomOptions)}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
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
                      className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center space-x-2"
                    >
                      <Sparkles className="w-5 h-5 text-orange-500" />
                      <span>真实商家转盘</span>
                    </button>
                    <button
                      onClick={() => handleRandomSelect('all')}
                      className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center space-x-2 border-t border-gray-100"
                    >
                      <Dices className="w-5 h-5 text-orange-500" />
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
