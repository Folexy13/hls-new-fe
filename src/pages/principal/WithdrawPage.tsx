import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard } from 'lucide-react';

const WithdrawPage: React.FC = () => {
  const navigate = useNavigate();
  // Demo state: available balance and withdrawals left
  const [availableBalance, setAvailableBalance] = useState(0); // Replace with real value from backend
  const [withdrawalsLeft, setWithdrawalsLeft] = useState(3); // Replace with real value from backend

  const handleWithdraw = () => {
    if (availableBalance > 0 && withdrawalsLeft > 0) {
      // Simulate withdrawal
      setAvailableBalance(0); // Set to new balance after withdrawal
      setWithdrawalsLeft((prev) => prev - 1);
      // Add real withdrawal logic here
    }
  };

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
        {/* Withdrawals left */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-500">Withdrawals left:</span>
          <span className="text-lg font-bold text-emerald-600">{withdrawalsLeft} / 3</span>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-emerald-100 p-2 rounded-full">
            <CreditCard className="w-6 h-6 text-emerald-500" />
          </div>
          <span className="text-2xl font-extrabold text-gray-900 tracking-tight">Withdraw</span>
        </div>
        <div className="flex flex-wrap items-center justify-between mb-4">
          <span className="font-medium text-lg text-gray-700">Available</span>
          <span className="font-semibold text-lg text-emerald-600">₦{availableBalance}</span>
        </div>
        <button
          className={`w-full py-3 mt-2 rounded-lg font-bold text-white transition-colors duration-150 ${availableBalance > 0 && withdrawalsLeft > 0 ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-gray-300 cursor-not-allowed'}`}
          disabled={availableBalance <= 0 || withdrawalsLeft <= 0}
          onClick={handleWithdraw}
        >
          Withdraw Funds
        </button>
        <hr className="my-4" />
        <div className="bg-emerald-50 rounded-lg border border-emerald-100 p-4 text-center text-base font-semibold text-emerald-700">
          Withdrawals will appear here.
        </div>
      </Card>
    </div>
  );
};

export default WithdrawPage;
