import { useId, useRef, useState, type FormEvent } from 'react';
import { Send } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { supportService } from '@/services/supportService';
import { getApiErrorMessage } from '@/utils/apiError';

export function SupportTicketForm({ onCreated }: { onCreated?: () => void | Promise<void> }) {
  const id = useId();
  const submitting = useRef(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ category: '', subject: '', message: '' });

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    setBusy(true);
    try {
      await supportService.createTicket({ category: form.category.trim(), subject: form.subject.trim(), message: form.message.trim() });
      toast.success('Support request submitted successfully');
      setForm({ category: '', subject: '', message: '' });
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to submit support request'));
      return;
    } finally {
      submitting.current = false;
      setBusy(false);
    }
    await onCreated?.();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`${id}-category`}>Category</Label>
        <Input id={`${id}-category`} required maxLength={80} disabled={busy} value={form.category}
          onChange={event => setForm(value => ({ ...value, category: event.target.value }))}
          placeholder="Billing, delivery, account, technical..." />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${id}-subject`}>Subject</Label>
        <Input id={`${id}-subject`} required maxLength={160} disabled={busy} value={form.subject}
          onChange={event => setForm(value => ({ ...value, subject: event.target.value }))} placeholder="Short summary of your issue" />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${id}-message`}>Message</Label>
        <Textarea id={`${id}-message`} required maxLength={5000} rows={6} disabled={busy} value={form.message}
          onChange={event => setForm(value => ({ ...value, message: event.target.value }))} placeholder="Describe the issue in detail" />
      </div>
      <Button type="submit" disabled={busy}>
        {busy ? <LoadingSpinner className="mr-2" /> : <Send className="mr-2 h-4 w-4" />}
        {busy ? 'Submitting...' : 'Submit Complaint'}
      </Button>
    </form>
  );
}
