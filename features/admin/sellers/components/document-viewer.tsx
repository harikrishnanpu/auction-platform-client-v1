'use client';

import React, { useState } from 'react';
import { X, ZoomIn, Eye, Download, Image as ImageIcon } from 'lucide-react';

interface DocumentViewerProps {
  src: string;
  alt: string;
  label: string;
}

export function DocumentViewer({ src, alt, label }: DocumentViewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <>
      <div className="group relative border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900 transition-all hover:shadow-md">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-xs font-medium text-white shadow-sm">{label}</p>
        </div>

        {/* Thumbnail */}
        <div
          className="relative aspect-video cursor-pointer overflow-hidden flex items-center justify-center bg-slate-100 dark:bg-slate-800"
          onClick={toggleOpen}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          )}
          {hasError ? (
            <div className="flex flex-col items-center justify-center text-slate-400 p-4">
              <ImageIcon size={32} className="mb-2 opacity-50" />
              <span className="text-xs">Failed to load image</span>
            </div>
          ) : (
            <img
              src={src}
              alt={alt}
              className={`w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setHasError(true);
              }}
            />
          )}

          {/* Hover Overlay */}
          {!hasError && !isLoading && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <button className="bg-white/90 dark:bg-slate-800/90 text-slate-900 dark:text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                <ZoomIn size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex justify-between items-center bg-opacity-100 dark:bg-opacity-100">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400 truncate max-w-[150px]">
            {label}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(src, '_blank');
            }}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <Download size={12} /> Save
          </button>
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={toggleOpen}
        >
          <button
            onClick={toggleOpen}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50"
          >
            <X size={24} />
          </button>

          <div
            className="relative max-w-[90vw] max-h-[90vh] w-full h-full flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={src}
              alt={alt}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md">
              {label}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
