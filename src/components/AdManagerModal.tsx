import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  Code2, 
  Sparkles, 
  Layers, 
  ToggleLeft, 
  ToggleRight,
  HelpCircle,
  RotateCcw,
  Sliders,
  DollarSign
} from 'lucide-react';
import { AdSettings, AdSlotType, Language } from '../types';
import { INITIAL_AD_SETTINGS } from '../data/adConfig';

interface AdManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  adSettings: AdSettings;
  onUpdateAdSettings: (newSettings: AdSettings) => void;
}

export const AdManagerModal: React.FC<AdManagerModalProps> = ({
  isOpen,
  onClose,
  language,
  adSettings,
  onUpdateAdSettings
}) => {
  const [activeTab, setActiveTab] = useState<'slots' | 'codes' | 'guide'>('slots');
  const [selectedSlotForCode, setSelectedSlotForCode] = useState<AdSlotType>('header_728x90');
  const [tempCode, setTempCode] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [publisherId, setPublisherId] = useState(adSettings.adSensePublisherId);

  if (!isOpen) return null;

  const handleToggleSlot = (slotKey: AdSlotType) => {
    const current = adSettings.slots[slotKey];
    onUpdateAdSettings({
      ...adSettings,
      slots: {
        ...adSettings.slots,
        [slotKey]: {
          ...current,
          enabled: !current.enabled
        }
      }
    });
  };

  const handleToggleHighlight = () => {
    onUpdateAdSettings({
      ...adSettings,
      highlightAdSlots: !adSettings.highlightAdSlots
    });
  };

  const handleSavePublisherId = () => {
    onUpdateAdSettings({
      ...adSettings,
      adSensePublisherId: publisherId
    });
  };

  const handleSaveSlotCode = (slotKey: AdSlotType) => {
    onUpdateAdSettings({
      ...adSettings,
      slots: {
        ...adSettings.slots,
        [slotKey]: {
          ...adSettings.slots[slotKey],
          customCode: tempCode
        }
      }
    });
  };

  const handleResetDefaults = () => {
    onUpdateAdSettings(INITIAL_AD_SETTINGS);
    setPublisherId(INITIAL_AD_SETTINGS.adSensePublisherId);
  };

  const handleCopySnippet = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeSlotKeys = Object.keys(adSettings.slots) as AdSlotType[];
  const totalEnabledCount = activeSlotKeys.filter((k) => adSettings.slots[k].enabled).length;

  const sampleAdSenseCode = `<!-- Google AdSense Responsive Unit: ${adSettings.slots[selectedSlotForCode].name} -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}" crossorigin="anonymous"></script>
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="${publisherId}"
     data-ad-slot="1234567890"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>`;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden transition-colors my-auto">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black tracking-wide">
                  {language === 'bn' ? 'বিজ্ঞাপন স্লট ও অ্যাডসেন্স কন্ট্রোল সেন্টার' : 'AdSense & Ad Slots Manager'}
                </h3>
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  100% READY
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {language === 'bn' 
                  ? 'হাইপারম্যাগ ব্লগের সকল বিজ্ঞাপন স্লট নিয়ন্ত্রণ ও কাস্টমাইজ করুন'
                  : 'Manage, customize, and preview all standard high-CTR ad placements'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Toolbar: Inspector Highlight & Publisher ID */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-850 border-b border-gray-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            {/* Highlight visual inspector toggle */}
            <button
              onClick={handleToggleHighlight}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-colors ${
                adSettings.highlightAdSlots
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700'
              }`}
            >
              {adSettings.highlightAdSlots ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span>
                {language === 'bn'
                  ? adSettings.highlightAdSlots ? 'স্লট হাইলাইট চালু আছে' : 'স্লট হাইলাইট দেখুন'
                  : adSettings.highlightAdSlots ? 'Ad Inspector Active' : 'Inspect Ad Bounding Boxes'}
              </span>
            </button>

            <span className="text-slate-400 hidden sm:inline">|</span>

            <span className="text-slate-600 dark:text-slate-400 font-medium hidden sm:inline">
              {language === 'bn' ? `মোট সক্রিয় স্লট: ${totalEnabledCount} টি` : `Active Placements: ${totalEnabledCount}/9`}
            </span>
          </div>

          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'ডিফল্ট রিসেট' : 'Reset Defaults'}</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 dark:border-slate-800 px-6 pt-2 bg-white dark:bg-slate-900">
          <button
            onClick={() => setActiveTab('slots')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'slots'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>{language === 'bn' ? 'স্লট সক্রিয়করণ তালিকা' : 'Active Ad Placements'}</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-red-100 dark:bg-red-950 text-red-600 rounded-full font-black">
              {totalEnabledCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('codes')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'codes'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>{language === 'bn' ? 'গুগল অ্যাডসেন্স কোড' : 'AdSense Code Setup'}</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'guide'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>{language === 'bn' ? 'বিজ্ঞাপন গাইড ও সাইজ' : 'Ad Formats & Sizes'}</span>
          </button>
        </div>

        {/* Tab 1: Slots Management */}
        {activeTab === 'slots' && (
          <div className="p-6 max-h-[480px] overflow-y-auto space-y-3">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              {language === 'bn' 
                ? 'যেকোনো নির্দিষ্ট বিজ্ঞাপন স্লট সাইট থেকে বন্ধ বা চালু করতে পাশের সুইচে ক্লিক করুন:'
                : 'Toggle any individual ad unit on or off to adjust layout balance:'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeSlotKeys.map((slotKey) => {
                const slot = adSettings.slots[slotKey];
                return (
                  <div
                    key={slotKey}
                    className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                      slot.enabled
                        ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20'
                        : 'border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 opacity-60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${slot.enabled ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        <h4 className="text-xs font-black text-slate-900 dark:text-white">
                          {language === 'bn' ? slot.nameBn : slot.name}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded border border-gray-200 dark:border-slate-700">
                          {slot.size}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          id: {slot.id}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleSlot(slotKey)}
                      className={`p-1 rounded transition-colors ${
                        slot.enabled
                          ? 'text-emerald-600 hover:text-emerald-700'
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                      title={slot.enabled ? 'Disable slot' : 'Enable slot'}
                    >
                      {slot.enabled ? (
                        <ToggleRight className="w-8 h-8 text-emerald-600" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-slate-400" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Code Integration */}
        {activeTab === 'codes' && (
          <div className="p-6 max-h-[480px] overflow-y-auto space-y-4">
            {/* Publisher ID Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'bn' ? 'Google AdSense Publisher ID (পাবলিশার আইডি):' : 'Google AdSense Publisher ID:'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={publisherId}
                  onChange={(e) => setPublisherId(e.target.value)}
                  placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                  className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-red-600"
                />
                <button
                  onClick={handleSavePublisherId}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors shadow"
                >
                  {language === 'bn' ? 'সংরক্ষণ' : 'Save ID'}
                </button>
              </div>
            </div>

            {/* Select Slot for Code */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'bn' ? 'স্লট নির্বাচন করুন:' : 'Select Ad Slot:'}
              </label>
              <select
                value={selectedSlotForCode}
                onChange={(e) => setSelectedSlotForCode(e.target.value as AdSlotType)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
              >
                {activeSlotKeys.map((key) => (
                  <option key={key} value={key}>
                    {language === 'bn' ? adSettings.slots[key].nameBn : adSettings.slots[key].name} ({adSettings.slots[key].size})
                  </option>
                ))}
              </select>
            </div>

            {/* Generated snippet */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span>{language === 'bn' ? 'রেডি গুগল অ্যাডসেন্স কোড স্নsnippet:' : 'Ready-to-use AdSense snippet:'}</span>
                <button
                  onClick={() => handleCopySnippet(sampleAdSenseCode)}
                  className="flex items-center gap-1 text-[11px] text-red-600 hover:underline"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? (language === 'bn' ? 'কপি হয়েছে' : 'Copied!') : (language === 'bn' ? 'কোড কপি করুন' : 'Copy Code')}</span>
                </button>
              </div>
              <pre className="p-3 bg-slate-950 text-slate-200 font-mono text-[11px] rounded-xl overflow-x-auto border border-slate-800 leading-relaxed">
                {sampleAdSenseCode}
              </pre>
            </div>
          </div>
        )}

        {/* Tab 3: Formats & Guidelines */}
        {activeTab === 'guide' && (
          <div className="p-6 max-h-[480px] overflow-y-auto space-y-4 text-xs">
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl p-4">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>{language === 'bn' ? 'দ্য জিওপ্যাক্টস বিজ্ঞাপন অপটিমাইজেশন পলিসি' : 'The GeoPacts AdSense & Sponsor Best Practices'}</span>
              </h4>
              <p className="text-amber-700 dark:text-amber-400 mt-1 leading-relaxed">
                {language === 'bn'
                  ? 'এই থিমে প্রতিটি বিজ্ঞাপন ইউনিট গুগল অ্যাডসেন্সের পলিসি অনুযায়ী যথাযথ লেবেল ("বিজ্ঞাপন" / "ADVERTISEMENT"), প্যাডিং এবং ক্লিয়ারেন্স সহ ডিজাইন করা হয়েছে যাতে ইনভ্যালিড ক্লিক ও পলিসি ভায়োলেশনের কোনো ঝুঁকি না থাকে।'
                  : 'All ad slots adhere to Google AdSense guidelines with clear labels, proper spacing, and responsive aspect ratio boxes to avoid layout shifts (CLS).'}
              </p>
            </div>

            <div className="space-y-2">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">Header Leaderboard</span>
                  <p className="text-[11px] text-slate-500">728x90 (Desktop) / Responsive (Mobile)</p>
                </div>
                <span className="font-bold text-emerald-600 text-[11px]">Best for Branding</span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">In-Feed Native Ads</span>
                  <p className="text-[11px] text-slate-500">Matches editorial card look and feed flow</p>
                </div>
                <span className="font-bold text-emerald-600 text-[11px]">Highest CTR</span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">Sidebar Medium & Skyscraper</span>
                  <p className="text-[11px] text-slate-500">300x250 and 300x600 sticky display</p>
                </div>
                <span className="font-bold text-emerald-600 text-[11px]">High Viewability</span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">Sticky Bottom Anchor</span>
                  <p className="text-[11px] text-slate-500">728x90 on Desktop, 320x50 on Mobile</p>
                </div>
                <span className="font-bold text-emerald-600 text-[11px]">Continuous Exposure</span>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-100 dark:bg-slate-850 border-t border-gray-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>{language === 'bn' ? 'সকল পরিবর্তন তাৎক্ষণিক কার্যকর হচ্ছে' : 'Changes applied in real time'}</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors shadow"
          >
            {language === 'bn' ? 'সম্পন্ন' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};
