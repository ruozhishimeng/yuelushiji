import { Router } from 'express';

const router = Router();

const COMMUNITY_IMAGE_MAP = {
  "https://images.unsplash.com/photo-1555939594-58d7cbad1b4e?w=600": "/assets/post-duoluojie-bbq.jpg",
  "https://images.unsplash.com/photo-1512058564369-b4a0f7a3040a?w=600": "/assets/post-kaoyan-claypot-rice.jpg",
};

const normalizeCommunityImage = (url) => COMMUNITY_IMAGE_MAP[url] || url;
const normalizeCommunityImages = (images = []) => images.map((image) => normalizeCommunityImage(image));


// GET /api/community/posts — 社区帖子列表
// 支持 category / school / sort 查询参数
router.get('/posts', (req, res) => {
  const { category, sort = 'latest', limit = 30, offset = 0 } = req.query;
  const db = req.db;

  let sql = `
    SELECT
      cp.id, cp.title, cp.summary, cp.content, cp.cover, cp.images_json,
      cp.category, cp.rating, cp.validation_score, cp.like_count, cp.comment_count,
      cp.scene_tags_json, cp.tags_json, cp.restaurant_id, cp.is_demo,
      cp.created_at,
      u.nickname AS author, u.school, u.avatar_url
    FROM community_posts cp
    JOIN users u ON cp.user_id = u.id
    WHERE 1=1
  `;
  const params = [];

  if (category) {
    sql += ' AND cp.category = ?';
    params.push(category);
  }

  // 排序
  if (sort === 'hot') {
    sql += ' ORDER BY cp.like_count DESC, cp.created_at DESC';
  } else if (sort === 'rating') {
    sql += ' ORDER BY cp.rating DESC NULLS LAST, cp.created_at DESC';
  } else {
    sql += ' ORDER BY cp.created_at DESC';
  }

  const numLimit = Math.min(Number(limit) || 30, 100);
  const numOffset = Number(offset) || 0;
  sql += ' LIMIT ? OFFSET ?';
  params.push(numLimit, numOffset);

  const posts = db.prepare(sql).all(...params);

  // 对每条帖子，获取评论和 restaurant 信息
  const result = posts.map(post => {
    let restaurant = null;
    if (post.restaurant_id) {
      const r = db.prepare('SELECT id, name, category, avg_rating, avg_price, address, tags_json FROM restaurants WHERE id = ?').get(post.restaurant_id);
      if (r) {
        restaurant = {
          id: r.id,
          name: r.name,
          category: r.category,
          rating: r.avg_rating,
          avgPrice: r.avg_price,
          address: r.address,
          tags: JSON.parse(r.tags_json || '[]'),
        };
      }
    }

    // 获取评论
    const comments = db.prepare(`
      SELECT pc.id, pc.author_name, pc.author_school, pc.content, pc.created_at
      FROM post_comments pc
      WHERE pc.post_id = ?
      ORDER BY pc.created_at ASC
    `).all(post.id);

    return {
      id: post.id,
      title: post.title,
      summary: post.summary,
      content: post.content,
      cover: post.cover,
      images: JSON.parse(post.images_json || '[]'),
      category: post.category,
      rating: post.rating,
      validationScore: post.validation_score,
      likeCount: post.like_count,
      commentCount: post.comment_count,
      sceneTags: JSON.parse(post.scene_tags_json || '[]'),
      tags: JSON.parse(post.tags_json || '[]'),
      author: post.author,
      school: post.school,
      avatarUrl: post.avatar_url,
      timeAgo: formatTimeAgo(post.created_at),
      restaurantBinding: post.restaurant_id ? { index: 0, category: restaurant?.category } : null,
      restaurant,
      isDemo: !!post.is_demo,
      createdAt: post.created_at,
      comments: comments.map(c => ({
        id: c.id,
        authorName: c.author_name,
        authorSchool: c.author_school,
        content: c.content,
        createdAt: c.created_at,
      })),
    };
  });

  // 总数
  let countSql = 'SELECT COUNT(*) as total FROM community_posts cp WHERE 1=1';
  const countParams = [];
  if (category) {
    countSql += ' AND cp.category = ?';
    countParams.push(category);
  }
  const { total } = db.prepare(countSql).get(...countParams);

  res.json({ posts: result, total });
});

// GET /api/community/posts/:id — 帖子详情 + 评论
router.get('/posts/:id', (req, res) => {
  const { id } = req.params;
  const db = req.db;

  const post = db.prepare(`
    SELECT
      cp.id, cp.title, cp.summary, cp.content, cp.cover, cp.images_json,
      cp.category, cp.rating, cp.validation_score, cp.like_count, cp.comment_count,
      cp.scene_tags_json, cp.tags_json, cp.restaurant_id, cp.is_demo,
      cp.created_at,
      u.nickname AS author, u.school, u.avatar_url
    FROM community_posts cp
    JOIN users u ON cp.user_id = u.id
    WHERE cp.id = ?
  `).get(id);

  if (!post) {
    return res.status(404).json({ error: '帖子不存在' });
  }

  // 获取评论
  const comments = db.prepare(`
    SELECT pc.id, pc.author_name, pc.author_school, pc.content, pc.created_at
    FROM post_comments pc
    WHERE pc.post_id = ?
    ORDER BY pc.created_at ASC
  `).all(id);

  // 获取关联商家
  let restaurant = null;
  if (post.restaurant_id) {
    const r = db.prepare('SELECT id, name, category, avg_rating, avg_price, address, tags_json FROM restaurants WHERE id = ?').get(post.restaurant_id);
    if (r) {
      restaurant = {
        id: r.id,
        name: r.name,
        category: r.category,
        rating: r.avg_rating,
        avgPrice: r.avg_price,
        address: r.address,
        tags: JSON.parse(r.tags_json || '[]'),
      };
    }
  }

  res.json({
    id: post.id,
    title: post.title,
    summary: post.summary,
    content: post.content,
    cover: post.cover,
    images: JSON.parse(post.images_json || '[]'),
    category: post.category,
    rating: post.rating,
    validationScore: post.validation_score,
    likeCount: post.like_count,
    commentCount: post.comment_count,
    sceneTags: JSON.parse(post.scene_tags_json || '[]'),
    tags: JSON.parse(post.tags_json || '[]'),
    author: post.author,
    school: post.school,
    avatarUrl: post.avatar_url,
    timeAgo: formatTimeAgo(post.created_at),
    restaurantBinding: post.restaurant_id ? { index: 0, category: restaurant?.category } : null,
    restaurant,
    isDemo: !!post.is_demo,
    createdAt: post.created_at,
    comments: comments.map(c => ({
      id: c.id,
      authorName: c.author_name,
      authorSchool: c.author_school,
      content: c.content,
      createdAt: c.created_at,
    })),
  });
});

// 时间格式化
function formatTimeAgo(dateStr) {
  if (!dateStr) return '';
  const now = new Date();
  const d = new Date(dateStr + 'Z');
  const diffMs = now - d;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return '刚刚';
  if (diffMin < 60) return `${diffMin}分钟前`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}小时前`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 30) return `${diffDay}天前`;
  const diffMonth = Math.floor(diffDay / 30);
  if (diffMonth < 12) return `${diffMonth}个月前`;
  return `${Math.floor(diffMonth / 12)}年前`;
}

export { router as communityRouter };