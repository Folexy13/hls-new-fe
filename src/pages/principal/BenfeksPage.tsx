import React from 'react';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users } from 'lucide-react';

const BenfeksPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-emerald-50">
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
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-emerald-100 p-2 rounded-full">
            <Users className="w-6 h-6 text-emerald-500" />
          </div>
          <span className="text-2xl font-extrabold text-gray-900 tracking-tight">Search Benfeks</span>
        </div>
        <p className="mb-4 text-gray-700">Find a Benfek by name.</p>
        <input type="text" placeholder='Search Benfeks...' className='border-2 px-3 py-2 rounded-md w-full mb-6' />
        <div className="bg-white rounded-lg border border-gray-100 p-0 overflow-x-auto">
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
      </Card>
    </div>
  );
};

export default BenfeksPage;
