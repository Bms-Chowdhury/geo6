import React from 'react';
import { Clock, ChevronRight } from 'lucide-react';
import { Post, Language } from '../types';

interface TechSpotlightSectionProps {
  posts: Post[];
  language: Language;
  onOpenArticle: (post: Post) => void;
  onViewAll?: () => void;
}

export const TechSpotlightSection: React.FC<TechSpotlightSectionProps> = ({
  posts,
  language,
  onOpenArticle,
  onViewAll
}) => {
  if (posts.length === 0) return null;

  const featured = posts[0];
  const listItems = posts.slice(1, 5);

  return (
    <section className="mb-10">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3 mb-5 border-b-2 border-gray-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-5 bg-blue-600 rounded-full" />
          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">
            {language === 'bn' ? 'প্রযুক্তি' : 'Technology'}
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

      {/* 2-Column Split: 1 Large Featured on Left, 4 Compact on Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Left: Large Featured Card */}
        {featured && (
          <div
            onClick={() => onOpenArticle(featured)}
            className="md:col-span-6 group cursor-pointer flex flex-col bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-800 hover:border-blue-500/40 shadow-sm hover:shadow-md transition-all"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src={featured.imageUrl}
                alt={featured.altText || featured.titleBn || featured.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-3 left-3 bg-blue-600 text-white text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded shadow-sm">
                {featured.categoryBn || featured.category}
              </span>
            </div>

            <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug mb-2">
                  {featured.titleBn || featured.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4">
                  {featured.excerptBn || featured.excerpt}
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-gray-100 dark:border-slate-800/80">
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {featured.author.nameBn || featured.author.name}
                </span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{featured.dateBn || featured.date}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Right: 4 Stacked List Items */}
        <div className="md:col-span-6 flex flex-col justify-between gap-3">
          {listItems.map((post) => (
            <div
              key={post.id}
              onClick={() => onOpenArticle(post)}
              className="group flex items-center gap-3.5 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:border-blue-500/40 shadow-sm hover:shadow-md transition-all cursor-pointer flex-1"
            >
              <div className="relative w-20 h-18 sm:w-22 sm:h-20 shrink-0 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={post.imageUrl}
                  alt={post.altText || post.titleBn || post.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {post.titleBn || post.title}
                </h4>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500 mt-1.5">
                  <Clock className="w-3 h-3" />
                  <span>{post.dateBn || post.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
