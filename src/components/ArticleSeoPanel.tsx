import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Globe, 
  Share2, 
  Link2, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Sparkles, 
  ExternalLink, 
  Copy, 
  Check, 
  Smartphone, 
  Monitor, 
  HelpCircle,
  Hash,
  ChevronDown,
  ChevronUp,
  Tag,
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import { Post } from '../types';
import { analyzeArticleSeo, resolveSeoMetadata, slugify } from '../utils/seoHelpers';

interface ArticleSeoPanelProps {
  article: Partial<Post>;
  onChange: (fields: Partial<Post>) => void;
  availableArticles?: Post[];
  onInsertLink?: (title: string, url: string) => void;
  language?: 'en' | 'bn';
}

export const ArticleSeoPanel: React.FC<ArticleSeoPanelProps> = ({
  article,
  onChange,
  availableArticles = [],
  onInsertLink,
  language = 'en'
}) => {
  const [activeTab, setActiveTab] = useState<'metadata' | 'google_preview' | 'social_preview' | 'internal_links'>('metadata');
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'mobile'>('desktop');
  const [socialPlatform, setSocialPlatform] = useState<'facebook' | 'twitter'>('facebook');
  const [linkSearchQuery, setLinkSearchQuery] = useState('');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [showAdvancedRobots, setShowAdvancedRobots] = useState(false);
  const [secondaryInput, setSecondaryInput] = useState('');

  // Analyze SEO in real-time
  const seoAnalysis = useMemo(() => analyzeArticleSeo(article), [
    article.title,
    article.seoTitle,
    article.excerpt,
    article.seoDescription,
    article.content,
    article.slug,
    article.focusKeyword,
    article.imageUrl,
    article.altText,
    article.canonicalUrl,
    article.robotsIndex,
    article.robotsFollow
  ]);

  // Resolved metadata with fallbacks
  const resolved = useMemo(() => resolveSeoMetadata(article), [
    article.title,
    article.seoTitle,
    article.excerpt,
    article.seoDescription,
    article.imageUrl,
    article.ogTitle,
    article.ogDescription,
    article.ogImage,
    article.slug,
    article.id,
    article.canonicalUrl,
    article.robotsIndex,
    article.robotsFollow,
    article.altText
  ]);

  // Character lengths
  const rawSeoTitle = article.seoTitle || '';
  const currentTitle = rawSeoTitle || article.title || '';
  const rawSeoDesc = article.seoDescription || '';
  const currentDesc = rawSeoDesc || article.excerpt || '';

  // Quick Action Handlers
  const handleAutofillTitle = () => {
    if (article.title) {
      onChange({ seoTitle: article.title });
    }
  };

  const handleAutofillDesc = () => {
    if (article.excerpt) {
      onChange({ seoDescription: article.excerpt });
    }
  };

  const handleAutofillSlug = () => {
    if (article.title) {
      onChange({ slug: slugify(article.title) });
    }
  };

  const handleAutofillCanonical = () => {
    const slug = article.slug || slugify(article.title || '') || article.id || 'story';
    onChange({ canonicalUrl: `https://thegeopacts.com/article/${slug}` });
  };

  const handleAutofillAlt = () => {
    if (article.title) {
      onChange({ altText: article.title });
    }
  };

  const handleAddSecondaryKeyword = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    const trimmed = secondaryInput.trim();
    if (!trimmed) return;
    const existing = article.secondaryKeywords || [];
    if (!existing.includes(trimmed)) {
      onChange({ secondaryKeywords: [...existing, trimmed] });
    }
    setSecondaryInput('');
  };

  const handleRemoveSecondaryKeyword = (keyword: string) => {
    const existing = article.secondaryKeywords || [];
    onChange({ secondaryKeywords: existing.filter(k => k !== keyword) });
  };

  const handleCopyLink = (url: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(url);
      setTimeout(() => setCopiedLink(null), 2000);
    }
  };

  // Filter available internal articles for linking
  const filteredInternalArticles = useMemo(() => {
    if (!linkSearchQuery.trim()) {
      return availableArticles.filter(a => a.id !== article.id).slice(0, 6);
    }
    const q = linkSearchQuery.toLowerCase();
    return availableArticles
      .filter(a => a.id !== article.id)
      .filter(
        a =>
          a.title.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          a.tags.some(t => t.toLowerCase().includes(q))
      )
      .slice(0, 10);
  }, [availableArticles, article.id, linkSearchQuery]);

  // Execute quick action from issue list
  const handleExecuteIssueAction = (actionKey?: string) => {
    if (actionKey === 'autofill_title') handleAutofillTitle();
    else if (actionKey === 'autofill_desc') handleAutofillDesc();
    else if (actionKey === 'autofill_slug') handleAutofillSlug();
    else if (actionKey === 'autofill_canonical') handleAutofillCanonical();
    else if (actionKey === 'autofill_alt') handleAutofillAlt();
    else if (actionKey === 'open_internal_linking') setActiveTab('internal_links');
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
      {/* Top Banner: SEO Health Summary */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-gray-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            seoAnalysis.status === 'good'
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
              : seoAnalysis.status === 'warning'
              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
          }`}>
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {language === 'bn' ? 'এসইও এবং মেটাডাটা সেন্টার' : 'SEO & Content Discovery System'}
              </h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                seoAnalysis.status === 'good'
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : seoAnalysis.status === 'warning'
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                  : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
              }`}>
                {seoAnalysis.status === 'good' ? 'SEO: Good' : seoAnalysis.status === 'warning' ? 'SEO: Needs Attention' : 'SEO: Incomplete'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'bn'
                ? 'অনুসন্ধান ইঞ্জিন ও সামাজিক প্ল্যাটফর্মে আপনার প্রতিবেদনের দৃশ্যমানতা বৃদ্ধি করুন।'
                : 'Optimize search snippets, canonical URLs, social share cards, and internal story links.'}
            </p>
          </div>
        </div>

        {/* Health Score Meter */}
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-800">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none">Health Check</span>
            <span className={`text-sm font-black ${
              seoAnalysis.score >= 80 ? 'text-emerald-600' : seoAnalysis.score >= 60 ? 'text-amber-600' : 'text-slate-500'
            }`}>
              {seoAnalysis.score} / 100
            </span>
          </div>
          <div className="w-16 h-2 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                seoAnalysis.score >= 80 ? 'bg-emerald-500' : seoAnalysis.score >= 60 ? 'bg-amber-500' : 'bg-slate-400'
              }`}
              style={{ width: `${seoAnalysis.score}%` }}
            />
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1 px-4 pt-2 border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('metadata')}
          className={`px-3 py-2 font-bold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
            activeTab === 'metadata'
              ? 'border-red-600 text-red-600 dark:text-red-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'মেটাডাটা ও কিওয়ার্ড' : 'SEO Fields & Keywords'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('google_preview')}
          className={`px-3 py-2 font-bold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
            activeTab === 'google_preview'
              ? 'border-red-600 text-red-600 dark:text-red-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'গুগল সার্চ প্রিভিউ' : 'Google Search Preview'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('social_preview')}
          className={`px-3 py-2 font-bold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
            activeTab === 'social_preview'
              ? 'border-red-600 text-red-600 dark:text-red-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'সোশ্যাল কার্ড প্রিভিউ' : 'Social Share Card'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('internal_links')}
          className={`px-3 py-2 font-bold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
            activeTab === 'internal_links'
              ? 'border-red-600 text-red-600 dark:text-red-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Link2 className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'অভ্যন্তরীণ লিংক টুল' : 'Internal Linking Assistant'}</span>
          {availableArticles.length > 0 && (
            <span className="ml-1 px-1.5 py-0.2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-[10px]">
              {availableArticles.length}
            </span>
          )}
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="p-4 sm:p-5 space-y-5">
        {/* ========================================================================= */}
        {/* TAB 1: SEO METADATA & KEYWORDS */}
        {/* ========================================================================= */}
        {activeTab === 'metadata' && (
          <div className="space-y-4">
            {/* Actionable Health Issues / Suggestions List */}
            {seoAnalysis.issues.filter(i => i.type !== 'success').length > 0 && (
              <div className="p-3 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Actionable Suggestions ({seoAnalysis.issues.filter(i => i.type !== 'success').length})</span>
                </div>
                <div className="space-y-1.5">
                  {seoAnalysis.issues.filter(i => i.type !== 'success').slice(0, 4).map(issue => (
                    <div key={issue.id} className="flex items-start justify-between gap-2 text-xs">
                      <div className="flex items-start gap-1.5 text-slate-700 dark:text-slate-300">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>
                          <strong className="font-semibold text-slate-900 dark:text-white">{issue.title}:</strong> {issue.description}
                        </span>
                      </div>
                      {issue.actionLabel && issue.actionKey && (
                        <button
                          type="button"
                          onClick={() => handleExecuteIssueAction(issue.actionKey)}
                          className="px-2 py-0.5 bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 rounded text-[10px] font-bold hover:bg-amber-100 dark:hover:bg-amber-900/40 shrink-0 cursor-pointer"
                        >
                          {issue.actionLabel}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Field: SEO Title */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  SEO Title (Headline for Search Results)
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAutofillTitle}
                    className="text-[11px] text-red-600 hover:text-red-700 dark:text-red-400 font-medium hover:underline cursor-pointer"
                  >
                    Copy from Article Title
                  </button>
                  <span className={`text-[11px] font-mono font-bold ${
                    rawSeoTitle.length > 65 ? 'text-red-500' : rawSeoTitle.length >= 40 ? 'text-emerald-600' : 'text-slate-400'
                  }`}>
                    {rawSeoTitle.length} / 60 chars
                  </span>
                </div>
              </div>
              <input
                type="text"
                value={article.seoTitle || ''}
                onChange={(e) => onChange({ seoTitle: e.target.value })}
                placeholder={article.title || 'Enter search-optimized headline (50-60 characters ideal)...'}
                className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-red-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Fallback: If blank, search engines and social cards will safely use the primary article title: <em>"{article.title || 'Your article title'}"</em>
              </p>
            </div>

            {/* Field: Meta Description */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Meta Description (Search Result Snippet)
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAutofillDesc}
                    className="text-[11px] text-red-600 hover:text-red-700 dark:text-red-400 font-medium hover:underline cursor-pointer"
                  >
                    Copy from Excerpt
                  </button>
                  <span className={`text-[11px] font-mono font-bold ${
                    rawSeoDesc.length > 165 ? 'text-red-500' : rawSeoDesc.length >= 120 ? 'text-emerald-600' : 'text-slate-400'
                  }`}>
                    {rawSeoDesc.length} / 160 chars
                  </span>
                </div>
              </div>
              <textarea
                rows={2}
                value={article.seoDescription || ''}
                onChange={(e) => onChange({ seoDescription: e.target.value })}
                placeholder={article.excerpt || 'Concise 1-2 sentence overview designed to encourage searchers to click (140-160 characters ideal)...'}
                className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-red-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Fallback: If blank, will safely fall back to the article's lead excerpt.
              </p>
            </div>

            {/* Field: URL Slug & Focus Keyword */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    URL Slug
                  </label>
                  <button
                    type="button"
                    onClick={handleAutofillSlug}
                    className="text-[11px] text-red-600 hover:text-red-700 dark:text-red-400 font-medium hover:underline cursor-pointer"
                  >
                    Auto-generate
                  </button>
                </div>
                <div className="flex items-center rounded-lg border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 overflow-hidden focus-within:border-red-500">
                  <span className="px-2.5 py-2 text-[11px] text-slate-400 font-mono select-none border-r border-gray-200 dark:border-slate-700">
                    /article/
                  </span>
                  <input
                    type="text"
                    value={article.slug || ''}
                    onChange={(e) => onChange({ slug: slugify(e.target.value) })}
                    placeholder={slugify(article.title || '') || 'clean-story-slug'}
                    className="flex-1 px-2.5 py-2 text-xs font-mono bg-transparent text-slate-900 dark:text-white outline-none"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Permalinks: Use lowercase letters, digits, and hyphens only.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Focus Keyword (Primary Topic)
                  </label>
                  <span className="text-[10px] text-slate-400">Editorial guide</span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={article.focusKeyword || ''}
                    onChange={(e) => onChange({ focusKeyword: e.target.value })}
                    placeholder="e.g. quantum computing breakthrough"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-red-500"
                  />
                  {article.focusKeyword && (
                    <div className="absolute right-2 top-2 flex items-center gap-1">
                      {seoAnalysis.metrics.focusKeywordInTitle ? (
                        <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 rounded font-bold">
                          In Title ✓
                        </span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 rounded font-bold">
                          Missing in Title
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Used by our live health auditor to verify natural presence in headline and excerpt.
                </p>
              </div>
            </div>

            {/* Field: Secondary Keywords / Entities */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Secondary Keywords &amp; Semantic Entities
              </label>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={secondaryInput}
                  onChange={(e) => setSecondaryInput(e.target.value)}
                  onKeyDown={handleAddSecondaryKeyword}
                  placeholder="Type related search keyword and press Enter..."
                  className="flex-1 px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-red-500"
                />
                <button
                  type="button"
                  onClick={handleAddSecondaryKeyword}
                  className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg border border-gray-300 dark:border-slate-700 cursor-pointer shrink-0"
                >
                  Add Keyword
                </button>
              </div>
              {article.secondaryKeywords && article.secondaryKeywords.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {article.secondaryKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-xs font-medium"
                    >
                      <Tag className="w-3 h-3 text-slate-400" />
                      <span>{kw}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSecondaryKeyword(kw)}
                        className="hover:text-red-500 ml-1 text-slate-400 font-bold"
                        title="Remove"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Field: Image ALT Text */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Featured Image Alternative Text (ALT)
                </label>
                <button
                  type="button"
                  onClick={handleAutofillAlt}
                  className="text-[11px] text-red-600 hover:text-red-700 dark:text-red-400 font-medium hover:underline cursor-pointer"
                >
                  Use Headline
                </button>
              </div>
              <input
                type="text"
                value={article.altText || ''}
                onChange={(e) => onChange({ altText: e.target.value })}
                placeholder="Descriptive explanation of the photo (e.g. World leaders meeting at Geneva international climate summit)"
                className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-red-500"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Required for accessibility (screen readers) and helps the image rank in Google Images.
              </p>
            </div>

            {/* Advanced Toggle: Canonical & Robots Controls */}
            <div className="pt-2 border-t border-gray-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowAdvancedRobots(!showAdvancedRobots)}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-red-600 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-slate-400" />
                <span>Canonical URL &amp; Search Engine Indexing Directives</span>
                {showAdvancedRobots ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showAdvancedRobots && (
                <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-slate-800 space-y-3 animate-in fade-in">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Canonical URL
                      </label>
                      <button
                        type="button"
                        onClick={handleAutofillCanonical}
                        className="text-[11px] text-red-600 hover:text-red-700 dark:text-red-400 font-medium hover:underline cursor-pointer"
                      >
                        Reset to Default Permalinks
                      </button>
                    </div>
                    <input
                      type="url"
                      value={article.canonicalUrl || ''}
                      onChange={(e) => onChange({ canonicalUrl: e.target.value })}
                      placeholder={resolved.canonicalUrl}
                      className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-red-500"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Default: Points to <code>{resolved.canonicalUrl}</code> to guarantee protection against duplicate content penalties.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Robots Indexing
                      </label>
                      <select
                        value={article.robotsIndex !== false ? 'index' : 'noindex'}
                        onChange={(e) => onChange({ robotsIndex: e.target.value === 'index' })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-red-500"
                      >
                        <option value="index">Allow Search Engines to Index (index - Recommended)</option>
                        <option value="noindex">Block Search Engines (noindex - For internal/draft pages)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Robots Link Following
                      </label>
                      <select
                        value={article.robotsFollow !== false ? 'follow' : 'nofollow'}
                        onChange={(e) => onChange({ robotsFollow: e.target.value === 'follow' })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-red-500"
                      >
                        <option value="follow">Follow Links within Article (follow - Recommended)</option>
                        <option value="nofollow">Do Not Follow Links (nofollow)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Editorial Disclaimer */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-gray-100 dark:border-slate-800 text-[11px] text-slate-500 flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                <strong>Editorial Discovery Note:</strong> These recommendations reflect technical search engine standards (Google Search Central &amp; Schema.org guidelines). Search rankings are determined by search engine algorithms based on content value, editorial authority, and user engagement.
              </span>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: GOOGLE SEARCH PREVIEW */}
        {/* ========================================================================= */}
        {activeTab === 'google_preview' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Real-time Google SERP Snippet Preview
                </h4>
                <p className="text-[11px] text-slate-500">
                  How this article will look to users searching on Google.
                </p>
              </div>

              {/* Device Toggle */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setDevicePreview('desktop')}
                  className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
                    devicePreview === 'desktop'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDevicePreview('mobile')}
                  className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
                    devicePreview === 'mobile'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobile</span>
                </button>
              </div>
            </div>

            {/* Google Result Box Mockup */}
            <div className={`p-4 sm:p-5 bg-white dark:bg-[#202124] rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm transition-all ${
              devicePreview === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'
            }`}>
              {/* SERP Header: Favicon + Domain */}
              <div className="flex items-center gap-3 mb-2">
                <div className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center text-white text-[11px] font-black shrink-0 shadow-xs">
                  GP
                </div>
                <div className="leading-tight overflow-hidden">
                  <span className="text-xs font-semibold text-slate-900 dark:text-[#dadce0] block truncate">
                    The GeoPacts
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-[#bdc1c6] font-normal block truncate">
                    https://thegeopacts.com › {article.categorySlug || 'world'} › {resolved.slug}
                  </span>
                </div>
              </div>

              {/* SERP Headline (Blue clickable title) */}
              <h3 className="text-base sm:text-lg font-normal text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer leading-snug line-clamp-2 mb-1.5">
                {resolved.fullTitle}
              </h3>

              {/* SERP Snippet Body */}
              <p className="text-xs sm:text-sm text-[#4d5156] dark:text-[#bdc1c6] leading-relaxed line-clamp-2">
                <span className="text-slate-400 mr-1.5 font-medium">
                  {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} —
                </span>
                {resolved.seoDescription}
              </p>
            </div>

            {/* Snippet diagnostics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-gray-200 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Title Display Safety</span>
                  <span className={`font-mono font-bold ${
                    resolved.fullTitle.length > 60 ? 'text-amber-500' : 'text-emerald-500'
                  }`}>
                    {resolved.fullTitle.length} chars
                  </span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${resolved.fullTitle.length > 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${Math.min(100, (resolved.fullTitle.length / 60) * 100)}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  {resolved.fullTitle.length > 60 ? 'Long title may end in an ellipsis (...) on Google.' : 'Optimal length fits cleanly on both mobile and desktop screens.'}
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-gray-200 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Description Display Safety</span>
                  <span className={`font-mono font-bold ${
                    resolved.seoDescription.length > 160 ? 'text-amber-500' : 'text-emerald-500'
                  }`}>
                    {resolved.seoDescription.length} chars
                  </span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${resolved.seoDescription.length > 160 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${Math.min(100, (resolved.seoDescription.length / 160) * 100)}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  {resolved.seoDescription.length > 160 ? 'Exceeds 160 characters, trailing sentences may be clipped.' : 'Well-proportioned summary snippet.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: SOCIAL SHARE CARD (OPEN GRAPH & TWITTER) */}
        {/* ========================================================================= */}
        {activeTab === 'social_preview' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Social Sharing Card (OpenGraph / X Twitter Card)
                </h4>
                <p className="text-[11px] text-slate-500">
                  How this report appears when shared across LinkedIn, Facebook, X, and messaging apps.
                </p>
              </div>

              {/* Platform Switch */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setSocialPlatform('facebook')}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                    socialPlatform === 'facebook'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Facebook / LinkedIn
                </button>
                <button
                  type="button"
                  onClick={() => setSocialPlatform('twitter')}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                    socialPlatform === 'twitter'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  X (Twitter)
                </button>
              </div>
            </div>

            {/* Social Card Mockup */}
            <div className="max-w-md mx-auto border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-md">
              <div className="aspect-[1.91/1] w-full bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                {resolved.ogImage ? (
                  <img
                    src={resolved.ogImage}
                    alt={resolved.altText}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs">
                    <Globe className="w-8 h-8 mb-2 opacity-50" />
                    <span>Featured cover image will be used as the social card</span>
                  </div>
                )}
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 border-t border-gray-100 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                  THEGEOPACTS.COM
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug mb-1">
                  {resolved.ogTitle}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {resolved.ogDescription}
                </p>
              </div>
            </div>

            {/* Social Overrides Form */}
            <div className="pt-2 border-t border-gray-200 dark:border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Social Media Custom Overrides (Optional)
              </span>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Social Title (Defaults to SEO Title)
                </label>
                <input
                  type="text"
                  value={article.ogTitle || ''}
                  onChange={(e) => onChange({ ogTitle: e.target.value })}
                  placeholder={resolved.seoTitle}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Social Description (Defaults to Meta Description)
                </label>
                <input
                  type="text"
                  value={article.ogDescription || ''}
                  onChange={(e) => onChange({ ogDescription: e.target.value })}
                  placeholder={resolved.seoDescription}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-red-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: INTERNAL LINKING ASSISTANT */}
        {/* ========================================================================= */}
        {activeTab === 'internal_links' && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Internal Linking Tool &amp; Cross-Reference Finder
                </h4>
                <span className="text-[11px] text-slate-500">
                  {seoAnalysis.metrics.hasInternalLinks ? (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Internal link present in draft
                    </span>
                  ) : (
                    <span className="text-amber-600 font-medium">
                      No internal links detected yet
                    </span>
                  )}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Adding 1–3 contextual links to related investigative stories, analytical backgrounds, or dossiers boosts page authority and keeps readers engaged.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={linkSearchQuery}
                onChange={(e) => setLinkSearchQuery(e.target.value)}
                placeholder="Search published articles by title, topic, or category to link..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-red-500"
              />
            </div>

            {/* List of articles to link */}
            <div className="border border-gray-200 dark:border-slate-800 rounded-xl divide-y divide-gray-200 dark:divide-slate-800 max-h-64 overflow-y-auto">
              {filteredInternalArticles.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  No matching articles found. Try another query.
                </div>
              ) : (
                filteredInternalArticles.map(art => {
                  const targetUrl = `/article/${art.slug || art.id}`;
                  const fullUrl = `https://thegeopacts.com${targetUrl}`;
                  const isCopied = copiedLink === targetUrl || copiedLink === fullUrl;

                  return (
                    <div key={art.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center justify-between gap-3 transition-colors">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold rounded">
                            {art.category}
                          </span>
                          <span className="text-[10px] text-slate-400">{art.date}</span>
                        </div>
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {art.title}
                        </h5>
                        <p className="text-[11px] text-slate-500 font-mono truncate">
                          {targetUrl}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleCopyLink(targetUrl)}
                          className="px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded flex items-center gap-1 cursor-pointer"
                          title="Copy permalink"
                        >
                          {isCopied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          <span>{isCopied ? 'Copied' : 'Copy'}</span>
                        </button>

                        {onInsertLink && (
                          <button
                            type="button"
                            onClick={() => onInsertLink(art.title, targetUrl)}
                            className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded flex items-center gap-1 shadow-2xs cursor-pointer"
                            title="Insert link directly into article text"
                          >
                            <Link2 className="w-3 h-3" />
                            <span>Insert Link</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg text-xs text-slate-500">
              <strong className="text-slate-700 dark:text-slate-300">Linking Tip:</strong> Highlight relevant words in your article body (e.g., <em>"economic sanctions"</em>, <em>"clean energy roadmap"</em>), then click <strong>Insert Link</strong> or paste the permalink.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
