import { CONTACT_TO_EMAIL, METADATA, SITE_URL, SOCIAL_LINKS } from '@/lib/constants';

export function OrganizationJsonLd() {
  const json = {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    name: METADATA.title,
    url: SITE_URL,
    logo: METADATA.image,
    description: METADATA.description,
    sameAs: SOCIAL_LINKS.map((link) => link.href),
    contactPoint: {
      '@type': 'ContactPoint',
      email: CONTACT_TO_EMAIL,
      contactType: 'customer support',
      availableLanguage: 'English',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

interface NewsArticleJsonLdProps {
  title: string;
  description?: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
}

export function NewsArticleJsonLd({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  authorName,
}: NewsArticleJsonLdProps) {
  const json = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: title,
    description: description || METADATA.description,
    url,
    mainEntityOfPage: url,
    image: image ? [image] : [METADATA.image],
    datePublished: datePublished || undefined,
    dateModified: dateModified || datePublished || undefined,
    author: authorName
      ? { '@type': 'Person', name: authorName }
      : { '@type': 'Organization', name: METADATA.title },
    publisher: {
      '@type': 'Organization',
      name: METADATA.title,
      logo: {
        '@type': 'ImageObject',
        url: METADATA.image,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
