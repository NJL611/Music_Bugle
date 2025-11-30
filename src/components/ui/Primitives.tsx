import { TwitterLogo, FacebookLogo, PinterestLogo, MailIcon, InstagramLogo } from './Icons';

// --- Ad Unit ---
interface AdUnitProps {
    width?: string;
    height?: string;
    className?: string;
}

export function AdUnit({
    width = "w-[300px] md:w-[336px]",
    height = "h-[250px] md:h-[280px]",
    className = "mx-auto my-5"
}: AdUnitProps) {
    return (
        <div className={`bg-[#D9D9D9] ${width} ${className}`}>
            <div className="h-[20px]">
                <span className="px-2 text-left text-[10px] text-gray-700">Advertisement</span>
            </div>
            <div className={`bg-[#D9D9D9] ${height}`} />
        </div>
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
