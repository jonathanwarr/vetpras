'use client';

import { useRef, useState } from 'react';
import { PaperClipIcon, CheckCircleIcon } from '@heroicons/react/20/solid';

export default function UploadReceipt({ file, setFile }) {
  const fileInputRef = useRef();
  const [fileName, setFileName] = useState('');

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setFileName(uploadedFile.name);
    }
  };

  return (
    <div className="rounded-md border border-gray-200 bg-white px-4 py-3 shadow-sm">
      <button
        type="button"
        onClick={handleClick}
        className="group inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
      >
        <PaperClipIcon
          className="mr-2 h-5 w-5 text-gray-400 group-hover:text-gray-500"
          aria-hidden="true"
        />
        <span className="italic">{fileName ? 'Change receipt' : 'Attach a receipt'}</span>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      {fileName && (
        <div className="mt-2 flex items-center text-sm text-green-600">
          <CheckCircleIcon className="mr-1 h-4 w-4 text-green-600" />
          <span className="truncate">{fileName}</span>
        </div>
      )}
    </div>
  );
}
