export type Category = 'tech' | 'finance' | 'entertainment' | 'social' | 'life' | 'ai' | 'all';

export interface Article {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: Source;
  author?: string;
  publishedAt: string;
  hotScore: number;
  category: Category;
  tags: string[];
  imageUrl?: string;
  readTime: number;
}

export type Source = 'weibo' | 'zhihu' | 'bilibili' | 'douyin' | 'toutiao' | 'baidu' | '36kr' | 'cls' | 'sina' | 'tencent';

export const SOURCE_CONFIG: Record<Source, { label: string; labelZh: string; emoji: string; color: string; baseUrl: string }> = {
  weibo:     { label: 'weibo',     labelZh: '微博',     emoji: '🔥', color: '#ff8200' },
  zhihu:     { label: 'zhihu',     labelZh: '知乎',     emoji: '💬', color: '#0066cc' },
  bilibili:  { label: 'bilibili',  labelZh: 'B站',      emoji: '📺', color: '#fb7299' },
  douyin:    { label: 'douyin',    labelZh: '抖音',     emoji: '🎵', color: '#000000' },
  toutiao:   { label: 'toutiao',   labelZh: '头条',     emoji: '📰', color: '#f85959' },
  baidu:     { label: 'baidu',     labelZh: '百度',     emoji: '🔍', color: '#2932e1' },
  '36kr':    { label: '36kr',      labelZh: '36氪',     emoji: '🚀', color: '#f44a3a' },
  cls:       { label: 'cls',       labelZh: '财联社',   emoji: '💹', color: '#00a870' },
  sina:      { label: 'sina',      labelZh: '新浪',     emoji: '🌐', color: '#e6162d' },
  tencent:   { label: 'tencent',   labelZh: '腾讯',     emoji: '🐧', color: '#12b7f5' },
};

export const CATEGORY_CONFIG: Record<Category, { label: string; labelZh: string; emoji: string; color: string }> = {
  all:          { label: 'all',          labelZh: '全部',        emoji: '📡', color: '#6b7280' },
  tech:         { label: 'tech',         labelZh: '科技',        emoji: '💻', color: '#3b82f6' },
  finance:      { label: 'finance',      labelZh: '财经',        emoji: '📈', color: '#10b981' },
  entertainment:{ label: 'entertainment',labelZh: '娱乐',        emoji: '🎬', color: '#f59e0b' },
  social:       { label: 'social',       labelZh: '社交',        emoji: '💬', color: '#8b5cf6' },
  life:         { label: 'life',         labelZh: '生活',        emoji: '🍃', color: '#22c55e' },
  ai:           { label: 'ai',           labelZh: 'AI',         emoji: '🤖', color: '#ec4899' },
};

export const AD_SLOTS = {
  banner: { id: 'banner-top', size: '728x90', placement: 'after-nav' },
  feed:   { id: 'feed-ad',   size: 'native',  placement: 'every-5' },
  sidebar:{ id: 'sidebar',   size: '300x600', placement: 'right-rail' },
  article:{ id: 'article-bottom', size: '300x250', placement: 'below-content' },
};