export type ArticleStatus = 'draft' | 'review' | 'scheduled' | 'published' | 'archived';

export interface Post {
  id: string;
  title: string;
  titleBn: string;
  excerpt: string;
  excerptBn: string;
  content: string;
  contentBn: string;
  category: string;
  categoryBn: string;
  categorySlug: string;
  author: {
    name: string;
    nameBn: string;
    avatar: string;
    role: string;
  };
  date: string;
  dateBn: string;
  readTime: string;
  views: number;
  likes: number;
  imageUrl: string;
  tags: string[];
  isBreaking?: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  isEditorsPick?: boolean;
  videoUrl?: string;
  // Newsroom CMS & Workflow Fields
  status?: ArticleStatus;
  version?: number;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  scheduledAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  altText?: string;
  caption?: string;
  credit?: string;
  imageStoragePath?: string;
  slug?: string;
  focusKeyword?: string;
  secondaryKeywords?: string[];
  robotsIndex?: boolean;
  robotsFollow?: boolean;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

export type UserRole = 'super_admin' | 'admin';

export type PermissionKey =
  // Articles
  | 'articles.create'
  | 'articles.read'
  | 'articles.update'
  | 'articles.delete'
  | 'articles.publish'
  | 'articles.unpublish'
  | 'articles.schedule'
  | 'articles.reschedule'
  | 'articles.archive'
  | 'articles.restore'
  | 'articles.permanent_delete'
  | 'articles.manage_all'
  // Revisions
  | 'revisions.read'
  | 'revisions.create'
  | 'revisions.restore'
  | 'revisions.manage_all'
  // Media
  | 'media.create'
  | 'media.read'
  | 'media.update'
  | 'media.delete'
  | 'media.manage_all'
  // Categories & Tags (Taxonomy)
  | 'categories.create'
  | 'categories.read'
  | 'categories.update'
  | 'categories.delete'
  | 'categories.manage_all'
  | 'tags.create'
  | 'tags.read'
  | 'tags.update'
  | 'tags.delete'
  | 'tags.manage_all'
  // Authors & Comments
  | 'authors.create'
  | 'authors.read'
  | 'authors.update'
  | 'authors.delete'
  | 'authors.manage_all'
  | 'comments.read'
  | 'comments.moderate'
  | 'comments.delete'
  | 'comments.restore'
  | 'comments.manage_all'
  // Users & Roles
  | 'users.create'
  | 'users.read'
  | 'users.update'
  | 'users.disable'
  | 'users.delete'
  | 'users.manage_all'
  | 'roles.read'
  | 'roles.assign'
  | 'roles.update'
  | 'roles.manage'
  // Settings & SEO
  | 'settings.read'
  | 'settings.update'
  | 'seo.read'
  | 'seo.update'
  | 'feeds.read'
  | 'feeds.manage'
  // Ads & Sponsors
  | 'ads.create'
  | 'ads.read'
  | 'ads.update'
  | 'ads.delete'
  | 'ads.manage'
  | 'sponsors.create'
  | 'sponsors.read'
  | 'sponsors.update'
  | 'sponsors.delete'
  | 'sponsors.manage'
  // Editorial & Audit & Security
  | 'editorial.read'
  | 'editorial.update'
  | 'corrections.create'
  | 'corrections.read'
  | 'corrections.update'
  | 'corrections.delete'
  | 'audit_logs.read'
  | 'audit_logs.export'
  | 'security.read'
  | 'security.manage'
  | 'system.read'
  | 'system.manage';

export interface AppUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar: string;
  active: boolean;
  title: string;
  createdAt: string;
  lastLogin?: string;
}

export interface AuditLog {
  id: string;
  actor_user_id: string;
  actor_role: UserRole;
  actor_name: string;
  action: string;
  resource_type: string;
  resource_id: string;
  before_state?: any;
  after_state?: any;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

export interface MediaItem {
  id: string;
  url: string;
  storagePath?: string;
  filename: string;
  altText: string;
  caption: string;
  credit: string;
  mimeType: string;
  sizeBytes: number;
  usedInArticleIds: string[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  nameBn: string;
  slug: string;
  color: string;
  description: string;
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  avatar: string;
  text: string;
  date: string;
  likes: number;
}

export type ViewMode = 'grid' | 'list' | 'compact';
export type FilterTab = 'all' | 'trending' | 'popular' | 'editors_pick';
export type Language = 'en' | 'bn';
export type Theme = 'light' | 'dark';

export type AdSlotType = 
  | 'header_728x90'
  | 'top_leaderboard'
  | 'in_feed'
  | 'sidebar_300x250'
  | 'sidebar_300x600'
  | 'article_top'
  | 'article_middle'
  | 'article_bottom'
  | 'sticky_anchor';

export interface AdSlotConfig {
  id: AdSlotType;
  enabled: boolean;
  name: string;
  nameBn: string;
  size: string;
  customCode?: string;
  bannerImageUrl?: string;
  targetUrl?: string;
  altText?: string;
}

export interface AdsterraSettings {
  popunderCode?: string;
  socialBarCode?: string;
  directLinkUrl?: string;
  nativeBannerCode?: string;
}

export interface AdSettings {
  adSensePublisherId: string;
  demoMode: boolean;
  highlightAdSlots: boolean;
  adsterra?: AdsterraSettings;
  slots: Record<AdSlotType, AdSlotConfig>;
}
