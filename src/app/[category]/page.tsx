'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Article, Category, CATEGORY_CONFIG } from '@/types';
import { fetchArticles, fetchHotTopics } from '@/lib/api';
import Navbar from '@/components/Navbar';
import ArticleCard from '@/components/ArticleCard';
import HotTopics from '@/components/HotTopics';
import AdBanner from '@/components/AdBanner';
import { FeedSkeleton, HotTopicsSkeleton } from '@/components/Skeleton';
import Footer from '@/components/Footer';

export default function CategoryPage() {
  const params = useParams();
  const category = (params?.category as string) || 'all';
  const catConfig = CATEGORY_CONFIG[category as Category] || CATEGORY_CONFIG.all;
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [hotTopics, setHotTopics] = useState<{ id: string; title: string; hotScore: number; rank: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [articleRes, hotRes] = await Promise.all([
        fetchArticles({ category: category as Category, page: 1, limit: 10 }),
        fetchHotTopics(),
      ]);
      setArticles(articleRes.articles);
      setHotTopics(hotRes);
      setTotal(articleRes.total);
      setHasMore(articleRes.articles.length < articleRes.total);
      setLoading(false);
    }
    load();
    setPage(1);
  }, [category]);

  async function loadMore() {
    if (!hasMore) return;
    const nextPage = page + 1;
    const res = await fetchArticles({ category: category as Category, page: nextPage, limit: 10 });
    setArticles(prev => [...prev, ...res.articles]);
    setPage(nextPage);
    setHasMore(articles.length + res.articles.length < res.total);
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Category header */}
      <div className="border-b border-gray-100 bg-white">
        <div className="container-prose py-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{catConfig.emoji}</span>
            <div>
              <h1 className="text-2xl font-bold text-primary">{catConfig.labelZh}</h1>
              <p className="text-sm text-gray-400 mt-0.5">
                {catConfig.emoji} 全网{catConfig.labelZh}资讯 · 聚合 · 去重 · AI分类
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <AdBanner slot="banner-category" size="banner" className="container-prose mt-4" />
      
      <main className="container-prose mt-6">
        <div className="flex gap-6">
          {/* Feed */}
          <div className="flex-1 min-w-0">
            <div className="mb-4">
              <p className="text-sm text-gray-400">
                共 {total} 条{catConfig.labelZh}资讯 · 按热度排序
              </p>
            </div>
            
            {loading ? (
              <FeedSkeleton count={8} />
            ) : articles.length === 0 ? (
              <div className="card-base p-12 text-center">
                <span className="text-4xl block mb-4">{catConfig.emoji}</span>
                <h3 className="text-lg font-medium text-gray-600">暂无{catConfig.labelZh}资讯</h3>
                <p className="text-sm text-gray-400 mt-2">请稍后刷新</p>
              </div>
            ) : (
              <div className="space-y-3">
                {articles.map((article, i) => (
                  <ArticleCard key={article.id} article={article} variant="compact" rank={i + 1} />
                ))}
              </div>
            )}

            {hasMore && !loading && (
              <div className="mt-6 text-center">
                <button
                  onClick={loadMore}
                  className="px-6 py-2.5 rounded-full bg-white border border-gray-200 text-sm text-gray-600
                             hover:border-accent hover:text-accent transition-all"
                >
                  加载更多 ↓
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0 space-y-6">
            {loading ? <HotTopicsSkeleton /> : <HotTopics topics={hotTopics} />}
            <AdBanner slot="sidebar-category" size="sidebar" />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}