'use client'

import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'

export default function SubmissionConfirm() {
  const [open, setOpen] = useState(true)

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" />

      <div className="fixed inset-0 z-10 flex items-center justify-center p-4 sm:p-0 overflow-y-auto">
        <DialogPanel className="relative w-full max-w-sm transform overflow-hidden rounded-lg bg-white px-6 py-6 text-left shadow-xl transition-all sm:my-8 sm:p-6">
          <div className="flex flex-col items-center text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-green-100">
              <CheckIcon className="size-6 text-green-600" aria-hidden="true" />
            </div>
            <DialogTitle as="h3" className="mt-4 text-base font-semibold text-gray-900">
              Submission successful
            </DialogTitle>
            <p className="mt-2 text-sm text-gray-600">
              Thanks for contributing! Your vet bill has been submitted for review.
            </p>
          </div>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Back to Vet Search
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
