// --- Button ---
export const Button = ({ text, href, className = "bg-theme-button text-white" }: { text: string; href: string; className?: string }) => (
    <a
        href={href}
        className={`flex flex-col justify-center items-center rounded-md px-5 py-2 transition-all ${className}`}
    >
        <span className="font-light">{text}</span>
    </a>
);

export { ShareButtons } from '@/components/ui/ShareButtons';
