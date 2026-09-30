import React from 'react';
import { Clock, ChevronRight } from 'lucide-react';
import { Post, Language } from '../types';

interface GadgetsShowcaseSectionProps {
  posts: Post[];
  language: Language;
  onOpenArticle: (post: Post) => void;
  onViewAll?: () => void;
}

export const GadgetsShowcaseSection: React.FC<GadgetsShowcaseSectionProps> = ({
  posts,
  language,
  onOpenArticle,
  onViewAll
}) => {
  if (posts.length === 0) return null;

  const bannerPost = posts[0];
  const gridPosts = posts.slice(1, 5);

  return (
    <section className="mb-10">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3 mb-5 border-b-2 border-gray-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-5 bg-blue-600 rounded-full" />
          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">
            {language === 'bn' ? 'গ্যাজেটস ও দৈনন্দিন প্রযুক্তি' : 'Gadgets'}
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

      {/* 1. Full-Width Top Feature Banner Card */}
      {bannerPost && (
        <div
          onClick={() => onOpenArticle(bannerPost)}
          className="group relative h-60 sm:h-72 rounded-2xl overflow-hidden cursor-pointer shadow-md bg-slate-950 border border-gray-200 dark:border-slate-800 hover:border-blue-500/50 transition-all mb-5"
        >
          <img
            src={bannerPost.imageUrl}
            alt={bannerPost.altText || bannerPost.titleBn || bannerPost.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent" />

          <div className="absolute top-3.5 left-3.5 z-10">
            <span className="bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded shadow-sm">
              {bannerPost.categoryBn || bannerPost.category}
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 z-10">
            <h3 className="text-base sm:text-xl font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-2 leading-snug mb-2">
              {bannerPost.titleBn || bannerPost.title}
            </h3>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <span className="font-semibold text-white">
                {bannerPost.author.nameBn || bannerPost.author.name}
              </span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{bannerPost.dateBn || bannerPost.date}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. 4 Cards in 2x2 Grid Below */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {gridPosts.map((post) => (
          <div
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
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="p-4">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                  {post.titleBn || post.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {post.excerptBn || post.excerpt}
                </p>
              </div>
            </div>

            <div className="px-4 pb-4 pt-0 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 border-t border-gray-50 dark:border-slate-800/60 mt-auto">
              <span>{post.author.nameBn || post.author.name}</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{post.dateBn || post.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
