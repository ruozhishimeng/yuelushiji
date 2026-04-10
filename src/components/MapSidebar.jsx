import { Search, Filter, Star, Sparkles, MapPin, StarIcon, Dices, ChevronDown, Users, ChevronUp, Clock } from 'lucide-react';
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
  onSpinClick,
  onToggleFavorite,
  onViewReviews,
  onMatchingOpen,
  onEvaluationOpen
}) => {
  const [showFavorites, setShowFavorites] = useState(false);
  const [showRandomOptions, setShowRandomOptions] = useState(false);
  const [currentView, setCurrentView] = useState('list'); // 'list' or 'detail'
  const [detailRestaurant, setDetailRestaurant] = useState(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    sortBy: 'distance',
    status: 'all',
    category: 'all'
  });

  // 过滤收藏餐厅
  const favoriteRestaurants = restaurants.filter(restaurant => restaurant.isFavorite);
  const displayRestaurants = showFavorites ? favoriteRestaurants : restaurants;

  // 随机选择餐厅
  const handleRandomSelect = (type) => {
    let sourceRestaurants = [];
    
    if (type === 'favorites') {
      sourceRestaurants = favoriteRestaurants;
    } else {
      sourceRestaurants = restaurants;
    }
    
    if (sourceRestaurants.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * sourceRestaurants.length);
    const randomRestaurant = sourceRestaurants[randomIndex];
    handleRestaurantSelect(randomRestaurant);
    setShowRandomOptions(false);
  };

  // 处理餐厅选择
  const handleRestaurantSelect = (restaurant) => {
    setDetailRestaurant(restaurant);
    setCurrentView('detail');
    onRestaurantSelect(restaurant);
  };

  // 返回列表视图
  const handleBackToList = () => {
    setCurrentView('list');
    setDetailRestaurant(null);
  };

  // 处理筛选选项变化
  const handleFilterChange = (key, value) => {
    setFilterOptions(prev => ({
      ...prev,
      [key]: value
    }));
    
    // 应用筛选逻辑
    if (key === 'sortBy') {
      onSortChange(value);
    } else if (key === 'category') {
      onCategoryFilter(value);
    }
    
    // 关闭筛选菜单
    setShowFilterMenu(false);
  };

  return (
    <div className="w-[400px] h-screen bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col fixed left-4 top-4 bottom-4">
      {/* 头部 */}
      <div className="p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white flex-none">
        <h1 className="text-2xl font-bold mb-2">岳麓食纪</h1>
        <p className="text-orange-100 text-sm">发现大学城最in美食</p>
      </div>

      {/* 搜索和筛选 */}
      <div className="p-4 border-b border-gray-200 bg-white flex-none relative">
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
              
              {/* 筛选菜单 - 修复z-index和定位问题 */}
              {showFilterMenu && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-[1000]">
                  <div className="p-2">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">排序方式</h4>
                    <button
                      onClick={() => handleFilterChange('sortBy', 'distance')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                        filterOptions.sortBy === 'distance' 
                          ? 'bg-orange-100 text-orange-700' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      距离最近
                    </button>
                    <button
                      onClick={() => handleFilterChange('sortBy', 'price')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                        filterOptions.sortBy === 'price' 
                          ? 'bg-orange-100 text-orange-700' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      价格最低
                    </button>
                    <button
                      onClick={() => handleFilterChange('sortBy', 'rating')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                        filterOptions.sortBy === 'rating' 
                          ? 'bg-orange-100 text-orange-700' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      评分最高
                    </button>
                  </div>
                  
                  <div className="border-t border-gray-100 p-2">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">状态筛选</h4>
                    <button
                      onClick={() => handleFilterChange('status', 'noQueue')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                        filterOptions.status === 'noQueue' 
                          ? 'bg-orange-100 text-orange-700' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      无需排队
                    </button>
                    <button
                      onClick={() => handleFilterChange('status', 'recommended')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                        filterOptions.status === 'recommended' 
                          ? 'bg-orange-100 text-orange-700' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      学生力荐
                    </button>
                  </div>

                  <div className="border-t border-gray-100 p-2">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">美食分类</h4>
                    <div className="space-y-1">
                      <button
                        onClick={() => handleFilterChange('category', 'all')}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                          activeCategory === 'all' 
                            ? 'bg-orange-100 text-orange-700' 
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        全部
                      </button>
                      <button
                        onClick={() => handleFilterChange('category', '午饭')}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                          activeCategory === '午饭' 
                            ? 'bg-orange-100 text-orange-700' 
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        午饭/晚饭
                      </button>
                      <button
                        onClick={() => handleFilterChange('category', '奶茶')}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                          activeCategory === '奶茶' 
                            ? 'bg-orange-100 text-orange-700' 
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        奶茶/饮品
                      </button>
                      <button
                        onClick={() => handleFilterChange('category', '快餐')}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                          activeCategory === '快餐' 
                            ? 'bg-orange-100 text-orange-700' 
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        快餐/简餐
                      </button>
                      <button
                        onClick={() => handleFilterChange('category', '长沙特色')}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                          activeCategory === '长沙特色' 
                            ? 'bg-orange-100 text-orange-700' 
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        长沙特色
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 移除了搜索框下方的三个简单筛选按钮 */}
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-hidden">
        {currentView === 'list' ? (
          <div className="h-full flex flex-col">
            {/* 餐厅列表 - 添加滚动 */}
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
                    onClick={() => handleRestaurantSelect(restaurant)}
                    onToggleFavorite={onToggleFavorite}
                    onViewReviews={onViewReviews}
                    onMatchingOpen={onMatchingOpen}
                    onEvaluationOpen={onEvaluationOpen}
                  />
                ))
              )}
            </div>

            {/* 底部按钮组 - 使用固定定位确保不超出边界 */}
            <div className="bg-white border-t border-gray-200 p-4 space-y-3 flex-none">
              {/* 收藏按钮 */}
              <button
                onClick={() => setShowFavorites(!showFavorites)}
                className={`w-full flex items-center justify-center space-x-2 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  showFavorites
                    ? 'bg-yellow-500 text-white shadow-lg'
                    : 'bg-white text-yellow-600 border-2 border-yellow-500 hover:bg-yellow-50'
                }`}
              >
                <StarIcon className={`w-5 h-5 ${showFavorites ? 'fill-current' : ''}`} />
                <span>{showFavorites ? '查看全部' : '我的收藏'}</span>
              </button>

              {/* 智选按钮 - 合并随机选择功能 */}
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
                
                {/* 智选选项 - 提升z-index确保显示在卡片按钮之上 */}
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
                      <span>AI 智选</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowRandomOptions(false);
                        handleRandomSelect('all');
                      }}
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
            restaurant={detailRestaurant}
            onBack={handleBackToList}
            onToggleFavorite={onToggleFavorite}
            onToggleLike={(id) => {
              // 点赞逻辑
              const updatedRestaurants = restaurants.map(restaurant => {
                if (restaurant.id === id) {
                  return { 
                    ...restaurant, 
                    isLiked: !restaurant.isLiked,
                    likes: restaurant.isLiked ? (restaurant.likes || 0) - 1 : (restaurant.likes || 0) + 1
                  };
                }
                return restaurant;
              });
              // 这里应该调用父组件的更新函数
            }}
            onMatchingOpen={onMatchingOpen}
            onEvaluationOpen={onEvaluationOpen}
          />
        )}
      </div>
    </div>
  );
};

export default MapSidebar;
