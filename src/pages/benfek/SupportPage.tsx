import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SupportTicketForm } from '@/components/SupportTicketForm';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { supportService, type SupportTicket } from '@/services/supportService';
import { getApiErrorMessage } from '@/utils/apiError';
import { useStore } from '@/store/useStore';

const SupportPage = () => {
  const role = useStore(state => state.user?.role);
  const dashboard = role === 'principal' ? '/principal' : role === 'wholesaler' ? '/wholesaler' : '/benfek/dashboard';
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') === 'history' ? 'history' : 'complaints';
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadTickets() {
    setLoading(true);
    setError('');
    try { setTickets(await supportService.getTickets()); }
    catch (error) { setError(getApiErrorMessage(error, 'Failed to load support requests')); }
    finally { setLoading(false); }
  }

  useEffect(() => { void loadTickets(); }, []);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Support</h1>
        <Button asChild variant="outline" size="sm"><Link to={dashboard}><ArrowLeft className="mr-2 h-4 w-4" />Dashboard</Link></Button>
      </div>
      <Tabs value={tab} onValueChange={value => setParams({ tab: value })}>
        <TabsList className="mb-6 grid w-full grid-cols-2">
          <TabsTrigger value="complaints">Complaints</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="complaints">
          <SupportTicketForm onCreated={async () => { setParams({ tab: 'history' }); await loadTickets(); }} />
        </TabsContent>
        <TabsContent value="history" className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Previous Requests</h2>
            <Button variant="outline" size="sm" disabled={loading} onClick={() => void loadTickets()}>
              <RefreshCw className="mr-2 h-4 w-4" />Refresh
            </Button>
          </div>
          {loading ? <div role="status" className="flex items-center gap-2 py-6"><LoadingSpinner />Loading requests...</div>
            : error ? <p role="alert" className="py-6 text-sm text-red-700">{error}</p>
            : tickets.length === 0 ? <p className="py-6 text-sm text-slate-500">No support requests yet.</p>
            : tickets.map(ticket => (
              <article key={ticket.id} className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0 flex-1"><h3 className="break-words font-semibold">{ticket.subject}</h3>
                    <p className="break-words text-xs text-slate-500">{ticket.category}</p></div>
                  <Badge variant="outline">{ticket.status}</Badge>
                </div>
                <p className="whitespace-pre-wrap break-words text-sm">{ticket.message}</p>
                {ticket.replies?.map(reply => (
                  <div key={reply.id} className="border-l-2 border-emerald-600 pl-3 text-sm">
                    <p className="font-medium">HLS Support</p>
                    <p className="whitespace-pre-wrap break-words">{reply.message}</p>
                    <p className="mt-1 text-xs text-slate-500">{new Date(reply.createdAt).toLocaleString()}</p>
                  </div>
                ))}
                <p className="text-xs text-slate-500">{new Date(ticket.createdAt).toLocaleString()}</p>
              </article>
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupportPage;
