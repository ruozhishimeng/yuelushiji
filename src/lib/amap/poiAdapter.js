const CATEGORY_LABELS = ['餐饮服务', '中餐厅', '快餐厅', '小吃', '奶茶', '咖啡厅', '甜品店'];

const getPoiLocation = (poi) => {
  const location = poi.location;
  if (!location) return null;

  if (typeof location.lng === 'number' && typeof location.lat === 'number') {
    return [location.lng, location.lat];
  }

  if (typeof location.getLng === 'function' && typeof location.getLat === 'function') {
    return [location.getLng(), location.getLat()];
  }

  if (typeof location === 'string') {
    const [lng, lat] = location.split(',').map(Number);
    if (Number.isFinite(lng) && Number.isFinite(lat)) return [lng, lat];
  }

  return null;
};

const getDistance = (AMap, from, to, fallbackDistance) => {
  if (Number.isFinite(Number(fallbackDistance))) return Math.round(Number(fallbackDistance));
  if (!from || !to) return 0;

  try {
    return Math.round(AMap.GeometryUtil.distance(from, to));
  } catch {
    const start = new AMap.LngLat(from[0], from[1]);
    return Math.round(start.distance(to));
  }
};

const getPriceLevel = (avgPrice) => {
  if (!avgPrice) return 0;
  if (avgPrice <= 20) return 1;
  if (avgPrice <= 50) return 2;
  return 3;
};

const getCategoryFromPoi = (poi) => {
  const typeText = poi.type || '';
  if (typeText.includes('奶茶') || typeText.includes('饮品') || typeText.includes('咖啡')) return '奶茶';
  if (typeText.includes('快餐') || typeText.includes('小吃')) return '快餐';
  if (typeText.includes('湘菜') || typeText.includes('长沙')) return '长沙特色';
  return '午饭';
};

const getReviewCountFromPoi = (poi) => {
  const candidates = [
    poi.biz_ext?.review_count,
    poi.biz_ext?.comment_count,
    poi.biz_ext?.comment_num,
    poi.review_count,
    poi.comment_count,
    poi.comment_num
  ];

  for (const candidate of candidates) {
    const count = Number.parseInt(candidate, 10);
    if (Number.isFinite(count) && count >= 0) return count;
  }

  return null;
};

export const normalizePoi = (poi, AMap, center) => {
  const coordinates = getPoiLocation(poi);
  if (!coordinates || !poi.name) return null;

  const rating = Number.parseFloat(poi.biz_ext?.rating);
  const avgPrice = Math.round(Number.parseFloat(poi.biz_ext?.cost) || 0);
  const typeTags = (poi.type || '')
    .split(';')
    .map(tag => tag.trim())
    .filter(tag => tag && CATEGORY_LABELS.some(label => tag.includes(label) || label.includes(tag)));
  const tags = Array.from(new Set([getCategoryFromPoi(poi), ...typeTags])).slice(0, 4);
  const photos = Array.isArray(poi.photos)
    ? poi.photos.map(photo => photo.url).filter(Boolean)
    : [];
  const reviewCount = getReviewCountFromPoi(poi);

  return {
    id: poi.id || `${poi.name}-${coordinates.join(',')}`,
    source: 'amap',
    poiId: poi.id,
    name: poi.name,
    coordinates,
    rating: Number.isFinite(rating) ? rating : null,
    reviewCount,
    avgPrice: avgPrice || null,
    priceLevel: getPriceLevel(avgPrice),
    distance: getDistance(AMap, center, coordinates, poi.distance),
    location: poi.address || `${poi.pname || ''}${poi.cityname || ''}${poi.adname || ''}`,
    tags: tags.length ? tags : ['餐饮服务'],
    category: getCategoryFromPoi(poi),
    photos,
    tel: poi.tel && poi.tel !== '[]' ? poi.tel : '',
    isFavorite: false,
    isLiked: false,
    likes: 0,
    recentReviews: [],
    hotDishes: [],
    visitCount: null,
    busyStatus: 'unknown'
  };
};

export const normalizePois = (pois, AMap, center) => (
  pois.map(poi => normalizePoi(poi, AMap, center)).filter(Boolean)
);
