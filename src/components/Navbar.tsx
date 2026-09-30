import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, 
  Search, 
  Bookmark, 
  ChevronDown, 
  Clock, 
  Eye, 
  X, 
  Menu,
  Sparkles,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { CATEGORIES } from '../data/posts';
import { Post, Language } from '../types';

interface NavbarProps {
  language: Language;
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
  posts: Post[];
  bookmarksCount: number;
  onOpenArticle: (post: Post) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelectSaved: () => void;
  activePage?: 'home' | 'about' | 'contact';
  onSelectPage?: (page: 'home' | 'about' | 'contact') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  selectedCategory,
  onSelectCategory,
  posts,
  bookmarksCount,
  onOpenArticle,
  searchQuery,
  setSearchQuery,
  onSelectSaved,
  activePage = 'home',
  onSelectPage
}) => {
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close mega menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node)) {
        setActiveMegaMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Filter posts for mega menu
  const getMegaMenuPosts = (categorySlug: string) => {
    return posts.filter((p) => p.categorySlug === categorySlug).slice(0, 4);
  };

  // Search matches for live Ajax dropdown
  const searchResults = searchQuery.trim()
    ? posts.filter((p) => {
        const q = searchQuery.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.titleBn.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.excerptBn.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
        );
      }).slice(0, 5)
    : [];

  return (
    <nav className="sticky top-0 z-40 bg-slate-900 text-white shadow-md border-b border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12 sm:h-14">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Primary Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center space-x-1 h-full">
            {/* Home Link */}
            <button
              onClick={() => {
                if (onSelectPage) onSelectPage('home');
                onSelectCategory('all');
                setActiveMegaMenu(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs lg:text-sm font-semibold rounded-md transition-colors ${
                activePage === 'home' && selectedCategory === 'all'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-200 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>{language === 'bn' ? 'হোম' : 'Home'}</span>
            </button>

            {/* Category Dropdowns with Mega Menu */}
            {CATEGORIES.map((cat) => {
              const isSelected = activePage === 'home' && selectedCategory === cat.slug;
              const isMegaActive = activeMegaMenu === cat.slug;

              return (
                <div
                  key={cat.id}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => setActiveMegaMenu(cat.slug)}
                >
                  <button
                    onClick={() => {
                      if (onSelectPage) onSelectPage('home');
                      onSelectCategory(cat.slug);
                      setActiveMegaMenu(null);
                    }}
                    className={`flex items-center gap-1 px-3 py-2 text-xs lg:text-sm font-semibold rounded-md transition-colors ${
                      isSelected
                        ? 'bg-red-600 text-white'
                        : 'text-slate-200 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <span>{language === 'bn' ? cat.nameBn : cat.name}</span>
                    <ChevronDown className="w-3 h-3 opacity-60" />
                  </button>
                </div>
              );
            })}

            {/* About Page Link */}
            <button
              onClick={() => {
                if (onSelectPage) onSelectPage('about');
                setActiveMegaMenu(null);
              }}
              className={`px-3 py-1.5 text-xs lg:text-sm font-semibold rounded-md transition-all ${
                activePage === 'about'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-200 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>{language === 'bn' ? 'আমাদের সম্পর্কে' : 'About'}</span>
            </button>

            {/* Contact Page Link */}
            <button
              onClick={() => {
                if (onSelectPage) onSelectPage('contact');
                setActiveMegaMenu(null);
              }}
              className={`px-3 py-1.5 text-xs lg:text-sm font-semibold rounded-md transition-all ${
                activePage === 'contact'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-200 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>{language === 'bn' ? 'যোগাযোগ' : 'Contact'}</span>
            </button>

            {/* Saved / Bookmarks Tab */}
            <button
              onClick={() => {
                if (onSelectPage) onSelectPage('home');
                onSelectSaved();
                setActiveMegaMenu(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs lg:text-sm font-semibold rounded-md transition-colors ${
                activePage === 'home' && selectedCategory === 'saved'
                  ? 'bg-red-600 text-white'
                  : 'text-slate-200 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>{language === 'bn' ? 'সংরক্ষিত' : 'Saved'}</span>
              {bookmarksCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-red-500 text-white text-[10px] font-bold rounded-full">
                  {bookmarksCount}
                </span>
              )}
            </button>
          </div>

          {/* Smart Ajax Search Trigger & Modal */}
          <div className="flex items-center gap-2">
            <div className="relative">
              {!isSearchOpen ? (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-full text-xs transition-colors border border-slate-700"
                >
                  <Search className="w-3.5 h-3.5 text-red-400" />
                  <span className="hidden sm:inline">
                    {language === 'bn' ? 'খুঁজুন...' : 'Smart Search...'}
                  </span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5 bg-slate-800 border border-red-500/50 rounded-full px-3 py-1 text-xs w-48 sm:w-64 transition-all shadow-lg">
                  <Search className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={language === 'bn' ? 'সংবাদ বা বিষয় খুঁজুন...' : 'Search news, topics...'}
                    className="bg-transparent text-white placeholder-slate-400 outline-none w-full text-xs"
                  />
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setIsSearchOpen(false);
                    }}
                    className="p-0.5 hover:text-white text-slate-400"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Instant Search Results Dropdown (Ajax Search style) */}
              {isSearchOpen && searchQuery.trim().length > 0 && (
                <div className="absolute right-0 top-11 w-72 sm:w-96 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-gray-200 dark:border-slate-800 overflow-hidden z-50 text-slate-900 dark:text-slate-100">
                  <div className="p-2.5 bg-slate-100 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-red-500" />
                      {language === 'bn' ? `পাওয়া গেছে (${searchResults.length})` : `Matches (${searchResults.length})`}
                    </span>
                    <span>The GeoPacts Instant Search</span>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-slate-800">
                    {searchResults.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-500 dark:text-slate-400">
                        {language === 'bn' ? 'কোন ফলাফল পাওয়া যায়নি।' : 'No matching stories found.'}
                      </div>
                    ) : (
                      searchResults.map((post) => (
                        <div
                          key={post.id}
                          onClick={() => {
                            onOpenArticle(post);
                            setIsSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer transition-colors flex gap-3 items-center group"
                        >
                          <img
                            src={post.imageUrl}
                            alt={post.altText || (language === 'bn' ? post.titleBn : post.title)}
                            loading="lazy"
                            decoding="async"
                            className="w-14 h-12 object-cover rounded-md shrink-0 group-hover:scale-105 transition-transform"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
                              {language === 'bn' ? post.categoryBn : post.category}
                            </span>
                            <h5 className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-red-600 transition-colors">
                              {language === 'bn' ? post.titleBn : post.title}
                            </h5>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                              <span>{language === 'bn' ? post.dateBn : post.date}</span>
                              <span>•</span>
                              <span>{post.readTime}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* The GeoPacts Mega Menu Dropdown on Hover/Desktop */}
      {activeMegaMenu && (
        <div
          ref={megaMenuRef}
          onMouseLeave={() => setActiveMegaMenu(null)}
          className="hidden md:block absolute left-0 right-0 bg-white dark:bg-slate-900 border-b-2 border-red-600 shadow-2xl z-50 text-slate-800 dark:text-slate-100 transition-all"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600" />
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  {CATEGORIES.find((c) => c.slug === activeMegaMenu)?.name} {language === 'bn' ? 'বিভাগের সেরা খবর' : 'Highlights'}
                </h4>
              </div>
              <button
                onClick={() => {
                  onSelectCategory(activeMegaMenu);
                  setActiveMegaMenu(null);
                }}
                className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                <span>{language === 'bn' ? 'সব খবর দেখুন' : 'View All in Category'}</span>
                <span>→</span>
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {getMegaMenuPosts(activeMegaMenu).map((post) => (
                <div
                  key={post.id}
                  onClick={() => {
                    onOpenArticle(post);
                    setActiveMegaMenu(null);
                  }}
                  className="group cursor-pointer rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-800/60 p-2.5 hover:shadow-md transition-all border border-gray-100 dark:border-slate-800"
                >
                  <div className="relative aspect-video rounded-md overflow-hidden mb-2">
                    <img
                      src={post.imageUrl}
                      alt={post.altText || (language === 'bn' ? post.titleBn : post.title)}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                      {language === 'bn' ? post.categoryBn : post.category}
                    </span>
                  </div>
                  <h5 className="text-xs font-bold line-clamp-2 text-slate-800 dark:text-slate-100 group-hover:text-red-600 transition-colors">
                    {language === 'bn' ? post.titleBn : post.title}
                  </h5>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {language === 'bn' ? post.dateBn : post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {post.views.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 px-4 py-3 space-y-2">
          <button
            onClick={() => {
              if (onSelectPage) onSelectPage('home');
              onSelectCategory('all');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded text-sm font-semibold flex items-center gap-2 ${
              activePage === 'home' && selectedCategory === 'all' ? 'bg-red-600 text-white' : 'text-slate-200'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>{language === 'bn' ? 'হোম' : 'Home'}</span>
          </button>

          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                if (onSelectPage) onSelectPage('home');
                onSelectCategory(cat.slug);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded text-sm font-semibold flex items-center justify-between ${
                activePage === 'home' && selectedCategory === cat.slug ? 'bg-red-600 text-white' : 'text-slate-200'
              }`}
            >
              <span>{language === 'bn' ? cat.nameBn : cat.name}</span>
            </button>
          ))}

          {/* About Page in Mobile Menu */}
          <button
            onClick={() => {
              if (onSelectPage) onSelectPage('about');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded text-sm font-semibold flex items-center justify-between ${
              activePage === 'about' ? 'bg-violet-600 text-white' : 'text-slate-200'
            }`}
          >
            <span>{language === 'bn' ? 'আমাদের সম্পর্কে (About Us)' : 'About Us'}</span>
          </button>

          {/* Contact Page in Mobile Menu */}
          <button
            onClick={() => {
              if (onSelectPage) onSelectPage('contact');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded text-sm font-semibold flex items-center justify-between ${
              activePage === 'contact' ? 'bg-violet-600 text-white' : 'text-slate-200'
            }`}
          >
            <span>{language === 'bn' ? 'যোগাযোগ (Contact Us)' : 'Contact Us'}</span>
          </button>

          <button
            onClick={() => {
              if (onSelectPage) onSelectPage('home');
              onSelectSaved();
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded text-sm font-semibold flex items-center justify-between ${
              activePage === 'home' && selectedCategory === 'saved' ? 'bg-red-600 text-white' : 'text-slate-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4" />
              <span>{language === 'bn' ? 'সংরক্ষিত' : 'Saved'}</span>
            </div>
            {bookmarksCount > 0 && (
              <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                {bookmarksCount}
              </span>
            )}
          </button>
        </div>
      )}
    </nav>
  );
};
