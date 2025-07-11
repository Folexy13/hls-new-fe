import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus } from 'lucide-react';

const AddBenfekPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    allergies: '',
    scares: '',
    familyCondition: '',
    medications: '',
    hasCurrentCondition: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
      <Card className="w-full max-w-md md:max-w-lg p-8 rounded-2xl shadow-2xl border border-gray-100 bg-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-emerald-100 p-2 rounded-full">
            <UserPlus className="w-6 h-6 text-emerald-500" />
          </div>
          <span className="text-2xl font-extrabold text-gray-900 tracking-tight">Add Benfek</span>
        </div>
        <form className="space-y-4">
          <div>
            <label className="block font-medium text-sm mb-1 text-red-600">* Name</label>
            <input name="name" value={form.name} onChange={handleChange} className="w-full border px-3 py-2 rounded" placeholder="Enter name" required />
          </div>
          <div>
            <label className="block font-medium text-sm mb-1 text-red-600">* Phone Number</label>
            <input name="phone" value={form.phone} onChange={handleChange} className="w-full border px-3 py-2 rounded" placeholder="Enter phone number" required />
          </div>
          <div>
            <label className="block font-medium text-sm mb-1">Do you have any allergies?</label>
            <input name="allergies" value={form.allergies} onChange={handleChange} className="w-full border px-3 py-2 rounded" placeholder="Enter allergies (seperate values by commas)" />
          </div>
          <div>
            <label className="block font-medium text-sm mb-1">What health issue scares you the most?</label>
            <input name="scares" value={form.scares} onChange={handleChange} className="w-full border px-3 py-2 rounded" placeholder="Enter issues (seperate values by commas)" />
          </div>
          <div>
            <label className="block font-medium text-sm mb-1">What is your family's notable health condition?</label>
            <input name="familyCondition" value={form.familyCondition} onChange={handleChange} className="w-full border px-3 py-2 rounded" placeholder="Enter family's condition" />
          </div>
          <div>
            <label className="block font-medium text-sm mb-1">Current medication in use</label>
            <input name="medications" value={form.medications} onChange={handleChange} className="w-full border px-3 py-2 rounded" placeholder="Enter medications (seperate values by commas)" />
          </div>
          <div>
            <label className="block font-medium text-sm mb-1 text-red-600">* Do you have any current health condition?</label>
            <div className="flex items-center gap-6 mt-1">
              <label className="flex items-center gap-1">
                <input type="radio" name="hasCurrentCondition" value="yes" checked={form.hasCurrentCondition === 'yes'} onChange={handleChange} /> Yes
              </label>
              <label className="flex items-center gap-1">
                <input type="radio" name="hasCurrentCondition" value="no" checked={form.hasCurrentCondition === 'no'} onChange={handleChange} /> No
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={() => navigate('/principal')} className="px-4 py-2 rounded border border-emerald-500 text-emerald-700 bg-white hover:bg-emerald-50 hover:border-emerald-600 transition-colors duration-150">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 transition-colors duration-150">Save</button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddBenfekPage;
