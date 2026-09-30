import React, { useState } from 'react';
import { 
  Sparkles, 
  ExternalLink, 
  Info, 
  X, 
  ChevronUp, 
  ChevronDown, 
  ShieldCheck 
} from 'lucide-react';
import { AdSlotType, AdSettings, Language } from '../types';

interface AdBannerProps {
  slotType: AdSlotType;
  settings: AdSettings;
  language: Language;
  onOpenAdManager?: () => void;
  className?: string;
}

export const AdCustomCodeFrame: React.FC<{
  code: string;
  minHeight?: number | string;
  className?: string;
}> = ({ code, minHeight = 90, className = '' }) => {
  const iframeDoc = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <base target="_blank">
    <style>
      * { box-sizing: border-box; }
      html, body {
        margin: 0;
        padding: 0;
        background: transparent;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        width: 100%;
        height: 100%;
      }
    </style>
  </head>
  <body>
    ${code}
  </body>
</html>`;

  return (
    <div className={`relative w-full flex items-center justify-center overflow-hidden ${className}`}>
      <iframe
        title="custom-ad-unit"
        srcDoc={iframeDoc}
        style={{ minHeight, width: '100%', border: 'none' }}
        className="w-full border-0 overflow-hidden"
        scrolling="no"
      />
    </div>
  );
};

export const AdBanner: React.FC<AdBannerProps> = ({
  slotType,
  settings,
  language,
  onOpenAdManager,
  className = ''
}) => {
  const slotConfig = settings.slots[slotType];
  const [isClosed, setIsClosed] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // If slot is explicitly disabled and we are not in inspector highlight mode
  if ((!slotConfig || !slotConfig.enabled) && !settings.highlightAdSlots) {
    return null;
  }

  if (isClosed && slotType === 'sticky_anchor') {
    return null;
  }

  // Label text
  const adLabel = language === 'bn' ? 'বিজ্ঞাপন' : 'ADVERTISEMENT';
  const sponsorLabel = language === 'bn' ? 'স্পন্সরড' : 'SPONSORED';

  // Highlight wrapper styling for publisher inspector mode
  const highlightClass = settings.highlightAdSlots
    ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-900'
    : '';

  // Direct link fallback if user configured Adsterra Direct Link
  const effectiveTargetUrl = slotConfig?.targetUrl || settings.adsterra?.directLinkUrl || '#sponsor';

  // 1. STICKY BOTTOM ANCHOR AD (Mobile 320x50 / Desktop 728x90)
  if (slotType === 'sticky_anchor') {
    return (
      <div 
        id="ad-sticky-anchor"
        className={`fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 ${
          isCollapsed ? 'translate-y-[calc(100%-24px)]' : 'translate-y-0'
        }`}
      >
        <div className="max-w-4xl mx-auto px-2 sm:px-4">
          <div className="relative bg-slate-950 text-white rounded-t-xl shadow-2xl border-t border-x border-slate-700 overflow-hidden">
            {/* Top control tab */}
            <div className="flex items-center justify-between px-3 py-1 bg-slate-900 border-b border-slate-800 text-[10px] text-slate-400">
              <div className="flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="uppercase tracking-widest text-slate-300">{adLabel}</span>
                <span className="text-slate-500">|</span>
                <span className="text-slate-400 font-mono">
                  {slotConfig?.customCode ? 'Adsterra / Custom Script' : '728x90 / 320x50 Anchor'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="p-0.5 hover:text-white rounded"
                  title={isCollapsed ? 'Expand' : 'Collapse'}
                >
                  {isCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setIsClosed(true)}
                  className="p-0.5 hover:text-red-400 rounded"
                  title="Close Ad"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Ad Content */}
            {!isCollapsed && (
              slotConfig?.customCode ? (
                <div className="p-2 bg-slate-950 flex items-center justify-center">
                  <AdCustomCodeFrame code={slotConfig.customCode} minHeight={60} />
                </div>
              ) : slotConfig?.bannerImageUrl ? (
                <div className="p-2 sm:p-2.5 flex items-center justify-center bg-slate-950">
                  <a
                    href={effectiveTargetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full max-h-[80px] overflow-hidden rounded-lg"
                  >
                    <img
                      src={slotConfig.bannerImageUrl}
                      alt={slotConfig.altText || 'Anchor Banner'}
                      className="w-full h-auto max-h-[70px] object-contain mx-auto"
                    />
                  </a>
                </div>
              ) : (
                <div className="p-2 sm:p-3 flex items-center justify-between gap-3 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500 shrink-0">
                      <Sparkles className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
                          ADSTERRA & ADSENSE READY
                        </span>
                        <span className="hidden sm:inline text-[10px] text-slate-400">
                          {language === 'bn' ? 'হাই-কনভার্সন স্টিকি ব্যানার' : 'High-CTR Sticky Anchor'}
                        </span>
                      </div>
                      <h5 className="text-xs sm:text-sm font-bold text-white mt-0.5 line-clamp-1">
                        {language === 'bn' 
                          ? 'ক্লাউডহোস্ট বিডি: ৫০% ছাড়ে আনলিমিটেড এসএসডি হোস্টিং ও ফ্রি ডোমেইন'
                          : 'CloudPro BD: 50% Off Unlimited Cloud Hosting + Free .COM Domain'}
                      </h5>
                      <p className="text-[10px] sm:text-xs text-slate-400 hidden sm:block">
                        {language === 'bn' 
                          ? 'আজই শুরু করুন আপনার নিউজ পোর্টাল ও বিজনেস ওয়েবসাইট।'
                          : 'Instant setup with 99.9% uptime SLA and 24/7 dedicated support.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={effectiveTargetUrl}
                      target={effectiveTargetUrl.startsWith('http') ? '_blank' : '_self'}
                      rel="noopener noreferrer"
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <span>{language === 'bn' ? 'অফার দেখুন' : 'Get Offer'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    );
  }

  // 2. HEADER LEADERBOARD (728x90)
  if (slotType === 'header_728x90') {
    // If Custom Adsterra / HTML script code exists
    if (slotConfig?.customCode) {
      return (
        <div className={`relative ${highlightClass} ${className}`}>
          {settings.highlightAdSlots && (
            <div className="absolute -top-3 right-0 bg-emerald-600 text-white text-[9px] font-mono px-1.5 py-0.5 rounded-t font-bold z-20 shadow">
              SLOT: HEADER (728x90) [CUSTOM SCRIPT]
            </div>
          )}
          <div className="w-full sm:w-[468px] lg:w-[728px] min-h-[90px] mx-auto rounded-xl relative overflow-hidden shadow-md border border-gray-200 dark:border-slate-800 bg-slate-950 flex items-center justify-center">
            <AdCustomCodeFrame code={slotConfig.customCode} minHeight={90} />
            <div className="absolute top-1 right-2 flex items-center gap-1 text-[8px] text-white/80 bg-black/60 px-1 py-0.5 rounded uppercase font-mono pointer-events-none">
              <span>{adLabel}</span>
            </div>
          </div>
        </div>
      );
    }

    if (slotConfig?.bannerImageUrl) {
      return (
        <div className={`relative ${highlightClass} ${className}`}>
          {settings.highlightAdSlots && (
            <div className="absolute -top-3 right-0 bg-emerald-600 text-white text-[9px] font-mono px-1.5 py-0.5 rounded-t font-bold z-20 shadow">
              SLOT: HEADER (728x90) [CUSTOM BANNER]
            </div>
          )}
          <div className="w-full sm:w-[468px] lg:w-[728px] h-[75px] sm:h-[90px] mx-auto rounded-xl relative overflow-hidden shadow-md border border-gray-200 dark:border-slate-800 bg-slate-950 group">
            <a
              href={effectiveTargetUrl}
              target={effectiveTargetUrl.startsWith('http') ? '_blank' : '_self'}
              rel="noopener noreferrer"
              className="block w-full h-full relative"
            >
              <img
                src={slotConfig.bannerImageUrl}
                alt={slotConfig.altText || (language === 'bn' ? 'হেডার লিডারবোর্ড ব্যানার' : 'Header Leaderboard Banner')}
                className="w-full h-full object-cover sm:object-contain bg-slate-900 group-hover:opacity-95 transition-opacity"
                loading="eager"
                decoding="async"
              />
              <div className="absolute top-1.5 right-2 flex items-center gap-1 text-[8px] sm:text-[9px] text-white/90 bg-black/60 backdrop-blur-xs px-1.5 py-0.5 rounded uppercase tracking-wider font-mono shadow-xs">
                <span>{adLabel}</span>
                <ExternalLink className="w-2.5 h-2.5 ml-0.5 opacity-80" />
              </div>
            </a>
          </div>
        </div>
      );
    }

    return (
      <div className={`relative ${highlightClass} ${className}`}>
        {settings.highlightAdSlots && (
          <div className="absolute -top-3 right-0 bg-emerald-600 text-white text-[9px] font-mono px-1.5 py-0.5 rounded-t font-bold z-20 shadow">
            SLOT: HEADER (728x90)
          </div>
        )}
        <div className="w-full sm:w-[468px] lg:w-[728px] h-[75px] sm:h-[90px] mx-auto bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-xl px-4 sm:px-5 py-2.5 border border-indigo-800/40 relative overflow-hidden shadow-md flex items-center justify-between group">
          <div className="absolute -right-8 -top-8 w-28 h-28 bg-red-500/20 rounded-full blur-2xl group-hover:bg-red-500/30 transition-colors pointer-events-none" />
          
          <div className="absolute top-1.5 right-2 flex items-center gap-1 text-[9px] text-slate-400 uppercase tracking-widest font-mono">
            <span>{adLabel}</span>
            <Info className="w-2.5 h-2.5 opacity-60" />
          </div>

          <div className="z-10 max-w-[70%]">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>{sponsorLabel} • 728x90 LEADERBOARD</span>
            </div>
            <h4 className="text-xs sm:text-sm font-black text-slate-100 mt-0.5 line-clamp-1 group-hover:text-amber-300 transition-colors">
              {language === 'bn' 
                ? 'হাইপারক্লাউড ডেভেলপার সামিট ২০২৬ - এখনই রেজিস্ট্রেশন করুন'
                : 'HyperCloud Global Developer Summit 2026 - Register Free'}
            </h4>
            <p className="text-[10px] sm:text-[11px] text-slate-400 line-clamp-1">
              {language === 'bn' 
                ? 'এআই, নেক্সট-জেন ক্লাউড কম্পিউটিং এবং মিডিয়া টেকনোলজির শীর্ষ কনফারেন্স।'
                : 'Keynotes, hands-on labs, and $10,000 developer cloud grant vouchers.'}
            </p>
          </div>

          <div className="z-10 flex items-center gap-2">
            <a
              href={effectiveTargetUrl}
              target={effectiveTargetUrl.startsWith('http') ? '_blank' : '_self'}
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all shadow-md hover:scale-105 active:scale-95"
            >
              <span>{language === 'bn' ? 'অংশ নিন' : 'Explore'}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 3. TOP OF CONTENT BILLBOARD (970x90 / 728x90)
  if (slotType === 'top_leaderboard') {
    if (slotConfig?.customCode) {
      return (
        <div className={`my-4 sm:my-6 ${highlightClass} ${className}`}>
          {settings.highlightAdSlots && (
            <div className="flex items-center justify-between text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold px-1 mb-1">
              <span>[AD SLOT: TOP_BILLBOARD - 970x90 / 728x90] [CUSTOM SCRIPT]</span>
              <span>NETWORK AD</span>
            </div>
          )}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-2.5 sm:p-3 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between px-1.5 pb-2 mb-2 border-b border-gray-100 dark:border-slate-800/80 text-[10px] text-slate-400 uppercase tracking-widest font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-600" />
                <span className="font-bold text-slate-600 dark:text-slate-400">{adLabel}</span>
              </div>
              <span className="text-slate-400 font-mono">ADSTERRA / NETWORK UNIT</span>
            </div>
            <AdCustomCodeFrame code={slotConfig.customCode} minHeight={100} />
          </div>
        </div>
      );
    }

    if (slotConfig?.bannerImageUrl) {
      return (
        <div className={`my-4 sm:my-6 ${highlightClass} ${className}`}>
          {settings.highlightAdSlots && (
            <div className="flex items-center justify-between text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold px-1 mb-1">
              <span>[AD SLOT: TOP_BILLBOARD - 970x90 / 728x90] [CUSTOM BANNER]</span>
              <span>DIRECT SPONSOR</span>
            </div>
          )}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-2.5 sm:p-3 shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between px-1.5 pb-2 mb-2 border-b border-gray-100 dark:border-slate-800/80 text-[10px] text-slate-400 uppercase tracking-widest font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-600" />
                <span className="font-bold text-slate-600 dark:text-slate-400">{adLabel}</span>
                <span>•</span>
                <span className="text-slate-500">{slotConfig.altText || 'BILLBOARD 970x90 / 728x90'}</span>
              </div>
              <a
                href={effectiveTargetUrl}
                target={effectiveTargetUrl.startsWith('http') ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[10px] text-blue-600 dark:text-blue-400 font-semibold hover:underline"
              >
                <span>{language === 'bn' ? 'ভিজিট করুন' : 'Visit Sponsor'}</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>

            <a
              href={effectiveTargetUrl}
              target={effectiveTargetUrl.startsWith('http') ? '_blank' : '_self'}
              rel="noopener noreferrer"
              className="block w-full rounded-xl overflow-hidden bg-slate-950 max-h-[160px] sm:max-h-[200px] md:max-h-[260px] relative group/img"
            >
              <img
                src={slotConfig.bannerImageUrl}
                alt={slotConfig.altText || (language === 'bn' ? 'শীর্ষ কনটেন্ট ব্যানার' : 'Top Content Billboard')}
                className="w-full h-auto max-h-[260px] object-cover sm:object-contain mx-auto group-hover/img:scale-[1.008] transition-transform duration-300"
                loading="eager"
                decoding="async"
              />
            </a>
          </div>
        </div>
      );
    }

    return (
      <div className={`my-4 sm:my-6 ${highlightClass} ${className}`}>
        {settings.highlightAdSlots && (
          <div className="flex items-center justify-between text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold px-1 mb-1">
            <span>[AD SLOT: TOP_BILLBOARD - 970x90 / 728x90]</span>
            <span>RESPONSIVE AD UNIT</span>
          </div>
        )}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100 dark:border-slate-800/80 text-[10px] text-slate-400 uppercase tracking-widest font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              <span className="font-bold text-slate-600 dark:text-slate-400">{adLabel}</span>
              <span>•</span>
              <span className="text-slate-500">BILLBOARD 970x90 / 728x90</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-red-600 to-amber-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-red-600 bg-red-50 dark:bg-red-950/50 px-2 py-0.5 rounded">
                    OFFICIAL SPONSOR
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Adsterra & AdSense Partner</span>
                </div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white mt-1 group-hover:text-red-600 transition-colors">
                  {language === 'bn' 
                    ? 'স্মার্ট ব্যাংকিং ও ফ্রিল্যান্সার ডিজিটাল রেমিট্যান্স অ্যাকাউন্ট'
                    : 'Global Fintech & Digital Freelancer Multi-Currency Account'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  {language === 'bn' 
                    ? 'জিরো ফি, ইনস্ট্যান্ট মাস্টারকার্ড এবং সর্বোচ্চ এক্সচেঞ্জ রেট সুবিধা।'
                    : 'Receive payments worldwide with 0% hidden fee and instant virtual debit card.'}
                </p>
              </div>
            </div>

            <a
              href={effectiveTargetUrl}
              target={effectiveTargetUrl.startsWith('http') ? '_blank' : '_self'}
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-red-600 dark:hover:bg-red-700 text-xs font-bold rounded-xl shadow-md transition-all shrink-0 flex items-center gap-2 self-start md:self-center"
            >
              <span>{language === 'bn' ? 'ফ্রি অ্যাকাউন্ট খুলুন' : 'Sign Up Free'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 4. SIDEBAR MEDIUM RECTANGLE (300x250)
  if (slotType === 'sidebar_300x250') {
    if (slotConfig?.customCode) {
      return (
        <div className={`relative ${highlightClass} ${className}`}>
          {settings.highlightAdSlots && (
            <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold mb-1">
              [SLOT: SIDEBAR_300x250 - CUSTOM ADSTERRA SCRIPT]
            </div>
          )}
          <div className="bg-slate-950 border border-indigo-800/40 rounded-xl p-2 relative overflow-hidden shadow-md flex items-center justify-center min-h-[250px]">
            <AdCustomCodeFrame code={slotConfig.customCode} minHeight={250} />
          </div>
        </div>
      );
    }

    return (
      <div className={`relative ${highlightClass} ${className}`}>
        {settings.highlightAdSlots && (
          <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold mb-1">
            [SLOT: SIDEBAR_300x250 - MEDIUM RECTANGLE]
          </div>
        )}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-xl p-5 border border-indigo-800/40 relative overflow-hidden shadow-md group">
          <div className="flex items-center justify-between text-[10px] text-amber-400 font-bold tracking-wider mb-2">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {sponsorLabel}
            </span>
            <span className="font-mono text-slate-400">{adLabel} • 300x250</span>
          </div>

          <h4 className="text-base font-black text-white leading-snug group-hover:text-amber-300 transition-colors">
            {language === 'bn' 
              ? 'নেক্সটজেন ক্লাউড ওয়ার্কস্পেস ২০২৬'
              : 'NextGen UltraCloud Workspace 2026'}
          </h4>
          <p className="text-xs text-slate-300 mt-1.5 line-clamp-3">
            {language === 'bn' 
              ? 'হাইপারম্যাগ ইন্টেলিজেন্ট এজ ক্যাশিং ও কনটেন্ট ডেলিভারি দিয়ে আপনার ওয়েবসাইট লোডিং স্পিড বৃদ্ধি করুন ৩০০% পর্যন্ত।'
              : 'Supercharge your media publishing and content delivery workflows with intelligent edge caching and CDN.'}
          </p>

          <div className="mt-4 flex items-center justify-between pt-3 border-t border-indigo-900/60">
            <span className="text-[11px] text-indigo-300 font-medium">
              {language === 'bn' ? 'সীমিত অফার' : 'Limited Trial'}
            </span>
            <a 
              href={effectiveTargetUrl}
              target={effectiveTargetUrl.startsWith('http') ? '_blank' : '_self'}
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded shadow transition-colors"
            >
              <span>{language === 'bn' ? 'বিস্তারিত দেখুন' : 'Learn More'}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 5. SIDEBAR HALF-PAGE SKYSCRAPER (300x600)
  if (slotType === 'sidebar_300x600') {
    if (slotConfig?.customCode) {
      return (
        <div className={`relative ${highlightClass} ${className}`}>
          {settings.highlightAdSlots && (
            <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold mb-1">
              [SLOT: SIDEBAR_300x600 - CUSTOM ADSTERRA SKYSCRAPER]
            </div>
          )}
          <div className="bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl p-2 shadow-sm flex items-center justify-center min-h-[600px] overflow-hidden">
            <AdCustomCodeFrame code={slotConfig.customCode} minHeight={600} />
          </div>
        </div>
      );
    }

    return (
      <div className={`relative ${highlightClass} ${className}`}>
        {settings.highlightAdSlots && (
          <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold mb-1">
            [SLOT: SIDEBAR_300x600 - HALF PAGE SKYSCRAPER]
          </div>
        )}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-sm text-center relative overflow-hidden group">
          <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-widest font-mono pb-3 mb-3 border-b border-gray-100 dark:border-slate-800">
            <span>{adLabel}</span>
            <span>300x600 SKYSCRAPER</span>
          </div>

          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-tr from-rose-600 to-red-500 text-white flex items-center justify-center mb-4 shadow-lg group-hover:scale-105 transition-transform">
            <Sparkles className="w-10 h-10" />
          </div>

          <span className="inline-block text-[10px] font-black uppercase tracking-widest text-red-600 bg-red-50 dark:bg-red-950/40 px-2.5 py-1 rounded-full mb-2">
            PREMIUM AD PLACEMENT
          </span>

          <h4 className="text-base font-black text-slate-900 dark:text-white leading-tight">
            {language === 'bn' 
              ? 'আপনার ব্র্যান্ডের বিজ্ঞাপন প্রচার করুন লক্ষাধিক পাঠকের মাঝে'
              : 'Promote Your Brand to 250,000+ Tech & News Readers'}
          </h4>

          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
            {language === 'bn' 
              ? 'হাইপারম্যাগ পোর্টালে সরাসরি ব্যানার বিজ্ঞাপন, স্পন্সর পোস্ট বা অ্যাডস্টেরা ও গুগল পার্টনার ক্যাম্পেইন বুক করুন।'
              : 'Target tech decision makers, investors, and active consumers with high-impact skyscraper ads.'}
          </p>

          <div className="my-5 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-left space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>{language === 'bn' ? 'গড়ে ৪.২% উচ্চ সিটিআর (CTR)' : 'Average 4.2% High CTR'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>{language === 'bn' ? '১০০% ভিউয়েবিলিটি গ্যারান্টি' : '100% Viewability Guaranteed'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>{language === 'bn' ? 'Adsterra & AdSense সাপোর্টেড' : 'Adsterra & AdSense Approved'}</span>
            </div>
          </div>

          <a 
            href={effectiveTargetUrl}
            target={effectiveTargetUrl.startsWith('http') ? '_blank' : '_self'}
            rel="noopener noreferrer"
            className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>{language === 'bn' ? 'বিজ্ঞাপন বুক করুন' : 'Book Placement'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  // 6. IN-FEED NATIVE AD (Displayed between post list items)
  if (slotType === 'in_feed') {
    if (slotConfig?.customCode) {
      return (
        <div className={`my-4 ${highlightClass} ${className}`}>
          {settings.highlightAdSlots && (
            <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold mb-1">
              [SLOT: IN_FEED_NATIVE - CUSTOM ADSTERRA UNIT]
            </div>
          )}
          <div className="p-2 bg-slate-950 rounded-xl shadow-md border border-slate-800">
            <AdCustomCodeFrame code={slotConfig.customCode} minHeight={120} />
          </div>
        </div>
      );
    }

    return (
      <div className={`my-4 ${highlightClass} ${className}`}>
        {settings.highlightAdSlots && (
          <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold mb-1">
            [SLOT: IN_FEED_NATIVE - RESPONSIVE ARTICLE STREAM]
          </div>
        )}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 group">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest bg-black/30 px-2 py-0.5 rounded text-amber-300">
                {adLabel} • {sponsorLabel}
              </span>
              <span className="text-[10px] text-white/75 font-mono">NATIVE FEED AD</span>
            </div>
            <h4 className="text-sm sm:text-base font-bold mt-1 group-hover:text-amber-200 transition-colors">
              {language === 'bn' ? 'সর্বাধুনিক এআই ও টেকনোলজি জার্নাল ২০২৬ সংস্করণ' : 'NextGen AI & Computing Annual Edition 2026'}
            </h4>
            <p className="text-xs text-white/90 mt-0.5">
              {language === 'bn' ? 'বিশ্বের শীর্ষ প্রযুক্তি বিশেষজ্ঞদের গভীর গবেষণা ও বিশ্লেষণমূলক ফ্রি রিপোর্ট।' : 'Free comprehensive whitepaper and trends review for digital technology leaders.'}
            </p>
          </div>
          <a 
            href={effectiveTargetUrl}
            target={effectiveTargetUrl.startsWith('http') ? '_blank' : '_self'}
            rel="noopener noreferrer"
            className="px-4 py-2 bg-white text-red-700 hover:bg-slate-100 text-xs font-bold rounded-lg shadow transition-colors shrink-0 flex items-center gap-1.5 self-start sm:self-center"
          >
            <span>{language === 'bn' ? 'ডাউনলোড করুন' : 'Download Now'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  // 7. ARTICLE TOP / MIDDLE / BOTTOM ADS
  if (slotConfig?.customCode) {
    return (
      <div className={`my-6 ${highlightClass} ${className}`}>
        {settings.highlightAdSlots && (
          <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold mb-1">
            [SLOT: {slotType.toUpperCase()} - CUSTOM ADSTERRA UNIT]
          </div>
        )}
        <div className="bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl p-3 text-center relative overflow-hidden">
          <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-widest font-mono pb-2 mb-2 border-b border-gray-800">
            <span className="font-bold text-slate-300">{adLabel}</span>
            <span>{slotConfig.size}</span>
          </div>
          <AdCustomCodeFrame code={slotConfig.customCode} minHeight={120} />
        </div>
      </div>
    );
  }

  return (
    <div className={`my-6 ${highlightClass} ${className}`}>
      {settings.highlightAdSlots && (
        <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold mb-1">
          [SLOT: {slotType.toUpperCase()} - {slotConfig?.size || '728x90'}]
        </div>
      )}
      <div className="bg-slate-50 dark:bg-slate-850 border border-gray-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 text-center relative overflow-hidden">
        {/* Top Info */}
        <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-widest font-mono pb-2 mb-3 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
            <span className="font-bold">{adLabel}</span>
          </div>
          <span>{slotConfig?.size || '728x90'}</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              {language === 'bn' ? 'প্রস্তাবিত স্পন্সর বিজ্ঞাপন' : 'Recommended Sponsor'}
            </span>
            <h5 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
              {slotType === 'article_top' 
                ? (language === 'bn' ? 'প্রফেশনাল ডিজিটাল মিডিয়া ও সাইবার সিকিউরিটি কোর্স' : 'Professional Full-Stack & Cyber Defense Certification')
                : slotType === 'article_middle'
                ? (language === 'bn' ? 'আল্ট্রা-ফাস্ট ভিপিএস ও ডেডিকেটেড সার্ভার সলিউশন' : 'Ultra-Fast Enterprise VPS & Bare-Metal Cloud')
                : (language === 'bn' ? 'গ্লোবাল স্টক ও ক্রিপ্টো ট্রেডিং প্ল্যাটফর্ম' : 'Next-Gen Financial Trading & Portfolio Analytics')}
            </h5>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {language === 'bn'
                ? 'অনলাইন সার্টিফিকেট এবং ১০০% ক্যারিয়ার প্লেসমেন্ট সহায়তা।'
                : 'Join over 1.2M active users worldwide with zero commission fees.'}
            </p>
          </div>

          <a
            href={effectiveTargetUrl}
            target={effectiveTargetUrl.startsWith('http') ? '_blank' : '_self'}
            rel="noopener noreferrer"
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow transition-colors shrink-0 flex items-center gap-1.5"
          >
            <span>{language === 'bn' ? 'ভিজিট করুন' : 'Visit Sponsor'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
