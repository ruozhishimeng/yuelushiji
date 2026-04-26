import RestaurantDetail from './RestaurantDetail';
import React, { useState } from 'react';
import FilterMenu from './FilterMenu';
import MapSidebarHeader from './MapSidebarHeader';
import RestaurantList from './RestaurantList';

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
  onToggleFavorite,
  onToggleLike,
  onViewReviews,
  onMatchingOpen,
  onEvaluationOpen
}) => {
  const [showFavorites, setShowFavorites] = useState(false);
  const isDetailView = Boolean(selectedRestaurant);

  return (
    <div className="fixed bottom-3 left-3 right-3 top-3 z-20 flex w-auto flex-col overflow-hidden rounded-xl border border-brand-paperDeep bg-brand-paperSoft shadow-lg sm:bottom-4 sm:left-4 sm:right-auto sm:top-4 sm:w-[400px]">
      {!isDetailView && <MapSidebarHeader />}

      {!isDetailView && (
        <FilterMenu
          searchTerm={searchTerm}
          sortBy={sortBy}
          activeCategory={activeCategory}
          onSearchChange={onSearchChange}
          onSortChange={onSortChange}
          onCategoryFilter={onCategoryFilter}
        />
      )}

      <div className="flex-1 overflow-hidden">
        {!isDetailView ? (
          <RestaurantList
            restaurants={restaurants}
            selectedRestaurant={selectedRestaurant}
            showFavorites={showFavorites}
            onToggleShowFavorites={() => setShowFavorites(!showFavorites)}
            onRestaurantSelect={onRestaurantSelect}
            onToggleFavorite={onToggleFavorite}
            onToggleLike={onToggleLike}
            onViewReviews={onViewReviews}
            onMatchingOpen={onMatchingOpen}
            onEvaluationOpen={onEvaluationOpen}
          />
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