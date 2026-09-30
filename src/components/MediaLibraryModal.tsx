import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Search,
  Trash2,
  Check,
  ExternalLink,
  Copy,
  Calendar,
  Layers,
  Sparkles,
  Loader2,
  AlertCircle,
  FileCheck,
  RefreshCw,
  Info
} from 'lucide-react';
import { MediaItem, Language } from '../types';
import { optimizeImage, formatBytes } from '../lib/imageOptimizer';
import {
  uploadImageToSupabaseStorage,
  getMediaItemsFromSupabase,
  registerMediaItemInSupabase,
  deleteMediaItemFromSupabase
} from '../lib/supabase';

export interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage?: (image: {
    url: string;
    altText: string;
    caption?: string;
    credit?: string;
    storagePath?: string;
  }) => void;
  selectMode?: boolean;
  selectButtonLabel?: string;
  language?: Language;
  currentToken?: string;
}

export const MediaLibraryModal: React.FC<MediaLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  selectMode = false,
  selectButtonLabel,
  language = 'en',
  currentToken = ''
}) => {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');

  // New upload form metadata
  const [newAlt, setNewAlt] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newCredit, setNewCredit] = useState('The GeoPacts');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch Media Assets directly from Supabase
  const fetchMedia = async () => {
    setIsLoading(true);
    try {
      const res = await getMediaItemsFromSupabase();
      if (res.success && Array.isArray(res.data)) {
        setMediaList(res.data);
        if (res.data.length > 0 && !selectedItem) {
          setSelectedItem(res.data[0]);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch media assets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filtered list
  const filteredList = mediaList.filter(item => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (item.filename && item.filename.toLowerCase().includes(q)) ||
      (item.altText && item.altText.toLowerCase().includes(q)) ||
      (item.caption && item.caption.toLowerCase().includes(q)) ||
      (item.credit && item.credit.toLowerCase().includes(q))
    );
  });

  // Handle direct file upload to Supabase Storage
  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(language === 'bn' ? 'ছবি অপ্টিমাইজ করা হচ্ছে (WebP)...' : 'Optimizing and converting image to WebP...');

    try {
      // 1. Client-side Canvas optimization to modern WebP (max 1400px width, 82% quality)
      const optimized = await optimizeImage(file, { maxWidth: 1400, maxHeight: 900, quality: 0.82 });
      const originalKb = Math.round(file.size / 1024);
      const optimizedKb = Math.round(optimized.file.size / 1024);

      setUploadProgress(
        language === 'bn'
          ? `ক্লাউড স্টোরেজে আপলোড হচ্ছে (${originalKb}KB -> ${optimizedKb}KB WebP)...`
          : `Uploading to Supabase Storage (${originalKb}KB -> ${optimizedKb}KB WebP)...`
      );

      // 2. Direct upload to Supabase Storage bucket `news-images`
      const uploadRes = await uploadImageToSupabaseStorage(
        optimized.file,
        optimized.storagePath,
        {
          filename: optimized.file.name,
          altText: newAlt.trim() || file.name.replace(/\.[^/.]+$/, ''),
          caption: newCaption.trim(),
          credit: newCredit.trim() || 'The GeoPacts',
          mimeType: 'image/webp',
          sizeBytes: optimized.file.size
        }
      );

      if (!uploadRes.success || !uploadRes.publicUrl) {
        throw new Error(uploadRes.error || 'Failed to upload image to Supabase Storage.');
      }

      const publicUrl = uploadRes.publicUrl;
      const storagePath = uploadRes.storagePath || optimized.storagePath;

      setUploadProgress(language === 'bn' ? 'মিডিয়া লাইব্রেরিতে সংরক্ষণ করা হচ্ছে...' : 'Registering in Media Library...');

      // 3. Register directly in Supabase media table
      const itemToRegister: MediaItem = {
        id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        url: publicUrl,
        storagePath,
        filename: optimized.file.name,
        altText: newAlt.trim() || file.name.replace(/\.[^/.]+$/, ''),
        caption: newCaption.trim(),
        credit: newCredit.trim() || 'The GeoPacts',
        mimeType: 'image/webp',
        sizeBytes: optimized.file.size,
        usedInArticleIds: [],
        createdAt: new Date().toISOString()
      };

      const regRes = await registerMediaItemInSupabase(itemToRegister);
      const createdItem: MediaItem = regRes.success && regRes.data ? regRes.data : itemToRegister;

      setMediaList(prev => [createdItem, ...prev]);
      setSelectedItem(createdItem);
      setActiveTab('library');
      setNewAlt('');
      setNewCaption('');
      setUploadProgress(null);

      // If in selector mode, user can immediately insert
    } catch (err: any) {
      console.error('Image upload failed:', err);
      setUploadError(err.message || 'Image processing or upload failed.');
      setUploadProgress(null);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle Delete Asset with referential protection
  const handleDeleteMedia = async (item: MediaItem) => {
    if (!confirm(language === 'bn' ? `আপনি কি "${item.filename}" মুছে ফেলতে চান?` : `Are you sure you want to delete "${item.filename}"?`)) {
      return;
    }

    try {
      const delRes = await deleteMediaItemFromSupabase(item.id, item.storagePath);
      if (!delRes.success) {
        alert(delRes.error || 'Cannot delete media asset because it is referenced by articles.');
        return;
      }

      setMediaList(prev => prev.filter(m => m.id !== item.id));
      if (selectedItem?.id === item.id) {
        setSelectedItem(null);
      }
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleCopyUrl = (url: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  const handleSelectCurrent = () => {
    if (!selectedItem || !onSelectImage) return;
    onSelectImage({
      url: selectedItem.url,
      altText: selectedItem.altText || '',
      caption: selectedItem.caption || '',
      credit: selectedItem.credit || '',
      storagePath: selectedItem.storagePath || ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl w-full max-w-5xl h-[88vh] max-h-[780px] overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-600/10 text-red-600 rounded-xl flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {language === 'bn' ? 'মিডিয়া লাইব্রেরি ও স্টোরেজ' : 'Media Library & Supabase Storage'}
                </h3>
                <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-2 py-0.5 rounded font-mono font-bold">
                  news-images
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {selectMode
                  ? (language === 'bn' ? 'প্রবন্ধের জন্য ছবি নির্বাচন বা আপলোড করুন' : 'Select or upload an image for your article')
                  : (language === 'bn' ? 'ক্লাউড স্টোরেজে সংরক্ষিত সকল নিবন্ধ চিত্র' : 'Manage media assets stored in Supabase Storage')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Tabs */}
            <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('library')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeTab === 'library'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {language === 'bn' ? 'লাইব্রেরি' : 'Media Library'} ({mediaList.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
                  activeTab === 'upload'
                    ? 'bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'নতুন আপলোড' : 'Upload New'}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          
          {/* Main Panel: Browse or Upload */}
          <div className="flex-1 flex flex-col overflow-hidden border-r border-gray-200 dark:border-slate-800">
            
            {activeTab === 'library' ? (
              <>
                {/* Search & Filter Bar */}
                <div className="p-3 border-b border-gray-200 dark:border-slate-800 flex items-center gap-2 bg-slate-50/50 dark:bg-slate-800/30">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={language === 'bn' ? 'নাম, Alt টেক্সট বা ক্যাপশন দিয়ে খুঁজুন...' : 'Search by filename, ALT text, or caption...'}
                      className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-red-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={fetchMedia}
                    disabled={isLoading}
                    className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    title="Refresh media"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                {/* Images Grid */}
                <div className="flex-1 overflow-y-auto p-4">
                  {isLoading ? (
                    <div className="h-48 flex items-center justify-center text-slate-400 text-xs gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                      <span>{language === 'bn' ? 'মিডিয়া লোড হচ্ছে...' : 'Loading media assets...'}</span>
                    </div>
                  ) : filteredList.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-2xl">
                      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {language === 'bn' ? 'কোনো ছবি পাওয়া যায়নি' : 'No images found'}
                      </p>
                      <p className="text-xs text-slate-400 max-w-xs mt-1 mb-4">
                        {searchQuery
                          ? (language === 'bn' ? 'অনুসন্ধানের সাথে মিল রেখে কোনো ছবি পাওয়া যায়নি।' : 'No images match your search criteria.')
                          : (language === 'bn' ? 'নতুন ছবি আপলোড করতে উপরের "নতুন আপলোড" বাটনে ক্লিক করুন।' : 'Upload your first article image to Supabase Storage.')}
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveTab('upload')}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{language === 'bn' ? 'ছবি আপলোড করুন' : 'Upload Image'}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {filteredList.map((item) => {
                        const isSelected = selectedItem?.id === item.id;
                        return (
                          <div
                            key={item.id}
                            onClick={() => setSelectedItem(item)}
                            className={`group relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all bg-slate-100 dark:bg-slate-800 aspect-4/3 ${
                              isSelected
                                ? 'border-red-600 shadow-md ring-2 ring-red-500/20'
                                : 'border-gray-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600'
                            }`}
                          >
                            <img
                              src={item.url}
                              alt={item.altText || item.filename}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                            {isSelected && (
                              <div className="absolute top-2 right-2 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center shadow-md">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </div>
                            )}
                            <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity">
                              <p className="text-[11px] font-bold truncate leading-tight">{item.filename}</p>
                              <p className="text-[9px] text-slate-300 truncate">{formatBytes(item.sizeBytes || 0)}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Upload Tab with Direct WebP & Supabase Processing */
              <div className="flex-1 p-6 overflow-y-auto space-y-5">
                <div className="max-w-xl mx-auto space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {language === 'bn' ? 'সরাসরি সুপাবেজ স্টোরেজে আপলোড' : 'Direct Upload to Supabase Storage'}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {language === 'bn'
                        ? 'ছবিটি স্বয়ংক্রিয়ভাবে ব্রাউজারে অপ্টিমাইজড (WebP) হয়ে `news-images` বাকেটে আপলোড হবে।'
                        : 'Images are automatically compressed to high-speed WebP and stored directly in your Supabase Storage bucket.'}
                    </p>
                  </div>

                  {/* Dropzone */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                    className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                      isUploading
                        ? 'border-red-400 bg-red-50/50 dark:bg-red-950/20 cursor-wait'
                        : 'border-gray-300 dark:border-slate-700 hover:border-red-500 bg-slate-50/50 dark:bg-slate-800/30'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                    />

                    <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-950/50 text-red-600 flex items-center justify-center mb-3">
                      {isUploading ? (
                        <Loader2 className="w-7 h-7 animate-spin" />
                      ) : (
                        <Upload className="w-7 h-7" />
                      )}
                    </div>

                    {isUploading ? (
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-red-600 dark:text-red-400">{uploadProgress}</p>
                        <p className="text-xs text-slate-400">Please wait while the asset is safely processed...</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          {language === 'bn' ? 'ফাইল সিলেক্ট করতে ক্লিক করুন অথবা টেনে আনুন' : 'Click to select or drag & drop image'}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          JPG, PNG, WebP up to 10MB • Auto-converted to optimized WebP
                        </p>
                      </div>
                    )}
                  </div>

                  {uploadError && (
                    <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{uploadError}</span>
                    </div>
                  )}

                  {/* Pre-upload metadata options */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                      <Sparkles className="w-3.5 h-3.5 text-red-600" />
                      <span>{language === 'bn' ? 'ছবির মেটাডেটা (ঐচ্ছিক)' : 'Image Metadata (Optional)'}</span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        {language === 'bn' ? 'Alt বিবরণ (SEO এবং স্ক্রিন রিডারের জন্য)' : 'ALT Description (SEO & Accessibility)'}
                      </label>
                      <input
                        type="text"
                        value={newAlt}
                        onChange={(e) => setNewAlt(e.target.value)}
                        placeholder="e.g. Delegates discussing global agreement at treaty hall"
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-red-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          {language === 'bn' ? 'ক্যাপশন (Caption)' : 'Caption'}
                        </label>
                        <input
                          type="text"
                          value={newCaption}
                          onChange={(e) => setNewCaption(e.target.value)}
                          placeholder="Brief story context..."
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          {language === 'bn' ? 'ছবির উৎস / ক্রেডিট' : 'Photo Credit / Source'}
                        </label>
                        <input
                          type="text"
                          value={newCredit}
                          onChange={(e) => setNewCredit(e.target.value)}
                          placeholder="The GeoPacts / Reuters / Unsplash"
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-red-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Details Sidebar */}
          <div className="w-full md:w-80 bg-slate-50 dark:bg-slate-900/60 p-4 overflow-y-auto flex flex-col justify-between space-y-4">
            {selectedItem ? (
              <div className="space-y-4">
                <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-slate-800 bg-slate-200 dark:bg-slate-800 aspect-video relative group">
                  <img
                    src={selectedItem.url}
                    alt={selectedItem.altText || selectedItem.filename}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                  <a
                    href={selectedItem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                    title="View full resolution image"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Metadata Details */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-slate-800">
                    <span className="text-slate-400">{language === 'bn' ? 'ফাইলের নাম:' : 'Filename:'}</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200 max-w-[160px] truncate" title={selectedItem.filename}>
                      {selectedItem.filename}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-slate-800">
                    <span className="text-slate-400">{language === 'bn' ? 'সাইজ:' : 'Size:'}</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">
                      {formatBytes(selectedItem.sizeBytes || 0)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-slate-800">
                    <span className="text-slate-400">{language === 'bn' ? 'ফরম্যাট:' : 'MIME Type:'}</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      {selectedItem.mimeType || 'image/webp'}
                    </span>
                  </div>

                  {selectedItem.storagePath && (
                    <div className="pb-2 border-b border-gray-200 dark:border-slate-800">
                      <span className="text-slate-400 block mb-0.5">{language === 'bn' ? 'স্টোরেজ পাথ:' : 'Storage Path:'}</span>
                      <span className="font-mono text-[10px] text-slate-600 dark:text-slate-400 break-all">
                        {selectedItem.storagePath}
                      </span>
                    </div>
                  )}

                  <div>
                    <span className="text-slate-400 block mb-0.5">Alt Text:</span>
                    <p className="text-slate-700 dark:text-slate-300 text-[11px] bg-white dark:bg-slate-800 p-2 rounded-lg border border-gray-200 dark:border-slate-800">
                      {selectedItem.altText || <span className="italic text-slate-400">No ALT text set</span>}
                    </p>
                  </div>

                  {selectedItem.caption && (
                    <div>
                      <span className="text-slate-400 block mb-0.5">Caption:</span>
                      <p className="text-slate-700 dark:text-slate-300 text-[11px] bg-white dark:bg-slate-800 p-2 rounded-lg border border-gray-200 dark:border-slate-800">
                        {selectedItem.caption}
                      </p>
                    </div>
                  )}

                  {selectedItem.credit && (
                    <div>
                      <span className="text-slate-400 block mb-0.5">Credit:</span>
                      <p className="text-slate-700 dark:text-slate-300 text-[11px] bg-white dark:bg-slate-800 p-2 rounded-lg border border-gray-200 dark:border-slate-800">
                        {selectedItem.credit}
                      </p>
                    </div>
                  )}

                  {/* Public URL copy */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(selectedItem.url)}
                      className="w-full px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                    >
                      {copiedUrl ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{language === 'bn' ? 'লিংক কপি হয়েছে' : 'URL Copied!'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>{language === 'bn' ? 'ইমেজ URL কপি করুন' : 'Copy Public CDN URL'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-center text-slate-400 text-xs">
                <Info className="w-6 h-6 mb-2 opacity-50" />
                <span>{language === 'bn' ? 'বিস্তারিত দেখতে একটি ছবি সিলেক্ট করুন' : 'Select an image to view details'}</span>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-gray-200 dark:border-slate-800 space-y-2">
              {selectMode && selectedItem && (
                <button
                  type="button"
                  onClick={handleSelectCurrent}
                  className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>
                    {selectButtonLabel || (language === 'bn' ? 'ছবি নির্বাচন করুন' : 'Use Selected Image')}
                  </span>
                </button>
              )}

              {selectedItem && (
                <button
                  type="button"
                  onClick={() => handleDeleteMedia(selectedItem)}
                  className="w-full py-1.5 px-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  title="Enforces referential checks before deleting"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'স্থায়ীভাবে মুছুন' : 'Delete Asset (Safety Checked)'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
