# 岳麓食纪 — 真实轻量后端方案 (real-lite-backend)

## TL;DR

> **核心目标**：搭建一个真正的本地后端（Express + SQLite），让前端所有功能跑真实数据闭环，彻底移除对 `demoData.js` 的依赖。
>
> **最小可展示闭环**：浏览真实商家 → 收藏 → 写评价 → 评价立即显示
>
> **技术选型**：Express + better-sqlite3 + JWT
>
> **交付物**：
> - `server/` 目录：独立后端项目
> - 4 张 SQLite 表：restaurants, users, reviews, favorites
> - 6 个核心 API 端点 + 3 个认证端点
> - Vite 代理配置
> - 前端 5 个消费组件从 mock 迁移到 API
> - 真实空态 UI（"暂无评价，去发布第一条"）
>
> **关键路径**：Task 1-3 → Task 4-5 → Task 6-8 → Task 9-13 → F1-F2

---

## Context

### 为什么放弃 JSON Server

JSON Server 只是远程化的 mock 存储。它：
- 只读，无法支持收藏、评价、打卡等写操作
- 数据仍为虚构，前端仍显示"演示功能"
- 新增 demoApi 形成第二套数据层，让前端更乱
- 回退到 demoData.js 会让 mock 内容更隐蔽

### 用户决策

| 决策点 | 选择 | 理由 |
|--------|------|------|
| 后端框架 | **Express** | 生态最大、教程多、用户更熟悉 |
| 认证策略 | **简单注册/登录** | 输入昵称+学校就注册，发 JWT |
| 评价审核 | **自动通过** | status 直接设为 visible，等后面再加审核 |
| 商家数据来源 | **前端交互触发导入** | 用户收藏/评价时自动把 POI 数据 POST 到后端 |

---

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│  Frontend (Vite :8080)                                  │
│                                                          │
│  src/lib/api/                   src/hooks/              │
│  ├── client.js  ─────────┐     ├── useAmapRestaurants   │
│  ├── restaurantApi.js    │     │   (地图+真实POI)       │
│  ├── reviewApi.js         │     ├── useAuth (新)         │
│  ├── authApi.js           │     └── useFavorites (新)    │
│  ├── checkinApi.js        │                              │
│  ├── userApi.js (新)      │                              │
│  └── favoriteApi.js (新)  │                              │
│                           │                              │
│  Vite proxy /api/* ───────┤                              │
│       → localhost:3000    │                              │
└───────────────────────────┼──────────────────────────────┘
                            │
┌───────────────────────────┼──────────────────────────────┐
│  Backend (Express :3000) │                              │
│                           │                              │
│  server/                  │                              │
│  ├── index.js             │  Express 主入口              │
│  ├── db/                  │                              │
│  │   ├── schema.sql       │  建表语句                    │
│  │   ├── seed.js          │  初始数据                    │
│  │   └── yuelu.sqlite     │  SQLite 数据库文件           │
│  ├── routes/              │                              │
│  │   ├── auth.js          │  认证路由                    │
│  │   ├── restaurants.js    │  商家路由                    │
│  │   ├── reviews.js        │  评价路由                    │
│  │   └── favorites.js      │  收藏路由                    │
│  ├── middleware/           │                              │
│  │   └── auth.js           │  JWT 验证中间件              │
│  ├── package.json          │                              │
│  └── .env.example          │  环境变量模板                │
│                                                          │
│  data/yuelu.sqlite        │  数据库文件（.gitignore）     │
└──────────────────────────────────────────────────────────┘
```

### 数据流

```
用户浏览地图
  → 前端调高德 JS API 获取 POI 列表
  → 用户点击收藏或写评价
  → 前端将 POI 数据 POST 到后端 /api/restaurants/import
  → 后端 upsert 到 restaurants 表 + restaurant_poi_bindings 表
  → 前端调 /api/users/me/favorites/:restaurantId 收藏
  → 前端调 /api/restaurants/:id/reviews 写评价
  → 评价立即显示（status: visible）
```

---

## Database Schema (Phase 1)

### 4 张核心表

```sql
-- 商家表
CREATE TABLE restaurants (
  id TEXT PRIMARY KEY,           -- UUID
  name TEXT NOT NULL,
  lat REAL NOT NULL,
  lng REAL NOT NULL,
  address TEXT,
  category TEXT,
  poi_id TEXT,                    -- 高德 POI ID
  poi_source TEXT DEFAULT 'amap',
  status TEXT DEFAULT 'imported', -- imported | verified
  avg_rating REAL,                -- 聚合评分（nullable until reviews exist）
  avg_price REAL,                 -- 聚合人均（nullable until reviews exist）
  photos_json TEXT,               -- JSON array of photo URLs
  tel TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- 用户表
CREATE TABLE users (
  id TEXT PRIMARY KEY,            -- UUID
  nickname TEXT NOT NULL,
  avatar_url TEXT,
  school TEXT,
  verification_status TEXT DEFAULT 'unverified',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- 评价表
CREATE TABLE reviews (
  id TEXT PRIMARY KEY,            -- UUID
  restaurant_id TEXT NOT NULL REFERENCES restaurants(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  status TEXT DEFAULT 'visible',  -- Phase 1: auto-approve
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- 收藏表
CREATE TABLE favorites (
  id TEXT PRIMARY KEY,            -- UUID
  user_id TEXT NOT NULL REFERENCES users(id),
  restaurant_id TEXT NOT NULL REFERENCES restaurants(id),
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(user_id, restaurant_id)
);

-- 索引
CREATE INDEX idx_reviews_restaurant ON reviews(restaurant_id, status);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_restaurants_poi ON restaurants(poi_id);
CREATE INDEX idx_restaurants_location ON restaurants(lat, lng);
```

---

## API Endpoints (Phase 1)

### 认证 (3 endpoints)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | 无 | 注册（nickname, school）返回 JWT |
| POST | `/api/auth/login` | 无 | 登录（userId）返回 JWT |
| GET | `/api/auth/me` | JWT | 获取当前用户信息 |

### 商家 (3 endpoints)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/restaurants` | 无 | 列表（支持 lat/lng/radius 查询） |
| GET | `/api/restaurants/:id` | 无 | 详情（含聚合评分、评价数） |
| POST | `/api/restaurants/import` | JWT | 从前端 POI 数据 upsert 商家 |

### 评价 (2 endpoints)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/restaurants/:id/reviews` | 无 | 获取商家评价列表 |
| POST | `/api/restaurants/:id/reviews` | JWT | 创建评价（status 直接 visible） |

### 收藏 (2 endpoints)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/users/me/favorites/:restaurantId` | JWT | 收藏商家 |
| DELETE | `/api/users/me/favorites/:restaurantId` | JWT | 取消收藏 |

**合计：Phase 1 实现 10 个端点**

### 已有前端 API 层映射

| 现有前端文件 | 端点 | Phase 1 状态 |
|-------------|------|-------------|
| `authApi.js` | `/student-verifications/*` | 保留端点，返回 `{ status: 'unverified', message: '邮箱认证尚未实现' }` |
| `checkinApi.js` | `/checkins` | 保留端点，返回 `{ message: '打卡功能尚未实现' }` |
| `reviewApi.js` | `/restaurants/:id/reviews` | ✅ 实现 |
| `reviewApi.js` | `DELETE /reviews/:id` | 保留端点，Phase 2 |
| `restaurantApi.js` | `/restaurants` | ✅ 实现 |
| `restaurantApi.js` | `/restaurants/:id` | ✅ 实现 |

### 新增前端 API 层

| 新增文件 | 端点 | 说明 |
|---------|------|------|
| `src/lib/api/userApi.js` | `/auth/register`, `/auth/login`, `/auth/me` | 认证 API |
| `src/lib/api/favoriteApi.js` | `/users/me/favorites/:id` | 收藏 API |
| `src/hooks/useAuth.js` | — | 认证状态 hook（JWT 管理） |
| `src/hooks/useFavorites.js` | — | 收藏状态 hook（替代 uiStateRef） |

---

## Frontend Migration Plan

### 哪些数据走 API，哪些保留

| 数据 | 来源 | Phase 1 | 说明 |
|------|------|---------|------|
| 商家列表/详情 | 高德 POI + 后端聚合 | 前端 POI 发现 + 后端持久化 | 混合模式 |
| 用户信息 | 后端 | API | 注册/登录 JWT |
| 收藏 | 后端 | API | 替代 uiStateRef 内存状态 |
| 评价 | 后端 | API | 真实写入 + 读取 |
| 商家评分 | 后端聚合 | API | 从 reviews 聚合计算 |
| 用户统计 | 后端聚合 | API | 从 reviews/favorites 计算 |
| 🚫 个人勋章 | 计算得出 | 本地函数 | 从统计数据实时计算 |
| 🚫 搭配用户 | 暂无 | 空态提示 | "功能开发中" |
| 🚫 社区帖子 | 暂无 | 空态提示 | "功能开发中" |
| 🚫 榜单数据 | 后端聚合 | 本地计算 | 从 restaurants + reviews 聚合 |
| 🚫 热力数据/语音条 | UI常量 | 保留静态 | 不是业务数据 |

### 空态设计原则

删除 mock 数据后，没有数据时显示真实空态：

| 场景 | 空态文案 |
|------|---------|
| 餐厅无评价 | "暂无评价，去发布第一条 🎯" |
| 无收藏 | "还没有收藏，去地图上发现好店吧" |
| 无足迹 | "还没有打卡记录，去附近探店吧" |
| 榜单无数据 | "该分类暂无排行数据" |
| 搭配页面 | "饭搭子功能开发中，敬请期待" |
| 社区帖子 | "社区功能开发中，敬请期待" |

---

## Must NOT Have (Guardrails)

- ❌ 不实现打卡地理围栏（Phase 2）
- ❌ 不实现评价审核队列（Phase 1 自动通过）
- ❌ 不实现信任等级 L0-L3（Phase 2）
- ❌ 不实现商家合并/冲突处理（Phase 2）
- ❌ 不实现邮件发送（Phase 1 无邮箱验证）
- ❌ 不实现图片上传（Phase 2）
- ❌ 不实现管理后台（Phase 2）
- ❌ 不实现饭后搭子匹配（PRD v0.4）
- ❌ 不实现 AI 助手（PRD v0.3+）
- ❌ 不引入 TanStack Query（本次不做，用 useState + useEffect）
- ❌ 不修改前端 Restaurant 模型形状（后端返回子集，前端合并计算字段）

---

## Execution Plan

### Wave 1: Backend 基础设施（无依赖，可并行）

- [ ] 1. 初始化 server/ 项目结构
- [ ] 2. 创建 SQLite schema 和 seed 脚本
- [ ] 3. 配置 Vite 代理 + 启动脚本

### Wave 2: 核心 API 实现（依赖 Wave 1）

- [ ] 4. 实现 JWT 认证中间件和路由
- [ ] 5. 实现商家和评价路由

### Wave 3: 前端 API 层（依赖 Wave 2）

- [ ] 6. 创建 userApi.js + favoriteApi.js
- [ ] 7. 创建 useAuth + useFavorites hooks

### Wave 4: 前端组件迁移（依赖 Wave 3）

- [ ] 8. Index.jsx: 收藏从 uiStateRef 迁移到 API
- [ ] 9. ProfilePage.jsx: 从 mock 迁移到 API + 空态
- [ ] 10. HomePage.jsx: 从 mock 迁移到空态
- [ ] 11. RankingPanel.jsx: 从 mock 迁移到真实聚合
- [ ] 12. MatchingSystem.jsx: 替换为"开发中"空态
- [ ] 13. AIAssistant.jsx: DEMO_VOICE_BAR_HEIGHTS 保留，数据部分替换

### Wave Final: 验证与清理

- [ ] F1. 构建与 lint 验证
- [ ] F2. 端到端 curl 验证
- [ ] F3. 清理 demoData.js（仅保留 UI 常量）

---

## Verification Strategy

### 验证命令

```bash
# 1. 启动后端
cd server && npm run dev

# 2. 注册测试用户
curl -s -X POST http://localhost:3000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"nickname":"测试同学","school":"湖南大学"}' | jq '.'

# 3. 获取 token
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"userId":"<从注册返回的id>"}' | jq -r '.token')

# 4. 导入商家
curl -s -X POST http://localhost:3000/api/restaurants/import \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"测试餐厅","lat":28.185,"lng":112.938,"address":"麓山南路1号","category":"湘菜","poiId":"B123456789"}' | jq '.'

# 5. 创建评价
curl -s -X POST http://localhost:3000/api/restaurants/<restaurant_id>/reviews \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"rating":4,"comment":"味道不错，出餐快"}' | jq '.review.status'
# 期望输出: "visible"

# 6. 查看评价
curl -s http://localhost:3000/api/restaurants/<restaurant_id>/reviews | jq '.reviews[0].comment'
# 期望输出: "味道不错，出餐快"

# 7. 收藏商家
curl -s -X POST http://localhost:3000/api/users/me/favorites/<restaurant_id> \
  -H "Authorization: Bearer $TOKEN" | jq '.favorited'
# 期望输出: true

# 8. 取消收藏
curl -s -X DELETE http://localhost:3000/api/users/me/favorites/<restaurant_id> \
  -H "Authorization: Bearer $TOKEN" | jq '.favorited'
# 期望输出: false

# 9. 构建验证
cd .. && npm run build && npm run lint
```

### 边缘情况验证

```bash
# 不存在的商家 → 创建评价应返回 404
curl -s -X POST http://localhost:3000/api/restaurants/nonexistent/reviews \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"rating":5,"comment":"测试"}' | jq '.error'
# 期望输出: 包含 "not found"

# 未认证访问 → 收藏应返回 401
curl -s -X POST http://localhost:3000/api/users/me/favorites/some-id | jq '.error'
# 期望输出: 包含 "unauthorized" 或 "token required"

# 重复收藏 → 应返回 200（幂等）
curl -s -X POST http://localhost:3000/api/users/me/favorites/<restaurant_id> \
  -H "Authorization: Bearer $TOKEN" | jq '.favorited'
# 期望输出: true（不报错）
```

---

## Commit Strategy

- **Wave 1**: `feat(server): initialize Express + SQLite backend` — server/ 目录结构、schema、proxy 配置
- **Wave 2**: `feat(server): implement auth + restaurant + review + favorite routes` — 核心路由
- **Wave 3**: `feat(client): add auth and favorite API layer` — 前端 API 层
- **Wave 4**: `refactor(client): migrate from mock data to real API calls` — 组件迁移
- **Final**: `chore: verify backend integration and clean up mock data` — 验证清理

---

## Success Criteria

- [ ] `cd server && npm run dev` 启动后端，所有端点返回正确数据
- [ ] `npm run dev` 前端代理到后端，所有组件正常渲染
- [ ] 注册 → 登录 → 导入商家 → 写评价 → 查看评价 → 收藏 → 取消收藏 全链路可走通
- [ ] 没有数据时显示真实空态，不再显示"演示功能"
- [ ] `npm run build` 零错误
- [ ] `npm run lint` 零错误
- [ ] demoData.js 仅保留 UI 常量（DEMO_HEAT_DATA, DEMO_VOICE_BAR_HEIGHTS）