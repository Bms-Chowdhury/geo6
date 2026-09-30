import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import { FontSize, FONT_SIZES } from './extensions/fontSizeExtension';
import { MediaLibraryModal } from './MediaLibraryModal';
import { optimizeImage } from '../lib/imageOptimizer';
import { uploadImageToSupabaseStorage, registerMediaItemInSupabase } from '../lib/supabase';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Unlink,
  Image as ImageIcon,
  Minus,
  Undo2,
  Redo2,
  Highlighter,
  Maximize2,
  Minimize2,
  Code2,
  RemoveFormatting,
  Clock,
  FileText,
  Sparkles,
  ExternalLink,
  AArrowDown,
  AArrowUp,
  ChevronDown,
  CheckCircle2,
  RotateCcw,
  Type,
  FolderOpen,
  Upload,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface TipTapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
  maxHeight?: string;
  language?: 'en' | 'bn';
  disabled?: boolean;
  onEditorReady?: (editor: any) => void;
  currentToken?: string;
}

export const TipTapEditor: React.FC<TipTapEditorProps> = ({
  content,
  onChange,
  placeholder = 'Write your investigative story, analysis, or news report here...',
  minHeight = '240px',
  maxHeight = '600px',
  language = 'en',
  disabled = false,
  onEditorReady,
  currentToken = '',
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSource, setShowSource] = useState(false);
  const [sourceHtml, setSourceHtml] = useState(content);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  
  // Image insertion state (Supabase storage backed)
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [imageCredit, setImageCredit] = useState('');
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState<string | null>(null);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const inContentFileInputRef = useRef<HTMLInputElement>(null);

  const [currentFontSize, setCurrentFontSize] = useState<string>('16px');
  const [showFontSizeMenu, setShowFontSizeMenu] = useState(false);
  const fontSizeMenuRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Underline,
      FontSize,
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-red-600 dark:text-red-400 underline font-medium hover:text-red-700 transition-colors',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-xl max-w-full h-auto my-4 shadow-sm border border-gray-200 dark:border-slate-800 mx-auto block',
          loading: 'lazy',
          decoding: 'async',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setSourceHtml(html);
      onChange(html);
    },
  });

  // Sync external content update if changed outside editor
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      // Check if it's plain text without tags, wrap in paragraphs
      const isHtml = /<[a-z][\s\S]*>/i.test(content);
      if (!isHtml && content.trim()) {
        const formatted = content
          .split('\n\n')
          .map(p => {
            if (p.startsWith('### ')) return `<h3>${p.replace('### ', '')}</h3>`;
            if (p.startsWith('## ')) return `<h2>${p.replace('## ', '')}</h2>`;
            if (p.startsWith('# ')) return `<h1>${p.replace('# ', '')}</h1>`;
            return `<p>${p}</p>`;
          })
          .join('');
        editor.commands.setContent(formatted, { emitUpdate: false });
        setSourceHtml(formatted);
      } else {
        editor.commands.setContent(content, { emitUpdate: false });
        setSourceHtml(content);
      }
    }
  }, [content, editor]);

  // Sync disabled state
  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
      if (onEditorReady) {
        onEditorReady(editor);
      }
    }
  }, [disabled, editor, onEditorReady]);

  // ESC key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Track and synchronize active font size with editor selection
  useEffect(() => {
    if (!editor) return;
    const updateFontSize = () => {
      const size = editor.getAttributes('fontSize')?.size;
      setCurrentFontSize(size || '16px');
    };
    editor.on('selectionUpdate', updateFontSize);
    editor.on('transaction', updateFontSize);
    return () => {
      editor.off('selectionUpdate', updateFontSize);
      editor.off('transaction', updateFontSize);
    };
  }, [editor]);

  // Close font size dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (fontSizeMenuRef.current && !fontSizeMenuRef.current.contains(e.target as Node)) {
        setShowFontSizeMenu(false);
      }
    };
    if (showFontSizeMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showFontSizeMenu]);

  const handleIncreaseFontSize = useCallback(() => {
    if (!editor) return;
    const currentAttr = editor.getAttributes('fontSize')?.size;
    const numericCurrent = currentAttr ? parseInt(currentAttr, 10) : 16;
    
    // Find next preset size strictly larger than current
    const nextPreset = FONT_SIZES.find(s => parseInt(s, 10) > numericCurrent);
    const nextSize = nextPreset || `${Math.min(numericCurrent + 2, 72)}px`;
    
    editor.chain().focus().setFontSize(nextSize).run();
    setCurrentFontSize(nextSize);
  }, [editor]);

  const handleDecreaseFontSize = useCallback(() => {
    if (!editor) return;
    const currentAttr = editor.getAttributes('fontSize')?.size;
    const numericCurrent = currentAttr ? parseInt(currentAttr, 10) : 16;
    
    // Find previous preset size strictly smaller than current
    const prevPresets = FONT_SIZES.filter(s => parseInt(s, 10) < numericCurrent);
    if (prevPresets.length === 0) return;
    const prevSize = prevPresets[prevPresets.length - 1];
    
    if (prevSize === '16px') {
      editor.chain().focus().unsetFontSize().run();
      setCurrentFontSize('16px');
    } else {
      editor.chain().focus().setFontSize(prevSize).run();
      setCurrentFontSize(prevSize);
    }
  }, [editor]);

  const handleSelectFontSize = useCallback((size: string) => {
    if (!editor) return;
    if (size === '16px') {
      editor.chain().focus().unsetFontSize().run();
      setCurrentFontSize('16px');
    } else {
      editor.chain().focus().setFontSize(size).run();
      setCurrentFontSize(size);
    }
    setShowFontSizeMenu(false);
  }, [editor]);

  const handleResetFontSize = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().unsetFontSize().run();
    setCurrentFontSize('16px');
    setShowFontSizeMenu(false);
  }, [editor]);

  const handleApplyLink = useCallback(() => {
    if (!editor) return;
    if (linkUrl.trim() === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      let finalUrl = linkUrl.trim();
      if (!/^https?:\/\//i.test(finalUrl) && !/^mailto:/i.test(finalUrl)) {
        finalUrl = 'https://' + finalUrl;
      }
      editor.chain().focus().extendMarkRange('link').setLink({ href: finalUrl }).run();
    }
    setShowLinkModal(false);
    setLinkUrl('');
  }, [editor, linkUrl]);

  const handleInContentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImageUploading(true);
    setImageUploadError(null);
    setImageUploadProgress(language === 'bn' ? 'ছবি অপ্টিমাইজ করা হচ্ছে (WebP)...' : 'Optimizing image to WebP...');

    try {
      const optimized = await optimizeImage(file, { maxWidth: 1400, maxHeight: 900, quality: 0.82 });
      setImageUploadProgress(language === 'bn' ? 'সুপাবেজে আপলোড হচ্ছে...' : 'Uploading to Supabase Storage...');

      const defaultAlt = imageAlt || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      const uploadRes = await uploadImageToSupabaseStorage(
        optimized.file,
        optimized.storagePath,
        {
          filename: optimized.file.name,
          altText: defaultAlt,
          caption: imageCaption.trim(),
          credit: imageCredit.trim() || 'The GeoPacts',
          mimeType: 'image/webp',
          sizeBytes: optimized.file.size
        }
      );

      if (!uploadRes.success || !uploadRes.publicUrl) {
        throw new Error(uploadRes.error || 'Failed to upload image to Supabase Storage.');
      }

      // Register directly in Supabase media table
      try {
        await registerMediaItemInSupabase({
          id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          url: uploadRes.publicUrl,
          storagePath: uploadRes.storagePath || optimized.storagePath,
          filename: optimized.file.name,
          altText: defaultAlt,
          caption: imageCaption.trim(),
          credit: imageCredit.trim() || 'The GeoPacts',
          mimeType: 'image/webp',
          sizeBytes: optimized.file.size,
          usedInArticleIds: [],
          createdAt: new Date().toISOString()
        });
      } catch (regErr) {
        console.warn('Could not register media item in Supabase:', regErr);
      }

      setImageUrl(uploadRes.publicUrl);
      if (!imageAlt.trim()) {
        setImageAlt(defaultAlt);
      }
      setImageUploadProgress(null);
    } catch (err: any) {
      console.error('In-content image upload failed:', err);
      setImageUploadError(err.message || 'Image upload failed.');
      setImageUploadProgress(null);
    } finally {
      setIsImageUploading(false);
      if (inContentFileInputRef.current) inContentFileInputRef.current.value = '';
    }
  };

  const handleApplyImage = useCallback(() => {
    if (!editor || !imageUrl.trim()) return;
    const finalAlt = imageAlt.trim() || 'Article visual';
    const finalCaption = imageCaption.trim();
    const finalCredit = imageCredit.trim();

    // 1. Insert TipTap image node
    editor.chain().focus().setImage({
      src: imageUrl.trim(),
      alt: finalAlt,
      title: finalCaption || undefined
    }).run();

    // 2. If caption or credit specified, insert elegant caption paragraph below
    if (finalCaption || finalCredit) {
      const captionText = `${finalCaption}${finalCaption && finalCredit ? ' • ' : ''}${finalCredit ? `Photo: ${finalCredit}` : ''}`;
      editor.chain().focus().insertContent(`<p class="text-xs text-center text-slate-500 dark:text-slate-400 italic mt-1.5 mb-4">${captionText}</p>`).run();
    }

    setShowImageModal(false);
    setImageUrl('');
    setImageAlt('');
    setImageCaption('');
    setImageCredit('');
    setImageUploadError(null);
  }, [editor, imageUrl, imageAlt, imageCaption, imageCredit]);

  const handleSourceChange = (newSource: string) => {
    setSourceHtml(newSource);
    onChange(newSource);
    if (editor) {
      editor.commands.setContent(newSource, { emitUpdate: false });
    }
  };

  if (!editor) {
    return (
      <div className="w-full h-48 flex items-center justify-center bg-slate-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-slate-400 text-xs animate-pulse">
        {language === 'bn' ? 'এডিটর লোড হচ্ছে...' : 'Initializing Rich Text Newsroom Editor...'}
      </div>
    );
  }

  // Calculate live stats
  const textContent = editor.getText();
  const wordCount = textContent.trim() ? textContent.trim().split(/\s+/).length : 0;
  const charCount = textContent.length;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  const ToolbarButton: React.FC<{
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    title: string;
    children: React.ReactNode;
  }> = ({ onClick, isActive = false, disabled = false, title, children }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1.5 sm:p-2 rounded-md text-xs transition-all flex items-center justify-center shrink-0 ${
        isActive
          ? 'bg-red-600 text-white font-bold shadow-xs'
          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
      } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {children}
    </button>
  );

  const Divider = () => (
    <div className="w-[1px] h-5 bg-gray-200 dark:bg-slate-700 mx-1 shrink-0 self-center" />
  );

  return (
    <div
      className={`flex flex-col bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-xl transition-all ${
        isFullscreen
          ? 'fixed inset-0 z-50 rounded-none border-none shadow-2xl p-4 sm:p-6 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-md overflow-hidden'
          : 'w-full shadow-xs'
      }`}
    >
      {/* Editor Main Header / Toolbar */}
      <div className="border-b border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 rounded-t-xl sticky top-0 z-10 px-2 py-1.5 flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-0.5">
          {/* Group: History */}
          <div className="flex items-center gap-0.5 shrink-0">
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              title={language === 'bn' ? 'পূর্বাবস্থায় ফিরুন (Ctrl+Z)' : 'Undo (Ctrl+Z)'}
            >
              <Undo2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              title={language === 'bn' ? 'পুনরায় করুন (Ctrl+Y)' : 'Redo (Ctrl+Y)'}
            >
              <Redo2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </ToolbarButton>
          </div>

          <Divider />

          {/* Group: Headings / Text Level */}
          <div className="flex items-center gap-0.5 shrink-0">
            <ToolbarButton
              onClick={() => editor.chain().focus().setParagraph().run()}
              isActive={editor.isActive('paragraph')}
              title={language === 'bn' ? 'অনুচ্ছেদ (Paragraph)' : 'Normal Paragraph'}
            >
              <span className="font-semibold text-[11px] sm:text-xs px-0.5">¶</span>
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              isActive={editor.isActive('heading', { level: 1 })}
              title={language === 'bn' ? 'শিরোনাম ১ (H1)' : 'Major Headline (H1)'}
            >
              <Heading1 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              isActive={editor.isActive('heading', { level: 2 })}
              title={language === 'bn' ? 'শিরোনাম ২ (H2)' : 'Section Heading (H2)'}
            >
              <Heading2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              isActive={editor.isActive('heading', { level: 3 })}
              title={language === 'bn' ? 'শিরোনাম ৩ (H3)' : 'Sub-heading (H3)'}
            >
              <Heading3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
              isActive={editor.isActive('heading', { level: 4 })}
              title={language === 'bn' ? 'শিরোনাম ৪ (H4)' : 'Minor Heading (H4)'}
            >
              <Heading4 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </ToolbarButton>
          </div>

          <Divider />

          {/* Group: Font Size Controls (Decrease, Selector, Increase) */}
          <div ref={fontSizeMenuRef} className="relative flex items-center bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-0.5 shrink-0 shadow-2xs">
            <button
              type="button"
              onClick={handleDecreaseFontSize}
              title={language === 'bn' ? 'ফন্ট সাইজ ছোট করুন (A-)' : 'Decrease Font Size (A-)'}
              className="p-1 sm:p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded text-xs transition-colors flex items-center justify-center cursor-pointer active:scale-95"
            >
              <AArrowDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            <button
              type="button"
              onClick={() => setShowFontSizeMenu(!showFontSizeMenu)}
              title={language === 'bn' ? 'ফন্ট সাইজ নির্বাচন করুন' : 'Select Font Size'}
              className="px-1.5 sm:px-2 py-0.5 text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer min-w-[48px] sm:min-w-[54px] justify-center"
            >
              <span className="font-mono">{currentFontSize}</span>
              <ChevronDown className="w-2.5 h-2.5 opacity-60" />
            </button>

            <button
              type="button"
              onClick={handleIncreaseFontSize}
              title={language === 'bn' ? 'ফন্ট সাইজ বড় করুন (A+)' : 'Increase Font Size (A+)'}
              className="p-1 sm:p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded text-xs transition-colors flex items-center justify-center cursor-pointer active:scale-95"
            >
              <AArrowUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {showFontSizeMenu && (
              <div className="absolute top-full left-0 mt-1.5 z-50 w-48 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl py-1 text-xs animate-in fade-in slide-in-from-top-1">
                <div className="px-3 py-1.5 border-b border-gray-100 dark:border-slate-700 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center justify-between">
                  <span>{language === 'bn' ? 'ফন্ট সাইজ' : 'Font Size'}</span>
                  <span className="text-red-500 font-mono font-bold">{currentFontSize}</span>
                </div>
                <div className="max-h-56 overflow-y-auto py-1">
                  {FONT_SIZES.map(size => {
                    const isSelected = currentFontSize === size || (size === '16px' && !editor?.getAttributes('fontSize')?.size);
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleSelectFontSize(size)}
                        className={`w-full px-3 py-1.5 text-left flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-bold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        <span style={{ fontSize: size === '42px' || size === '36px' ? '18px' : size }}>
                          {size} {size === '16px' ? (language === 'bn' ? '(ডিফল্ট)' : '(Default)') : ''}
                        </span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-red-600 dark:text-red-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
                <div className="pt-1 border-t border-gray-100 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={handleResetFontSize}
                    className="w-full px-3 py-1.5 text-left text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-1.5 transition-colors text-[11px] cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3 text-slate-400" />
                    <span>{language === 'bn' ? 'স্বাভাবিক সাইজে ফিরুন' : 'Reset to Default (16px)'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <Divider />
          <div className="flex items-center gap-0.5 shrink-0">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive('bold')}
              title={language === 'bn' ? 'গাঢ় (Ctrl+B)' : 'Bold (Ctrl+B)'}
            >
              <Bold className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive('italic')}
              title={language === 'bn' ? 'তির্যক (Ctrl+I)' : 'Italic (Ctrl+I)'}
            >
              <Italic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              isActive={editor.isActive('underline')}
              title={language === 'bn' ? 'আন্ডারলাইন (Ctrl+U)' : 'Underline (Ctrl+U)'}
            >
              <UnderlineIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              isActive={editor.isActive('strike')}
              title={language === 'bn' ? 'কেটে দিন (Strikethrough)' : 'Strikethrough'}
            >
              <Strikethrough className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHighlight({ color: '#fef08a' }).run()}
              isActive={editor.isActive('highlight')}
              title={language === 'bn' ? 'হাইলাইট করুন' : 'Highlight Text'}
            >
              <Highlighter className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCode().run()}
              isActive={editor.isActive('code')}
              title={language === 'bn' ? 'ইনলাইন কোড' : 'Inline Code'}
            >
              <Code className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </ToolbarButton>
          </div>

          <Divider />

          {/* Group: Alignment */}
          <div className="flex items-center gap-0.5 shrink-0">
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              isActive={editor.isActive({ textAlign: 'left' })}
              title={language === 'bn' ? 'বামে সাজান' : 'Align Left'}
            >
              <AlignLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              isActive={editor.isActive({ textAlign: 'center' })}
              title={language === 'bn' ? 'মাঝখানে সাজান' : 'Align Center'}
            >
              <AlignCenter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              isActive={editor.isActive({ textAlign: 'right' })}
              title={language === 'bn' ? 'ডানে সাজান' : 'Align Right'}
            >
              <AlignRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
              isActive={editor.isActive({ textAlign: 'justify' })}
              title={language === 'bn' ? 'দুই পাশে সমান' : 'Justify'}
            >
              <AlignJustify className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </ToolbarButton>
          </div>

          <Divider />

          {/* Group: Lists & Blocks */}
          <div className="flex items-center gap-0.5 shrink-0">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive('bulletList')}
              title={language === 'bn' ? 'বুলেট তালিকা' : 'Bullet List'}
            >
              <List className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive('orderedList')}
              title={language === 'bn' ? 'সংখ্যা তালিকা' : 'Numbered List'}
            >
              <ListOrdered className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive('blockquote')}
              title={language === 'bn' ? 'উদ্ধৃতি / পুল-কোট' : 'Editorial Pullquote'}
            >
              <Quote className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              title={language === 'bn' ? 'অনুভূমিক বিভাজক রেখা' : 'Horizontal Divider'}
            >
              <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </ToolbarButton>
          </div>

          <Divider />

          {/* Group: Media & Links */}
          <div className="flex items-center gap-0.5 shrink-0">
            <ToolbarButton
              onClick={() => {
                const previousUrl = editor.getAttributes('link').href;
                setLinkUrl(previousUrl || '');
                setShowLinkModal(true);
              }}
              isActive={editor.isActive('link')}
              title={language === 'bn' ? 'লিংক যুক্ত করুন' : 'Insert Link'}
            >
              <LinkIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </ToolbarButton>
            {editor.isActive('link') && (
              <ToolbarButton
                onClick={() => editor.chain().focus().unsetLink().run()}
                title={language === 'bn' ? 'লিংক সরান' : 'Remove Link'}
              >
                <Unlink className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500" />
              </ToolbarButton>
            )}
            <ToolbarButton
              onClick={() => setShowImageModal(true)}
              title={language === 'bn' ? 'ছবি যুক্ত করুন' : 'Insert Image'}
            >
              <ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
            </ToolbarButton>
          </div>

          <Divider />

          {/* Group: Utilities & Modes */}
          <div className="flex items-center gap-0.5 shrink-0 ml-auto">
            <ToolbarButton
              onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
              title={language === 'bn' ? 'ফরম্যাটিং সাফ করুন' : 'Clear Formatting'}
            >
              <RemoveFormatting className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => setShowSource(!showSource)}
              isActive={showSource}
              title={language === 'bn' ? 'এইচটিএমএল সোর্স কোড' : 'HTML Source View'}
            >
              <Code2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => setIsFullscreen(!isFullscreen)}
              isActive={isFullscreen}
              title={
                isFullscreen
                  ? language === 'bn' ? 'ফুলস্ক্রিন থেকে বের হন (Esc)' : 'Exit Fullscreen (Esc)'
                  : language === 'bn' ? 'ফুলস্ক্রিন মোড' : 'Distraction-Free Fullscreen'
              }
            >
              {isFullscreen ? (
                <Minimize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              )}
            </ToolbarButton>
          </div>
        </div>
      </div>

      {/* Floating Modal for Link Input */}
      {showLinkModal && (
        <div className="p-3 bg-slate-100 dark:bg-slate-800/90 border-b border-gray-200 dark:border-slate-700 flex items-center gap-2 animate-in fade-in">
          <LinkIcon className="w-4 h-4 text-red-600 shrink-0" />
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleApplyLink();
              }
            }}
            placeholder="https://example.com/article"
            className="flex-1 px-3 py-1 text-xs rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-red-500"
            autoFocus
          />
          <button
            type="button"
            onClick={handleApplyLink}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-md cursor-pointer transition-colors"
          >
            {language === 'bn' ? 'যুক্ত করুন' : 'Apply'}
          </button>
          <button
            type="button"
            onClick={() => setShowLinkModal(false)}
            className="px-2 py-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
          >
            {language === 'bn' ? 'বাতিল' : 'Cancel'}
          </button>
        </div>
      )}

      {/* Floating Modal for In-Content Image Insertion (Supabase Storage Backed) */}
      {showImageModal && (
        <div className="p-4 bg-slate-50 dark:bg-slate-800/95 border-b border-gray-200 dark:border-slate-700 space-y-3 animate-in fade-in">
          <input
            ref={inContentFileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="hidden"
            onChange={handleInContentImageUpload}
          />

          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 dark:border-slate-700 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-red-600/10 text-red-600 flex items-center justify-center">
                <ImageIcon className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                {language === 'bn' ? 'নিবন্ধে ছবি সন্নিবেশ (In-Content Image)' : 'Insert In-Content Image'}
              </span>
              <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded font-mono">
                news-images
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => inContentFileInputRef.current?.click()}
                disabled={isImageUploading}
                className="px-2.5 py-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                {isImageUploading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
                <span>{language === 'bn' ? 'নতুন ছবি আপলোড' : 'Upload to Supabase'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowMediaLibrary(true)}
                disabled={isImageUploading}
                className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <FolderOpen className="w-3.5 h-3.5 text-slate-500" />
                <span>{language === 'bn' ? 'মিডিয়া লাইব্রেরি' : 'Media Library'}</span>
              </button>
            </div>
          </div>

          {/* Upload progress & error */}
          {isImageUploading && (
            <div className="p-2.5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg text-xs text-red-600 dark:text-red-400 flex items-center gap-2 animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
              <span>{imageUploadProgress}</span>
            </div>
          )}

          {imageUploadError && (
            <div className="p-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-lg text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{imageUploadError}</span>
            </div>
          )}

          {/* URL & Metadata Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
            <div className="sm:col-span-4">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                {language === 'bn' ? 'পাবলিক ইমেজ URL / পাথ' : 'Supabase Storage / Public URL'}
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://...supabase.co/storage/v1/object/public/news-images/..."
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                {language === 'bn' ? 'Alt বিবরণ (SEO)*' : 'ALT Text (SEO & a11y)*'}
              </label>
              <input
                type="text"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                placeholder="Descriptive image context..."
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                {language === 'bn' ? 'ক্যাপশন (ঐচ্ছিক)' : 'Caption (Optional)'}
              </label>
              <input
                type="text"
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
                placeholder="Context caption below photo..."
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="sm:col-span-2 flex items-center gap-1.5 justify-end">
              <button
                type="button"
                onClick={handleApplyImage}
                disabled={!imageUrl.trim() || isImageUploading}
                className="w-full py-1.5 px-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs rounded-lg cursor-pointer transition-colors shadow-xs"
              >
                {language === 'bn' ? 'যুক্ত করুন' : 'Insert Image'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowImageModal(false);
                  setImageUploadError(null);
                }}
                className="py-1.5 px-2.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                {language === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
            </div>
          </div>

          {/* Live Thumbnail Preview if URL present */}
          {imageUrl && (
            <div className="flex items-center gap-3 pt-1 border-t border-gray-200 dark:border-slate-700/60">
              <img
                src={imageUrl}
                alt={imageAlt || 'Preview'}
                className="w-14 h-10 object-cover rounded-lg border border-gray-200 dark:border-slate-700 shrink-0"
              />
              <div className="text-[11px] text-slate-500 truncate flex-1 font-mono">
                {imageUrl}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Media Library Selector Modal for In-Content Insertion */}
      {showMediaLibrary && (
        <MediaLibraryModal
          isOpen={showMediaLibrary}
          onClose={() => setShowMediaLibrary(false)}
          onSelectImage={(selected) => {
            setImageUrl(selected.url);
            if (selected.altText) setImageAlt(selected.altText);
            if (selected.caption) setImageCaption(selected.caption);
            if (selected.credit) setImageCredit(selected.credit);
          }}
          selectMode={true}
          selectButtonLabel={language === 'bn' ? 'এই ছবিটি নির্বাচন করুন' : 'Select Image for Content'}
          language={language}
          currentToken={currentToken}
        />
      )}

      {/* Editor Content Area / Source Mode */}
      <div
        className={`relative flex-1 overflow-y-auto ${
          isFullscreen ? 'max-h-[calc(100vh-140px)] p-4' : 'p-3 sm:p-4'
        }`}
        style={{ minHeight: isFullscreen ? '60vh' : minHeight, maxHeight: isFullscreen ? 'none' : maxHeight }}
      >
        {showSource ? (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between pb-2 text-[11px] font-mono text-slate-500">
              <span>{language === 'bn' ? 'সরাসরি এইচটিএমএল এডিট করুন:' : 'Direct HTML Source Editing:'}</span>
              <span className="text-red-500">
                {language === 'bn' ? 'সতর্কতা: সঠিক এইচটিএমএল ট্যাগ ব্যবহার করুন' : 'Live bidirectional sync'}
              </span>
            </div>
            <textarea
              value={sourceHtml}
              onChange={(e) => handleSourceChange(e.target.value)}
              rows={12}
              className="w-full flex-1 font-mono text-xs p-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-slate-900 text-emerald-400 focus:outline-none focus:ring-1 focus:ring-red-500 selection:bg-slate-700 resize-none"
            />
          </div>
        ) : (
          <EditorContent
            editor={editor}
            className="tiptap-editor-prose prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed focus:outline-none"
          />
        )}
      </div>

      {/* Live Editorial Status Bar */}
      <div className="border-t border-gray-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 rounded-b-xl px-3 py-2 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-medium">
            <FileText className="w-3.5 h-3.5 text-red-500" />
            <span>
              {wordCount.toLocaleString()} {language === 'bn' ? 'শব্দ' : 'words'}
            </span>
          </span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span>
            {charCount.toLocaleString()} {language === 'bn' ? 'অক্ষর' : 'characters'}
          </span>
          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
          <span className="hidden sm:flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>
              ~{readTimeMinutes} {language === 'bn' ? 'মিনিট পড়ার সময়' : 'min read'}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px]">
          <span className="hidden md:inline-block text-[11px] text-slate-400">
            {language === 'bn' ? 'H1 মূল শিরোনামের জন্য নির্ধারিত • H2 ও H3 অনুচ্ছেদের জন্য' : 'H1 is reserved for Page Title • Use H2/H3 for sections'}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-semibold border border-emerald-200 dark:border-emerald-800/40">
            <Sparkles className="w-3 h-3" />
            <span>{language === 'bn' ? 'টিপট্যাপ প্রো এডিটর' : 'TipTap Pro Engine'}</span>
          </span>
          {isFullscreen && (
            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              className="px-2.5 py-1 bg-red-600 text-white rounded font-bold hover:bg-red-700 cursor-pointer"
            >
              {language === 'bn' ? 'সম্পন্ন (Esc)' : 'Done (Esc)'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default TipTapEditor;
