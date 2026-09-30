import React, { useState } from 'react';
import { Play, X, Film } from 'lucide-react';
import { Language } from '../types';

interface VideoItem {
  id: string;
  title: string;
  titleBn: string;
  duration: string;
  category: string;
  thumbnail: string;
  videoEmbedUrl: string;
}

const VIDEOS: VideoItem[] = [
  {
    id: 'v1',
    title: 'Inside Next-Gen Quantum Fabrication Labs: How Atoms are Aligned',
    titleBn: 'কোয়ান্টাম চিপ ল্যাবরেটরি পরিদর্শন: কীভাবে কাজ করে এই প্রযুক্তি',
    duration: '08:45',
    category: 'Technology',
    thumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    videoEmbedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ'
  },
  {
    id: 'v2',
    title: 'Deep Ocean Trench Exploration: Uncovering Bioluminescent Marvels',
    titleBn: 'গভীর সমুদ্রের তলদেশে অজানা প্রাণীর সন্ধানে বিজ্ঞানীদের অভিযান',
    duration: '12:20',
    category: 'Science',
    thumbnail: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80',
    videoEmbedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ'
  },
  {
    id: 'v3',
    title: 'Autonomous eVTOL Cockpit Maiden Voyage Telemetry Breakdown',
    titleBn: 'চালকমুক্ত বৈদ্যুতিক বিমানের প্রথম সফল ফ্লাইটের ভিডিও ও ডাটা বিশ্লেষণ',
    duration: '06:15',
    category: 'Aerospace',
    thumbnail: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&auto=format&fit=crop&q=80',
    videoEmbedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ'
  }
];

interface VideoSectionProps {
  language: Language;
}

export const VideoSection: React.FC<VideoSectionProps> = ({ language }) => {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  return (
    <section className="mb-10 bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-red-600 text-white rounded-lg">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black uppercase tracking-wider">
              {language === 'bn' ? 'ভিডিও ও মাল্টিমিডিয়া স্পটলাইট' : 'Multimedia & Video Showcase'}
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'bn' ? 'ভিডিও প্রতিবেদনের মাধ্যমে জানুন বিশ্বের সেরা খবর' : 'Watch in-depth visual documentaries & briefings'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {VIDEOS.map((vid) => (
          <div
            key={vid.id}
            onClick={() => setActiveVideo(vid)}
            className="group cursor-pointer rounded-xl overflow-hidden bg-slate-800 border border-slate-700/60 hover:border-red-500/50 transition-all hover:shadow-xl"
          >
            <div className="relative aspect-video overflow-hidden">
              <img
                src={vid.thumbnail}
                alt={language === 'bn' ? vid.titleBn : vid.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-red-600 transition-all">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
              </div>

              <span className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-md text-[11px] font-bold px-2 py-0.5 rounded text-white">
                {vid.duration}
              </span>

              <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                {vid.category}
              </span>
            </div>

            <div className="p-4">
              <h4 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors line-clamp-2 leading-snug">
                {language === 'bn' ? vid.titleBn : vid.title}
              </h4>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal Player */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl relative">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <h4 className="font-bold text-sm sm:text-base text-white truncate pr-4">
                {language === 'bn' ? activeVideo.titleBn : activeVideo.title}
              </h4>
              <button
                onClick={() => setActiveVideo(null)}
                className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video bg-black flex items-center justify-center">
              <div className="p-8 text-center text-slate-400">
                <div className="w-16 h-16 rounded-full bg-red-600 text-white mx-auto flex items-center justify-center mb-4 shadow-lg animate-pulse">
                  <Play className="w-7 h-7 fill-current ml-1" />
                </div>
                <h5 className="text-base font-bold text-white mb-1">
                  {language === 'bn' ? activeVideo.titleBn : activeVideo.title}
                </h5>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  {language === 'bn'
                    ? 'ভিডিও প্রাকদর্শন সক্রিয় রয়েছে। দ্য জিওপ্যাক্টস এইচডি মাল্টিমিডিয়া স্ট্রিমিং।'
                    : 'HD Video stream ready. The GeoPacts high-definition interactive documentary player.'}
                </p>
                <div className="mt-4 inline-block px-3 py-1 bg-slate-800 text-xs text-red-400 rounded-full font-semibold">
                  Runtime: {activeVideo.duration} • Category: {activeVideo.category}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
