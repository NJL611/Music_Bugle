"use client";
import React from "react";

type ButtonProps = {
  text: string;
  href?: string;
  onClick?: () => void;
  bgColor?: string;
  textColor?: string;
};

export default function Button({
  text,
  href,
  onClick,
  bgColor = "#C14E4E",
  textColor = "#FFF",
}: ButtonProps) {
  const baseStyles = `flex flex-col justify-center items-center rounded-md px-5 py-2 transition-all`;
  const styleOverrides = {
    backgroundColor: bgColor,
    color: textColor,
  };

  if (href) {
    return (
      <a href={href} className={baseStyles} style={styleOverrides}>
        <span className="font-light text-sm">{text}</span>
      </a>
    );
  }

  if (onClick) {
    return (
      <button onClick={onClick} className={baseStyles} style={styleOverrides}>
        <span className="font-light text-sm">{text}</span>
      </button>
    );
  }

  return null;
}
