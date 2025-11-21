import { SanityDocument } from "next-sanity";

export type HomepageContent = {
    carousel: SanityDocument[];
    topStory: SanityDocument | null;
    sidebar: SanityDocument[];
    newReleases: SanityDocument[];
    editorsPicksLarge: SanityDocument[];
    editorsPicksSmall: SanityDocument[];
    remaining: SanityDocument[];
    latestNews: SanityDocument[];
    bottomSection: SanityDocument[];
    mustWatch: SanityDocument[];
};

export function distributePosts(posts: SanityDocument[] = []): HomepageContent {
    // Define how many posts go into each bucket
    const CAROUSEL_COUNT = 3;
    const TOP_STORY_COUNT = 1;
    const SIDEBAR_COUNT = 4;
    const NEW_RELEASES_COUNT = 4;
    const EDITORS_LARGE_COUNT = 3;
    const EDITORS_SMALL_COUNT = 9;
    const LATEST_NEWS_COUNT = 12;
    const BOTTOM_SECTION_COUNT = 6;
    const MUST_WATCH_COUNT = 4;

    let currentIndex = 0;

    // Helper to slice and advance the index
    const getSlice = (count: number) => {
        const slice = posts.slice(currentIndex, currentIndex + count);
        currentIndex += count;
        return slice;
    };

    const carousel = getSlice(CAROUSEL_COUNT);
    const topStory = getSlice(TOP_STORY_COUNT)[0] || null;
    const sidebar = getSlice(SIDEBAR_COUNT);
    const newReleases = getSlice(NEW_RELEASES_COUNT);
    const editorsPicksLarge = getSlice(EDITORS_LARGE_COUNT);
    const editorsPicksSmall = getSlice(EDITORS_SMALL_COUNT);
    const latestNews = getSlice(LATEST_NEWS_COUNT);
    const bottomSection = getSlice(BOTTOM_SECTION_COUNT);
    const mustWatch = getSlice(MUST_WATCH_COUNT);

    // Everything else goes to the bottom grid
    const remaining = posts.slice(currentIndex);

    return {
        carousel,
        topStory,
        sidebar,
        newReleases,
        editorsPicksLarge,
        editorsPicksSmall,
        remaining,
        latestNews,
        bottomSection,
        mustWatch,
    };
}
