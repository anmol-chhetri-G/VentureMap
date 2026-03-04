import { useState, useEffect, type FormEvent } from 'react';
import { apiService } from '../api/client';
import type { CompanyData } from '../types';

interface StepOneProps {
  companyId: number | null;
  onNext: (id: number) => void;
}

export default function StepOne({ companyId, onNext }: StepOneProps) {
  const [formData, setFormData] = useState<CompanyData>({
    name: '',
    shareholder_count: 1,
    total_capital: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // If we came back from Step 2, hydrate the form with existing data
  useEffect(() => {
    if (companyId) {
      setIsLoading(true);
      apiService.getCompany(companyId)
        .then(data => {
          setFormData({
            name: data.name,
            shareholder_count: data.shareholder_count,
            total_capital: data.total_capital,
          });
        })
        .catch(() => setError('Failed to load draft data.'))
        .finally(() => setIsLoading(false));
    }
  }, [companyId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (companyId) {
        // Update existing draft
        await apiService.updateCompanyDraft(companyId, formData);
        onNext(companyId);
      } else {
        // Create brand new draft
        const newCompany = await apiService.createCompanyDraft(formData);
        onNext(newCompany.id);
      }
    } catch (err) {
      setError('An error occurred while saving.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && companyId) return <div className="text-gray-500">Loading your draft...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <div className="text-red-500 bg-red-50 p-3 rounded">{error}</div>}
      
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Company Name</label>
        <input 
          type="text" 
          required
          className="w-full rounded-md border border-gray-300 p-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
      </div>

   <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Number of Shareholders</label>
          <input 
            type="number" 
            min="1"
            required
            className="w-full rounded-md border border-gray-300 p-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition"
            // If it's 0, show an empty string so the box clears properly
            value={formData.shareholder_count === 0 ? '' : formData.shareholder_count}
            // Fall back to 0 if they backspace the whole number
            onChange={(e) => setFormData({...formData, shareholder_count: parseInt(e.target.value) || 0})}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Total Capital ($)</label>
          <input 
            type="number" 
            min="0"
            step="0.01"
            required
            className="w-full rounded-md border border-gray-300 p-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition"
            // If it's 0, show an empty string
            value={formData.total_capital === 0 ? '' : formData.total_capital}
            // Fall back to 0 if they backspace the whole number
            onChange={(e) => setFormData({...formData, total_capital: parseFloat(e.target.value) || 0})}
          />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isLoading}
        className="w-full bg-blue-600 text-white font-medium p-3 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400 mt-6"
      >
        {isLoading ? 'Saving Draft...' : 'Save & Continue'}
      </button>
    </form>
  );
}