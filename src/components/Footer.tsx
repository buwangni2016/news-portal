'use client';

import { CATEGORY_CONFIG } from '@/types';

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white mt-16">
      <div className="container-prose py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">📰</span>
              <span className="text-lg font-bold text-primary">NewsHub</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              聚合全网热点，AI 智能分类<br />
              一站看完全网资讯
            </p>
          </div>
          
          {/* Categories */}
          <div className="col-span-1">
            <h4 className="text-sm font-semibold text-primary mb-3">资讯分类</h4>
            <div className="flex flex-col gap-2">
              {Object.values(CATEGORY_CONFIG).map((cat) => (
                <a key={cat.label} href={`/${cat.label === 'all' ? '' : cat.label}`}
                   className="text-sm text-gray-500 hover:text-accent transition-colors">
                  {cat.emoji} {cat.labelZh}
                </a>
              ))}
            </div>
          </div>
          
          {/* Data Sources */}
          <div className="col-span-1">
            <h4 className="text-sm font-semibold text-primary mb-3">数据来源</h4>
            <div className="grid grid-cols-2 gap-2">
              {['微博', '知乎', 'B站', '抖音', '头条', '百度', '36氪', '财联社'].map((s) => (
                <span key={s} className="text-sm text-gray-500">{s}</span>
              ))}
            </div>
          </div>
          
          {/* About */}
          <div className="col-span-1">
            <h4 className="text-sm font-semibold text-primary mb-3">关于</h4>
            <div className="flex flex-col gap-2 text-sm text-gray-500">
              <a href="#" className="hover:text-accent transition-colors">关于我们</a>
              <a href="#" className="hover:text-accent transition-colors">广告合作</a>
              <a href="#" className="hover:text-accent transition-colors">数据声明</a>
              <a href="#" className="hover:text-accent transition-colors">联系方式</a>
            </div>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-400">
            © 2026 NewsHub. 数据来源为各平台公开信息，仅供参考。
          </p>
          <p className="text-xs text-gray-400">
            Built with ❤️ using Next.js + Cloudflare Workers
          </p>
        </div>
      </div>
    </footer>
  );
}