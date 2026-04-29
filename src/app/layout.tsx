import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NewsHub - 一站看完全网热点',
  description: '聚合微博、知乎、B站、抖音等平台热搜，AI智能分类，无干扰阅读体验。',
  keywords: '新闻聚合,热点,热搜,微博,知乎,B站,抖音',
  authors: [{ name: 'NewsHub' }],
  openGraph: {
    title: 'NewsHub - 一站看完全网热点',
    description: '聚合全网热点，AI智能分类，无干扰阅读',
    url: 'https://newshub.example.com',
    siteName: 'NewsHub',
    locale: 'zh_CN',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700;900&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background">
        {children}
      </body>
    </html>
  );
}