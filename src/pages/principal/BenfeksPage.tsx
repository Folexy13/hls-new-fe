import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users } from 'lucide-react';

// Dummy data for demonstration
const benfeks = [
  { code: 'BNF001', name: 'John Doe', phone: '08012345678', registered: '2024-06-01' },
  { code: 'BNF002', name: 'Jane Smith', phone: '08087654321', registered: '2024-06-02' },
  { code: 'BNF003', name: 'Alice Johnson', phone: '08011112222', registered: '2024-06-03' },
  { code: 'BNF004', name: 'Bob Williams', phone: '08033334444', registered: '2024-06-04' },
  { code: 'BNF005', name: 'Mary Brown', phone: '08055556666', registered: '2024-06-05' },
  { code: 'BNF006', name: 'James Lee', phone: '08077778888', registered: '2024-06-06' },
  { code: 'BNF007', name: 'Patricia Kim', phone: '08099990000', registered: '2024-06-07' },
  { code: 'BNF008', name: 'Michael Clark', phone: '08022223333', registered: '2024-06-08' },
  { code: 'BNF009', name: 'Linda Scott', phone: '08044445555', registered: '2024-06-09' },
  { code: 'BNF010', name: 'David Evans', phone: '08066667777', registered: '2024-06-10' },
];

const PAGE_SIZE = 5;

const BenfeksPage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  // Filter benfeks by name (case-insensitive, partial match)
  const filtered = benfeks.filter(b => b.name.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset to first page when search changes
  React.useEffect(() => { setPage(1); }, [search]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pb-12 bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <div className="w-full flex justify-center mb-8">
        <button
          onClick={() => navigate('/principal')}
          className="flex items-center gap-2 px-5 py-2 border border-emerald-500 text-emerald-700 bg-white rounded-lg shadow-sm hover:bg-emerald-50 hover:border-emerald-600 transition-colors duration-150"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Back to Dashboard</span>
        </button>
      </div>
      <Card className="w-full max-w-5xl p-8 rounded-2xl shadow-2xl border border-gray-100 bg-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-emerald-100 p-2 rounded-full">
            <Users className="w-6 h-6 text-emerald-500" />
          </div>
          <span className="text-2xl font-extrabold text-gray-900 tracking-tight">Search Benfeks</span>
        </div>
        <p className="mb-4 text-gray-700">Find a Benfek by name.</p>
        <input
          type="text"
          placeholder='Search Benfeks...'
          className='border-2 px-3 py-2 rounded-md w-full mb-6'
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="bg-white rounded-lg border border-gray-100 p-0 overflow-x-auto mb-6">
          {/* Desktop Table */}
          <table className="min-w-full text-left hidden sm:table">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4 font-semibold">Code</th>
                <th className="py-2 px-4 font-semibold">Name</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={2} className="py-8 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center">
                      <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mx-auto mb-2 text-gray-200"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7l9 6 9-6" /></svg>
                      <span>No data</span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((benfek, idx) => (
                  <tr key={benfek.code} className="border-b">
                    <td className="py-2 px-4 font-medium">{benfek.code}</td>
                    <td className="py-2 px-4 font-semibold text-gray-900">{benfek.name}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {/* Mobile Accordion */}
          <div className="sm:hidden">
            {paginated.length === 0 ? (
              <div className="py-8 text-center text-gray-400">
                <div className="flex flex-col items-center justify-center">
                  <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mx-auto mb-2 text-gray-200"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7l9 6 9-6" /></svg>
                  <span>No data</span>
                </div>
              </div>
            ) : (
              paginated.map((benfek, idx) => (
                <div key={benfek.code} className="mb-2 border rounded-lg bg-white">
                  <button
                    className="w-full flex justify-between items-center px-4 py-3 font-semibold text-gray-900 focus:outline-none"
                    onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  >
                    <span>{benfek.code}</span>
                    <span>{benfek.name}</span>
                  </button>
                  {openIndex === idx && (
                    <div className="px-4 pb-3 text-sm text-gray-700">
                      <div><span className="font-semibold">Phone:</span> {benfek.phone}</div>
                      <div><span className="font-semibold">Registered:</span> {benfek.registered}</div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-4">
          <button
            className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded border ${page === i + 1 ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-700 border-gray-300'}`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </Card>
    </div>
  );
};

export default BenfeksPage;
