// News Portal Backend - Cloudflare Worker
// Hono framework + KV storage + Cron scraping

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { timing } from 'hono/timing';

// ===== Types =====
interface Article {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  author?: string;
  publishedAt: string;
  hotScore: number;
  category: string;
  tags: string[];
  imageUrl?: string;
  readTime: number;
}

interface Env {
  NEWS_KV: KVNamespace;
  TAVILY_API_KEY: string;
  BRAVE_API_KEY: string;
}

// ===== App Setup =====
const app = new Hono<{ Bindings: Env }>();

app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
}));

app.use('*', timing());

// ===== Routes =====

// Health check
app.get('/', (c) => c.json({ status: 'ok', service: 'NewsPortal API', version: '1.0.0' }));

// Get all articles (paginated)
app.get('/api/articles', async (c) => {
  const { env } = c;
  const page = parseInt(c.req.query('page') || '1');
  const limit = parseInt(c.req.query('limit') || '20');
  const category = c.req.query('category') || 'all';
  const source = c.req.query('source') || 'all';
  const sort = c.req.query('sort') || 'hot'; // hot | latest

  try {
    // Get from KV
    const raw = await env.NEWS_KV.get('articles:all');
    if (!raw) return c.json({ articles: [], total: 0, page });

    let articles: Article[] = JSON.parse(raw);

    // Filter
    if (category !== 'all') {
      articles = articles.filter(a => a.category === category);
    }
    if (source !== 'all') {
      articles = articles.filter(a => a.source === source);
    }

    // Sort
    if (sort === 'hot') {
      articles.sort((a, b) => b.hotScore - a.hotScore);
    } else {
      articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    }

    // Paginate
    const start = (page - 1) * limit;
    const end = start + limit;
    const paged = articles.slice(start, end);

    return c.json({
      articles: paged,
      total: articles.length,
      page,
      hasMore: end < articles.length,
    });
  } catch (err) {
    return c.json({ error: 'Failed to fetch articles', details: String(err) }, 500);
  }
});

// Get single article by ID
app.get('/api/articles/:id', async (c) => {
  const { env } = c;
  const id = c.req.param('id');

  try {
    const raw = await env.NEWS_KV.get(`article:${id}`);
    if (!raw) return c.json({ error: 'Article not found' }, 404);
    return c.json(JSON.parse(raw));
  } catch (err) {
    return c.json({ error: 'Failed to fetch article' }, 500);
  }
});

// Get hot topics
app.get('/api/hot', async (c) => {
  const { env } = c;
  try {
    const raw = await env.NEWS_KV.get('articles:all');
    if (!raw) return c.json([]);

    const articles: Article[] = JSON.parse(raw);
    const hot = articles
      .sort((a, b) => b.hotScore - a.hotScore)
      .slice(0, 20)
      .map((a, i) => ({
        id: a.id,
        title: a.title,
        hotScore: a.hotScore,
        rank: i + 1,
        source: a.source,
      }));

    return c.json(hot);
  } catch (err) {
    return c.json({ error: 'Failed to fetch hot topics' }, 500);
  }
});

// Get available sources and categories
app.get('/api/meta', async (c) => {
  return c.json({
    sources: [
      { id: 'weibo', name: '微博', emoji: '🔥' },
      { id: 'zhihu', name: '知乎', emoji: '💬' },
      { id: 'bilibili', name: 'B站', emoji: '📺' },
      { id: 'douyin', name: '抖音', emoji: '🎵' },
      { id: 'toutiao', name: '头条', emoji: '📰' },
      { id: 'baidu', name: '百度', emoji: '🔍' },
      { id: '36kr', name: '36氪', emoji: '🚀' },
      { id: 'cls', name: '财联社', emoji: '💹' },
    ],
    categories: [
      { id: 'all', name: '全部', emoji: '📡' },
      { id: 'tech', name: '科技', emoji: '💻' },
      { id: 'finance', name: '财经', emoji: '📈' },
      { id: 'entertainment', name: '娱乐', emoji: '🎬' },
      { id: 'social', name: '社交', emoji: '💬' },
      { id: 'life', name: '生活', emoji: '🍃' },
      { id: 'ai', name: 'AI', emoji: '🤖' },
    ],
  });
});

// Search articles
app.get('/api/search', async (c) => {
  const { env } = c;
  const q = c.req.query('q') || '';

  if (!q || q.length < 2) return c.json({ articles: [], total: 0 });

  try {
    const raw = await env.NEWS_KV.get('articles:all');
    if (!raw) return c.json({ articles: [], total: 0 });

    const articles: Article[] = JSON.parse(raw);
    const query = q.toLowerCase();
    const results = articles.filter(a =>
      a.title.toLowerCase().includes(query) ||
      a.summary.toLowerCase().includes(query) ||
      a.tags.some(t => t.toLowerCase().includes(query))
    );

    return c.json({ articles: results.slice(0, 30), total: results.length });
  } catch (err) {
    return c.json({ error: 'Search failed' }, 500);
  }
});

// ===== Cron: Scheduled Scraping =====
async function scrapeAndStore(env: Env) {
  console.log('[Cron] Starting news scrape...');

  const sources = [
    { name: 'weibo',     url: 'https://m.weibo.cn/api/container/getIndex?containerid=106003type%3D25%26t%3D3%26disable_hot%3D1%26filter_type%3Drealtimehot' },
    { name: 'zhihu',     url: 'https://www.zhihu.com/api/v3/feed/topstory/hot-lists/total?limit=50' },
    { name: 'bilibili',  url: 'https://api.bilibili.com/x/web-interface/search/square?limit=50' },
    { name: 'toutiao',   url: 'https://www.toutiao.com/hot-event/hot-board/?origin=toutiao_pc' },
    { name: 'douyin',    url: 'https://www.douyin.com/aweme/v1/web/challenge/detail/?ch_id=0' },
    { name: 'baidu',     url: 'https://top.baidu.com/board?tab=realtime' },
    { name: '36kr',      url: 'https://36kr.com/feed' },
    { name: 'cls',       url: 'https://www.cls.cn/telegraph' },
  ];

  const allArticles: Article[] = [];

  for (const source of sources) {
    try {
      const resp = await fetch(source.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json, text/html, */*',
          'Accept-Language': 'zh-CN,zh;q=0.9',
        },
        signal: AbortSignal.timeout(10000),
      });

      if (!resp.ok) {
        console.warn(`[Scrape] ${source.name} returned ${resp.status}`);
        continue;
      }

      const contentType = resp.headers.get('content-type') || '';
      let items: Article[] = [];

      if (contentType.includes('json')) {
        items = parseJsonSource(source.name, await resp.json());
      } else {
        items = parseHtmlSource(source.name, await resp.text());
      }

      allArticles.push(...items);
      console.log(`[Scrape] ${source.name}: ${items.length} articles`);
    } catch (err) {
      console.error(`[Scrape] ${source.name} failed:`, err);
    }
  }

  // Dedup by title similarity
  const deduped = deduplicate(allArticles);
  console.log(`[Scrape] Total: ${allArticles.length}, After dedup: ${deduped.length}`);

  // Store in KV
  await env.NEWS_KV.put('articles:all', JSON.stringify(deduped));
  for (const article of deduped) {
    await env.NEWS_KV.put(`article:${article.id}`, JSON.stringify(article));
  }

  console.log(`[Cron] Done. Stored ${deduped.length} articles.`);
  return deduped.length;
}

// ===== Parsers =====
function parseJsonSource(source: string, data: any): Article[] {
  const articles: Article[] = [];

  try {
    switch (source) {
      case 'weibo': {
        const cards = data?.data?.cards || [];
        for (const card of cards) {
          if (card.card_group) {
            for (const item of card.card_group) {
              if (item.desc) {
                articles.push(createArticle({
                  title: item.desc,
                  summary: item.desc,
                  url: `https://s.weibo.com/weibo?q=${encodeURIComponent(item.desc)}`,
                  source: 'weibo',
                  hotScore: Math.min(100, Math.floor((item.desc_extr?.hot_value || 50) / 1000000) + 50),
                }));
              }
            }
          }
        }
        break;
      }
      case 'zhihu': {
        const items = data?.data || [];
        for (const item of items) {
          const target = item.target || item;
          if (target.title) {
            articles.push(createArticle({
              title: target.title,
              summary: target.excerpt || target.title,
              url: target.url || `https://www.zhihu.com/question/${target.id}`,
              source: 'zhihu',
              hotScore: Math.min(100, Math.floor((item.detail_text || 50) / 100) + 40),
            }));
          }
        }
        break;
      }
      case 'toutiao': {
        const items = data?.data || [];
        for (const item of items) {
          if (item.Title) {
            articles.push(createArticle({
              title: item.Title,
              summary: item.Abstract || item.Title,
              url: item.Url || `https://www.toutiao.com`,
              source: 'toutiao',
              hotScore: Math.min(100, Math.floor((item.HotValue || 50) / 100000) + 40),
            }));
          }
        }
        break;
      }
    }
  } catch (err) {
    console.error(`[Parse] ${source} JSON parse error:`, err);
  }

  return articles;
}

function parseHtmlSource(source: string, html: string): Article[] {
  const articles: Article[] = [];

  try {
    switch (source) {
      case 'baidu': {
        // Parse Baidu hot search HTML
        const titleRegex = /class="c-title-text"[^>]*>([^<]+)/g;
        let match;
        let rank = 0;
        while ((match = titleRegex.exec(html)) !== null) {
          rank++;
          articles.push(createArticle({
            title: match[1].trim(),
            summary: match[1].trim(),
            url: `https://www.baidu.com/s?wd=${encodeURIComponent(match[1].trim())}`,
            source: 'baidu',
            hotScore: Math.max(50, 100 - rank * 3),
          }));
        }
        break;
      }
    }
  } catch (err) {
    console.error(`[Parse] ${source} HTML parse error:`, err);
  }

  return articles;
}

// ===== Utility =====
function createArticle(opts: Partial<Article> & { title: string; source: string }): Article {
  const title = opts.title || '';
  const hash = simpleHash(title + opts.source);

  return {
    id: hash,
    title: title.length > 100 ? title.slice(0, 100) + '...' : title,
    summary: opts.summary || title,
    url: opts.url || '#',
    source: opts.source,
    author: opts.author,
    publishedAt: opts.publishedAt || new Date().toISOString(),
    hotScore: opts.hotScore || 50,
    category: categorize(title, opts.source),
    tags: extractTags(title),
    imageUrl: opts.imageUrl,
    readTime: Math.max(1, Math.ceil(title.length / 50)),
  };
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

function categorize(title: string, source: string): string {
  const techKeywords = ['AI', '芯片', '手机', '科技', '苹果', '小米', '华为', '自动驾驶', '机器人', '编程', '算法', '模型'];
  const financeKeywords = ['股票', 'A股', '美股', '比特币', '央行', '降息', '融资', 'IPO', '市值', '财经', '金融'];
  const entertainmentKeywords = ['电影', '电视剧', '明星', '综艺', '音乐', '游戏', 'UP主', '直播'];
  const aiKeywords = ['AI', 'GPT', '大模型', '人工智能', '深度学习', '机器学习', 'OpenAI', 'DeepSeek'];

  if (aiKeywords.some(k => title.includes(k))) return 'ai';
  if (techKeywords.some(k => title.includes(k))) return 'tech';
  if (financeKeywords.some(k => title.includes(k))) return 'finance';
  if (entertainmentKeywords.some(k => title.includes(k))) return 'entertainment';
  if (source === 'weibo' || source === 'zhihu') return 'social';
  return 'life';
}

function extractTags(title: string): string[] {
  const commonTags = ['AI', 'GPT', '芯片', '手机', '股票', '电影', '科技', '小米', '华为', '苹果', 'OpenAI', '新能源', '比特币', '周杰伦', '抖音'];
  return commonTags.filter(tag => title.includes(tag));
}

function deduplicate(articles: Article[]): Article[] {
  const seen = new Set<string>();
  return articles.filter(a => {
    // Dedup by normalized title
    const key = a.title.replace(/[《》「」【】，。！？、\s]/g, '').toLowerCase().slice(0, 30);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ===== Export =====
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return app.fetch(request, env, ctx);
  },

  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(scrapeAndStore(env));
  },
} as ExportedHandler<Env>;