# 📰 NewsHub - 资讯聚合站

> 一站看完全网热点 | 聚合 · 去重 · AI 分类 · 广告盈利

---

## 🚀 快速部署（推荐）

### 方式一：Vercel 前端一键部署（免费）

1. 打开 [vercel.com](https://vercel.com) 并用 GitHub 登录
2. 点击 "New Project" → 导入 `buwangni2016/news-portal`
3. 点击 "Deploy" 即可！

> 首次部署后，每次 push 代码会自动部署

### 方式二：本地部署开发

```bash
# 克隆
git clone https://github.com/buwangni2016/news-portal.git
cd news-portal

# 安装
npm install

# 开发
npm run dev
# → http://localhost:3000

# 构建生产
npm run build
npm start
```

### 方式三：Vercel CLI 部署

```bash
npm i -g vercel
vercel login
cd news-portal
vercel --prod
```

---

## ☁️ 后端部署（可选）

需要新闻自动采集功能才需要部署后端。

```bash
cd backend

# 安装 wrangler
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 创建 KV 存储
wrangler kv:namespace create NEWS_KV

# 填入 wrangler.toml 的 id

# 部署
wrangler deploy
```

---

## 📋 配置广告

1. 注册 [Google AdSense](https://www.google.com/adsense/)
2. 获取 `ca-pub-XXXXXXXXXXXXXXXX`
3. 在 `.env.local` 填入：
   ```
   NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-你的ID
   ```

---

## 📊 盈利预估

| 日 UV | 月收入 |
|-------|-------|
| 1,000 | ¥300 |
| 10,000 | ¥3,000 |
| 50,000 | ¥15,000 |

---

## 📁 项目结构

```
news-portal/
├── src/
│   ├── app/           # Next.js 页面
│   ├── components/    # React 组件
│   ├── lib/          # API + Mock数据
│   └── types/        # TypeScript 类型
├── backend/          # Cloudflare Worker
└── .github/workflows/  # 自动部署
```

---

## License

MIT