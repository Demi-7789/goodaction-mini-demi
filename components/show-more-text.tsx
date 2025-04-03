// components/show-more-text.tsx
'use client';

import { useState } from 'react';

export function ShowMoreText({
  text,
  className = '',
}: {
  text: string;
  className?: string;
}) {
  const [showFullText, setShowFullText] = useState(false);

  if (!text) return null;

  // Find the index of the first full stop
  const firstSentenceEnd = text.indexOf('.') + 1;

  // If text has no full stops or is shorter than first sentence, show full text
  if (firstSentenceEnd === 0 || text.length <= firstSentenceEnd) {
    return <div className={className}>{text}</div>;
  }

  const firstSentence = text.substring(0, firstSentenceEnd);
  const remainingText = " " + text.substring(firstSentenceEnd).trim();

  return (
    <div className={className}>
      {firstSentence}
      {!showFullText ? (
        <>
          <span className="opacity-70">...</span>
          <button
            onClick={() => setShowFullText(true)}
            className="ml-2 text-blue-400 hover:text-blue-300 text-sm"
          >
            Show More
          </button>
        </>
      ) : (
        <>
          {remainingText}
          <button
            onClick={() => setShowFullText(false)}
            className="ml-2 text-blue-400 hover:text-blue-300 text-sm"
          >
            Show Less
          </button>
        </>
      )}
    </div>
  );
}