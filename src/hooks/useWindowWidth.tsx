import { useEffect, useState } from 'react';

const useWindowWidth = () => {
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };

      handleResize();
      window.addEventListener('resize', handleResize);

      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const isSmall = windowWidth < 640;
  const isMedium = windowWidth >= 640 && windowWidth < 1024;
  const isLarge = windowWidth >= 1024;

  return { windowWidth, isSmall, isMedium, isLarge };
}

export default useWindowWidth;