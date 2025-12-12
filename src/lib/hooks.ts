'use client'
import { useEffect, useState } from 'react';

type Breakpoint = 'small' | 'medium' | 'large';

const getBreakpoint = (width: number): Breakpoint => {
    if (width < 640) return 'small';
    if (width < 1024) return 'medium';
    return 'large';
};

export function useWindowUtils() {
    const [size, setSize] = useState<Breakpoint>(() => {
        if (typeof window === 'undefined') return 'large';
        return getBreakpoint(window.innerWidth);
    });

    useEffect(() => {
        const handleResize = () => {
            setSize(getBreakpoint(window.innerWidth));
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return size;
}

