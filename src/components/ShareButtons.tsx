import React from "react";
import InstagramLogo from "public/svgs/InstagramLogo";
import TwitterLogo from "public/svgs/TwitterLogo";
import FacebookLogo from "public/svgs/FacebookLogo";
import PinterestLogo from "public/svgs/PinterestLogo";
import MailIcon from "public/svgs/MailIcon";

interface ShareButtonsProps {
    className?: string;
    itemClassName?: string;
}

export default function ShareButtons({ className = "", itemClassName = "" }: ShareButtonsProps) {
    return (
        <div className={`flex gap-2 ${className}`}>
            <a href="#" aria-label="Twitter" className={`flex justify-center rounded-full items-center w-8 h-8 bg-black hover:bg-gray-800 transition-colors ${itemClassName}`}>
                <div className="transform scale-[0.75]">
                    <TwitterLogo />
                </div>
            </a>
            <a href="#" aria-label="Facebook" className={`flex justify-center rounded-full items-center w-8 h-8 bg-black hover:bg-gray-800 transition-colors ${itemClassName}`}>
                <div className="transform scale-[0.75]">
                    <FacebookLogo />
                </div>
            </a>
            <a href="#" aria-label="Pinterest" className={`flex justify-center rounded-full items-center w-8 h-8 bg-black hover:bg-gray-800 transition-colors ${itemClassName}`}>
                <div className="transform scale-[0.75]">
                    <PinterestLogo />
                </div>
            </a>
            <a href="#" aria-label="Mail" className={`flex justify-center rounded-full items-center w-8 h-8 bg-black hover:bg-gray-800 transition-colors ${itemClassName}`}>
                <div className="transform scale-[0.75]">
                    <MailIcon />
                </div>
            </a>
            <a href="#" aria-label="Instagram" className={`flex justify-center rounded-full items-center w-8 h-8 bg-black hover:bg-gray-800 transition-colors ${itemClassName}`}>
                <div className="transform scale-[0.8]">
                    <InstagramLogo />
                </div>
            </a>
        </div>
    );
}

