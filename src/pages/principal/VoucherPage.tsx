import React from 'react';
import BackToDashboardButton from '@/components/BackToDashboardButton';
import { Card } from '@/components/ui/card';
import { Gift, Sparkles, Ticket } from 'lucide-react';

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
        <Card className="overflow-hidden border-emerald-100 bg-white">
          <div className="relative isolate flex min-h-[420px] items-center justify-center overflow-hidden px-6 py-12 text-center">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.14),transparent_32%)]" />
            <div className="absolute left-8 top-8 hidden rounded-2xl border border-emerald-100 bg-white/80 p-4 shadow-sm sm:block">
              <Ticket className="h-7 w-7 text-emerald-600" />
            </div>
            <div className="absolute bottom-8 right-8 hidden rounded-2xl border border-blue-100 bg-white/80 p-4 shadow-sm sm:block">
              <Sparkles className="h-7 w-7 text-blue-600" />
            </div>
            <div className="mx-auto max-w-xl">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-600 text-white shadow-lg shadow-emerald-100">
                <Gift className="h-10 w-10" />
              </div>
              <p className="mt-6 text-xs font-bold uppercase tracking-[0.26em] text-emerald-600">
                Coming soon
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Voucher is coming soon
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-base">
                We are preparing a cleaner way to create, share, and track benefit vouchers for your Benfeks.
              </p>
              <div className="mt-8 grid grid-cols-3 gap-3 text-left">
                {['Create', 'Share', 'Track'].map((item) => (
                  <div key={item} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <p className="text-sm font-semibold text-slate-900">{item}</p>
                    <div className="mt-2 h-1.5 rounded-full bg-emerald-200" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default VoucherPage;
