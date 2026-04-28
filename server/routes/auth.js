import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
const DEMO_USER_ID = 'demo-user-0001';
const DEMO_NICKNAME = 'tcm';
const DEMO_SCHOOL = '湖南大学';

const serializeUser = (user) => ({
  id: user.id,
  nickname: user.nickname,
  school: user.school,
  avatarUrl: user.avatar_url,
  verificationStatus: user.verification_status,
});

const signUserToken = (user, secret) => jwt.sign(
  { userId: user.id, nickname: user.nickname },
  secret,
  { expiresIn: '30d' }
);

const ensureDemoUser = (db) => {
  const existing = db.prepare('SELECT * FROM users WHERE id = ?').get(DEMO_USER_ID);

  if (existing) {
    db.prepare(
      'UPDATE users SET nickname = ?, school = ?, verification_status = ?, updated_at = datetime(\'now\') WHERE id = ?'
    ).run(DEMO_NICKNAME, DEMO_SCHOOL, 'verified', DEMO_USER_ID);
    return db.prepare('SELECT * FROM users WHERE id = ?').get(DEMO_USER_ID);
  }

  db.prepare(
    'INSERT INTO users (id, nickname, school, verification_status) VALUES (?, ?, ?, ?)'
  ).run(DEMO_USER_ID, DEMO_NICKNAME, DEMO_SCHOOL, 'verified');

  return db.prepare('SELECT * FROM users WHERE id = ?').get(DEMO_USER_ID);
};

router.post('/register', (req, res) => {
  const nickname = req.body.nickname?.trim();
  const school = req.body.school?.trim() || '';

  if (!nickname) {
    return res.status(400).json({ error: '昵称不能为空' });
  }

  if (nickname.length > 20) {
    return res.status(400).json({ error: '昵称最长 20 个字符' });
  }

  const db = req.db;

  if (nickname.toLowerCase() === DEMO_NICKNAME) {
    const user = ensureDemoUser(db);
    return res.json({
      user: serializeUser(user),
      token: signUserToken(user, req.jwtSecret),
      demo: true,
    });
  }

  const userId = uuidv4();

  try {
    db.prepare(
      'INSERT INTO users (id, nickname, school, verification_status) VALUES (?, ?, ?, ?)' 
    ).run(userId, nickname, school, 'unverified');

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    res.status(201).json({
      user: serializeUser(user),
      token: signUserToken(user, req.jwtSecret),
    });
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(409).json({ error: '用户已存在' });
    }
    console.error('[auth/register]', err);
    res.status(500).json({ error: '注册失败' });
  }
});

router.post('/login', (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: '用户 ID 不能为空' });
  }

  const db = req.db;
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);

  if (!user) {
    return res.status(404).json({ error: '用户不存在' });
  }

  res.json({
    user: serializeUser(user),
    token: signUserToken(user, req.jwtSecret),
  });
});

router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: '认证令牌缺失' });
  }

  const token = authHeader.slice(7);
  let decoded;
  try {
    decoded = jwt.verify(token, req.jwtSecret);
  } catch {
    return res.status(401).json({ error: '认证令牌无效' });
  }

  const db = req.db;
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(decoded.userId);

  if (!user) {
    return res.status(404).json({ error: '用户不存在' });
  }

  const stats = db.prepare(
    'SELECT ' +
    '(SELECT COUNT(*) FROM favorites WHERE user_id = ?) as favoriteCount, ' +
    '(SELECT COUNT(*) FROM reviews WHERE user_id = ? AND status = \'visible\') as reviewCount, ' +
    '(SELECT COUNT(*) FROM reviews WHERE user_id = ? AND status = \'visible\') as checkinCount ' +
    'FROM users WHERE id = ?'
  ).get(user.id, user.id, user.id, user.id);

  res.json({
    ...serializeUser(user),
    stats: {
      favoriteCount: stats?.favoriteCount || 0,
      reviewCount: stats?.reviewCount || 0,
      checkinCount: stats?.checkinCount || 0,
    },
  });
});

export { router as authRouter };
