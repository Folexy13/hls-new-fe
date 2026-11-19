import { useEffect, useRef, useState } from 'react';
import { RefreshCw, Send, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { apiClient } from '@/config/axios';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

type Kind = 'orders' | 'support' | 'pharmacies' | 'notifications';
type Row = {
  id: number; orderNumber?: string; total?: number; status?: string; subject?: string; message?: string;
  user?: { firstName: string; lastName: string; role?: string; email?: string }; replies?: { id: number; message: string }[];
  pharmacyName?: string; pharmacyPhone?: string; version?: number; kind?: string; attemptCount?: number; lastError?: string;
  providerMessageId?: string; delivery?: { status: string; errorCode?: string; errorMessage?: string; deliveredAt?: string; readAt?: string };
};

export function OperationsPanel() {
  const [kind, setKind] = useState<Kind>('orders');
  const [items, setItems] = useState<Row[]>([]);
  const [cursors, setCursors] = useState([0]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  const [replies, setReplies] = useState<Record<number, string>>({});
  const [resolve, setResolve] = useState<Record<number, boolean>>({});
  const requestIds = useRef<Record<number, { message: string; resolve: boolean; id: string }>>({});
  const after = cursors[cursors.length - 1];

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError(''); setItems([]);
    apiClient.get(`/api/v2/operations/${kind}`, { params: { after }, signal: controller.signal })
      .then(response => { setItems(response.data.data.items); setNextCursor(response.data.data.nextCursor); })
      .catch(err => { if (!controller.signal.aborted) setError(err.response?.data?.message || 'Unable to load operations.'); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [kind, after, revision]);

  const run = async (item: Row, action: () => Promise<unknown>) => {
    setBusy(item.id);
    try { await action(); toast.success('Saved'); setRevision(value => value + 1); }
    catch (err: any) { toast.error(err.response?.data?.message || 'Unable to save. Please retry.'); }
    finally { setBusy(null); }
  };

  return (
    <section className="mx-auto max-w-6xl py-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">Operations</h1>
        <Button size="icon" variant="outline" title="Refresh" aria-label="Refresh operations" disabled={loading || busy !== null}
          onClick={() => setRevision(value => value + 1)}><RefreshCw className="h-4 w-4" /></Button>
      </div>
      <Tabs value={kind} onValueChange={value => { setKind(value as Kind); setCursors([0]); setNextCursor(null); }}>
        <TabsList className="grid h-auto w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="orders" disabled={busy !== null}>Orders</TabsTrigger>
          <TabsTrigger value="support" disabled={busy !== null}>Support</TabsTrigger>
          <TabsTrigger value="pharmacies" disabled={busy !== null}>Pharmacies</TabsTrigger>
          <TabsTrigger value="notifications" disabled={busy !== null}>Notifications</TabsTrigger>
        </TabsList>
      </Tabs>
      {loading && <p role="status" className="py-8 text-sm">Loading...</p>}
      {error && <p role="alert" className="py-8 text-sm text-red-700">{error}</p>}
      {!loading && !error && !items.length && <p className="py-8 text-sm text-gray-500">No records</p>}
      <div className="divide-y">
        {items.map(item => {
          const nextStatus = { paid: 'processing', processing: 'shipped', shipped: 'delivered' }[item.status || ''];
          const statusLabel = { processing: 'Start processing', shipped: 'Dispatch order', delivered: 'Mark delivered' }[nextStatus];
          return <article key={item.id} className="min-w-0 space-y-3 py-5 text-sm">
            {kind === 'orders' && <>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0"><h2 className="break-words font-semibold">Order {item.orderNumber}</h2>
                  <p>{item.user?.firstName} {item.user?.lastName}</p><p>{item.status} | NGN {Number(item.total).toLocaleString()}</p></div>
                <Button disabled={busy !== null || !nextStatus} onClick={() => run(item, () => apiClient.patch(`/api/v2/operations/orders/${item.id}/status`, { status: nextStatus }))}>
                  <ChevronRight className="mr-2 h-4 w-4" />{statusLabel}
                </Button>
              </div>
            </>}
            {kind === 'support' && <>
              <h2 className="break-words font-semibold">#{item.id} {item.subject}</h2>
              {item.user && <p className="break-words text-sm text-slate-600">{item.user.firstName} {item.user.lastName} ({item.user.role}) - {item.user.email}</p>}
              <p className="whitespace-pre-wrap break-words">{item.message}</p>
              {item.replies?.map(reply => <p key={reply.id} className="whitespace-pre-wrap break-words border-l-2 border-emerald-600 pl-3">{reply.message}</p>)}
              <form className="space-y-3" onSubmit={event => {
                event.preventDefault();
                const message = (replies[item.id] || '').trim();
                if (!message) return;
                const previous = requestIds.current[item.id];
                const shouldResolve = Boolean(resolve[item.id]);
                const requestId = previous?.message === message && previous.resolve === shouldResolve ? previous.id : crypto.randomUUID();
                requestIds.current[item.id] = { message, resolve: shouldResolve, id: requestId };
                run(item, async () => {
                  await apiClient.post(`/api/v2/operations/support/${item.id}/replies`, { message, requestId, resolve: Boolean(resolve[item.id]) });
                  setReplies(values => ({ ...values, [item.id]: '' })); delete requestIds.current[item.id];
                });
              }}>
                <Textarea aria-label={`Reply to ticket ${item.id}`} maxLength={5000} required value={replies[item.id] || ''}
                  onChange={event => setReplies(values => ({ ...values, [item.id]: event.target.value }))} disabled={busy !== null} />
                <label className="flex items-center gap-2"><Checkbox disabled={busy !== null} checked={Boolean(resolve[item.id])}
                  onCheckedChange={value => setResolve(values => ({ ...values, [item.id]: value === true }))} />Resolve ticket</label>
                <Button disabled={busy !== null || !(replies[item.id] || '').trim()}><Send className="mr-2 h-4 w-4" />Send reply</Button>
              </form>
            </>}
            {kind === 'pharmacies' && <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0"><h2 className="break-words font-semibold">{item.pharmacyName}</h2><p>{item.pharmacyPhone || 'No pharmacy phone'}</p>
                <p>{item.user?.firstName} {item.user?.lastName}</p></div>
              <Button disabled={busy !== null} onClick={() => {
                if (window.confirm(`Confirm that you have verified ${item.pharmacyName} and have permission to contact this pharmacy about the referral.`))
                  run(item, () => apiClient.post(`/api/v2/operations/pharmacies/${item.id}/accept`, { version: item.version }));
              }}><Check className="mr-2 h-4 w-4" />Accept pharmacy</Button>
            </div>}
            {kind === 'notifications' && <><h2 className="font-semibold">#{item.id} {item.kind?.replace(/_/g, ' ')}</h2>
              <p>Submission: {item.status} | {item.attemptCount} attempts</p>
              {item.status === 'accepted' && <p>WhatsApp: {item.delivery?.status || 'Awaiting delivery update'}</p>}
              {item.delivery?.deliveredAt && <p>Delivered: {new Date(item.delivery.deliveredAt).toLocaleString()}</p>}
              {item.delivery?.readAt && <p>Read: {new Date(item.delivery.readAt).toLocaleString()}</p>}
              {item.providerMessageId && <p className="break-all text-xs text-gray-500">Message: {item.providerMessageId}</p>}
              {(item.lastError || item.delivery?.errorMessage) && <p className="break-words text-red-700">
                {item.lastError || `${item.delivery?.errorCode || ''} ${item.delivery?.errorMessage}`}</p>}</>}
          </article>;
        })}
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="outline" size="icon" title="Previous page" aria-label="Previous page" disabled={loading || busy !== null || cursors.length === 1}
          onClick={() => setCursors(values => values.slice(0, -1))}><ChevronLeft className="h-4 w-4" /></Button>
        <Button variant="outline" size="icon" title="Next page" aria-label="Next page" disabled={loading || busy !== null || nextCursor === null}
          onClick={() => nextCursor !== null && setCursors(values => [...values, nextCursor])}><ChevronRight className="h-4 w-4" /></Button>
      </div>
    </section>
  );
}
