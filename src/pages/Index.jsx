import EvaluationModal from '../components/EvaluationModal';
import MatchingSystem from '../components/MatchingSystem';
import ReviewModal from '../components/ReviewModal';
import AIAssistant from '../components/AIAssistant';
import BottomActionBar from '../components/BottomActionBar';
import React, { useState } from 'react';
import { useAmapRestaurants } from '../hooks/useAmapRestaurants';
import HomePage from './HomePage';
import MapPage from './MapPage';
import ProfilePage from './ProfilePage';
import RankingPage from './RankingPage';

const Index = () => {
  const [activePage, setActivePage] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('distance');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isAiOpen, setIsAiOpen] = useState(false);
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
  } = useAmapRestaurants({
    searchTerm,
    activeCategory,
    sortBy,
    mapEnabled: activePage === 'map'
  });

  const handlePageChange = (page) => {
    setActivePage(page);
    setIsAiOpen(false);
  };

  const handleViewReviews = (restaurant) => {
    setSelectedReviewRestaurant(restaurant);
    setShowReviewModal(true);
    setIsAiOpen(false);
  };

  const handleEvaluationOpen = (restaurant) => {
    setSelectedEvaluationRestaurant(restaurant);
    setShowEvaluationModal(true);
    setIsAiOpen(false);
  };

  const handleMatchingOpen = (restaurant = null) => {
    if (restaurant) {
      focusRestaurant(restaurant);
      setActivePage('map');
    }
    setShowMatchingSystem(true);
    setIsAiOpen(false);
  };

  const handleRestaurantSelect = (restaurant) => {
    focusRestaurant(restaurant);
    setActivePage('map');
    setIsAiOpen(false);
  };

  const renderActivePage = () => {
    if (activePage === 'map') {
      return (
        <MapPage
          mapRef={mapRef}
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
          onToggleFavorite={toggleFavorite}
          onToggleLike={toggleLike}
          onViewReviews={handleViewReviews}
          onMatchingOpen={handleMatchingOpen}
          onEvaluationOpen={handleEvaluationOpen}
          locateCenter={locateCenter}
          retryMapLoad={retryMapLoad}
          mapLoading={mapLoading}
          poiLoading={poiLoading}
          mapError={mapError}
          mapLoadAttempts={mapLoadAttempts}
          onMapClick={() => setIsAiOpen(false)}
        />
      );
    }

    if (activePage === 'ranking') {
      return (
        <RankingPage
          restaurants={restaurants}
          poiLoading={poiLoading}
          onRestaurantSelect={handleRestaurantSelect}
        />
      );
    }

    if (activePage === 'profile') {
      return (
        <ProfilePage
          restaurants={restaurants}
          onToggleFavorite={toggleFavorite}
          onRestaurantSelect={handleRestaurantSelect}
        />
      );
    }

    return <HomePage />;
  };

  return (
    <div className="relative min-h-dvh w-full overflow-hidden bg-brand-paper">
      {renderActivePage()}

      <BottomActionBar
        activePage={activePage}
        onPageChange={handlePageChange}
        onAiOpen={() => setIsAiOpen(prev => !prev)}
        isAiOpen={isAiOpen}
      />

      {isAiOpen && (
        <AIAssistant
          isOpen={isAiOpen}
          restaurants={restaurants}
          onClose={() => setIsAiOpen(false)}
          onRestaurantSelect={handleRestaurantSelect}
          onMatchingOpen={handleMatchingOpen}
        />
      )}

      {showMatchingSystem && (
        <MatchingSystem
          isOpen={showMatchingSystem}
          onClose={() => setShowMatchingSystem(false)}
          targetRestaurant={selectedRestaurant}
        />
      )}

      {showReviewModal && (
        <ReviewModal
          restaurant={selectedReviewRestaurant}
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
        />
      )}

      {showEvaluationModal && (
        <EvaluationModal
          restaurant={selectedEvaluationRestaurant}
          isOpen={showEvaluationModal}
          onClose={() => setShowEvaluationModal(false)}
        />
      )}
    </div>
  );
};

export default Index;
