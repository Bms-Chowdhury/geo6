import { Category, Post, Comment } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'tech',
    name: 'Technology',
    nameBn: 'প্রযুক্তি',
    slug: 'tech',
    color: 'bg-blue-600',
    description: 'Latest gadgets, artificial intelligence, software and silicon breakthroughs.'
  },
  {
    id: 'business',
    name: 'Business',
    nameBn: 'ব্যবসা ও অর্থনীতি',
    slug: 'business',
    color: 'bg-emerald-600',
    description: 'Global markets, startup ecosystems, commerce, and corporate analysis.'
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle',
    nameBn: 'লাইফস্টাইল',
    slug: 'lifestyle',
    color: 'bg-rose-500',
    description: 'Health, wellness, architecture, modern living, and travel narratives.'
  },
  {
    id: 'sports',
    name: 'Sports',
    nameBn: 'খেলাধুলা',
    slug: 'sports',
    color: 'bg-amber-600',
    description: 'Cricket, football, tournaments, athletic milestones and player stories.'
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    nameBn: 'বিনোদন',
    slug: 'entertainment',
    color: 'bg-purple-600',
    description: 'Cinema, music, streaming trends, pop culture and red-carpet reviews.'
  },
  {
    id: 'world',
    name: 'World Affairs',
    nameBn: 'আন্তর্জাতিক',
    slug: 'world',
    color: 'bg-cyan-600',
    description: 'Geopolitics, climate summits, global diplomatic shifts and current affairs.'
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post-hero-1',
    title: "iPhone 13 Mini Review: The Small Phone That's Actually Good",
    titleBn: 'আইফোন ১৩ মিনি রিভিউ: ছোট ফোনে দুর্দান্ত পারফরম্যান্স ও অনন্য অভিজ্ঞতা',
    excerpt: 'Apple proves that compact smartphones can still pack flagship camera quality, blazing A15 Bionic performance, and battery improvements.',
    excerptBn: 'অ্যাপল প্রমাণ করেছে কমপ্যাক্ট সাইজের স্মার্টফোনেও শীর্ষমানের ক্যামেরা, এ১৫ বায়োনিক চিপের দুর্দান্ত গতি এবং টেকসই ব্যাটারি পাওয়া সম্ভব।',
    content: `For years, smartphone manufacturers pushed screen sizes past six and a half inches. The iPhone 13 Mini stands as a triumphant rebellion against the oversized trend, packing flagship specifications into a comfortably one-handed chassis.

### Design and Pocketability
Weighing just 140 grams, the 5.4-inch Super Retina XDR OLED display fits effortlessly into shirt pockets and small bags. The ceramic shield front glass and IP68 water resistance provide robust daily protection.

### Camera Innovations
Dual 12MP wide and ultrawide lenses incorporate sensor-shift optical image stabilization, bringing cinematic mode video recording to pocket-friendly sizes. Low-light night mode performance rivals top-tier flagships.`,
    contentBn: `স্মার্টফোনের বাজারে যখন বিশালাকার স্ক্রিনের ছড়াছড়ি, তখন আইফোন ১৩ মিনি এক অপূর্ব ব্যতিক্রম। এক হাতে সহজে ব্যবহারযোগ্য এই ফোনে যুক্ত করা হয়েছে ফ্ল্যাগশিপ গ্রেডের সমস্ত আধুনিক ফিচার।

### কমপ্যাক্ট ডিজাইন ও প্রিমিয়াম ফিলিং
মাত্র ১৪০ গ্রাম ওজনের এই ফোনে রয়েছে ৫.৪ ইঞ্চির সুপার রেটিনা এক্সডিআর ওলেড ডিসপ্লে। সিরামিক শিল্ড গ্লাস ও আইপি৬৮ ওয়াটার রেজিস্ট্যান্সের কারণে এটি দৈনন্দিন ব্যবহারে অত্যন্ত টেকসই।

### ক্যামেরা ও ব্যাটারির উন্নতি
নতুন সেন্সর-শিফ্ট অপটিক্যাল ইমেজ স্ট্যাবিলাইজেশন এবং সিনেম্যাটিক মোডের কল্যাণে ভিডিও রেকর্ডিং আরও প্রাঞ্জল হয়েছে। নতুন এ১৫ চিপসেট ব্যাটারি সাশ্রয়ী হওয়ায় সারাদিনের ব্যাকআপ পাওয়া যায় অনায়াসেই।`,
    category: 'Technology',
    categoryBn: 'প্রযুক্তি',
    categorySlug: 'tech',
    author: {
      name: 'John Doe',
      nameBn: 'জন ডো',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'Senior Tech Critic'
    },
    date: 'Aug 02, 2026',
    dateBn: '২ আগস্ট, ২০২৬',
    readTime: '4 min read',
    views: 45200,
    likes: 3120,
    imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1200&auto=format&fit=crop&q=80',
    tags: ['iPhone', 'Apple', 'Smartphone', 'Review'],
    isFeatured: true,
    isBreaking: true,
    isTrending: true
  },
  {
    id: 'post-hero-2',
    title: 'Top 10 Largest Hot High-Quality Earphone Handsfree',
    titleBn: 'শীর্ষ ১০টি সেরা উচ্চ-মানের ব্লুটুথ ইয়ারফোন হ্যান্ডসফ্রি',
    excerpt: 'Comprehensive comparison of active noise cancellation, studio-grade drivers, and ergonomic all-day comfort in latest wireless earbuds.',
    excerptBn: 'অ্যাক্টিভ নয়েজ ক্যান্সেলেশন, স্টুডিও সাউন্ড কোয়ালিটি এবং দীর্ঘস্থায়ী আরামদায়ক ব্যবহারের জন্য সেরা ১০টি ওয়্যারলেস ইয়ারফোন।',
    content: `Wireless audio engineering has leaped into audiophile territory with LDAC, aptX Lossless codecs, and planar magnetic micro-drivers integrated into compact in-ear monitors.`,
    contentBn: `ওয়্যারলেস অডিও প্রযুক্তিতে এসেছে বিপ্লব। স্টুডিও গ্রেডের স্পষ্ট সাউন্ড, শক্তিশালী বেস এবং ক্রিস্টাল ক্লিয়ার কলিং সুবিধার সেরা ইয়ারফোনগুলোর তুলনামূলক বিশ্লেষণ।`,
    category: 'Reviews',
    categoryBn: 'রিভিউ',
    categorySlug: 'tech',
    author: {
      name: 'John Doe',
      nameBn: 'জন ডো',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      role: 'Audio Specialist'
    },
    date: 'Aug 02, 2026',
    dateBn: '২ আগস্ট, ২০২৬',
    readTime: '5 min read',
    views: 28400,
    likes: 1940,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=80',
    tags: ['Audio', 'Headphones', 'Earphones', 'Review'],
    isFeatured: true,
    isTrending: true
  },
  {
    id: 'post-hero-3',
    title: 'Seeking Suggestions Regarding Headsets for Conference Interpreters',
    titleBn: 'কনফারেন্স ইন্টারপ্রেটার হেডসেটের জন্য বিশেষ পরামর্শ ও নির্দেশিকা',
    excerpt: 'Professional interpreters demand ultra-low latency, flat frequency response, and lightweight boom mics for long diplomatic summits.',
    excerptBn: 'আন্তর্জাতিক সম্মেলন ও লাইভ ইন্টারপ্রেটারদের জন্য আরামদায়ক এবং স্পষ্ট মাইক্রোফোনযুক্ত সেরা হেডসেটের পরামর্শ।',
    content: `Simultaneous translation requires specialized acoustic precision to avoid ear fatigue during hours-long multi-lingual conferences.`,
    contentBn: `বহুভাষিক কনফারেন্সে নিরবচ্ছিন্ন অনুবাদের জন্য প্রয়োজন হালকা ওজনের হেডফোন যা দীর্ঘ সময় ব্যবহারে কানে কোনো ক্লান্তি আনে না।`,
    category: 'Speakers',
    categoryBn: 'স্পিকার্স',
    categorySlug: 'tech',
    author: {
      name: 'Sarah Jenkins',
      nameBn: 'সারাহ জেনকিন্স',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      role: 'Audio Engineer'
    },
    date: 'Aug 02, 2026',
    dateBn: '২ আগস্ট, ২০২৬',
    readTime: '3 min read',
    views: 18200,
    likes: 980,
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1200&auto=format&fit=crop&q=80',
    tags: ['Headsets', 'Workplace', 'Hardware'],
    isFeatured: true
  },
  {
    id: 'post-hero-4',
    title: 'How to Buy a Best Smartwatch or Fitness Tracker Right Now',
    titleBn: 'কীভাবে এখন সেরা স্মার্টওয়াচ বা ফিটনেস ট্র্যাকার কিনবেন',
    excerpt: 'From continuous ECG monitoring to precision GPS navigation, find the ideal wearable for your health lifestyle and budget.',
    excerptBn: 'ইসিজি সেন্সর, স্লিপ ট্র্যাকিং এবং দীর্ঘস্থায়ী ব্যাটারি সম্বলিত আপনার বাজেটের সেরা স্মার্টওয়াচ নির্বাচনের গাইড।',
    content: `Modern smartwatches have evolved from phone notification mirrors into clinical-grade health diagnostics tools on your wrist.`,
    contentBn: `স্মার্টওয়াচ এখন কেবল সময় দেখা কিংবা নোটিফিকেশন পাওয়ার মধ্যে সীমাবদ্ধ নেই, এটি আপনার দৈনন্দিন স্বাস্থ্য সুরক্ষার সার্বক্ষণিক সহযোগী।`,
    category: 'Gadgets',
    categoryBn: 'গ্যাজেটস',
    categorySlug: 'tech',
    author: {
      name: 'David Chen',
      nameBn: 'ডেভিড চেন',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      role: 'Wearables Editor'
    },
    date: 'Jul 31, 2026',
    dateBn: '৩১ জুলাই, ২০২৬',
    readTime: '4 min read',
    views: 31200,
    likes: 2450,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&auto=format&fit=crop&q=80',
    tags: ['Smartwatch', 'Wearables', 'Fitness'],
    isFeatured: true,
    isTrending: true
  },
  {
    id: 'post-tech-1',
    title: 'Top 10 Best Portable Bluetooth Speakers for Summer Fun',
    titleBn: 'গ্রীষ্মের আমেজে সেরা ১০টি পোর্টেবল ব্লুটুথ স্পিকার',
    excerpt: 'Waterproof ratings, 360-degree acoustic dispersion, and multi-day battery life for outdoor adventures and pool parties.',
    excerptBn: 'ওয়াটারপ্রুফ বডি, ৩৬০ ডিগ্রি চারপাশের সাউন্ড এবং দীর্ঘ ব্যাটারিসহ ভ্রমণের জন্য সেরা ১০টি ব্লুটুথ স্পিকার।',
    content: `Whether relaxing at the beach or hosting a backyard barbecue, the right portable speaker delivers punchy bass without distortion.`,
    contentBn: `ভ্রমণ কিংবা ঘরে পার্টির জন্য ওয়াটারপ্রুফ এবং যেকোনো আবহাওয়া উপযোগী পোর্টেবল ব্লুটুথ স্পিকারের সম্পূর্ণ রিভিউ।`,
    category: 'Products',
    categoryBn: 'পণ্য',
    categorySlug: 'tech',
    author: {
      name: 'John Doe',
      nameBn: 'জন ডো',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'Tech Reviewer'
    },
    date: 'Aug 02, 2026',
    dateBn: '২ আগস্ট, ২০২৬',
    readTime: '4 min read',
    views: 22100,
    likes: 1670,
    imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=1200&auto=format&fit=crop&q=80',
    tags: ['Speakers', 'Audio', 'Bluetooth'],
    isTrending: true
  },
  {
    id: 'post-tech-2',
    title: 'Part-time Trading on Forex as an Alternative Income',
    titleBn: 'পার্ট-টাইম ফরেক্স ট্রেডিং: বিকল্প আয়ের সম্ভাবনা ও ঝুঁকি',
    excerpt: 'Algorithmic charts, automated stop-loss strategies, and risk mitigation tools for modern independent retail traders.',
    excerptBn: 'আধুনিক চার্ট বিশ্লেষণ, অ্যালগরিদম ভিত্তিক ট্রেডিং এবং ঝুঁকি নিয়ন্ত্রণের মাধ্যমে ফরেক্স মার্কেটে কাজ করার নির্দেশিকা।',
    content: `Foreign exchange trading offers continuous liquidity across global time zones, but disciplined risk management is essential.`,
    contentBn: `অনলাইন ফাইন্যান্সিয়াল মার্কেটে সঠিক জ্ঞান এবং ডেটা বিশ্লেষণের মাধ্যমে কীভাবে কার্যকরভাবে সময় বিনিয়োগ করা যায়।`,
    category: 'Microsoft',
    categoryBn: 'বাণিজ্য',
    categorySlug: 'business',
    author: {
      name: 'John Doe',
      nameBn: 'জন ডো',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      role: 'Markets Analyst'
    },
    date: 'Aug 02, 2026',
    dateBn: '২ আগস্ট, ২০২৬',
    readTime: '5 min read',
    views: 19400,
    likes: 1280,
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&auto=format&fit=crop&q=80',
    tags: ['Forex', 'Economy', 'Fintech']
  },
  {
    id: 'post-tech-3',
    title: 'Bluetooth Technology Work in Tandem for Indoor Positioning System',
    titleBn: 'ইনডোর পজিশনিং ও ট্র্যাক ব্যবস্থার নতুন ব্লুটুথ প্রযুক্তি',
    excerpt: 'Angle of Arrival (AoA) antenna arrays turn airport terminals, hospitals, and museums into centimeter-precision navigation spaces.',
    excerptBn: 'অ্যাঙ্গেল অফ অ্যারাইভাল প্রযুক্তির মাধ্যমে ঘরের ভেতরেও সেন্টিমিটার নির্ভুলতায় লোকেশন খোঁজার সুবিধা নিয়ে এলো ব্লুটুথ।',
    content: `While satellite GPS struggles through concrete and steel, next-gen Bluetooth direction-finding delivers indoor maps with pinpoint accuracy.`,
    contentBn: `বিল্ডিংয়ের ভেতর জিপিএস সংকেত না পৌঁছালেও নতুন ব্লুটুথ প্রযুক্তির মাধ্যমে হাসপাতাল বা বিমানবন্দরে দ্রুত পথ খুঁজে পাওয়া সম্ভব।`,
    category: 'Reviews',
    categoryBn: 'রিভিউ',
    categorySlug: 'tech',
    author: {
      name: 'John Doe',
      nameBn: 'জন ডো',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      role: 'IoT Specialist'
    },
    date: 'Aug 02, 2026',
    dateBn: '২ আগস্ট, ২০২৬',
    readTime: '4 min read',
    views: 16900,
    likes: 1150,
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
    tags: ['Bluetooth', 'IoT', 'Wireless']
  },
  {
    id: 'post-story-1',
    title: 'Self-Driving Cars: Everything You Need to Know',
    titleBn: 'স্বচালিত গাড়ি: আপনার যা জানা প্রয়োজন',
    excerpt: 'Level 4 autonomous driving networks rollout across major metropolitan corridors with neural vision models.',
    excerptBn: 'অটোনোমাস লেভেল ৪ প্রযুক্তিতে চালিত গাড়ি কীভাবে শহরের ব্যস্ত রাস্তায় নিরাপদে পথ চলছে তার পূর্ণ বিবরণ।',
    content: `Autonomous vehicles have progressed from experimental research pods into fully operational commercial robo-taxis in major global hubs.`,
    contentBn: `স্বচালিত গাড়ি এখন আর বিজ্ঞান কল্পকাহিনী নয়, কৃত্রিম বুদ্ধিমত্তা ও ক্যামেরার সাহায্যে সম্পূর্ণ মানুষের সহায়তা ছাড়া নিরাপদ যাতায়াত সম্ভব হচ্ছে।`,
    category: 'Technology',
    categoryBn: 'প্রযুক্তি',
    categorySlug: 'tech',
    author: {
      name: 'John Doe',
      nameBn: 'জন ডো',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'Automotive Editor'
    },
    date: 'Jul 31, 2026',
    dateBn: '৩১ জুলাই, ২০২৬',
    readTime: '3 min read',
    views: 29800,
    likes: 2100,
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&auto=format&fit=crop&q=80',
    tags: ['Automotive', 'AI', 'SelfDriving'],
    isFeatured: true
  },
  {
    id: 'post-story-2',
    title: 'Google Must Allow Developers to Use Other Payment Systems',
    titleBn: 'গুগল প্লে স্টোরে ডেভেলপারদের অন্যান্য পেমেন্ট সুবিধা দেওয়ার নির্দেশ',
    excerpt: 'Regulatory antitrust decisions reshape application store billing frameworks and reduce developer transaction commissions.',
    excerptBn: 'আন্তর্জাতিক নীতিমালার প্রেক্ষিতে অ্যাপ নির্মাতারা এখন নিজেদের পছন্দমতো নিরাপদ পেমেন্ট ব্যবস্থা সংযুক্ত করতে পারছেন।',
    content: `New regulatory standards are fostering competitive marketplaces by permitting third-party billing providers inside mobile ecosystems.`,
    contentBn: `অ্যাপ নির্মাতাদের জন্য বড় স্বস্তি নিয়ে এলো আদালতের এই সিদ্ধান্ত, যার ফলে বিকল্প পেমেন্ট গেটওয়ের মাধ্যমে লেনদেনের সুযোগ উন্মুক্ত হলো।`,
    category: 'Business',
    categoryBn: 'ব্যবসা ও অর্থনীতি',
    categorySlug: 'business',
    author: {
      name: 'John Doe',
      nameBn: 'জন ডো',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      role: 'Legal Tech Analyst'
    },
    date: 'Jul 31, 2026',
    dateBn: '৩১ জুলাই, ২০২৬',
    readTime: '4 min read',
    views: 24500,
    likes: 1870,
    imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&auto=format&fit=crop&q=80',
    tags: ['Google', 'Developers', 'Policy'],
    isTrending: true
  },
  {
    id: 'post-story-3',
    title: 'The Difference Between Artificial Intelligence and Machine Learning',
    titleBn: 'কৃত্রিম বুদ্ধিমত্তা এবং মেশিন লার্নিংয়ের মধ্যকার আসল পার্থক্য',
    excerpt: 'Demystifying the foundational concepts, training pipelines, and real-world architectures that power modern cognitive software.',
    excerptBn: 'এআই এবং এমএল-এর মৌলিক তফাৎ, অ্যালগরিদমের প্রশিক্ষণ প্রক্রিয়া এবং বাস্তবিক ক্ষেত্রে এর প্রয়োগের স্পষ্ট ব্যাখ্যা।',
    content: `While often used interchangeably, artificial intelligence represents the broad vision of smart machines, whereas machine learning is the statistical engine driving it.`,
    contentBn: `কৃত্রিম বুদ্ধিমত্তা এবং মেশিন লার্নিং শব্দ দুটি প্রায়শই একসাথে শোনা গেলেও প্রযুক্তিগতভাবে এদের মধ্যে রয়েছে সুস্পষ্ট কাঠামোগত পার্থক্য।`,
    category: 'Technology',
    categoryBn: 'প্রযুক্তি',
    categorySlug: 'tech',
    author: {
      name: 'John Doe',
      nameBn: 'জন ডো',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      role: 'AI Researcher'
    },
    date: 'Jul 31, 2026',
    dateBn: '৩১ জুলাই, ২০২৬',
    readTime: '5 min read',
    views: 37800,
    likes: 2980,
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&auto=format&fit=crop&q=80',
    tags: ['AI', 'MachineLearning', 'DataScience'],
    isFeatured: true
  },
  {
    id: 'post-phone-1',
    title: 'Samsung Galaxy S21 Colors: Every Shade Available',
    titleBn: 'স্যামসাং গ্যালাক্সি এস২১ কালারস: প্রতিটি রঙের অনন্য আকর্ষণ',
    excerpt: 'From Phantom Violet with contrasting gold camera housing to sleek Phantom Gray, explore the aesthetic lineup.',
    excerptBn: 'ফ্যান্টম ভায়োলেট থেকে শুরু করে ফ্যান্টম গ্রে—প্রতিটি কালার ভ্যারিয়েন্টের নান্দনিক ফিনিশিং ও আকর্ষণের পুঙ্খানুপুঙ্খ বিবরণ।',
    content: `Samsung revolutionized smartphone aesthetics with the Contour-Cut camera housing that seamlessly blends with the metal frame.`,
    contentBn: `স্যামসাংয়ের কনট্যুর-কাট ক্যামেরা হাউজিং এবং ফ্রস্টেড গ্লাস ফিনিশিং গ্যালাক্সি সিরিজের স্মার্টফোনগুলোকে দিয়েছে এক রাজকীয় রূপ।`,
    category: 'Samsung',
    categoryBn: 'স্যামসাং',
    categorySlug: 'tech',
    author: {
      name: 'John Doe',
      nameBn: 'জন ডো',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'Hardware Editor'
    },
    date: 'Jul 31, 2026',
    dateBn: '৩১ জুলাই, ২০২৬',
    readTime: '3 min read',
    views: 26300,
    likes: 1990,
    imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=1200&auto=format&fit=crop&q=80',
    tags: ['Samsung', 'Galaxy', 'Smartphone']
  },
  {
    id: 'post-phone-2',
    title: 'Apple iPhone 13 Pro Battery: Highly Efficient Device',
    titleBn: 'অ্যাপল আইফোন ১৩ প্রো ব্যাটারি: দীর্ঘস্থায়ী ও শক্তিশালী ডিভাইস',
    excerpt: 'ProMotion 120Hz adaptive refresh rates paired with larger battery cells deliver unprecedented two-day longevity.',
    excerptBn: '১২০ হার্টজ অ্যাডাপ্টিভ প্রমোশন ডিসপ্লে থাকা সত্ত্বেও ব্যাটারি ব্যাকআপে রেকর্ড গড়েছে নতুন আইফোন ১৩ প্রো।',
    content: `Battery life anxiety is a relic of the past with the optimized power envelopes delivered by custom silicon and intelligent refresh rate scaling.`,
    contentBn: `সারাদিন ভারী গেম খেলা বা ভিডিও রেকর্ডিংয়ের পরেও চার্জের চিন্তা নেই, অ্যাপলের নতুন ব্যাটারি ম্যানেজমেন্ট সত্যিই অবিশ্বাস্য।`,
    category: 'Smartphones',
    categoryBn: 'স্মার্টফোন',
    categorySlug: 'tech',
    author: {
      name: 'John Doe',
      nameBn: 'জন ডো',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      role: 'Tech Reviewer'
    },
    date: 'Jul 31, 2026',
    dateBn: '৩১ জুলাই, ২০২৬',
    readTime: '4 min read',
    views: 33400,
    likes: 2430,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&auto=format&fit=crop&q=80',
    tags: ['Apple', 'iPhone', 'Battery']
  },
  {
    id: 'post-phone-3',
    title: 'Catch the Best iPhone 13 Deals Plus Your Favorite gadgets',
    titleBn: 'সেরা আইফোন ১৩ অফার এবং পছন্দের গ্যাজেট কালেকশন',
    excerpt: 'Trade-in incentives, carrier bundles, and essential accessories including MagSafe chargers and rugged cases.',
    excerptBn: 'ম্যাগসেফ চার্জার, প্রিমিয়াম কভার এবং এক্সচেঞ্জ অফারের মাধ্যমে সাশ্রয়ী মূল্যে পছন্দের ডিভাইস কেনার চমৎকার সুযোগ।',
    content: `Maximizing your gadget investment means combining certified trade-in values with limited-time carrier promotions.`,
    contentBn: `নতুন ডিভাইস ক্রয়ের ক্ষেত্রে অতিরিক্ত ডিসকাউন্ট ও প্রয়োজনীয় গ্যাজেট একসঙ্গে পাওয়ার সেরা টিপস ও ট্রিকস।`,
    category: 'Products',
    categoryBn: 'পণ্য',
    categorySlug: 'tech',
    author: {
      name: 'John Doe',
      nameBn: 'জন ডো',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      role: 'Deals Specialist'
    },
    date: 'Jul 31, 2026',
    dateBn: '৩১ জুলাই, ২০২৬',
    readTime: '3 min read',
    views: 21900,
    likes: 1540,
    imageUrl: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=1200&auto=format&fit=crop&q=80',
    tags: ['Deals', 'Gadgets', 'Offers']
  },
  {
    id: 'post-phone-4',
    title: 'Samsung Galaxy S22 Ultra Offers the Ultimate and Most Premium Experience',
    titleBn: 'স্যামসাং গ্যালাক্সি এস২২ আল্ট্রা: প্রিমিয়াম স্মার্টফোনের চূড়া',
    excerpt: 'Integrated S-Pen stylus, 108MP 100x Space Zoom camera, and Dynamic AMOLED 2X display set the benchmark for power users.',
    excerptBn: 'বিল্ট-ইন এস-পেন, ১০৮ মেগাপিক্সেলের ১০০এক্স স্পেস জুম এবং ডায়নামিক ওলেড ডিসপ্লের প্রিমিয়াম অভিজ্ঞতা।',
    content: `The unification of the Galaxy Note DNA with the S-series flagship creates the undisputed champion of productivity smartphones.`,
    contentBn: `নোট সিরিজের সিগনেচার এস-পেন এবং ফ্ল্যাগশিপ ক্যামেরার সংমিশ্রণে গ্যালাক্সি এস২২ আল্ট্রা পেশাদারদের প্রথম পছন্দ।`,
    category: 'Samsung',
    categoryBn: 'স্যামসাং',
    categorySlug: 'tech',
    author: {
      name: 'John Doe',
      nameBn: 'জন ডো',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'Senior Hardware Critic'
    },
    date: 'Jul 31, 2026',
    dateBn: '৩১ জুলাই, ২০২৬',
    readTime: '5 min read',
    views: 39500,
    likes: 3100,
    imageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=1200&auto=format&fit=crop&q=80',
    tags: ['Samsung', 'Ultra', 'Flagship'],
    isFeatured: true
  },
  {
    id: 'post-gadget-1',
    title: 'Portable Bluetooth Speakers That can Go Literally Anywhere',
    titleBn: 'পোর্টেবল ব্লুটুথ স্পিকার যা যেকোনো স্থানে সাথে রাখা সম্ভব',
    excerpt: 'Military-grade drop protection, waterproof floating enclosures, and 24-hour acoustic punch for backcountry trailblazers.',
    excerptBn: 'পাহাড়ে ট্র্যাকিং কিংবা নদীতে সাঁতার কাটার সময়ও নিখুঁত সুর ও সাউন্ড ছড়িয়ে দিতে পারে এই টেকসই ব্লুটুথ স্পিকার।',
    content: `Engineered with high-tensile silicone bumpers and passive bass radiators, rugged speakers survive sand, surf, and snow.`,
    contentBn: `পানির নিচেও সুরক্ষিত ও ভেসে থাকার ক্ষমতাসম্পন্ন এই স্পিকারগুলো যেকোনো প্রতিকূল আবহাওয়াতেই দেবে দীর্ঘস্থায়ী অডিও সঙ্গ।`,
    category: 'Gadgets',
    categoryBn: 'গ্যাজেটস',
    categorySlug: 'tech',
    author: {
      name: 'John Doe',
      nameBn: 'জন ডো',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      role: 'Audio Analyst'
    },
    date: 'Jul 31, 2026',
    dateBn: '৩১ জুলাই, ২০২৬',
    readTime: '4 min read',
    views: 27800,
    likes: 2190,
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=1200&auto=format&fit=crop&q=80',
    tags: ['Speakers', 'Gadgets', 'Music'],
    isFeatured: true
  },
  {
    id: 'post-gadget-2',
    title: 'Top Rated Products in Wireless & Portable Bluetooth Speakers',
    titleBn: 'টপ রেটেড ওয়্যারলেস ও পোর্টেবল ব্লুটুথ স্পিকার্স',
    excerpt: 'Bose, JBL, and Marshall clash in an audiophile showdown covering spatial audio imaging and acoustic tuning.',
    excerptBn: 'বোস, জেবিএল ও মার্শালের মতো খ্যাতনামা ব্র্যান্ডের স্পিকারগুলোর সাউন্ড ব্যালেন্স ও স্থায়িত্বের বিস্তারিত পরীক্ষা।',
    content: `Soundstage depth and vocal clarity separate ordinary consumer speakers from masterfully balanced portable monitors.`,
    contentBn: `গান শোনার প্রতিটি খুঁটিনাটি ধ্বনি স্পষ্ট করে তোলার দক্ষতায় বাজারে এগিয়ে থাকা সেরা অডিও ডিভাইসগুলোর তালিকা।`,
    category: 'Gadgets',
    categoryBn: 'গ্যাজেটস',
    categorySlug: 'tech',
    author: {
      name: 'John Doe',
      nameBn: 'জন ডো',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      role: 'Tech Reviewer'
    },
    date: 'Jul 31, 2026',
    dateBn: '৩১ জুলাই, ২০২৬',
    readTime: '4 min read',
    views: 22400,
    likes: 1680,
    imageUrl: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=1200&auto=format&fit=crop&q=80',
    tags: ['Bose', 'Speakers', 'Audio']
  },
  {
    id: 'post-gadget-3',
    title: 'Should I Replace My Upright Vacuum with a Cleaning Robot?',
    titleBn: 'ঘরের পরিচ্ছন্নতায় রোবট ভ্যাকুয়াম ক্লিনার কি উপযুক্ত পছন্দ?',
    excerpt: 'LiDAR room mapping, automated dustbin evacuation, and mop scrubbing compared against traditional upright power.',
    excerptBn: 'লাইডার ম্যাপিং, স্বয়ংক্রিয় ডাস্টবিন খালি করার সুবিধা ও মোপিং ফিচারের রোবট ভ্যাকুয়ামের সুবিধা-অসুবিধা।',
    content: `Automating daily floor maintenance saves dozens of hours every month, but carpet deep-pile cleaning still demands consideration.`,
    contentBn: `আপনার দৈনন্দিন ঘরের ধুলাবালি পরিষ্কারের ঝামেলা কমাতে স্মার্ট রোবট ক্লিনার কীভাবে সময় বাঁচায় তার বাস্তব অভিজ্ঞতা।`,
    category: 'Gadgets',
    categoryBn: 'গ্যাজেটস',
    categorySlug: 'tech',
    author: {
      name: 'John Doe',
      nameBn: 'জন ডো',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'Smart Home Specialist'
    },
    date: 'Jul 31, 2026',
    dateBn: '৩১ জুলাই, ২০২৬',
    readTime: '4 min read',
    views: 19800,
    likes: 1420,
    imageUrl: 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=1200&auto=format&fit=crop&q=80',
    tags: ['SmartHome', 'RobotVacuum', 'Gadgets']
  },
  {
    id: 'post-gadget-4',
    title: 'Ways to Play Music Using Your Amazon Echo Device',
    titleBn: 'অ্যামাজন ইকো ও স্মার্ট স্পিকারে গান শোনার সেরা কয়েকটি উপায়',
    excerpt: 'Multi-room audio grouping, lossless streaming integrations, and voice-command playlists for seamless auditory bliss.',
    excerptBn: 'মাল্টি-রুম অডিও সিঙ্ক, স্পটিফাই ও অ্যামাজন মিউজিকের ভয়েস কমান্ড দিয়ে গান উপভোগের সহজ উপায়।',
    content: `Alexa makes hands-free music curation intuitive across every room of your living space with customized routines and spatial groupings.`,
    contentBn: `ভয়েস কমান্ড দিয়ে পুরো বাড়ির প্রতিটি ঘরের স্পিকারে একই গান বাজানো কিংবা পছন্দের প্লেলিস্ট শোনার নানা টিপস।`,
    category: 'Gadgets',
    categoryBn: 'গ্যাজেটস',
    categorySlug: 'tech',
    author: {
      name: 'John Doe',
      nameBn: 'জন ডো',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      role: 'Audio Editor'
    },
    date: 'Jul 31, 2026',
    dateBn: '৩১ জুলাই, ২০২৬',
    readTime: '3 min read',
    views: 17600,
    likes: 1290,
    imageUrl: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=1200&auto=format&fit=crop&q=80',
    tags: ['AmazonEcho', 'Alexa', 'Music']
  }
];

export const BREAKING_NEWS = [
  {
    id: 'b1',
    text: 'Quantum Computing breakthrough achieved with room-temperature topological polaritons in consumer hardware.',
    textBn: 'কক্ষ তাপমাত্রায় কোয়ান্টাম প্রসেসরে বৈপ্লবিক সাফল্য, আধুনিক কম্পিউটিংয়ে নতুন দিগন্ত উন্মোচিত।'
  },
  {
    id: 'b2',
    text: 'Renewable Power Grids reach historic 60% clean energy milestone across developing economies.',
    textBn: 'উন্নয়নশীল দেশগুলোতে নবায়নযোগ্য জ্বালানি উৎপাদন রেকর্ড ৬০ শতাংশে উন্নীত।'
  },
  {
    id: 'b3',
    text: 'Global High Seas Conservation Treaty officially ratified by over 80 nations today.',
    textBn: 'আন্তর্জাতিক সমুদ্র চুক্তি আনুষ্ঠানিকভাবে ৮০টিরও বেশি দেশে কার্যকর।'
  },
  {
    id: 'b4',
    text: 'Autonomous electric regional aircraft completes record 220km commercial route on time.',
    textBn: 'চালকমুক্ত পরিবেশবান্ধব যাত্রীবাহী বিমানের প্রথম বাণিজ্যিক সফল উড্ডয়ন সম্পন্ন।'
  }
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'c1',
    postId: 'post-1',
    author: 'Mohammad Farhan',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    text: 'The quantum coherence achievement at room temperature is genuinely a game-changer for cloud machine learning clusters! Fantastic write-up.',
    date: '2 hours ago',
    likes: 18
  },
  {
    id: 'c2',
    postId: 'post-1',
    author: 'Nusrat Jahan',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    text: 'অসাধারণ তথ্যবহুল প্রতিবেদন! বিশেষ করে বিদ্যুৎ সাশ্রয়ের বিষয়টি বর্তমান বৈশ্বিক জ্বালানি সংকটের সময়ে অত্যন্ত সময়োপযোগী।',
    date: '4 hours ago',
    likes: 12
  },
  {
    id: 'c3',
    postId: 'post-2',
    author: 'Kazi Shakil',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
    text: 'Distributed solar storage microgrids have transformed countless rural businesses in our region. Wonderful to see this covered.',
    date: '5 hours ago',
    likes: 9
  }
];
