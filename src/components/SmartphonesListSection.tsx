import React from 'react';
import { Clock, ChevronRight } from 'lucide-react';
import { Post, Language } from '../types';

interface SmartphonesListSectionProps {
  posts: Post[];
  language: Language;
  onOpenArticle: (post: Post) => void;
  onViewAll?: () => void;
}

export const SmartphonesListSection: React.FC<SmartphonesListSectionProps> = ({
  posts,
  language,
  onOpenArticle,
  onViewAll
}) => {
  if (posts.length === 0) return null;

  const smartphonePosts = posts.slice(0, 4);

  return (
    <section className="mb-10">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3 mb-5 border-b-2 border-gray-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-5 bg-blue-600 rounded-full" />
          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">
            {language === 'bn' ? 'স্মার্টফোন ও উদ্ভাবন' : 'Smartphones'}
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

      {/* Stack of 4 Horizontal Cards */}
      <div className="space-y-4">
        {smartphonePosts.map((post) => (
          <article
            key={post.id}
            onClick={() => onOpenArticle(post)}
            className="group cursor-pointer bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-800 hover:border-blue-500/40 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-4 p-3.5 sm:p-4"
          >
            {/* Left: Wide Thumbnail */}
            <div className="relative sm:w-60 sm:h-38 h-44 shrink-0 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src={post.imageUrl}
                alt={post.altText || post.titleBn || post.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-2.5 left-2.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
                {post.categoryBn || post.category}
              </span>
            </div>

            {/* Right: Content Information */}
            <div className="flex-1 flex flex-col justify-between py-1">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                  {post.titleBn || post.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {post.excerptBn || post.excerpt}
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500 pt-3 mt-2 border-t border-gray-100 dark:border-slate-800/80">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {post.author.nameBn || post.author.name}
                </span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{post.dateBn || post.date}</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
