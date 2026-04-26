export const sortRestaurants = (restaurants, sortBy) => {
  return [...restaurants].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'price':
        return (a.avgPrice || Number.MAX_SAFE_INTEGER) - (b.avgPrice || Number.MAX_SAFE_INTEGER);
      case 'distance':
      default:
        return (a.distance || 0) - (b.distance || 0);
    }
  });
};

export const formatDistance = (distance) => {
  if (!Number.isFinite(Number(distance))) return '距离待补充';
  if (distance < 1000) return `${distance}m`;
  return `${(distance / 1000).toFixed(1)}km`;
};

export const formatPriceLevel = (level) => {
  if (!level) return '暂无';
  return '¥'.repeat(level);
};

export const formatAveragePrice = (avgPrice) => {
  return avgPrice ? `${avgPrice}元` : '人均待补充';
};

export const getReviewCount = (restaurant) => {
  const explicitCount = Number(
    restaurant.reviewCount ?? restaurant.ratingCount ?? restaurant.commentCount
  );

  if (Number.isFinite(explicitCount) && explicitCount >= 0) {
    return Math.floor(explicitCount);
  }

  if (Array.isArray(restaurant.recentReviews)) {
    return restaurant.recentReviews.length;
  }

  return 0;
};

export const formatReviewCount = (restaurant) => {
  return `${getReviewCount(restaurant)}条`;
};

export const getBusyStatus = (_restaurant) => ({
  status: 'unknown',
  text: '暂无实时拥挤信息',
  color: 'text-gray-400'
});
