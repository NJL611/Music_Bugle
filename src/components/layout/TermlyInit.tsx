'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Re-mounts Termly's consent banner after hydration and on client navigation (Termly's documented Next.js pattern).
// Termly injects the banner before React hydrates; the resulting mismatch re-renders <body> and deletes it.

export function TermlyInit() {
    const pathname = usePathname();

    useEffect(() => {
        (window as Window & { Termly?: { initialize?: () => void } }).Termly?.initialize?.();
    }, [pathname]);

    return null;
}
