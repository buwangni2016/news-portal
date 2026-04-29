export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

export function ArticleSkeleton() {
  return (
    <div className="card-base p-4 animate-fade-in">
      <div className="flex items-start gap-3">
        <Skeleton className="w-6 h-6 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="w-20 h-4 rounded" />
          <Skeleton className="w-full h-5 rounded" />
          <Skeleton className="w-3/4 h-4 rounded" />
          <Skeleton className="w-1/2 h-3 rounded" />
        </div>
      </div>
    </div>
  );
}

export function FeedSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <ArticleSkeleton key={i} />
      ))}
    </div>
  );
}

export function HotTopicsSkeleton() {
  return (
    <div className="card-base p-4">
      <div className="flex items-center gap-2 mb-4">
        <Skeleton className="w-6 h-6 rounded" />
        <Skeleton className="w-24 h-5 rounded" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3">
            <Skeleton className="w-6 h-6 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-1">
              <Skeleton className="w-full h-4 rounded" />
              <Skeleton className="w-2/3 h-2 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}