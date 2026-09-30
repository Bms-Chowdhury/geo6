import React from 'react';
import { Clock, ChevronRight } from 'lucide-react';
import { Post, Language } from '../types';

interface VisualStoriesSectionProps {
  posts: Post[];
  language: Language;
  onOpenArticle: (post: Post) => void;
  onViewAll?: () => void;
}

export const VisualStoriesSection: React.FC<VisualStoriesSectionProps> = ({
  posts,
  language,
  onOpenArticle,
  onViewAll
}) => {
  if (posts.length === 0) return null;

  const storyPosts = posts.slice(0, 3);

  return (
    <section className="mb-10">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3 mb-5 border-b-2 border-gray-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-5 bg-blue-600 rounded-full" />
          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">
            {language === 'bn' ? 'টেক স্টোরিজ' : 'Tech Stories'}
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

      {/* 3 Portrait Vertical Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {storyPosts.map((post) => (
          <div
            key={post.id}
            onClick={() => onOpenArticle(post)}
            className="group relative h-72 sm:h-80 rounded-2xl overflow-hidden cursor-pointer shadow-md bg-slate-950 border border-gray-200 dark:border-slate-800 hover:border-blue-500/50 transition-all"
          >
            <img
              src={post.imageUrl}
              alt={post.altText || post.titleBn || post.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
              referrerPolicy="no-referrer"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10" />

            {/* Text Overlay at Bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 z-10">
              <h3 className="text-sm sm:text-base font-bold text-white leading-snug group-hover:text-blue-300 transition-colors line-clamp-3 mb-2.5">
                {post.titleBn || post.title}
              </h3>

              <div className="flex items-center gap-2 text-[11px] text-slate-300">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{post.dateBn || post.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
