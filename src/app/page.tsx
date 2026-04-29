'use client';

import { useState, useEffect } from 'react';
import { Article } from '@/types';
import { fetchArticles, fetchHotTopics } from '@/lib/api';
import Navbar from '@/components/Navbar';
import ArticleCard from '@/components/ArticleCard';
import HotTopics from '@/components/HotTopics';
import AdBanner from '@/components/AdBanner';
import { FeedSkeleton, HotTopicsSkeleton } from '@/components/Skeleton';
import Footer from '@/components/Footer';

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [hotTopics, setHotTopics] = useState<{ id: string; title: string; hotScore: number; rank: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [articleRes, hotRes] = await Promise.all([
        fetchArticles({ category: 'all', page: 1, limit: 10 }),
        fetchHotTopics(),
      ]);
      setArticles(articleRes.articles);
      setHotTopics(hotRes);
      setTotal(articleRes.total);
      setHasMore(articleRes.articles.length < articleRes.total);
      setLoading(false);
    }
    load();
  }, []);

  async function loadMore() {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    const res = await fetchArticles({ category: 'all', page: nextPage, limit: 10 });
    setArticles(prev => [...prev, ...res.articles]);
    setPage(nextPage);
    setHasMore(articles.length + res.articles.length < res.total);
    setLoadingMore(false);
  }

  // Insert ad every 5 articles
  function renderFeedWithAds() {
    const items: React.ReactNode[] = [];
    articles.forEach((article, i) => {
      items.push(
        <ArticleCard
          key={article.id}
          article={article}
          variant="compact"
          rank={i + 1}
        />
      );
      // Insert ad every 5 articles (skip first batch)
      if ((i + 1) % 5 === 0 && i < articles.length - 1) {
        items.push(
          <div key={`ad-${i}`} className="ad-slot h-40 my-2">
            <div className="flex flex-col items-center justify-center h-full">
              <span className="text-xs text-gray-300">📢 原生广告位</span>
              <span className="text-[10px] text-gray-300">Google AdSense</span>
            </div>
          </div>
        );
      }
    });
    return items;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Ad Banner */}
      <div className="container-prose mt-4">
        <AdBanner slot="banner-top" size="banner" />
      </div>
      
      {/* Main content */}
      <main className="container-prose mt-6">
        <div className="flex gap-6">
          {/* Left: Feed */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-lg font-bold text-primary flex items-center gap-2">
                  📡 全部热点
                </h1>
                <p className="text-sm text-gray-400 mt-1">
                  共 {total} 条资讯 · 实时更新
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 text-xs rounded-full bg-accent text-white">
                  最热
                </button>
                <button className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition">
                  最新
                </button>
              </div>
            </div>

            {/* Feed */}
            {loading ? (
              <FeedSkeleton count={8} />
            ) : (
              <div className="space-y-3">
                {renderFeedWithAds()}
              </div>
            )}

            {/* Load more */}
            {hasMore && !loading && (
              <div className="mt-6 text-center">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="px-6 py-2.5 rounded-full bg-white border border-gray-200 text-sm text-gray-600
                             hover:border-accent hover:text-accent transition-all duration-200
                             disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingMore ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      加载中...
                    </span>
                  ) : (
                    '加载更多 ↓'
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Right: Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0 space-y-6">
            {loading ? <HotTopicsSkeleton /> : <HotTopics topics={hotTopics} />}
            <AdBanner slot="sidebar-right" size="sidebar" />
            
            {/* Quick stats */}
            <div className="card-base p-4">
              <h3 className="font-bold text-primary text-sm mb-3">📊 数据概览</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">{total}</div>
                  <div className="text-[10px] text-gray-400">今日资讯</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">8</div>
                  <div className="text-[10px] text-gray-400">数据源</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">5m</div>
                  <div className="text-[10px] text-gray-400">更新频率</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500">6</div>
                  <div className="text-[10px] text-gray-400">分类</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}