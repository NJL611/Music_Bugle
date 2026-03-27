import { TwitterLogo, FacebookLogo, PinterestLogo, MailIcon, InstagramLogo } from './Icons';
import { AD_SIZES } from '@/lib/constants';


// --- Ad Unit ---
interface AdUnitProps {
    width?: string;
    height?: string;
    className?: string;
    variant?: 'default' | 'sidebar' | 'vertical' | 'responsive-leaderboard';
}


export function AdUnit({
    width,
    height,
    className,
    variant = 'default'
}: AdUnitProps) {
    let finalWidth = width;
    let finalHeight = height;
    let finalClassName = className;


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

    return (
        <div className={`bg-gray-200 border border-gray-200 mx-auto ${finalWidth} ${finalClassName}`}>
            <div className="h-[22px] bg-gray-200 flex items-center">
                <span className="px-2 text-[10px] tracking-wider text-gray-400 font-medium">Advertisement</span>
            </div>
            <div className={`flex items-center justify-center text-gray-700 ${finalHeight} bg-gray-200`}>
            </div>
        </div>
    );
}

export function SidebarAdWidget({ className = 'mb-10' }: { className?: string }) {
    return (
        <AdUnit variant="sidebar" className={className} />
    );
}



// --- Button ---
export const Button = ({ text, href, className = "bg-theme-button text-white" }: { text: string; href: string; className?: string }) => (
    <a
        href={href}
        className={`flex flex-col justify-center items-center rounded-md px-5 py-2 transition-all ${className}`}
    >
        <span className="font-light">{text}</span>
    </a>
);

// --- Share Buttons ---
interface ShareButtonsProps {
    className?: string;
    itemClassName?: string;
}

const SHARE_BUTTONS = [
    { label: "Twitter", Icon: TwitterLogo, scaleClass: "scale-[0.75]" },
    { label: "Facebook", Icon: FacebookLogo, scaleClass: "scale-[0.75]" },
    { label: "Pinterest", Icon: PinterestLogo, scaleClass: "scale-[0.75]" },
    { label: "Mail", Icon: MailIcon, scaleClass: "scale-[0.75]" },
    { label: "Instagram", Icon: InstagramLogo, scaleClass: "scale-[0.8]" },
];

export const ShareButtons = ({ className = "", itemClassName = "" }: ShareButtonsProps) => (
    <div className={`flex gap-2 ${className}`}>
        {SHARE_BUTTONS.map(({ label, Icon, scaleClass }) => (
            <a
                key={label}
                href="#"
                aria-label={label}
                className={`flex justify-center rounded-full items-center w-8 h-8 bg-black hover:bg-gray-800 transition-colors ${itemClassName}`}
            >
                <div className={`transform ${scaleClass}`}>
                    <Icon />
                </div>
            </a>
        ))}
    </div>
);
