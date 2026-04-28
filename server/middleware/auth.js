import jwt from 'jsonwebtoken';

/**
 * JWT 认证中间件 — 强制要求登录
 * 请求头必须携带 Authorization: Bearer <token>
 */
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: '认证令牌缺失', code: 'TOKEN_MISSING' });
  }

  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, req.jwtSecret);
    req.userId = decoded.userId;
    req.nickname = decoded.nickname;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: '认证令牌已过期', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ error: '认证令牌无效', code: 'TOKEN_INVALID' });
  }
}

/**
 * 可选认证 — 有 token 则解析，无 token 也放行
 * 用于列表接口：未登录也能看，登录后返回个性化字段（如 isFavorited）
 */
export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    try {
      const decoded = jwt.verify(token, req.jwtSecret);
      req.userId = decoded.userId;
      req.nickname = decoded.nickname;
    } catch {
      // 无效 token 时忽略，不设置 userId
    }
  }
  next();
}