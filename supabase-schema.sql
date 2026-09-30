-- ==============================================================================
-- THE GEOPACTS - SUPABASE POSTGRESQL PRODUCTION DATABASE SCHEMA & RLS POLICIES
-- ==============================================================================
-- Designed for Free-Tier Performance & High Traffic Resilience:
-- 1. Optimized B-Tree Indexes on all hot filter paths (status, published_at, category_slug, slug)
-- 2. Row Level Security (RLS) enabled on all tables
-- 3. Anonymous public users can ONLY SELECT published articles, categories, and tags
-- 4. Draft articles, audit logs, and administrative controls are protected
-- 5. ZERO pageview recording in PostgreSQL (protects free-tier database limits)
-- 6. Supabase Storage bucket 'news-images' configuration
-- ==============================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    name_bn TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    color TEXT DEFAULT 'bg-slate-700',
    description TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ARTICLES TABLE
CREATE TABLE IF NOT EXISTS public.articles (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE,
    title TEXT NOT NULL,
    title_bn TEXT NOT NULL,
    excerpt TEXT DEFAULT '',
    excerpt_bn TEXT DEFAULT '',
    content TEXT DEFAULT '',
    content_bn TEXT DEFAULT '',
    category TEXT NOT NULL,
    category_bn TEXT NOT NULL,
    category_slug TEXT NOT NULL REFERENCES public.categories(slug) ON UPDATE CASCADE,
    author JSONB NOT NULL DEFAULT '{"name":"Editorial Staff","avatar":"","role":"Staff Writer"}',
    date TEXT DEFAULT 'Recent',
    date_bn TEXT DEFAULT 'সাম্প্রতিক',
    read_time TEXT DEFAULT '3 min read',
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    image_url TEXT NOT NULL,
    tags JSONB DEFAULT '[]'::jsonb,
    is_breaking BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_trending BOOLEAN DEFAULT FALSE,
    is_editors_pick BOOLEAN DEFAULT FALSE,
    video_url TEXT,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'review', 'scheduled', 'published', 'archived')),
    version INTEGER DEFAULT 1,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    scheduled_at TIMESTAMPTZ,
    seo_title TEXT,
    seo_description TEXT,
    canonical_url TEXT,
    alt_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TAGS TABLE
CREATE TABLE IF NOT EXISTS public.tags (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. MEDIA LIBRARY TABLE (Stores metadata only - binary files live in Supabase Storage!)
CREATE TABLE IF NOT EXISTS public.media (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    storage_path TEXT,
    filename TEXT NOT NULL,
    alt_text TEXT DEFAULT '',
    caption TEXT DEFAULT '',
    credit TEXT DEFAULT 'The GeoPacts',
    mime_type TEXT DEFAULT 'image/webp',
    size_bytes BIGINT DEFAULT 0,
    used_in_article_ids JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ADVERTISEMENT CONFIGURATION TABLE
CREATE TABLE IF NOT EXISTS public.ad_settings (
    id TEXT PRIMARY KEY DEFAULT 'primary',
    config JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'primary',
    brand_name TEXT DEFAULT 'The GeoPacts',
    tagline TEXT DEFAULT 'Modern Global News & Geopolitics Journal',
    canonical_domain TEXT DEFAULT 'https://thegeopacts.com',
    publisher_org_id TEXT DEFAULT 'https://thegeopacts.com/#organization',
    contact_email TEXT DEFAULT 'editorial@thegeopacts.com',
    config JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. NEWSROOM USERS & RBAC TABLE
CREATE TABLE IF NOT EXISTS public.newsroom_users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin')),
    title TEXT DEFAULT 'Newsroom Editor',
    avatar TEXT DEFAULT '',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ
);

-- 9. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id TEXT PRIMARY KEY,
    actor_user_id TEXT NOT NULL,
    actor_role TEXT NOT NULL,
    actor_name TEXT NOT NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT NOT NULL,
    before_state JSONB,
    after_state JSONB,
    ip_address TEXT DEFAULT '',
    user_agent TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- HIGH-PERFORMANCE DATABASE INDEXES
-- Keeps lookup times sub-millisecond even with tens of thousands of articles
-- ==============================================================================

-- 1. Index on status and published_at (Primary index for public homepage and news feeds)
CREATE INDEX IF NOT EXISTS idx_articles_status_pub ON public.articles (status, published_at DESC);

-- 2. Index for category filtered queries
CREATE INDEX IF NOT EXISTS idx_articles_category_status ON public.articles (category_slug, status, published_at DESC);

-- 3. Partial indexes for featured and trending stories (very fast, tiny index footprint)
CREATE INDEX IF NOT EXISTS idx_articles_featured ON public.articles (is_featured, status, published_at DESC) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_articles_trending ON public.articles (is_trending, status, published_at DESC) WHERE is_trending = TRUE;
CREATE INDEX IF NOT EXISTS idx_articles_editors_pick ON public.articles (is_editors_pick, status, published_at DESC) WHERE is_editors_pick = TRUE;

-- 4. Fast lookup by slug (for SEO-friendly URLs) and ID
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles (slug);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories (slug);

-- 5. Media index
CREATE INDEX IF NOT EXISTS idx_media_created ON public.media (created_at DESC);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsroom_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Articles RLS Policies:
-- Public can ONLY read published articles
CREATE POLICY "Public can view published articles" 
ON public.articles FOR SELECT 
USING (status = 'published');

-- Authenticated admins have full CRUD access
CREATE POLICY "Authenticated users can manage articles" 
ON public.articles FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);

-- 2. Categories RLS Policies:
CREATE POLICY "Public can view categories" 
ON public.categories FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage categories" 
ON public.categories FOR ALL 
TO authenticated 
USING (true);

-- 3. Tags RLS Policies:
CREATE POLICY "Public can view tags" 
ON public.tags FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage tags" 
ON public.tags FOR ALL 
TO authenticated 
USING (true);

-- 4. Ad Settings & Site Settings:
CREATE POLICY "Public can view active ad settings" 
ON public.ad_settings FOR SELECT 
USING (true);

CREATE POLICY "Public can view site settings" 
ON public.site_settings FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can update ad settings" 
ON public.ad_settings FOR ALL 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can update site settings" 
ON public.site_settings FOR ALL 
TO authenticated 
USING (true);

-- 5. Media, Users & Audit Logs: Protected, accessible only to authenticated users
CREATE POLICY "Authenticated users can view and manage media" 
ON public.media FOR ALL 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can view newsroom users" 
ON public.newsroom_users FOR ALL 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can view audit logs" 
ON public.audit_logs FOR ALL 
TO authenticated 
USING (true);

-- ==============================================================================
-- SUPABASE STORAGE BUCKET CONFIGURATION ('news-images')
-- Run in Supabase SQL editor to configure storage
-- ==============================================================================
-- 1. Create public bucket for optimized news images
INSERT INTO storage.buckets (id, name, public)
VALUES ('news-images', 'news-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Allow public to read images
CREATE POLICY "Public images are viewable by everyone"
ON storage.objects FOR SELECT
USING (bucket_id = 'news-images');

-- 3. Allow authenticated admins to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'news-images');

-- 4. Allow authenticated admins to update/delete images
CREATE POLICY "Authenticated users can update images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'news-images');

CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'news-images');

-- ==============================================================================
-- OPTIONAL SEO & METADATA EXTENSIONS (Safe idempotent migration)
-- ==============================================================================
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS focus_keyword TEXT;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS secondary_keywords JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS robots_index BOOLEAN DEFAULT TRUE;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS robots_follow BOOLEAN DEFAULT TRUE;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS og_title TEXT;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS og_description TEXT;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS og_image TEXT;
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);

