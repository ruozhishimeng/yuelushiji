export const AMAP_KEY = import.meta.env.VITE_AMAP_KEY;
export const AMAP_SECURITY_CODE = import.meta.env.VITE_AMAP_SECURITY_CODE;

export const YUELU_CENTER = [112.93, 28.17];
export const SEARCH_RADIUS = 3000;

export const MAP_OPTIONS = {
  zoom: 15,
  center: YUELU_CENTER,
  mapStyle: 'amap://styles/normal',
  showLabel: true,
  features: ['bg', 'point', 'road', 'building']
};

export const AMAP_PLUGINS = [
  'AMap.Marker',
  'AMap.PlaceSearch',
  'AMap.Geolocation',
  'AMap.GeometryUtil',
  'AMap.Scale',
  'AMap.ToolBar'
];

export const CATEGORY_KEYWORDS = {
  all: '餐饮',
  午饭: '餐饮',
  晚饭: '餐饮',
  快餐: '快餐',
  奶茶: '奶茶',
  长沙特色: '长沙小吃'
};

export const PLACE_SEARCH_OPTIONS = {
  city: '长沙市',
  citylimit: true,
  type: '餐饮服务',
  pageSize: 30,
  pageIndex: 1,
  extensions: 'all'
};
