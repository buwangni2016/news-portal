# NewsPortal - 资讯聚合站产品规格

## 1. Concept & Vision

**产品定位：** 面向中文互联网用户的信息流聚合平台，主打"一站看完全网热点"。

**核心价值：** 聚合微博、知乎、B站、抖音、头条等平台热搜，用 AI 自动分类+去重，呈现干净、快速、专注的阅读体验。通过信息流广告和联盟 CPS 实现盈利。

**目标用户：**
- 需要快速了解全网热点的上班族（25-40岁）
- 对科技/财经/娱乐感兴趣的年轻用户
- 内容创作者寻找选题灵感

**设计风格：** 极简新闻风格，参考 Notion + 财新，干净字体+清晰层级，无干扰阅读。

---

## 2. Design Language

### 色彩
- Primary: `#1a1a2e` (深蓝黑)
- Secondary: `#16213e` (海军蓝)
- Accent: `#e94560` (热点红，用于热榜标记)
- Background: `#f8f9fa` (浅灰白)
- Card: `#ffffff`
- Text Primary: `#1a1a2e`
- Text Secondary: `#6b7280`
- Border: `#e5e7eb`
- Hot Tag: `#e94560` + `#fff3f5`

### 字体
- 标题：`Noto Sans SC` (中文), `Inter` (英文)
- 正文：`Noto Sans SC`
- 代码/数字：`JetBrains Mono`

### 布局
- 桌面：三栏（侧边导航 + 主内容 + 右侧广告/热点）
- 移动：单栏 + 底部 tab 导航
- 间距基准：4px grid

### 动效
- 页面切换：fade 200ms
- 卡片 hover：shadow + translateY(-2px), 150ms ease
- 加载：骨架屏 shimmer

---

## 3. 信息架构

### 页面结构
```
/                     → 首页（全部热点）
/tech                → 科技
/finance             → 财经
/entertainment       → 娱乐
/social               → 社交媒体热榜
/life                 → 生活/美食/旅游
/ai                   → AI/科技前沿
/article/:id          → 文章详情（长文模式）
```

### 数据源（8个采集器）
| 平台 | 采集内容 | 更新频率 |
|------|---------|---------|
| 微博热搜 | 榜单前50 | 5分钟 |
| 知乎热榜 | 前20条 | 10分钟 |
| B站热搜 | 前30 | 10分钟 |
| 抖音热点 | 前20 | 5分钟 |
| 今日头条 | 热文推荐 | 15分钟 |
| 百度热搜 | 前30 | 5分钟 |
| 36kr | 科技新闻 | 30分钟 |
| 财联社 | 财经快讯 | 5分钟 |

---

## 4. 数据模型

```typescript
interface Article {
  id: string;              // SHA256(title+source+publishedAt)
  title: string;
  summary: string;         // AI 生成摘要，100字以内
  content: string;         // 原始内容（如果能抓到）
  url: string;
  source: string;          // weibo | zhihu | bilibili | douyin | toutiao | baidu | 36kr | cls
  author?: string;
  publishedAt: string;     // ISO timestamp
  hotScore: number;        // 热度分 0-100
  category: Category;      // tech | finance | entertainment | social | life | ai
  tags: string[];
  imageUrl?: string;       // 封面图
  readTime: number;        // 预估阅读分钟
}

type Category = 'tech' | 'finance' | 'entertainment' | 'social' | 'life' | 'ai';
```

---

## 5. 广告策略

### 广告位设计
| 位置 | 类型 | 尺寸 | 填充率目标 |
|------|------|------|-----------|
| 首页顶部 Banner | 展示广告 | 728x90 | 95% |
| 信息流第5条 | 原生信息流广告 | 同卡片 | 100% |
| 每10条插1条 | 原生广告 | 同卡片 | 100% |
| 文章详情底部 | 联盟广告 | 300x250 | 90% |
| 右侧边栏 | 展示广告 | 300x600 | 85% |
| 热榜右侧 | 热点赞助 | 文字链 | 70% |

### 广告优先级
1. Google AdSense（主力）
2. 联盟 CPS（京东/淘宝精选）
3. 品牌软广（按 CPM 卖）

---

## 6. 技术架构

### 后端：Cloudflare Worker
- 采集调度（定时触发，每天 600+ 次）
- 合并去重 API
- 搜索 API
- KV 存储（Cloudflare Workers KV）

### 前端：Next.js + Vercel
- SSG + ISR（页面静态生成，5分钟增量）
- React 18 + TypeScript
- Tailwind CSS
- 骨架屏加载优化

### 部署
- Worker → Cloudflare Workers (免费额度充足)
- 前端 → Vercel（免费）

---

## 7. 盈利模型

假设日 UV 1万：
- AdSense RPM $2 → $20/天
- 联盟 CPS 转化 0.5% → $30/天
- 合计 ~$50/天 ≈ $1500/月

目标：3个月内做到日 UV 5万