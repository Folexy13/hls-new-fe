import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FormPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    allergies: '',
    scares: '',
    family: '',
    medication: '',
    currentCondition: '',
    hasCurrentCondition: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRadio = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, hasCurrentCondition: e.target.value });
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.name) newErrors.name = 'Name is required';
    if (!form.phone) newErrors.phone = 'Phone number is required';
    if (!form.hasCurrentCondition) newErrors.hasCurrentCondition = 'This field is required';
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length === 0) {
      // Submit logic here
      alert('Form submitted!');
      navigate('/');
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-8 mt-8">
      <h1 className="text-2xl font-bold mb-8">Add Benfek</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium mb-1">
            <span className="text-red-500 mr-1">*</span>Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Enter name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block font-medium mb-1">
            <span className="text-red-500 mr-1">*</span>Phone Number
          </label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Enter phone number"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>
        <div>
          <label className="block font-medium mb-1">Do you have any allergies?</label>
          <input
            type="text"
            name="allergies"
            value={form.allergies}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-emerald-500"
            placeholder="Enter allergies (seperate values by commas)"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">What health issue scares you the most?</label>
          <input
            type="text"
            name="scares"
            value={form.scares}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-emerald-500"
            placeholder="Enter issues (seperate values by commas)"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">What is your family's notable health condition?</label>
          <input
            type="text"
            name="family"
            value={form.family}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-emerald-500"
            placeholder="Enter family's condition"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Current medication in use</label>
          <input
            type="text"
            name="medication"
            value={form.medication}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-emerald-500"
            placeholder="Enter medications (seperate values by commas)"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">
            <span className="text-red-500 mr-1">*</span>Do you have any current health condition?
          </label>
          <div className="flex items-center space-x-6 mt-2">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="hasCurrentCondition"
                value="Yes"
                checked={form.hasCurrentCondition === 'Yes'}
                onChange={handleRadio}
                className="form-radio text-emerald-600"
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="hasCurrentCondition"
                value="No"
                checked={form.hasCurrentCondition === 'No'}
                onChange={handleRadio}
                className="form-radio text-emerald-600"
              />
              <span className="ml-2">No</span>
            </label>
          </div>
          {errors.hasCurrentCondition && <p className="text-red-500 text-sm mt-1">{errors.hasCurrentCondition}</p>}
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <button
            type="button"
            className="px-4 py-2 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormPage; 