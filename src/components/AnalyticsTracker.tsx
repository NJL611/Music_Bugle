'use client';

import { useEffect } from 'react';
import { trackArticleView } from '@/lib/analytics';

interface AnalyticsTrackerProps {
    articleTitle: string;
    articleSlug: string;
}

export default function AnalyticsTracker({ articleTitle, articleSlug }: AnalyticsTrackerProps) {
    useEffect(() => {
        trackArticleView(articleTitle, articleSlug);
    }, [articleTitle, articleSlug]);

    return null;
}
