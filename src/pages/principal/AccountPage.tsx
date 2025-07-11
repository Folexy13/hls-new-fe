import React from 'react';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard } from 'lucide-react';

const AccountPage: React.FC = () => {
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
        <div className="flex flex-wrap items-center justify-between mb-6">
          <span className="text-3xl font-extrabold text-gray-900 tracking-tight">Account Transactions</span>
          <span className="font-semibold text-xl text-emerald-700">Account Balance: <span className="font-bold">₦0</span></span>
        </div>
        <div className="bg-gray-50 rounded-lg border border-gray-100 p-2 mb-6 overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 font-semibold">Transaction Reference</th>
                <th className="py-3 px-4 font-semibold">Type</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Amount</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={6} className="py-12 text-center text-gray-400">
                  <div className="flex flex-col items-center justify-center">
                    <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mx-auto mb-2 text-gray-200"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7l9 6 9-6" /></svg>
                    <span>No data</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
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
