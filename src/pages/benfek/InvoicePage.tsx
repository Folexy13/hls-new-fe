import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Download, RefreshCw } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { apiClient } from '@/config/axios';
import { Button } from '@/components/ui/button';

type Invoice = {
  id: string; title: string; type: string; customer: string; currency: string;
  total: number; createdAt: string; expiresAt: string;
  items: { name: string; quantity: number; unitPrice: number }[];
};

export default function InvoicePage() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setInvoice(null); setError('');
    apiClient.get(`/api/v2/benfek/invoices/${id}`, { params: { token }, signal: controller.signal })
      .then(response => setInvoice(response.data.data.invoice))
      .catch(err => { if (!controller.signal.aborted) setError(err.response?.data?.message || 'Unable to load invoice'); });
    return () => controller.abort();
  }, [id, token, revision]);

  const download = () => {
    if (!invoice) return;
    const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
    let y = 48;
    const line = (text: string) => {
      const lines: string[] = pdf.splitTextToSize(text, 490);
      for (const textLine of lines) {
        if (y > 780) { pdf.addPage(); y = 48; }
        pdf.text(textLine, 48, y); y += 18;
      }
      y += 6;
    };
    pdf.setFontSize(12);
    line(`HLS ${invoice.type}`); line(invoice.title); line(`Reference: ${invoice.id}`);
    line(`Customer: ${invoice.customer}`); line(`Issued: ${new Date(invoice.createdAt).toLocaleDateString()}`);
    invoice.items.forEach(item => line(`${item.name} | ${item.quantity} x NGN ${item.unitPrice.toLocaleString()} = NGN ${(Math.round(item.unitPrice * 100) * item.quantity / 100).toLocaleString()}`));
    line(`Total: NGN ${invoice.total.toLocaleString()}`);
    pdf.save(`hls-invoice-${invoice.id}.pdf`);
  };

  return <main className="mx-auto max-w-3xl space-y-6 px-4 pb-24 pt-8">
    {error ? <div role="alert" className="space-y-3"><p>{error}</p><Button variant="outline" onClick={() => setRevision(value => value + 1)}><RefreshCw className="mr-2 h-4 w-4" />Retry</Button></div>
      : !invoice ? <p role="status">Loading invoice...</p> : <>
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0"><h1 className="text-2xl font-semibold">HLS {invoice.type}</h1><p className="break-words">{invoice.title}</p></div>
          <Button onClick={download}><Download className="mr-2 h-4 w-4" />Download PDF</Button>
        </header>
        <div className="space-y-1 text-sm"><p className="break-all">Reference: {invoice.id}</p><p>{invoice.customer}</p>
          <p>Issued: {new Date(invoice.createdAt).toLocaleDateString()}</p><p>Link expires: {new Date(invoice.expiresAt).toLocaleDateString()}</p></div>
        <div className="divide-y border-y">
          {invoice.items.map((item, index) => <div key={index} className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 py-4">
            <div className="min-w-0"><p className="break-words font-medium">{item.name}</p><p className="text-sm text-gray-600">{item.quantity} x NGN {item.unitPrice.toLocaleString()}</p></div>
            <p className="text-sm">NGN {(Math.round(item.unitPrice * 100) * item.quantity / 100).toLocaleString()}</p>
          </div>)}
        </div>
        <p className="text-right font-semibold">Total: NGN {invoice.total.toLocaleString()}</p>
      </>}
  </main>;
}
