'use client';
import LogoIcon from '../../public/svgs/LogoIcon'
import SearchIcon from '../../public/svgs/SearchIcon'
import HamburgerIcon from '../../public/svgs/HamburgerIcon'
import useWindowWidth from '@/hooks/useWindowWidth';
import Button from '@/components/Button';


export default function Nav({ }) {
  const { isSmall, isMedium } = useWindowWidth();

  return (
    <>
      <div className='flex flex-col w-full'>
        <div className='relative px-6 w-full h-[68px] flex flex-row justify-center lg:justify-between items-center'>
          {isSmall || isMedium ?
            <div className='w-fit sm:absolute sm:transform sm:-translate-x-1/2 sm:left-1/2'>
              <LogoIcon />
            </div> :
            <div className="w-fit">
              <LogoIcon />
            </div>
          }
          {isMedium &&
            <div className='ml-auto w-fit'>
              <HamburgerIcon />
            </div>
          }
          {/* Nav items */}
          <div className='flex-row items-center justify-between hidden gap-[8px] w-[614px] bg-transparent lg:flex px-4'>
            <span className='whitespace-nowrap font-light text-[#363434] transition-all hover:text-[#B94445] cursor-pointer'>News</span>
            <span className='whitespace-nowrap font-light text-[#363434] transition-all hover:text-[#B94445] cursor-pointer'>Q&A</span>
            <span className='whitespace-nowrap font-light text-[#363434] transition-all hover:text-[#B94445] cursor-pointer'>Songs</span>
            <span className='whitespace-nowrap font-light text-[#363434] transition-all hover:text-[#B94445] cursor-pointer'>Music Videos</span>
            <span className='whitespace-nowrap font-light text-[#363434] transition-all hover:text-[#B94445] cursor-pointer'>Upcoming Releases</span>
            <span className='whitespace-nowrap font-light text-[#363434] transition-all hover:text-[#B94445] cursor-pointer'>Tours</span>
            <span className='whitespace-nowrap font-light text-[#363434] transition-all hover:text-[#B94445] cursor-pointer'>Books</span>
          </div>
          {/* right nav items */}
          <div className='flex-row items-center justify-center hidden gap-4 lg:flex'>
            <SearchIcon />
            <Button text='Donate' href='/donate' />
            <Button text='Contact' href='/contact' />
          </div>
        </div>
        <div className='w-full h-[34px] bg-[#1B1B1B] flex-row justify-center items-center px-6 flex'>
          <div className='flex flex-row items-center justify-center w-full gap-8 lg:justify-start'>
            <span className='text-[13px] font-light hover:text-white text-[#c1c1c1] transition-all cursor-pointer whitespace-nowrap'>Trending</span>
            <span className='text-[13px] font-light hover:text-white text-[#c1c1c1] transition-all cursor-pointer whitespace-nowrap'>Latest</span>
            <span className='text-[13px] font-light hover:text-white text-[#c1c1c1] transition-all cursor-pointer whitespace-nowrap'>Notable Releases</span>
            <span className='text-[13px] font-light hover:text-white text-[#c1c1c1] transition-all cursor-pointer whitespace-nowrap'>Album Reviews</span>
            <span className='text-[13px] font-light hover:text-white text-[#c1c1c1] transition-all cursor-pointer whitespace-nowrap'>New Songs</span>
          </div>
        </div>
        {/* Carousel goes here */}
      </div>
      <div className='mt-0 w-full h-[549px] bg-[#444444]'></div>
    </>
  );
}
