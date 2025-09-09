'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

/**
 * ExitIntentModal detects when users move mouse toward browser close area
 * and shows a modal encouraging bill submission.
 */
export default function ExitIntentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    let timeoutId;

    const handleMouseMove = (e) => {
      // Only trigger if modal hasn't been shown yet
      if (hasShown) return;

      // Detect mouse moving toward top of browser (exit intent)
      // Trigger when mouse is within 50px of top and moving upward
      if (e.clientY <= 50 && e.movementY < 0) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setIsOpen(true);
          setHasShown(true);
        }, 100);
      }
    };

    const handleMouseLeave = (e) => {
      // Only trigger if modal hasn't been shown yet
      if (hasShown) return;

      // Detect mouse leaving the document area toward the top
      if (e.clientY <= 0) {
        setIsOpen(true);
        setHasShown(true);
      }
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(timeoutId);
    };
  }, [hasShown]);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="mx-auto max-w-md rounded-xl bg-white p-6 shadow-lg">
          <div className="flex items-start justify-between">
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Was this useful?
            </DialogTitle>
            <button
              onClick={handleClose}
              className="rounded-md p-1 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4">
            <p className="text-gray-700">Help another dog owner by submitting your vet bills</p>
          </div>

          <div className="mt-6 flex gap-3">
            <Link
              href="/submit-bill"
              onClick={handleClose}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
            >
              Submit Bill
            </Link>
            <button
              onClick={handleClose}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
            >
              Maybe Later
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
