// Full-text RSS 2.0 feed of the latest 50 articles, advertised from the homepage <head>.
// Flipboard rejects excerpt-only feeds, and Instagram (via schedulers) accepts only JPEG, hence content:encoded and fm=jpg.
import type { SanityDocument } from 'next-sanity';
import { toHTML, escapeHTML, type PortableTextComponents } from '@portabletext/to-html';
import { client } from '@sanity/lib/client';
import { RSS_POSTS_QUERY } from '@sanity/lib/queries';
import { METADATA, SITE_URL, YOUTUBE_ID_REGEX, YOUTUBE_REGEX } from '@/lib/constants';
import { blockText, cleanPostBody, getPostExcerpt, imageFromSource, usableImageUrl } from '@/lib/utils';

export const revalidate = 600;

// XML 1.0 forbids most control characters, even inside CDATA; one stray byte from the WordPress import would break the whole feed.
const stripControlChars = (value: string) => value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');

// Feed readers strip iframes, so videos become plain links.
function youTubeLink(url: string): string {
  const id = url.match(YOUTUBE_ID_REGEX)?.[1];
  if (!id) return '';
  const href = `https://www.youtube.com/watch?v=${id}`;
  return `<p><a href="${href}">${href}</a></p>`;
}

const figure = (src: string, alt = '', caption = '') =>
  `<figure><img src="${escapeHTML(src)}" alt="${escapeHTML(alt)}" />${
    caption ? `<figcaption>${escapeHTML(caption)}</figcaption>` : ''
  }</figure>`;

const bodyComponents: Partial<PortableTextComponents> = {
  block: {
    normal: ({ children, value }) => {
      const text = blockText(value) ?? '';
      return (YOUTUBE_REGEX.test(text) && youTubeLink(text)) || `<p>${children}</p>`;
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) return '';
      // fit('max') stops Sanity upscaling small inline images into blur.
      const src = imageFromSource(value).width(1200).fit('max').format('jpg').quality(85).url();
      const credit = value.credit && !value.alt?.includes(value.credit) ? `Photo credit - ${value.credit}` : '';
      return figure(src, value.alt, [value.alt, credit].filter(Boolean).join(' · '));
    },
    imageUrl: ({ value }) => {
      const src = usableImageUrl(value?.url);
      return src ? figure(src, value.alt, value.alt) : '';
    },
    youtube: ({ value }) => (value?.url ? youTubeLink(value.url) : ''),
    ad: () => '',
    spacer: () => '',
  },
};

// CDATA can't contain its own terminator, so split any "]]>" across two sections.
const cdata = (html: string) => `<![CDATA[${stripControlChars(html).replace(/]]>/g, ']]]]><![CDATA[>')}]]>`;

function fullText(post: SanityDocument, url: string): string {
  const leadRef = post.mainImage?.asset?._ref;
  // Readers already show the lead image above the content; Blotters repeat it as their first body image.
  const body = cleanPostBody(post.body).filter(
    (block) => !(block._type === 'image' && (block as { asset?: { _ref?: string } }).asset?._ref === leadRef),
  );
  const html = toHTML(body, { components: bodyComponents, onMissingComponent: false });
  // Attribution survives when scrapers republish the feed verbatim.
  return `${html}<p>This article originally appeared on <a href="${url}">${escapeHTML(METADATA.title)}</a>.</p>`;
}

function escapeXml(value: string): string {
  return stripControlChars(value.trim())
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Instagram rejects images outside 4:5–1.91:1 (4 of the first 50 were 2:3 portraits), so only those get cropped, around the Studio hotspot.
function leadImageUrl(mainImage: SanityDocument['mainImage']): string {
  // Upscaling is deliberate here: Flipboard rejects lead images under 400px.
  const image = imageFromSource(mainImage).width(1200).format('jpg').quality(85);
  const [w, h] = mainImage.asset._ref.split('-')[2].split('x').map(Number);
  const { top = 0, bottom = 0, left = 0, right = 0 } = mainImage.crop ?? {};
  const ratio = (w * (1 - left - right)) / (h * (1 - top - bottom));
  const clamped = Math.min(Math.max(ratio, 0.8), 1.91);
  return (clamped === ratio ? image : image.height(Math.round(1200 / clamped)).fit('crop')).url();
}

function toItem(post: SanityDocument): string {
  const url = `${SITE_URL}/article/${post.slug}`;
  const image = leadImageUrl(post.mainImage);
  const excerpt = getPostExcerpt(post);
  // A reference to a deleted category resolves to null.
  const categories: string[] = post.categories.filter(Boolean);

  return `
    <item>
      <title>${escapeXml(post.title ?? '')}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>${
        post.author ? `\n      <dc:creator>${escapeXml(post.author)}</dc:creator>` : ''
      }${categories.map((title) => `\n      <category>${escapeXml(title)}</category>`).join('')}${
        excerpt ? `\n      <description>${escapeXml(excerpt)}</description>` : ''
      }
      <content:encoded>${cdata(fullText(post, url))}</content:encoded>
      <media:content url="${escapeXml(image)}" medium="image" type="image/jpeg" />
    </item>`;
}

export async function GET() {
  const posts = await client.fetch<SanityDocument[]>(RSS_POSTS_QUERY);
  const lastBuildDate = new Date(posts[0]?.publishedAt ?? Date.now()).toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${escapeXml(METADATA.title)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(METADATA.description)}</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />${posts.map(toItem).join('')}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
