# 岳麓食纪本地运行指南

这是一个 Vite + React 前端原型项目。建议使用 Node.js 18 运行，避免不同 Node 大版本导致依赖或构建异常。

## 0. 项目协作文档

多线程或多 Agent 开发时，先按这个顺序阅读：

1. [AGENTS.md](./AGENTS.md)：Agent 协作规则、开工协议、交接格式。
2. [PROJECT.md](./PROJECT.md)：项目当前状态、技术栈、优先级。
3. [PRD.md](./PRD.md)：产品目标、MVP 范围、真实性原则。
4. [ARCHITECTURE.md](./ARCHITECTURE.md)：前端架构、数据流、mock 边界。
5. [WORKSTREAMS.md](./WORKSTREAMS.md)：并行工作流、文件归属、交接日志。
6. [ROADMAP.md](./ROADMAP.md)：阶段规划。
7. [RUNBOOK.md](./RUNBOOK.md)：运行、验证、排错。
8. [DECISIONS.md](./DECISIONS.md)：关键技术和产品决策记录。

## 1. 安装 Node.js 18

### Windows

推荐使用 nvm-windows 管理 Node 版本：

1. 打开 nvm-windows releases 页面：https://github.com/coreybutler/nvm-windows/releases
2. 下载并安装 `nvm-setup.exe`
3. 重新打开 PowerShell 或 CMD
4. 执行：

```powershell
nvm install 18
nvm use 18
node -v
npm -v
```

确认 `node -v` 输出为 `v18.x.x`。

### macOS / Linux

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
nvm install 18
nvm use 18
node -v
npm -v
```

## 2. 安装项目依赖

在项目根目录执行：

```bash
npm install
```

## 3. 启动开发服务器

```bash
npm run dev
```

启动成功后，浏览器打开终端中显示的本地地址，通常是：

```text
http://localhost:5173/
```

## 4. 高德地图配置

当前代码已内置一组开发用高德 JS API 配置，地图会通过高德 `PlaceSearch` 加载岳麓大学城附近真实餐饮 POI。

如果需要替换 Key，可以在项目根目录创建 `.env.local`：

```env
VITE_AMAP_KEY=你的高德JSAPIKey
VITE_AMAP_SECURITY_CODE=你的高德安全密钥
```

## 5. 可选：一键检查并启动

项目提供了一个本地辅助脚本，会检查 npm、安装依赖并后台启动 Vite：

```bash
node ./scripts/dev-launcher.mjs
```

Windows PowerShell 也可以执行：

```powershell
node .\scripts\dev-launcher.mjs
```

## 6. 常见问题

### npm 或 node 启动异常

如果出现类似下面的错误：

```text
Could not determine Node.js install directory
Assertion failed: ncrypto::CSPRNG(nullptr, 0)
```

通常说明当前激活的 Node/npm 安装异常，建议：

1. 卸载当前 Node.js，或用 nvm 切换掉当前版本。
2. 使用 `nvm install 18` 和 `nvm use 18`。
3. 重新打开终端。
4. 再执行 `node -v`、`npm -v`、`npm install`。
