import { Post } from '../types';

/**
 * Generate a clean, SEO-friendly URL slug from a title string
 */
export function slugify(text: string): string {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD') // separate accents from letters
    .replace(/[\u0300-\u036f]/g, '') // remove accent marks
    .replace(/[^a-z0-9\s-_]/g, '') // remove invalid characters
    .replace(/[\s_]+/g, '-') // collapse whitespace and underscores to hyphens
    .replace(/-+/g, '-') // collapse multiple hyphens
    .replace(/^-+|-+$/g, ''); // trim leading and trailing hyphens
}

/**
 * Strip HTML tags to get raw plain text
 */
export function stripHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
}

export interface SeoIssue {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  description: string;
  actionLabel?: string;
  actionKey?: string;
}

export interface SeoAnalysisResult {
  score: number; // 0 to 100
  status: 'good' | 'warning' | 'needs_work';
  issues: SeoIssue[];
  metrics: {
    titleLength: number;
    titleOptimal: boolean;
    descriptionLength: number;
    descriptionOptimal: boolean;
    wordCount: number;
    hasAltText: boolean;
    hasInternalLinks: boolean;
    focusKeywordInTitle: boolean;
    focusKeywordInDescription: boolean;
    focusKeywordInContent: boolean;
    headingsCount: { h1: number; h2: number; h3: number };
  };
}

/**
 * Comprehensive SEO Health Check for articles
 */
export function analyzeArticleSeo(article: Partial<Post>): SeoAnalysisResult {
  const issues: SeoIssue[] = [];
  const title = article.seoTitle?.trim() || article.title?.trim() || '';
  const description = article.seoDescription?.trim() || article.excerpt?.trim() || '';
  const content = article.content || '';
  const plainContent = stripHtml(content);
  const focusKeyword = article.focusKeyword?.trim().toLowerCase() || '';

  // Word count & Content analysis
  const words = plainContent ? plainContent.split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;

  // Title check
  const titleLength = title.length;
  const titleOptimal = titleLength >= 40 && titleLength <= 65;
  if (titleLength === 0) {
    issues.push({
      id: 'title_missing',
      type: 'error',
      title: 'Missing SEO Title',
      description: 'The article lacks an SEO title. Search engines display 50-60 characters in search results.',
      actionLabel: 'Use Article Headline',
      actionKey: 'autofill_title'
    });
  } else if (titleLength < 40) {
    issues.push({
      id: 'title_short',
      type: 'warning',
      title: 'SEO Title is short',
      description: `Current title is ${titleLength} characters. Recommended range is 40–65 characters to maximize search visibility.`
    });
  } else if (titleLength > 65) {
    issues.push({
      id: 'title_long',
      type: 'warning',
      title: 'SEO Title may be truncated',
      description: `Current title is ${titleLength} characters. Google search snippets typically cut off titles after ~60 characters.`
    });
  } else {
    issues.push({
      id: 'title_optimal',
      type: 'success',
      title: 'SEO Title length is optimal',
      description: `At ${titleLength} characters, the title will display fully in search engine result pages.`
    });
  }

  // Meta description check
  const descriptionLength = description.length;
  const descriptionOptimal = descriptionLength >= 120 && descriptionLength <= 165;
  if (descriptionLength === 0) {
    issues.push({
      id: 'desc_missing',
      type: 'error',
      title: 'Missing Meta Description',
      description: 'Search engines display meta descriptions under your headline. Without one, search engines will generate an arbitrary snippet.',
      actionLabel: 'Use Excerpt as Meta Description',
      actionKey: 'autofill_desc'
    });
  } else if (descriptionLength < 120) {
    issues.push({
      id: 'desc_short',
      type: 'warning',
      title: 'Meta description is short',
      description: `Current description is ${descriptionLength} characters. We recommend 130–160 characters to entice search clicks.`
    });
  } else if (descriptionLength > 165) {
    issues.push({
      id: 'desc_long',
      type: 'warning',
      title: 'Meta description may be truncated',
      description: `Current description is ${descriptionLength} characters. Search engines typically truncate descriptions beyond 160 characters.`
    });
  } else {
    issues.push({
      id: 'desc_optimal',
      type: 'success',
      title: 'Meta description length is ideal',
      description: `At ${descriptionLength} characters, this snippet communicates key takeaways without truncation.`
    });
  }

  // Slug check
  const slug = article.slug?.trim() || '';
  if (!slug) {
    issues.push({
      id: 'slug_missing',
      type: 'warning',
      title: 'URL Slug not explicitly defined',
      description: 'A clean, keyword-friendly slug like /article/global-economy-trends improves organic CTR.',
      actionLabel: 'Auto-generate Slug',
      actionKey: 'autofill_slug'
    });
  } else if (/[^a-z0-9-]/.test(slug)) {
    issues.push({
      id: 'slug_invalid',
      type: 'warning',
      title: 'URL Slug contains non-standard characters',
      description: 'URL slugs should only contain lowercase alphanumeric characters and single hyphens.',
      actionLabel: 'Clean Slug',
      actionKey: 'clean_slug'
    });
  }

  // Focus keyword checks
  let focusKeywordInTitle = false;
  let focusKeywordInDescription = false;
  let focusKeywordInContent = false;

  if (focusKeyword) {
    focusKeywordInTitle = title.toLowerCase().includes(focusKeyword);
    focusKeywordInDescription = description.toLowerCase().includes(focusKeyword);
    focusKeywordInContent = plainContent.toLowerCase().includes(focusKeyword);

    if (!focusKeywordInTitle) {
      issues.push({
        id: 'fk_not_in_title',
        type: 'warning',
        title: 'Focus Keyword missing from Title',
        description: `Your focus keyword "${focusKeyword}" does not appear in the SEO title.`
      });
    } else {
      issues.push({
        id: 'fk_in_title',
        type: 'success',
        title: 'Focus Keyword present in Title',
        description: `Found "${focusKeyword}" within the article title.`
      });
    }

    if (!focusKeywordInDescription) {
      issues.push({
        id: 'fk_not_in_desc',
        type: 'info',
        title: 'Focus Keyword missing from Meta Description',
        description: `Including "${focusKeyword}" in the description helps user relevancy when searchers see the snippet.`
      });
    }

    if (!focusKeywordInContent) {
      issues.push({
        id: 'fk_not_in_content',
        type: 'warning',
        title: 'Focus Keyword not detected in article body',
        description: `Search engines cross-reference keywords with body text. Make sure "${focusKeyword}" appears naturally in the content.`
      });
    }
  } else {
    issues.push({
      id: 'fk_missing',
      type: 'info',
      title: 'No Focus Keyword specified',
      description: 'Setting a primary search topic helps verify title, snippet, and content alignment.'
    });
  }

  // Headings analysis
  const h1Matches = (content.match(/<h1[\s>]/gi) || []).length;
  const h2Matches = (content.match(/<h2[\s>]/gi) || []).length;
  const h3Matches = (content.match(/<h3[\s>]/gi) || []).length;

  if (h1Matches > 0) {
    issues.push({
      id: 'h1_duplicate',
      type: 'warning',
      title: 'H1 heading found inside article body',
      description: 'The page title is already rendered as the primary H1. Using H2 and H3 for subheadings preserves clear document hierarchy.'
    });
  }

  if (wordCount > 400 && h2Matches === 0 && h3Matches === 0) {
    issues.push({
      id: 'headings_missing',
      type: 'info',
      title: 'No section subheadings (H2 / H3)',
      description: 'Breaking long articles with descriptive H2/H3 subheadings improves both reader engagement and search crawlability.'
    });
  }

  // Image & ALT text check
  const hasImage = Boolean(article.imageUrl && article.imageUrl.trim());
  const hasAltText = Boolean(article.altText && article.altText.trim().length > 3);

  if (!hasImage) {
    issues.push({
      id: 'image_missing',
      type: 'warning',
      title: 'No Featured Cover Image',
      description: 'Articles with high-quality featured images earn higher CTR in Google Discover and social feeds.'
    });
  } else if (!hasAltText) {
    issues.push({
      id: 'alt_missing',
      type: 'warning',
      title: 'Missing Image ALT Text',
      description: 'Alternative text is required for accessibility (screen readers) and Google Image indexing.',
      actionLabel: 'Set Alt Text to Headline',
      actionKey: 'autofill_alt'
    });
  } else {
    issues.push({
      id: 'alt_optimal',
      type: 'success',
      title: 'Image ALT text configured',
      description: 'Descriptive alternative text enables visual accessibility and image search indexing.'
    });
  }

  // Internal Links check
  const linkMatches = content.match(/href=["'](https?:\/\/thegeopacts\.com|\/article\/|\/category\/|#)[^"']*["']/gi) || [];
  const hasInternalLinks = linkMatches.length > 0;
  if (!hasInternalLinks && wordCount > 200) {
    issues.push({
      id: 'internal_links_missing',
      type: 'info',
      title: 'No internal links detected',
      description: 'Linking to related stories or background reports boosts page authority, reader session time, and crawl depth.',
      actionLabel: 'Search Related Stories',
      actionKey: 'open_internal_linking'
    });
  } else if (hasInternalLinks) {
    issues.push({
      id: 'internal_links_good',
      type: 'success',
      title: 'Internal links detected',
      description: `Found ${linkMatches.length} internal reference(s) within the article text.`
    });
  }

  // Canonical URL
  if (!article.canonicalUrl) {
    issues.push({
      id: 'canonical_missing',
      type: 'info',
      title: 'Canonical URL will use default domain structure',
      description: 'Canonical URL will point to the primary permalink to avoid duplicate content penalties.',
      actionLabel: 'Explicitly Set Canonical',
      actionKey: 'autofill_canonical'
    });
  }

  // Content Length
  if (wordCount < 150) {
    issues.push({
      id: 'content_short',
      type: 'warning',
      title: 'Brief article body',
      description: `Current length is ~${wordCount} words. In-depth analysis and reporting generally exceeds 300 words.`
    });
  } else {
    issues.push({
      id: 'content_length_good',
      type: 'success',
      title: 'Solid article depth',
      description: `Article contains ~${wordCount} words, providing substantive context.`
    });
  }

  // Calculate composite score
  const errorCount = issues.filter(i => i.type === 'error').length;
  const warningCount = issues.filter(i => i.type === 'warning').length;
  const successCount = issues.filter(i => i.type === 'success').length;

  let score = Math.max(20, Math.min(100, 100 - (errorCount * 25) - (warningCount * 10) + (successCount * 4)));
  if (errorCount > 0 && score > 70) score = 70;

  const status: 'good' | 'warning' | 'needs_work' =
    score >= 80 ? 'good' : score >= 55 ? 'warning' : 'needs_work';

  return {
    score,
    status,
    issues,
    metrics: {
      titleLength,
      titleOptimal,
      descriptionLength,
      descriptionOptimal,
      wordCount,
      hasAltText,
      hasInternalLinks,
      focusKeywordInTitle,
      focusKeywordInDescription,
      focusKeywordInContent,
      headingsCount: {
        h1: h1Matches,
        h2: h2Matches,
        h3: h3Matches
      }
    }
  };
}

/**
 * Resolves full SEO metadata with safe automatic fallbacks
 */
export function resolveSeoMetadata(article: Partial<Post>, customDomain?: string) {
  const domain = (customDomain?.replace(/\/$/, '') || 'https://thegeopacts.com');
  const slug = article.slug?.trim() || slugify(article.title || '') || article.id || 'story';
  const canonicalUrl = article.canonicalUrl?.trim() || `${domain}/article/${slug}`;

  const seoTitle = article.seoTitle?.trim() || article.title?.trim() || 'The GeoPacts - Global Affairs';
  const fullTitle = seoTitle.includes('The GeoPacts') ? seoTitle : `${seoTitle} | The GeoPacts`;

  const seoDescription =
    article.seoDescription?.trim() ||
    article.excerpt?.trim() ||
    'The GeoPacts is a modern global news and information platform covering world affairs, geopolitics, business, and emergent technology.';

  const ogTitle = article.ogTitle?.trim() || seoTitle;
  const ogDescription = article.ogDescription?.trim() || seoDescription;
  const ogImage = article.ogImage?.trim() || article.imageUrl?.trim() || `${domain}/og-default.jpg`;
  const altText = article.altText?.trim() || article.title?.trim() || 'The GeoPacts Featured Article';

  const robotsIndex = article.robotsIndex !== false;
  const robotsFollow = article.robotsFollow !== false;
  const robotsDirective = `${robotsIndex ? 'index' : 'noindex'}, ${robotsFollow ? 'follow' : 'nofollow'}`;

  return {
    domain,
    slug,
    canonicalUrl,
    seoTitle,
    fullTitle,
    seoDescription,
    ogTitle,
    ogDescription,
    ogImage,
    altText,
    robotsIndex,
    robotsFollow,
    robotsDirective,
    robots: robotsDirective
  };
}

/**
 * Generates valid Schema.org NewsArticle structured data
 */
export function generateNewsArticleSchema(article: Post, customDomain?: string) {
  const seo = resolveSeoMetadata(article, customDomain);
  const publishedDate = article.publishedAt || article.createdAt || new Date().toISOString();
  const modifiedDate = article.updatedAt || publishedDate;

  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    '@id': `${seo.canonicalUrl}#article`,
    'isPartOf': {
      '@type': 'WebPage',
      '@id': seo.canonicalUrl
    },
    'headline': seo.seoTitle,
    'description': seo.seoDescription,
    'image': [seo.ogImage],
    'datePublished': publishedDate,
    'dateModified': modifiedDate,
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': seo.canonicalUrl
    },
    'author': {
      '@type': 'Person',
      'name': article.author?.name || 'The GeoPacts Editorial Staff',
      'jobTitle': article.author?.role || 'Contributing Journalist',
      'image': article.author?.avatar
    },
    'publisher': {
      '@type': 'Organization',
      '@id': 'https://thegeopacts.com/#organization',
      'name': 'The GeoPacts',
      'url': 'https://thegeopacts.com',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80',
        'caption': 'The GeoPacts Logo'
      },
      'publishingPrinciples': 'https://thegeopacts.com/editorial-policy'
    },
    'articleSection': article.category || 'World Affairs',
    'keywords': (article.tags || []).join(', ')
  };
}

/**
 * Generates Schema.org BreadcrumbList structured data
 */
export function generateBreadcrumbsSchema(article: Post, customDomain?: string) {
  const seo = resolveSeoMetadata(article, customDomain);
  const domain = (customDomain?.replace(/\/$/, '') || 'https://thegeopacts.com');

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': domain
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': article.category || 'News',
        'item': `${domain}/category/${article.categorySlug || 'news'}`
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': article.title,
        'item': seo.canonicalUrl
      }
    ]
  };
}
