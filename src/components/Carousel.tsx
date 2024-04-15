'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react';
import LeftArrowIcon from '../../public/svgs/chevronLeft.js';
import RightArrowIcon from '../../public/svgs/chevronRight.js';
import CircleIcon from '../../public/svgs/CircleIcon.js';

const Carousel: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    interface ImageData {
      image: string;
    }
    
    const imageData: ImageData[] = [
      { image: '/carousel-Images/pexels-elviss-railijs-bitāns-1389429.jpg' },
      { image: '/carousel-Images/pexels-stephen-niemeier-63703.jpg' },
      { image: '/carousel-Images/pexels-suvan-chowdhury-144429.jpg' },
      { image: '/carousel-Images/pexels-vishnu-r-nair-1105666.jpg' },
    ];
    
    const resetTimer = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        intervalRef.current = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % imageData.length);
        }, 3000);
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") { // Ensures the code runs only in the browser
            resetTimer();
            return () => {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }
            };
        }
    }, [resetTimer]);

    const prevSlide = useCallback(() => {
        setCurrentIndex(currentIndex === 0 ? imageData.length - 1 : currentIndex - 1);
        resetTimer()
    }, [currentIndex]);

    const nextSlide = useCallback(() => {
        setCurrentIndex(currentIndex === imageData.length - 1 ? 0 : currentIndex + 1);
        resetTimer()
    }, [currentIndex]);

    const goToSlide = useCallback((index: number) => {
        resetTimer()
        setCurrentIndex(index);
    }, []);

    const indicators = imageData.map((item, index) => (
        <CircleIcon
            key={index}
            className={`mx-1 cursor-pointer ${index === currentIndex ? 'text-blue-500' : 'text-gray-400'}`}
            onClick={() => goToSlide(index)}
        />
    ));

    return (
        <div className='mt-0 w-full h-[549px] bg-[#444444]'>
            <div className='max-w-[1920px] h-[549px] w-full m-auto relative group'>
                <div style={{ backgroundImage: `url(${imageData[currentIndex].image})` }} className="w-full h-full bg-center bg-cover duration-500"></div>
                <div className="absolute left-1/2 bottom-5 transform -translate-x-1/2 flex items-center space-x-2 sm:space-x-4">
                    <div className="p-2 text-white cursor-pointer">
                        <LeftArrowIcon className="text-blue-500 hover:text-blue-700" width={50} height={50} onClick={prevSlide} />
                    </div>
                    {indicators}
                    <div className="p-2 text-white cursor-pointer">
                        <RightArrowIcon className="text-blue-500 hover:text-blue-700" width={50} height={50} onClick={nextSlide} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Carousel;
