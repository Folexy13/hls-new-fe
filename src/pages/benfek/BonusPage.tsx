import React from 'react';
import { Gift } from 'lucide-react';
import { Card } from '@/components/ui/card';

const BonusPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-4 pt-6 pb-24">
      <div className="mx-auto w-full max-w-xl">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
            <Gift className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Bonus</h1>
            <p className="mt-0.5 text-sm text-slate-500">
              Rewards and benefits available to you.
            </p>
          </div>
        </div>

        <Card className="mt-4">
          <div className="bg-white px-5 py-5 text-sm text-slate-600 leading-6">
            Bonuses will appear here when available.
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BonusPage;

