import * as React from "react";

const LeftArrowIcon = ({ width = 24, height = 24, color = "currentColor", className = "", ...props }) => (
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
        className={`feather feather-chevron-left ${className}`} 
        {...props}
    >
        <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
);

export default LeftArrowIcon;
