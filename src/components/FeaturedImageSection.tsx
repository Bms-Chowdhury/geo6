import React, { useState, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  RefreshCw,
  FolderOpen,
  AlertCircle,
  Sparkles,
  Loader2,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { Language } from '../types';
import { optimizeImage } from '../lib/imageOptimizer';
import { uploadImageToSupabaseStorage, registerMediaItemInSupabase } from '../lib/supabase';
import { MediaLibraryModal } from './MediaLibraryModal';

export interface FeaturedImageData {
  imageUrl?: string;
  altText?: string;
  caption?: string;
  credit?: string;
  imageStoragePath?: string;
}

export interface FeaturedImageSectionProps {
  value: FeaturedImageData;
  onChange: (updated: FeaturedImageData) => void;
  language?: Language;
  currentToken?: string;
}

export const FeaturedImageSection: React.FC<FeaturedImageSectionProps> = ({
  value,
  onChange,
  language = 'en',
  currentToken = ''
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMessage(null);
    setUploadStatus(language === 'bn' ? 'ছবি অপ্টিমাইজ করা হচ্ছে...' : 'Optimizing image (WebP)...');

    try {
      // 1. Optimize image in browser via HTML5 Canvas
      const optimized = await optimizeImage(file, { maxWidth: 1400, maxHeight: 900, quality: 0.82 });
      
      setUploadStatus(
        language === 'bn'
          ? 'সুপাবেজ স্টোরেজে আপলোড হচ্ছে...'
          : 'Uploading to Supabase Storage (news-images)...'
      );

      // 2. Upload to Supabase Storage
      const defaultAlt = value.altText || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      const uploadRes = await uploadImageToSupabaseStorage(
        optimized.file,
        optimized.storagePath,
        {
          filename: optimized.file.name,
          altText: defaultAlt,
          caption: value.caption || '',
          credit: value.credit || 'The GeoPacts',
          mimeType: 'image/webp',
          sizeBytes: optimized.file.size
        }
      );

      if (!uploadRes.success || !uploadRes.publicUrl) {
        throw new Error(uploadRes.error || 'Failed to upload featured image to Supabase Storage.');
      }

      // 3. Register directly in Supabase media table
      try {
        await registerMediaItemInSupabase({
          id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          url: uploadRes.publicUrl,
          storagePath: uploadRes.storagePath || optimized.storagePath,
          filename: optimized.file.name,
          altText: defaultAlt,
          caption: value.caption || '',
          credit: value.credit || 'The GeoPacts',
          mimeType: 'image/webp',
          sizeBytes: optimized.file.size,
          usedInArticleIds: [],
          createdAt: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Could not register media metadata in Supabase:', err);
      }

      onChange({
        ...value,
        imageUrl: uploadRes.publicUrl,
        imageStoragePath: uploadRes.storagePath || optimized.storagePath,
        altText: defaultAlt
      });

      setUploadStatus(null);
    } catch (err: any) {
      console.error('Featured image upload failed:', err);
      setErrorMessage(err.message || 'Image processing or storage upload failed.');
      setUploadStatus(null);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    onChange({
      ...value,
      imageUrl: '',
      imageStoragePath: ''
    });
  };

  const handleSelectFromLibrary = (selected: {
    url: string;
    altText: string;
    caption?: string;
    credit?: string;
    storagePath?: string;
  }) => {
    onChange({
      ...value,
      imageUrl: selected.url,
      altText: selected.altText || value.altText || '',
      caption: selected.caption || value.caption || '',
      credit: selected.credit || value.credit || '',
      imageStoragePath: selected.storagePath || value.imageStoragePath || ''
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 space-y-4 shadow-xs">
      {/* Section Title */}
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-red-600/10 text-red-600 rounded-lg flex items-center justify-center">
            <ImageIcon className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              {language === 'bn' ? 'ফিচার্ড ইমেজ (Featured Image)' : 'Featured Image'}
            </h4>
            <p className="text-[11px] text-slate-500">
              {language === 'bn'
                ? 'সুপাবেজ স্টোরেজে ব্যাকএন্ডে সংরক্ষিত নিবন্ধের প্রধান চিত্র'
                : 'Primary hero image stored in Supabase Storage with CDN delivery'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
          <ShieldCheck className="w-3 h-3" />
          <span>news-images bucket</span>
        </div>
      </div>

      {/* Upload & Library Trigger Buttons */}
      <div className="flex flex-wrap items-center gap-2.5">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="hidden"
          onChange={handleFileSelected}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="px-3.5 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          {isUploading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Upload className="w-3.5 h-3.5" />
          )}
          <span>
            {value.imageUrl
              ? (language === 'bn' ? 'ছবি পরিবর্তন করুন' : 'Replace Image')
              : (language === 'bn' ? 'ছবি আপলোড করুন' : 'Upload Image')}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setShowMediaPicker(true)}
          disabled={isUploading}
          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer border border-gray-200 dark:border-slate-700"
        >
          <FolderOpen className="w-3.5 h-3.5 text-slate-500" />
          <span>{language === 'bn' ? 'মিডিয়া লাইব্রেরি থেকে বাছুন' : 'Choose from Media Library'}</span>
        </button>

        {value.imageUrl && (
          <button
            type="button"
            onClick={handleRemoveImage}
            disabled={isUploading}
            className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'ছবি মুছুন' : 'Remove'}</span>
          </button>
        )}
      </div>

      {/* Uploading Status Banner */}
      {isUploading && (
        <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl text-xs text-red-600 dark:text-red-400 flex items-center gap-2 animate-pulse">
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          <span>{uploadStatus}</span>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Preview Card */}
      {value.imageUrl ? (
        <div className="space-y-3">
          <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 max-h-72 aspect-16/9 group">
            <img
              src={value.imageUrl}
              alt={value.altText || 'Featured preview'}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-white/90 hover:bg-white text-slate-900 rounded-lg text-xs font-bold flex items-center gap-1 shadow-md"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Replace</span>
              </button>
              <a
                href={value.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-black/70 hover:bg-black text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-md"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Full Size</span>
              </a>
            </div>
          </div>

          {/* Image Metadata Inputs: ALT text, Caption, Credit */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="sm:col-span-1">
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'bn' ? 'ALT টেক্সট (SEO ও অ্যাক্সেসিবিলিটি)' : 'ALT Text (SEO & Accessibility)'}
                <span className="text-red-500 ml-0.5">*</span>
              </label>
              <input
                type="text"
                value={value.altText || ''}
                onChange={(e) => onChange({ ...value, altText: e.target.value })}
                placeholder="Descriptive image context for Google & screen readers..."
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-red-500"
              />
            </div>

            <div className="sm:col-span-1">
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'bn' ? 'ক্যাপশন (Caption)' : 'Caption (Optional)'}
              </label>
              <input
                type="text"
                value={value.caption || ''}
                onChange={(e) => onChange({ ...value, caption: e.target.value })}
                placeholder="Story headline caption..."
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-red-500"
              />
            </div>

            <div className="sm:col-span-1">
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'bn' ? 'ছবির উৎস / ক্রেডিট' : 'Photo Credit / Source'}
              </label>
              <input
                type="text"
                value={value.credit || ''}
                onChange={(e) => onChange({ ...value, credit: e.target.value })}
                placeholder="The GeoPacts / Reuters / Unsplash"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-red-500"
              />
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 dark:border-slate-700 hover:border-red-500/60 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-800/30 flex flex-col items-center justify-center gap-2"
        >
          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {language === 'bn' ? 'কোনো ফিচার্ড ছবি যুক্ত নেই' : 'No featured image selected'}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {language === 'bn'
                ? 'কম্পিউটার থেকে আপলোড করতে এখানে ক্লিক করুন বা ড্র্যাগ করুন'
                : 'Click to upload from device or select from Media Library'}
            </p>
          </div>
        </div>
      )}

      {/* Media Library Selector Modal */}
      {showMediaPicker && (
        <MediaLibraryModal
          isOpen={showMediaPicker}
          onClose={() => setShowMediaPicker(false)}
          onSelectImage={handleSelectFromLibrary}
          selectMode={true}
          selectButtonLabel={language === 'bn' ? 'ফিচার্ড ইমেজ হিসেবে ব্যবহার করুন' : 'Use as Featured Image'}
          language={language}
          currentToken={currentToken}
        />
      )}
    </div>
  );
};
