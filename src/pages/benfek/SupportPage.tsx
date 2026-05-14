import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { benfekService } from '@/services/benfekService';
import { LifeBuoy, MessageSquareMore, PhoneCall, ShieldAlert } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const SupportPage = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    subject: '',
    message: '',
  });

  const loadTickets = async () => {
    try {
      const result = await benfekService.getSupportTickets();
      setTickets(result);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to load support requests');
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await benfekService.createSupportTicket(formData);
      toast.success('Support request submitted successfully');
      setFormData({ category: '', subject: '', message: '' });
      await loadTickets();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to submit support request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-28 pt-6 px-4">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-[28px] bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-800 p-6 text-white shadow-xl">
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">Support</p>
          <h1 className="mt-2 text-3xl font-bold">Support & Customer Care</h1>
          <p className="mt-2 max-w-2xl text-sm text-white/80">
            Raise complaints, follow your previous requests, or reach the customer care team quickly.
          </p>
        </div>

        <Tabs defaultValue="complaints" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="complaints">Complaints</TabsTrigger>
            <TabsTrigger value="chat">Chat / Care</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="complaints">
            <Card className="rounded-[24px] border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><ShieldAlert className="h-5 w-5 text-rose-500" /> Make a Complaint</CardTitle>
                <CardDescription>Tell us what went wrong and our team will respond.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label>Category</Label>
                    <Input
                      value={formData.category}
                      onChange={(e) => setFormData((s) => ({ ...s, category: e.target.value }))}
                      placeholder="Billing, delivery, account, technical..."
                    />
                  </div>
                  <div>
                    <Label>Subject</Label>
                    <Input
                      value={formData.subject}
                      onChange={(e) => setFormData((s) => ({ ...s, subject: e.target.value }))}
                      placeholder="Short summary of your issue"
                    />
                  </div>
                  <div>
                    <Label>Message</Label>
                    <Textarea
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData((s) => ({ ...s, message: e.target.value }))}
                      placeholder="Describe the issue in detail"
                    />
                  </div>
                  <Button type="submit" disabled={submitting}>
                    {submitting && <LoadingSpinner className="mr-2" />}
                    {submitting ? 'Submitting...' : 'Submit Complaint'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="rounded-[24px] border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><MessageSquareMore className="h-5 w-5 text-emerald-600" /> Chat With Customer Care</CardTitle>
                  <CardDescription>Use the fastest support channels when you need direct help.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-2xl bg-emerald-50 p-4">
                    <p className="font-medium text-slate-900">WhatsApp Care</p>
                    <p className="mt-1 text-sm text-slate-600">Tap through to continue the conversation with customer care.</p>
                    <a
                      href="https://wa.me/2340000000000"
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Open WhatsApp Chat
                    </a>
                  </div>
                  <div className="rounded-2xl bg-slate-100 p-4">
                    <p className="font-medium text-slate-900">Email Care</p>
                    <p className="mt-1 text-sm text-slate-600">support@hls.com</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[24px] border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><PhoneCall className="h-5 w-5 text-sky-600" /> Fast Help</CardTitle>
                  <CardDescription>Useful channels for urgent follow-up.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-slate-600">
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <p className="font-medium text-slate-900">Support Hours</p>
                    <p className="mt-1">Monday - Friday, 9:00 AM to 6:00 PM</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <p className="font-medium text-slate-900">Emergency Guidance</p>
                    <p className="mt-1">
                      If this is a medical emergency, please contact your doctor or emergency services immediately.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card className="rounded-[24px] border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><LifeBuoy className="h-5 w-5 text-amber-500" /> Previous Requests</CardTitle>
                <CardDescription>Track complaints and support requests you have already submitted.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {tickets.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
                    No support requests yet.
                  </div>
                ) : (
                  tickets.map((ticket) => (
                    <div key={ticket.id} className="rounded-2xl border border-slate-200 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900">{ticket.subject}</p>
                          <p className="text-xs text-slate-500">{ticket.category}</p>
                        </div>
                        <Badge variant="outline">{ticket.status}</Badge>
                      </div>
                      <p className="mt-3 text-sm text-slate-600">{ticket.message}</p>
                      <p className="mt-3 text-xs text-slate-400">
                        {new Date(ticket.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SupportPage;
