import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Clock, 
  Eye, 
  Heart, 
  Bookmark, 
  Share2, 
  ArrowLeft, 
  Check, 
  Sparkles,
  ListOrdered,
  ThumbsUp
} from 'lucide-react';
import { Post, Language, AdSettings } from '../types';
import { AdBanner } from './AdBanner';
import { generateNewsArticleSchema, generateBreadcrumbsSchema, resolveSeoMetadata } from '../utils/seoHelpers';

interface ArticleReaderModalProps {
  post: Post | null;
  onClose: () => void;
  language: Language;
  onLikePost: (postId: string, e: React.MouseEvent) => void;
  isLiked: boolean;
  isSaved: boolean;
  onToggleSave: (postId: string, e: React.MouseEvent) => void;
  allPosts: Post[];
  onSelectRelated: (post: Post) => void;
  adSettings: AdSettings;
  onOpenAdManager?: () => void;
}

export const ArticleReaderModal: React.FC<ArticleReaderModalProps> = ({
  post,
  onClose,
  language,
  onLikePost,
  isLiked,
  isSaved,
  onToggleSave,
  allPosts,
  onSelectRelated,
  adSettings
}) => {
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll progress listener
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const totalHeight = scrollHeight - clientHeight;
    if (totalHeight > 0) {
      setScrollProgress((scrollTop / totalHeight) * 100);
    }
  };

  useEffect(() => {
    // Reset scroll when post changes
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
      setScrollProgress(0);
    }

    if (!post) return;
    const previousTitle = document.title;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://thegeopacts.com';
    const resolved = resolveSeoMetadata(post, origin);

    document.title = `${resolved.seoTitle} | The GeoPacts`;

    // Upsert meta tag helper
    const upsertMeta = (name: string, content: string, isProperty = false) => {
      let el = document.querySelector(isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        if (isProperty) el.setAttribute('property', name);
        else el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
      return el;
    };

    const upsertLink = (rel: string, href: string) => {
      let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
      return el;
    };

    upsertMeta('description', resolved.seoDescription);
    upsertMeta('robots', resolved.robots);
    upsertMeta('og:title', resolved.ogTitle, true);
    upsertMeta('og:description', resolved.ogDescription, true);
    upsertMeta('og:image', resolved.ogImage, true);
    upsertMeta('og:url', resolved.canonicalUrl, true);
    upsertMeta('og:type', 'article', true);
    upsertMeta('twitter:card', 'summary_large_image');
    upsertMeta('twitter:title', resolved.ogTitle);
    upsertMeta('twitter:description', resolved.ogDescription);
    upsertMeta('twitter:image', resolved.ogImage);
    upsertLink('canonical', resolved.canonicalUrl);

    // JSON-LD structured data for Google News and Search
    const scriptId = 'geopacts-article-jsonld';
    let scriptEl = document.getElementById(scriptId) as HTMLScriptElement;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = scriptId;
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }
    const newsSchema = generateNewsArticleSchema(post, origin);
    const breadcrumbSchema = generateBreadcrumbsSchema(post, origin);
    scriptEl.textContent = JSON.stringify([newsSchema, breadcrumbSchema]);

    return () => {
      document.title = previousTitle;
      const scriptToRemove = document.getElementById(scriptId);
      if (scriptToRemove) scriptToRemove.remove();
    };
  }, [post]);

  if (!post) return null;

  const relatedPosts = allPosts
    .filter((p) => p.id !== post.id && (p.categorySlug === post.categorySlug || p.tags.some(t => post.tags.includes(t))))
    .slice(0, 3);

  const title = language === 'bn' ? post.titleBn : post.title;
  const excerpt = language === 'bn' ? post.excerptBn : post.excerpt;
  const content = language === 'bn' ? post.contentBn : post.content;
  const authorName = language === 'bn' ? post.author.nameBn : post.author.name;
  const date = language === 'bn' ? post.dateBn : post.date;
  const categoryName = language === 'bn' ? post.categoryBn : post.category;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Font size styling
  const getBodyFontSize = () => {
    switch (fontSize) {
      case 'sm':
        return 'text-sm sm:text-base leading-relaxed';
      case 'lg':
        return 'text-lg sm:text-xl leading-loose';
      case 'base':
      default:
        return 'text-base sm:text-lg leading-relaxed';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-center overflow-hidden">
      {/* Top Reading Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-red-600 z-50 transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      />

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full max-w-4xl bg-white dark:bg-slate-900 h-full overflow-y-auto shadow-2xl transition-colors"
      >
        {/* Reader Top Action Bar */}
        <div className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 px-4 sm:px-8 py-3 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'bn' ? 'ফিরে যান' : 'Back to Stories'}</span>
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Font Size Adjusters */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 text-xs font-bold text-slate-600 dark:text-slate-300">
              <button
                onClick={() => setFontSize('sm')}
                className={`px-2 py-1 rounded ${fontSize === 'sm' ? 'bg-white dark:bg-slate-700 text-red-600 shadow-sm' : ''}`}
                title="Small text"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('base')}
                className={`px-2 py-1 rounded ${fontSize === 'base' ? 'bg-white dark:bg-slate-700 text-red-600 shadow-sm' : ''}`}
                title="Normal text"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('lg')}
                className={`px-2 py-1 rounded ${fontSize === 'lg' ? 'bg-white dark:bg-slate-700 text-red-600 shadow-sm' : ''}`}
                title="Large text"
              >
                A+
              </button>
            </div>

            {/* Bookmark button */}
            <button
              onClick={(e) => onToggleSave(post.id, e)}
              className={`p-2 rounded-lg transition-colors ${
                isSaved
                  ? 'bg-red-50 dark:bg-red-950/40 text-red-600'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Bookmark article"
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>

            {/* Share button */}
            <button
              onClick={handleShare}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title="Copy article link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Article Body Container */}
        <article className="px-4 sm:px-8 lg:px-12 py-8">
          {/* Category & Date Breadcrumb */}
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-red-600 text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded">
              {categoryName}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{date}</span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{post.readTime}</span>
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight mb-4">
            {title}
          </h1>

          {/* Excerpt Lead paragraph */}
          <p className="text-base sm:text-lg font-medium text-slate-600 dark:text-slate-300 leading-relaxed border-l-4 border-red-600 pl-4 mb-6 bg-slate-50 dark:bg-slate-800/40 py-2 rounded-r-lg">
            {excerpt}
          </p>

          {/* Author Meta Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-gray-100 dark:border-slate-800 mb-6">
            <div className="flex items-center gap-3">
              <img
                src={post.author.avatar}
                alt={authorName}
                loading="lazy"
                decoding="async"
                className="w-11 h-11 rounded-full object-cover border-2 border-red-500"
                referrerPolicy="no-referrer"
              />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{authorName}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{post.author.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4 text-slate-400" />
                <span>{post.views.toLocaleString()} {language === 'bn' ? 'বার দেখা হয়েছে' : 'views'}</span>
              </span>

              <button
                onClick={(e) => onLikePost(post.id, e)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${
                  isLiked
                    ? 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-600 font-bold'
                    : 'border-gray-200 dark:border-slate-700 hover:border-red-400 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current text-red-600' : ''}`} />
                <span>{post.likes}</span>
              </button>
            </div>
          </div>

          {/* Featured Cover Image */}
          <div className="rounded-2xl overflow-hidden mb-8 shadow-lg bg-slate-100 dark:bg-slate-800">
            <div className="aspect-[16/9] sm:aspect-[16/10] max-h-[480px] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src={post.imageUrl}
                alt={post.altText || title}
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {(post.caption || post.credit) && (
              <div className="p-3 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/80 border-t border-gray-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                <span className="flex-1">
                  {post.caption || post.altText || ''}
                  {post.credit && (
                    <span className="ml-2 font-semibold text-slate-700 dark:text-slate-200">
                      • {language === 'bn' ? 'ছবি সৌজন্যে:' : 'Credit:'} {post.credit}
                    </span>
                  )}
                </span>
                <span className="shrink-0 text-[10px] opacity-75 font-mono">
                  {language === 'bn' ? 'আপডেট:' : 'Updated:'} {date}
                </span>
              </div>
            )}
          </div>

          {/* Quick Table of Contents (The GeoPacts hallmark) */}
          <div className="bg-slate-50 dark:bg-slate-800/70 border border-gray-200 dark:border-slate-700 rounded-xl p-4 sm:p-5 mb-6">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white mb-2">
              <ListOrdered className="w-4 h-4 text-red-600" />
              <span>{language === 'bn' ? 'সূচিপত্র' : 'Table of Contents'}</span>
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
              <li>{language === 'bn' ? '১. প্রেক্ষাপট ও মূল তাৎপর্য' : '1. Overview & Context'}</li>
              <li>{language === 'bn' ? '২. কাঠামোগত বিশ্লেষণ ও প্রভাব' : '2. Architectural & Practical Impact'}</li>
              <li>{language === 'bn' ? '৩. বিশেষজ্ঞ মতামত ও ভবিষ্যৎ দিকনির্দেশনা' : '3. Industry Outlook & Summary'}</li>
            </ul>
          </div>

          {/* In-Article Top Ad (Google AdSense 728x90 / 336x280) */}
          <AdBanner
            slotType="article_top"
            settings={adSettings}
            language={language}
          />

          {/* Formatted Article Text (TipTap HTML or Markdown/Plain) */}
          {(() => {
            const isHtml = /<[a-z][\s\S]*>/i.test(content);
            if (isHtml) {
              const pMatches = [...content.matchAll(/<\/p>/gi)];
              if (pMatches.length >= 2 && pMatches[1].index !== undefined) {
                const splitPos = pMatches[1].index + 4;
                const part1 = content.substring(0, splitPos);
                const part2 = content.substring(splitPos);
                return (
                  <>
                    <div
                      className={`tiptap-rendered-content text-slate-800 dark:text-slate-200 ${getBodyFontSize()}`}
                      dangerouslySetInnerHTML={{ __html: part1 }}
                    />
                    <AdBanner
                      slotType="article_middle"
                      settings={adSettings}
                      language={language}
                    />
                    <div
                      className={`tiptap-rendered-content text-slate-800 dark:text-slate-200 ${getBodyFontSize()}`}
                      dangerouslySetInnerHTML={{ __html: part2 }}
                    />
                  </>
                );
              }
              return (
                <div
                  className={`tiptap-rendered-content text-slate-800 dark:text-slate-200 ${getBodyFontSize()}`}
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              );
            }

            return (
              <div className={`prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 ${getBodyFontSize()}`}>
                {content.split('\n\n').map((paragraph, idx) => {
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h3 key={idx} className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-3">
                        {paragraph.replace('### ', '')}
                      </h3>
                    );
                  }
                  if (paragraph.startsWith('- ')) {
                    const items = paragraph.split('\n');
                    return (
                      <ul key={idx} className="list-disc list-inside space-y-2 my-4 pl-2 text-slate-700 dark:text-slate-300">
                        {items.map((item, i) => (
                          <li key={i}>{item.replace('- ', '')}</li>
                        ))}
                      </ul>
                    );
                  }
                  return (
                    <React.Fragment key={idx}>
                      <p className="my-4 leading-relaxed">
                        {paragraph}
                      </p>
                      {/* Insert In-Article Middle Ad after the 2nd paragraph */}
                      {idx === 1 && (
                        <AdBanner
                          slotType="article_middle"
                          settings={adSettings}
                          language={language}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            );
          })()}

          {/* Tags cloud */}
          <div className="flex flex-wrap items-center gap-2 pt-6 mt-8 border-t border-gray-200 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {language === 'bn' ? 'ট্যাগ:' : 'Tags:'}
            </span>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* In-Article Bottom Ad (Google AdSense 728x90 / 336x280) */}
          <AdBanner
            slotType="article_bottom"
            settings={adSettings}
            language={language}
          />


          {/* Author Biography Box (The GeoPacts Style) */}
          <div className="bg-slate-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-xl p-5 sm:p-6 mt-8 flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <img
              src={post.author.avatar}
              alt={authorName}
              loading="lazy"
              decoding="async"
              className="w-16 h-16 rounded-full object-cover border-2 border-red-600 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h4 className="text-base font-bold text-slate-900 dark:text-white">{authorName}</h4>
                <span className="text-xs px-2 py-0.5 bg-red-100 dark:bg-red-950/60 text-red-600 rounded font-semibold">
                  {post.author.role}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                {language === 'bn'
                  ? 'দ্য জিওপ্যাক্টস আন্তর্জাতিক সম্পাদকীয় বিভাগের জ্যেষ্ঠ বিশ্লেষক। আধুনিক প্রযুক্তি, অর্থনীতি এবং বৈশ্বিক জলবায়ু পরিবর্তনের ওপর নিয়মিত কলাম লিখছেন।'
                  : 'Senior Contributing Editor at The GeoPacts Editorial Desk. Covering breakthroughs across emergent technology, global economics, and systemic policy.'}
              </p>
            </div>
          </div>

          {/* Related Articles Grid */}
          {relatedPosts.length > 0 && (
            <section className="mt-12 pt-8 border-t border-gray-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-red-600" />
                <span>{language === 'bn' ? 'সম্পর্কিত অন্যান্য খবর' : 'Related Stories'}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedPosts.map((rp) => (
                  <div
                    key={rp.id}
                    onClick={() => onSelectRelated(rp)}
                    className="group cursor-pointer rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700/60 p-3 hover:shadow-md transition-all"
                  >
                    <img
                      src={rp.imageUrl}
                      alt={rp.altText || (language === 'bn' ? rp.titleBn : rp.title)}
                      loading="lazy"
                      decoding="async"
                      className="w-full aspect-[16/10] object-cover rounded-lg group-hover:scale-105 transition-transform duration-300 mb-2"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-[10px] font-bold text-red-600 uppercase">
                      {language === 'bn' ? rp.categoryBn : rp.category}
                    </span>
                    <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-red-600 transition-colors line-clamp-2 mt-1">
                      {language === 'bn' ? rp.titleBn : rp.title}
                    </h5>
                    <div className="text-[11px] text-slate-400 mt-2">
                      {language === 'bn' ? rp.dateBn : rp.date}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </article>
      </div>
    </div>
  );
};
