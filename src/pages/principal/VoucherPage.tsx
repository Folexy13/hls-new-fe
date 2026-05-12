import React from 'react';
import BackToDashboardButton from '@/components/BackToDashboardButton';
import { Card } from '@/components/ui/card';

const VoucherPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-16 pt-[70px]">
      <div className="fixed left-0 right-0 top-[64px] z-30 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-3 space-y-3">
          <BackToDashboardButton className="text-black/90 hover:text-black/80" />
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Voucher</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-1 pb-3">
        <Card className="overflow-hidden">
          <div className="p-6 bg-white border-b">
            <h3 className="text-lg font-semibold text-gray-900">Voucher Management</h3>
          </div>
          <div className="p-6 text-center text-gray-700 text-xl font-medium">
            Voucher is coming soon!
          </div>
        </Card>
      </div>
    </div>
  );
};

export default VoucherPage;