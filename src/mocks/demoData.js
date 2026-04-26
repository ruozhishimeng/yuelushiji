import { Award, Building2, Heart, MapPin, Settings, User, Utensils } from 'lucide-react';

export const demoUser = {
  name: '王同学',
  school: '中南大学',
  avatar: ''
};

export const demoUserStats = {
  fans: 128,
  likes: 456,
  following: 89,
  foodieTier: '品食探索者',
  foodieLevel: 3
};

export const demoUserActivity = {
  checkInCount: 23,
  reviewCount: 7,
  exploreCount: 42
};

export const demoMatchingHistory = [
  { id: 1, date: '2024-03-12', restaurant: '堕子王烧烤', matchedWith: '演示用户A', status: '已完成' },
  { id: 2, date: '2024-03-08', restaurant: '麓山南路臭豆腐', matchedWith: '演示用户B', status: '已取消' },
  { id: 3, date: '2024-03-05', restaurant: '大学城砂锅饭', matchedWith: '演示用户C', status: '已完成' }
];

export const demoFavorites = [
  { id: 'fav-1', name: '堕子王烧烤', rating: 4.6, avgPrice: 35, priceLevel: 2, distance: 280, location: '堕落街中段，湖大北校区步行3分钟', tags: ['烧烤', '堕落街老店'], photos: ['https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=80'], isFavorite: true, reviewCount: 128, visitCount: 5 },
  { id: 'fav-2', name: '大学城砂锅饭', rating: 4.5, avgPrice: 22, priceLevel: 1, distance: 520, location: '天马学生公寓食堂二层', tags: ['简餐', '砂锅'], photos: [], isFavorite: true, reviewCount: 86, visitCount: 3 },
  { id: 'fav-3', name: '中南大学鱼粉王', rating: 4.3, avgPrice: 15, priceLevel: 1, distance: 720, location: '中南大学南校区后街', tags: ['鱼粉', '实惠'], photos: [], isFavorite: true, reviewCount: 53, visitCount: 2 }
];

export const demoRecentVisits = [
  { id: 'vis-1', name: '麓山南路臭豆腐', rating: 4.4, avgPrice: 12, priceLevel: 1, distance: 350, location: '麓山南路中段，师大附近路东', tags: ['小吃', '长沙特色'], photos: [], isFavorite: false, reviewCount: 201, visitCount: 1 },
  { id: 'vis-2', name: '岳麓山脚剁椒鱼头', rating: 4.7, avgPrice: 68, priceLevel: 3, distance: 1200, location: '岳麓山南门入口左侧', tags: ['湘菜', '聚会'], photos: ['https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=900&q=80'], isFavorite: false, reviewCount: 67, visitCount: 1 },
  { id: 'vis-3', name: '天马奶茶档', rating: 4.2, avgPrice: 18, priceLevel: 1, distance: 460, location: '天马路与阜埠河路交叉口', tags: ['奶茶', '饮品'], photos: [], isFavorite: false, reviewCount: 312, visitCount: 3 },
  { id: 'vis-4', name: '后湖夜宵摊', rating: 4.1, avgPrice: 25, priceLevel: 1, distance: 890, location: '后湖国际艺术区东门', tags: ['夜宵', '烧烤'], photos: [], isFavorite: false, reviewCount: 44, visitCount: 1 }
];

export const demoFootprints = [
  { name: '演示足迹：堕子王烧烤', date: '2024-03-10' },
  { name: '演示足迹：中南大学鱼粉王', date: '2024-03-08' },
  { name: '演示足迹：麓山南路臭豆腐', date: '2024-03-05' },
  { name: '演示足迹：岳麓山脚剁椒鱼头', date: '2024-03-01' }
];

export const demoCommunityTags = ['演示标签', '湖南土著', '不排队会死星人'];

export const demoBadges = [
  { id: 1, name: '探店小王子', icon: Utensils, earned: true, description: '打卡超过10家不同店铺' },
  { id: 2, name: '辣椒专业户', icon: Heart, earned: true, description: '多次点赞香辣类菜品' },
  { id: 3, name: '食堂代言人', icon: Building2, earned: false, description: '多次在学校食堂区域打卡' },
  { id: 4, name: '早起鸟儿', icon: User, earned: false, description: '连续7天早餐打卡' },
  { id: 5, name: '夜猫子', icon: MapPin, earned: true, description: '深夜食堂打卡达人' },
  { id: 6, name: '社交达人', icon: Settings, earned: false, description: '成功匹配10次饭搭子' },
  { id: 7, name: '美食评论家', icon: Award, earned: false, description: '发表50条优质评价' },
  { id: 8, name: '省钱小能手', icon: Heart, earned: true, description: '发现超值美食店铺' },
  { id: 9, name: '导航专家', icon: MapPin, earned: false, description: '准确分享位置信息' }
];

export const demoTasteOptions = ['不吃辣', '嗜辣如命', '清淡为主'];
export const demoPriceOptions = ['20元以下', '20-50元', '50-100元'];

export const demoMatchedUsers = [
  {
    id: 1,
    name: '演示用户A',
    school: '湖南大学',
    avatar: '',
    matchRate: 98,
    tags: ['不吃辣', 'E人']
  },
  {
    id: 2,
    name: '演示用户B',
    school: '中南大学',
    avatar: '',
    matchRate: 92,
    tags: ['嗜辣如命', '社恐']
  }
];

export const demoHomeCircles = ['湖南大学', '中南大学', '湖南师范大学'];

export const demoHomePosts = [
  {
    id: 'home-post-1',
    title: '下课十分钟能吃完的拌粉清单',
    cover: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80',
    author: '林同学',
    school: '湖南大学',
    circle: '湖南大学',
    rating: 4.8,
    timeAgo: '12分钟前',
    isDemo: true
  },
  {
    id: 'home-post-2',
    title: '中南附近人均 20 的热饭选择',
    cover: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=900&q=80',
    author: '陈同学',
    school: '中南大学',
    circle: '中南大学',
    rating: 4.6,
    timeAgo: '34分钟前',
    isDemo: true
  },
  {
    id: 'home-post-3',
    title: '师大后街适合慢慢吃的夜宵',
    cover: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80',
    author: '周同学',
    school: '湖南师范大学',
    circle: '湖南师范大学',
    rating: 4.5,
    timeAgo: '1小时前',
    isDemo: true
  },
  {
    id: 'home-post-4',
    title: '岳麓山下来一碗热汤的路线',
    cover: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80',
    author: '许同学',
    school: '湖南大学',
    circle: '湖南大学',
    rating: 4.7,
    timeAgo: '2小时前',
    isDemo: true
  },
  {
    id: 'home-post-5',
    title: '赶课党奶茶少排队观察',
    cover: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80',
    author: '王同学',
    school: '中南大学',
    circle: '中南大学',
    rating: 4.3,
    timeAgo: '3小时前',
    isDemo: true
  },
  {
    id: 'home-post-6',
    title: '适合三个人拼饭的工作日晚餐',
    cover: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=900&q=80',
    author: '赵同学',
    school: '湖南师范大学',
    circle: '湖南师范大学',
    rating: 4.4,
    timeAgo: '今天',
    isDemo: true
  }
];

export const demoCommunityReviews = [
  {
    id: 'demo-review-1',
    author: '林同学',
    school: '湖南大学',
    verification: '演示认证',
    restaurantName: '演示商家：麓山南路拌粉店',
    rating: 4.8,
    timeAgo: '12分钟前',
    content: '下课后去吃的，出餐速度很快，拌粉偏香辣，适合赶时间的时候。正式版这里会展示真实学生评价和到店验证状态。',
    tags: ['演示评价', '赶课友好', '香辣']
  },
  {
    id: 'demo-review-2',
    author: '陈同学',
    school: '中南大学',
    verification: '演示认证',
    restaurantName: '演示商家：大学城砂锅饭',
    rating: 4.5,
    timeAgo: '34分钟前',
    content: '人均比较友好，适合两三个人一起吃。现在还没有接入真实后端，所以这条只用于展示社区信息流样式。',
    tags: ['演示评价', '人均友好', '适合拼饭']
  },
  {
    id: 'demo-review-3',
    author: '周同学',
    school: '湖南师范大学',
    verification: '演示认证',
    restaurantName: '演示商家：天马奶茶档',
    rating: 4.2,
    timeAgo: '1小时前',
    content: '排队时间比预期短，甜度可以调。正式版需要用真实图片、真实时间和学生认证来提高可信度。',
    tags: ['演示评价', '饮品', '少排队']
  },
  {
    id: 'demo-review-4',
    author: '许同学',
    school: '中南大学',
    verification: '演示认证',
    restaurantName: '演示商家：后湖夜宵摊',
    rating: 4.6,
    timeAgo: '2小时前',
    content: '夜宵场景很需要“现在还开不开”和“排不排队”的信息，后续接入真实数据后可以在社区里沉淀避雷和推荐。',
    tags: ['演示评价', '夜宵', '待接入真实数据']
  }
];

export const DEMO_HEAT_DATA = [128, 103, 96, 82, 76, 61, 48, 35];
export const DEMO_VOICE_BAR_HEIGHTS = [22, 34, 46, 30, 40];

export const demoRankingSubTags = {
  '江湖美食': ['湘菜', '川菜', '快餐', '简餐', '烧烤', '小吃', '长沙特色', '面馆', '盖码饭'],
  '佳饮甜点': ['奶茶', '果茶', '甜品', '冰品', '咖啡', '豆花', '双皮奶', '柠檬茶']
};

export const demoLocations = ['全大学城', '麓山南路', '阜埠河', '后湖小区', '天马公寓', '左家垅'];

export const demoDishes = [
  { id: 'dish-1', name: '辣椒炒肉', restaurant: '湘味源', price: 28, heat: 156, tag: '湘菜' },
  { id: 'dish-2', name: '黑色经典臭豆腐', restaurant: '麓山南路臭豆腐', price: 12, heat: 203, tag: '长沙特色' },
  { id: 'dish-3', name: '剁椒鱼头', restaurant: '岳麓山脚剁椒鱼头', price: 68, heat: 89, tag: '湘菜' },
  { id: 'dish-4', name: '珍珠奶茶', restaurant: '天马奶茶档', price: 16, heat: 312, tag: '奶茶' },
  { id: 'dish-5', name: '芒果冰沙', restaurant: '甜蜜时光', price: 22, heat: 178, tag: '甜品' },
  { id: 'dish-6', name: '烤羊肉串', restaurant: '堕子王烧烤', price: 3, heat: 145, tag: '烧烤' },
  { id: 'dish-7', name: '砂锅粉', restaurant: '大学城砂锅饭', price: 15, heat: 97, tag: '简餐' },
  { id: 'dish-8', name: '幽兰拿铁', restaurant: '茶颜悦色大学城店', price: 18, heat: 267, tag: '奶茶' }
];
