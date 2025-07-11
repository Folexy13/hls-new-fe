import React from 'react';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart } from 'lucide-react';

const PurchasesPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-emerald-50">
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
          <table className="min-w-full text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 font-semibold">Payment Reference</th>
                <th className="py-3 px-4 font-semibold">Pack Name</th>
                <th className="py-3 px-4 font-semibold">Reveal Detail</th>
                <th className="py-3 px-4 font-semibold">Approve Transaction</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={4} className="py-12 text-center text-gray-400">
                  <div className="flex flex-col items-center justify-center">
                    <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mx-auto mb-2 text-gray-200"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7l9 6 9-6" /></svg>
                    <span>No data</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default PurchasesPage;
