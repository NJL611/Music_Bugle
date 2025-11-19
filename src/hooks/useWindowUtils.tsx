'use client'
import { useEffect, useState } from 'react';

const useWindowUtils = () => {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  const [size, setSize] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (windowWidth < 640) {
      setSize('small');
    } else if (windowWidth < 1024) {
      setSize('medium');
    } else {
      setSize('large');
    }
  }, [windowWidth]);

useEffect(() => {
  if (size && !loaded) {
    setLoaded(true);
  }
}, [size, loaded]);

  return { windowWidth, size, loaded };
}

export default useWindowUtils;
