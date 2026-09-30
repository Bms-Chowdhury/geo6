import React, { useState } from 'react';
import { Clock, Eye, Heart, Bookmark, Share2, ArrowUpRight, Check } from 'lucide-react';
import { Post, Language, ViewMode } from '../types';

interface PostCardProps {
  post: Post;
  language: Language;
  viewMode: ViewMode;
  onOpenArticle: (post: Post) => void;
  isSaved: boolean;
  onToggleSave: (postId: string, e: React.MouseEvent) => void;
  onLike: (postId: string, e: React.MouseEvent) => void;
  liked: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  language,
  viewMode,
  onOpenArticle,
  isSaved,
  onToggleSave,
  onLike,
  liked
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Category badge color lookup
  const getCategoryBadgeClass = (categorySlug: string) => {
    switch (categorySlug) {
      case 'tech':
        return 'bg-blue-600 text-white';
      case 'business':
        return 'bg-emerald-600 text-white';
      case 'lifestyle':
        return 'bg-rose-500 text-white';
      case 'sports':
        return 'bg-amber-600 text-white';
      case 'entertainment':
        return 'bg-purple-600 text-white';
      case 'world':
        return 'bg-cyan-600 text-white';
      default:
        return 'bg-slate-700 text-white';
    }
  };

  const title = language === 'bn' ? post.titleBn : post.title;
  const excerpt = language === 'bn' ? post.excerptBn : post.excerpt;
  const authorName = language === 'bn' ? post.author.nameBn : post.author.name;
  const date = language === 'bn' ? post.dateBn : post.date;
  const categoryName = language === 'bn' ? post.categoryBn : post.category;

  /* List View Layout */
  if (viewMode === 'list') {
    return (
      <article
        onClick={() => onOpenArticle(post)}
        className="group bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row cursor-pointer"
      >
        <div className="relative sm:w-64 sm:h-auto h-48 shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={post.imageUrl}
            alt={post.altText || title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <span
            className={`absolute top-3 left-3 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded shadow-sm ${getCategoryBadgeClass(
              post.categorySlug
            )}`}
          >
            {categoryName}
          </span>
        </div>

        <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
          <div>
            <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
              <div className="flex items-center gap-2">
                <img
                  src={post.author.avatar}
                  alt=""
                  className="w-5 h-5 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="font-semibold text-slate-700 dark:text-slate-300">{authorName}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {date}
                </span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
              {title}
            </h3>

            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-2 line-clamp-2 leading-relaxed">
              {excerpt}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 mt-3 border-t border-gray-100 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {post.views.toLocaleString()}
              </span>
              <button
                onClick={(e) => onLike(post.id, e)}
                className={`flex items-center gap-1 hover:text-rose-500 transition-colors ${
                  liked ? 'text-rose-500 font-bold' : ''
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-current text-rose-500' : ''}`} />
                <span>{post.likes}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Share link"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={(e) => onToggleSave(post.id, e)}
                className={`p-1.5 rounded transition-colors ${
                  isSaved
                    ? 'text-blue-600 bg-blue-50 dark:bg-blue-950/40'
                    : 'text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title="Save story"
              >
                <Bookmark className="w-3.5 h-3.5 fill-current" />
              </button>
              <span className="text-blue-600 font-semibold text-xs flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform ml-1">
                <span>{language === 'bn' ? 'বিস্তারিত' : 'Read'}</span>
                <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      </article>
    );
  }

  /* Compact View */
  if (viewMode === 'compact') {
    return (
      <article
        onClick={() => onOpenArticle(post)}
        className="group bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg p-3 hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span
            className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shrink-0 ${getCategoryBadgeClass(
              post.categorySlug
            )}`}
          >
            {categoryName}
          </span>
          <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 truncate group-hover:text-blue-600 transition-colors">
            {title}
          </h4>
        </div>
        <div className="flex items-center gap-3 shrink-0 text-slate-400 text-[11px]">
          <span className="hidden sm:inline">{date}</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
        </div>
      </article>
    );
  }

  /* Default Grid View Layout (Classic Magazine Card) */
  return (
    <article
      onClick={() => onOpenArticle(post)}
      className="group bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden hover:border-blue-500/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      <div>
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={post.imageUrl}
            alt={post.altText || title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <span
            className={`absolute top-3 left-3 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded shadow-md ${getCategoryBadgeClass(
              post.categorySlug
            )}`}
          >
            {categoryName}
          </span>
          <button
            onClick={(e) => onToggleSave(post.id, e)}
            className={`absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-md transition-colors ${
              isSaved
                ? 'bg-blue-600 text-white'
                : 'bg-black/40 text-white hover:bg-blue-600'
            }`}
            title="Save article"
          >
            <Bookmark className="w-3.5 h-3.5 fill-current" />
          </button>
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">{authorName}</span>
            <span>•</span>
            <span>{date}</span>
          </div>

          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
            {title}
          </h3>

          <p className="text-slate-600 dark:text-slate-400 text-xs mt-2 line-clamp-2 leading-relaxed">
            {excerpt}
          </p>
        </div>
      </div>

      <div className="p-4 sm:p-5 pt-0">
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {post.views.toLocaleString()}
            </span>
            <button
              onClick={(e) => onLike(post.id, e)}
              className={`flex items-center gap-1 hover:text-rose-500 transition-colors ${
                liked ? 'text-rose-500 font-bold' : ''
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-current text-rose-500' : ''}`} />
              <span>{post.likes}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              title="Share"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>
            <span className="text-blue-600 dark:text-blue-400 font-semibold text-xs flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              <span>{language === 'bn' ? 'পড়ুন' : 'Read'}</span>
              <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};
