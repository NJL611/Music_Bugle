'use client';
import React from 'react';

export default function Button({ text, href }: { text: string, href: string }) {

  return (
    <div className='cursor-pointer flex flex-col justify-center items-center rounded-md px-5 py-2 bg-[#C14E4E] transition-all hover:bg-[#B94445]'>
      <span className='font-light text-white'>{text}</span>
    </div>
  );
}
