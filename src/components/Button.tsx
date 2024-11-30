'use client';
import React from 'react';

export default function Button({ text, href, bgColor, textColor }: { text: string; href: string; bgColor?: string; textColor?: string }) {
  return (
    <a
      href={href}
      className="flex flex-col justify-center items-center rounded-md px-5 py-2 transition-all"
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      <span className="font-light">{text}</span>
    </a>
  );
}
