'use client';

import { useState, useEffect, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import type { ActivityId } from '@/lib/types/student';

export interface EvidenceUploadProps extends HTMLAttributes<HTMLDivElement> {
  activityId: ActivityId;
  onUpload: (file: File) => void;
}

type EvidenceType = 'photo' | 'voice' | 'file' | 'note';

const icons = {
  camera: (
    <svg data-testid="icon-camera" className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  microphone: (
    <svg data-testid="icon-microphone" className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  ),
  document: (
    <svg data-testid="icon-document" className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  pencil: (
    <svg data-testid="icon-pencil" className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
};

const uploadOptions: { type: EvidenceType; label: string; icon: keyof typeof icons }[] = [
  { type: 'photo', label: 'Photo', icon: 'camera' },
  { type: 'voice', label: 'Voice', icon: 'microphone' },
  { type: 'file', label: 'File', icon: 'document' },
  { type: 'note', label: 'Note', icon: 'pencil' },
];

export function EvidenceUpload({
  activityId,
  onUpload,
  className,
  ...props
}: EvidenceUploadProps) {
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleClick = (_type: EvidenceType) => {
    // Mocked - show coming soon toast
    setShowToast(true);
  };

  return (
    <div
      className={cn('grid grid-cols-2 gap-3', className)}
      {...props}
    >
      {uploadOptions.map(({ type, label, icon }) => (
        <button
          key={type}
          type="button"
          data-testid={`upload-${type}`}
          onClick={() => handleClick(type)}
          aria-label={`Add ${label.toLowerCase()}`}
          className={cn(
            'flex flex-col items-center justify-center gap-2',
            'min-w-[88px] min-h-[88px] p-4',
            'bg-white border border-border-default rounded-lg',
            'hover:bg-gray-50 hover:border-gray-300',
            'transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-gatsby focus:ring-offset-2'
          )}
        >
          <span className="text-text-secondary">{icons[icon]}</span>
          <span className="text-sm font-medium text-text-primary">{label}</span>
        </button>
      ))}

      {/* Toast notification */}
      {showToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 px-4 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-50">
          Coming soon
        </div>
      )}
    </div>
  );
}
