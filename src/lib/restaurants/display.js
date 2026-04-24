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

export const getBusyStatus = (restaurant) => {
  if (restaurant.busyStatus === 'unknown' || !restaurant.rating) {
    return { status: 'unknown', text: '实时状态待补充', color: 'text-gray-400' };
  }

  if (restaurant.rating >= 4.7) {
    return { status: 'crowded', text: '当前排队较多', color: 'text-red-500' };
  }

  if (restaurant.rating >= 4.3) {
    return { status: 'moderate', text: '有少量空位', color: 'text-yellow-500' };
  }

  return { status: 'quiet', text: '无需排队', color: 'text-green-500' };
};
