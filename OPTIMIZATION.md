# 前端优化方案审查与修订版

文档状态：已审查，待按阶段执行  
最后更新：2026-04-26  
审查对象：岳麓食纪 v0.1 前端基座  
适用范围：当前 React + Vite + Tailwind + AMap 前端仓库

## 0. 审查结论

原方案整体方向是合适的：它覆盖了安全、真实性边界、性能、可访问性、移动端和后续架构演进。但原方案不能直接按清单顺序执行，主要问题是严重度划分偏激进、部分文件名不准确、部分删除动作风险高于收益。

本修订版采用更稳的执行原则：

- P0 只保留会破坏安全、真实性原则或基础运行的事项。
- 性能优化必须先用浏览器或 React Profiler 验证瓶颈，再做 memo、拆分、代码分割。
- 删除依赖和 shadcn/ui 组件必须先做 import graph 审计，不能按“看起来没用”批量删除。
- 真实 POI 主链路优先于页面结构大改；路由、Context、API 层属于后续可演进项。
- 文档和代码中不得继续写入明文高德 Key 或安全密钥。

## 1. 原方案关键修正

| 原方案项 | 审查结论 | 修正 |
| --- | --- | --- |
| 高德 Key 硬编码 | 判断正确，优先级 P0 | 保留为阶段 0；文档中不再写明文 Key；执行时需同步轮换已暴露密钥 |
| ESLint 缺失列为安全 P0 | 分类不准确 | 改为 P1 质量基线；不阻塞安全修复 |
| `src/data/restaurants.js` 违规 mock | 判断正确，优先级 P0 | 保留为真实性边界问题；先确认无引用，再删除或迁移 |
| `vite.config.ts` | 文件名错误 | 当前仓库实际为 `vite.config.js` |
| 批量删除依赖和 48 个 ui 组件 | 风险偏高 | 降为 P3 清理项；先删除无引用业务组件，再处理依赖 |
| 对所有页面 blanket `React.memo` | 证据不足 | 改为 profiler 驱动；优先稳定回调和重渲染热点 |
| `no-scrollbar` 直接恢复常驻滚动条 | 与当前产品要求冲突 | 改为“隐藏式但可感知”的滚动指示器和键盘可访问补强 |
| 路由升级 | 有价值但不紧急 | 放到 P3；等地图主链路稳定后做 |
| 引入 RestaurantContext | 时机过早 | 后端 API 层明确前不引入全局状态管理 |

## 2. 修订后的执行顺序

### 阶段 0：安全与真实性边界（P0）

目标：先消除不能上线、不能继续扩散的问题。

#### 0.1 移除高德密钥源码 fallback

涉及文件：

- `src/lib/amap/config.js`
- `.env.example`
- `RUNBOOK.md`

问题：

- 当前 `AMAP_KEY` 和 `AMAP_SECURITY_CODE` 存在源码 fallback。
- 密钥已经在对话和本地文件中暴露，正式环境应按泄露处理。

执行方案：

1. 移除 `config.js` 中的真实 fallback，只读取 `VITE_AMAP_KEY` 和 `VITE_AMAP_SECURITY_CODE`。
2. 缺失环境变量时返回明确的配置错误状态，由地图页展示“地图服务未配置”空态。
3. 在 `.env.example` 写占位字段，不写真实值。
4. 在 `RUNBOOK.md` 补充本地配置步骤。
5. 轮换已暴露的高德 Key 和安全密钥。

验收标准：

- 仓库源码中不再出现真实 Key 前缀或安全密钥前缀。
- 缺少环境变量时应用不白屏，地图页显示可读错误。
- `npm run build` 通过。

#### 0.2 删除或隔离 `src/data/restaurants.js`

涉及文件：

- `src/data/restaurants.js`
- `src/mocks/demoData.js`
- 可能引用它的业务组件

问题：

- 该文件包含虚构商家、虚构评价、虚构图片和虚构定位。
- 与项目“真实高德 POI 主链路”硬边界冲突。

执行方案：

1. 全仓库确认是否仍有 `src/data/restaurants.js` import。
2. 如无引用，删除该文件和空目录。
3. 如有引用，只允许迁移到 `src/mocks/demoData.js`，并确保 UI 标注“演示”。
4. 新增轻量内容检查脚本，至少检查：
   - `src/data/restaurants.js` 不存在。
   - `src/lib/amap/config.js` 不含真实 Key fallback。
   - 主链路组件不从 `src/mocks/demoData.js` 读取餐厅列表。

验收标准：

- `src/data/restaurants.js` 不存在，或不再包含虚构商家主链路数据。
- 首页、地图、榜单、AI 仍可构建。
- 没有新增 mock 餐厅进入 `Restaurant[]` 主模型。

### 阶段 1：工程基线（P1）

目标：让后续多 Agent 改动有可靠检查信号。

#### 1.1 建立 ESLint 配置

涉及文件：

- `.eslintrc.cjs`
- `package.json`

执行方案：

1. 新增 `.eslintrc.cjs`，适配当前 `type: "module"` 项目。
2. 启用：
   - `eslint:recommended`
   - `plugin:react/recommended`
   - `plugin:react-hooks/recommended`
   - `plugin:react-refresh/recommended`
3. 暂不启用过重规则，先让 `npm run lint` 产出可信问题。
4. 对历史模板问题分批修，不在一次 PR 里混入大规模风格重写。

验收标准：

- `npm run lint` 不再因为缺配置失败。
- 首次 lint 结果能区分“历史问题”和“本次新增问题”。

#### 1.2 修正 Vite 配置

涉及文件：

- `vite.config.js`

已核对现状：

- `server.port` 是字符串 `'8080'`，应改为数字 `8080`。
- `resolve.alias` 中 `lib -> ./lib` 指向不存在的根目录。
- `NOCODE_COMPILER_PATH` 会进入动态 import，应加约束或保留说明，避免误删影响现有 NoCode 插件链路。

执行方案：

1. 将 `port` 改为数字。
2. 删除不存在的 `lib` alias，或改为明确的 `@/lib` 使用方式。
3. 对 `NOCODE_COMPILER_PATH` 增加路径校验和注释；若当前平台依赖该能力，不直接删除。

验收标准：

- `npm run build` 通过。
- `npm run dev` 在当前 WSL2/Windows 约定环境中可启动。

#### 1.3 修正 Tailwind 扫描范围

涉及文件：

- `tailwind.config.js`

执行方案：

```js
content: ["./index.html", "./src/**/*.{js,jsx}"]
```

验收标准：

- 构建 CSS 未丢失业务页面 class。
- `npm run build` 通过。

### 阶段 2：当前用户体验与可访问性（P1）

目标：先修用户能明显感知的问题，同时不改变真实 POI 数据链路。

#### 2.1 基础 HTML 与品牌信息

涉及文件：

- `index.html`

问题：

- 当前 `html lang="en"`，应用主体是中文。
- 当前 `<title>` 仍为 `NoCode`。

执行方案：

1. 改为 `<html lang="zh-CN">`。
2. 标题改为“岳麓食纪”。
3. favicon 可后续替换为项目自有资源，本阶段不强制。

#### 2.2 地图页视口与底部安全区

涉及文件：

- `src/pages/MapPage.jsx`
- `src/components/BottomActionBar.jsx`
- `src/components/AIAssistant.jsx`

已核对现状：

- `MapPage` 同时存在 `h-dvh` 和 `style={{ minHeight: '100vh' }}`，移动端可能出现双重视口逻辑。
- 底部导航没有明确 `safe-area-inset-bottom`。

执行方案：

1. 移除 `MapPage` 的 `minHeight: '100vh'` inline style，统一使用 `h-dvh`。
2. 底部导航增加 `pb-[env(safe-area-inset-bottom)]` 或等价 CSS。
3. AI 浮层和地图操作按钮统一相对底部导航定位，避免 375px 宽度下重叠。

验收标准：

- 375px、768px、1440px 下无横向滚动。
- 底部导航、AI 浮层、地图定位按钮不互相遮挡。

#### 2.3 筛选菜单可访问性

涉及文件：

- `src/components/MapSidebar.jsx`

执行方案：

1. 短期补齐：
   - `aria-expanded`
   - `aria-controls`
   - Escape 关闭
   - 点击外部关闭
2. 中期替换为 Radix `Popover` 或 `DropdownMenu`。
3. 保持当前筛选菜单视觉，不做大规模样式重设计。

验收标准：

- Tab 可聚焦筛选按钮。
- Enter/Space 可打开。
- Escape 可关闭。
- 关闭后焦点回到筛选按钮。

#### 2.4 滚动条策略

涉及文件：

- `src/index.css`
- `src/components/MapSidebar.jsx`

背景：

- 用户已要求左栏滚动条隐藏式、滑动才显示。
- 原方案建议恢复常驻滚动条，会违背当前交互方向。

修订方案：

1. 保留“非滚动时不占布局”的滚动指示器。
2. 补充键盘可访问：滚动区域可聚焦，并有可见 focus ring。
3. 若后续做自定义滚动条，必须仍然不改变内容排布。

验收标准：

- 鼠标滚动时有短暂可见滚动反馈。
- 键盘用户可以聚焦列表并滚动。
- 滚动反馈不挤压餐厅卡片。

#### 2.5 减弱动态偏好与图片 alt

涉及文件：

- `src/index.css`
- `src/components/ImageCarousel.jsx`
- `src/components/AIAssistant.jsx`
- `src/components/MatchingSystem.jsx`

执行方案：

1. 添加 `prefers-reduced-motion: reduce`，关闭非必要动画。
2. 轮播图片 alt 改为包含餐厅名和序号。
3. AI 语音条动画在 reduce motion 下静止或使用低频状态。

验收标准：

- 系统设置减少动态效果时，不再出现连续 pulse/bounce 动画。

### 阶段 3：真实性与展示逻辑修正（P1）

目标：避免产品表达误导用户。

#### 3.1 修复拥挤度逻辑

涉及文件：

- `src/lib/restaurants/display.js`
- `src/components/RestaurantDetail.jsx`

问题：

- 当前 `getBusyStatus` 使用评分推导“排队/拥挤”，评分和实时拥挤度没有因果关系。

执行方案：

```js
export const getBusyStatus = () => ({
  text: '暂无实时拥挤信息',
  level: 'unknown',
  color: 'text-gray-400'
});
```

后续接入真实打卡密度、排队或热力数据后再恢复拥挤度。

验收标准：

- 详情页不再用评分暗示排队情况。
- 没有真实实时数据时只显示未知状态。

#### 3.2 集中演示常量

涉及文件：

- `src/components/RankingPanel.jsx`
- `src/components/AIAssistant.jsx`
- `src/mocks/demoData.js`

已核对现状：

- `RankingPanel` 内有 `demoHeat`。
- `AIAssistant` 内有 `voiceBarHeights`。

执行方案：

1. 将演示热度和语音柱高度迁移到 `src/mocks/demoData.js`。
2. 组件只 import 演示常量。
3. 不把这些演示常量传入真实 `Restaurant` 模型。

验收标准：

- 业务组件内不再定义演示数组。
- 演示标识仍清晰可见。

### 阶段 4：性能优化（P2，必须实测驱动）

目标：减少真实卡顿，不做无证据微优化。

#### 4.1 Index 壳层渲染控制

涉及文件：

- `src/pages/Index.jsx`
- `src/pages/*`
- `src/components/*`

修订方案：

1. 先用 React Profiler 记录：
   - 首页切页
   - 地图搜索输入
   - 收藏/点赞
   - AI 打开/关闭
2. 只对热点组件使用 `React.memo`。
3. 对传入深层组件的事件处理函数使用 `useCallback`。
4. 对当前已经 `return null` 的弹窗组件，不急于做条件 import；先确认实际渲染成本。

验收标准：

- 搜索输入时非活跃页面不重渲染，或重渲染成本可忽略。
- 收藏/点赞交互无明显掉帧。

#### 4.2 Marker 增量更新

涉及文件：

- `src/hooks/useAmapRestaurants.js`

执行方案：

1. 为 marker 建立 `restaurantId -> marker` Map。
2. 搜索结果整体替换时全量重建 marker。
3. 收藏/点赞等局部 UI 状态变化时只更新对应 marker 内容。
4. 避免 marker 引用和 React state 出现双源不一致。

验收标准：

- 收藏/点赞不触发全部 marker `setMap(null)`。
- 地图点击 marker 后仍能打开同一个 `selectedRestaurant`。

#### 4.3 滚动指示器性能

涉及文件：

- `src/components/MapSidebar.jsx`

执行方案：

1. 将滚动条位置更新改为 DOM ref 或 `requestAnimationFrame` 节流。
2. 不再在每个 scroll event 中直接 setState。

验收标准：

- 左侧列表滚动时 `MapSidebar` 不因每帧滚动重渲染。

#### 4.4 代码分割

涉及文件：

- `vite.config.js`

执行方案：

1. 先用当前 `build/assets` 体积作为基线。
2. 拆分：
   - React vendor
   - AMap loader
   - lucide icons
   - Radix/shadcn 相关依赖
3. 不为了 chunk 数量牺牲缓存命中和首屏体验。

验收标准：

- 首屏 chunk gzip 体积下降。
- 地图页相关代码可被单独缓存或延迟加载。

### 阶段 5：结构拆分与后端接入准备（P2/P3）

目标：为 v0.2 真实评价、学生认证和后端 API 做准备。

#### 5.1 拆分 `useAmapRestaurants`

建议拆分：

| 模块 | 职责 |
| --- | --- |
| `useAmapLoader` | AMap SDK 加载 |
| `useMapInstance` | mapEnabled、地图创建和销毁 |
| `usePlaceSearch` | POI 搜索与错误状态 |
| `useMarkers` | marker 创建、更新、清理 |
| `useAmapRestaurants` | 组合层，对页面暴露现有接口 |

验收标准：

- 对 `Index.jsx` 的接口尽量保持兼容。
- 地图加载、搜索、分类、marker 点击、详情联动不回退。

#### 5.2 拆分 `MapSidebar`

建议拆分：

| 组件 | 职责 |
| --- | --- |
| `MapSidebarHeader` | 品牌头图和搜索区 |
| `FilterMenu` | 排序和分类 |
| `RestaurantList` | 列表和空态 |
| `ScrollIndicator` | 隐藏式滚动反馈 |
| `MapSidebar` | 详情/列表模式编排 |

验收标准：

- `selectedRestaurant` 仍只由页面或 hook 维护。
- 详情打开/返回、收藏/点赞状态一致。

#### 5.3 API 层骨架

建议新增：

| 文件 | 职责 |
| --- | --- |
| `src/lib/api/client.js` | fetch 封装、错误处理、认证头 |
| `src/lib/api/restaurantApi.js` | 平台商家库与 POI 绑定 |
| `src/lib/api/reviewApi.js` | 评价读取、提交、审核状态 |
| `src/lib/api/authApi.js` | 登录与学生认证 |
| `src/lib/api/checkinApi.js` | 到店打卡与凭证 |

说明：

- 当前 TanStack Query Provider 已存在，后续 API hook 可基于它扩展。
- 不建议先引入全局状态库；等后端数据边界确定后再决定。

#### 5.4 路由升级

价值：

- URL 可分享。
- 浏览器前进/后退可用。
- 多页面测试更稳定。

执行时机：

- 地图页和四页切换经过浏览器验证后再做。
- 先保持 `BottomActionBar` 行为一致，再替换内部状态为 React Router。

### 阶段 6：依赖和 UI 组件清理（P3）

目标：降低长期维护成本，但不优先于真实链路和用户体验。

执行原则：

1. 不按目录批量删除 shadcn/ui 组件。
2. 先删除确认未被主入口引用的业务旧组件。
3. 再删除对应未使用依赖。
4. 每删除一组依赖后运行构建。

当前核对结果：

- `framer-motion` 仍被 `FloatingPanel.jsx` 引用；如果确认旧浮层不再使用，应先删除 `FloatingPanel.jsx`，再考虑卸载 `framer-motion`。
- `cmdk`、`vaul`、`input-otp`、`react-resizable-panels` 由 shadcn/ui 组件引用；只有删除对应 ui 组件后才可卸载。
- `axios`、`@supabase/supabase-js`、`html-to-image`、`recharts` 当前业务代码未直接引用，可列入候选，但应结合 package-lock 和未来后端方案判断。

验收标准：

- 删除后 `npm run build` 通过。
- `package-lock.json` 与 `package.json` 一致。
- 不影响后续可能保留的 UI 基础组件。

## 3. 推荐执行路线

建议按以下顺序推进：

1. 阶段 0：高德密钥与违规 mock 数据。
2. 阶段 1：ESLint、Vite、Tailwind 工程基线。
3. 阶段 2：HTML、移动端安全区、筛选菜单、动画和 alt。
4. 阶段 3：拥挤度逻辑和演示常量集中。
5. 阶段 4：基于实测的性能优化。
6. 阶段 5：Hook、侧栏、API 层和路由演进。
7. 阶段 6：依赖和 UI 组件清理。

可并行拆分：

- 安全与真实性：`src/lib/amap/config.js`、`.env.example`、`src/data/*`。
- 工程基线：ESLint、Vite、Tailwind、脚本。
- 体验修复：`index.html`、`MapPage`、`BottomActionBar`、`MapSidebar`、`ImageCarousel`。
- 性能与结构：`useAmapRestaurants`、marker、sidebar 拆分。

## 4. 每阶段验证要求

基础命令：

```bash
cmd.exe /c npm.cmd run build
cmd.exe /c git diff --check
```

阶段 1 后增加：

```bash
cmd.exe /c npm.cmd run lint
```

浏览器手动验证：

- 首页、地图、榜单、我的四页切换。
- 地图加载、搜索、分类、marker 点击、详情打开/返回。
- 收藏和点赞在列表与详情之间一致。
- AI 智选仍基于真实 POI 或显示等待真实数据。
- 演示内容都有“演示/待接入真实数据”标记。
- 375px、768px、1440px 下无横向滚动和底部遮挡。

## 5. 禁止事项

- 不得再把真实 Key 或安全密钥写入源码或文档。
- 不得把 `src/data/restaurants.js` 这类虚构商家重新接入主链路。
- 不得为了界面饱满生成虚构评价、虚构菜品、虚构定位。
- 不得在没有 import graph 和构建验证的情况下批量删除 UI 组件或依赖。
- 不得先引入全局状态库来掩盖数据边界不清的问题。

## 6. 总结

本方案适合作为后续前端加固路线，但必须按“安全和真实性优先、体验修复其次、性能实测驱动、架构后置”的顺序执行。当前最应该先做的是阶段 0：移除密钥 fallback、删除或隔离违规 mock 餐厅数据，并建立内容检查，防止真实主链路再次被演示数据污染。
