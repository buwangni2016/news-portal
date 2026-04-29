'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CATEGORY_CONFIG, Category } from '@/types';

const categories = Object.keys(CATEGORY_CONFIG) as Category[];

export default function Navbar() {
  const pathname = usePathname();
  const currentCat = pathname === '/' ? 'all' : pathname.split('/')[1];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="container-prose">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">📰</span>
            <span className="text-lg font-bold text-primary hidden sm:block">NewsHub</span>
          </Link>
          
          {/* Category tabs */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => {
              const config = CATEGORY_CONFIG[cat];
              const isActive = currentCat === cat;
              return (
                <Link
                  key={cat}
                  href={cat === 'all' ? '/' : `/${cat}`}
                  className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
                    whitespace-nowrap transition-all duration-150
                    ${isActive
                      ? 'bg-accent text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-primary'
                    }
                  `}
                >
                  <span>{config.emoji}</span>
                  <span className="hidden sm:inline">{config.labelZh}</span>
                </Link>
              );
            })}
          </div>

          {/* Search (mobile: icon) */}
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors" title="搜索">
              <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}