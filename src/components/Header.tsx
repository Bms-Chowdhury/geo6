import React from 'react';
import { Globe2 } from 'lucide-react';
import { Language, AdSettings } from '../types';
import { AdBanner } from './AdBanner';

interface HeaderProps {
  language: Language;
  onResetToHome: () => void;
  adSettings: AdSettings;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onResetToHome,
  adSettings
}) => {
  return (
    <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Masthead: The GeoPacts */}
        <div 
          onClick={onResetToHome}
          className="cursor-pointer group flex items-center gap-3 select-none shrink-0"
        >
          <div className="w-11 h-11 bg-slate-950 dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-slate-950 shadow-md group-hover:scale-105 transition-transform border border-slate-800 dark:border-white">
            <Globe2 className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <div className="flex items-center text-2xl sm:text-3xl font-black tracking-tight leading-none">
              <span className="text-slate-900 dark:text-white font-serif">The GeoPacts</span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium tracking-wide">
              {language === 'bn'
                ? 'আন্তর্জাতিক সম্পর্ক, ভূরাজনীতি ও নির্ভরযোগ্য বৈশ্বিক সাংবাদিকতা'
                : 'Modern Global News & Geopolitics Journal'}
            </p>
          </div>
        </div>

        {/* Header 728x90 Ad Placement */}
        <div className="flex-1 max-w-[728px] w-full flex justify-end">
          <AdBanner
            slotType="header_728x90"
            settings={adSettings}
            language={language}
            className="w-full"
          />
        </div>
      </div>
    </header>
  );
};



