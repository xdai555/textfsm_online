# TextFSM Online 前端

基于 Vue 3 + Element Plus + CodeMirror 6 的 TextFSM 模板在线解析工具前端。

线上地址: https://textfsm.xdai.vip/

## 技术栈

- Vue 3.5 + Composition API
- Element Plus 2.9
- CodeMirror 6（自定义 TextFSM 语法高亮）
- Pinia 状态管理
- Splitpanes 三栏布局
- Vite 6 构建

## 本地开发

```bash
cd web
bun install          # 或 npm install
bun run dev           # 或 npm run dev
```

启动后访问 http://localhost:5173 ，Vite 已配置 `/api` 代理到后端 9999 端口，需同时启动后端服务。

## 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `VITE_API_BASE_URL` | `/api` | 后端 API 地址，本地开发无需修改；前后端分开部署时设为完整地址（如 `https://api.example.com/api`） |
| `VITE_ENABLE_BOOK_PROMO` | `false` | 是否启用书籍推荐弹窗 |

构建时通过环境变量注入：

```bash
VITE_API_BASE_URL=https://api.example.com/api bun run build
```

或在 `.env.production` 中配置。

## 生产构建

```bash
bun run build         # 或 npm run build
```

输出到 `dist/` 目录。Docker 部署由 Nginx 反向代理 `/api` 到后端；前后端分开部署时通过 `VITE_API_BASE_URL` 指定后端地址。
