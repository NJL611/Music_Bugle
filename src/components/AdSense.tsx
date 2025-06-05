'use client';

import Script from 'next/script';
import { useEffect } from 'react';

interface AdSenseProps {
    adClient: string; // Your AdSense publisher ID
}

export function AdSenseScript({ adClient }: AdSenseProps) {
    return (
        <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
        />
    );
}

interface AdUnitProps {
    adSlot: string;
    adFormat?: string;
    style?: React.CSSProperties;
    className?: string;
}

export function AdUnit({
    adSlot,
    adFormat = 'auto',
    style = { display: 'block' },
    className = ''
}: AdUnitProps) {
    useEffect(() => {
        try {
            // Push ad to AdSense queue
            ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        } catch (err) {
            console.error('AdSense error:', err);
        }
    }, []);

    return (
        <div className={className}>
            <ins
                className="adsbygoogle"
                style={style}
                data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
                data-ad-slot={adSlot}
                data-ad-format={adFormat}
                data-full-width-responsive="true"
            />
        </div>
    );
}

// Responsive banner ad component
export function BannerAd({ adSlot, className = '' }: { adSlot: string; className?: string }) {
    return (
        <AdUnit
            adSlot={adSlot}
            adFormat="auto"
            style={{ display: 'block', minHeight: '250px' }}
            className={`border border-gray-200 rounded-lg p-4 ${className}`}
        />
    );
}

// Square ad component for sidebar
export function SquareAd({ adSlot, className = '' }: { adSlot: string; className?: string }) {
    return (
        <AdUnit
            adSlot={adSlot}
            adFormat="rectangle"
            style={{ display: 'block', width: '300px', height: '250px' }}
            className={`border border-gray-200 rounded-lg p-4 ${className}`}
        />
    );
}

// In-article ad component
export function InArticleAd({ adSlot, className = '' }: { adSlot: string; className?: string }) {
    return (
        <AdUnit
            adSlot={adSlot}
            adFormat="fluid"
            style={{ display: 'block', textAlign: 'center' }}
            className={`my-8 ${className}`}
        />
    );
} 