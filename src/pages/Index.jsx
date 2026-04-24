import MatchingSystem from '../components/MatchingSystem';
import EvaluationModal from '../components/EvaluationModal';
import UserProfile from '../components/UserProfile';
import SpinWheel from '../components/SpinWheel';
import { Locate, Users } from 'lucide-react';
import AIAssistant from '../components/AIAssistant';
import ReviewModal from '../components/ReviewModal';
import React, { useState } from 'react';
import MapSidebar from '../components/MapSidebar';
import { useAmapRestaurants } from '../hooks/useAmapRestaurants';
import BottomActionBar from '../components/BottomActionBar';
import FloatingPanel from '../components/FloatingPanel';
import RankingPanel from '../components/RankingPanel';
import CommunityPanel from '../components/CommunityPanel';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('distance');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showSpinWheel, setShowSpinWheel] = useState(false);
  const [activeBottomPanel, setActiveBottomPanel] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showMatchingSystem, setShowMatchingSystem] = useState(false);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [selectedReviewRestaurant, setSelectedReviewRestaurant] = useState(null);
  const [selectedEvaluationRestaurant, setSelectedEvaluationRestaurant] = useState(null);

  const {
    mapRef,
    restaurants,
    selectedRestaurant,
    setSelectedRestaurant,
    focusRestaurant,
    toggleFavorite,
    toggleLike,
    locateCenter,
    retryMapLoad,
    mapLoading,
    poiLoading,
    mapError,
    mapLoadAttempts
  } = useAmapRestaurants({ searchTerm, activeCategory, sortBy });

  const handleSpinResult = (restaurant) => {
    focusRestaurant(restaurant);
    setShowSpinWheel(false);
    setActiveBottomPanel(null);
  };

  const handleViewReviews = (restaurant) => {
    setSelectedReviewRestaurant(restaurant);
    setShowReviewModal(true);
    setActiveBottomPanel(null);
  };

  const handleEvaluationOpen = (restaurant) => {
    setSelectedEvaluationRestaurant(restaurant);
    setShowEvaluationModal(true);
    setActiveBottomPanel(null);
  };

  const handleMapClick = () => {
    setActiveBottomPanel(null);
  };

  const handleMatchingOpen = (restaurant = null) => {
    if (restaurant) focusRestaurant(restaurant);
    setShowMatchingSystem(true);
    setActiveBottomPanel(null);
  };

  const handleMatchingClose = () => {
    setShowMatchingSystem(false);
  };

  const handleRankedRestaurantSelect = (restaurant) => {
    focusRestaurant(restaurant);
    setActiveBottomPanel(null);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div
        ref={mapRef}
        className="w-full h-full"
        style={{ minHeight: '100vh' }}
        onClick={handleMapClick}
      >
        {mapLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50 z-10">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">地图加载中...</p>
            </div>
          </div>
        )}

        {mapError && !mapLoading && (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50">
            <div className="text-center p-8 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-orange-200">
              <div className="text-6xl mb-4">地图</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">地图加载失败</h2>
              <p className="text-gray-600 mb-4">
                {mapLoadAttempts < 3
                  ? '可以尝试重新加载，或检查高德 Key 与安全密钥配置'
                  : '请检查网络连接、高德 Key、域名白名单或安全密钥'}
              </p>
              {mapLoadAttempts < 3 && (
                <button
                  onClick={retryMapLoad}
                  className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
                >
                  重试 ({mapLoadAttempts}/3)
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {poiLoading && !mapLoading && (
        <div className="absolute top-6 left-[432px] z-20 rounded-full bg-white/95 px-4 py-2 text-sm text-gray-600 shadow-lg">
          正在加载真实商家...
        </div>
      )}

      <div className="z-10">
        <MapSidebar
          restaurants={restaurants}
          selectedRestaurant={selectedRestaurant}
          searchTerm={searchTerm}
          sortBy={sortBy}
          activeCategory={activeCategory}
          onSearchChange={setSearchTerm}
          onSortChange={setSortBy}
          onCategoryFilter={setActiveCategory}
          onRestaurantSelect={focusRestaurant}
          onBackToList={() => setSelectedRestaurant(null)}
          onSpinClick={() => {
            setActiveBottomPanel(null);
            setShowSpinWheel(true);
          }}
          onToggleFavorite={toggleFavorite}
          onToggleLike={toggleLike}
          onViewReviews={handleViewReviews}
          onMatchingOpen={handleMatchingOpen}
          onEvaluationOpen={handleEvaluationOpen}
        />
      </div>

      <UserProfile />

      <div className="absolute bottom-8 right-4 z-20 flex items-center space-x-3">
        <button
          onClick={() => setShowMatchingSystem(true)}
          className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <Users className="w-5 h-5 text-orange-500" />
        </button>

        <button
          onClick={locateCenter}
          className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <Locate className="w-5 h-5 text-orange-500" />
        </button>
      </div>

      <FloatingPanel
        isOpen={activeBottomPanel === 'ranking'}
        title="大学城美食榜单"
        badge="演示功能"
        description="当前基于真实高德商家 POI 和前端演示规则生成，正式版会接入真实学生评价权重。"
        onClose={() => setActiveBottomPanel(null)}
      >
        <RankingPanel
          restaurants={restaurants}
          onRestaurantSelect={handleRankedRestaurantSelect}
        />
      </FloatingPanel>

      <FloatingPanel
        isOpen={activeBottomPanel === 'community'}
        title="社区最新评价"
        badge="演示功能"
        description="博客流样式预览，正式版会读取认证学生发布的真实评价。"
        onClose={() => setActiveBottomPanel(null)}
      >
        <CommunityPanel />
      </FloatingPanel>

      <BottomActionBar
        activePanel={activeBottomPanel}
        onPanelChange={setActiveBottomPanel}
      />

      <AIAssistant
        isOpen={activeBottomPanel === 'voice'}
        onClose={() => setActiveBottomPanel(null)}
        onRestaurantSelect={focusRestaurant}
        onMatchingOpen={handleMatchingOpen}
      />

      {showSpinWheel && (
        <SpinWheel
          restaurants={restaurants}
          onResult={handleSpinResult}
          onClose={() => setShowSpinWheel(false)}
        />
      )}

      <MatchingSystem
        isOpen={showMatchingSystem}
        onClose={handleMatchingClose}
        targetRestaurant={selectedRestaurant}
      />

      <ReviewModal
        restaurant={selectedReviewRestaurant}
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
      />

      <EvaluationModal
        restaurant={selectedEvaluationRestaurant}
        isOpen={showEvaluationModal}
        onClose={() => setShowEvaluationModal(false)}
      />
    </div>
  );
};

export default Index;
