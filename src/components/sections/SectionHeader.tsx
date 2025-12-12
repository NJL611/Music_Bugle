import Link from "next/link";
import { ChevronRight } from "@/components/ui/Icons";

export function SectionHeader({ title, viewAllLink, className = "" }: { title: string; viewAllLink?: string; className?: string }) {
    return (
        <div className={`flex justify-between items-center mb-6 ${className}`}>
            <h2 className="text-[26px] font-medium font-prata text-black">{title}</h2>
            {viewAllLink && (
                <Link href={viewAllLink} className="flex items-center gap-2 text-theme-red hover:text-theme-red/80 transition-colors">
                    <span className="text-[16px] font-medium">View All</span>
                    <div className="w-4 h-4">
                        <ChevronRight className="w-full h-full" color="currentColor" />
                    </div>
                </Link>
            )}
        </div>
    );
}

