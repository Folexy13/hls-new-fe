import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveTableProps<T> {
  data: T[];
  columns: {
    key: string;
    label: string;
    render?: (item: T, index: number) => React.ReactNode;
  }[];
  onRowClick?: (item: T, index: number) => void;
  openIndex: number | null;
  setOpenIndex: (index: number | null) => void;
  expandableContent?: (item: T, index: number) => React.ReactNode;
  emptyMessage?: string;
  className?: string;
}

export function ResponsiveTable<T>({
  data,
  columns,
  onRowClick,
  openIndex,
  setOpenIndex,
  expandableContent,
  emptyMessage = "No data",
  className
}: ResponsiveTableProps<T>) {
  const handleRowClick = (item: T, index: number) => {
    if (onRowClick) {
      onRowClick(item, index);
    } else {
      setOpenIndex(openIndex === index ? null : index);
    }
  };

  const EmptyState = () => (
    <div className="py-12 text-center text-gray-400">
      <div className="flex flex-col items-center justify-center">
        <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mx-auto mb-2 text-gray-200">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7l9 6 9-6" />
        </svg>
        <span>{emptyMessage}</span>
      </div>
    </div>
  );

  return (
    <div className={cn("bg-gray-50 rounded-lg border border-gray-100 p-2 overflow-x-auto", className)}>
      {/* Desktop Table */}
      <table className="min-w-full text-left hidden sm:table">
        <thead>
          <tr className="bg-gray-100">
            {columns.map((column) => (
              <th key={column.key} className="py-3 px-4 font-semibold">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-12 text-center text-gray-400">
                <EmptyState />
              </td>
            </tr>
          ) : (
            data.map((item, idx) => (
              <React.Fragment key={idx}>
                <tr
                  className="border-b cursor-pointer hover:bg-emerald-50"
                  onClick={() => handleRowClick(item, idx)}
                >
                  {columns.map((column) => (
                    <td key={column.key} className="py-3 px-4">
                      {column.render ? column.render(item, idx) : (item as any)[column.key]}
                    </td>
                  ))}
                </tr>
                {openIndex === idx && expandableContent && (
                  <tr>
                    <td colSpan={columns.length} className="bg-white border-b px-4 pb-4 pt-0">
                      {expandableContent(item, idx)}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          )}
        </tbody>
      </table>

      {/* Mobile Accordion */}
      <div className="sm:hidden">
        {data.length === 0 ? (
          <EmptyState />
        ) : (
          data.map((item, idx) => (
            <div key={idx} className="mb-2 border rounded-lg bg-white">
              <button
                className="w-full flex justify-between items-center px-4 py-3 font-semibold text-gray-900 focus:outline-none"
                onClick={() => handleRowClick(item, idx)}
              >
                {columns.map((column, colIdx) => (
                  <span key={column.key} className={colIdx === 0 ? "" : "text-sm text-gray-500"}>
                    {column.render ? column.render(item, idx) : (item as any)[column.key]}
                  </span>
                ))}
              </button>
              {openIndex === idx && expandableContent && (
                <div className="px-4 pb-3 text-sm text-gray-700">
                  {expandableContent(item, idx)}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
} 