import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/restaurants/:restaurantId/reviews — 获取商家评价列表
router.get('/:restaurantId/reviews', (req, res) => {
  const { restaurantId } = req.params;
  const { limit = 20, offset = 0 } = req.query;
  const db = req.db;

  // 检查商家是否存在
  const restaurant = db.prepare('SELECT id FROM restaurants WHERE id = ?').get(restaurantId);
  if (!restaurant) {
    return res.status(404).json({ error: '商家不存在' });
  }

  const reviews = db.prepare(`
    SELECT r.id, r.rating, r.comment, r.created_at, r.status,
           u.id as user_id, u.nickname, u.school, u.avatar_url, u.verification_status
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.restaurant_id = ? AND r.status = 'visible'
    ORDER BY r.created_at DESC
    LIMIT ? OFFSET ?
  `).all(restaurantId, parseInt(limit), parseInt(offset));

  const total = db.prepare(
    'SELECT COUNT(*) as count FROM reviews WHERE restaurant_id = ? AND status = \'visible\''
  ).get(restaurantId).count;

  res.json({
    reviews: reviews.map(r => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.created_at,
      status: r.status,
      user: {
        id: r.user_id,
        nickname: r.nickname,
        school: r.school,
        avatarUrl: r.avatar_url,
        verificationStatus: r.verification_status,
      },
    })),
    total,
    limit: parseInt(limit),
    offset: parseInt(offset),
  });
});

// POST /api/restaurants/:restaurantId/reviews — 创建评价（Phase 1: 自动通过）
router.post('/:restaurantId/reviews', requireAuth, (req, res) => {
  const { restaurantId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.userId;
  const db = req.db;

  // 校验
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: '评分必须在 1-5 之间' });
  }
  if (!comment || comment.trim().length < 10) {
    return res.status(400).json({ error: '评价内容至少 10 个字' });
  }
  if (comment.trim().length > 500) {
    return res.status(400).json({ error: '评价内容最多 500 个字' });
  }

  // 检查商家是否存在
  const restaurant = db.prepare('SELECT id FROM restaurants WHERE id = ?').get(restaurantId);
  if (!restaurant) {
    return res.status(404).json({ error: '商家不存在' });
  }

  // 创建评价（Phase 1: 自动设为 visible）
  const reviewId = uuidv4();
  db.prepare(`
    INSERT INTO reviews (id, restaurant_id, user_id, rating, comment, status)
    VALUES (?, ?, ?, ?, ?, 'visible')
  `).run(reviewId, restaurantId, userId, rating, comment.trim());

  // 更新商家聚合评分
  updateRestaurantStats(db, restaurantId);

  // 返回创建的评价
  const review = db.prepare(`
    SELECT r.id, r.rating, r.comment, r.status, r.created_at,
           u.nickname, u.school
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.id = ?
  `).get(reviewId);

  res.status(201).json({
    review: {
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      status: review.status,
      createdAt: review.created_at,
      user: { nickname: review.nickname, school: review.school },
    },
  });
});

// 更新商家聚合评分
function updateRestaurantStats(db, restaurantId) {
  db.prepare(`
    UPDATE restaurants SET
      avg_rating = (SELECT ROUND(AVG(rating), 1) FROM reviews WHERE restaurant_id = ? AND status = 'visible'),
      review_count = (SELECT COUNT(*) FROM reviews WHERE restaurant_id = ? AND status = 'visible'),
      updated_at = datetime('now')
    WHERE id = ?
  `).run(restaurantId, restaurantId, restaurantId);
}

export { router as reviewsRouter };