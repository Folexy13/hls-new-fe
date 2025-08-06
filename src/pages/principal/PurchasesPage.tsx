import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart } from 'lucide-react';

// Dummy data for demonstration
const PURCHASES = [
  { reference: 'PAY001', pack: 'Starter Pack', detail: 'Details for Starter Pack', approved: true },
  { reference: 'PAY002', pack: 'Wellness Pack', detail: 'Details for Wellness Pack', approved: false },
  { reference: 'PAY003', pack: 'Family Pack', detail: 'Details for Family Pack', approved: true },
  { reference: 'PAY004', pack: 'Premium Pack', detail: 'Details for Premium Pack', approved: false },
  { reference: 'PAY005', pack: 'Kids Pack', detail: 'Details for Kids Pack', approved: true },
];
const PAGE_SIZE = 5;

const PurchasesPage: React.FC = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(PURCHASES.length / PAGE_SIZE);
  const paginated = PURCHASES.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
          <span className="text-3xl font-extrabold text-gray-900 tracking-tight">Purchases</span>
        </div>
        <div className="mb-6 text-gray-600 text-base">View your Benfek receipts below.</div>
        <div className="bg-gray-50 rounded-lg border border-gray-100 p-2 mb-6 overflow-x-auto">
          {/* Desktop Table */}
          <table className="min-w-full text-left hidden sm:table">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 font-semibold">Payment Reference</th>
                <th className="py-3 px-4 font-semibold">Pack Name</th>
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
                paginated.map((purchase, idx) => (
                  <React.Fragment key={purchase.reference + idx}>
                    <tr
                      className="border-b cursor-pointer hover:bg-emerald-50"
                      onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                    >
                      <td className="py-3 px-4 font-semibold text-gray-900">{purchase.reference}</td>
                      <td className="py-3 px-4">{purchase.pack}</td>
                    </tr>
                    {openIndex === idx && (
                      <tr>
                        <td colSpan={2} className="bg-white border-b px-4 pb-4 pt-0">
                          <div className="py-3 text-sm text-gray-700">
                            <div><span className="font-semibold">Detail:</span> {purchase.detail}</div>
                            <div><span className="font-semibold">Approved:</span> {purchase.approved ? 'Yes' : 'No'}</div>
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
              paginated.map((purchase, idx) => (
                <div key={purchase.reference + idx} className="mb-2 border rounded-lg bg-white">
                  <button
                    className="w-full flex justify-between items-center px-4 py-3 font-semibold text-gray-900 focus:outline-none"
                    onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  >
                    <span>{purchase.reference}</span>
                    <span>{purchase.pack}</span>
                  </button>
                  {openIndex === idx && (
                    <div className="px-4 pb-3 text-sm text-gray-700">
                      <div><span className="font-semibold">Detail:</span> {purchase.detail}</div>
                      <div><span className="font-semibold">Approved:</span> {purchase.approved ? 'Yes' : 'No'}</div>
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

export default PurchasesPage;
