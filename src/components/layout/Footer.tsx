import Link from 'next/link';
import type { SanityDocument } from 'next-sanity';
import { LogoFooter } from '@/components/ui/Icons';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { formatDate } from '@/lib/utils';
import { NAV_ITEMS, FOOTER_COMPANY_ITEMS } from '@/lib/constants';
import { resolvePostPath } from '@/lib/utils';

export default function Footer({ posts = [] }: { posts?: SanityDocument[] }) {
    const latestPosts = posts.slice(0, 3);

    return (
        <footer className="bg-theme-dark w-full mx-auto pt-12 px-8 pb-8 text-white text-sm">
            {/* Top Row: Logo and Categories */}
            <div className="w-full mx-auto flex flex-col md:flex-row items-start md:items-center justify-between border-b border-gray-600 pb-8 mb-8 gap-6 md:gap-0">
                <LogoFooter color="white" />
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm   tracking-wide">
                    {NAV_ITEMS.map((item) => (
                        <Link key={item.label} href={item.link} className="hover:text-theme-red font-light transition-colors">{item.label}</Link>
                    ))}
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-[2fr_1.5fr_2.5fr_1.5fr] gap-8">
                {/* Column 1: About Us */}
                <div className="flex flex-col">
                    <h3 className="text-[18px]   font-prata mb-4">About us</h3>
                    <p className="text-gray-400 text-sm font-lightleading-relaxed mb-4 font-graphik">
                        The Music Bugle is committed to independent, reader-supported music journalism. Your support helps us keep covering the stories that matter.
                    </p>
                    <div className="mb-4">
                        <p className="text-gray-400 text-sm font-graphiklight mb-2">
                            <strong className="text-white">Contact:</strong>
                        </p>
                        <p className="text-gray-400 text-sm font-graphiklight mb-1">
                            <a href="mailto:info@themusicbugle.com" className="hover:text-white transition-colors">info@themusicbugle.com</a>
                        </p>
                        <p className="text-gray-400 text-sm font-graphiklight">
                            <a href="/contact" className="hover:text-white transition-colors">Contact Form</a>
                        </p>
                    </div>
                    <SocialLinks />
                </div>

                {/* Column 2: Company */}
                <div className="flex flex-col">
                    <h3 className="text-[18px]   font-prata mb-4">Company</h3>
                    <ul className="space-y-3 text-sm  ">
                        {FOOTER_COMPANY_ITEMS.map((item) => (
                            <li key={item.label}><Link href={item.link} className="hover:text-theme-red font-light transition-colors">{item.label}</Link></li>
                        ))}
                    </ul>
                </div>

                {/* Column 3: The Latest */}
                <div className="flex flex-col">
                    <h3 className="text-[18px]   font-prata mb-4">The latest</h3>
                    <div className="flex flex-col gap-4">
                        {latestPosts.map((post) => (
                            <div key={post._id} className="flex gap-3 group cursor-pointer">
                                <div className="flex flex-col justify-center">
                                    <Link href={resolvePostPath(post)} className="text-[13px] font-light text-white leading-snug hover:text-theme-red transition-colors line-clamp-2 mb-1">
                                        {post.title}
                                    </Link>
                                    <div className="flex items-center gap-2 text-[10px] text-gray-400  ">
                                        {post.categories?.[0] && (
                                            <span className="text-white text-[13px]">{post.categories[0].title}</span>
                                        )}
                                        <span className="text-gray-400 font-normal text-[13px]">
                                            {post.publishedAt ? formatDate(post.publishedAt) : null}
                                        </span>

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Column 4: Stay in touch */}
                <div className="flex flex-col">
                    <h3 className="text-[18px]   font-prata mb-4">Stay in touch</h3>
                    <p className="text-gray-400 text-sm font-graphiklight mb-4">
                        Have a story tip, press inquiry, or feedback? We read every message.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex justify-center items-center w-full bg-black text-white px-4 py-3 text-sm rounded-sm hover:bg-gray-900 transition-colors border border-white/20"
                    >
                        Contact us <span className="text-lg ml-1">→</span>
                    </Link>
                </div>
            </div>

            {/* Legal Links */}
            <div className="border-t border-gray-600 mt-12 pt-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/refund" className="hover:text-white transition-colors">Refund Policy</Link>
                        <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
                    </div>
                    <div className="text-xs text-gray-400">
                        <p className="mb-1 text-[12px] font-graphiklight">© {new Date().getFullYear()} The Music Bugle. All rights reserved.</p>
                        <p className="text-[13px] font-graphiklight">Email: <a href="mailto:info@themusicbugle.com" className="hover:text-white transition-colors text-[13px]">info@themusicbugle.com</a></p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
