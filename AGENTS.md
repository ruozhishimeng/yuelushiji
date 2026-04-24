# Agent 协作手册

文档状态：协作约定  
最后更新：2026-04-22  
适用范围：所有参与本仓库开发的 Codex 窗口、子 Agent、人工开发者

## 1. 协作目标

本项目允许多线程、多 Agent 并行推进，但所有线程必须共享同一套事实源、架构边界和交接格式。任何 Agent 开工前，先读本文件，再读当前任务相关文档。

核心目标：

- 让每个 Agent 知道项目当前要做什么、不能做什么。
- 避免多个线程重复改同一批文件。
- 避免 mock 数据重新混入真实商家主链路。
- 让半完成任务也能被下一个 Agent 平滑接上。

## 2. 文档优先级

当信息冲突时，按以下顺序判断：

1. 用户在当前线程中的最新明确要求。
2. [PRD.md](./PRD.md)：产品目标、范围、真实性原则。
3. [PROJECT.md](./PROJECT.md)：当前项目状态和短期目标。
4. [ARCHITECTURE.md](./ARCHITECTURE.md)：前端结构、数据流、边界。
5. [WORKSTREAMS.md](./WORKSTREAMS.md)：谁在做什么、文件归属、交接。
6. [DECISIONS.md](./DECISIONS.md)：已经做出的技术和产品决策。
7. [RUNBOOK.md](./RUNBOOK.md) 与 [README.md](./README.md)：环境、命令、排错。

## 3. 开工协议

每个 Agent 开始写代码前必须做：

1. 阅读 `AGENTS.md`、`PROJECT.md`、`ARCHITECTURE.md`、`WORKSTREAMS.md`。
2. 执行 `git status --short`，确认工作区已有变更。
3. 在 `WORKSTREAMS.md` 找到自己的工作流，或新增一个小范围工作流。
4. 明确自己负责的文件范围，避免碰其他 Agent 正在占用的文件。
5. 如果发现用户已有改动，不回退、不覆盖，先理解再衔接。

## 4. 项目硬边界

这些规则优先级很高，除非用户明确推翻：

- 主链路必须使用真实高德 POI 商家数据，不再展示虚构商家、虚构定位。
- 没有真实后端的数据，只能放在 `src/mocks/demoData.js` 或明确标注为“演示功能”。
- 组件只消费统一的 `Restaurant` 模型，不直接读取高德原始 POI。
- 高德配置、POI 转换、地图生命周期分别归属：
  - `src/lib/amap/config.js`
  - `src/lib/amap/poiAdapter.js`
  - `src/hooks/useAmapRestaurants.js`
- `selectedRestaurant` 由页面或 Hook 层统一维护，子组件不要再维护另一套餐厅详情状态。
- 前端当前采用保守加固策略：先修结构和真实数据链路，不做整站重设计。

## 5. 文件归属建议

并行开发时，尽量按以下边界拆分：

- 地图与真实商家：`src/lib/amap/*`、`src/hooks/useAmapRestaurants.js`、`src/pages/Index.jsx`。
- 餐厅展示：`RestaurantCard.jsx`、`RestaurantDetail.jsx`、`MapSidebar.jsx`、`ImageCarousel.jsx`。
- 评价与真实性：`ReviewModal.jsx`、`EvaluationModal.jsx`、未来后端接口与数据模型。
- 演示功能隔离：`AIAssistant.jsx`、`MatchingSystem.jsx`、`PersonalCenter.jsx`、`UserProfile.jsx`、`src/mocks/demoData.js`。
- 文档与协作：根目录 `.md` 文件。

如果一个任务必须跨边界修改，先在 `WORKSTREAMS.md` 写清楚影响范围。

## 6. 交接格式

每个 Agent 完成或暂停时，在 `WORKSTREAMS.md` 对应工作流写一段交接：

```md
### 2026-04-22 18:30, Agent 名称

- 状态：In progress / Review / Done / Blocked
- 已完成：
- 改动文件：
- 验证：
- 未完成：
- 下一个 Agent 需要注意：
```

## 7. 验证要求

常规前端改动至少执行：

```bash
npm run build
git diff --check
```

如果 `npm` 在当前 Windows 环境异常，可参考 `RUNBOOK.md` 的直接 Vite 构建方式。若 `npm run lint` 因项目缺少 ESLint 配置失败，必须在交接里说明是历史配置问题还是新问题。

## 8. 完工检查

提交给用户前确认：

- 真实商家主链路没有新增 mock 餐厅或虚构评价。
- 列表、详情、地图选中状态仍来自同一个餐厅对象。
- 演示模块已明确标注，不和真实数据混淆。
- 文档中没有写入新的私密密钥。
- 交接信息能让下一个人直接继续。
