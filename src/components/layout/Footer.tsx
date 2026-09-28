import Link from 'next/link';
import type { SanityDocument } from 'next-sanity';
import { LogoFooter } from '@/components/ui/Icons';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { formatDate, resolvePostPath } from '@/lib/utils';
import { NAV_ITEMS, FOOTER_COMPANY_ITEMS } from '@/lib/constants';

// Site-wide footer: nav, about blurb, latest posts, company and legal links.
// "The latest" renders only where the page passes posts — most pages don't, so the grid drops to two columns.

const MUTED_LINK = 'hover:text-white transition-colors';

export default function Footer({ posts = [] }: { posts?: SanityDocument[] }) {
    const latestPosts = posts.slice(0, 3);
    const columns = latestPosts.length > 0 ? 'md:grid-cols-[1.5fr_2fr_1fr]' : 'md:grid-cols-[2fr_1fr]';

    return (
        <footer className="bg-theme-dark w-full mx-auto pt-10 px-8 pb-6 text-white text-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-gray-600 pb-6 mb-8">
                <LogoFooter color="white" />
                <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 tracking-wide">
                    {NAV_ITEMS.map((item) => (
                        <Link key={item.label} href={item.link} className="hover:text-theme-red font-light transition-colors">{item.label}</Link>
                    ))}
                </nav>
            </div>

            <div className={`grid grid-cols-1 ${columns} gap-8 lg:gap-16`}>
                <div className="flex flex-col">
                    <h3 className="text-base font-prata mb-3">About us</h3>
                    <p className="text-gray-400 font-graphiklight leading-relaxed max-w-sm mb-4">
                        The Music Bugle is committed to independent, reader-supported music journalism. Your support helps us keep covering the stories that matter.
                    </p>
                    <div className="flex items-center gap-4">
                        <a href="mailto:info@themusicbugle.com" className={`text-gray-400 font-graphiklight ${MUTED_LINK}`}>info@themusicbugle.com</a>
                        <SocialLinks />
                    </div>
                </div>

                {latestPosts.length > 0 && (
                    <div className="flex flex-col">
                        <h3 className="text-base font-prata mb-3">The latest</h3>
                        <ul className="flex flex-col gap-3">
                            {latestPosts.map((post) => (
                                <li key={post._id}>
                                    <Link href={resolvePostPath(post)} className="block leading-snug line-clamp-2 hover:text-theme-red transition-colors">
                                        {post.title}
                                    </Link>
                                    <span className="text-xs text-gray-400 font-graphiklight">
                                        {[post.categories?.[0]?.title, post.publishedAt && formatDate(post.publishedAt)].filter(Boolean).join(' · ')}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="flex flex-col">
                    <h3 className="text-base font-prata mb-3">Company</h3>
                    <ul className="flex flex-col gap-2 text-gray-400 font-graphiklight">
                        {FOOTER_COMPANY_ITEMS.map((item) => (
                            <li key={item.label}><Link href={item.link} className={MUTED_LINK}>{item.label}</Link></li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="flex flex-col md:flex-row md:justify-between items-center gap-3 border-t border-gray-600 mt-8 pt-6 text-xs text-gray-400 font-graphiklight">
                <div className="flex flex-wrap justify-center gap-4">
                    <Link href="/terms" className={MUTED_LINK}>Terms of Service</Link>
                    <Link href="/privacy" className={MUTED_LINK}>Privacy Policy</Link>
                    <Link href="/refund" className={MUTED_LINK}>Refund Policy</Link>
                </div>
                <p>© {new Date().getFullYear()} The Music Bugle. All rights reserved.</p>
            </div>
        </footer>
    );
}
