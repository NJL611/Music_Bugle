import * as React from "react";

const RightArrowIcon = ({ width = 24, height = 24, color = "currentColor", className = "", ...props }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={width} 
        height={height} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke={color} 
        strokeWidth="1" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={`feather feather-chevron-right ${className}`} 
        {...props}
    >
        <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
);

export default RightArrowIcon;
