import React from 'react';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PurchasesPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 overflow-hidden">
      <button
        onClick={() => navigate('/principal')}
        className="mr-auto flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded mb-6 hover:bg-emerald-600"      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>
      <Card className="w-full max-w-md p-6 shadow-lg">
        <div className="flex flex-wrap items-center justify-between mb-2">
          <span className="font-bold text-base">Purchases</span>
          <span className="font-medium text-base">
            Total:{' '}
            <span className="font-bold">0</span>
          </span>
        </div>
        <hr className="my-2" />
        <div className="bg-gray-50 rounded border p-3 text-center text-sm font-medium">
          No purchases yet.
        </div>
      </Card>
    </div>
  );
};

export default PurchasesPage;
