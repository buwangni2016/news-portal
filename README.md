# 📰 NewsHub - 资讯聚合站

> 一站看完全网热点 | 聚合 · 去重 · AI 分类 · 广告盈利

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4)](https://tailwindcss.com/)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F6821F)](https://workers.cloudflare.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

## 🎯 产品定位

中文互联网资讯聚合平台，实时抓取 8 大平台热搜/资讯：
- 🔥 微博热搜
- 💬 知乎热榜
- 📺 B站热搜
- 🎵 抖音热点
- 📰 今日头条
- 🔍 百度热搜
- 🚀 36氪科技
- 💹 财联社快讯

通过 AI 自动分类 + 去重 + 摘要，呈现干净、快速、专注的阅读体验。

---

## 🏗️ 架构设计

```
news-portal/
├── src/
│   ├── app/                    # Next.js App Router 页面
│   │   ├── page.tsx           # 首页（聚合热点流）
│   │   ├── [category]/        # 分类页（科技/财经/娱乐/AI/社交/生活）
│   │   └── article/[id]/      # 文章详情页
│   ├── components/            # React 组件
│   │   ├── Navbar.tsx         # 导航栏
│   │   ├── ArticleCard.tsx    # 文章卡片（3种样式）
│   │   ├── HotTopics.tsx      # 热榜侧边栏
│   │   ├── AdBanner.tsx       # Google AdSense 广告组件
│   │   ├── Skeleton.tsx       # 骨架屏加载
│   │   └── Footer.tsx         # 页脚
│   ├── lib/                   # 工具库
│   │   ├── api.ts             # API 客户端
│   │   └── mockData.ts        # 模拟数据（Demo）
│   └── types/
│       └── index.ts           # TypeScript 类型定义
├── SPEC.md                    # 产品规格文档
└── package.json               # 项目配置
```

### 技术栈

| 层级 | 技术 | 用途 |
|------|------|------|
| 前端 | Next.js 14 + TypeScript | SSR/SSG/ISR 渲染 |
| 样式 | Tailwind CSS | 响应式 UI |
| 后端 | Cloudflare Workers | 采集调度 + API 服务 |
| 存储 | Cloudflare KV | 新闻缓存 |
| 广告 | Google AdSense | 流量变现 |
| 搜索 | Tavily / Brave Search | 资讯爬取 |

---

## 🚀 快速开始

```bash
# 克隆仓库
git clone https://github.com/buwangni2016/news-portal.git
cd news-portal

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 填入你的 API Key

# 启动开发服务器
npm run dev
# → http://localhost:3000

# 构建生产版本
npm run build
npm start
```

---

## 💰 广告盈利模式

| 广告位 | 类型 | 位置 | 目标填充率 |
|--------|------|------|-----------|
| 首页顶部 Banner | 展示广告 | 728×90 | 95% |
| 信息流每5条 | 原生广告 | 同卡片 | 100% |
| 侧边栏 | 展示广告 | 300×600 | 85% |
| 文章详情底部 | 联盟广告 | 300×250 | 90% |

### Google AdSense 集成

1. 在 [Google AdSense](https://www.google.com/adsense/) 注册账号
2. 将 `ca-pub-XXXXXXXXXXXXXXXX` 写入 `.env.local`
3. `AdBanner` 组件自动处理广告位

---

## 📊 部署指南

### 前端 → Vercel（免费）

```bash
npm i -g vercel
vercel login
vercel --prod
```

### 后端 → Cloudflare Workers（免费）

```bash
cd backend
npm install
npx wrangler login
npx wrangler deploy
```

### GitHub Actions 定时采集

项目配置了 `.github/workflows/scrape.yml`，每天自动运行采集任务。

---

## 🔑 数据源配置

### Tavily AI Search（推荐）

1. 注册 [Tavily](https://tavily.com/)
2. 获取 API Key
3. 配置到 `.env.local`

### Brave Search

1. 注册 [Brave Search](https://brave.com/search/)
2. 获取 API Key
3. 配置到 `.env.local`

---

## 📈 盈利模型预估

假设日 UV 1 万：
- **AdSense**：RPM $2 → **$20/天**
- **联盟 CPS**：转化 0.5% → **$30/天**
- **合计**：~**$50/天 ≈ ¥350/天 ≈ ¥10,500/月**

目标：3 个月内做到日 UV 5 万

---

## 📄 License

MIT License - 自由使用和修改