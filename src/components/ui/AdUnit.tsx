'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { AD_SIZES, SHOW_ADS, ADSENSE_PUBLISHER_ID } from '@/lib/constants';

// --- Ad Unit ---
interface AdUnitProps {
    width?: string;
    height?: string;
    className?: string;
    variant?: 'default' | 'sidebar' | 'vertical' | 'responsive-leaderboard';
    adSlot?: string;
}

export function AdUnit({
    width,
    height,
    className,
    variant = 'default',
    adSlot,
}: AdUnitProps) {
    const adRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const isInitialized = useRef(false);

    // Resolve dimensions based on variant
    let finalWidth = width;
    let finalHeight = height;

    if (variant === 'sidebar') {
        finalWidth = width || AD_SIZES.SIDEBAR.width;
        finalHeight = height || AD_SIZES.SIDEBAR.height;
    } else if (variant === 'vertical') {
        finalWidth = width || AD_SIZES.LARGE_VERTICAL.width;
        finalHeight = height || AD_SIZES.LARGE_VERTICAL.height;
    } else if (variant === 'responsive-leaderboard') {
        finalWidth = width || AD_SIZES.RESPONSIVE_LEADERBOARD.width;
        finalHeight = height || AD_SIZES.RESPONSIVE_LEADERBOARD.height;
    } else {
        finalWidth = width || "w-[300px] md:w-[336px]";
        finalHeight = height || "h-[250px] md:h-[280px]";
    }

    // Initialize AdSense on mount & route changes (production only)
    useEffect(() => {
        if (!SHOW_ADS) return;
        if (process.env.NODE_ENV === 'development') return;

        // Small delay to let the DOM settle after navigation
        const timer = setTimeout(() => {
            try {
                if (adRef.current && !isInitialized.current) {
                    ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
                    isInitialized.current = true;
                }
            } catch (error) {
                console.error('AdSense push error:', error);
            }
        }, 100);

        return () => {
            clearTimeout(timer);
            isInitialized.current = false;
        };
    }, [pathname]);

    // If ads are disabled, render nothing — no empty containers, no layout gaps
    if (!SHOW_ADS) {
        return null;
    }

    // In development, show a styled placeholder instead of hitting real AdSense
    if (process.env.NODE_ENV === 'development') {
        return (
            <div className={`bg-gray-200 border border-gray-200 mx-auto ${finalWidth} ${className}`}>
                <div className="h-[22px] bg-gray-200 flex items-center">
                    <span className="px-2 text-[10px] tracking-wider text-gray-400 font-medium">Advertisement</span>
                </div>
                <div className={`flex items-center justify-center text-gray-700 ${finalHeight} bg-gray-200`}>
                </div>
            </div>
        );
    }

    // Production: render real AdSense <ins> element
    return (
        <div ref={adRef} className={`mx-auto ${finalWidth} ${className}`}>
            <div className="h-[22px] flex items-center">
                <span className="px-2 text-[10px] tracking-wider text-gray-400 font-medium">Advertisement</span>
            </div>
            <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client={ADSENSE_PUBLISHER_ID}
                data-ad-slot={adSlot || ''}
                data-ad-format="auto"
                data-full-width-responsive="true"
            />
        </div>
    );
}

export function SidebarAdWidget({ className = 'mb-10' }: { className?: string }) {
    return (
        <AdUnit variant="sidebar" className={className} />
    );
}
