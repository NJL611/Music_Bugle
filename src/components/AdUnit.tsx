import React from "react";

interface AdUnitProps {
    width?: string;
    height?: string;
    className?: string;
}

export default function AdUnit({
    width = "w-[300px] md:w-[336px]",
    height = "h-[250px] md:h-[280px]",
    className = "mx-auto my-5"
}: AdUnitProps) {
    return (
        <div className={`bg-[#D9D9D9] ${width} ${className}`}>
            <div className="h-[20px]">
                <span className="px-2 text-left text-[10px] text-gray-500">Advertisement</span>
            </div>
            <div className={`bg-[#D9D9D9] ${height}`} />
        </div>
    );
}

