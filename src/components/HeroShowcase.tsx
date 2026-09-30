import React from 'react';
import { Clock, Eye, Bookmark, TrendingUp } from 'lucide-react';
import { Post, Language } from '../types';

interface HeroShowcaseProps {
  posts: Post[];
  language: Language;
  onOpenArticle: (post: Post) => void;
  savedPostIds: string[];
  onToggleSave: (postId: string, e: React.MouseEvent) => void;
}

export const HeroShowcase: React.FC<HeroShowcaseProps> = ({
  posts,
  language,
  onOpenArticle,
  savedPostIds,
  onToggleSave
}) => {
  if (posts.length === 0) return null;

  const mainFeatured = posts[0];
  const dockFeatured = posts.slice(1, 4);

  return (
    <section className="mb-8 space-y-3.5">
      {/* 1. Main Dominant Hero Banner */}
      <div
        onClick={() => onOpenArticle(mainFeatured)}
        className="group relative h-[360px] sm:h-[440px] md:h-[480px] rounded-2xl overflow-hidden cursor-pointer shadow-xl bg-slate-950 border border-gray-200 dark:border-slate-800 transition-all"
      >
        <img
          src={mainFeatured.imageUrl}
          alt={mainFeatured.altText || mainFeatured.titleBn || mainFeatured.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
          referrerPolicy="no-referrer"
          fetchPriority="high"
          decoding="async"
        />

        {/* Ambient Vignette & Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

        {/* Top Floating Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="bg-blue-600 text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-md shadow-md">
              {mainFeatured.categoryBn || mainFeatured.category}
            </span>
            <span className="bg-amber-500/95 text-slate-950 text-xs font-extrabold px-2.5 py-1 rounded-md flex items-center gap-1 shadow-md">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>শীর্ষ খবর</span>
            </span>
          </div>

          <button
            onClick={(e) => onToggleSave(mainFeatured.id, e)}
            className={`p-2 rounded-full backdrop-blur-md transition-colors ${
              savedPostIds.includes(mainFeatured.id)
                ? 'bg-blue-600 text-white'
                : 'bg-black/50 text-white hover:bg-blue-600'
            }`}
            title="সংরক্ষণ করুন"
            aria-label="সংরক্ষণ করুন"
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>
        </div>

        {/* Bottom Hero Headline & Author Meta */}
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 z-10 max-w-4xl">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-3 group-hover:text-blue-400 transition-colors drop-shadow-md">
            {mainFeatured.titleBn || mainFeatured.title}
          </h1>

          <p className="text-slate-200 text-xs sm:text-sm line-clamp-2 mb-4 font-normal max-w-2xl leading-relaxed">
            {mainFeatured.excerptBn || mainFeatured.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <img
                src={mainFeatured.author.avatar}
                alt={mainFeatured.author.nameBn || mainFeatured.author.name}
                loading="eager"
                decoding="async"
                className="w-6 h-6 rounded-full border border-white/40 object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="font-semibold text-white">
                {mainFeatured.author.nameBn || mainFeatured.author.name}
              </span>
            </div>

            <span className="text-slate-400">•</span>

            <div className="flex items-center gap-1 text-slate-300">
              <Clock className="w-3.5 h-3.5" />
              <span>{mainFeatured.dateBn || mainFeatured.date}</span>
            </div>

            <span className="text-slate-400">•</span>

            <div className="flex items-center gap-1 text-slate-300">
              <Eye className="w-3.5 h-3.5" />
              <span>{mainFeatured.views.toLocaleString()} বার পঠিত</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 3-Card Docked Preview Strip (Directly Below Hero Banner) */}
      {dockFeatured.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {dockFeatured.map((post) => (
            <div
              key={post.id}
              onClick={() => onOpenArticle(post)}
              className="group flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <div className="relative w-20 h-16 sm:w-24 sm:h-18 shrink-0 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
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
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {post.titleBn || post.title}
                </h3>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  <Clock className="w-3 h-3" />
                  <span>{post.dateBn || post.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
