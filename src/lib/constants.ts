export const SITE_URL = process.env.SITE_URL || 'https://themusicbugle.com';
export const GOOGLE_ANALYTICS_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || '';
export const GOOGLE_TAG_MANAGER_ID = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID || '';
export const TERMLY_WEBSITE_UUID = process.env.NEXT_PUBLIC_TERMLY_WEBSITE_UUID || '';


export const NAV_ITEMS = [
    { label: 'News', link: '/category/news' },
    { label: 'Q&A', link: '/category/q-and-a' },
    { label: 'Songs', link: '/category/songs' },
    { label: 'Music Videos', link: '/category/music-videos' },
    { label: 'Upcoming Releases', link: '/category/upcoming-releases' },
    { label: 'Tours', link: '/category/tours' },
    { label: 'Books', link: '/category/books' },
];

export const TRENDING_ITEMS = [
    { label: 'Trending', link: '/category/trending' },
    { label: 'Latest', link: '/category/latest' },
    { label: 'Notable Releases', link: '/category/notable-releases' },
    { label: 'Album Reviews', link: '/category/album-reviews' },
    { label: 'New Songs', link: '/category/new-songs' }
];

export const FOOTER_COMPANY_ITEMS = [
    { label: 'About', link: '/about' },
    { label: 'Contact us', link: '/contact' },
    { label: 'Support Us', link: '/support' },
    { label: 'Cookie Preferences', link: '/consent-preferences' },
];

// --- Image Sizes ---
export const GRID_IMAGE_SIZES = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 25vw, 300px";
export const HERO_IMAGE_SIZES = "(max-width: 768px) 100vw, 50vw";
export const SIDEBAR_IMAGE_SIZES = "(max-width: 640px) 45vw, 124px";
export const FEATURE_IMAGE_SIZES = "(max-width: 768px) 100vw, 800px";

// --- Regex ---
export const YOUTUBE_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
export const YOUTUBE_ID_REGEX = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^\s&]+)/;

// --- Homepage Counts ---
export const HOMEPAGE_COUNTS = {
    CAROUSEL: 3,
    TOP_STORY: 1,
    SIDEBAR: 4,
    NEW_RELEASES: 4,
    EDITORS_LARGE: 3,
    EDITORS_SMALL: 9,
    LATEST_NEWS: 12,
    BOTTOM_SECTION: 6,
    MUST_WATCH: 4,
};

// --- Metadata ---
export const METADATA = {
    title: 'The Music Bugle',
    description: 'Your source for the latest music news.',
    image: `${SITE_URL}/og-preview.jpg`,
    twitterHandle: '@TheMusicBugle',
};

// --- Ad Sizes ---
export const AD_SIZES = {
    // Standard AdSense Sizes
    MEDIUM_RECTANGLE: {
        width: "w-[300px]",
        height: "h-[250px]"
    },
    LARGE_RECTANGLE: {
        width: "w-[336px]",
        height: "h-[280px]"
    },
    LEADERBOARD: {
        width: "w-[728px]",
        height: "h-[90px]"
    },
    LARGE_LEADERBOARD: {
        width: "w-[970px]",
        height: "h-[90px]"
    },
    MOBILE_BANNER: {
        width: "w-[300px]",
        height: "h-[50px]"
    },
    MOBILE_LEADERBOARD: {
        width: "w-[320px]",
        height: "h-[50px]"
    },
    LARGE_MOBILE_BANNER: {
        width: "w-[320px]",
        height: "h-[100px]"
    },
    BILLBOARD: {
        width: "w-[970px]",
        height: "h-[250px]"
    },
    WIDE_SKYSCRAPER: {
        width: "w-[160px]",
        height: "h-[600px]"
    },
    SKYSCRAPER: {
        width: "w-[120px]",
        height: "h-[600px]"
    },
    HALF_PAGE: {
        width: "w-[300px]",
        height: "h-[600px]"
    },
    SQUARE: {
        width: "w-[250px]",
        height: "h-[250px]"
    },
    SMALL_SQUARE: {
        width: "w-[200px]",
        height: "h-[200px]"
    },
    SMALL_RECTANGLE: {
        width: "w-[180px]",
        height: "h-[150px]"
    },
    BUTTON: {
        width: "w-[125px]",
        height: "h-[125px]"
    },
    BANNER: {
        width: "w-[468px]",
        height: "h-[60px]"
    },
    PORTRAIT: {
        width: "w-[300px]",
        height: "h-[1050px]"
    },

    // Responsive / Composite Sizes (Preserving existing behavior)
    RESPONSIVE_RECTANGLE: {
        width: "w-[300px] md:w-[336px]",
        height: "h-[250px] md:h-[280px]"
    },
    RESPONSIVE_LEADERBOARD: {
        width: "w-[320px] md:w-[728px] lg:w-[970px]",
        height: "h-[50px] md:h-[90px] lg:h-[90px]"
    },
    // Custom UI sizes
    SIDEBAR: {
        width: "w-full",
        height: "h-[250px]"
    },
    LARGE_VERTICAL: {
        width: "w-full",
        height: "h-[600px]"
    },
};