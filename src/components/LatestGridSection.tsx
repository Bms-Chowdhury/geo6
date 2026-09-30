import React, { useState } from 'react';
import { Clock, ChevronRight, ChevronDown } from 'lucide-react';
import { Post, Language } from '../types';

interface LatestGridSectionProps {
  posts: Post[];
  language: Language;
  onOpenArticle: (post: Post) => void;
  onViewAll?: () => void;
}

export const LatestGridSection: React.FC<LatestGridSectionProps> = ({
  posts,
  language,
  onOpenArticle,
  onViewAll
}) => {
  const [visibleCount, setVisibleCount] = useState(6);

  if (posts.length === 0) return null;

  const displayedPosts = posts.slice(0, visibleCount);
  const hasMore = visibleCount < posts.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 4, posts.length));
  };

  const getBadgeClass = (categorySlug: string) => {
    switch (categorySlug) {
      case 'tech':
        return 'bg-blue-600 text-white';
      case 'business':
        return 'bg-emerald-600 text-white';
      case 'lifestyle':
        return 'bg-rose-500 text-white';
      case 'sports':
        return 'bg-amber-600 text-white';
      default:
        return 'bg-slate-700 text-white';
    }
  };

  return (
    <section className="mb-10">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3 mb-5 border-b-2 border-gray-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-5 bg-blue-600 rounded-full" />
          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">
            {language === 'bn' ? 'সাম্প্রতিক সংবাদ' : 'Latest Posts'}
          </h2>
        </div>

        <button
          onClick={onViewAll}
          className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
        >
          <span>{language === 'bn' ? 'সব দেখুন' : 'View All'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 2-Column Grid of News Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {displayedPosts.map((post) => (
          <article
            key={post.id}
            onClick={() => onOpenArticle(post)}
            className="group cursor-pointer bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-800 hover:border-blue-500/40 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/9] overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={post.imageUrl}
                  alt={post.altText || post.titleBn || post.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <span
                  className={`absolute top-3 left-3 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-sm ${getBadgeClass(
                    post.categorySlug
                  )}`}
                >
                  {post.categoryBn || post.category}
                </span>
              </div>

              <div className="p-4 sm:p-5">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                  {post.titleBn || post.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {post.excerptBn || post.excerpt}
                </p>
              </div>
            </div>

            <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 border-t border-gray-50 dark:border-slate-800/60 mt-auto">
              <span className="font-medium text-slate-600 dark:text-slate-300">
                {post.author.nameBn || post.author.name}
              </span>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{post.dateBn || post.date}</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Centered Load More Button */}
      {hasMore && (
        <div className="text-center mt-6">
          <button
            onClick={handleLoadMore}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow transition-all"
          >
            <span>{language === 'bn' ? 'আরও দেখুন' : 'Load More'}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
};
