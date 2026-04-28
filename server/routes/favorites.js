import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// POST /api/users/me/favorites/:restaurantId — 收藏商家
router.post('/:restaurantId', requireAuth, (req, res) => {
  const { restaurantId } = req.params;
  const userId = req.userId;
  const db = req.db;

  // 检查商家是否存在
  const restaurant = db.prepare('SELECT id FROM restaurants WHERE id = ?').get(restaurantId);
  if (!restaurant) {
    return res.status(404).json({ error: '商家不存在' });
  }

  // 幂等：已收藏则返回现有记录
  const existing = db.prepare(
    'SELECT id FROM favorites WHERE user_id = ? AND restaurant_id = ?'
  ).get(userId, restaurantId);

  if (existing) {
    return res.json({ favorited: true, favoriteId: existing.id });
  }

  const favoriteId = uuidv4();
  db.prepare(`
    INSERT INTO favorites (id, user_id, restaurant_id)
    VALUES (?, ?, ?)
  `).run(favoriteId, userId, restaurantId);

  res.status(201).json({ favorited: true, favoriteId });
});

// DELETE /api/users/me/favorites/:restaurantId — 取消收藏
router.delete('/:restaurantId', requireAuth, (req, res) => {
  const { restaurantId } = req.params;
  const userId = req.userId;
  const db = req.db;

  const result = db.prepare(
    'DELETE FROM favorites WHERE user_id = ? AND restaurant_id = ?'
  ).run(userId, restaurantId);

  if (result.changes === 0) {
    // 幂等：未收藏则返回未收藏状态
    return res.json({ favorited: false });
  }

  res.json({ favorited: false });
});

// GET /api/users/me/favorites — 获取我的收藏列表
router.get('/', requireAuth, (req, res) => {
  const userId = req.userId;
  const db = req.db;

  const favorites = db.prepare(`
    SELECT f.id as favoriteId, f.created_at as favoritedAt,
           r.id, r.name, r.lat, r.lng, r.address, r.category,
           r.poi_id, r.poi_source, r.avg_rating as rating, r.review_count as reviewCount,
           r.avg_price as avgPrice, r.photos_json, r.tel, r.tags_json, r.status
    FROM favorites f
    JOIN restaurants r ON f.restaurant_id = r.id
    WHERE f.user_id = ?
    ORDER BY f.created_at DESC
  `).all(userId);

  const result = favorites.map(f => ({
    id: f.id,
    name: f.name,
    coordinates: { lat: f.lat, lng: f.lng },
    address: f.address,
    category: f.category,
    poiId: f.poi_id,
    source: f.poi_source || 'amap',
    rating: f.rating,
    reviewCount: f.reviewCount || 0,
    avgPrice: f.avgPrice,
    priceLevel: f.avgPrice ? (f.avgPrice <= 25 ? 1 : f.avgPrice <= 60 ? 2 : 3) : null,
    photos: JSON.parse(f.photos_json || '[]'),
    tel: f.tel,
    tags: JSON.parse(f.tags_json || '[]'),
    busyStatus: '暂无实时拥挤信息',
    recentReviews: [],
    hotDishes: [],
    status: f.status,
    isFavorite: true,
    favoritedAt: f.favoritedAt,
  }));

  res.json({ favorites: result, total: result.length });
});

export { router as favoritesRouter };