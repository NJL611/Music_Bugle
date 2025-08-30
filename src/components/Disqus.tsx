'use client'

import React from 'react';
import { DiscussionEmbed } from 'disqus-react';

export default function Disqus({ post }: { post: any }) {
  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';

  // Debug: Log the current URL and post details
  // console.log('Disqus config:', {
  //     url: pageUrl,
  //     identifier: post.slug,
  //     title: post.title,
  //     language: 'en_US'
  // });

  return (
    <DiscussionEmbed
      shortname='music-bugle'
      config={{
        url: pageUrl,
        identifier: post.slug,
        title: post.title,
        language: 'en'
      }}
    />
  );
}
