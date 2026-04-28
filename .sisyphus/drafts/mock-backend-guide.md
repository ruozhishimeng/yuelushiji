# 岳麓食纪 — 简易后端配置指南（小白版）

> 本文档面向第一次搭后端的同学，手把手教你把项目里的演示数据变成真正的 API 接口。

## 📌 这份文档是什么？

你的项目现在有两类数据来源：
- **真实数据**：地图/餐厅来自高德 API（已经在工作）
- **演示数据**：个人信息、收藏、评价等写在 `src/mocks/demoData.js` 里（刷新就没了）

我们要做的就是把演示数据搬到 JSON Server —— 一个零代码的简易后端，5 分钟就能跑起来。

## 🏗️ 整体结构变化

```
之前：
  demoData.js ──→ 直接 import ──→ 页面渲染

之后：
  db.json ──→ JSON Server (:3001) ──→ Vite 代理 (/api) ──→ 前端 hooks ──→ 页面渲染
```

## 📦 你需要安装什么

```bash
# JSON Server — 零代码 REST API 服务器
npm install --save-dev json-server

# concurrently — 同时运行前端和后端
npm install --save-dev concurrently
```

## 📁 新增文件清单

| 文件 | 作用 |
|------|------|
| `db.json` | JSON Server 的数据库（从 demoData.js 迁移） |
| `json-server-routes.json` | 自定义路由（处理非标准数据结构） |
| `src/lib/api/demoApi.js` | 调用演示数据的 API 函数 |
| `src/lib/api/iconMap.js` | 图标字符串→React组件的映射 |
| `src/hooks/useDemoData.js` | React hooks 封装（处理加载状态和错误回退） |

## 🔧 修改文件清单

| 文件 | 改什么 |
|------|--------|
| `vite.config.js` | 添加 `/api` → `localhost:3001` 的代理 |
| `package.json` | 添加 `dev:api` 和 `dev:all` 脚本 |
| `src/pages/HomePage.jsx` | 从 import 改为 API 调用 |
| `src/pages/ProfilePage.jsx` | 从 import 改为 API 调用 + 保留回退逻辑 |
| `src/components/RankingPanel.jsx` | 从 import 改为 API 调用 |
| `src/components/MatchingSystem.jsx` | 从 import 改为 API 调用 + 加 loading |

## 🚀 跑起来只需要 3 步

### 第 1 步：启动 JSON Server

```bash
npx json-server db.json --port 3001
```

你会看到：
```
  Loading db.json
  Done

  Resources
  http://localhost:3001/demoUser
  http://localhost:3001/demoFavorites
  http://localhost:3001/demoRecentVisits
  ...（所有数据端点）
```

### 第 2 步：启动前端（已有代理配置）

```bash
npm run dev
```

或者一步启动两个：
```bash
npm run dev:all
```

### 第 3 步：验证数据通过 API 可用

在浏览器打开：
```
http://localhost:8080/api/demoUser
```

你应该看到 JSON 数据和直接访问 `http://localhost:3001/demoUser` 一样。

## ⚠️ 小白必读：注意事项

### 1. 图标不能直接放进 JSON

`demoBadges` 里的 `icon: Utensils` 是 React 组件，不能写成 JSON。

**解决办法**：在 `db.json` 里存字符串 `"utensils"`，在组件里用映射表转回 `<Utensils />`。

```js
// db.json 中
{ "name": "探店小王子", "icon": "utensils" }

// 组件中
import { getIcon } from '../lib/api/iconMap';
const IconComponent = getIcon(badge.icon);  // "utensils" → Utensils
```

### 2. JSON Server 顶部必须是数组

`demoRankingSubTags` 原来是对象 `{ '江湖美食': [...], '佳饮甜点': [...] }`，JSON Server 不支持。

**解决办法**：存成数组，组件里转换回对象。

```json
// db.json 中
"rankingSubTags": [
  { "id": "江湖美食", "tags": ["湘菜", "川菜", ...] },
  { "id": "佳饮甜点", "tags": ["奶茶", "果茶", ...] }
]
```

### 3. 有些数据不需要走 API

`DEMO_HEAT_DATA` 和 `DEMO_VOICE_BAR_HEIGHTS` 就是几个数字，是 UI 配置不是业务数据，保留为静态 import 就好。

### 4. API 挂了怎么办？

所有 hooks 都有回退逻辑：API 请求失败 → 自动使用 demoData.js 静态数据。所以即使 JSON Server 没启动，页面也不会白屏。

### 5. Vite 端口是 8080

项目配置的 Vite 端口是 8080（不是默认的 5173），代理配置要对应。

## 📊 数据对照表

| demoData.js 变量 | JSON Server 端点 | 使用者 | 备注 |
|-------------------|-------------------|--------|------|
| `demoUser` | `/api/demoUser` | ProfilePage | |
| `demoUserStats` | `/api/demoUserStats` | ProfilePage | |
| `demoUserActivity` | `/api/demoUserActivity` | ProfilePage | |
| `demoFavorites` | `/api/demoFavorites` | ProfilePage | |
| `demoRecentVisits` | `/api/demoRecentVisits` | ProfilePage | |
| `demoBadges` | `/api/demoBadges` | ProfilePage | icon 为字符串ID |
| `demoMatchingHistory` | `/api/demoMatchingHistory` | ProfilePage | |
| `demoHomeCircles` | `/api/demoHomeCircles` | HomePage | |
| `demoHomePosts` | `/api/demoHomePosts` | HomePage | |
| `demoDishes` | `/api/demoDishes` | RankingPanel | |
| `demoLocations` | `/api/demoLocations` | RankingPanel | |
| `demoRankingSubTags` | `/api/rankingSubTags` | RankingPanel | 自定义路由 |
| `demoMatchedUsers` | `/api/demoMatchedUsers` | MatchingSystem | |
| `demoCommunityReviews` | `/api/demoCommunityReviews` | 预留 | |
| `DEMO_HEAT_DATA` | — | AIAssistant | ❌ 保留静态 import |
| `DEMO_VOICE_BAR_HEIGHTS` | — | AIAssistant | ❌ 保留静态 import |

## 🔗 相关文档

- 完整执行计划：`.sisyphus/plans/mock-backend.md`
- PRD 后端接口设计：`PRD.md` 第 19 章
- API 骨架代码：`src/lib/api/client.js`
- 项目架构：`ARCHITECTURE.md` 第 7 节