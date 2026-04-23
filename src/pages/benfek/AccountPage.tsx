import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { benfekService } from '@/services/benfekService';
import { CreditCard, MapPin, Package2 } from 'lucide-react';

const formatAmount = (amount: number) => `₦${Number(amount || 0).toLocaleString()}`;

const AccountPage: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addressForm, setAddressForm] = useState({
    deliveryAddress: '',
    dropOffAddress: '',
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [profileData, orderData] = await Promise.all([
          benfekService.getProfile(),
          benfekService.getOrders(),
        ]);
        setProfile(profileData);
        setOrders(orderData?.orders || []);
        setAddressForm({
          deliveryAddress: profileData?.deliveryAddress || '',
          dropOffAddress: profileData?.dropOffAddress || '',
        });
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Failed to load account details');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const totalSpent = useMemo(
    () => orders.reduce((sum, order) => sum + Number(order.total || 0), 0),
    [orders]
  );

  const saveAddresses = async () => {
    setSaving(true);
    try {
      const nextProfile = await benfekService.updateProfile(addressForm);
      setProfile(nextProfile);
      toast.success('Address details updated');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update addresses');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-28 pt-6 px-4">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-[28px] bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Account</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Account & Orders</h1>
          <p className="mt-2 text-sm text-slate-500">
            Review your purchase history, keep delivery details current, and manage the account information attached to your orders.
          </p>
        </div>

        <Tabs defaultValue="purchases" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="purchases">Purchases</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
            <TabsTrigger value="details">Account Details</TabsTrigger>
          </TabsList>

          <TabsContent value="purchases">
            <div className="grid gap-4 md:grid-cols-[280px_1fr]">
              <Card className="rounded-[24px] border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5 text-emerald-600" /> Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="rounded-2xl bg-emerald-50 p-4">
                    <p className="text-slate-500">Orders</p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">{orders.length}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-100 p-4">
                    <p className="text-slate-500">Total Spent</p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">{formatAmount(totalSpent)}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[24px] border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Package2 className="h-5 w-5 text-sky-600" /> Purchase History</CardTitle>
                  <CardDescription>Track previous purchases and what was included in each order.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {loading ? (
                    <p className="text-sm text-slate-500">Loading purchases...</p>
                  ) : orders.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
                      No purchases yet. When you pay for a nutrient pack or pharmacy item, it will show here.
                    </div>
                  ) : (
                    orders.map((order) => (
                      <div key={order.id} className="rounded-2xl border border-slate-200 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold text-slate-900">Order #{order.orderNumber}</p>
                            <p className="text-xs text-slate-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{order.status}</Badge>
                            <span className="font-semibold text-emerald-700">{formatAmount(order.total)}</span>
                          </div>
                        </div>
                        <div className="mt-3 space-y-2">
                          {(order.items || []).map((item: any) => (
                            <div key={item.id} className="flex items-center justify-between text-sm">
                              <span className="text-slate-700">{item.productName || item.supplement?.name} x{item.quantity}</span>
                              <span className="font-medium text-slate-900">{formatAmount(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="addresses">
            <Card className="rounded-[24px] border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5 text-rose-500" /> Delivery & Drop-off</CardTitle>
                <CardDescription>Choose the address details customer care and delivery teams should use.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Delivery Address</Label>
                  <Textarea
                    value={addressForm.deliveryAddress}
                    onChange={(e) => setAddressForm((s) => ({ ...s, deliveryAddress: e.target.value }))}
                    placeholder="Enter your preferred delivery address"
                  />
                </div>
                <div>
                  <Label>Drop-off Address</Label>
                  <Textarea
                    value={addressForm.dropOffAddress}
                    onChange={(e) => setAddressForm((s) => ({ ...s, dropOffAddress: e.target.value }))}
                    placeholder="Enter an alternative drop-off address"
                  />
                </div>
                <Button onClick={saveAddresses} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Address Details'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details">
            <Card className="rounded-[24px] border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
                <CardDescription>The key account details currently linked to your Benfek account.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-100 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-500">Email</p>
                  <p className="mt-2 font-semibold text-slate-900">{profile?.email || '—'}</p>
                </div>
                <div className="rounded-2xl bg-slate-100 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-500">WhatsApp</p>
                  <p className="mt-2 font-semibold text-slate-900">{profile?.whatsappNumber || profile?.phone || '—'}</p>
                </div>
                <div className="rounded-2xl bg-slate-100 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-500">Quiz Code</p>
                  <p className="mt-2 font-semibold text-slate-900">{profile?.quizCode?.code || 'Not linked yet'}</p>
                </div>
                <div className="rounded-2xl bg-slate-100 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-500">Principal</p>
                  <p className="mt-2 font-semibold text-slate-900">
                    {profile?.quizCode?.principal ? `${profile.quizCode.principal.firstName} ${profile.quizCode.principal.lastName}` : 'Not linked yet'}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <Label>Quick Note</Label>
                  <Input value="Your account details can be edited from My Profile and your delivery data from the Addresses tab." readOnly />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AccountPage;
