import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  ChevronLeft, 
  ChevronRight, 
  Pause, 
  Play, 
  Sun, 
  Moon, 
  Globe, 
  Calendar,
  Share2,
  ShieldCheck
} from 'lucide-react';
import { BREAKING_NEWS } from '../data/posts';
import { Language, Theme } from '../types';

interface TopBarProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  toggleTheme: () => void;
  onSelectBreakingNews?: (text: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  language,
  setLanguage,
  theme,
  toggleTheme,
  onSelectBreakingNews
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      if (language === 'bn') {
        const options: Intl.DateTimeFormatOptions = { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        };
        setCurrentDate(now.toLocaleDateString('bn-BD', options));
      } else {
        const options: Intl.DateTimeFormatOptions = { 
          weekday: 'short', 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        };
        setCurrentDate(now.toLocaleDateString('en-US', options));
      }
    };
    updateTime();
  }, [language]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BREAKING_NEWS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + BREAKING_NEWS.length) % BREAKING_NEWS.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % BREAKING_NEWS.length);
  };

  const currentItem = BREAKING_NEWS[currentIndex];
  const newsText = language === 'bn' ? currentItem.textBn : currentItem.text;

  return (
    <div className="bg-[#0f172a] text-slate-300 text-xs border-b border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Breaking News Ticker */}
        <div className="flex items-center gap-2.5 flex-1 min-w-[280px]">
          <div className="flex items-center gap-1.5 bg-red-600 text-white font-bold px-2.5 py-1 rounded text-[11px] tracking-wide shrink-0 shadow-sm animate-pulse">
            <Flame className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'জরুরি সংবাদ' : 'BREAKING'}</span>
          </div>

          <div 
            className="flex-1 truncate cursor-pointer hover:text-red-400 transition-colors"
            onClick={() => onSelectBreakingNews && onSelectBreakingNews(newsText)}
            title={newsText}
          >
            <span className="font-medium">{newsText}</span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1 shrink-0 text-slate-400">
            <button
              onClick={handlePrev}
              className="p-1 hover:text-white hover:bg-slate-800 rounded transition-colors"
              aria-label="Previous headline"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1 hover:text-white hover:bg-slate-800 rounded transition-colors"
              aria-label={isPlaying ? 'Pause ticker' : 'Play ticker'}
            >
              {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </button>
            <button
              onClick={handleNext}
              className="p-1 hover:text-white hover:bg-slate-800 rounded transition-colors"
              aria-label="Next headline"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Date, Socials, Language & Theme Toggle */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="hidden md:flex items-center gap-1.5 text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>{currentDate}</span>
          </div>

          <div className="h-3 w-px bg-slate-700 hidden md:block" />

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
            className="flex items-center gap-1.5 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded font-medium transition-colors"
            title="Switch Language / ভাষা পরিবর্তন করুন"
          >
            <Globe className="w-3.5 h-3.5 text-red-400" />
            <span>{language === 'en' ? 'বাংলা' : 'English'}</span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition-colors"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-slate-200" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
