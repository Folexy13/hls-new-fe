import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// Dummy data for demonstration
const transactions = [
  { reference: 'TXN001', amount: 5000, type: 'Credit', status: 'Completed', date: '2024-06-01' },
  { reference: 'TXN002', amount: 2000, type: 'Debit', status: 'Pending', date: '2024-06-02' },
  { reference: 'TXN003', amount: 10000, type: 'Credit', status: 'Completed', date: '2024-06-03' },
  { reference: 'TXN004', amount: 1500, type: 'Debit', status: 'Failed', date: '2024-06-04' },
  { reference: 'TXN005', amount: 3000, type: 'Credit', status: 'Completed', date: '2024-06-05' },
  { reference: 'TXN006', amount: 2500, type: 'Debit', status: 'Completed', date: '2024-06-06' },
  { reference: 'TXN007', amount: 8000, type: 'Credit', status: 'Completed', date: '2024-06-07' },
  { reference: 'TXN008', amount: 1200, type: 'Debit', status: 'Pending', date: '2024-06-08' },
  { reference: 'TXN009', amount: 4000, type: 'Credit', status: 'Completed', date: '2024-06-09' },
  { reference: 'TXN010', amount: 6000, type: 'Debit', status: 'Completed', date: '2024-06-10' },
];

const PAGE_SIZE = 5;

const AccountPage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(transactions.length / PAGE_SIZE);
  const paginated = transactions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Responsive: show accordion on mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
        <div className="flex flex-wrap items-center justify-between mb-6">
          <span className="text-3xl font-extrabold text-gray-900 tracking-tight">Account Transactions</span>
          <span className="font-semibold text-xl text-emerald-700">Account Balance: <span className="font-bold">₦0</span></span>
        </div>
        {/* Table for desktop, accordion for mobile */}
        <div className="bg-gray-50 rounded-lg border border-gray-100 p-2 mb-6 overflow-x-auto">
          {/* Desktop Table */}
          <table className="min-w-full text-left hidden sm:table">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 font-semibold">Transaction Reference</th>
                <th className="py-3 px-4 font-semibold">Amount</th>
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
                paginated.map((txn, idx) => (
                  <tr key={txn.reference} className="border-b">
                    <td className="py-3 px-4 font-medium">{txn.reference}</td>
                    <td className="py-3 px-4 font-semibold text-emerald-700">₦{txn.amount.toLocaleString()}</td>
                  </tr>
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
              paginated.map((txn, idx) => (
                <div key={txn.reference} className="mb-2 border rounded-lg bg-white">
                  <button
                    className="w-full flex justify-between items-center px-4 py-3 font-semibold text-gray-900 focus:outline-none"
                    onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  >
                    <span>{txn.reference}</span>
                    <span>₦{txn.amount.toLocaleString()}</span>
                  </button>
                  {openIndex === idx && (
                    <div className="px-4 pb-3 text-sm text-gray-700">
                      <div><span className="font-semibold">Type:</span> {txn.type}</div>
                      <div><span className="font-semibold">Status:</span> {txn.status}</div>
                      <div><span className="font-semibold">Date:</span> {txn.date}</div>
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
        <div className="mt-4">
          <div className="bg-emerald-50 rounded-lg border border-emerald-100 p-4 text-base font-semibold text-emerald-700 inline-block">
            Egazu Points: <span className="bg-emerald-200 text-emerald-900 px-3 py-1 rounded-full font-bold text-sm">Free Trial (31 days validity)</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AccountPage;
