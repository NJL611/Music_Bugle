import { NextRequest, NextResponse } from 'next/server';
import { client } from '@sanity/lib/client';
import MailerLite from '@mailerlite/mailerlite-nodejs';
import { groq } from 'next-sanity';
import { generatePremiumEmailHtml } from '@/lib/email-utils';

const mailerlite = new MailerLite({
  api_key: process.env.MAILERLITE_API_TOKEN || '',
});

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const dateString = oneWeekAgo.toISOString();

    let query = groq`*[_type == "post" && publishedAt >= $dateString] | order(publishedAt desc) {
      title,
      excerpt,
      "slug": slug.current,
      publishedAt,
      "imageUrl": mainImage.asset->url,
      "featuredImage": featured_image,
      "imageAlt": mainImage.alt,
      "authorName": author->name
    }`;

    let posts = await client.fetch(query, { dateString });

    if (posts.length === 0) {
      console.log("No posts found for last week, fetching latest 5 for testing...");
      query = groq`*[_type == "post"] | order(publishedAt desc)[0...5] {
        title,
        excerpt,
        "slug": slug.current,
        publishedAt,
        "imageUrl": mainImage.asset->url,
        "featuredImage": featured_image,
        "imageAlt": mainImage.alt,
        "authorName": author->name
       }`;
      posts = await client.fetch(query);
    }

    if (posts.length === 0) {
      return NextResponse.json({ message: 'No posts found at all.' });
    }

    const emailHtml = generatePremiumEmailHtml(posts);

    const campaignParams: any = {
      name: `Weekly Roundup - ${new Date().toLocaleDateString()}`,
      language: 'en',
      type: 'regular',
      emails: [
        {
          subject: `Weekly Music Bugle: ${posts[0].title}`,
          from_name: 'The Music Bugle',
          from: process.env.MAILERLITE_FROM_EMAIL || 'info@themusicbugle.com',
          content: emailHtml,
        }
      ],
      groups: process.env.MAILERLITE_GROUP_ID ? [process.env.MAILERLITE_GROUP_ID] : [],
    };

    const campaign = await mailerlite.campaigns.create(campaignParams);

    return NextResponse.json({
      success: true,
      message: 'Draft campaign created successfully',
      campaignId: (campaign.data as any).id,
      postsFound: posts.length
    });

  } catch (error: any) {
    console.error('Newsletter Cron Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
