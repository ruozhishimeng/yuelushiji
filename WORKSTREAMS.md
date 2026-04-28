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
| WS-11 | 首页验证图文与筛选原型 | Review | Codex 当前线程 | `src/pages/HomePage.jsx`, `src/components/RestaurantCard.jsx`, `src/mocks/demoData.js`, `src/pages/Index.jsx` | 浏览器手动确认浮窗、筛选 chips、分页与商家卡片跳转 |

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

### 2026-04-27 14:01, Codex 当前线程

- 状态：Review
- 已完成：首页验证图文改为每页 6 组；新增可点击图文详情浮窗，包含图片切换、详细评价、演示评论区和末尾真实商家小卡片；`RestaurantCard` 增加 `compact` 变体以复用地图/收藏条目视觉；首页筛选升级为搜索、校区、快速 chips、更多筛选面板和可清空的已选 chips；验证图文与评论集中在 `verificationPosts`，仅通过运行时规则匹配真实高德 `Restaurant`，不新增虚构商家到主链路。
- 改动文件：`src/pages/HomePage.jsx`, `src/components/RestaurantCard.jsx`, `src/mocks/demoData.js`, `src/pages/Index.jsx`, `WORKSTREAMS.md`
- 验证：`npm run lint` 通过；`npm run build` 通过；`git diff --check` 通过；`curl -I http://172.22.144.1:8080/` 返回 200；请求 Vite 转换后的 `src/pages/HomePage.jsx` 成功返回模块内容。
- 未完成：仍建议在 in-app browser 手动点击至少一张图文，确认浮窗视觉、图片切换、商家小卡片跳转地图和移动端筛选折行。
- 下一个 Agent 需要注意：`正在营业` 仍因缺少真实营业字段保持置灰；首页评论输入为禁用原型态，不能在未接后端前伪造真实提交。

### 2026-04-27 14:49, Codex 当前线程

- 状态：Done
- 已完成：修复个人页“我的勋章”格子内容不居中问题，将勋章单元改为垂直 flex 居中，并收紧名称行高。
- 改动文件：`src/pages/ProfilePage.jsx`, `WORKSTREAMS.md`
- 验证：`npm run lint` 通过；`npm run build` 通过；`git diff --check` 通过。
- 未完成：无。
- 下一个 Agent 需要注意：本次只改个人页勋章布局样式，未触碰真实商家主链路。

### 2026-04-27 15:28, Codex 当前线程

- 状态：Done
- 已完成：将全局核心 UI 字体切换为系统国风楷体字体栈，并让按钮、输入框、选择框等控件继承同一字体。
- 改动文件：`src/index.css`, `WORKSTREAMS.md`
- 验证：`npm run lint` 通过；`npm run build` 通过；`git diff --check` 通过。
- 未完成：无。
- 下一个 Agent 需要注意：字体采用系统字体栈，不引入远程字体；不同系统实际命中的楷体字体可能略有差异。


### 2026-04-27 23:00, Codex 当前线程

- 状态：Done
- 已完成：核对前后端真实运行状态，确认个人中心注册报 `API Error: 500` 的直接原因不是前端逻辑，而是后端未启动；进一步定位到 `server/node_modules/better-sqlite3` 使用了错误平台的原生二进制，在 WSL 下报 `invalid ELF header`。已在当前环境重编译 `better-sqlite3`，验证后端健康检查和昵称注册接口可用；同时将根目录 `npm run dev` 改为同时启动前后端，并在 `RUNBOOK.md` 补充 `dev:client`、`dev:server` 和 WSL 原生模块修复命令。
- 改动文件：`package.json`, `RUNBOOK.md`, `WORKSTREAMS.md`
- 验证：`node -e "const Database=require('./server/node_modules/better-sqlite3'); const db=new Database(':memory:'); db.prepare('select 1 as x').get(); console.log('ok'); db.close();"` 通过；`npm run dev:server` 成功启动；`curl http://127.0.0.1:3000/api/health` 返回 200；`POST /api/auth/register` 返回 201；`npm run build` 通过；`git diff --check` 仍报 `src/mocks/demoData.js:3` 的既有 trailing whitespace。
- 未完成：未清理 `src/mocks/demoData.js` 既有尾随空格；学生认证与打卡接口仍是 501 占位实现。
- 下一个 Agent 需要注意：如果切换 Windows 和 WSL 运行同一份 `server/node_modules`，`better-sqlite3` 可能再次出现平台错配，需要在 `server/` 下执行 `npm rebuild better-sqlite3 --build-from-source`。


### 2026-04-27 23:15, Codex 当前线程

- 状态：Done
- 已完成：定位并修复 `npm run dev` 中前端 `Error: listen EACCES: permission denied :::8080`。根因是 `vite.config.js` 将 dev server 绑定到 IPv6 通配地址 `::`，在当前 Windows/WSL 环境下无权限监听；已改为 `process.env.VITE_HOST || '0.0.0.0'`，并将 API 代理目标改为 `http://127.0.0.1:3000`。同时清理了我在验证过程中留下的旧 `3000/8080` 进程，确认根目录 `npm run dev` 可同时启动前后端。
- 改动文件：`vite.config.js`, `WORKSTREAMS.md`
- 验证：`npm run dev:client` 成功监听 `http://localhost:8080/` 和 `http://172.22.144.113:8080/`；`curl -I http://127.0.0.1:8080` 返回 200；`npm run dev` 成功同时启动 Vite 和 `node server/index.js`；`npm run build` 通过；`git diff --check` 通过。
- 未完成：`RUNBOOK.md` 尚未补充本次 IPv6 监听问题说明。
- 下一个 Agent 需要注意：如果用户终端里已有旧的 `vite` 或 `node server/index.js` 实例，再次执行 `npm run dev` 会先撞到端口占用，需要先停旧进程。


### 2026-04-28 00:00, Codex 当前线程

- 状态：Done
- 已完成：修复地图页移动后对焦商家联动退化，原因是 `useMapInstance` 的 `moveend` 回调没有正确回流到搜索与 marker 展示层；现在地图移动后会重新计算中心最近商家，并只让少量商家显示大气泡，其余改为小圆点。重做了地图 marker 样式，气泡扩大为“头图 + 评分徽标 + 下方名称”的结构；同时把全局楷体撤回，仅保留 `font-ui-kaiti` 给稳定 UI 标签使用。个人中心新增固定演示账号入口：输入 `tcm` 不再新建普通用户，而是命中带收藏和评价数据的 `demo-user-0001`。
- 改动文件：`src/hooks/useMapInstance.js`, `src/hooks/useMarkers.js`, `src/hooks/useAmapRestaurants.js`, `server/routes/auth.js`, `server/db/seed.js`, `src/index.css`, `src/components/BottomActionBar.jsx`, `src/components/FilterMenu.jsx`, `src/pages/ProfilePage.jsx`, `src/pages/Index.jsx`, `src/pages/HomePage.jsx`, `src/hooks/useFavorites.js`, `WORKSTREAMS.md`
- 验证：`node --check src/hooks/useMapInstance.js`、`src/hooks/useMarkers.js`、`src/hooks/useAmapRestaurants.js`、`server/routes/auth.js` 通过；`curl http://127.0.0.1:3000/api/health` 返回 200；`POST /api/auth/register` 传 `tcm` 返回 `demo-user-0001`；`GET /api/auth/me` 返回 `favoriteCount: 5, reviewCount: 19`；`GET /api/users/me/favorites` 返回 5 条收藏；`npm run lint` 通过；`npm run build` 通过；`git diff --check` 通过；前端开发服务当前运行在 `http://127.0.0.1:8081/`，后端运行在 `http://127.0.0.1:3000/`。
- 未完成：未做浏览器内的逐步点击录屏式验证，地图自动对焦与气泡切换目前是代码级和本地服务级确认。
- 下一个 Agent 需要注意：8080 当前被别的 Vite 实例占用，所以这次前端起在 8081；如果要复用当前会话继续测试，优先访问 8081。

### 2026-04-28 11:16, Codex 当前线程

- 状态：Done
- 已完成：排查 localhost:8080 未体现地图更新的问题，确认当前 8080/3000 只剩一套最新前后端进程，localhost 与 172.22.144.113 都已指向同一份最新源码。进一步定位到地图页‘随移动自动显示对焦点商家’退化的根因是：moveend 后只更新 marker 外观和重新搜点，没有把新的中心焦点商家写回 selectedRestaurant，导致侧栏详情仍停留在旧状态。现已在检索回调中把最近商家同步为当前选中商家，并在空结果时清空旧详情。
- 改动文件：src/hooks/usePlaceSearch.js, src/hooks/useAmapRestaurants.js, WORKSTREAMS.md
- 验证：ss -ltnp 确认仅 node 监听 0.0.0.0:8080 和 *:3000；curl 两个 8080 入口返回相同的 ProfilePage 模块内容；curl 两个 3000 入口均返回 status ok；node --check src/hooks/usePlaceSearch.js 与 src/hooks/useAmapRestaurants.js 通过；npm run build 通过；git diff --check 通过。
- 未完成：未做浏览器内拖拽地图的逐步手动验证，当前结论来自代码链路和本地服务验证。
- 下一个 Agent 需要注意：如果 in-app browser 仍显示旧页面，优先排查浏览器缓存或残留标签页，而不是继续怀疑 8080 指向旧进程；当前服务侧已经是最新代码。

### 2026-04-28 12:20, Codex 当前线程

- 状态：Done
- 已完成：定位地图页“正在加载商家”反复闪动的根因是 useAmapRestaurants 中搜索回调依赖 selectedRestaurant 和 mapEnabled，导致 wrappedSearchRestaurants 频繁重建，连带初始化搜索 effect 被反复触发。现已把这两个值改为 ref 读取，避免地图移动后的焦点联动再次造成搜索风暴。个人中心“搭一搭历史”补充为 3 条演示记录。首页社区图文为 tcm 演示账号、收藏列表和社区帖子补充了前端本地降级；当本地后端因 better-sqlite3 原生模块损坏无法启动时，5173 仍可展示社区与个人中心原型。两条坏图（堕落街烧烤、考研人砂锅饭）已统一切到本地资产路径。
- 改动文件：src/hooks/useAmapRestaurants.js, src/pages/ProfilePage.jsx, src/lib/api/communityApi.js, src/lib/api/authApi.js, src/lib/api/favoriteApi.js, src/lib/api/demoFallback.js, server/routes/community.js, server/db/seed.js, WORKSTREAMS.md
- 验证：npm run build 通过；git diff --check 通过；curl http://127.0.0.1:5173/src/hooks/useAmapRestaurants.js 可见 selectedRestaurantRef 和 mapEnabledRef；curl http://127.0.0.1:5173/src/pages/ProfilePage.jsx 可见 MATCH_HISTORY_DEMO；curl http://127.0.0.1:5173/src/lib/api/communityApi.js 可见社区本地降级逻辑。
- 未完成：server/node_modules/better-sqlite3 当前仍受挂载盘上的坏原生文件影响，WSL 下本地后端未恢复；这不影响 5173 前端原型查看，但会影响真实后端链路验证。
- 下一个 Agent 需要注意：如果要恢复 WSL 后端，优先在 Windows 侧或干净 worktree 重新安装 server/node_modules，不要继续在当前损坏的 better-sqlite3 构建目录上反复 rebuild。

### 2026-04-28 12:55, Codex 当前线程

- 状态：Done
- 已完成：修复首页两条社区图文的错误本地图片资源。堕落街烧烤大测评 改为真实烤串照片，考研人的食堂：天马砂锅饭生存手册 改为真实鸡肉米饭餐食照片；同时把相关 cover / images / photos 引用统一切到新的本地 JPG，移除这两条详情里混入的无关旧图。
- 改动文件：src/lib/api/demoFallback.js, server/routes/community.js, server/db/seed.js, public/assets/post-duoluojie-bbq.jpg, public/assets/post-kaoyan-claypot-rice.jpg, WORKSTREAMS.md
- 验证：待执行 npm run build 与 git diff --check。
- 未完成：WSL 本地后端仍受 better-sqlite3 损坏影响，本次仅修复前端原型和 seed 资源引用。
- 下一个 Agent 需要注意：不要再把失效外链另存为 .png 占位文件；先校验下载到的是否是真实图片字节，再接入 public/assets/。

### 2026-04-28 14:20, Codex 当前线程

- 状态：Done
- 已完成：重构搭一搭原型交互。中央 AI 切到 寻找搭子 后会直接打开配置界面；MatchingSystem 从空态弹窗升级为 配置区 + 一键匹配 + 发布需求 + 待搭列表 的完整演示原型；个人中心的 搭一搭历史 改为头像叠放、店铺、时间、状态和结果摘要的信息流卡片。
- 改动文件：src/components/AIAssistant.jsx, src/components/MatchingSystem.jsx, src/pages/Index.jsx, src/pages/MapPage.jsx, src/components/RestaurantCard.jsx, src/components/RestaurantDetail.jsx, src/pages/ProfilePage.jsx, src/lib/demo/matchingData.js, WORKSTREAMS.md
- 验证：npm run build 通过；git diff --check 通过。
- 未完成：搭一搭仍是前端演示状态，未接真实匹配后端和消息系统。
- 下一个 Agent 需要注意：新的搭一搭演示数据已经迁到 src/lib/demo/matchingData.js，不要再往已废弃的 src/mocks/demoData.js 塞数据。
