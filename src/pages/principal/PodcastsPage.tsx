import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mic, Plus } from 'lucide-react';

const INITIAL_PODCASTS = [
  { title: 'Health Matters', host: 'Dr. John Doe', date: '2024-06-01', description: 'A podcast about health tips.' },
  { title: 'Wellness Weekly', host: 'Jane Smith', date: '2024-06-05', description: 'Weekly wellness advice.' },
  { title: 'Nutrition Now', host: 'Alice Johnson', date: '2024-06-10', description: 'Nutrition and diet discussions.' },
  { title: 'Fitness Focus', host: 'Bob Williams', date: '2024-06-15', description: 'Fitness and exercise.' },
  { title: 'Mental Health Hour', host: 'Mary Brown', date: '2024-06-20', description: 'Mental health awareness.' },
];
const PAGE_SIZE = 5;
const EMPTY_FORM = { title: '', host: '', date: '', description: '' };

const PodcastsPage: React.FC = () => {
  const navigate = useNavigate();
  const [podcasts, setPodcasts] = useState(INITIAL_PODCASTS);
  const [search, setSearch] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  // Filter podcasts by title (case-insensitive, partial match)
  const filtered = podcasts.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  React.useEffect(() => { setPage(1); }, [search]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setPodcasts(prev => [{ ...form }, ...prev]);
    setShowModal(false);
    setForm(EMPTY_FORM);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pb-12 bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <div className="w-full flex justify-center mb-8">
        <button
          onClick={() => navigate('/principal')}
          className="flex items-center gap-2 px-5 py-2 border border-emerald-500 text-emerald-700 bg-white rounded-lg shadow-sm hover:bg-emerald-50 hover:border-emerald-600 transition-colors duration-150"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Back to Dashboard</span>
        </button>
      </div>
      <Card className="w-full max-w-5xl p-8 rounded-2xl shadow-2xl border border-gray-100 bg-white">
        <div className="mb-2">
          <span className="text-3xl font-extrabold text-gray-900 tracking-tight">Podcasts</span>
        </div>
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search podcasts..."
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="bg-gray-50 rounded-lg border border-gray-100 p-2 mb-6 overflow-x-auto">
          {/* Desktop Table */}
          <table className="min-w-full text-left hidden sm:table">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 font-semibold">Title</th>
                <th className="py-3 px-4 font-semibold">Host</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={2} className="py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center">
                      <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mx-auto mb-2 text-gray-200"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7l9 6 9-6" /></svg>
                      <span>No podcasts found.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((pod, idx) => (
                  <React.Fragment key={pod.title + idx}>
                    <tr
                      className="border-b cursor-pointer hover:bg-emerald-50"
                      onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                    >
                      <td className="py-3 px-4 font-semibold text-gray-900">{pod.title}</td>
                      <td className="py-3 px-4">{pod.host}</td>
                    </tr>
                    {openIndex === idx && (
                      <tr>
                        <td colSpan={2} className="bg-white border-b px-4 pb-4 pt-0">
                          <div className="py-3 text-sm text-gray-700">
                            <div><span className="font-semibold">Date:</span> {pod.date}</div>
                            <div><span className="font-semibold">Description:</span> {pod.description}</div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
          {/* Mobile Accordion */}
          <div className="sm:hidden">
            {paginated.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                <div className="flex flex-col items-center justify-center">
                  <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mx-auto mb-2 text-gray-200"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7l9 6 9-6" /></svg>
                  <span>No podcasts found.</span>
                </div>
              </div>
            ) : (
              paginated.map((pod, idx) => (
                <div key={pod.title + idx} className="mb-2 border rounded-lg bg-white">
                  <button
                    className="w-full flex justify-between items-center px-4 py-3 font-semibold text-gray-900 focus:outline-none"
                    onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  >
                    <span>{pod.title}</span>
                    <span>{pod.host}</span>
                  </button>
                  {openIndex === idx && (
                    <div className="px-4 pb-3 text-sm text-gray-700">
                      <div><span className="font-semibold">Date:</span> {pod.date}</div>
                      <div><span className="font-semibold">Description:</span> {pod.description}</div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-4">
          <button
            className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded border ${page === i + 1 ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-700 border-gray-300'}`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
        <div className="mt-2">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-sm transition-colors duration-150 flex items-center gap-2"
            onClick={() => setShowModal(true)}
          >
            <Plus className="w-4 h-4" /> Add Podcast
          </button>
        </div>
      </Card>
      {/* Add Podcast Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl" onClick={() => setShowModal(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4">Add Podcast</h2>
            <form className="space-y-4" onSubmit={handleSave}>
              <div>
                <label className="block font-semibold mb-1">Title</label>
                <input name="title" value={form.title} onChange={handleFormChange} className="w-full border px-3 py-2 rounded" required />
              </div>
              <div>
                <label className="block font-semibold mb-1">Host</label>
                <input name="host" value={form.host} onChange={handleFormChange} className="w-full border px-3 py-2 rounded" required />
              </div>
              <div>
                <label className="block font-semibold mb-1">Date</label>
                <input name="date" type="date" value={form.date} onChange={handleFormChange} className="w-full border px-3 py-2 rounded" required />
              </div>
              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea name="description" value={form.description} onChange={handleFormChange} className="w-full border px-3 py-2 rounded" required />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded border border-gray-300 text-gray-700 bg-white hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PodcastsPage;
