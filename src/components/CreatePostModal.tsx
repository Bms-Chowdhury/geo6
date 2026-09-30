import React, { useState } from 'react';
import { X, PenSquare, Tag, Sparkles, CheckCircle } from 'lucide-react';
import { Post, Language } from '../types';
import { CATEGORIES } from '../data/posts';
import { TipTapEditor } from './TipTapEditor';
import { FeaturedImageSection } from './FeaturedImageSection';
import { slugify } from '../utils/seoHelpers';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onPublish: (newPost: Post) => void;
}

const PRESET_IMAGES = [
  { label: 'Quantum & Tech', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Finance & Cities', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Green Energy', url: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Sports Arena', url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Culture & Arts', url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80' }
];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  language,
  onPublish
}) => {
  const [title, setTitle] = useState('');
  const [titleBn, setTitleBn] = useState('');
  const [categorySlug, setCategorySlug] = useState('tech');
  const [authorName, setAuthorName] = useState('Editorial Staff');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [altText, setAltText] = useState('');
  const [caption, setCaption] = useState('');
  const [credit, setCredit] = useState('The GeoPacts');
  const [imageStoragePath, setImageStoragePath] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('News, Highlights, Innovation');
  const [isBreaking, setIsBreaking] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [slug, setSlug] = useState('');
  const [focusKeyword, setFocusKeyword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const matchedCategory = CATEGORIES.find((c) => c.slug === categorySlug) || CATEGORIES[0];
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newPost: Post = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      titleBn: titleBn.trim() || title.trim(),
      excerpt: excerpt.trim() || title.trim(),
      excerptBn: excerpt.trim() || titleBn.trim() || title.trim(),
      content: content.trim() || excerpt.trim() || title.trim(),
      contentBn: content.trim() || excerpt.trim() || titleBn.trim() || title.trim(),
      category: matchedCategory.name,
      categoryBn: matchedCategory.nameBn,
      categorySlug: matchedCategory.slug,
      author: {
        name: authorName.trim() || 'Contributor',
        nameBn: authorName.trim() || 'প্রতিবেদক',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        role: 'Contributing Writer'
      },
      date: 'Just now',
      dateBn: 'এইমাত্র প্রকাশিত',
      readTime: '3 min read',
      views: 1,
      likes: 0,
      imageUrl: imageUrl.trim(),
      caption: caption.trim() || undefined,
      credit: credit.trim() || undefined,
      imageStoragePath: imageStoragePath || undefined,
      tags: tags.length > 0 ? tags : ['News', 'The GeoPacts'],
      isBreaking,
      isFeatured,
      isTrending: true,
      slug: slug.trim() || slugify(title.trim()),
      seoTitle: title.trim(),
      seoDescription: excerpt.trim() || title.trim(),
      focusKeyword: focusKeyword.trim() || undefined,
      altText: altText.trim() || undefined,
      robotsIndex: true,
      robotsFollow: true
    };

    onPublish(newPost);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
        {/* Header */}
        <div className="p-5 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-600 text-white rounded-lg">
              <PenSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {language === 'bn' ? 'নতুন সংবাদ বা নিবন্ধ প্রকাশ করুন' : 'The GeoPacts Publisher Studio'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'bn' ? 'আপনার প্রতিবেদন লিখুন এবং ম্যাগাজিনে লাইভ পোস্ট করুন' : 'Draft and publish directly into the live publication feed'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {language === 'bn' ? 'সংবাদের শিরোনাম (English Title)' : 'Article Headline (English)'} *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Breakthrough Artificial Intelligence Algorithm Accelerates Space Exploration"
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {language === 'bn' ? 'বাংলা শিরোনাম (Bengali Title)' : 'Bengali Headline (Optional)'}
            </label>
            <input
              type="text"
              value={titleBn}
              onChange={(e) => setTitleBn(e.target.value)}
              placeholder="যেমন: মহাকাশ গবেষণায় নতুন কৃত্রিম বুদ্ধিমত্তা অ্যালগরিদমের বিপ্লব"
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-red-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'bn' ? 'বিভাগ (Category)' : 'Category'} *
              </label>
              <select
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-red-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name} ({cat.nameBn})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'bn' ? 'প্রতিবেদকের নাম (Author Name)' : 'Author Name'}
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Author name..."
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Featured Cover Image Section (Supabase Storage Backed) */}
          <FeaturedImageSection
            value={{
              imageUrl,
              altText,
              caption,
              credit,
              imageStoragePath
            }}
            onChange={(updated) => {
              if (updated.imageUrl !== undefined) setImageUrl(updated.imageUrl);
              if (updated.altText !== undefined) setAltText(updated.altText);
              if (updated.caption !== undefined) setCaption(updated.caption);
              if (updated.credit !== undefined) setCredit(updated.credit);
              if (updated.imageStoragePath !== undefined) setImageStoragePath(updated.imageStoragePath);
            }}
            language={language}
          />

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {language === 'bn' ? 'সংক্ষিপ্ত সারাংশ (Excerpt / Lead)' : 'Article Excerpt / Lead'} *
            </label>
            <textarea
              rows={2}
              required
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A concise 1-2 sentence lead paragraph..."
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-red-500"
            />
          </div>

          {/* Quick SEO Configuration */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-gray-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'bn' ? 'ইউআরএল স্লাগ (Custom Slug)' : 'SEO Permalink Slug'}
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder={title ? slugify(title) : 'custom-url-slug'}
                className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-red-500 text-[11px]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'bn' ? 'মূল কিওয়ার্ড (Focus Keyword)' : 'Focus Keyword'}
              </label>
              <input
                type="text"
                value={focusKeyword}
                onChange={(e) => setFocusKeyword(e.target.value)}
                placeholder="e.g. Geopolitics, AI Governance"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-red-500 text-[11px]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
              <span>{language === 'bn' ? 'পূর্ণাঙ্গ প্রতিবেদন (Article Body - TipTap Rich Text)' : 'Full Article Content (TipTap Rich Text)'} *</span>
              <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400">
                TipTap Rich Text
              </span>
            </label>
            <TipTapEditor
              content={content}
              onChange={(newHtml) => setContent(newHtml)}
              placeholder={language === 'bn' ? 'আপনার বিশ্লেষণ বা সংবাদ প্রতিবেদন লিখুন...' : 'Write your investigative story, analysis, or news report here...'}
              language={language}
              minHeight="220px"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {language === 'bn' ? 'ট্যাগসমূহ (কমা দিয়ে আলাদা করুন)' : 'Tags (Comma separated)'}
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="AI, Innovation, Hardware"
              className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-red-500"
            />
          </div>

          {/* Checkbox Options */}
          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isBreaking}
                onChange={(e) => setIsBreaking(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded"
              />
              <span>{language === 'bn' ? 'ব্রেকিং নিউজ হিসেবে চিহ্নিত করুন' : 'Mark as Breaking News'}</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded"
              />
              <span>{language === 'bn' ? 'শীর্ষ ফিচারে প্রদর্শন করুন' : 'Show in Top Featured Grid'}</span>
            </label>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold rounded-lg shadow-md transition-colors"
            >
              {language === 'bn' ? 'প্রকাশ করুন' : 'Publish Article'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
