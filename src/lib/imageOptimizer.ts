/**
 * The GeoPacts - Client-side Image Optimization Engine
 * 
 * Rules applied:
 * 1. File validation (type checking, max size 5MB)
 * 2. Canvas-based resizing to optimal web dimensions (max 1400px width for desktop, 800px for thumbs)
 * 3. Modern format conversion (WebP with 0.82 quality)
 * 4. Generates unique, structured storage paths: news-images/YYYY/MM/article-images/[filename]-[hash].webp
 * 5. Prevents delivering 5000px multi-megabyte images to mobile visitors
 */

export interface OptimizedImageResult {
  file: File;
  blob: Blob;
  previewUrl: string;
  width: number;
  height: number;
  originalSize: number;
  compressedSize: number;
  compressionRatio: string;
  storagePath: string;
  mimeType: string;
}

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0 to 1, default 0.82
  outputFormat?: 'image/webp' | 'image/jpeg';
}

export { uploadImageToSupabaseStorage } from './supabase';

/**
 * Validates selected file before processing
 */
export function validateImageFile(file: File, maxSizeBytes = 5 * 1024 * 1024): { valid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
  
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported file format (${file.type || 'unknown'}). Please upload a valid JPG, PNG, or WebP image.`
    };
  }

  if (file.size > maxSizeBytes) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File is too large (${sizeMb} MB). Maximum allowed upload size is 5 MB.`
    };
  }

  return { valid: true };
}

/**
 * Compresses and resizes image in-browser using HTML5 Canvas
 */
export async function optimizeImage(
  file: File,
  options: ImageOptimizationOptions = {}
): Promise<OptimizedImageResult> {
  const {
    maxWidth = 1400,
    maxHeight = 900,
    quality = 0.82,
    outputFormat = 'image/webp'
  } = options;

  return new Promise((resolve, reject) => {
    // 1. Validate
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return reject(new Error(validation.error));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read selected image file.'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to decode image data.'));
      img.onload = () => {
        let { width, height } = img;

        // Calculate aspect ratio preserving dimensions
        if (width > maxWidth || height > maxHeight) {
          const widthRatio = maxWidth / width;
          const heightRatio = maxHeight / height;
          const bestRatio = Math.min(widthRatio, heightRatio);
          width = Math.round(width * bestRatio);
          height = Math.round(height * bestRatio);
        }

        // Create offscreen canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('HTML Canvas 2D context is not supported in this browser.'));
        }

        // Use high quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw resized image
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to modern WebP blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error('Failed to generate optimized WebP image blob.'));
            }

            const cleanBaseName = file.name
              .replace(/\.[^/.]+$/, '')
              .toLowerCase()
              .replace(/[^a-z0-9_-]/g, '-')
              .slice(0, 40);

            const timestamp = Date.now();
            const randomHash = Math.random().toString(36).substring(2, 8);
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');

            // Structured storage path rule inside news-images bucket: YYYY/MM/article-images/[name]-[hash].webp
            const storagePath = `${year}/${month}/article-images/${cleanBaseName}-${timestamp}-${randomHash}.webp`;
            const optimizedFileName = `${cleanBaseName}-${timestamp}.webp`;

            const optimizedFile = new File([blob], optimizedFileName, {
              type: outputFormat,
              lastModified: timestamp
            });

            const originalSize = file.size;
            const compressedSize = blob.size;
            const savingsPercent = Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100));
            const previewUrl = URL.createObjectURL(blob);

            resolve({
              file: optimizedFile,
              blob,
              previewUrl,
              width,
              height,
              originalSize,
              compressedSize,
              compressionRatio: `${savingsPercent}%`,
              storagePath,
              mimeType: outputFormat
            });
          },
          outputFormat,
          quality
        );
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Format bytes to readable string (e.g. 1.2 MB or 450 KB)
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
