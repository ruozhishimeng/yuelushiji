import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
import { authRouter } from './routes/auth.js';
import { restaurantsRouter } from './routes/restaurants.js';
import { reviewsRouter } from './routes/reviews.js';
import { favoritesRouter } from './routes/favorites.js';
import { communityRouter } from './routes/community.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 环境变量
const PORT = process.env.PORT || 3000;
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'yuelu.sqlite');
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

// 确保数据目录存在
import fs from 'fs';
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 初始化数据库
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// 执行 schema
const schemaPath = path.join(__dirname, 'db', 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf-8');
db.exec(schema);

// Express 应用
const app = express();

// 中间件
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// 挂载请求级别的中间件
app.use((req, res, next) => {
  req.db = db;
  req.jwtSecret = JWT_SECRET;
  next();
});

// 路由
app.use('/api/auth', authRouter);
app.use('/api/restaurants', restaurantsRouter);
app.use('/api/restaurants', reviewsRouter);  // /:restaurantId/reviews 挂在 restaurants 下
app.use('/api/users/me/favorites', favoritesRouter);
app.use('/api/community', communityRouter);

// 学证认证端点保留（Phase 1 返回未实现提示）
app.use('/api/student-verifications', (req, res) => {
  res.status(501).json({ status: 'unimplemented', message: '学生认证功能尚未实现' });
});

// 打卡端点保留（Phase 1 返回未实现提示）
app.use('/api/checkins', (req, res) => {
  res.status(501).json({ status: 'unimplemented', message: '打卡功能尚未实现' });
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON' });
  }
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ error: message });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🏔️ 岳麓食纪后端运行在 http://localhost:${PORT}`);
  console.log(`📁 数据库: ${DB_PATH}`);
});

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n正在关闭...');
  db.close();
  process.exit(0);
});

export { db, JWT_SECRET };