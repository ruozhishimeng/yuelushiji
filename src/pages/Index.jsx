
import AMapLoader from '@amap/amap-jsapi-loader';
import MatchingSystem from '../components/MatchingSystem';
import { mockRestaurants } from '../data/restaurants';
import EvaluationModal from '../components/EvaluationModal';
import UserProfile from '../components/UserProfile';
import SpinWheel from '../components/SpinWheel';
import { Filter, Star, Mic, Search, Sparkles, Locate, MapPin, Users, Clock } from 'lucide-react';
import AIAssistant from '../components/AIAssistant';
import ReviewModal from '../components/ReviewModal';
import React, { useEffect, useRef, useState } from 'react';
import RestaurantCard from '../components/RestaurantCard';
import MapSidebar from '../components/MapSidebar';
const Index = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('distance');
  const [showSpinWheel, setShowSpinWheel] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showMatchingSystem, setShowMatchingSystem] = useState(false);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [selectedReviewRestaurant, setSelectedReviewRestaurant] = useState(null);
  const [selectedEvaluationRestaurant, setSelectedEvaluationRestaurant] = useState(null);
  const [filteredRestaurants, setFilteredRestaurants] = useState(mockRestaurants);
  const [mapError, setMapError] = useState(false);
  const [mapLoading, setMapLoading] = useState(true);
  const [mapLoadAttempts, setMapLoadAttempts] = useState(0);
  const [activeCategory, setActiveCategory] = useState('all'); // 新增分类筛选状态

  useEffect(() => {
    initMap();
  }, []);

  useEffect(() => {
    filterAndSortRestaurants();
  }, [searchTerm, sortBy, activeCategory]); // 添加activeCategory依赖

  const initMap = async () => {
    try {
      setMapLoading(true);
      setMapError(false);
      
      // 配置高德地图安全密钥
      window._AMapSecurityConfig = {
        securityJsCode: "2fc6e8ece40e181c8b8907ffe0e44cac"
      };

      // 使用新的API密钥
      const apiKey = 'cba7a62073cec7700d313a870e35103f';
      
      if (!apiKey) {
        throw new Error('高德地图API密钥未配置');
      }

      // 添加超时处理
      const timeoutPromise = new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error('地图加载超时，请检查网络连接')), 15000);
      });

      const AMap = await Promise.race([
        AMapLoader.load({
          key: apiKey,
          version: '2.0',
          plugins: ['AMap.Marker', 'AMap.InfoWindow', 'AMap.Geolocation']
        }),
        timeoutPromise
      ]);

      const mapInstance = new AMap.Map(mapRef.current, {
        zoom: 15,
        center: [112.93, 28.17],
        mapStyle: 'amap://styles/fresh',
        showLabel: true,
        features: ['bg', 'road', 'building']
      });

      setMap(mapInstance);
      createMarkers(mapInstance, AMap);
      
      // 添加地图移动结束事件监听
      mapInstance.on('moveend', () => {
        handleMapMoveEnd(mapInstance, AMap);
      });
      
      setMapLoading(false);
    } catch (error) {
      console.error('地图加载失败:', error);
      setMapError(true);
      setMapLoading(false);
    }
  };

  const handleMapMoveEnd = (mapInstance, AMap) => {
    if (!mapInstance) return;
    
    // 获取当前地图中心点
    const center = mapInstance.getCenter();
    const centerCoords = [center.lng, center.lat];
    
    // 计算所有餐厅与中心点的距离
    const restaurantsWithDistance = mockRestaurants.map(restaurant => {
      const distance = AMap.GeometryUtil.distance(centerCoords, restaurant.coordinates);
      return {
        ...restaurant,
        distance: Math.round(distance)
      };
    });
    
    // 按距离排序并取最近的8-10家
    const sortedRestaurants = restaurantsWithDistance
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 10);
    
    // 更新显示列表
    let filtered = sortedRestaurants.filter(restaurant => {
      // 搜索过滤
      const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // 分类过滤
      const matchesCategory = activeCategory === 'all' || restaurant.category === activeCategory;
      
      return matchesSearch && matchesCategory;
    });
    
    // 应用排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price':
          return a.avgPrice - b.avgPrice;
        case 'distance':
        default:
          return a.distance - b.distance;
      }
    });
    
    setFilteredRestaurants(filtered);
  };

  const createMarkers = (mapInstance, AMap) => {
    try {
      // 清除现有标记
      markers.forEach(({ marker }) => marker.setMap(null));
      
      const newMarkers = mockRestaurants.map(restaurant => {
        // 创建气泡形状的标记内容
        const markerContent = document.createElement('div');
        markerContent.className = 'relative flex items-center';
        markerContent.innerHTML = `
          <div class="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg flex items-center space-x-1 whitespace-nowrap">
            <span>${restaurant.name.length > 6 ? restaurant.name.substring(0, 6) + '...' : restaurant.name}</span>
            <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-orange-500"></div>
          </div>
        `;

        const marker = new AMap.Marker({
          position: restaurant.coordinates,
          title: restaurant.name,
          content: markerContent,
          offset: new AMap.Pixel(0, -20)
        });

        marker.on('click', () => {
          setSelectedRestaurant(restaurant);
          mapInstance.setCenter(restaurant.coordinates);
          mapInstance.setZoom(17);
          // 自动关闭AI助手
          setShowAIAssistant(false);
        });

        return { ...restaurant, marker };
      });

      newMarkers.forEach(({ marker }) => marker.setMap(mapInstance));
      setMarkers(newMarkers);
    } catch (error) {
      console.error('创建标记失败:', error);
    }
  };

  const filterAndSortRestaurants = () => {
    let filtered = mockRestaurants.filter(restaurant => {
      // 搜索过滤
      const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // 分类过滤
      const matchesCategory = activeCategory === 'all' || restaurant.category === activeCategory;
      
      return matchesSearch && matchesCategory;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price':
          return a.avgPrice - b.avgPrice;
        case 'distance':
        default:
          return a.distance - b.distance;
      }
    });

    setFilteredRestaurants(filtered);
  };

  const handleSpinResult = (restaurant) => {
    setSelectedRestaurant(restaurant);
    if (map) {
      map.setCenter(restaurant.coordinates);
      map.setZoom(17);
    }
    setShowSpinWheel(false);
  };

  // 定位到岳麓大学城中心
  const handleLocateCenter = () => {
    if (map) {
      map.panTo([112.93, 28.17]);
      map.setZoom(15);
    }
  };

  // 切换收藏状态
  const handleToggleFavorite = (restaurantId) => {
    const updatedRestaurants = mockRestaurants.map(restaurant => {
      if (restaurant.id === restaurantId) {
        return { ...restaurant, isFavorite: !restaurant.isFavorite };
      }
      return restaurant;
    });
    
    // 更新本地状态
    setFilteredRestaurants(prev => 
      prev.map(restaurant => 
        restaurant.id === restaurantId 
          ? { ...restaurant, isFavorite: !restaurant.isFavorite }
          : restaurant
      )
    );
  };

  // 查看评价
  const handleViewReviews = (restaurant) => {
    setSelectedReviewRestaurant(restaurant);
    setShowReviewModal(true);
  };

  // 打开评价模态框
  const handleEvaluationOpen = (restaurant) => {
    setSelectedEvaluationRestaurant(restaurant);
    setShowEvaluationModal(true);
  };

  // 重试地图加载
  const handleRetryMapLoad = () => {
    if (mapLoadAttempts < 3) {
      setMapLoadAttempts(prev => prev + 1);
      initMap();
    }
  };

  // 处理地图点击事件
  const handleMapClick = () => {
    // 关闭AI助手
    setShowAIAssistant(false);
  };

  // 处理搭一搭功能
  const handleMatchingOpen = (restaurant = null) => {
    setShowMatchingSystem(true);
    setShowAIAssistant(false);
  };

  // 处理搭一搭关闭
  const handleMatchingClose = () => {
    setShowMatchingSystem(false);
  };

  // 处理分类筛选
  const handleCategoryFilter = (category) => {
    setActiveCategory(category);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* 地图容器 */}
      <div 
        ref={mapRef} 
        className="w-full h-full"
        style={{ minHeight: '100vh' }}
        onClick={handleMapClick}
      >
        {/* 地图加载状态 */}
        {mapLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50 z-10">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">地图加载中...</p>
            </div>
          </div>
        )}
        
        {/* 地图错误状态 */}
        {mapError && !mapLoading && (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50">
            <div className="text-center p-8 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-orange-200">
              <div className="text-6xl mb-4">📍</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">地图加载失败</h2>
              <p className="text-gray-600 mb-4">
                {mapLoadAttempts < 3 
                  ? '正在尝试重新加载...' 
                  : '请检查网络连接或联系管理员'
                }
              </p>
              {mapLoadAttempts < 3 && (
                <button
                  onClick={handleRetryMapLoad}
                  className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
                >
                  重试 ({mapLoadAttempts}/3)
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* 悬浮侧边栏 - 移除了绝对定位，使用组件内部固定定位 */}
      <div className="z-10">
        <MapSidebar
          restaurants={filteredRestaurants}
          selectedRestaurant={selectedRestaurant}
          searchTerm={searchTerm}
          sortBy={sortBy}
          activeCategory={activeCategory}
          onSearchChange={setSearchTerm}
          onSortChange={setSortBy}
          onCategoryFilter={handleCategoryFilter}
          onRestaurantSelect={setSelectedRestaurant}
          onSpinClick={() => setShowSpinWheel(true)}
          onToggleFavorite={handleToggleFavorite}
          onViewReviews={handleViewReviews}
          onMatchingOpen={handleMatchingOpen}
          onEvaluationOpen={handleEvaluationOpen}
        />
      </div>

      {/* 用户头像 */}
      <UserProfile />

      {/* 底部按钮组 - 重新布局 */}
      <div className="absolute bottom-8 right-4 z-20 flex items-center space-x-3">
        {/* 搭一搭按钮 */}
        <button
          onClick={() => setShowMatchingSystem(true)}
          className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <Users className="w-5 h-5 text-orange-500" />
        </button>
        
        {/* 定位按钮 */}
        <button
          onClick={handleLocateCenter}
          className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <Locate className="w-5 h-5 text-orange-500" />
        </button>
      </div>

      {/* AI助手组件 - 移至页面正下方居中 */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <button
          onClick={() => setShowAIAssistant(true)}
          className="w-16 h-16 bg-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
        >
          <Mic className="w-6 h-6 text-orange-500" />
        </button>
      </div>

      <AIAssistant 
        isOpen={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
        onRestaurantSelect={setSelectedRestaurant}
        onMatchingOpen={handleMatchingOpen}
      />

      {/* 转盘组件 */}
      {showSpinWheel && (
        <SpinWheel
          restaurants={filteredRestaurants}
          onResult={handleSpinResult}
          onClose={() => setShowSpinWheel(false)}
        />
      )}

      {/* 搭一搭匹配系统 */}
      <MatchingSystem
        isOpen={showMatchingSystem}
        onClose={handleMatchingClose}
        targetRestaurant={selectedRestaurant}
      />

      {/* 评价模态框 */}
      <ReviewModal
        restaurant={selectedReviewRestaurant}
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
      />

      {/* 打卡评价模态框 */}
      <EvaluationModal
        restaurant={selectedEvaluationRestaurant}
        isOpen={showEvaluationModal}
        onClose={() => setShowEvaluationModal(false)}
      />

      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default Index;
