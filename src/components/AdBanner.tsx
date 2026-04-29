'use client';

interface AdBannerProps {
  slot: string;
  size: 'banner' | 'sidebar' | 'feed' | 'article';
  className?: string;
}

/**
 * Google AdSense Integration Component
 * 
 * In production, replace the placeholder with actual AdSense code:
 * <ins class="adsbygoogle" style="display:block"
 *   data-ad-client="ca-pub-XXXXXXX"
 *   data-ad-slot="XXXXXXX"
 *   data-ad-format="auto"
 *   data-full-width-responsive="true"/>
 */
export default function AdBanner({ slot, size, className = '' }: AdBannerProps) {
  const sizeMap = {
    banner: 'h-24 w-full',
    sidebar: 'h-[600px] w-full',
    feed: 'h-40 w-full',
    article: 'h-64 w-full max-w-[300px]',
  };

  const labelMap = {
    banner: '728×90 展示广告',
    sidebar: '300×600 侧栏广告',
    feed: '原生信息流广告',
    article: '300×250 文章底部广告',
  };

  return (
    <div className={`${sizeMap[size]} ad-slot ${className}`}>
      <div className="flex flex-col items-center justify-center h-full gap-2">
        <span className="text-xs text-gray-300">📢 广告位</span>
        <span className="text-[10px] text-gray-300">{labelMap[size]}</span>
        <span className="text-[9px] text-gray-300 font-mono">Slot: {slot}</span>
        {/* 
          PRODUCTION: Replace with actual Google AdSense
          <ins className="adsbygoogle" style={{ display: 'block' }}
            data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
            data-ad-slot={slot}
            data-ad-format="auto"
            data-full-width-responsive="true" />
        */}
      </div>
    </div>
  );
}