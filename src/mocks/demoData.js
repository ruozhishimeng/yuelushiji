// ⚠️ 此文件已废弃 — 所有组件已迁移到真实后端 API
// 仅保留本文件作为历史参考，不再被任何组件引用
//
// 迁移日期：2026-04-27
// 迁移详情：.sisyphus/plans/real-lite-backend.md
//
// UI 常量已迁移到各组件内部：
// - VOICE_BAR_HEIGHTS → AIAssistant.jsx (本地常量)
// - LOCATIONS → RankingPanel.jsx (本地常量)
// - RANKING_SUB_TAGS → RankingPanel.jsx (本地常量)
// - STATIC_CIRCLES → HomePage.jsx (本地常量)
//
// 业务数据已迁移到后端 API：
// - 用户信息 → GET /api/auth/me
// - 收藏列表 → GET /api/users/me/favorites
// - 评价 → GET/POST /api/restaurants/:id/reviews
// - 商家 → GET /api/restaurants
// - 认证 → POST /api/auth/register, POST /api/auth/login