import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 overflow-hidden">
      <button
        onClick={() => navigate('/principal')}
        className="mr-auto flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded mb-6 hover:bg-emerald-600"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>
      <Card className="w-full max-w-md md:max-w-lg p-6 shadow-lg">
        <h1 className="font-bold text-2xl mb-4">Add Benfek</h1>
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
            <button type="button" onClick={() => navigate('/principal')} className="px-4 py-2 rounded border">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">Save</button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddBenfekPage;
