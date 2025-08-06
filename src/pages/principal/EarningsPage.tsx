import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp } from 'lucide-react';

// Dummy data for demonstration
const earnings = [
  { receiptNumber: 'RCP001', date: '2024-06-01', totalPurchase: 15000, status: 'Completed' },
  { receiptNumber: 'RCP002', date: '2024-06-02', totalPurchase: 8500, status: 'Completed' },
  { receiptNumber: 'RCP003', date: '2024-06-03', totalPurchase: 22000, status: 'Completed' },
  { receiptNumber: 'RCP004', date: '2024-06-04', totalPurchase: 12000, status: 'Pending' },
  { receiptNumber: 'RCP005', date: '2024-06-05', totalPurchase: 18000, status: 'Completed' },
  { receiptNumber: 'RCP006', date: '2024-06-06', totalPurchase: 9500, status: 'Completed' },
  { receiptNumber: 'RCP007', date: '2024-06-07', totalPurchase: 28000, status: 'Completed' },
  { receiptNumber: 'RCP008', date: '2024-06-08', totalPurchase: 13500, status: 'Pending' },
  { receiptNumber: 'RCP009', date: '2024-06-09', totalPurchase: 16500, status: 'Completed' },
  { receiptNumber: 'RCP010', date: '2024-06-10', totalPurchase: 11000, status: 'Completed' },
];

const PAGE_SIZE = 5;

const EarningsPage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  // Filter earnings by receipt number (case-insensitive, partial match)
  const filtered = earnings.filter(e => e.receiptNumber.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  React.useEffect(() => { setPage(1); }, [search]);

  const totalEarnings = earnings.reduce((sum, earning) => sum + earning.totalPurchase, 0);

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
        <div className="mb-2">
          <span className="text-3xl font-extrabold text-gray-900 tracking-tight">Earnings</span>
        </div>
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by receipt number..."
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="bg-gray-50 rounded-lg border border-gray-100 p-6 mb-8">
          <div className="font-semibold text-lg mb-1">Total Earnings</div>
          <div className="text-2xl font-bold text-emerald-700">₦{totalEarnings.toLocaleString()}</div>
        </div>
        <div className="bg-gray-50 rounded-lg border border-gray-100 p-2 mb-6 overflow-x-auto">
          {/* Desktop Table */}
          <table className="min-w-full text-left hidden sm:table">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 font-semibold">Receipt Number</th>
                <th className="py-3 px-4 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={2} className="py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center">
                      <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mx-auto mb-2 text-gray-200"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7l9 6 9-6" /></svg>
                      <span>No data</span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((earning, idx) => (
                  <React.Fragment key={earning.receiptNumber}>
                    <tr
                      className="border-b cursor-pointer hover:bg-emerald-50"
                      onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                    >
                      <td className="py-3 px-4 font-semibold text-gray-900">{earning.receiptNumber}</td>
                      <td className="py-3 px-4 text-gray-700">{earning.date}</td>
                    </tr>
                    {openIndex === idx && (
                      <tr>
                        <td colSpan={2} className="bg-white border-b px-4 pb-4 pt-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-3">
                            <div className="text-sm text-gray-700">
                              <div><span className="font-semibold">Total Purchase:</span> ₦{earning.totalPurchase.toLocaleString()}</div>
                              <div><span className="font-semibold">Status:</span> <span className={`px-2 py-1 rounded text-xs ${earning.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{earning.status}</span></div>
                            </div>
                          </div>
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
            {paginated.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                <div className="flex flex-col items-center justify-center">
                  <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mx-auto mb-2 text-gray-200"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7l9 6 9-6" /></svg>
                  <span>No data</span>
                </div>
              </div>
            ) : (
              paginated.map((earning, idx) => (
                <div key={earning.receiptNumber} className="mb-2 border rounded-lg bg-white">
                  <button
                    className="w-full flex justify-between items-center px-4 py-3 font-semibold text-gray-900 focus:outline-none"
                    onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  >
                    <span>{earning.receiptNumber}</span>
                    <span className="text-sm text-gray-500">{earning.date}</span>
                  </button>
                  {openIndex === idx && (
                    <div className="px-4 pb-3 text-sm text-gray-700">
                      <div><span className="font-semibold">Total Purchase:</span> ₦{earning.totalPurchase.toLocaleString()}</div>
                      <div><span className="font-semibold">Status:</span> <span className={`px-2 py-1 rounded text-xs ${earning.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{earning.status}</span></div>
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

export default EarningsPage;
