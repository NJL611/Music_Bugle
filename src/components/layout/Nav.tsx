'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogoIcon, SearchIcon, HamburgerIcon } from '@/components/ui/Icons';
import { Button } from '@/components/ui/Primitives';
import { useWindowUtils } from '@/lib/hooks';
import { NAV_ITEMS, TRENDING_ITEMS } from '@/lib/constants';

export default function Nav({ }) {
  const size = useWindowUtils();
  const isCompact = size === 'small' || size === 'medium';
  const [query, setQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleSearchChange = (e: any) => {
    setQuery(e.target.value);
  };

  const handleSearchSubmit = (e: any) => {
    e.preventDefault();
    router.push(`/search?search=${query}`);
    setIsMenuOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className='flex flex-col w-full relative'>
      <div className='relative px-8 2xl:px-64 w-full h-[68px] flex flex-row justify-center lg:justify-between items-center z-20 bg-white'>
        <div className={`${isCompact ? 'absolute transform -translate-x-1/2 left-1/2' : 'w-fit'}`}>
          <Link href='/' aria-label='Home'>
            <LogoIcon />
          </Link>
        </div>
        {isCompact &&
          <div className='ml-auto cursor-pointer w-fit' onClick={toggleMenu}>
            <HamburgerIcon />
          </div>
        }
        <div className='flex-row items-center justify-between hidden gap-[8px] w-[614px] bg-transparent lg:flex px-4'>
          {NAV_ITEMS.map(item => (
            <a href={item.link} key={item.label} className='whitespace-nowrap font-light text-theme-text transition-all hover:text-theme-red cursor-pointer'>
              {item.label}
            </a>
          ))}
        </div>
        <div className='flex-row items-center justify-center hidden gap-4 lg:flex'>
          <div onClick={toggleSearch} className="cursor-pointer">
            <SearchIcon />
          </div>
          <Button text='Support' href='/support' />
          <Button text='Contact' href='/contact' />
        </div>
      </div>

      {/* Mobile Menu */}
      {isCompact && (
        <div className={`absolute top-[68px] left-0 w-full bg-white z-50 shadow-md flex flex-col items-center py-6 gap-6 border-t border-gray-100 transition-all duration-300 ease-in-out origin-top ${isMenuOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible pointer-events-none'}`}>
          <form onSubmit={handleSearchSubmit} className="flex flex-row items-center relative w-3/4">
            <input
              type="text"
              placeholder="Search"
              value={query}
              onChange={handleSearchChange}
              className="border w-full border-gray-300 bg-white h-10 px-5 rounded-lg text-sm focus:outline-none"
            />
          </form>

          <div className="flex flex-col gap-4 items-center">
            {NAV_ITEMS.map(item => (
              <a
                href={item.link}
                key={item.label}
                className='text-lg font-light text-theme-text hover:text-theme-red'
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-3 w-3/4">
            <Button text='Support' href='/support' className="bg-theme-button text-white w-full" />
            <Button text='Contact' href='/contact' className="bg-theme-button text-white w-full" />
          </div>
        </div>
      )}

      {isSearchVisible && (
        <div className={'px-8 py-2 flex-row items-center justify-center hidden gap-4 lg:flex w-full'}>
          <form onSubmit={handleSearchSubmit} className="flex flex-row items-center relative w-full">
            <input
              type="text"
              placeholder="Search"
              value={query}
              onChange={handleSearchChange}
              className="border w-full border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
            />
          </form>
        </div>
      )}
      <div className='h-[34px] bg-theme-dark flex-row justify-center items-center px-8 2xl:px-64 flex'>
        <div className='flex flex-row items-center justify-center w-full gap-4 lg:gap-8 lg:justify-start'>
          {TRENDING_ITEMS.map(item => (
            <a key={item.label} href={item.link} className='text-[13px] font-light hover:text-white text-[#c1c1c1] transition-all cursor-pointer whitespace-nowrap'>{item.label}</a>
          ))}
        </div>
      </div>
    </div>
  );
}
