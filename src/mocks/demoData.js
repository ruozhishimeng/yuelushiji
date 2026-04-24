import { Award, Building2, Heart, MapPin, Settings, User, Utensils } from 'lucide-react';

export const demoUser = {
  name: '王同学',
  school: '中南大学',
  avatar: ''
};

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
