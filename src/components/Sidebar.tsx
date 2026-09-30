import React, { useState } from 'react';
import { 
  TrendingUp, 
  Mail, 
  Send, 
  CheckCircle2, 
  Tag, 
  Share2, 
  Youtube, 
  Facebook, 
  Twitter, 
  Instagram,
  Clock,
  ChevronRight
} from 'lucide-react';
import { Post, Language, AdSettings } from '../types';
import { CATEGORIES } from '../data/posts';
import { AdBanner } from './AdBanner';

interface SidebarProps {
  posts: Post[];
  language: Language;
  onOpenArticle: (post: Post) => void;
  onSelectCategory: (slug: string) => void;
  onSelectTag: (tag: string) => void;
  selectedTag?: string;
  adSettings: AdSettings;
  onOpenAdManager?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  posts,
  language,
  onOpenArticle,
  onSelectCategory,
  onSelectTag,
  selectedTag,
  adSettings
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 4000);
    }
  };

  // Popular / Trending posts
  const popularPosts = [...posts].sort((a, b) => b.views - a.views);
  const featuredPopular = popularPosts[0];
  const listPopular = popularPosts.slice(1, 4);

  // Latest mini grid posts (4 posts)
  const latestMiniPosts = posts.slice(2, 6);

  // Extract unique tags
  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags))).slice(0, 10);

  return (
    <aside className="space-y-7">
      {/* 1. Follow Us Social Counter Strip (Exact match to screenshot) */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 pb-3 mb-3.5 border-b border-gray-100 dark:border-slate-800">
          <span className="w-1 h-4 bg-blue-600 rounded-full" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
            {language === 'bn' ? 'আমাদের সাথে যুক্ত থাকুন' : 'Follow Us'}
          </h3>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {/* Facebook */}
          <div className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-[#1877F2] text-white hover:opacity-90 transition-opacity cursor-pointer text-center">
            <Facebook className="w-4 h-4 mb-1" />
            <span className="text-xs font-extrabold leading-tight">47k</span>
            <span className="text-[9px] text-white/80 leading-tight">ফলোয়ার</span>
          </div>

          {/* Twitter / X */}
          <div className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-black text-white hover:opacity-90 transition-opacity cursor-pointer text-center">
            <Twitter className="w-4 h-4 mb-1" />
            <span className="text-xs font-extrabold leading-tight">259k</span>
            <span className="text-[9px] text-white/80 leading-tight">ফলোয়ার</span>
          </div>

          {/* Instagram */}
          <div className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white hover:opacity-90 transition-opacity cursor-pointer text-center">
            <Instagram className="w-4 h-4 mb-1" />
            <span className="text-xs font-extrabold leading-tight">89k</span>
            <span className="text-[9px] text-white/80 leading-tight">ফলোয়ার</span>
          </div>

          {/* YouTube */}
          <div className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-[#FF0000] text-white hover:opacity-90 transition-opacity cursor-pointer text-center">
            <Youtube className="w-4 h-4 mb-1" />
            <span className="text-xs font-extrabold leading-tight">1.73M</span>
            <span className="text-[9px] text-white/80 leading-tight">সাবস্ক্রাইবার</span>
          </div>
        </div>
      </div>

      {/* 2. Popular Posts Widget (1 Feature Card + 3 List Items) */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm">
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gray-100 dark:border-slate-800">
          <span className="w-1 h-4 bg-blue-600 rounded-full" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
            {language === 'bn' ? 'জনপ্রিয় সংবাদ' : 'Popular Posts'}
          </h3>
        </div>

        {/* Featured Popular Card */}
        {featuredPopular && (
          <div
            onClick={() => onOpenArticle(featuredPopular)}
            className="group relative h-48 rounded-xl overflow-hidden cursor-pointer bg-slate-950 mb-3.5 shadow-sm"
          >
            <img
              src={featuredPopular.imageUrl}
              alt={featuredPopular.altText || featuredPopular.titleBn || featuredPopular.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

            <span className="absolute top-2.5 left-2.5 bg-blue-600 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
              {featuredPopular.categoryBn || featuredPopular.category}
            </span>

            <div className="absolute bottom-0 left-0 right-0 p-3.5">
              <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-2 leading-snug mb-1.5">
                {featuredPopular.titleBn || featuredPopular.title}
              </h4>
              <div className="flex items-center gap-2 text-[10px] text-slate-300">
                <span>{featuredPopular.author.nameBn || featuredPopular.author.name}</span>
                <span>•</span>
                <span>{featuredPopular.dateBn || featuredPopular.date}</span>
              </div>
            </div>
          </div>
        )}

        {/* 3 Compact List Items */}
        <div className="space-y-3">
          {listPopular.map((post) => (
            <div
              key={post.id}
              onClick={() => onOpenArticle(post)}
              className="group flex items-center gap-3 cursor-pointer py-1 border-b border-gray-100 dark:border-slate-800/60 last:border-0"
            >
              <div className="relative w-16 h-14 shrink-0 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
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
                <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                  {post.titleBn || post.title}
                </h5>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">
                  {post.dateBn || post.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Sponsor Banner 300x250 (Preserved Ad Placement) */}
      <AdBanner
        slotType="sidebar_300x250"
        settings={adSettings}
        language={language}
      />

      {/* 4. Stay Informed Newsletter Box (Exact match to screenshot) */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2 pb-3 mb-3 border-b border-gray-100 dark:border-slate-800">
          <span className="w-1 h-4 bg-blue-600 rounded-full" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
            {language === 'bn' ? 'যুক্ত থাকুন' : 'Stay Informed'}
          </h3>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3.5 leading-relaxed">
          {language === 'bn'
            ? 'আমাদের প্রতিদিনের গুরুত্বপূর্ণ সংবাদের আপডেট ও প্রতিবেদন সরাসরি পেতে সাবস্ক্রাইব করুন।'
            : 'Subscribe to our daily news updates and analysis delivered directly to your inbox.'}
        </p>

        {subscribed ? (
          <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>ধন্যবাদ! আপনি সফলভাবে সাবস্ক্রাইব করেছেন।</span>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="space-y-2.5">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={language === 'bn' ? 'আপনার ইমেইল ঠিকানা দিন...' : 'Enter your email address...'}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-xs outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'সাবস্ক্রাইব করুন' : 'Subscribe'}</span>
            </button>
          </form>
        )}
      </div>

      {/* 5. Latest Updates 2x2 Mini Cards Grid */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm">
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gray-100 dark:border-slate-800">
          <span className="w-1 h-4 bg-blue-600 rounded-full" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
            {language === 'bn' ? 'সর্বশেষ আপডেট' : 'Latest Updates'}
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {latestMiniPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => onOpenArticle(post)}
              className="group cursor-pointer flex flex-col"
            >
              <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 mb-2">
                <img
                  src={post.imageUrl}
                  alt={post.altText || post.titleBn || post.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h5 className="text-[11px] font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug mb-1">
                {post.titleBn || post.title}
              </h5>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                {post.dateBn || post.date}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Categories List */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm">
        <div className="flex items-center gap-2 pb-3 mb-3 border-b border-gray-100 dark:border-slate-800">
          <span className="w-1 h-4 bg-blue-600 rounded-full" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
            {language === 'bn' ? 'বিভাগসমূহ' : 'Categories'}
          </h3>
        </div>

        <div className="space-y-1.5">
          {CATEGORIES.map((cat) => {
            const count = posts.filter((p) => p.categorySlug === cat.slug).length;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${cat.color}`} />
                  <span className="group-hover:text-blue-600 transition-colors">
                    {language === 'bn' ? cat.nameBn : cat.name}
                  </span>
                </div>
                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full text-[10px] font-bold">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 7. Popular Tags Cloud */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm">
        <div className="flex items-center gap-2 pb-3 mb-3 border-b border-gray-100 dark:border-slate-800">
          <Tag className="w-3.5 h-3.5 text-blue-600" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
            {language === 'bn' ? 'জনপ্রিয় ট্যাগসমূহ' : 'Popular Tags'}
          </h3>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {allTags.map((tag) => {
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => onSelectTag(tag)}
                className={`text-[11px] px-2.5 py-1 rounded-md font-medium transition-colors ${
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600'
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* 8. Sidebar Sticky Half-Page Ad (300x600) */}
      <AdBanner
        slotType="sidebar_300x600"
        settings={adSettings}
        language={language}
      />
    </aside>
  );
};
