# 并行工作流看板

文档状态：协作看板  
最后更新：2026-04-24

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
| WS-07 | 视觉与移动端主链路 QA | Ready | 未认领 | `src/pages/Index.jsx`, `src/components/*` | 跑桌面和移动视口截图，找遮挡、溢出、地图可见性问题 |
| WS-08 | PRD 产品方案细化 | Done | 产品经理智能体 + 子 Agent | `PRD.md`, `WORKSTREAMS.md` | 已完成严苛产品审查与 PRD 精修，后续按 v0.2 范围拆研发任务 |

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
