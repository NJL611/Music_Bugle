import Link from 'next/link';
import type { SanityDocument } from 'next-sanity';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import { fetchPopularPostsFromQuery } from '@/lib/fetchers';
import { resolvePostPath, formatDate } from '@/lib/utils';
import { NAV_ITEMS } from '@/lib/constants';

// Stays HTTP 404 on purpose — a 200 catch-all would be a soft-404 that hurts SEO/AdSense.
export default async function NotFound() {
  let posts: SanityDocument[] = [];
  try {
    posts = await fetchPopularPostsFromQuery();
  } catch {
    // a CMS outage shouldn't turn the 404 page itself into an error
    posts = [];
  }
  const latest = posts.slice(0, 6);

  return (
    <main className="bg-white min-h-screen">
      <Nav />

      <div className="w-full mx-auto px-8 py-20 2xl:px-64">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-theme-red font-graphiknormal tracking-widest text-sm mb-4">404</p>
          <h1 className="text-[42px] md:text-[56px] font-abril text-gray-900 mb-4 leading-tight">
            Page Not Found
          </h1>
          <p className="text-lg text-gray-600 font-graphiklight mb-10">
            The page you&apos;re looking for doesn&apos;t exist or may have been moved.
            Try a search or browse below.
          </p>

          {/* name="search" must match the /search page's query param */}
          <form action="/search" method="GET" className="flex max-w-md mx-auto mb-12">
            <input
              type="search"
              name="search"
              placeholder="Search articles…"
              aria-label="Search articles"
              className="flex-1 border border-gray-300 rounded-l-sm px-4 py-3 text-gray-900 focus:outline-none focus:border-theme-red"
            />
            <button
              type="submit"
              className="bg-theme-red text-white px-6 py-3 rounded-r-sm hover:bg-[#a03b3c] transition-colors font-graphiknormal"
            >
              Search
            </button>
          </form>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/"
              className="bg-theme-red text-white px-8 py-3 rounded-sm hover:bg-[#a03b3c] transition-colors font-graphiknormal"
            >
              Return to Home
            </Link>
            <Link
              href="/contact"
              className="bg-white border-2 border-theme-red text-theme-red px-8 py-3 rounded-sm hover:bg-theme-red hover:text-white transition-colors font-graphiknormal"
            >
              Contact Us
            </Link>
          </div>
        </div>

        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-[24px] font-prata text-gray-900 mb-4 text-center">
            Browse by category
          </h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.link}
                className="px-4 py-2 bg-gray-100 hover:bg-theme-red hover:text-white transition-colors rounded-full text-sm font-graphiknormal"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {latest.length > 0 && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-[24px] font-prata text-gray-900 mb-6 text-center">
              Latest articles
            </h2>
            <ul className="divide-y divide-gray-200 border-t border-gray-200">
              {latest.map((post) => (
                <li key={post._id}>
                  <Link href={resolvePostPath(post)} className="group flex flex-col gap-1 py-4">
                    <span className="font-prata text-gray-900 group-hover:text-theme-red transition-colors leading-snug">
                      {post.title}
                    </span>
                    <span className="flex items-center gap-2 text-xs text-gray-500 font-graphiklight">
                      {post.categories?.[0]?.title && <span>{post.categories[0].title}</span>}
                      {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <Footer posts={posts} />
    </main>
  );
}
