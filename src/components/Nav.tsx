'use client';
import LogoIcon from '../../public/svgs/LogoIcon'
import SearchIcon from '../../public/svgs/SearchIcon'
import HamburgerIcon from '../../public/svgs/HamburgerIcon'
import useWindowUtils from '@/hooks/useWindowUtils';
import Button from '@/components/Button';
import React from 'react';

const navItems = [
  { label: 'News', link: '#' },
  { label: 'Q&A', link: '#' },
  { label: 'Songs', link: '#' },
  { label: 'Music Videos', link: '#' },
  { label: 'Upcoming Releases', link: '#' },
  { label: 'Tours', link: '#' },
  { label: 'Books', link: '#' },
];

const trendingItems = [
  { label: 'Trending', link: '/trending' },
  { label: 'Latest', link: '/latest' },
  { label: 'Notable Releases', link: '/notable-releases' },
  { label: 'Album Reviews', link: '/album-reviews' },
  { label: 'New Songs', link: '/new-songs' }
];

export default function Nav({ }) {
  const { size } = useWindowUtils();

  return (
    <>
      <div className='flex flex-col w-full'>
        <div className='relative px-6 w-full h-[68px] flex flex-row justify-center lg:justify-between items-center'>
          <div className={`${(size === 'small' || size === 'medium') ? 'absolute transform -translate-x-1/2 left-1/2' : 'w-fit'}`}>
            <LogoIcon />
          </div>
          {(size === 'small' || size === 'medium') &&
            <div className='ml-auto cursor-pointer w-fit'>
              <HamburgerIcon />
            </div>
          }
          {/* nav items */}
          <div className='flex-row items-center justify-between hidden gap-[8px] w-[614px] bg-transparent lg:flex px-4'>
            {navItems.map(item => (
              <a href={item.link} key={item.label} className='whitespace-nowrap font-light text-[#363434] transition-all hover:text-[#B94445] cursor-pointer'>
                {item.label}
              </a>
            ))}
          </div>
          {/* right nav items */}
          <div className='flex-row items-center justify-center hidden gap-4 lg:flex'>
            <SearchIcon />
            <Button text='Donate' href='/donate' />
            <Button text='Contact' href='/contact' />
          </div>
        </div>
        {/* bottom nav items */}
        <div className='h-[34px] bg-[#1B1B1B] flex-row justify-center items-center px-6 flex overflow-scroll'>
          <div className='flex flex-row items-center justify-center w-full gap-4 lg:gap-8 lg:justify-start'>
            {trendingItems.map(item => (
              <a key={item.label} href={item.link} className='text-[13px] font-light hover:text-white text-[#c1c1c1] transition-all cursor-pointer whitespace-nowrap'>{item.label}</a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
