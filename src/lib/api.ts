import { Article, Category } from '@/types';
import { MOCK_ARTICLES, HOT_TOPICS, getArticlesByCategory } from './mockData';

// ===== API Client =====
// In production, these call the Cloudflare Worker API
// For demo, we use mock data

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export async function fetchArticles(options?: {
  category?: Category;
  page?: number;
  limit?: number;
  search?: string;
}): Promise<{ articles: Article[]; total: number; page: number }> {
  // Simulate network delay for demo
  await new Promise(r => setTimeout(r, 300));
  
  const { category = 'all', page = 1, limit = 10, search = '' } = options || {};
  
  let filtered = category === 'all' ? [...MOCK_ARTICLES] : MOCK_ARTICLES.filter(a => a.category === category);
  
  // Search filter
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(a => 
      a.title.toLowerCase().includes(q) || 
      a.summary.toLowerCase().includes(q) ||
      a.tags.some(t => t.toLowerCase().includes(q))
    );
  }
  
  // Sort by hotScore descending, then by date
  filtered.sort((a, b) => {
    if (b.hotScore !== a.hotScore) return b.hotScore - a.hotScore;
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });
  
  const start = (page - 1) * limit;
  const end = start + limit;
  
  return {
    articles: filtered.slice(start, end),
    total: filtered.length,
    page,
  };
}

export async function fetchArticleById(id: string): Promise<Article | null> {
  await new Promise(r => setTimeout(r, 200));
  return MOCK_ARTICLES.find(a => a.id === id) || null;
}

export async function fetchHotTopics(): Promise<{ id: string; title: string; hotScore: number; rank: number }[]> {
  await new Promise(r => setTimeout(r, 200));
  return HOT_TOPICS;
}

export function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  return new Date(dateStr).toLocaleDateString('zh-CN');
}

export function formatHotScore(score: number): string {
  if (score >= 95) return '🔥🔥🔥';
  if (score >= 85) return '🔥🔥';
  if (score >= 75) return '🔥';
  return '';
}