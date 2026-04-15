import React from 'react';
import { useStore } from '@/store/useStore';
import { Card } from '@/components/ui/card';

const MyProfilePage: React.FC = () => {
  const { user } = useStore();

  return (
    <div className="min-h-screen bg-gray-50 px-4 pt-6 pb-24">
      <div className="mx-auto w-full max-w-xl">
        <h1 className="text-xl font-bold text-slate-900">My Profile</h1>
        <p className="mt-1 text-sm text-slate-500">
          Your account details.
        </p>

        <Card className="mt-4 overflow-hidden">
          <div className="border-b bg-white px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Profile
            </p>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {user?.name || 'Benfek'}
            </p>
          </div>

          <div className="bg-white px-5 py-4 space-y-3">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-slate-600">Email</span>
              <span className="text-sm font-semibold text-slate-900 truncate max-w-[60%]">
                {user?.email || '—'}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-slate-600">Role</span>
              <span className="text-sm font-semibold text-slate-900">
                BENFEK
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MyProfilePage;

