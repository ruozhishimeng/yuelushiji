-- 岳麓食纪 SQLite Schema v0.1
-- 真实轻量后端

-- 商家表
CREATE TABLE IF NOT EXISTS restaurants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  lat REAL NOT NULL,
  lng REAL NOT NULL,
  address TEXT DEFAULT '',
  category TEXT DEFAULT '',
  poi_id TEXT,
  poi_source TEXT DEFAULT 'amap',
  status TEXT DEFAULT 'imported' CHECK (status IN ('imported', 'verified', 'merged', 'conflict', 'closed')),
  avg_rating REAL,
  avg_price REAL,
  photos_json TEXT DEFAULT '[]',
  tel TEXT DEFAULT '',
  tags_json TEXT DEFAULT '[]',
  review_count INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  nickname TEXT NOT NULL,
  avatar_url TEXT DEFAULT '',
  school TEXT DEFAULT '',
  verification_status TEXT DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'email_pending', 'manual_pending', 'verified', 'failed', 'revoked', 'expired')),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- 评价表
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  restaurant_id TEXT NOT NULL REFERENCES restaurants(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  status TEXT DEFAULT 'visible' CHECK (status IN ('draft', 'pending', 'visible', 'limited', 'rejected', 'deleted')),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- 收藏表
CREATE TABLE IF NOT EXISTS favorites (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  restaurant_id TEXT NOT NULL REFERENCES restaurants(id),
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(user_id, restaurant_id)
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_reviews_restaurant ON reviews(restaurant_id, status);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_restaurant ON favorites(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_restaurants_poi ON restaurants(poi_id);
CREATE INDEX IF NOT EXISTS idx_restaurants_location ON restaurants(lat, lng);
CREATE INDEX IF NOT EXISTS idx_restaurants_status ON restaurants(status);

-- 社区帖子表
CREATE TABLE IF NOT EXISTS community_posts (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  title TEXT NOT NULL,
  summary TEXT DEFAULT '',
  content TEXT DEFAULT '',
  cover TEXT DEFAULT '',
  images_json TEXT DEFAULT '[]',
  category TEXT DEFAULT '',
  rating REAL,
  validation_score INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  scene_tags_json TEXT DEFAULT '[]',
  tags_json TEXT DEFAULT '[]',
  restaurant_id TEXT REFERENCES restaurants(id),
  is_demo INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- 帖子评论表
CREATE TABLE IF NOT EXISTS post_comments (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL REFERENCES community_posts(id),
  user_id TEXT REFERENCES users(id),
  author_name TEXT NOT NULL,
  author_school TEXT DEFAULT '',
  content TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

-- 帖子索引
CREATE INDEX IF NOT EXISTS idx_posts_category ON community_posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_created ON community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_post ON post_comments(post_id);