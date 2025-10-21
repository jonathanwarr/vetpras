'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronUpIcon } from '@heroicons/react/24/solid';

export default function ScrollToTop() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show button after scroll threshold
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };

    // Scroll to top on pathname change
    window.scrollTo({ top: 0, behavior: 'smooth' });

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {visible && (
        <button
          onClick={scrollToTop}
          className="fixed right-6 bottom-6 z-50 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 backdrop-blur-lg p-3 shadow-lg transition hover:from-blue-600 hover:to-blue-700"
          aria-label="Scroll to top"
        >
          <ChevronUpIcon className="h-6 w-6 text-white font-bold" />
        </button>
      )}
    </>
  );
}
