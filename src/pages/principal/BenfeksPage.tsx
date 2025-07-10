import React from 'react';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BenfeksPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 overflow-hidden">
      <button
        onClick={() => navigate('/principal')}
        className="mr-auto flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded mb-6 hover:bg-emerald-600"
        style={{ marginLeft: 0 }}
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>
      <Card className="w-full max-w-5xl p-8 shadow-lg">
        <div className="mb-3">
          <h1 className="font-bold text-2xl mb-3">Search Benfeks</h1>
          <p className="mb-4">Find a Benfek by name.</p>
          <input type="text" placeholder='Search Benfeks...' className='border-2 px-3 py-2 rounded-md w-full mb-6' />
          <div className="bg-white rounded border p-0 overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4 font-semibold">Code</th>
                  <th className="py-2 px-4 font-semibold">Name</th>
                  <th className="py-2 px-4 font-semibold">Phone Number</th>
                  <th className="py-2 px-4 font-semibold">Registered</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center">
                      <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mx-auto mb-2 text-gray-200"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7l9 6 9-6" /></svg>
                      <span>No data</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BenfeksPage;
