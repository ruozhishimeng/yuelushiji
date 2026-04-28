# 运行与排错手册

文档状态：开发运行手册  
最后更新：2026-04-27

## 1. 推荐环境

- Node.js 18.x
- npm 10.x
- Windows PowerShell 或 CMD
- 浏览器：Chrome 或 Edge

项目根目录：

```text
F:\yuelushiji
```

## 2. 常用命令

安装根目录依赖：

```bash
npm install
```

安装后端依赖（首次拉起后端或切换 Windows/WSL 环境后建议执行一次）：

```bash
cd server
npm install
```

启动前后端开发服务：

```bash
npm run dev
```

仅启动前端：

```bash
npm run dev:client
```

仅启动后端：

```bash
npm run dev:server
```

如果在 WSL 中启动后端出现 `better-sqlite3 ... invalid ELF header`，说明 `server/node_modules` 是在另一个平台安装的，执行：

```bash
cd server
npm rebuild better-sqlite3 --build-from-source
```

构建：

```bash
npm run build
```

检查 diff 空白问题：

```bash
git diff --check
```

辅助启动脚本：

```bash
node ./scripts/dev-launcher.mjs
```

## 3. 高德地图配置

项目会读取：

```env
VITE_AMAP_KEY=你的高德 JS API Key
VITE_AMAP_SECURITY_CODE=你的高德安全密钥
```

建议把本机配置写在 `.env.local`，不要把新的私密配置提交到仓库。当前主链路依赖高德 JS API v2 和 `PlaceSearch` 插件。

## 4. npm 或 node 不识别

症状：

```text
node: The term 'node' is not recognized
npm: The term 'npm' is not recognized
nvm: The term 'nvm' is not recognized
```

处理：

1. 确认 nvm-windows 已安装。
2. 重新打开 PowerShell 或 CMD。
3. 执行：

```powershell
nvm install 18
nvm use 18
node -v
npm -v
```

如果 `nvm` 也不识别，说明 nvm 安装目录没有进入 PATH，优先检查 Windows 环境变量。

## 5. npm.cmd 启动异常

当前环境曾出现 `npm.cmd` 无法正常启动，但直接用 Node 调 Vite 可以构建。临时验证方式：

```powershell
node .\node_modules\vite\bin\vite.js build
```

这不是长期方案，只是本机 npm 异常时的验证退路。

## 6. dev server 监听失败

当前环境曾出现：

```text
listen UNKNOWN
getaddrinfo EAI_FAIL localhost
```

可能原因：

- 当前 Codex/Windows 沙箱网络监听异常。
- localhost 解析异常。
- 端口被占用或系统网络栈异常。

尝试：

```powershell
npm run dev -- --host 127.0.0.1
```

或：

```powershell
node .\node_modules\vite\bin\vite.js --host 127.0.0.1
```

如果仍失败，先用 `npm run build` 或直接 Vite build 验证代码正确性，再在用户本机普通终端启动。

## 7. lint 状态

`package.json` 有：

```bash
npm run lint
```

但当前项目可能缺少 ESLint 配置文件。若 lint 报 “couldn't find a configuration file”，这是项目基础配置缺口，不代表本次改动一定有语法问题。后续应单独补 ESLint 配置，再把 lint 纳入强验证。

## 8. 多 Agent 验证习惯

每个工作流交接时至少记录：

- 运行了哪些命令。
- 哪些命令失败。
- 失败原因是代码、环境，还是历史配置。
- 有没有浏览器手动验证。

交接位置：[WORKSTREAMS.md](./WORKSTREAMS.md)。
