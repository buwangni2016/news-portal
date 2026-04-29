'use client';

import { Article, SOURCE_CONFIG, CATEGORY_CONFIG } from '@/types';
import { formatTimeAgo, formatHotScore } from '@/lib/api';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'compact' | 'featured';
  rank?: number;
}

export default function ArticleCard({ article, variant = 'default', rank }: ArticleCardProps) {
  const sourceConfig = SOURCE_CONFIG[article.source] || { emoji: '📰', labelZh: article.source, color: '#666' };
  const catConfig = CATEGORY_CONFIG[article.category] || { emoji: '📋', labelZh: article.category, color: '#666' };

  // Featured card (hero)
  if (variant === 'featured') {
    return (
      <a href={article.url} target="_blank" rel="noopener noreferrer"
         className="card-base p-6 group animate-fade-in block relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-bl-full" />
        
        {/* Rank badge */}
        {rank && rank <= 3 && (
          <div className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center rounded-full
                          bg-accent text-white text-sm font-bold shadow-lg">
            {rank}
          </div>
        )}
        
        <div className="flex items-center gap-2 mb-3">
          <span className="tag-base" style={{ backgroundColor: sourceConfig.color + '15', color: sourceConfig.color }}>
            {sourceConfig.emoji} {sourceConfig.labelZh}
          </span>
          <span className="tag-base" style={{ backgroundColor: catConfig.color + '15', color: catConfig.color }}>
            {catConfig.emoji} {catConfig.labelZh}
          </span>
          {article.hotScore >= 90 && (
            <span className="tag-base hot-badge">
              {formatHotScore(article.hotScore)} 热
            </span>
          )}
        </div>
        
        <h2 className="text-xl font-bold text-primary group-hover:text-accent transition-colors mb-2 line-clamp-2">
          {article.title}
        </h2>
        
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">
          {article.summary}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-3">
            {article.author && <span>✍️ {article.author}</span>}
            <span>🕐 {formatTimeAgo(article.publishedAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🔥 {article.hotScore}</span>
            <span>📖 {article.readTime}min</span>
          </div>
        </div>
      </a>
    );
  }

  // Compact card (feed)
  return (
    <a href={article.url} target="_blank" rel="noopener noreferrer"
       className="card-base p-4 group animate-fade-in block">
      <div className="flex items-start gap-3">
        {/* Rank number */}
        {rank && rank <= 10 && (
          <span className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold
            ${rank <= 3 ? 'bg-accent text-white' : 'bg-gray-100 text-gray-500'}`}>
            {rank}
          </span>
        )}
        
        <div className="flex-1 min-w-0">
          {/* Tags */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="tag-base text-[10px]" style={{ backgroundColor: sourceConfig.color + '15', color: sourceConfig.color }}>
              {sourceConfig.emoji} {sourceConfig.labelZh}
            </span>
            {article.hotScore >= 85 && (
              <span className="tag-base hot-badge text-[10px]">🔥 热</span>
            )}
          </div>
          
          {/* Title */}
          <h3 className="text-sm font-medium text-primary group-hover:text-accent transition-colors line-clamp-2 mb-1.5">
            {article.title}
          </h3>
          
          {/* Summary */}
          <p className="text-xs text-gray-400 line-clamp-1 mb-2">
            {article.summary}
          </p>
          
          {/* Meta */}
          <div className="flex items-center gap-3 text-[11px] text-gray-400">
            <span>🕐 {formatTimeAgo(article.publishedAt)}</span>
            <span>🔥 {article.hotScore}</span>
            {article.author && <span>{article.author}</span>}
          </div>
        </div>
      </div>
    </a>
  );
}