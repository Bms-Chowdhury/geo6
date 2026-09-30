import React, { useState, useEffect } from 'react';
import { 
  Facebook, 
  Youtube, 
  Instagram, 
  Mail, 
  Heart, 
  ArrowUp 
} from 'lucide-react';
import { CATEGORIES } from '../data/posts';
import { Post, Language } from '../types';

interface FooterProps {
  language: Language;
  onSelectCategory: (slug: string) => void;
  recentPosts?: Post[];
  onOpenArticle?: (post: Post) => void;
  onOpenAbout?: () => void;
  onSelectPage?: (page: 'home' | 'about' | 'contact') => void;
  onStealthTrigger?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  onSelectCategory,
  onOpenAbout,
  onSelectPage,
  onStealthTrigger
}) => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [knockCount, setKnockCount] = useState(0);

  const handleCopyrightClick = () => {
    if (!onStealthTrigger) return;
    const newCount = knockCount + 1;
    setKnockCount(newCount);
    if (newCount >= 5) {
      setKnockCount(0);
      onStealthTrigger();
    }
  };

  useEffect(() => {
    if (knockCount > 0) {
      const resetTimeout = setTimeout(() => {
        setKnockCount(0);
      }, 2500);
      return () => clearTimeout(resetTimeout);
    }
  }, [knockCount]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (page: 'home' | 'about' | 'contact') => {
    if (onSelectPage) {
      onSelectPage(page);
    } else if (page === 'about' && onOpenAbout) {
      onOpenAbout();
    }
    scrollToTop();
  };

  return (
    <>
      <footer className="bg-slate-900 dark:bg-slate-950 border-t border-slate-800 text-slate-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Main 5-Column Grid matching engliana */}
          <div className="py-12 md:py-16 grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-6">
            {/* Brand Column (col-span-2) */}
            <div className="col-span-2">
              <div 
                onClick={() => handleNavigate('home')} 
                className="flex items-center gap-2 cursor-pointer w-fit"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-500/20">
                  G
                </div>
                <span className="font-bold text-lg text-white tracking-tight">
                  The Geo<span className="text-indigo-400">Pacts</span>
                </span>
              </div>

              <p className="mt-3 text-sm text-slate-400 max-w-xs leading-relaxed">
                {language === 'bn'
                  ? 'আন্তর্জাতিক কূটনীতি, অর্থনৈতিক রূপান্তর এবং ভূরাজনৈতিক সমীকরণের নিরপেক্ষ ডিজিটাল পোর্টাল।'
                  : 'Independent global affairs, strategic diplomacy, and macroeconomic intelligence. Informed perspectives daily.'}
              </p>

              {/* Social Icons row with p-2 rounded-lg bg-slate-800 matching engliana */}
              <div className="flex items-center gap-3 mt-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size={16} />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube size={16} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={16} />
                </a>
                <a
                  href="mailto:editorial@thegeopacts.com"
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                  aria-label="Email"
                >
                  <Mail size={16} />
                </a>
              </div>
            </div>

            {/* Quick Links Column */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">
                {language === 'bn' ? 'কুইক লিংক' : 'Quick Links'}
              </h4>
              <ul className="space-y-2">
                <li>
                  <button
                    type="button"
                    onClick={() => handleNavigate('home')}
                    className="text-sm text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer"
                  >
                    {language === 'bn' ? 'হোম পেজ' : 'Home'}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleNavigate('about')}
                    className="text-sm text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer"
                  >
                    {language === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleNavigate('contact')}
                    className="text-sm text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer"
                  >
                    {language === 'bn' ? 'যোগাযোগ' : 'Contact Us'}
                  </button>
                </li>
              </ul>
            </div>

            {/* Categories Column */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">
                {language === 'bn' ? 'বিভাগসমূহ' : 'Categories'}
              </h4>
              <ul className="space-y-2">
                {CATEGORIES.slice(0, 5).map((cat) => (
                  <li key={cat.id}>
                    <button
                      type="button"
                      onClick={() => {
                        handleNavigate('home');
                        onSelectCategory(cat.slug);
                      }}
                      className="text-sm text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer text-left truncate max-w-full"
                    >
                      {language === 'bn' ? cat.nameBn : cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Column */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">
                {language === 'bn' ? 'রিসোর্স' : 'Resources'}
              </h4>
              <ul className="space-y-2">
                <li>
                  <button
                    type="button"
                    onClick={() => handleNavigate('about')}
                    className="text-sm text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer text-left"
                  >
                    {language === 'bn' ? 'সম্পাদকীয় নীতিমালা' : 'Editorial Desk'}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleNavigate('about')}
                    className="text-sm text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer text-left"
                  >
                    {language === 'bn' ? 'গবেষণা ও সত্যতা' : 'Fact & Research'}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleNavigate('contact')}
                    className="text-sm text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer text-left"
                  >
                    {language === 'bn' ? 'ফিডব্যাক ও সহায়তা' : 'Help & Inquiries'}
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar matching engliana */}
          <div className="py-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p 
              onClick={handleCopyrightClick}
              className="text-xs text-slate-500 flex items-center gap-1.5 flex-wrap justify-center sm:justify-start select-none cursor-default"
              title=""
            >
              <span>© {new Date().getFullYear()} The GeoPacts. Made with</span>
              <Heart size={12} className="inline text-red-500 fill-red-500" />
              <span>for global thinkers.</span>
            </p>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => handleNavigate('about')}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
              >
                {language === 'bn' ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}
              </button>
              <button
                type="button"
                onClick={() => handleNavigate('about')}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
              >
                {language === 'bn' ? 'ব্যবহারের শর্তাবলী' : 'Terms & Conditions'}
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Back to Top button matching engliana */}
      <button
        type="button"
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-40 p-3 rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-700 transition-all duration-300 cursor-pointer ${
          showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        aria-label="Back to top"
      >
        <ArrowUp size={18} />
      </button>
    </>
  );
};
