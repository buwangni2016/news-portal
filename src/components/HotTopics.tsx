'use client';

import { formatTimeAgo } from '@/lib/api';

interface HotTopic {
  id: string;
  title: string;
  hotScore: number;
  rank: number;
}

interface HotTopicsProps {
  topics: HotTopic[];
}

export default function HotTopics({ topics }: HotTopicsProps) {
  return (
    <div className="card-base p-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">🔥</span>
        <h3 className="font-bold text-primary">实时热榜</h3>
      </div>
      
      <div className="space-y-3">
        {topics.map((topic) => (
          <div
            key={topic.id}
            className="flex items-start gap-3 group cursor-pointer hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors"
          >
            <span className={`
              flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold
              ${topic.rank <= 3 ? 'bg-accent text-white' : 'bg-gray-100 text-gray-500'}
            `}>
              {topic.rank}
            </span>
            <div className="flex-1 min-w-0">
              <span className="text-sm text-primary group-hover:text-accent transition-colors line-clamp-2">
                {topic.title}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent/60 rounded-full transition-all duration-500"
                    style={{ width: `${topic.hotScore}%` }}
                  />
                </div>
                <span className="text-[10px] text-gray-400 font-mono">
                  {topic.hotScore}°
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}