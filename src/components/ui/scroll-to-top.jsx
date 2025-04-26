'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronUpIcon } from '@heroicons/react/24/outline';

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
          className="fixed right-6 bottom-6 z-50 rounded-full bg-white p-2 shadow-md ring-1 ring-gray-300 transition hover:bg-gray-50"
          aria-label="Scroll to top"
        >
          <ChevronUpIcon className="h-5 w-5 text-gray-700" />
        </button>
      )}
    </>
  );
}
