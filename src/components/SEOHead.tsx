import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
}

export default function SEOHead({
  title,
  description,
  canonicalUrl,
  ogType = 'website',
  publishedTime,
  modifiedTime,
  noindex = false,
}: SEOHeadProps) {
  useEffect(() => {
    // Set page title
    document.title = title.includes('ঘুষখুর') ? title : `${title} | ঘুষখুর`;

    // Helper to update or create meta tag
    const setMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let tag = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attr, name);
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    // Update standard meta tags
    setMeta('description', description);
    setMeta('keywords', 'ঘুষ, ঘুষখুর, ghush, ghushkhur, corruption in bangladesh, bribery bangladesh, সরকারি অফিসে ঘুষ, ভূমি অফিস ঘুষ, নামজারি ঘুষ, সাব রেজিস্ট্রি অফিস ঘুষ, NID corruption, citizen experience, নাগরিক অভিযোগ, দুর্নীতি দমন');
    setMeta('robots', noindex ? 'noindex, nofollow' : 'index, follow');

    // Open Graph
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:type', ogType, true);

    const fullCanonical = canonicalUrl
      ? (canonicalUrl.startsWith('http') ? canonicalUrl : `${window.location.origin}${canonicalUrl}`)
      : window.location.href.split('?')[0];

    setMeta('og:url', fullCanonical, true);

    if (publishedTime) {
      setMeta('article:published_time', publishedTime, true);
    }
    if (modifiedTime) {
      setMeta('article:modified_time', modifiedTime, true);
    }

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);

    // Canonical link
    let canonicalTag = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.href = fullCanonical;

    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [title, description, canonicalUrl, ogType, publishedTime, modifiedTime, noindex]);

  return null;
}
