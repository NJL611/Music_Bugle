import Link from 'next/link';
import { SOCIAL_LINKS } from '@/lib/constants';
import { FacebookLogo, TwitterLogo, InstagramLogo, PinterestLogo } from '@/components/ui/Icons';

const SOCIAL_ICONS = {
    Facebook: FacebookLogo,
    Twitter: TwitterLogo,
    Instagram: InstagramLogo,
    Pinterest: PinterestLogo,
} as const;

type SocialLabel = keyof typeof SOCIAL_ICONS;

interface SocialLinksProps {
    className?: string;
    linkClassName?: string;
}

export function SocialLinks({ className = 'flex gap-4', linkClassName = 'hover:opacity-80 transition-opacity' }: SocialLinksProps) {
    if (SOCIAL_LINKS.length === 0) return null;

    return (
        <div className={className}>
            {SOCIAL_LINKS.map(({ label, href }) => {
                const Icon = SOCIAL_ICONS[label as SocialLabel];
                if (!Icon) return null;

                return (
                    <Link
                        key={label}
                        href={href}
                        aria-label={label}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={linkClassName}
                    >
                        <Icon />
                    </Link>
                );
            })}
        </div>
    );
}
