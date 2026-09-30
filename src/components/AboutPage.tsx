import React from 'react';
import { 
  Heart, 
  Target, 
  Eye, 
  Users, 
  Globe, 
  BookOpen, 
  ArrowRight
} from 'lucide-react';
import { Language } from '../types';

interface AboutPageProps {
  language: Language;
  onNavigateHome: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ language, onNavigateHome }) => {
  return (
    <div className="min-h-screen pt-4 sm:pt-8 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header matching engliana */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            {language === 'bn' ? 'আমাদের সম্পর্কে' : 'About The GeoPacts'}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            {language === 'bn'
              ? 'আমরা বিশ্বাস করি সবার স্বাধীন, নিরপেক্ষ ও গভীরভাবে তথ্যভিত্তিক ভূরাজনৈতিক বিশ্লেষণ পাওয়ার অধিকার রয়েছে। আন্তর্জাতিক কূটনীতি ও অর্থনীতিকে সবার জন্য সহজবোধ্য করাই আমাদের লক্ষ্য।'
              : 'We believe everyone deserves fearless journalism, rigorous geopolitical analysis, and transparent global insights. Our mission is to make international affairs accessible, practical, and deeply informed.'}
          </p>
        </div>

        {/* Our Story Card matching engliana */}
        <div className="mb-12 rounded-2xl bg-gradient-to-br from-purple-50/90 to-indigo-50/90 dark:from-purple-950/60 dark:to-indigo-950/40 border border-purple-200 dark:border-purple-800/50 shadow-sm hover:shadow-md transition-shadow p-8 md:p-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Heart className="text-pink-500 shrink-0" size={24} />
            <span>{language === 'bn' ? 'আমাদের গল্প ও যাত্রা' : 'Our Story'}</span>
          </h2>
          <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">
            <p>
              {language === 'bn'
                ? 'দ্য জিওপ্যাক্টস (The GeoPacts)-এর যাত্রা শুরু একটি সাধারণ কিন্তু জরুরি পর্যবেক্ষণ থেকে: কোটি কোটি মানুষ প্রতিদিন ব্রেকিং নিউজ পড়েন, কিন্তু আন্তর্জাতিক চুক্তি, জ্বালানি করিডোর এবং ভূরাজনৈতিক সমীকরণের প্রকৃত প্রেক্ষাপট জানতে পারেন না।'
                : "The GeoPacts started from a simple observation: millions of people follow daily breaking headlines, yet lack systemic geopolitical context. Mainstream feeds alert you to conflicts, but rarely explain the macroeconomic treaties, energy pipelines, and diplomatic pacts operating beneath the surface."}
            </p>
            <p>
              {language === 'bn'
                ? 'আমরা উপলব্ধি করেছি আধুনিক ডিজিটাল সাংবাদিকতা অতিরিক্ত সস্তা শিরোনামের ওপর জোর দেয়, কিন্তু গভীর গবেষণামূলক ব্যাখ্যার অভাব রয়েছে। এজন্যই আমরা গড়ে তুলেছি The GeoPacts — যেখানে আপনি বৈশ্বিক কূটনীতি স্পষ্টভাবে বুঝতে পারবেন।'
                : "We realized that contemporary digital media prioritizes sensational soundbites over rigorous context. That's why we created The GeoPacts — an independent intelligence room where global citizens can understand international developments with clarity."}
            </p>
            <p>
              {language === 'bn'
                ? 'আমাদের প্রতিটি প্রতিবেদন যাচাইকৃত প্রাথমিক কূটনৈতিক দলিল, অর্থনৈতিক ডেটা এবং আন্তর্জাতিক বিশেষজ্ঞদের অনুসন্ধানের ভিত্তিতে রচিত হয়। যাতে প্রতিটি তথ্য আপনি নির্ভয়ে গ্রহণ ও উদ্ধৃত করতে পারেন।'
                : 'Our analytical dispatches are rooted in verified diplomatic sources, treaty documents, and macroeconomic indicators. Rigorously researched, clearly articulated, and accessible to all.'}
            </p>
          </div>
        </div>

        {/* Mission & Vision Grid matching engliana */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {/* Mission Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-100/90 to-indigo-50/90 dark:from-indigo-950/60 dark:to-indigo-900/40 border border-indigo-300 dark:border-indigo-800/60 shadow-md hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-xl bg-indigo-200 dark:bg-indigo-800/70 flex items-center justify-center mb-4">
              <Target className="text-indigo-700 dark:text-indigo-300" size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              {language === 'bn' ? 'আমাদের লক্ষ্য (Our Mission)' : 'Our Mission'}
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {language === 'bn'
                ? 'বিশ্বজুড়ে লাখ লাখ পাঠক, গবেষক ও কূটনীতিকদের তথ্যভিত্তিক ও নিরপেক্ষ আন্তর্জাতিক বিশ্লেষণ পৌঁছে দেওয়া যা সবার জন্য উন্মুক্ত ও সহজবোধ্য।'
                : 'To provide millions of thinkers, researchers, and global citizens with objective, fact-verified geopolitical and macroeconomic analysis that remains free and accessible to everyone.'}
            </p>
          </div>

          {/* Vision Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-100/90 to-purple-50/90 dark:from-purple-950/60 dark:to-purple-900/40 border border-purple-300 dark:border-purple-800/60 shadow-md hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-xl bg-purple-200 dark:bg-purple-800/70 flex items-center justify-center mb-4">
              <Eye className="text-purple-700 dark:text-purple-300" size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              {language === 'bn' ? 'আমাদের ভিশন (Our Vision)' : 'Our Vision'}
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {language === 'bn'
                ? 'এমন এক সচেতন বিশ্ব যেখানে প্রোপাগান্ডা বা ভুয়া তথ্য সত্যকে ঢাকতে পারবে না। যেখানে প্রতিটি মানুষ বৈশ্বিক নীতি ও চুক্তি পরিষ্কারভাবে বুঝতে সক্ষম হবেন।'
                : 'A world where disinformation and political propaganda do not obscure global truth. Where every reader can evaluate foreign policy decisions with critical clarity.'}
            </p>
          </div>
        </div>

        {/* What We Stand For Section matching engliana */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
            {language === 'bn' ? 'আমাদের মূল মূল্যবোধ' : 'What We Stand For'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Community / Integrity */}
            <div className="p-5 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-indigo-950/60 dark:to-indigo-900/40 border border-indigo-300 dark:border-indigo-800/50 shadow-sm hover:shadow-md transition-all text-center">
              <div className="w-10 h-10 rounded-lg bg-indigo-200 dark:bg-indigo-800/70 flex items-center justify-center mx-auto mb-3">
                <Users className="text-indigo-700 dark:text-indigo-300" size={20} />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                {language === 'bn' ? 'সম্পাদকীয় সততা' : 'Integrity'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {language === 'bn'
                  ? 'কোনো বাণিজ্যিক বা দলীয় প্রভাব ছাড়াই নির্ভীক সাংবাদিকতা।'
                  : 'Independent reporting without corporate or political bias. We build for real truth.'}
              </p>
            </div>

            {/* Accessibility */}
            <div className="p-5 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-950/60 dark:to-purple-900/40 border border-purple-300 dark:border-purple-800/50 shadow-sm hover:shadow-md transition-all text-center">
              <div className="w-10 h-10 rounded-lg bg-purple-200 dark:bg-purple-800/70 flex items-center justify-center mx-auto mb-3">
                <Globe className="text-purple-700 dark:text-purple-300" size={20} />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                {language === 'bn' ? 'অবাধ তথ্যভাণ্ডার' : 'Accessibility'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {language === 'bn'
                  ? 'উচ্চমানের আন্তর্জাতিক তথ্য ও বিশ্লেষণ সবার জন্য উন্মুক্ত।'
                  : 'Free, high-caliber international intelligence for everyone, everywhere.'}
              </p>
            </div>

            {/* Practicality */}
            <div className="p-5 rounded-xl bg-gradient-to-br from-pink-100 to-pink-50 dark:from-pink-950/60 dark:to-pink-900/40 border border-pink-300 dark:border-pink-800/50 shadow-sm hover:shadow-md transition-all text-center">
              <div className="w-10 h-10 rounded-lg bg-pink-200 dark:bg-pink-800/70 flex items-center justify-center mx-auto mb-3">
                <BookOpen className="text-pink-700 dark:text-pink-300" size={20} />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                {language === 'bn' ? 'বাস্তবধর্মী তথ্য' : 'Practicality'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {language === 'bn'
                  ? 'ভাসাভাসা খবরের বদলে বাস্তবসম্মত আন্তর্জাতিক দৃষ্টিভঙ্গি।'
                  : 'Real diplomatic context, not clickbait. Deep insights you can rely on.'}
              </p>
            </div>
          </div>
        </div>

        {/* Ready to Start matching engliana */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
            {language === 'bn' ? 'সর্বশেষ প্রতিবেদনে চোখ রাখুন' : 'Ready to Start?'}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {language === 'bn'
              ? 'প্রতিদিনের বৈশ্বিক কূটনীতি ও কৌশলগত বিশ্লেষণে আমাদের সাথে থাকুন।'
              : 'Join thousands of diplomats and global thinkers reading The GeoPacts every day.'}
          </p>
          <button
            type="button"
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25 cursor-pointer"
          >
            <span>{language === 'bn' ? 'সর্বশেষ প্রতিবেদন পড়ুন' : 'Explore Latest Dispatches'}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
