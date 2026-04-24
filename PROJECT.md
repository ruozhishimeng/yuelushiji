# 项目上下文

项目名称：岳麓食纪  
文档状态：协作事实源  
最后更新：2026-04-22  
当前阶段：v0.1 原型整理与前端基座加固

## 1. 一句话说明

岳麓食纪是面向岳麓大学城学生的真实美食地图。当前最重要的产品心智是“真实”：真实商家位置、真实学生评价、真实到店或认证数据。

## 2. 当前目标

短期目标是把前端原型从“能演示”整理成“能继续迭代”：

- 地图和餐厅主链路使用高德真实 POI。
- 虚构商家、虚构评价、虚构热门菜不再混进主链路。
- 前端结构清晰到可以拆给多个 Agent 并行做。
- 保留 AI、饭搭子、个人中心入口，但这些未接后端的能力必须标注为演示。

## 3. 技术栈

- Vite 5
- React 18
- React Router
- Tailwind CSS
- Radix UI / shadcn 风格组件
- lucide-react 图标
- TanStack Query Provider 已接入，但当前主数据流仍以 React state 和 hooks 为主
- 高德地图 JS API v2，通过 `@amap/amap-jsapi-loader` 加载

## 4. 当前代码地图

- `src/pages/Index.jsx`：首页编排层，负责组合地图、侧栏、弹窗与全局 UI 状态。
- `src/hooks/useAmapRestaurants.js`：高德地图生命周期、PlaceSearch、marker、加载和错误状态。
- `src/lib/amap/config.js`：高德配置、中心点、半径、地图样式、分类关键词。
- `src/lib/amap/poiAdapter.js`：高德 POI 到前端 `Restaurant` 模型的唯一转换入口。
- `src/lib/restaurants/display.js`：价格、距离、排序、繁忙状态等展示纯函数。
- `src/components/MapSidebar.jsx`：地图侧栏，展示列表和受控详情。
- `src/components/RestaurantCard.jsx`：餐厅列表卡片。
- `src/components/RestaurantDetail.jsx`：餐厅详情。
- `src/mocks/demoData.js`：AI、饭搭子、个人中心等演示数据的集中位置。

## 5. 关键产品原则

- 地图即入口：打开页面后优先看真实附近餐饮点位。
- 真实优先：没有真实数据就显示空态或演示标记，不用假内容补齐。
- 学生视角：价格、距离、排队、分量、避雷、同校可信评价比商家营销更重要。
- 低耦合迭代：地图、餐厅模型、评价、认证、社交匹配要能拆开开发。

## 6. 当前风险

- 还没有真实后端，评价、认证、收藏、点赞都只是前端临时状态或演示状态。
- 开发机 Node/npm 环境曾出现 PATH 与 npm 启动异常，需要按 `RUNBOOK.md` 排查。
- 当前项目缺少 ESLint 配置文件，`npm run lint` 可能不是有效验证信号。
- 地图服务依赖高德 Key、安全密钥和浏览器网络环境。

## 7. 下一步优先级

1. 完成真实商家地图主链路的浏览器验证。
2. 建立真实评价后端模型和接口草案。
3. 明确学生认证 MVP 方案。
4. 给演示模块增加更清楚的“待接入真实数据”状态。
5. 建立基础自动化检查，让多 Agent 改动更容易合并。
