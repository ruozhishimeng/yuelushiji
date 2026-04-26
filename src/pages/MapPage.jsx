import { Locate, Users } from 'lucide-react';
import React from 'react';
import MapSidebar from '../components/MapSidebar';

const MapPage = ({
  mapRef,
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
  onToggleFavorite,
  onToggleLike,
  onViewReviews,
  onMatchingOpen,
  onEvaluationOpen,
  locateCenter,
  retryMapLoad,
  mapLoading,
  poiLoading,
  mapError,
  mapLoadAttempts,
  onMapClick
}) => {
  return (
    <main className="relative h-dvh w-full overflow-hidden bg-brand-paper">
      <div
        ref={mapRef}
        className="h-full w-full"
        onClick={onMapClick}
      >
        {mapLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-brand-paper">
            <div className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-brand-primary border-t-transparent"></div>
              <p className="text-gray-600">地图加载中...</p>
            </div>
          </div>
        )}

        {mapError && !mapLoading && (
          <div className="flex h-full w-full items-center justify-center bg-brand-paper p-4">
            <div className="rounded-2xl border border-brand-paperDeep bg-brand-paperSoft/95 p-8 text-center shadow-md">
              <div className="mb-4 text-5xl font-bold text-brand-primary">地图</div>
              <h2 className="mb-2 text-2xl font-bold text-gray-800">地图加载失败</h2>
              <p className="mb-4 text-gray-600">
                {mapLoadAttempts < 3
                  ? '地图服务未配置，请联系管理员或在 .env 中设置高德密钥'
                  : '地图服务不可用，请检查网络或联系管理员'}
              </p>
              {mapLoadAttempts < 3 && (
                <button
                  onClick={retryMapLoad}
                  className="rounded-xl bg-brand-primary px-6 py-3 text-white transition-colors hover:bg-brand-primaryHover focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
                >
                  重试 ({mapLoadAttempts}/3)
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {poiLoading && !mapLoading && (
        <div className="absolute left-4 top-4 z-20 rounded-full bg-brand-paperSoft/95 px-4 py-2 text-sm text-gray-600 shadow-lg sm:left-[432px]">
          正在加载真实商家...
        </div>
      )}

      <MapSidebar
        restaurants={restaurants}
        selectedRestaurant={selectedRestaurant}
        searchTerm={searchTerm}
        sortBy={sortBy}
        activeCategory={activeCategory}
        onSearchChange={onSearchChange}
        onSortChange={onSortChange}
        onCategoryFilter={onCategoryFilter}
        onRestaurantSelect={onRestaurantSelect}
        onBackToList={onBackToList}
        onToggleFavorite={onToggleFavorite}
        onToggleLike={onToggleLike}
        onViewReviews={onViewReviews}
        onMatchingOpen={onMatchingOpen}
        onEvaluationOpen={onEvaluationOpen}
      />

      <div className="absolute bottom-24 right-4 z-20 flex items-center space-x-3 sm:bottom-28">
        <button
          onClick={() => onMatchingOpen(null)}
          aria-label="打开饭搭子匹配"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-paperSoft shadow-md transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
        >
          <Users className="h-5 w-5 text-brand-primary" />
        </button>

        <button
          onClick={locateCenter}
          aria-label="回到地图中心"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-paperSoft shadow-md transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
        >
          <Locate className="h-5 w-5 text-brand-primary" />
        </button>
      </div>
    </main>
  );
};

export default MapPage;
