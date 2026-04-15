import React, { useMemo, useState } from 'react';
import BackToDashboardButton from '@/components/BackToDashboardButton';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useStore } from '@/store/useStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Bell, CreditCard, Lock, User } from 'lucide-react';

type MyProfilePageProps = {
  defaultTab?: 'profile' | 'settings';
};

const MyProfilePage: React.FC<MyProfilePageProps> = ({ defaultTab = 'profile' }) => {
  const { user } = useStore();
  const [isLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>(defaultTab);

  const initials = useMemo(() => {
    const name = (user as any)?.name as string | undefined;
    if (!name) return 'DN';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? '' : '';
    return (first + last).toUpperCase() || 'DN';
  }, [user]);

  const principalNameParts = useMemo(() => {
    const name = String((user as any)?.name ?? '').trim();
    const parts = name ? name.split(/\s+/).filter(Boolean) : [];
    const firstName = parts[0] ?? '';
    const lastName = parts.length > 1 ? parts[parts.length - 1] ?? '' : '';
    return { firstName, lastName, fullName: name };
  }, [user]);

  const principalEmail = useMemo(() => String((user as any)?.email ?? ''), [user]);
  const principalPhone = useMemo(() => String((user as any)?.phone ?? ''), [user]);

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
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        {/* Fixed Header (Back + Tabs) */}
        <div className="fixed left-0 right-0 top-[64px] z-30 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-3 space-y-3">
            <BackToDashboardButton className="text-black/90 hover:text-black/80" />
            <TabsList className="grid grid-cols-2 w-full max-w-2xl mx-auto">
              <TabsTrigger value="profile">My Profile</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 sm:py-6 pt-8">
          <TabsContent value="profile">
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
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Account Settings</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your profile, security, notifications, and support.
                </p>
              </div>
              <div className="p-6">
                <Accordion type="single" collapsible className="space-y-2">
                  <AccordionItem value="personal" className="border rounded-lg px-4">
                    <AccordionTrigger className="py-4">
                      <div className="flex items-center gap-3 text-left">
                        <User className="h-5 w-5" />
                        <span>Personal Information</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      {isLoading ? (
                        <div className="space-y-4">
                          <Skeleton className="h-10 w-full" />
                          <Skeleton className="h-10 w-full" />
                          <Skeleton className="h-10 w-full" />
                        </div>
                      ) : (
                        <form className="space-y-4">
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                First Name
                              </label>
                              <Input id="firstName" defaultValue={principalNameParts.firstName} />
                            </div>
                            <div>
                              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                Last Name
                              </label>
                              <Input id="lastName" defaultValue={principalNameParts.lastName} />
                            </div>
                          </div>
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                              Email Address
                            </label>
                            <Input id="email" type="email" defaultValue={principalEmail} />
                          </div>
                          <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                              Phone Number
                            </label>
                            <Input id="phone" defaultValue={principalPhone} placeholder="Add phone number" />
                          </div>
                          <Button type="button">Save Changes</Button>
                        </form>
                      )}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="payments" className="border rounded-lg px-4">
                    <AccordionTrigger className="py-4">
                      <div className="flex items-center gap-3 text-left">
                        <CreditCard className="h-5 w-5" />
                        <span>Payment Methods</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between rounded-md border p-3 bg-gray-50">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Primary payout account</p>
                            <p className="text-xs text-gray-500">Connect the account you want withdrawals paid into.</p>
                          </div>
                          <Button variant="outline" size="sm" type="button">Change</Button>
                        </div>
                        <Button variant="outline" type="button">Add new bank account</Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="security" className="border rounded-lg px-4">
                    <AccordionTrigger className="py-4">
                      <div className="flex items-center gap-3 text-left">
                        <Lock className="h-5 w-5" />
                        <span>Security</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <form className="space-y-4">
                        <div>
                          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Current Password
                          </label>
                          <Input id="currentPassword" type="password" placeholder="Enter current password" />
                        </div>
                        <div>
                          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                          </label>
                          <Input id="newPassword" type="password" placeholder="Enter new password" />
                        </div>
                        <div>
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm New Password
                          </label>
                          <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
                        </div>
                        <Button type="button">Update Password</Button>
                      </form>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="notifications" className="border rounded-lg px-4">
                    <AccordionTrigger className="py-4">
                      <div className="flex items-center gap-3 text-left">
                        <Bell className="h-5 w-5" />
                        <span>Notifications</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 text-sm text-gray-700">
                          <span className="h-2 w-2 rounded-full bg-red-500" />
                          <input type="checkbox" defaultChecked className="h-4 w-4" />
                          Email updates and reports
                        </label>
                        <label className="flex items-center gap-3 text-sm text-gray-700">
                          <span className="h-2 w-2 rounded-full bg-red-500" />
                          <input type="checkbox" defaultChecked className="h-4 w-4" />
                          Benfek registration alerts
                        </label>
                        <label className="flex items-center gap-3 text-sm text-gray-700">
                          <span className="h-2 w-2 rounded-full bg-red-500" />
                          <input type="checkbox" className="h-4 w-4" />
                          Product and order notifications
                        </label>
                        <Button type="button">Save Notification Preferences</Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="complaints" className="border rounded-lg px-4">
                    <AccordionTrigger className="py-4">
                      <div className="flex items-center gap-3 text-left">
                        <AlertTriangle className="h-5 w-5" />
                        <span>Make Complaints</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <form className="space-y-4">
                        <div>
                          <label htmlFor="complaintSubject" className="block text-sm font-medium text-gray-700 mb-1">
                            Subject
                          </label>
                          <Input id="complaintSubject" placeholder="Short summary" />
                        </div>
                        <div>
                          <label htmlFor="complaintMessage" className="block text-sm font-medium text-gray-700 mb-1">
                            Message
                          </label>
                          <Textarea id="complaintMessage" placeholder="Describe the issue..." />
                        </div>
                        <Button variant="outline" type="button">Submit Complaint</Button>
                      </form>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default MyProfilePage;
