import { AdSettings } from '../types';

const env = (import.meta as unknown as { env?: Record<string, string> }).env || {};

export const INITIAL_AD_SETTINGS: AdSettings = {
  adSensePublisherId: env.VITE_ADSENSE_PUB_ID || 'ca-pub-9847291048201948',
  demoMode: env.VITE_ADS_DEMO_MODE !== undefined ? env.VITE_ADS_DEMO_MODE === 'true' : true,
  highlightAdSlots: false,
  adsterra: {
    popunderCode: env.VITE_ADSTERRA_POPUNDER_CODE || '',
    socialBarCode: env.VITE_ADSTERRA_SOCIAL_BAR_CODE || '',
    directLinkUrl: env.VITE_ADSTERRA_DIRECT_LINK || '',
    nativeBannerCode: env.VITE_ADSTERRA_NATIVE_CODE || ''
  },
  slots: {
    header_728x90: {
      id: 'header_728x90',
      enabled: true,
      name: 'Header Leaderboard Banner',
      nameBn: 'হেডার লিডারবোর্ড বিজ্ঞাপন',
      size: '728x90',
      customCode: '',
      bannerImageUrl: env.VITE_AD_HEADER_BANNER_URL || undefined,
      targetUrl: env.VITE_AD_HEADER_TARGET_URL || undefined,
      altText: env.VITE_AD_HEADER_ALT_TEXT || undefined
    },
    top_leaderboard: {
      id: 'top_leaderboard',
      enabled: true,
      name: 'Top of Content Billboard',
      nameBn: 'শীর্ষ কনটেন্ট ব্যানার',
      size: '970x90 / 728x90',
      customCode: '',
      bannerImageUrl: env.VITE_AD_BILLBOARD_BANNER_URL || undefined,
      targetUrl: env.VITE_AD_BILLBOARD_TARGET_URL || undefined,
      altText: env.VITE_AD_BILLBOARD_ALT_TEXT || undefined
    },
    in_feed: {
      id: 'in_feed',
      enabled: true,
      name: 'In-Feed Native Ad',
      nameBn: 'ইন-ফিড নেটিভ বিজ্ঞাপন',
      size: 'Responsive Native',
      customCode: ''
    },
    sidebar_300x250: {
      id: 'sidebar_300x250',
      enabled: true,
      name: 'Sidebar Medium Rectangle',
      nameBn: 'সাইডবার রেক্টেঙ্গেল বিজ্ঞাপন',
      size: '300x250',
      customCode: ''
    },
    sidebar_300x600: {
      id: 'sidebar_300x600',
      enabled: true,
      name: 'Sidebar Half-Page Skyscraper',
      nameBn: 'সাইডবার স্কাইস্ক্র্যাপার বিজ্ঞাপন',
      size: '300x600',
      customCode: ''
    },
    article_top: {
      id: 'article_top',
      enabled: true,
      name: 'Article Top Banner (Below Title)',
      nameBn: 'আর্টিকেল শীর্ষ ব্যানার (শিরোনামের নিচে)',
      size: '728x90 / 336x280',
      customCode: ''
    },
    article_middle: {
      id: 'article_middle',
      enabled: true,
      name: 'Article In-Text Break Ad',
      nameBn: 'আর্টিকেল প্যারাগ্রাফের মাঝে বিজ্ঞাপন',
      size: 'Responsive In-Article',
      customCode: ''
    },
    article_bottom: {
      id: 'article_bottom',
      enabled: true,
      name: 'Article Bottom Banner',
      nameBn: 'আর্টিকেল পাদদেশ ব্যানার',
      size: '728x90 / 336x280',
      customCode: ''
    },
    sticky_anchor: {
      id: 'sticky_anchor',
      enabled: true,
      name: 'Sticky Bottom Anchor Banner',
      nameBn: 'স্টিকি ফুটার আ্যংকর বিজ্ঞাপন',
      size: '728x90 (Mobile 320x50)',
      customCode: ''
    }
  }
};
