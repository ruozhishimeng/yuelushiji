import { useCallback, useRef } from 'react';

const createMarkerContent = (restaurant) => {
  const wrapper = document.createElement('div');
  wrapper.className = 'relative flex items-center';

  const bubble = document.createElement('div');
  bubble.className = 'bg-brand-primary text-white px-3 py-1 rounded-full text-xs font-medium shadow-md flex items-center space-x-1 whitespace-nowrap';

  const label = document.createElement('span');
  label.textContent = restaurant.name.length > 6 ? `${restaurant.name.substring(0, 6)}...` : restaurant.name;

  const pointer = document.createElement('div');
  pointer.className = 'absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-brand-primary';

  bubble.appendChild(label);
  bubble.appendChild(pointer);
  wrapper.appendChild(bubble);
  return wrapper;
};

export const useMarkers = ({ mapInstanceRef, amapRef, restaurantsRef, setSelectedRestaurant, pendingFocusRef }) => {
  const markersRef = useRef([]);
  const markerMapRef = useRef(new Map());

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
    markerMapRef.current.clear();
  }, []);

  const createMarkers = useCallback((restaurantList) => {
    const mapInstance = mapInstanceRef.current;
    const AMap = amapRef.current;
    if (!mapInstance || !AMap) return;

    clearMarkers();

    const newMarkers = restaurantList.map(restaurant => {
      const marker = new AMap.Marker({
        position: restaurant.coordinates,
        title: restaurant.name,
        content: createMarkerContent(restaurant),
        offset: new AMap.Pixel(0, -20)
      });

      marker.on('click', () => {
        const latestRestaurant = restaurantsRef.current.find(item => item.id === restaurant.id) || restaurant;
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
  }, [clearMarkers, mapInstanceRef, amapRef, restaurantsRef, setSelectedRestaurant, pendingFocusRef]);

  const updateMarkerContent = useCallback((restaurantId, restaurant) => {
    const marker = markerMapRef.current.get(restaurantId);
    if (marker) {
      marker.setContent(createMarkerContent(restaurant));
    }
  }, []);

  return {
    markersRef,
    markerMapRef,
    clearMarkers,
    createMarkers,
    updateMarkerContent
  };
};