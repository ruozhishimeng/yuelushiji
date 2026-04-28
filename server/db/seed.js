// 岳麓食纪 — 丰富种子数据
// 运行: node db/seed.js
//
// 包含: 3个用户 + 20个商家 + 40+条评价 + 收藏 + 18条社区图文 + 评论

import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', '..', 'data', 'yuelu.sqlite');

// 确保数据目录存在
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// 读取 schema
const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf-8');
db.exec(schema);

// 清空旧数据（开发用）
db.exec('DELETE FROM post_comments');
db.exec('DELETE FROM community_posts');
db.exec('DELETE FROM favorites');
db.exec('DELETE FROM reviews');
db.exec('DELETE FROM users');
db.exec('DELETE FROM restaurants');

// ──────────────────────────────────────────────
// 用户
// ──────────────────────────────────────────────

const userDemoId = 'demo-user-0001'; // 固定 ID，方便前端测试
const userLilyId = 'demo-user-0002';
const userHaoId  = 'demo-user-0003';

const insertUser = db.prepare(`
  INSERT INTO users (id, nickname, school, avatar_url, verification_status)
  VALUES (?, ?, ?, ?, ?)
`);

insertUser.run(userDemoId, 'tcm', '湖南大学', '', 'verified');
insertUser.run(userLilyId, '莉莉酱', '中南大学', '', 'verified');
insertUser.run(userHaoId,  '浩哥探店', '湖南师范大学', '', 'verified');

// ──────────────────────────────────────────────
// 商家（20 家，覆盖湘菜/烧烤/小吃/奶茶/简餐 等品类）
// ──────────────────────────────────────────────

const restaurantsData = [
  {
    name: '坠落街烧烤王', lat: 28.18560, lng: 112.93860,
    address: '麓山南路堕落街中段', category: '烧烤',
    poi_id: 'amap-B00140G3P9',
    tags: ['烧烤', '夜宵', '堕落街', '排队王'],
    photos: ['/assets/post-duoluojie-bbq.jpg'],
    avg_price: 38, tel: '0731-88880001'
  },
  {
    name: '麓山臭豆腐老店', lat: 28.18420, lng: 112.93780,
    address: '麓山南路与阜埠河路交叉口', category: '小吃',
    poi_id: 'amap-B00140G3PA',
    tags: ['臭豆腐', '长沙特色', '排队', '老字号'],
    photos: ['https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600'],
    avg_price: 12, tel: ''
  },
  {
    name: '天马砂锅饭', lat: 28.18350, lng: 112.93950,
    address: '天马学生公寓食堂二层', category: '简餐',
    poi_id: 'amap-B00140G3PB',
    tags: ['砂锅饭', '简餐', '学生价', '米饭'],
    photos: ['/assets/post-kaoyan-claypot-rice.jpg'],
    avg_price: 18, tel: ''
  },
  {
    name: '岳麓剁椒鱼头馆', lat: 28.18700, lng: 112.93600,
    address: '岳麓山南门入口左侧', category: '湘菜',
    poi_id: 'amap-B00140G3PC',
    tags: ['湘菜', '剁椒鱼头', '聚餐', '老店'],
    photos: ['https://images.unsplash.com/photo-1544025162-d76694265947?w=600'],
    avg_price: 58, tel: '0731-88880004'
  },
  {
    name: '茶百道·大学城店', lat: 28.18400, lng: 112.94050,
    address: '天马路与阜埠河路交叉口', category: '奶茶',
    poi_id: 'amap-B00140G3PD',
    tags: ['奶茶', '果茶', '网红', '连锁'],
    photos: ['https://images.unsplash.com/photo-1558857563-b371033873b8?w=600'],
    avg_price: 15, tel: ''
  },
  {
    name: '老长沙口味虾', lat: 28.18620, lng: 112.93920,
    address: '麓山南路中段', category: '湘菜',
    poi_id: 'amap-B00140G3PE',
    tags: ['龙虾', '口味虾', '夜宵', '长沙特色'],
    photos: ['https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600'],
    avg_price: 65, tel: '0731-88880006'
  },
  {
    name: '螺蛳粉小站', lat: 28.18510, lng: 112.93810,
    address: '堕落街东口', category: '小吃',
    poi_id: 'amap-B00140G3PF',
    tags: ['螺蛳粉', '粉面', '重口味', '学生最爱'],
    photos: ['https://images.unsplash.com/photo-1555126634-323283e090fa?w=600'],
    avg_price: 16, tel: ''
  },
  {
    name: '湖南米粉铺', lat: 28.18380, lng: 112.93720,
    address: '阜埠河路与麓山南路交汇', category: '小吃',
    poi_id: 'amap-B00140G3PG',
    tags: ['米粉', '长沙特色', '早餐', '牛肉粉'],
    photos: ['https://images.unsplash.com/photo-1569058242567-93de6f36f8f6?w=600'],
    avg_price: 14, tel: ''
  },
  {
    name: '蜜雪冰城·天马店', lat: 28.18450, lng: 112.94080,
    address: '天马学生公寓底商', category: '奶茶',
    poi_id: 'amap-B00140G3PH',
    tags: ['奶茶', '冰品', '性价比', '学生价'],
    photos: ['https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600'],
    avg_price: 6, tel: ''
  },
  {
    name: '重庆鸡公煲', lat: 28.18580, lng: 112.93900,
    address: '伊斯兰堡牛肉面旁巷内', category: '简餐',
    poi_id: 'amap-B00140G3PI',
    tags: ['鸡公煲', '米饭', '一人食', '微辣'],
    photos: ['https://images.unsplash.com/photo-1534422298631-64a2285d0e69?w=600'],
    avg_price: 28, tel: ''
  },
  {
    name: '书亦烧草·大学城', lat: 28.18320, lng: 112.93960,
    address: '阜埠河路', category: '奶茶',
    poi_id: 'amap-B00140G3PJ',
    tags: ['烧仙草', '奶茶', '果茶', '连锁'],
    photos: ['https://images.unsplash.com/photo-1461023058943-07fcbe309012?w=600'],
    avg_price: 13, tel: ''
  },
  {
    name: '外婆炊包', lat: 28.18650, lng: 112.93830,
    address: '麓山南路西段', category: '简餐',
    poi_id: 'amap-B00140G3PK',
    tags: ['盖码饭', '蒸菜', '家常菜', '米饭'],
    photos: ['https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600'],
    avg_price: 22, tel: ''
  },
  {
    name: '老字号糖油粑粑', lat: 28.18470, lng: 112.93750,
    address: '麓山南路', category: '小吃',
    poi_id: 'amap-B00140G3PL',
    tags: ['糖油粑粑', '甜品', '长沙特色', '老字号'],
    photos: ['https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600'],
    avg_price: 8, tel: ''
  },
  {
    name: '杨国福麻辣烫', lat: 28.18430, lng: 112.94020,
    address: '天马路', category: '简餐',
    poi_id: 'amap-B00140G3PM',
    tags: ['麻辣烫', '自选', '一人食', '连锁'],
    photos: ['https://images.unsplash.com/photo-1583032015879-41a5e5f0b6db?w=600'],
    avg_price: 25, tel: ''
  },
  {
    name: '古茗·岳麓店', lat: 28.18680, lng: 112.93710,
    address: '岳麓山下', category: '奶茶',
    poi_id: 'amap-B00140G3PN',
    tags: ['奶茶', '果茶', '连锁', '新品多'],
    photos: ['https://images.unsplash.com/photo-1525803377221-511e07993f6d?w=600'],
    avg_price: 14, tel: ''
  },
  {
    name: '柴火饭庄', lat: 28.18530, lng: 112.93980,
    address: '后湖小区北门', category: '湘菜',
    poi_id: 'amap-B00140G3PO',
    tags: ['湘菜', '柴火饭', '聚餐', '老店'],
    photos: ['https://images.unsplash.com/photo-1555396273-2dbc25a2c0d7?w=600'],
    avg_price: 52, tel: '0731-88880016'
  },
  {
    name: '左家垅炒码粉', lat: 28.18280, lng: 112.94100,
    address: '左家垅', category: '小吃',
    poi_id: 'amap-B00140G3PP',
    tags: ['炒码粉', '长沙特色', '早餐', '粉面'],
    photos: ['https://images.unsplash.com/photo-1552611056-41be59265f5a?w=600'],
    avg_price: 13, tel: ''
  },
  {
    name: '益禾堂·麓山南', lat: 28.18500, lng: 112.93700,
    address: '麓山南路', category: '奶茶',
    poi_id: 'amap-B00140G3PQ',
    tags: ['奶茶', '烤奶', '学生价', '连锁'],
    photos: ['https://images.unsplash.com/photo-1557142046-c704a3adf364?w=600'],
    avg_price: 10, tel: ''
  },
  {
    name: '铁板厨房', lat: 28.18390, lng: 112.93880,
    address: '阜埠河路', category: '简餐',
    poi_id: 'amap-B00140G3PR',
    tags: ['铁板烧', '简餐', '一人食', '性价比'],
    photos: ['https://images.unsplash.com/photo-1547592180-85a173df4867?w=600'],
    avg_price: 32, tel: ''
  },
  {
    name: '肯德基·大学城', lat: 28.18460, lng: 112.93900,
    address: '大学城商业广场一层', category: '快餐',
    poi_id: 'amap-B00140G3PS',
    tags: ['快餐', '炸鸡', '连锁', '外卖'],
    photos: ['https://images.unsplash.com/photo-1572802419226-3c0a1a4e3c0f?w=600'],
    avg_price: 30, tel: '0731-88880020'
  },
];

const insertRestaurant = db.prepare(`
  INSERT INTO restaurants (id, name, lat, lng, address, category, poi_id, poi_source, status, avg_price, photos_json, tel, tags_json)
  VALUES (?, ?, ?, ?, ?, ?, ?, 'amap', 'verified', ?, ?, ?, ?)
`);

const restaurantIds = [];
for (const r of restaurantsData) {
  const id = uuidv4();
  restaurantIds.push(id);
  insertRestaurant.run(
    id, r.name, r.lat, r.lng, r.address, r.category, r.poi_id,
    r.avg_price,
    JSON.stringify(r.photos),
    r.tel,
    JSON.stringify(r.tags)
  );
}

// ──────────────────────────────────────────────
// 评价（每个商家 2-3 条，覆盖不同用户）
// ──────────────────────────────────────────────

const reviewsData = [
  // 烧烤王 (0)
  { ri: 0, ui: 0, rating: 5, comment: '堕落街老字号烧烤，每次来必点烤翅和蒜蓉生蚝，味道超正！价格也实惠，4个人吃人均才40' },
  { ri: 0, ui: 1, rating: 4, comment: '烧烤品种多，烤茄子是招牌。周末人太多，建议工作日去' },
  { ri: 0, ui: 2, rating: 5, comment: '大学四年来的最多的地方，没有之一。老板人超好，还会送可乐' },

  // 臭豆腐 (1)
  { ri: 1, ui: 0, rating: 5, comment: '长沙第一臭豆腐！外酥里嫩，配上秘制辣椒酱绝了。排队也值得' },
  { ri: 1, ui: 2, rating: 4, comment: '味道正宗，就是排队太久了，至少半小时起步' },

  // 砂锅饭 (2)
  { ri: 2, ui: 0, rating: 4, comment: '砂锅饭分量足，出锅快，价格感人。推荐酸辣鸡杂盖码' },
  { ri: 2, ui: 1, rating: 5, comment: '学生党福音！12块就能吃到撑，砂锅保温效果很好' },
  { ri: 2, ui: 2, rating: 4, comment: '比食堂好吃太多了，就是中午人巨多' },

  // 剁椒鱼头 (3)
  { ri: 3, ui: 0, rating: 5, comment: '剁椒鱼头是招牌中的招牌，鱼肉鲜嫩，辣度刚好适合聚餐' },
  { ri: 3, ui: 1, rating: 5, comment: '岳麓山下最正宗的湘菜馆，适合带朋友来体验正宗长沙味' },
  { ri: 3, ui: 2, rating: 4, comment: '人均60左右，环境一般但味道没得说' },

  // 茶百道 (4)
  { ri: 4, ui: 0, rating: 4, comment: '杨枝甘露yyds！珍珠奶茶也不错，就是出杯有点慢' },
  { ri: 4, ui: 1, rating: 3, comment: '和其他茶百道差不多，胜在位置方便' },

  // 口味虾 (5)
  { ri: 5, ui: 0, rating: 5, comment: '长沙口味虾天花板！蒜蓉和油焖都绝，夏天必来' },
  { ri: 5, ui: 2, rating: 4, comment: '虾个头大、肉质Q弹，就是价格有点小贵' },

  // 螺蛳粉 (6)
  { ri: 6, ui: 1, rating: 5, comment: '螺蛳粉爱好者天堂！汤底浓郁，配菜丰富，酸笋够味' },
  { ri: 6, ui: 0, rating: 4, comment: '闻着臭吃着香，不愧是堕落街排队王' },

  // 米粉铺 (7)
  { ri: 7, ui: 0, rating: 5, comment: '牛肉粉绝了，汤底熬了6小时，牛肉给得很大方' },
  { ri: 7, ui: 2, rating: 4, comment: '早餐首选，7块钱一碗肉丝粉，学生价良心' },

  // 蜜雪冰城 (8)
  { ri: 8, ui: 1, rating: 4, comment: '性价比之王，3块钱的柠檬水就够了！' },
  { ri: 8, ui: 0, rating: 3, comment: '便宜是便宜，味道还行，就是排队太多人了' },

  // 鸡公煲 (9)
  { ri: 9, ui: 0, rating: 4, comment: '一个人吃刚好，鸡肉入味，加宽粉是灵魂' },
  { ri: 9, ui: 2, rating: 4, comment: '冬天来一锅鸡公煲太满足了，就是有点咸' },

  // 书亦烧草 (10)
  { ri: 10, ui: 1, rating: 4, comment: '烧仙草是真材实料，不是粉冲的，推荐' },
  { ri: 10, ui: 0, rating: 4, comment: '新品杨梅系列不错，果肉很多' },

  // 外婆炊包 (11)
  { ri: 11, ui: 0, rating: 4, comment: '盖码饭性价比高，酸辣鸡杂和辣椒炒肉都不错' },
  { ri: 11, ui: 2, rating: 3, comment: '菜的味道可以，但是米饭有点硬' },

  // 糖油粑粑 (12)
  { ri: 12, ui: 1, rating: 5, comment: '长沙必吃！甜而不腻，外酥内软，3块钱一大个' },
  { ri: 12, ui: 0, rating: 4, comment: '热乎的最好吃，凉了就一般了' },

  // 麻辣烫 (13)
  { ri: 13, ui: 0, rating: 3, comment: '中规中矩的麻辣烫，品种多但味道一般' },
  { ri: 13, ui: 2, rating: 4, comment: '自选方便，酱料区丰富，可以自己调' },

  // 古茗 (14)
  { ri: 14, ui: 1, rating: 4, comment: '新品更新快，芝士莓莓好喝' },
  { ri: 14, ui: 0, rating: 4, comment: '价格适中，口感比蜜雪好' },

  // 柴火饭庄 (15)
  { ri: 15, ui: 0, rating: 5, comment: '正宗柴火饭！锅巴超香，小炒肉下饭神器' },
  { ri: 15, ui: 2, rating: 4, comment: '适合聚餐，分量大，人均50左右' },

  // 炒码粉 (16)
  { ri: 16, ui: 1, rating: 5, comment: '码子现炒的，不是预制菜，赞！' },
  { ri: 16, ui: 0, rating: 4, comment: '辣椒炒肉码粉绝了，移动到左家垅必吃' },

  // 益禾堂 (17)
  { ri: 17, ui: 1, rating: 4, comment: '烤奶是真不错，10块钱一大杯' },

  // 铁板厨房 (18)
  { ri: 18, ui: 0, rating: 4, comment: '铁板牛肉口感不错，就是油烟大了点' },
  { ri: 18, ui: 2, rating: 3, comment: '味道还行，环境一般' },

  // 肯德基 (19)
  { ri: 19, ui: 0, rating: 3, comment: '标准肯德基，没啥特别的，胜在稳定' },
  { ri: 19, ui: 1, rating: 3, comment: '赶课来不及吃饭就来这里，外卖速度也快' },
];

const insertReview = db.prepare(`
  INSERT INTO reviews (id, restaurant_id, user_id, rating, comment, status)
  VALUES (?, ?, ?, ?, ?, 'visible')
`);

const userIds = [userDemoId, userLilyId, userHaoId];
for (const r of reviewsData) {
  insertReview.run(uuidv4(), restaurantIds[r.ri], userIds[r.ui], r.rating, r.comment);
}

// 更新商家聚合评分
const updateRatings = db.prepare(`
  UPDATE restaurants SET
    avg_rating = (SELECT ROUND(AVG(rating), 1) FROM reviews WHERE restaurant_id = ? AND status = 'visible'),
    review_count = (SELECT COUNT(*) FROM reviews WHERE restaurant_id = ? AND status = 'visible'),
    updated_at = datetime('now')
  WHERE id = ?
`);

for (const id of restaurantIds) {
  updateRatings.run(id, id, id);
}

// ──────────────────────────────────────────────
// 收藏（主要测试用户收藏5家）
// ──────────────────────────────────────────────

const insertFavorite = db.prepare(`
  INSERT OR IGNORE INTO favorites (id, user_id, restaurant_id)
  VALUES (?, ?, ?)
`);

// 小岳同学收藏
insertFavorite.run(uuidv4(), userDemoId, restaurantIds[0]); // 烧烤王
insertFavorite.run(uuidv4(), userDemoId, restaurantIds[1]); // 臭豆腐
insertFavorite.run(uuidv4(), userDemoId, restaurantIds[3]); // 剁椒鱼头
insertFavorite.run(uuidv4(), userDemoId, restaurantIds[5]); // 口味虾
insertFavorite.run(uuidv4(), userDemoId, restaurantIds[15]); // 柴火饭庄
// 莉莉酱收藏
insertFavorite.run(uuidv4(), userLilyId, restaurantIds[4]); // 茶百道
insertFavorite.run(uuidv4(), userLilyId, restaurantIds[6]); // 螺蛳粉
insertFavorite.run(uuidv4(), userLilyId, restaurantIds[12]); // 糖油粑粑

// ──────────────────────────────────────────────
// 社区帖子（18 条图文，覆盖不同场景标签）
// ──────────────────────────────────────────────

const postsData = [
  {
    user_id: userDemoId,
    title: '堕落街烧烤大测评！四家店横评排名',
    summary: '作为一个吃了四年烧烤的老手，终于做了这期横评...',
    content: '作为一个在堕落街吃了四年烧烤的老手，终于做了这期横评。堕落街烧烤王毫无疑问排第一，翅中和蒜蓉生蚝是必点。另外三家的烤串也不错，但调味差一点。人均30-45，推荐4人拼桌。',
    cover: '/assets/post-duoluojie-bbq.jpg',
    images: JSON.stringify([
      '/assets/post-duoluojie-bbq.jpg',
      'https://images.unsplash.com/photo-1544025162-d76694265947?w=600',
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600',
    ]),
    category: '测评',
    rating: 4.8,
    validation_score: 92,
    like_count: 156,
    comment_count: 23,
    scene_tags: JSON.stringify(['朋友聚餐', '赶课快吃']),
    tags: JSON.stringify(['烧烤', '测评', '堕落街']),
    restaurant_id: restaurantIds[0],
  },
  {
    user_id: userLilyId,
    title: '岳麓山脚这一碗剁椒鱼头，值得打车来',
    summary: '人均60，但这一口鱼头让你觉得每分钱都值...',
    content: '岳麓山南门这家剁椒鱼头馆真的绝了！鱼头新鲜、剁椒自制，辣度可以跟老板说。4个人吃了200出头，还点了小炒黄牛肉和手撕包菜，下饭之神。建议提前打电话预约，周末等位1小时+。',
    cover: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1544025162-d76694265947?w=600',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600',
    ]),
    category: '湘菜',
    rating: 4.9,
    validation_score: 95,
    like_count: 203,
    comment_count: 31,
    scene_tags: JSON.stringify(['朋友聚餐', '适合约会']),
    tags: JSON.stringify(['湘菜', '剁椒鱼头', '聚餐']),
    restaurant_id: restaurantIds[3],
  },
  {
    user_id: userHaoId,
    title: '长沙臭豆腐终极指南：学校门口排半小时值不值？',
    summary: '从外观到口感到价格，全方位评分...',
    content: '麓山南路这家臭豆腐是我在大学城吃过的最好的，没有之一。外酥里嫩，配上酸豆角和秘制辣椒，一口下去汤汁四溢。排队基本半小时起步，但拿到了你会发现一切都值得。12块一份，价格良心。',
    cover: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600',
      'https://images.unsplash.com/photo-1555126634-323283e090fa?w=600',
    ]),
    category: '小吃',
    rating: 4.7,
    validation_score: 88,
    like_count: 89,
    comment_count: 15,
    scene_tags: JSON.stringify(['赶课快吃', '一人食']),
    tags: JSON.stringify(['臭豆腐', '长沙特色', '排队王']),
    restaurant_id: restaurantIds[1],
  },
  {
    user_id: userDemoId,
    title: '考研人的食堂：天马砂锅饭生存手册',
    summary: '12块吃饱，18块吃好，考研党的精神支柱...',
    content: '天马公寓食堂二楼的砂锅饭，是我考研期间的精神支柱。酸辣鸡杂盖码绝了，米饭给得超多，12块就能吃到撑。中午11:30到12:30人爆多，建议11点或1点去。出餐速度5分钟左右。',
    cover: '/assets/post-kaoyan-claypot-rice.jpg',
    images: JSON.stringify([
      '/assets/post-kaoyan-claypot-rice.jpg',
    ]),
    category: '简餐',
    rating: 4.3,
    validation_score: 85,
    like_count: 67,
    comment_count: 9,
    scene_tags: JSON.stringify(['赶课快吃', '一人食', '预算友好']),
    tags: JSON.stringify(['砂锅饭', '学生价', '考研']),
    restaurant_id: restaurantIds[2],
  },
  {
    user_id: userLilyId,
    title: '大学城奶茶地图：8家横评，谁才是性价比之王？',
    summary: '从蜜雪3块到古茗18块，口感、颜值、性价比全方位打分...',
    content: '这次横评了大学城8家奶茶店：蜜雪冰城、茶百道、古茗、书亦烧草、益禾堂、九多鲜、一只酸奶牛、CoCo。综合排名：1.古茗（口感颜值双优）2.茶百道（杨枝甘露yyds）3.益禾堂（烤奶10块无敌）...详细评分见图！',
    cover: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=600',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1558857563-b371033873b8?w=600',
      'https://images.unsplash.com/photo-1525803377221-511e07993f6d?w=600',
      'https://images.unsplash.com/photo-1461023058943-07fcbe309012?w=600',
    ]),
    category: '奶茶',
    rating: 4.5,
    validation_score: 91,
    like_count: 234,
    comment_count: 42,
    scene_tags: JSON.stringify(['赶课快吃', '一人食']),
    tags: JSON.stringify(['奶茶', '横评', '性价比']),
    restaurant_id: restaurantIds[4],
  },
  {
    user_id: userHaoId,
    title: '口味虾实测：夏天没吃过这家等于没来长沙',
    summary: '蒜蓉 vs 油焖，哪个才是口味虾天花板？',
    content: '这家口味虾是我吃过最好的，没有之一。蒜蓉味和油焖味都绝了，虾个头大肉质Q弹，处理得也很干净。夏天晚上坐在这里吃口味虾喝啤酒，这才是长沙的夏天啊！人均65左右，4人起吃比较划算。',
    cover: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600',
    ]),
    category: '湘菜',
    rating: 4.8,
    validation_score: 90,
    like_count: 178,
    comment_count: 28,
    scene_tags: JSON.stringify(['朋友聚餐']),
    tags: JSON.stringify(['口味虾', '长沙特色', '夜宵']),
    restaurant_id: restaurantIds[5],
  },
  {
    user_id: userDemoId,
    title: '螺蛳粉入坑记：从拒绝到真香的7天',
    summary: '闻着臭吃着香，这是真的...',
    content: '作为曾经的螺蛳粉黑，现在每周必吃一次。这家的汤底是真正的螺蛳熬出来的，不是调料包，酸笋够臭够味。推荐加炸蛋和酸萝卜，味道更上一层。16块一碗，量很足。',
    cover: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=600',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1555126634-323283e090fa?w=600',
    ]),
    category: '小吃',
    rating: 4.5,
    validation_score: 82,
    like_count: 56,
    comment_count: 12,
    scene_tags: JSON.stringify(['一人食', '赶课快吃']),
    tags: JSON.stringify(['螺蛳粉', '重口味', '学生最爱']),
    restaurant_id: restaurantIds[6],
  },
  {
    user_id: userLilyId,
    title: '7块钱的牛肉粉：湖南米粉铺早餐测评',
    summary: '汤底熬6小时的自制米粉，这价格太良心了...',
    content: '湖南米粉铺的牛肉粉是我早餐首选，7块钱一碗肉丝粉，14块牛肉粉，汤底真的是熬出来的不是冲的。牛肉给得很实在，分量也够。每天早上7点开门，经常排到8点半。',
    cover: 'https://images.unsplash.com/photo-1569058242567-93de6f36f8f6?w=600',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1569058242567-93de6f36f8f6?w=600',
    ]),
    category: '小吃',
    rating: 4.6,
    validation_score: 87,
    like_count: 98,
    comment_count: 16,
    scene_tags: JSON.stringify(['赶课快吃', '一人食', '预算友好']),
    tags: JSON.stringify(['米粉', '早餐', '长沙特色']),
    restaurant_id: restaurantIds[7],
  },
  {
    user_id: userHaoId,
    title: '蜜雪冰城 vs 益禾堂：3块钱到10块的奶茶战争',
    summary: '学生党的日常选择题...',
    content: '蜜雪3块的柠檬水是永远的神，但如果你想要口感更好一点的，益禾堂10块的烤奶更香。两家都在天马附近，走两分钟就到。我的选择：赶课喝蜜雪，周末喝益禾堂。',
    cover: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600',
      'https://images.unsplash.com/photo-1557142046-c704a3adf364?w=600',
    ]),
    category: '奶茶',
    rating: 3.8,
    validation_score: 75,
    like_count: 45,
    comment_count: 18,
    scene_tags: JSON.stringify(['赶课快吃', '一人食']),
    tags: JSON.stringify(['奶茶', '性价比', '学生价']),
    restaurant_id: restaurantIds[8],
  },
  {
    user_id: userDemoId,
    title: '柴火饭庄：室友4人聚餐，人均52吃撑了',
    summary: '柴火饭就是不一样，锅巴脆到飞起...',
    content: '室友4人来聚餐，点了小炒黄牛肉、手撕包菜、柴火饭、酸萝卜老鸭汤，还有个农家小炒肉。柴火煮出来的饭真的不一样，锅巴又香又脆，配小炒黄牛肉简直是绝配。人均52，分量大到打包。',
    cover: 'https://images.unsplash.com/photo-1555396273-2dbc25a2c0d7?w=600',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1555396273-2dbc25a2c0d7?w=600',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600',
    ]),
    category: '湘菜',
    rating: 4.7,
    validation_score: 93,
    like_count: 132,
    comment_count: 19,
    scene_tags: JSON.stringify(['朋友聚餐', '适合约会']),
    tags: JSON.stringify(['湘菜', '柴火饭', '聚餐']),
    restaurant_id: restaurantIds[15],
  },
  {
    user_id: userLilyId,
    title: '糖油粑粑：3块钱买到的幸福感',
    summary: '长沙最便宜的幸福，不接受反驳...',
    content: '老字号糖油粑粑，3块一个，外酥里糯，甜而不腻。一定要趁热吃！走过了岳麓书院，来一个糖油粑粑，这就是长沙的幸福感。',
    cover: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600',
    ]),
    category: '小吃',
    rating: 4.4,
    validation_score: 80,
    like_count: 76,
    comment_count: 8,
    scene_tags: JSON.stringify(['赶课快吃', '一人食', '预算友好']),
    tags: JSON.stringify(['糖油粑粑', '长沙特色', '甜品']),
    restaurant_id: restaurantIds[12],
  },
  {
    user_id: userHaoId,
    title: '鸡公煲一人食：冬天最暖的陪伴',
    summary: '一个人也要好好吃饭系列...',
    content: '重庆鸡公煲简直是冬天一人食的天花板。鸡肉入味，加一份宽粉是灵魂。28块一锅，米饭免费续，吃到扶墙出。建议加豆皮和土豆片，吸汁后超好吃。',
    cover: 'https://images.unsplash.com/photo-1534422298631-64a2285d0e69?w=600',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1534422298631-64a2285d0e69?w=600',
    ]),
    category: '简餐',
    rating: 4.2,
    validation_score: 84,
    like_count: 61,
    comment_count: 11,
    scene_tags: JSON.stringify(['一人食', '赶课快吃']),
    tags: JSON.stringify(['鸡公煲', '一人食', '冬天必吃']),
    restaurant_id: restaurantIds[9],
  },
  {
    user_id: userDemoId,
    title: '左家垅炒码粉：现炒的码子就是不一般',
    summary: '不是预制菜！不是预制菜！不是预制菜！...',
    content: '重要的说三遍。左家垅这家炒码粉的码子真的是现炒的，你能看到老板在那边颠锅。辣椒炒肉码是招牌，肉片嫩滑，辣椒够味。粉的口感也好，不是那种煮烂的。强烈推荐！',
    cover: 'https://images.unsplash.com/photo-1552611056-41be59265f5a?w=600',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1552611056-41be59265f5a?w=600',
    ]),
    category: '小吃',
    rating: 4.5,
    validation_score: 86,
    like_count: 87,
    comment_count: 14,
    scene_tags: JSON.stringify(['赶课快吃', '一人食']),
    tags: JSON.stringify(['炒码粉', '长沙特色', '现炒']),
    restaurant_id: restaurantIds[16],
  },
  {
    user_id: userLilyId,
    title: '书亦烧仙草：冬日里的一杯暖意',
    summary: '不是粉冲的！真材实料烧仙草...',
    content: '书亦的烧仙草是真的用仙草熬的，不是粉冲的，这个在奶茶行业真的难得。芋圆Q弹有嚼劲，推荐加波波和椰果。冬天来一杯热的，太治愈了。',
    cover: 'https://images.unsplash.com/photo-1461023058943-07fcbe309012?w=600',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1461023058943-07fcbe309012?w=600',
    ]),
    category: '奶茶',
    rating: 4.3,
    validation_score: 83,
    like_count: 54,
    comment_count: 7,
    scene_tags: JSON.stringify(['赶课快吃', '一人食']),
    tags: JSON.stringify(['烧仙草', '奶茶', '冬日暖心']),
    restaurant_id: restaurantIds[10],
  },
  {
    user_id: userHaoId,
    title: '盖码饭大比拼：外婆炊包 vs 食堂三楼',
    summary: '同样是盖码饭，价格差一倍，味道呢？',
    content: '外婆炊包vs食堂三楼盖码饭，口感上外婆炊包完胜。酸辣鸡杂盖码是真的酸辣，食堂那种偏甜。价格方面食堂12外婆22，但分量外婆大得多。综合：赶课吃食堂，有空吃外婆。',
    cover: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600',
    ]),
    category: '简餐',
    rating: 4.0,
    validation_score: 78,
    like_count: 72,
    comment_count: 13,
    scene_tags: JSON.stringify(['赶课快吃', '一人食']),
    tags: JSON.stringify(['盖码饭', '性价比', '学生价']),
    restaurant_id: restaurantIds[11],
  },
  {
    user_id: userDemoId,
    title: '麻辣烫自由：杨国福自选攻略',
    summary: '5块钱也能吃，50块也能吃，全看你怎么选...',
    content: '杨国福的精髓在于酱料区，推荐芝麻酱+蒜蓉+陈醋+香菜，蘸什么都好吃。选菜建议多拿娃娃菜和豆皮，吸汁而且便宜。避开粉丝（重量大但吃不饱），多拿肉类。25块能吃很饱。',
    cover: 'https://images.unsplash.com/photo-1583032015879-41a5e5f0b6db?w=600',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1583032015879-41a5e5f0b6db?w=600',
    ]),
    category: '简餐',
    rating: 3.8,
    validation_score: 76,
    like_count: 38,
    comment_count: 8,
    scene_tags: JSON.stringify(['一人食', '预算友好']),
    tags: JSON.stringify(['麻辣烫', '自选', '攻略']),
    restaurant_id: restaurantIds[13],
  },
  {
    user_id: userLilyId,
    title: '古茗新品试喝：芝士莓莓到底值不值18？',
    summary: '颜值在线，味道呢？详细测评来了...',
    content: '古茗这次的新品芝士莓莓颜值确实高，拍照发朋友圈素材拉满。口感方面，芝士奶盖+真实草莓果肉，不算太甜但不腻。18块在大学城奶茶里算偏贵的，如果你是颜值党可以冲，性价比党还是推荐益禾堂。',
    cover: 'https://images.unsplash.com/photo-1525803377221-511e07993f6d?w=600',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1525803377221-511e07993f6d?w=600',
    ]),
    category: '奶茶',
    rating: 4.1,
    validation_score: 79,
    like_count: 41,
    comment_count: 6,
    scene_tags: JSON.stringify(['适合约会']),
    tags: JSON.stringify(['奶茶', '新品', '颜值']),
    restaurant_id: restaurantIds[14],
  },
  {
    user_id: userHaoId,
    title: '铁板厨房实测：30块吃铁板，值不值？',
    summary: '油烟味有点重，但铁板牛肉确实够味...',
    content: '环境和评分前三的氛围感不搭，就是一个小店，油烟味比较重，坐在对面的兄弟都能闻到你吃的啥。但铁板牛肉确实够味，32块一份，肉量还行。如果你不介意油烟，性价比其实不错。',
    cover: 'https://images.unsplash.com/photo-1547592180-85a173df4867?w=600',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1547592180-85a173df4867?w=600',
    ]),
    category: '简餐',
    rating: 3.5,
    validation_score: 70,
    like_count: 29,
    comment_count: 5,
    scene_tags: JSON.stringify(['一人食', '预算友好']),
    tags: JSON.stringify(['铁板烧', '一人食', '性价比']),
    restaurant_id: restaurantIds[18],
  },
];

const insertPost = db.prepare(`
  INSERT INTO community_posts (id, user_id, title, summary, content, cover, images_json, category, rating, validation_score, like_count, comment_count, scene_tags_json, tags_json, restaurant_id, is_demo)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
`);

const users = [
  { id: userDemoId, nickname: '小岳同学', school: '湖南大学' },
  { id: userLilyId, nickname: '莉莉酱', school: '中南大学' },
  { id: userHaoId, nickname: '浩哥探店', school: '湖南师范大学' },
];

const postIds = [];
for (const p of postsData) {
  const id = uuidv4();
  postIds.push(id);
  insertPost.run(
    id, p.user_id, p.title, p.summary, p.content, p.cover,
    p.images, p.category, p.rating, p.validation_score,
    p.like_count, p.comment_count, p.scene_tags, p.tags,
    p.restaurant_id
  );
}

// ──────────────────────────────────────────────
// 帖子评论
// ──────────────────────────────────────────────

const commentsData = [
  { pi: 0, ui: 1, content: '烧烤王确实排第一！下次去试试蒜蓉生蚝' },
  { pi: 0, ui: 2, content: '横评很用心，已收藏' },
  { pi: 1, ui: 0, content: '这家我去过！确实值得打车来' },
  { pi: 1, ui: 2, content: '下周聚餐就定这家了' },
  { pi: 2, ui: 0, content: '排队半小时真的，但味道没让人失望' },
  { pi: 2, ui: 1, content: '我每次去都买双份，实在太好吃了' },
  { pi: 3, ui: 1, content: '考研人的精神支柱证实' },
  { pi: 3, ui: 2, content: '12块吃到撑是真的，酸辣鸡杂盖码绝了' },
  { pi: 4, ui: 0, content: '古茗第一我服！杨枝甘露确实好喝' },
  { pi: 4, ui: 2, content: '益禾堂烤奶也应该上榜' },
  { pi: 4, ui: 2, content: '我的排名：古茗 > 茶百道 > 益禾堂' },
  { pi: 5, ui: 1, content: '夏天就该吃口味虾喝啤酒！' },
  { pi: 5, ui: 2, content: '蒜蓉味和油焖味都试了，油焖更辣更过瘾' },
  { pi: 9, ui: 0, content: '柴火饭真的是灵魂！锅巴太香了' },
  { pi: 9, ui: 1, content: '人均52可以接受，下次带人来' },
  { pi: 10, ui: 0, content: '3块一个确实便宜！' },
  { pi: 12, ui: 1, content: '现炒码子真的不一样，口感差太远了' },
];

const insertComment = db.prepare(`
  INSERT INTO post_comments (id, post_id, user_id, author_name, author_school, content)
  VALUES (?, ?, ?, ?, ?, ?)
`);

for (const c of commentsData) {
  const user = users[c.ui];
  insertComment.run(
    uuidv4(), postIds[c.pi], user.id, user.nickname, user.school, c.content
  );
}

// ──────────────────────────────────────────────
// 汇总输出
// ──────────────────────────────────────────────

console.log('');
console.log('✅ 种子数据插入完成');
console.log(`   👤  用户:      ${users.length} 条（含测试账号 demo-user-0001）`);
console.log(`   🏪  商家:      ${restaurantsData.length} 条`);
console.log(`   📝  评价:      ${reviewsData.length} 条`);
console.log(`   ❤️  收藏:      8 条`);
console.log(`   📰  社区帖子: ${postsData.length} 条`);
console.log(`   💬  评论:      ${commentsData.length} 条`);
console.log('');
console.log('🔑 测试账号:');
console.log(`   小岳同学 (已验证): userId = ${userDemoId}`);
console.log(`   莉莉酱   (已验证): userId = ${userLilyId}`);
console.log(`   浩哥探店 (已验证): userId = ${userHaoId}`);
console.log('');

db.close();