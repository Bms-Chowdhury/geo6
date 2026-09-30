import React, { useState } from 'react';
import { Play, X, ChevronRight, Film } from 'lucide-react';
import { Post, Language } from '../types';

interface ReviewsVideoSectionProps {
  posts: Post[];
  language: Language;
  onOpenArticle: (post: Post) => void;
  onViewAll?: () => void;
}

export const ReviewsVideoSection: React.FC<ReviewsVideoSectionProps> = ({
  posts,
  language,
  onOpenArticle,
  onViewAll
}) => {
  const [activeVideoModal, setActiveVideoModal] = useState<string | null>(null);

  if (posts.length === 0) return null;

  const featured = posts[0];
  const miniGrid = posts.slice(1, 5);

  return (
    <section className="mb-10 bg-[#141b26] dark:bg-[#0c121e] rounded-2xl p-5 sm:p-7 text-white border border-slate-800 shadow-xl">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-blue-600 rounded-lg text-white">
            <Film className="w-4 h-4" />
          </div>
          <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-white">
            {language === 'bn' ? 'রিভিউ ও ভিডিও স্পটলাইট' : 'Reviews & Video'}
          </h2>
        </div>

        <button
          onClick={onViewAll}
          className="flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
        >
          <span>{language === 'bn' ? 'সব দেখুন' : 'View All'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Grid: 1 Large on Left (50%), 4 Small on Right in 2x2 Grid (50%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 1 Large Featured Video */}
        {featured && (
          <div
            onClick={() => onOpenArticle(featured)}
            className="lg:col-span-6 group cursor-pointer flex flex-col justify-between"
          >
            <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-800 border border-slate-700/60 mb-3.5">
              <img
                src={featured.imageUrl}
                alt={featured.altText || featured.titleBn || featured.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />

              {/* Play Overlay */}
              <div className="absolute inset-0 bg-black/35 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="w-13 h-13 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-blue-600 transition-all">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
              </div>

              <span className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded">
                {featured.categoryBn || featured.category}
              </span>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug mb-2">
                {featured.titleBn || featured.title}
              </h3>
              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
                {featured.excerptBn || featured.excerpt}
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span>{featured.author.nameBn || featured.author.name}</span>
                <span>•</span>
                <span>{featured.dateBn || featured.date}</span>
              </div>
            </div>
          </div>
        )}

        {/* Right: 4 Small Cards in a 2x2 Grid */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {miniGrid.map((post) => (
            <div
              key={post.id}
              onClick={() => onOpenArticle(post)}
              className="group cursor-pointer flex flex-col"
            >
              <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-slate-800 border border-slate-700/50 mb-2">
                <img
                  src={post.imageUrl}
                  alt={post.altText || post.titleBn || post.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-blue-600/90 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </div>
                </div>
              </div>

              <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug mb-1">
                {post.titleBn || post.title}
              </h4>
              <span className="text-[11px] text-slate-400">
                {post.dateBn || post.date}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
