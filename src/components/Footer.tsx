'use client';
import Link from 'next/link';
import Button from '@/components/Button';
import LogoFooter from 'public/svgs/LogoFooter';

export default function Footer() {
    return (
        <>
            <footer className="bg-[#1B1B1B] w-full mx-auto pt-8 px-8 pb-6 text-white text-sm">
                <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* First Column */}
                    <div className="flex flex-col items-start min-w-[270px] max-w-[355px]">
                        <LogoFooter color="white" />
                        <span className="mb-4 mt-4 text-sm">
                            Your donation supports local artists, events, and helps us expand our reach.
                        </span>
                        <Button text="Donate" href="#" bgColor="#ffffff" textColor="black" />
                    </div>

                    {/* Second Column */}
                    <div className="grid grid-cols-2 gap-8 md:gap-14 w-full my-5 ">
                        <div>
                            <ul>
                                <li><Link href="#" className="hover:underline">News</Link></li>
                                <li><Link href="#" className="hover:underline">Q&A</Link></li>
                                <li><Link href="#" className="hover:underline">Songs</Link></li>
                                <li><Link href="#" className="hover:underline whitespace-nowrap">Music Videos</Link></li>
                            </ul>
                        </div>
                        <div>
                            <ul>
                                <li><Link href="#" className="hover:underline whitespace-nowrap">Album Releases</Link></li>
                                <li><Link href="#" className="hover:underline">Tours</Link></li>
                                <li><Link href="#" className="hover:underline">Books</Link></li>
                                <li><Link href="#" className="hover:underline">Other</Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* Third Column */}
                    <div className="flex flex-col items-start justify-between md:items-end">
                        <span className="font-bold md:text-right text-sm">Subscribe to Our Newsletter</span>
                        <div className="">
                            <span className="mt-2 inline-block md:text-right text-sm justify-end">Sign up for email updates on the latest music, talks, interviews, live events and shows.</span>
                            <div className="w-full flex justify-end mt-3">
                                <input
                                    type="email"
                                    placeholder="Enter your email here"
                                    className="w-full px-4 py-2 border border-gray-400 text-black text-[14px] rounded-sm focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-6 pt-4 flex flex-col md:flex-row justify-between items-center">
                    <span className='text-sm'>© 2024 The Music Bugle. All rights reserved.</span>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <Link href="#" className="text-sm hover:underline">Privacy Policy</Link>
                        <Link href="#" className="text-sm hover:underline">Terms of Service</Link>
                    </div>
                </div>
            </footer>
        </>
    );
}
