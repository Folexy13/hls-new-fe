import React from 'react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className={cn("flex justify-center gap-2 mt-4", className)}>
      <button
        className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 disabled:opacity-50 hover:bg-gray-50 transition-colors"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        Previous
      </button>
      
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          className={cn(
            "px-3 py-1 rounded border transition-colors",
            currentPage === i + 1 
              ? "bg-emerald-600 text-white border-emerald-600" 
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          )}
          onClick={() => onPageChange(i + 1)}
          aria-label={`Page ${i + 1}`}
          aria-current={currentPage === i + 1 ? "page" : undefined}
        >
          {i + 1}
        </button>
      ))}
      
      <button
        className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 disabled:opacity-50 hover:bg-gray-50 transition-colors"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );
} 