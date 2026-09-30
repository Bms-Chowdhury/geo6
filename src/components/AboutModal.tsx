import React from 'react';
import { X, Globe2, ShieldCheck, CheckCircle2, Award, Users } from 'lucide-react';
import { Language } from '../types';

export interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, language }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-md font-black">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                {language === 'bn' ? 'আমাদের সম্পর্কে ও সম্পাদকীয় নীতি' : 'About The GeoPacts'}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'bn' ? 'আন্তর্জাতিক সংবাদ ও বৈশ্বিক বিশ্লেষণ পোর্টাল' : 'Global Geopolitics, Economy & Tech Analysis'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-slate-700 dark:text-slate-300 text-sm leading-relaxed max-h-[75vh] overflow-y-auto">
          {/* Mission */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-red-600" />
              {language === 'bn' ? 'আমাদের লক্ষ্য ও মিশন' : 'Our Mission'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {language === 'bn'
                ? 'দ্য জিওপ্যাক্টস (The GeoPacts) একটি আন্তর্জাতিক ও নিরপেক্ষ ডিজিটাল জার্নাল। বৈশ্বিক কূটনীতি, জ্বালানি নিরাপত্তা, সামষ্টিক অর্থনীতি এবং আধুনিক প্রযুক্তির পরিবর্তনশীল গতিপ্রকৃতি বস্তুনিষ্ঠভাবে পাঠকদের সামনে উপস্থাপন করাই আমাদের মূল লক্ষ্য।'
                : 'The GeoPacts is an independent global affairs and journalism portal dedicated to delivering rigorous, impartial analysis across international diplomacy, systemic macroeconomics, defense posture, and emerging frontier technologies.'}
            </p>
          </div>

          {/* Core Values */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-gray-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-1.5">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>{language === 'bn' ? 'নির্ভরযোগ্য তথ্য যাচাই' : 'Rigorous Fact-Checking'}</span>
              </div>
              <p className="text-xs text-slate-500">
                {language === 'bn'
                  ? 'প্রতিটি সংবাদ একাধিক সরকারি নথি, আন্তর্জাতিক সংস্থা ও নিরপেক্ষ সূত্রের মাধ্যমে ক্রস-ভেরিফাই করা হয়।'
                  : 'Every report is cross-referenced with primary diplomatic sources, verified treaties, and credible wire correspondents.'}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-gray-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-1.5">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>{language === 'bn' ? 'মানবিক সম্পাদকীয় নজরদারি' : 'Human Editorial Review'}</span>
              </div>
              <p className="text-xs text-slate-500">
                {language === 'bn'
                  ? 'আমাদের সকল প্রতিবেদন অভিজ্ঞ সাংবাদিক ও সম্পাদকমণ্ডলীর পূর্ণাঙ্গ পর্যালোচনার পরই প্রকাশিত হয়।'
                  : 'All dispatches undergo rigorous peer and editorial oversight by experienced desk editors before publication.'}
              </p>
            </div>
          </div>

          {/* Editorial Masthead */}
          <div className="pt-4 border-t border-gray-200 dark:border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-red-600" />
              <span>{language === 'bn' ? 'সম্পাদকীয় নেতৃত্ব' : 'Editorial Leadership'}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-gray-200 dark:border-slate-700/60">
                <p className="font-bold text-slate-900 dark:text-white">Sarah Jenkins</p>
                <p className="text-slate-500 text-[11px]">Editor-in-Chief &amp; Foreign Affairs Director</p>
                <p className="text-slate-400 text-[10px] mt-1 font-mono">editorial@thegeopacts.com</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-gray-200 dark:border-slate-700/60">
                <p className="font-bold text-slate-900 dark:text-white">David Chen</p>
                <p className="text-slate-500 text-[11px]">Managing Editor &amp; Macroeconomics Desk</p>
                <p className="text-slate-400 text-[10px] mt-1 font-mono">bureaudesk@thegeopacts.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-gray-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-bold hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white transition-colors"
          >
            {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
