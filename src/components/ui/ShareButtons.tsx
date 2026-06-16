'use client';

import { useEffect, useState } from 'react';
import { TwitterLogo, FacebookLogo, PinterestLogo, MailIcon } from '@/components/ui/Icons';

interface ShareButtonsProps {
    className?: string;
    itemClassName?: string;
    title?: string;
}

export function ShareButtons({ className = '', itemClassName = '', title }: ShareButtonsProps) {
    const [pageUrl, setPageUrl] = useState('');
    const [pageTitle, setPageTitle] = useState('');

    useEffect(() => {
        setPageUrl(window.location.href);
        setPageTitle(title || document.title);
    }, [title]);

    if (!pageUrl) {
        return <div className={`flex gap-2 ${className}`} aria-hidden="true" />;
    }

    const encodedUrl = encodeURIComponent(pageUrl);
    const encodedTitle = encodeURIComponent(pageTitle);

    const shareLinks = [
        {
            label: 'Twitter',
            href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
            Icon: TwitterLogo,
            scaleClass: 'scale-[0.75]',
        },
        {
            label: 'Facebook',
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            Icon: FacebookLogo,
            scaleClass: 'scale-[0.75]',
        },
        {
            label: 'Pinterest',
            href: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`,
            Icon: PinterestLogo,
            scaleClass: 'scale-[0.75]',
        },
        {
            label: 'Email',
            href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
            Icon: MailIcon,
            scaleClass: 'scale-[0.75]',
        },
    ];

    return (
        <div className={`flex gap-2 ${className}`}>
            {shareLinks.map(({ label, href, Icon, scaleClass }) => (
                <a
                    key={label}
                    href={href}
                    aria-label={`Share on ${label}`}
                    target={label === 'Email' ? undefined : '_blank'}
                    rel={label === 'Email' ? undefined : 'noopener noreferrer'}
                    className={`flex justify-center rounded-full items-center w-8 h-8 bg-black hover:bg-gray-800 transition-colors ${itemClassName}`}
                >
                    <div className={`transform ${scaleClass}`}>
                        <Icon />
                    </div>
                </a>
            ))}
        </div>
    );
}
