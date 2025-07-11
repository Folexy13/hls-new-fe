import React from 'react';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp } from 'lucide-react';

const EarningsPage: React.FC = () => {
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
      <Card className="w-full max-w-md p-8 rounded-2xl shadow-2xl border border-gray-100 bg-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-emerald-100 p-2 rounded-full">
            <TrendingUp className="w-6 h-6 text-emerald-500" />
          </div>
          <span className="text-2xl font-extrabold text-gray-900 tracking-tight">Earnings</span>
        </div>
        <div className="flex flex-wrap items-center justify-between mb-4">
          <span className="font-medium text-lg text-gray-700">Total Earnings</span>
          <span className="font-semibold text-lg text-emerald-600">₦0</span>
        </div>
        <hr className="my-4" />
        <div className="bg-emerald-50 rounded-lg border border-emerald-100 p-4 text-center text-base font-semibold text-emerald-700">
          No earnings yet.
        </div>
      </Card>
    </div>
  );
};

export default EarningsPage;
