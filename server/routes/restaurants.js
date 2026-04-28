import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { requireAuth, optionalAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/restaurants — 商家列表（支持 lat/lng/radius/category/keyword 查询）
router.get('/', optionalAuth, (req, res) => {
  const { lat, lng, radius = 3000, category, keyword } = req.query;
  const db = req.db;

  let sql = 'SELECT * FROM restaurants WHERE status NOT IN (\'closed\', \'conflict\')';
  const params = [];

  if (category) {
    sql += ' AND category = ?';
    params.push(category);
  }

  if (keyword) {
    sql += ' AND (name LIKE ? OR address LIKE ?)';
    params.push(`%${keyword}%`, `%${keyword}%`);
  }

  const restaurants = db.prepare(sql).all(...params);

  // 如果有坐标，计算距离并排序
  let result = restaurants.map(r => ({
    id: r.id,
    name: r.name,
    coordinates: { lat: r.lat, lng: r.lng },
    address: r.address,
    category: r.category,
    poiId: r.poi_id,
    source: r.poi_source || 'amap',
    rating: r.avg_rating,
    reviewCount: r.review_count || 0,
    avgPrice: r.avg_price,
    priceLevel: r.avg_price ? (r.avg_price <= 25 ? 1 : r.avg_price <= 60 ? 2 : 3) : null,
    photos: JSON.parse(r.photos_json || '[]'),
    tel: r.tel,
    tags: JSON.parse(r.tags_json || '[]'),
    busyStatus: '暂无实时拥挤信息',
    recentReviews: [],
    hotDishes: [],
    status: r.status,
    isFavorite: false,
    isLiked: false,
    likes: 0,
  }));

  // 如果有用户登录信息，查询收藏状态
  if (req.userId) {
    const favorites = db.prepare(
      'SELECT restaurant_id FROM favorites WHERE user_id = ?'
    ).all(req.userId);
    const favSet = new Set(favorites.map(f => f.restaurant_id));
    result = result.map(r => ({ ...r, isFavorite: favSet.has(r.id) }));
  }

  // 如果有坐标，计算距离并排序
  if (lat && lng) {
    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const r = parseFloat(radius);

    result = result.map(restaurant => {
      const distance = haversine(userLat, userLng, restaurant.coordinates.lat, restaurant.coordinates.lng);
      return { ...restaurant, distance: Math.round(distance) };
    }).filter(restaurant => restaurant.distance <= r)
      .sort((a, b) => a.distance - b.distance);
  }

  res.json({ restaurants: result, total: result.length });
});

// GET /api/restaurants/:id — 商家详情
router.get('/:id', optionalAuth, (req, res) => {
  const { id } = req.params;
  const db = req.db;

  const restaurant = db.prepare('SELECT * FROM restaurants WHERE id = ?').get(id);
  if (!restaurant) {
    return res.status(404).json({ error: '商家不存在' });
  }

  // 获取评价
  const reviews = db.prepare(`
    SELECT r.id, r.rating, r.comment, r.created_at,
           u.nickname, u.school, u.avatar_url
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.restaurant_id = ? AND r.status = 'visible'
    ORDER BY r.created_at DESC
    LIMIT 20
  `).all(id);

  // 是否收藏
  let isFavorite = false;
  if (req.userId) {
    const fav = db.prepare(
      'SELECT id FROM favorites WHERE user_id = ? AND restaurant_id = ?'
    ).get(req.userId, id);
    isFavorite = !!fav;
  }

  res.json({
    id: restaurant.id,
    name: restaurant.name,
    coordinates: { lat: restaurant.lat, lng: restaurant.lng },
    address: restaurant.address,
    category: restaurant.category,
    poiId: restaurant.poi_id,
    source: restaurant.poi_source || 'amap',
    rating: restaurant.avg_rating,
    reviewCount: restaurant.review_count || 0,
    avgPrice: restaurant.avg_price,
    priceLevel: restaurant.avg_price ? (restaurant.avg_price <= 25 ? 1 : restaurant.avg_price <= 60 ? 2 : 3) : null,
    photos: JSON.parse(restaurant.photos_json || '[]'),
    tel: restaurant.tel,
    tags: JSON.parse(restaurant.tags_json || '[]'),
    busyStatus: '暂无实时拥挤信息',
    recentReviews: reviews.map(r => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.created_at,
      user: { nickname: r.nickname, school: r.school, avatarUrl: r.avatar_url },
    })),
    hotDishes: [],
    status: restaurant.status,
    isFavorite,
    isLiked: false,
    likes: 0,
  });
});

// POST /api/restaurants/import — 从前端 POI 数据 upsert 商家
router.post('/import', requireAuth, (req, res) => {
  const {
    name, lat, lng, address, category, poiId, poiSource,
    photos, tel, tags,
  } = req.body;

  if (!name || lat == null || lng == null) {
    return res.status(400).json({ error: '商家名称和坐标为必填项' });
  }

  const db = req.db;

  // 如果有 poiId，检查是否已存在
  if (poiId) {
    const existing = db.prepare('SELECT * FROM restaurants WHERE poi_id = ?').get(poiId);
    if (existing) {
      // 更新已有记录
      db.prepare(`
        UPDATE restaurants SET
          name = ?, lat = ?, lng = ?, address = ?, category = ?,
          photos_json = ?, tel = ?, tags_json = ?,
          updated_at = datetime('now')
        WHERE id = ?
      `).run(
        name, lat, lng, address || '', category || '',
        JSON.stringify(photos || []),
        tel || '',
        JSON.stringify(tags || []),
        existing.id
      );

      return res.json({
        restaurant: { id: existing.id, name, imported: false },
        message: '商家已存在，已更新',
      });
    }
  }

  // 新建商家
  const id = uuidv4();
  db.prepare(`
    INSERT INTO restaurants (id, name, lat, lng, address, category, poi_id, poi_source, photos_json, tel, tags_json, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'imported')
  `).run(
    id, name, lat, lng, address || '', category || '',
    poiId || null, poiSource || 'amap',
    JSON.stringify(photos || []),
    tel || '',
    JSON.stringify(tags || [])
  );

  res.status(201).json({
    restaurant: { id, name, imported: true },
    message: '商家已导入',
  });
});

// Haversine 距离计算（米）
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371000; // 地球半径（米）
  const toRad = (deg) => deg * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export { router as restaurantsRouter };