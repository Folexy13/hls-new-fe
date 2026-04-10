import React, { useMemo, useState } from 'react';
import BackToDashboardButton from '@/components/BackToDashboardButton';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useStore } from '@/store/useStore';

const MyProfilePage: React.FC = () => {
  const { user } = useStore();
  const [isLoading] = useState(false);

  const initials = useMemo(() => {
    const name = (user as any)?.name as string | undefined;
    if (!name) return 'DN';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? '' : '';
    return (first + last).toUpperCase() || 'DN';
  }, [user]);

  const defaults = useMemo(() => {
    const u: any = user ?? {};
    return {
      principalName: u.name ?? '',
      profession: u.profession ?? '',
      currentPlaceOfWork: u.currentPlaceOfWork ?? u.workplace ?? '',
      licenseNumber: u.licenseNumber ?? '',
      yearsOfExperience: u.yearsOfExperience ?? '',
    };
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 pb-16 pt-[70px]">
      <BackToDashboardButton className="fixed left-3 top-[70px] z-50 text-black/90 hover:text-black/80" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 sm:py-6">
        <Card>
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">My Profile</h3>
            <p className="mt-1 text-sm text-gray-500">
              Update your personal and professional details.
            </p>
          </div>
          <div className="p-6">
            {isLoading ? (
              <div className="space-y-6">
                <Skeleton className="h-24 w-24 rounded-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <form className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-semibold">
                    {initials}
                  </div>
                  <div>
                    <Button variant="outline" size="sm" type="button">
                      Change Image
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Principal Name
                  </label>
                  <Input
                    defaultValue={defaults.principalName}
                    placeholder="Enter principal name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profession
                  </label>
                  <Input
                    defaultValue={defaults.profession}
                    placeholder="Enter profession"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Place of Work
                  </label>
                  <Input
                    defaultValue={defaults.currentPlaceOfWork}
                    placeholder="Enter current place of work"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    License Number
                  </label>
                  <Input
                    defaultValue={defaults.licenseNumber}
                    placeholder="Enter license number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Years of Experience
                  </label>
                  <Input
                    defaultValue={defaults.yearsOfExperience}
                    placeholder="Enter years of experience"
                  />
                </div>

                <Button type="button">Save Profile</Button>
              </form>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MyProfilePage;
