import { useState, useEffect, type FormEvent } from 'react';
import { apiService } from '../api/client';
import type { ShareholderData, CompanyResponse } from '../types';

interface StepTwoProps {
  companyId: number;
  onComplete: () => void;
  onBack: () => void;
}

export default function StepTwo({ companyId, onComplete, onBack }: StepTwoProps) {
  const [shareholders, setShareholders] = useState<ShareholderData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // When component loads, fetch the company to know how many forms to render
  useEffect(() => {
    apiService.getCompany(companyId)
      .then((company: CompanyResponse) => {
        // Create an array of empty shareholder objects based on the count from Step 1
        const initialForms = Array.from({ length: company.shareholder_count }, () => ({
  first_name: '',
  last_name: '',
  nationality: ''
}));
        setShareholders(initialForms);
      })
      .catch(() => setError('Failed to load company details.'))
      .finally(() => setIsLoading(false));
  }, [companyId]);

  const updateShareholder = (index: number, field: keyof ShareholderData, value: string) => {
    const updated = [...shareholders];
    updated[index] = { ...updated[index], [field]: value };
    setShareholders(updated);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Send all shareholders to the backend 
      await apiService.addShareholders(companyId, shareholders);
      onComplete(); // <-- This triggers your handleComplete function!
    } catch (err) {
      setError('Failed to save shareholders.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="text-gray-500 animate-pulse">Loading shareholder forms...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && <div className="text-red-500 bg-red-50 p-3 rounded">{error}</div>}

      <div className="space-y-6">
        {shareholders.map((sh, index) => (
          <div key={index} className="p-5 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="font-semibold text-gray-700 mb-4 border-b pb-2">
              Shareholder {index + 1}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">First Name</label>
                <input 
                  type="text" required
                  className="w-full rounded border-gray-300 border p-2 bg-white"
                  value={sh.first_name}
                  onChange={(e) => updateShareholder(index, 'first_name', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Last Name</label>
                <input 
                  type="text" required
                  className="w-full rounded border-gray-300 border p-2 bg-white"
                  value={sh.last_name}
                  onChange={(e) => updateShareholder(index, 'last_name', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Nationality</label>
                <input 
                  type="text" required
                  className="w-full rounded border-gray-300 border p-2 bg-white"
                  value={sh.nationality}
                  onChange={(e) => updateShareholder(index, 'nationality', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-4">
        <button 
          type="button" 
          onClick={onBack}
          className="text-gray-500 hover:text-gray-800 font-medium px-4 py-2"
        >
          ← Back to Company Info
        </button>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-green-600 text-white font-medium px-6 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400"
        >
          {isSubmitting ? 'Submitting...' : 'Complete Incorporation'}
        </button>
      </div>
    </form>
  );
}