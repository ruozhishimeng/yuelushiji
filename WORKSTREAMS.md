# 并行工作流看板

文档状态：协作看板  
最后更新：2026-04-25

## 1. 使用方式

任何新线程或 Agent 开始前，先在这里登记或认领一个工作流。一个工作流应尽量对应一条清晰边界，避免多个 Agent 同时大范围修改同一批文件。

状态约定：

- Backlog：待拆解。
- Ready：可以开工。
- In progress：有人正在做。
- Review：已完成，需要验证或接力检查。
- Blocked：被环境、接口、产品问题阻塞。
- Done：已完成并验证。

## 2. 当前工作流

| ID | 工作流 | 状态 | Owner | 主要文件 | 下一步 |
| --- | --- | --- | --- | --- | --- |
| WS-00 | 协作文档基座 | Done | 当前前端线程 | `AGENTS.md`, `PROJECT.md`, `ARCHITECTURE.md`, `WORKSTREAMS.md`, `ROADMAP.md`, `RUNBOOK.md`, `DECISIONS.md` | 后续重要改动继续更新文档 |
| WS-01 | 真实高德商家地图主链路 | Review | 当前前端线程 | `src/lib/amap/*`, `src/hooks/useAmapRestaurants.js`, `src/pages/Index.jsx` | 在真实浏览器环境确认地图样式、POI、marker、搜索刷新 |
| WS-02 | 餐厅列表与详情一致性 | Review | 当前前端线程 | `MapSidebar.jsx`, `RestaurantCard.jsx`, `RestaurantDetail.jsx`, `ImageCarousel.jsx` | 手动验证选中、返回、收藏、点赞状态一致 |
| WS-03 | 真实评价 MVP | Backlog | 未认领 | `ReviewModal.jsx`, `EvaluationModal.jsx`, 未来 API 层 | 设计评价数据模型、发布流程、空态和可信标记 |
| WS-04 | 学生认证 MVP | Backlog | 未认领 | `UserProfile.jsx`, `PersonalCenter.jsx`, 未来 auth/API 层 | 明确校园邮箱、邀请码或人工审核方案 |
| WS-05 | 饭搭子与 AI 演示隔离 | Review | 当前前端线程 | `AIAssistant.jsx`, `MatchingSystem.jsx`, `src/mocks/demoData.js` | 确认所有演示内容有明确标记 |
| WS-06 | 本地环境与开发体验 | Blocked | 当前前端线程 | `README.md`, `RUNBOOK.md`, `scripts/dev-launcher.mjs` | 解决当前环境 dev server `listen UNKNOWN` 问题 |
| WS-07 | 视觉与移动端主链路 QA | Review | 当前前端线程 | `src/pages/Index.jsx`, `src/pages/*`, `src/components/*`, `src/index.css`, `tailwind.config.js` | 浏览器确认宣纸色背景、桌面/移动视口遮挡和地图可见性 |
| WS-08 | PRD 产品方案细化 | Done | 产品经理智能体 + 子 Agent | `PRD.md`, `WORKSTREAMS.md` | 已完成严苛产品审查与 PRD 精修，后续按 v0.2 范围拆研发任务 |
| WS-09 | 四页化前端基座 | Review | 当前前端线程 | `src/pages/*`, `BottomActionBar.jsx`, `AIAssistant.jsx`, `useAmapRestaurants.js` | 浏览器验证四页切换、AI、地图按需初始化 |
| WS-10 | 前端优化方案审查 | Done | 当前前端线程 | `OPTIMIZATION.md` | 可按修订后的阶段 0 开始执行 |

## 3. 文件冲突区

这些文件是高冲突区域，同时改动前先看最新 diff：

- `src/pages/Index.jsx`
- `src/hooks/useAmapRestaurants.js`
- `src/components/MapSidebar.jsx`
- `src/components/RestaurantDetail.jsx`
- `src/components/RestaurantCard.jsx`
- `src/mocks/demoData.js`
- 根目录文档

## 4. 工作流登记模板

```md
| WS-XX | 工作流名称 | Ready | Agent 名称 | 文件范围 | 下一步 |
```

## 5. 交接日志

### 2026-04-22, 当前前端线程

- 状态：Done
- 已完成：创建多 Agent 协作所需的根目录文档骨架。
- 改动文件：`AGENTS.md`, `PROJECT.md`, `ARCHITECTURE.md`, `WORKSTREAMS.md`, `ROADMAP.md`, `RUNBOOK.md`, `DECISIONS.md`, `README.md`
- 验证：`git diff --check` 通过，仅有 CRLF 换行提示。
- 下一个 Agent 需要注意：当前项目已有较多未提交前端改造文件，不要回退这些改动。

### 2026-04-24, 产品经理智能体

- 状态：Done
- 已完成：将 `PRD.md` 调整为标准产品需求文档，补充端到端业务闭环、MVP 实施范围、服务接口设计、可信评分与推荐规则，并移除面试问答式内容。
- 改动文件：`PRD.md`, `WORKSTREAMS.md`
- 验证：`git diff --check` 通过，仅有仓库既有 LF/CRLF 换行提示。
- 未完成：真实评价 MVP 仍需拆分后端 API、认证流程、审核后台和埋点事件的详细研发任务。
- 下一个 Agent 需要注意：PRD 当前按真实产品文档口径组织，不应再写入面试问答、演示数据伪装或未验证运营结果。

### 2026-04-24, 产品经理智能体 + 子 Agent

- 状态：Done
- 已完成：使用一个严苛产品审查子 Agent 对 `PRD.md` 做 P0/P1/P2 缺口审查，再由第二个子 Agent 精修 PRD。当前 PRD 已将 v0.2 收敛为真实 POI、平台商家库、学生认证、到店打卡、评价审核展示和基础榜单闭环；补齐商家生命周期、POI 绑定、认证状态机、打卡规则、Review 状态、审核后台、权限矩阵、隐私清单、埋点事件、榜单口径和 Go/No-Go 发布门槛。
- 改动文件：`PRD.md`, `WORKSTREAMS.md`
- 验证：`git diff --check` 通过，仅有 `PRD.md`、`WORKSTREAMS.md` 的 LF/CRLF 换行提示。
- 未完成：可继续从 PRD 拆出 v0.2 研发任务清单、接口字段明细和审核后台页面原型。
- 下一个 Agent 需要注意：饭搭子、AI 助手、完整社区信息流已从 v0.2 必做闭环移出，只能作为后置能力或等待名单入口。

### 2026-04-25, 当前前端线程

- 状态：Done
- 已完成：移除详情页图片右上角重复收藏按钮；收藏入口统一改为 `Heart` 图标，评分继续使用 `Star`；收藏按钮点击态改为 `focus-visible`，避免鼠标点击后出现错误圆形边框；侧栏顶部替换为山水题字图并增加向白色内容区的渐变过渡。
- 改动文件：`src/components/MapSidebar.jsx`, `src/components/RestaurantCard.jsx`, `src/components/RestaurantDetail.jsx`, `public/assets/yuelu-sidebar-hero.png`, `WORKSTREAMS.md`
- 验证：`cmd.exe /c npm.cmd run build` 通过；`cmd.exe /c git diff --check` 通过，仅有仓库既有 LF/CRLF 换行提示。
- 未完成：仍建议在 375px、768px、1440px 视口下做一次浏览器视觉确认，重点看侧栏头图裁切和详情页首屏高度。
- 下一个 Agent 需要注意：本次未改变真实高德 POI 主链路，也未新增 mock 餐厅或虚构评价。

### 2026-04-25, 当前前端线程

- 状态：Done
- 已完成：左侧商家列表从纵向大卡片改为横向条目列表；列表评分新增评价条数显示，优先使用 POI 真实评价数字段，缺失时回落到真实学生评价数组长度；移除“高德商家”显式标识；列表滚动改为隐藏原生滚动条并在滚动时显示不占布局的悬浮滚动指示条。
- 改动文件：`src/components/RestaurantCard.jsx`, `src/components/MapSidebar.jsx`, `src/components/RestaurantDetail.jsx`, `src/components/ReviewModal.jsx`, `src/lib/amap/poiAdapter.js`, `src/lib/restaurants/display.js`, `src/index.css`, `src/pages/Index.jsx`, `ARCHITECTURE.md`, `WORKSTREAMS.md`
- 验证：`cmd.exe /c npm.cmd run build` 通过；`cmd.exe /c git diff --check` 通过，仅有仓库既有 LF/CRLF 换行提示。
- 未完成：仍建议在浏览器里手动滑动左侧列表，确认悬浮滚动指示条出现/隐藏时不遮挡列表操作按钮。
- 下一个 Agent 需要注意：`reviewCount` 是可选字段，只从 POI 真实字段或真实评价数组推导，不应填入演示数量。

### 2026-04-25, 当前前端线程

- 状态：Review
- 已完成：将首页重构为四页应用壳层，默认进入社区图文流；底部导航改为 `首页 / 地图 / AI / 榜单 / 我的` 五槽结构，其中 AI 为中央全局动作；地图页保留真实 POI 主链路并改为按需初始化地图画布；榜单和 AI 智选复用同一份真实餐厅数组；我的页改为完整页面并移除右上角用户浮层入口；地图侧栏删除独立智选按钮，详情态不再显示品牌头图。
- 改动文件：`src/pages/Index.jsx`, `src/pages/HomePage.jsx`, `src/pages/MapPage.jsx`, `src/pages/RankingPage.jsx`, `src/pages/ProfilePage.jsx`, `src/components/BottomActionBar.jsx`, `src/components/AIAssistant.jsx`, `src/components/MapSidebar.jsx`, `src/components/RestaurantCard.jsx`, `src/hooks/useAmapRestaurants.js`, `src/mocks/demoData.js`, `ARCHITECTURE.md`, `WORKSTREAMS.md`
- 验证：`cmd.exe /c npm.cmd run build` 通过。
- 未完成：仍需在浏览器中手动验证默认首页、底部切页、AI 智选跳地图、地图初始化、详情头图和移动端底部导航遮挡。
- 下一个 Agent 需要注意：`CommunityPanel`、`FloatingPanel`、`SpinWheel`、`UserProfile` 等旧组件目前未在主入口引用，后续可在确认无回退需求后清理。

### 2026-04-25, 当前前端线程

- 状态：Review
- 已完成：新增宣纸色设计 token，将全局 `background/card/popover`、页面根背景、首页卡片、榜单页、我的页、地图侧栏、餐厅卡片、详情页、底部导航、AI/社区/榜单/个人相关浮层和旧演示弹窗的主要底色统一切到暖宣纸体系；地图画布保持高德原生显示，不做染色。
- 改动文件：`src/index.css`, `tailwind.config.js`, `src/pages/Index.jsx`, `src/pages/HomePage.jsx`, `src/pages/MapPage.jsx`, `src/pages/RankingPage.jsx`, `src/pages/ProfilePage.jsx`, `src/components/*`, `WORKSTREAMS.md`
- 验证：`cmd.exe /c npm.cmd run build` 通过；`cmd.exe /c git diff --check` 通过，仅有仓库既有 LF/CRLF 换行提示。
- 未完成：仍需浏览器视觉确认宣纸色在首页、地图侧栏、详情页、AI 浮层和移动端底部导航下的实际观感。
- 下一个 Agent 需要注意：保留青绿主按钮、黄色评分/收藏等语义色；不要把高德地图 canvas 自身改成宣纸底。

### 2026-04-26, 当前前端线程

- 状态：Review
- 已完成：对 `src/` 全量代码进行静态分析，输出 5 阶段 29 项优化方案文档 `OPTIMIZATION.md`，覆盖安全、性能、代码质量、可访问性、移动端和架构改进。
- 改动文件：`OPTIMIZATION.md`（新建）、`WORKSTREAMS.md`
- 验证：`cmd.exe /c npm.cmd run build` 通过；`cmd.exe /c git diff --check` 通过。
- 未完成：方案待高级 Agent 审查确认后执行。
- 下一个 Agent 需要注意：`OPTIMIZATION.md` 中每项优化都有具体文件位置、现状描述和验收标准，可按阶段分批执行；阶段一（安全）应最先推进。

### 2026-04-26, 当前前端线程

- 状态：Done
- 已完成：审查并重写 `OPTIMIZATION.md`。保留高德密钥、违规 mock 数据、移动端、安全区、筛选可访问性、拥挤度误导等关键问题；修正 `vite.config.ts` 文件名错误；将 ESLint 从安全 P0 改为工程基线 P1；将批量删除依赖和 shadcn/ui 组件降级为 P3；明确性能优化必须先实测；移除文档中的明文密钥。
- 改动文件：`OPTIMIZATION.md`, `WORKSTREAMS.md`
- 验证：`cmd.exe /c git diff --check` 通过，仅有仓库既有 LF/CRLF 换行提示；已检查 `OPTIMIZATION.md` 和 `WORKSTREAMS.md` 不含明文密钥前缀。
- 未完成：尚未执行优化方案本身；建议下一步先做阶段 0：移除高德密钥 fallback、删除或隔离 `src/data/restaurants.js`。
- 下一个 Agent 需要注意：不要按旧方案直接批量卸载依赖或删除 ui 组件；必须先做 import graph 和构建验证。

### 2026-04-26, 当前前端线程

- 状态：Done
- 已完成：
  1. **7 阶段优化全覆盖执行**：阶段 0（高德密钥移至 .env、删除违规 mock 和 5 个旧组件）、阶段 1（.eslintrc.cjs、Vite port/alias 修正、Tailwind content 修正）、阶段 2（lang=zh-CN、标题、视口 100vh→dvh、安全区、筛选菜单 ARIA、prefers-reduced-motion、图片 alt）、阶段 3（getBusyStatus 修复、演示常量集中）、阶段 4（弹窗条件挂载、memo、Marker 增量更新、滚动 ref 优化、代码分割）、阶段 5（useAmapRestaurants 拆分为 4 子 hook、MapSidebar 拆分为 3 子组件、API 层骨架）、阶段 6（卸载 framer-motion/recharts/axios/supabase/html-to-image/vaul/cmdk/input-otp/react-resizable-panels、删除 48 个未使用 ui 组件）。
  2. **个人界面重设计**：去掉头像卡片边框改为悬浮设计；顶部加粉丝/点赞/关注+品食段位；游戏标签改为打卡/评价/探店统计；增加搭一搭历史记录；右侧加个人资料编辑入口+悬浮编辑小窗（头像/昵称/学校/认证状态）；收藏光临条目去边框改分割线、去红心、右侧显示去过次数；收藏/光临优先使用高德 POI 真实数据、无数据回落到 demo。
  3. **lint 零错误**：修复 ESLint 配置（移除不兼容的 react-refresh）、清理所有 unused vars 和转义实体。
- 改动文件：`src/lib/amap/config.js`, `.env`, `.env.example`, `.gitignore`, `.eslintrc.cjs`, `vite.config.js`, `tailwind.config.js`, `package.json`, `index.html`, `src/index.css`, `src/pages/Index.jsx`, `src/pages/ProfilePage.jsx`, `src/pages/MapPage.jsx`, `src/hooks/useAmapRestaurants.js`, `src/hooks/useAmapLoader.js`（新建）、`src/hooks/useMapInstance.js`（新建）、`src/hooks/usePlaceSearch.js`（新建）、`src/hooks/useMarkers.js`（新建）、`src/components/MapSidebar.jsx`, `src/components/MapSidebarHeader.jsx`（新建）、`src/components/FilterMenu.jsx`（新建）、`src/components/RestaurantList.jsx`（新建）、`src/components/AIAssistant.jsx`, `src/components/BottomActionBar.jsx`, `src/components/RestaurantCard.jsx`, `src/components/RestaurantDetail.jsx`, `src/components/ImageCarousel.jsx`, `src/components/RankingPanel.jsx`, `src/lib/restaurants/display.js`, `src/lib/api/client.js`（新建）、`src/lib/api/restaurantApi.js`（新建）、`src/lib/api/reviewApi.js`（新建）、`src/lib/api/authApi.js`（新建）、`src/lib/api/checkinApi.js`（新建）、`src/mocks/demoData.js`, `WORKSTREAMS.md`
- 验证：`npm run build` 通过；`npm run lint` 零错误零警告；`git diff --check` 仅有仓库既有 LF/CRLF 提示。
- 构建产物对比：JS 主包 gzip 从 114KB→62KB（-46%），CSS gzip 从 10.5KB→6.8KB（-35%），node_modules 减少 61 个包，ui 组件从 48 个→2 个。
- 未完成：仍需浏览器手动验证地图加载、四页切换、收藏/点赞联动、AI 弹窗、移动端安全区和重叠。
