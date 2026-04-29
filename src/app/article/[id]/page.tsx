'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Article, SOURCE_CONFIG, CATEGORY_CONFIG } from '@/types';
import { fetchArticleById, formatTimeAgo } from '@/lib/api';
import Navbar from '@/components/Navbar';
import AdBanner from '@/components/AdBanner';
import { ArticleSkeleton } from '@/components/Skeleton';
import Footer from '@/components/Footer';

export default function ArticleDetailPage() {
  const params = useParams();
  const articleId = params?.id as string;
  
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await fetchArticleById(articleId);
        if (data) {
          setArticle(data);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      }
      setLoading(false);
    }
    load();
  }, [articleId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container-prose mt-8">
          <div className="max-w-3xl mx-auto">
            <ArticleSkeleton />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container-prose mt-16">
          <div className="max-w-xl mx-auto text-center">
            <span className="text-6xl block mb-4">🔍</span>
            <h1 className="text-2xl font-bold text-primary mb-2">文章未找到</h1>
            <p className="text-gray-500">该文章可能已被删除或链接无效</p>
            <a href="/" className="mt-4 inline-block text-accent hover:underline">← 返回首页</a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const sourceConfig = SOURCE_CONFIG[article.source] || { emoji: '📰', labelZh: article.source };
  const catConfig = CATEGORY_CONFIG[article.category] || CATEGORY_CONFIG.all;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container-prose mt-8 mb-16">
        <article className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <a href="/" className="hover:text-accent transition-colors">首页</a>
            <span>/</span>
            <a href={`/${article.category}`} className="hover:text-accent transition-colors">
              {catConfig.emoji} {catConfig.labelZh}
            </a>
            <span>/</span>
            <span className="text-gray-600">详情</span>
          </nav>
          
          {/* Article header */}
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="tag-base" style={{
                backgroundColor: SOURCE_CONFIG[article.source]?.color + '15',
                color: SOURCE_CONFIG[article.source]?.color,
              }}>
                {sourceConfig.emoji} {sourceConfig.labelZh}
              </span>
              <span className="tag-base" style={{
                backgroundColor: catConfig.color + '15',
                color: catConfig.color,
              }}>
                {catConfig.labelZh}
              </span>
              {article.hotScore >= 90 && (
                <span className="tag-base hot-badge">🔥 热门</span>
              )}
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-bold text-primary leading-tight mb-4">
              {article.title}
            </h1>
            
            <div className="flex items-center gap-4 text-sm text-gray-400">
              {article.author && <span>✍️ {article.author}</span>}
              <span>🕐 {formatTimeAgo(article.publishedAt)}</span>
              <span>🔥 热度 {article.hotScore}</span>
              <span>📖 {article.readTime} 分钟阅读</span>
            </div>
          </header>
          
          {/* Ad: top of article */}
          <AdBanner slot="article-top" size="article" className="mx-auto my-6" />
          
          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              {article.summary}
            </p>
            <p className="text-gray-500 leading-relaxed mb-6">
              {article.summary}{' '}
              <a href={article.url} target="_blank" rel="noopener noreferrer" 
                 className="text-accent hover:underline">
                阅读原文 →
              </a>
            </p>
          </div>
          
          {/* Tags */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h4 className="text-sm font-medium text-gray-600 mb-3">🏷️ 标签</h4>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-600 hover:bg-accent/10 hover:text-accent cursor-pointer transition-colors">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
          
          {/* Ad: bottom of article */}
          <div className="mt-8">
            <AdBanner slot="article-bottom" size="article" className="mx-auto" />
          </div>
          
          {/* Source info */}
          <div className="mt-8 p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                <span>数据来源：{sourceConfig.labelZh}</span>
                <span className="mx-2">·</span>
                <span>如需完整内容请访问原文</span>
              </div>
              <a href={article.url} target="_blank" rel="noopener noreferrer"
                 className="text-sm text-accent hover:underline font-medium">
                访问原文 →
              </a>
            </div>
          </div>
        </article>
      </main>
      
      <Footer />
    </div>
  );
}