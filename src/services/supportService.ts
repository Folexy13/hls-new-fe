import { apiClient } from '@/config/axios';

export type SupportTicketPayload = { category: string; subject: string; message: string };
export type SupportTicket = SupportTicketPayload & {
  id: number;
  status: 'open' | 'resolved';
  createdAt: string;
  replies?: Array<{ id: number; message: string; createdAt: string }>;
};

export const supportService = {
  async getTickets(): Promise<SupportTicket[]> {
    const response = await apiClient.get('/api/v2/support');
    return response.data?.data?.tickets || [];
  },
  async createTicket(payload: SupportTicketPayload): Promise<SupportTicket> {
    const response = await apiClient.post('/api/v2/support', payload);
    return response.data?.data?.ticket;
  },
};
