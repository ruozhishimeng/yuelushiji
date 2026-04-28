import { useCallback, useRef } from 'react';

const MARKER_STYLE_CONFIG = {
  dot: { offsetY: -9, zIndex: 90 },
  featured: { offsetY: -56, zIndex: 110 },
  focused: { offsetY: -60, zIndex: 120 },
  selected: { offsetY: -66, zIndex: 130 },
};

const shortenName = (name, limit = 10) => {
  if (!name) return '';
  return name.length > limit ? name.slice(0, limit) + '...' : name;
};

const createDotContent = () => {
  const dot = document.createElement('div');
  dot.className = 'h-3.5 w-3.5 rounded-full border-2 border-white bg-brand-primary shadow-md';
  return dot;
};

const isDrinkCategory = (restaurant) => {
  const categoryText = [restaurant.category, ...(restaurant.tags || [])].join(' ');
  return /奶茶|咖啡|饮品|果茶|甜品/.test(categoryText);
};

const createBubbleContent = (restaurant, mode) => {
  const wrapper = document.createElement('div');
  wrapper.className = 'relative flex flex-col items-center font-sans';

  const bubble = document.createElement('div');
  bubble.className = [
    'relative inline-flex items-center gap-2 rounded-full border border-white/90 bg-brand-paperSoft px-2.5 py-2 shadow-xl',
    mode === 'selected' ? 'ring-2 ring-brand-warning/75' : '',
    mode === 'focused' ? 'ring-2 ring-brand-primary/45' : '',
  ].filter(Boolean).join(' ');
  bubble.style.minWidth = mode === 'selected' ? '94px' : '86px';

  const typeBadge = document.createElement('div');
  const isDrink = isDrinkCategory(restaurant);
  typeBadge.className = [
    'flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold shadow-sm',
    isDrink ? 'bg-sky-100 text-sky-700' : 'bg-orange-100 text-orange-700',
  ].join(' ');
  typeBadge.textContent = isDrink ? '喝' : '吃';

  const rating = document.createElement('div');
  rating.className = 'pr-0.5 text-sm font-semibold text-gray-900';
  rating.textContent = restaurant.rating ? String(restaurant.rating) : '暂无';

  const pointer = document.createElement('div');
  pointer.className = 'absolute left-1/2 top-full h-3 w-3 -translate-x-1/2 -translate-y-[45%] rotate-45 border-b border-r border-white/80 bg-brand-paperSoft';

  const name = document.createElement('div');
  name.className = 'mt-2 max-w-[118px] rounded-full bg-brand-paperSoft/95 px-3 py-1 text-center text-xs font-semibold text-gray-900 shadow-md';
  name.style.whiteSpace = 'nowrap';
  name.style.overflow = 'hidden';
  name.style.textOverflow = 'ellipsis';
  name.textContent = shortenName(restaurant.name, mode === 'selected' ? 11 : 10);

  bubble.appendChild(typeBadge);
  bubble.appendChild(rating);
  bubble.appendChild(pointer);
  wrapper.appendChild(bubble);
  wrapper.appendChild(name);

  return wrapper;
};

const createMarkerContent = (restaurant, mode) => {
  if (mode === 'dot') return createDotContent();
  return createBubbleContent(restaurant, mode);
};

const resolveMarkerMode = (restaurantId, displayState) => {
  if (restaurantId && displayState.selectedId === restaurantId) return 'selected';
  if (restaurantId && displayState.focusedId === restaurantId) return 'focused';
  if (displayState.featuredIds && displayState.featuredIds.includes(restaurantId)) return 'featured';
  return 'dot';
};

export const useMarkers = ({ mapInstanceRef, amapRef, restaurantsRef, setSelectedRestaurant, pendingFocusRef }) => {
  const markersRef = useRef([]);
  const markerMapRef = useRef(new Map());

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];
    markerMapRef.current.clear();
  }, []);

  const applyMarkerVisual = useCallback((marker, restaurant, mode) => {
    const AMap = amapRef.current;
    if (!marker || !AMap) return;
    const style = MARKER_STYLE_CONFIG[mode] || MARKER_STYLE_CONFIG.dot;
    marker.setContent(createMarkerContent(restaurant, mode));
    marker.setOffset(new AMap.Pixel(0, style.offsetY));
    if (typeof marker.setzIndex === 'function') {
      marker.setzIndex(style.zIndex);
    }
  }, [amapRef]);

  const createMarkers = useCallback((restaurantList) => {
    const mapInstance = mapInstanceRef.current;
    const AMap = amapRef.current;
    if (!mapInstance || !AMap) return;

    clearMarkers();

    const newMarkers = restaurantList.map((restaurant) => {
      const marker = new AMap.Marker({
        position: restaurant.coordinates,
        title: restaurant.name,
        content: createMarkerContent(restaurant, 'dot'),
        offset: new AMap.Pixel(0, MARKER_STYLE_CONFIG.dot.offsetY),
      });

      marker.on('click', () => {
        const latestRestaurant = restaurantsRef.current.find((item) => item.id === restaurant.id) || restaurant;
        pendingFocusRef.current = latestRestaurant;
        setSelectedRestaurant(latestRestaurant);
        mapInstance.setCenter(latestRestaurant.coordinates);
        mapInstance.setZoom(17);
      });

      marker.setMap(mapInstance);
      markerMapRef.current.set(restaurant.id, marker);
      return marker;
    });

    markersRef.current = newMarkers;
  }, [amapRef, clearMarkers, mapInstanceRef, pendingFocusRef, restaurantsRef, setSelectedRestaurant]);

  const updateMarkerPresentation = useCallback((restaurantList, displayState = {}) => {
    restaurantList.forEach((restaurant) => {
      const marker = markerMapRef.current.get(restaurant.id);
      if (!marker) return;
      applyMarkerVisual(marker, restaurant, resolveMarkerMode(restaurant.id, displayState));
    });
  }, [applyMarkerVisual]);

  return {
    markersRef,
    markerMapRef,
    clearMarkers,
    createMarkers,
    updateMarkerPresentation,
  };
};
