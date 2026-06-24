'use client';

import { useState } from 'react';
import type { HadithItem } from '@/lib/hadith/types/hadith.types';

interface HadithActionsProps {
  hadith: HadithItem;
}

export default function HadithActions({ hadith }: HadithActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = `${hadith.hadithEnglish}\n\n— ${hadith.book.bookName}, Hadith ${hadith.hadithNumber}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `Hadith ${hadith.hadithNumber} — ${hadith.book.bookName}`,
        text: hadith.hadithEnglish.slice(0, 200),
        url: window.location.href,
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleCopy}
        aria-label="Copy hadith"
        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        {copied ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
          </svg>
        )}
      </button>

      {typeof navigator !== 'undefined' && 'share' in navigator && (
        <button
          onClick={handleShare}
          aria-label="Share hadith"
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
          </svg>
        </button>
      )}
    </div>
  );
}
