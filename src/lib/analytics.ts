// Google Analytics utility functions

declare global {
    interface Window {
        gtag: (
            command: 'config' | 'event' | 'js',
            targetId: string | Date,
            config?: {
                page_title?: string;
                page_location?: string;
                page_path?: string;
                custom_map?: { [key: string]: string };
                [key: string]: any;
            }
        ) => void;
    }
}

// Track page views
export const pageview = (url: string, title?: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
            page_path: url,
            page_title: title,
        });
    }
};

// Track custom events
export const event = ({
    action,
    category,
    label,
    value,
}: {
    action: string;
    category: string;
    label?: string;
    value?: number;
}) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
        });
    }
};

// Track article views
export const trackArticleView = (articleTitle: string, articleSlug: string) => {
    event({
        action: 'view_article',
        category: 'engagement',
        label: `${articleTitle} (${articleSlug})`,
    });
};

// Track search queries
export const trackSearch = (searchTerm: string, resultsCount?: number) => {
    event({
        action: 'search',
        category: 'engagement',
        label: searchTerm,
        value: resultsCount,
    });
};

// Track donations
export const trackDonation = (amount: number) => {
    event({
        action: 'donate',
        category: 'conversion',
        label: 'donation',
        value: amount,
    });
};

// Track category/tag clicks
export const trackCategoryClick = (categoryName: string) => {
    event({
        action: 'click_category',
        category: 'navigation',
        label: categoryName,
    });
};

export const trackTagClick = (tagName: string) => {
    event({
        action: 'click_tag',
        category: 'navigation',
        label: tagName,
    });
};
