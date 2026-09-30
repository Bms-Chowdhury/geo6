import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, 
  List, 
  AlignJustify, 
  Sparkles, 
  TrendingUp, 
  Flame, 
  Award, 
  Filter, 
  X, 
  BookmarkCheck,
  CheckCircle2
} from 'lucide-react';
import { TopBar } from './components/TopBar';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import { HeroShowcase } from './components/HeroShowcase';
import { PostCard } from './components/PostCard';
import { Sidebar } from './components/Sidebar';
import { VideoSection } from './components/VideoSection';
import { TechSpotlightSection } from './components/TechSpotlightSection';
import { VisualStoriesSection } from './components/VisualStoriesSection';
import { LatestGridSection } from './components/LatestGridSection';
import { ReviewsVideoSection } from './components/ReviewsVideoSection';
import { SmartphonesListSection } from './components/SmartphonesListSection';
import { GadgetsShowcaseSection } from './components/GadgetsShowcaseSection';
import { Footer } from './components/Footer';
import { INITIAL_POSTS, CATEGORIES } from './data/posts';
import { INITIAL_AD_SETTINGS } from './data/adConfig';
import { Post, Language, Theme, ViewMode, FilterTab, AdSettings, AppUser, UserRole } from './types';
import { AdBanner } from './components/AdBanner';
import { INITIAL_USERS } from './data/rbacConfig';
import { 
  getCachedArticles, 
  getCachedArticleDetail, 
  getCachedAdSettings, 
  saveAdSettings,
  invalidateCache,
  getSupabaseCurrentUser,
  saveArticleToSupabase,
  createArticleInSupabase,
  isSupabaseConfigured
} from './lib/supabase';

// Code-split heavy modals to minimize initial bundle size and maximize mobile FCP/LCP
const ArticleReaderModal = React.lazy(() => import('./components/ArticleReaderModal').then(m => ({ default: m.ArticleReaderModal })));
const CreatePostModal = React.lazy(() => import('./components/CreatePostModal').then(m => ({ default: m.CreatePostModal })));
const NewsroomAdminModal = React.lazy(() => import('./components/NewsroomAdminModal').then(m => ({ default: m.NewsroomAdminModal })));
const AboutModal = React.lazy(() => import('./components/AboutModal').then(m => ({ default: m.AboutModal })));
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { StealthSecurityGateway } from './components/StealthSecurityGateway';
import {
  isSecretGateAuthorized,
  detectHackerProbe,
  scrubUrlSecret,
  logSecurityEvent
} from './lib/stealthSecurity';

export default function App() {
  // 0. RBAC User and Session state
  const [currentUser, setCurrentUser] = useState<AppUser>(() => {
    const saved = localStorage.getItem('thegeopacts_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email && !parsed.email.includes('example.com') && (parsed.role === 'super_admin' || parsed.role === 'admin')) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_USERS[0]; // M2 Babu (Super Admin)
  });

  const [currentToken, setCurrentToken] = useState<string>(() => {
    const saved = localStorage.getItem('thegeopacts_token');
    return (saved && !saved.includes('sarah')) ? saved : 'token-superadmin-m2';
  });

  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [activePage, setActivePage] = useState<'home' | 'about' | 'contact'>('home');

  // 1. Language state (defaults to Bengali with toggle to English)
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('thegeopacts_lang');
    return (saved === 'en' || saved === 'bn') ? saved : 'bn';
  });

  // 2. Theme state (Light / Dark)
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('thegeopacts_theme');
    return (saved === 'dark' || saved === 'light') ? saved : 'light';
  });

  // 3. Posts state with localStorage persistence
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('thegeopacts_posts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_POSTS;
  });

  // 4. Saved/Bookmarked post IDs
  const [savedPostIds, setSavedPostIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('thegeopacts_bookmarks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return ['post-1'];
  });

  // 5. Liked post IDs
  const [likedPostIds, setLikedPostIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('thegeopacts_likes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  // 6. Ad Configuration & Management state
  const [adSettings, setAdSettings] = useState<AdSettings>(() => {
    const saved = localStorage.getItem('thegeopacts_ad_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_AD_SETTINGS;
  });

  // 8. Navigation, filtering and view modes
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);
  const [filterTab, setFilterTab] = useState<FilterTab>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // 9. Modals & Reader state
  const [activeArticle, setActiveArticle] = useState<Post | null>(null);
  const [isPublisherOpen, setIsPublisherOpen] = useState(false);
  const [isStealthGatewayOpen, setIsStealthGatewayOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Open Admin Portal (if Supabase authenticated, opens directly; otherwise prompts Stealth Gateway)
  const handleOpenAdminPortal = () => {
    if (currentUser?.email && !currentUser.email.includes('example.com')) {
      setIsPublisherOpen(true);
    } else {
      setIsStealthGatewayOpen(true);
    }
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('thegeopacts_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Inject Adsterra Global Scripts (Popunder & Social Bar) dynamically
  useEffect(() => {
    const popunder = adSettings.adsterra?.popunderCode?.trim();
    const socialBar = adSettings.adsterra?.socialBarCode?.trim();

    if (!popunder && !socialBar) return;

    const injectedElements: HTMLElement[] = [];

    const injectSnippet = (code: string, prefix: string) => {
      if (!code) return;
      try {
        const dummy = document.createElement('div');
        dummy.innerHTML = code;
        const scripts = dummy.querySelectorAll('script');

        scripts.forEach((oldScript, idx) => {
          const script = document.createElement('script');
          Array.from(oldScript.attributes).forEach(attr => {
            script.setAttribute(attr.name, attr.value);
          });
          if (oldScript.innerHTML) {
            script.innerHTML = oldScript.innerHTML;
          }
          script.id = `${prefix}-${idx}`;
          document.body.appendChild(script);
          injectedElements.push(script);
        });
      } catch (err) {
        console.warn(`[Adsterra] Failed to inject ${prefix}:`, err);
      }
    };

    if (popunder) injectSnippet(popunder, 'adsterra-popunder');
    if (socialBar) injectSnippet(socialBar, 'adsterra-socialbar');

    return () => {
      injectedElements.forEach(el => {
        try { el.remove(); } catch (e) {}
      });
    };
  }, [adSettings.adsterra?.popunderCode, adSettings.adsterra?.socialBarCode]);

  // Check for authenticated Supabase admin user on mount
  useEffect(() => {
    getSupabaseCurrentUser().then((sbUser) => {
      if (sbUser) {
        setCurrentUser(sbUser);
        setCurrentToken(`token-${sbUser.role}-${sbUser.id}`);
      }
    });
  }, []);

  // Secure Stealth Admin & Newsroom portal entry
  useEffect(() => {
    const checkAdminQuery = () => {
      if (typeof window === 'undefined') return;

      // 1. Trap automated probes attempting predictable dictionary words (/admin, ?admin, /login, #admin, wp-admin, etc.)
      if (detectHackerProbe()) {
        scrubUrlSecret();
        // Return without opening anything - complete dead-end for scanners & bots!
        return;
      }

      // 2. ONLY validate cryptographically unguessable secret entrance key (?vault=... or #vault-...)
      if (isSecretGateAuthorized()) {
        scrubUrlSecret();
        logSecurityEvent('gate_accessed', 'Authorized stealth entrance accessed via secret token.');
        handleOpenAdminPortal();
      }
    };

    checkAdminQuery();
    window.addEventListener('popstate', checkAdminQuery);
    window.addEventListener('hashchange', checkAdminQuery);
    return () => {
      window.removeEventListener('popstate', checkAdminQuery);
      window.removeEventListener('hashchange', checkAdminQuery);
    };
  }, [currentUser]);



  useEffect(() => {
    localStorage.setItem('thegeopacts_token', currentToken);
  }, [currentToken]);

  useEffect(() => {
    localStorage.setItem('thegeopacts_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('thegeopacts_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('thegeopacts_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('thegeopacts_bookmarks', JSON.stringify(savedPostIds));
  }, [savedPostIds]);

  useEffect(() => {
    localStorage.setItem('thegeopacts_likes', JSON.stringify(likedPostIds));
  }, [likedPostIds]);

  useEffect(() => {
    localStorage.setItem('thegeopacts_ad_settings', JSON.stringify(adSettings));
  }, [adSettings]);

  const handleSwitchRole = (role: UserRole) => {
    const matched = INITIAL_USERS.find((u) => u.role === role) || (role === 'super_admin' ? INITIAL_USERS[0] : INITIAL_USERS[1]);
    setCurrentUser(matched);
    setCurrentToken(matched.role === 'super_admin' ? 'token-superadmin-sarah' : 'token-admin-marcus');
    showToast(
      role === 'super_admin' 
        ? 'Switched to Super Admin (Sarah Jenkins) - Full System Permissions' 
        : 'Switched to Admin (Marcus Vance) - Editorial & Media Role'
    );
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleToggleSave = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (savedPostIds.includes(postId)) {
      setSavedPostIds((prev) => prev.filter((id) => id !== postId));
      showToast(language === 'bn' ? 'সংরক্ষণ তালিকা থেকে অপসারণ করা হয়েছে' : 'Removed from bookmarks');
    } else {
      setSavedPostIds((prev) => [...prev, postId]);
      showToast(language === 'bn' ? 'সংরক্ষিত তালিকায় যোগ করা হয়েছে' : 'Saved to bookmarks');
    }
  };

  const handleLikePost = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const alreadyLiked = likedPostIds.includes(postId);
    if (alreadyLiked) {
      setLikedPostIds((prev) => prev.filter((id) => id !== postId));
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, likes: Math.max(0, p.likes - 1) } : p))
      );
    } else {
      setLikedPostIds((prev) => [...prev, postId]);
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p))
      );
      showToast(language === 'bn' ? 'পছন্দ করা হয়েছে!' : 'Story Liked!');
    }
  };

  const handleUpdateAdSettings = (newSettings: AdSettings) => {
    setAdSettings(newSettings);
    localStorage.setItem('thegeopacts_ad_settings', JSON.stringify(newSettings));
    saveAdSettings(newSettings);
  };

  // Hydrate fresh data with Cache-First SWR strategy (avoids unnecessary database requests)
  useEffect(() => {
    let isMounted = true;
    getCachedArticles({ limit: 40 })
      .then((fresh) => {
        if (isMounted && fresh && fresh.length > 0) {
          setPosts(fresh);
        }
      })
      .catch(console.error);

    getCachedAdSettings()
      .then((freshAds) => {
        if (isMounted && freshAds) {
          setAdSettings(freshAds);
        }
      })
      .catch(console.error);

    return () => {
      isMounted = false;
    };
  }, []);

  const handlePublishPost = (newPost: Post) => {
    invalidateCache('articles');
    setPosts((prev) => [newPost, ...prev]);

    if (isSupabaseConfigured()) {
      createArticleInSupabase(newPost).catch((err) => {
        console.warn('Could not save post to Supabase:', err);
      });
    }

    showToast(language === 'bn' ? 'নতুন পোস্ট সফলভাবে প্রকাশিত হয়েছে!' : 'New post published successfully!');
  };

  const handleOpenArticle = async (post: Post) => {
    // Increment view count locally in client state (Rule 4: ZERO Supabase writes for pageviews!)
    setPosts((prev) =>
      prev.map((p) => (p.id === post.id ? { ...p, views: p.views + 1 } : p))
    );
    setActiveArticle({ ...post, views: post.views + 1 });

    // If article body is minimal (from list projection query), load full article detail
    if (!post.content || post.content === post.excerpt) {
      const full = await getCachedArticleDetail(post.id);
      if (full) {
        setActiveArticle((prev) => (prev && prev.id === post.id ? { ...full, views: prev.views } : prev));
        setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...full, views: p.views } : p)));
      }
    }
  };

  const handleSelectBreakingNews = (headline: string) => {
    const matched = posts.find(
      (p) =>
        p.title.toLowerCase().includes(headline.slice(0, 15).toLowerCase()) ||
        p.titleBn.includes(headline.slice(0, 10))
    );
    if (matched) {
      handleOpenArticle(matched);
    }
  };

  // Filter logic
  let filteredPosts = [...posts];

  // Category filter
  if (selectedCategory === 'saved') {
    filteredPosts = filteredPosts.filter((p) => savedPostIds.includes(p.id));
  } else if (selectedCategory !== 'all') {
    filteredPosts = filteredPosts.filter((p) => p.categorySlug === selectedCategory);
  }

  // Tag filter
  if (selectedTag) {
    filteredPosts = filteredPosts.filter((p) => p.tags.includes(selectedTag));
  }

  // Sub tab filter
  if (filterTab === 'trending') {
    filteredPosts = filteredPosts.filter((p) => p.isTrending || p.views > 9000);
  } else if (filterTab === 'popular') {
    filteredPosts = [...filteredPosts].sort((a, b) => b.views - a.views);
  } else if (filterTab === 'editors_pick') {
    filteredPosts = filteredPosts.filter((p) => p.isEditorsPick || p.isFeatured);
  }

  // Search query filter (if active in main feed)
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filteredPosts = filteredPosts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.titleBn.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.excerptBn.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  // Active Category Meta info
  const activeCategoryObj = CATEGORIES.find((c) => c.slug === selectedCategory);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-[#f8f9fa] text-slate-800'}`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-950 px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold border border-slate-700 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Top Bar */}
      <TopBar
        language={language}
        setLanguage={setLanguage}
        theme={theme}
        toggleTheme={toggleTheme}
        onSelectBreakingNews={handleSelectBreakingNews}
      />

      {/* 2. Main Header (Pure Public Masthead & Ad Slot) */}
      <Header
        language={language}
        adSettings={adSettings}
        onResetToHome={() => {
          setActivePage('home');
          setSelectedCategory('all');
          setSelectedTag(undefined);
          setFilterTab('all');
          setSearchQuery('');
        }}
      />

      {/* 3. Sticky Navigation & Mega Menu */}
      <Navbar
        language={language}
        selectedCategory={selectedCategory}
        onSelectCategory={(slug) => {
          setActivePage('home');
          setSelectedCategory(slug);
          setSelectedTag(undefined);
        }}
        posts={posts}
        bookmarksCount={savedPostIds.length}
        onOpenArticle={handleOpenArticle}
        searchQuery={searchQuery}
        setSearchQuery={(query) => {
          if (query.trim()) setActivePage('home');
          setSearchQuery(query);
        }}
        onSelectSaved={() => {
          setActivePage('home');
          setSelectedCategory('saved');
          setSelectedTag(undefined);
        }}
        activePage={activePage}
        onSelectPage={(page) => {
          setActivePage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activePage === 'about' ? (
          <AboutPage
            language={language}
            onNavigateHome={() => {
              setActivePage('home');
              setSelectedCategory('all');
              setSelectedTag(undefined);
              setFilterTab('all');
              setSearchQuery('');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : activePage === 'contact' ? (
          <ContactPage
            language={language}
          />
        ) : (
          <>
            {/* Top Leaderboard 970x90 / 728x90 Billboard Ad Slot */}
            <AdBanner
              slotType="top_leaderboard"
              settings={adSettings}
              language={language}
            />

        {/* Active Filters / Category Banner if filtering */}
        {(selectedCategory !== 'all' || selectedTag || searchQuery.trim()) && (
          <div className="mb-6 p-4 sm:p-5 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {selectedCategory === 'saved'
                    ? language === 'bn' ? 'সংরক্ষিত প্রতিবেদনসমূহ' : 'Saved Bookmarks'
                    : selectedTag
                    ? `#${selectedTag}`
                    : searchQuery.trim()
                    ? `${language === 'bn' ? 'অনুসন্ধানের ফলাফল:' : 'Search Results for:'} "${searchQuery}"`
                    : activeCategoryObj
                    ? language === 'bn' ? activeCategoryObj.nameBn : activeCategoryObj.name
                    : 'Filtered Articles'}
                </h2>
                <span className="text-xs font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full">
                  {filteredPosts.length}
                </span>
              </div>
              {activeCategoryObj && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {activeCategoryObj.description}
                </p>
              )}
            </div>

            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedTag(undefined);
                setSearchQuery('');
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 dark:bg-red-950/40 px-3 py-1.5 rounded-lg transition-colors shrink-0 self-start sm:self-center"
            >
              <X className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'ফিল্টার মুছুন' : 'Clear Filter'}</span>
            </button>
          </div>
        )}

        {/* 4. Top Hero Featured Showcase (Shown on Home view when no filter is active) */}
        {selectedCategory === 'all' && !selectedTag && !searchQuery.trim() && (
          <HeroShowcase
            posts={posts.filter((p) => p.isFeatured || p.isTrending)}
            language={language}
            onOpenArticle={handleOpenArticle}
            savedPostIds={savedPostIds}
            onToggleSave={handleToggleSave}
          />
        )}

        {/* 5. Main Grid + Sidebar Layout */}
        {(() => {
          const isHomeFeed = selectedCategory === 'all' && !selectedTag && !searchQuery.trim() && filterTab === 'all';

          const techSpotlightPosts = posts.filter(
            (p) => p.categorySlug === 'tech' || p.categoryBn === 'প্রযুক্তি' || p.tags.includes('Tech')
          );

          const visualStoriesPosts = posts.filter(
            (p) => p.id.startsWith('post-story-') || p.tags.includes('Autonomous') || p.tags.includes('Hardware')
          );

          const latestGridPosts = posts.filter(
            (p) => !p.id.startsWith('post-story-') && p.id !== 'post-1'
          );

          const reviewsVideoPosts = posts.filter(
            (p) => p.tags.includes('Review') || p.tags.includes('Display') || p.tags.includes('Wearables') || p.id.startsWith('post-phone-')
          );

          const smartphonePosts = posts.filter(
            (p) => p.id.startsWith('post-phone-') || p.tags.includes('Samsung') || p.tags.includes('Flagship') || p.tags.includes('Deals')
          );

          const gadgetPosts = posts.filter(
            (p) => p.id.startsWith('post-gadget-') || p.tags.includes('Gadgets') || p.tags.includes('SmartHome') || p.tags.includes('Audio')
          );

          return (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Main Content Column */}
              <div className="lg:col-span-8">
                {isHomeFeed ? (
                  /* 1. Complete Redesigned Home Feed (Matching Screenshot Exactly) */
                  <div className="space-y-2">
                    {/* Section 1: প্রযুক্তি (Tech Spotlight: 1 Large + 4 Stacked) */}
                    <TechSpotlightSection
                      posts={techSpotlightPosts}
                      language={language}
                      onOpenArticle={handleOpenArticle}
                      onViewAll={() => setSelectedCategory('tech')}
                    />

                    {/* Section 2: টেক স্টোরিজ (Tech Stories: 3 Tall Portrait Cards) */}
                    <VisualStoriesSection
                      posts={visualStoriesPosts}
                      language={language}
                      onOpenArticle={handleOpenArticle}
                      onViewAll={() => setSelectedCategory('tech')}
                    />

                    {/* Section 3: সাম্প্রতিক সংবাদ (Latest Posts: 2-Column Grid + Load More) */}
                    <LatestGridSection
                      posts={latestGridPosts}
                      language={language}
                      onOpenArticle={handleOpenArticle}
                      onViewAll={() => setFilterTab('all')}
                    />

                    {/* Native In-Feed Responsive Ad Banner (Preserved Ad Placement) */}
                    <div className="my-8">
                      <AdBanner
                        slotType="in_feed"
                        settings={adSettings}
                        language={language}
                      />
                    </div>

                    {/* Section 4: রিভিউ ও ভিডিও স্পটলাইট (Reviews & Multimedia: Dark Theme Box) */}
                    <ReviewsVideoSection
                      posts={reviewsVideoPosts}
                      language={language}
                      onOpenArticle={handleOpenArticle}
                      onViewAll={() => setSelectedCategory('tech')}
                    />

                    {/* Section 5: স্মার্টফোন ও উদ্ভাবন (Smartphones: 4 Horizontal List Cards) */}
                    <SmartphonesListSection
                      posts={smartphonePosts}
                      language={language}
                      onOpenArticle={handleOpenArticle}
                      onViewAll={() => setSelectedCategory('tech')}
                    />

                    {/* Strategic Intelligence Briefing Banner */}
                    <div className="my-8 p-5 bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white rounded-2xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 border border-blue-500/20">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2.5 py-0.5 rounded text-blue-200">
                          THE GEOPACTS GLOBAL INTELLIGENCE REPORT
                        </span>
                        <h4 className="text-sm sm:text-base font-bold mt-1.5 leading-snug">
                          {language === 'bn' ? 'আন্তর্জাতিক ভূরাজনীতি, প্রযুক্তি নিরাপত্তা ও কৌশলগত নীতি প্রতিবেদন ২০২৬' : 'Global Geopolitics & AI Security Annual Strategic Review 2026'}
                        </h4>
                        <p className="text-xs text-blue-100/80 mt-1">
                          {language === 'bn' ? 'বিশ্বের শীর্ষ নীতি বিশেষজ্ঞ ও অর্থনীতিবিদদের যৌথ বিশ্লেষণ।' : 'Comprehensive peer-reviewed strategic dispatches for global policy leaders.'}
                        </p>
                      </div>
                      <button 
                        onClick={() => setIsAboutOpen(true)}
                        className="px-4 py-2.5 bg-white text-blue-900 hover:bg-blue-50 text-xs font-bold rounded-lg shadow transition-colors shrink-0"
                      >
                        {language === 'bn' ? 'প্রতিবেদন দেখুন' : 'Explore Briefing'}
                      </button>
                    </div>

                    {/* Section 6: গ্যাজেটস ও দৈনন্দিন প্রযুক্তি (Gadgets: 1 Wide Banner + 4 Cards Grid) */}
                    <GadgetsShowcaseSection
                      posts={gadgetPosts}
                      language={language}
                      onOpenArticle={handleOpenArticle}
                      onViewAll={() => setSelectedCategory('tech')}
                    />
                  </div>
                ) : (
                  /* 2. Filtered Stream / Custom Tabs Stream */
                  <div className="space-y-6">
                    {/* Feed Control Bar: Tabs & View Switcher */}
                    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 shadow-sm">
                      {/* Tab Pills */}
                      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
                        <button
                          onClick={() => setFilterTab('all')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                            filterTab === 'all'
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          {language === 'bn' ? 'সব খবর' : 'All Stories'}
                        </button>
                        <button
                          onClick={() => setFilterTab('trending')}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                            filterTab === 'trending'
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>{language === 'bn' ? 'ট্রেন্ডিং' : 'Trending'}</span>
                        </button>
                        <button
                          onClick={() => setFilterTab('popular')}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                            filterTab === 'popular'
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <Flame className="w-3.5 h-3.5" />
                          <span>{language === 'bn' ? 'জনপ্রিয়' : 'Popular'}</span>
                        </button>
                        <button
                          onClick={() => setFilterTab('editors_pick')}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                            filterTab === 'editors_pick'
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>{language === 'bn' ? 'সম্পাদকের পছন্দ' : "Editor's Pick"}</span>
                        </button>
                      </div>

                      {/* View Mode Controls */}
                      <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-slate-500 dark:text-slate-400">
                        <button
                          onClick={() => setViewMode('grid')}
                          className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'hover:text-slate-800 dark:hover:text-white'}`}
                          title="Grid View"
                          aria-label="Grid View"
                        >
                          <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setViewMode('list')}
                          className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'hover:text-slate-800 dark:hover:text-white'}`}
                          title="List View"
                          aria-label="List View"
                        >
                          <List className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setViewMode('compact')}
                          className={`p-1.5 rounded ${viewMode === 'compact' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'hover:text-slate-800 dark:hover:text-white'}`}
                          title="Compact View"
                          aria-label="Compact View"
                        >
                          <AlignJustify className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Articles Stream */}
                    {filteredPosts.length === 0 ? (
                      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-12 text-center">
                        <BookmarkCheck className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                        <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
                          {language === 'bn' ? 'কোন প্রতিবেদন খুঁজে পাওয়া যায়নি' : 'No articles found in this selection'}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                          {language === 'bn'
                            ? 'অনুগ্রহ করে অন্য কোন বিভাগ নির্বাচন করুন বা ভিন্ন কি-ওয়ার্ড দিয়ে অনুসন্ধান করুন।'
                            : 'Please select a different category or try searching with different keywords.'}
                        </p>
                      </div>
                    ) : (
                      <div
                        className={
                          viewMode === 'grid'
                            ? 'grid grid-cols-1 sm:grid-cols-2 gap-5'
                            : 'space-y-4'
                        }
                      >
                        {filteredPosts.map((post, index) => (
                          <React.Fragment key={post.id}>
                            <PostCard
                              post={post}
                              language={language}
                              viewMode={viewMode}
                              onOpenArticle={handleOpenArticle}
                              isSaved={savedPostIds.includes(post.id)}
                              onToggleSave={handleToggleSave}
                              onLike={handleLikePost}
                              liked={likedPostIds.includes(post.id)}
                            />

                            {/* Native In-Feed Responsive Ad Banner */}
                            {index === 1 && (
                              <div className={viewMode === 'grid' ? 'col-span-1 sm:col-span-2' : ''}>
                                <AdBanner
                                  slotType="in_feed"
                                  settings={adSettings}
                                  language={language}
                                />
                              </div>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Sidebar Column */}
              <div className="lg:col-span-4">
                <Sidebar
                  posts={posts}
                  language={language}
                  onOpenArticle={handleOpenArticle}
                  onSelectCategory={(slug) => {
                    setSelectedCategory(slug);
                    setSelectedTag(undefined);
                  }}
                  onSelectTag={(tag) => setSelectedTag(tag)}
                  selectedTag={selectedTag}
                  adSettings={adSettings}
                />
              </div>
            </div>
          );
        })()}
          </>
        )}
      </main>

      {/* Lazy Loaded Modals - only fetched when opened */}
      <React.Suspense fallback={null}>
        {/* 6. Full Article Reader Modal */}
        {activeArticle && (
          <ArticleReaderModal
            post={activeArticle}
            onClose={() => setActiveArticle(null)}
            language={language}
            onLikePost={handleLikePost}
            isLiked={likedPostIds.includes(activeArticle.id)}
            isSaved={savedPostIds.includes(activeArticle.id)}
            onToggleSave={handleToggleSave}
            allPosts={posts}
            onSelectRelated={handleOpenArticle}
            adSettings={adSettings}
          />
        )}

        {/* 7. Newsroom CMS & Centralized Monetization / Ads Control System */}
        {isPublisherOpen && (
          <NewsroomAdminModal
            isOpen={isPublisherOpen}
            onClose={() => setIsPublisherOpen(false)}
            language={language}
            currentUser={currentUser}
            currentToken={currentToken}
            onSwitchRole={handleSwitchRole}
            onUserAuthenticated={(user) => {
              setCurrentUser(user);
              setCurrentToken(`token-${user.role}-${user.id}`);
            }}
            adSettings={adSettings}
            onUpdateAdSettings={handleUpdateAdSettings}
            onArticleCreated={(newPost) => {
              setPosts((prev) => [newPost, ...prev]);
              showToast(`Article published: "${newPost.title.slice(0, 30)}..."`);
            }}
            onArticleUpdated={(updated) => {
              setPosts((prev) => prev.map((p) => p.id === updated.id ? { ...p, ...updated } : p));
              showToast(`Article updated: "${updated.title.slice(0, 30)}..."`);
            }}
            onArticleDeleted={(deletedId) => {
              setPosts((prev) => prev.filter((p) => p.id !== deletedId));
              showToast('Article removed from publication');
            }}
          />
        )}

        {/* 8. About The GeoPacts & Editorial Transparency Modal */}
        {isAboutOpen && (
          <AboutModal
            isOpen={isAboutOpen}
            onClose={() => setIsAboutOpen(false)}
            language={language}
          />
        )}
      </React.Suspense>

      {/* 9. Stealth Security & Anti-Hacker Gateway Modal */}
      <StealthSecurityGateway
        isOpen={isStealthGatewayOpen}
        language={language}
        onClose={() => setIsStealthGatewayOpen(false)}
        onAuthenticated={(user) => {
          setCurrentUser(user);
          setCurrentToken(`token-${user.role}-${user.id}`);
          setIsStealthGatewayOpen(false);
          setIsPublisherOpen(true);
        }}
      />

      {/* Magazine Footer */}
      <Footer
        language={language}
        onStealthTrigger={handleOpenAdminPortal}
        onSelectCategory={(slug) => {
          setActivePage('home');
          setSelectedCategory(slug);
          setSelectedTag(undefined);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        recentPosts={posts}
        onOpenArticle={handleOpenArticle}
        onOpenAbout={() => {
          setActivePage('about');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectPage={(page) => {
          setActivePage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Sticky Anchor / Overlay Ad */}
      <AdBanner
        slotType="sticky_anchor"
        settings={adSettings}
        language={language}
      />
    </div>
  );
}

