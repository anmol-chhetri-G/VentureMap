import { useEffect, useState } from 'react';
import { apiService } from '../api/client';
import type { CompanyResponse } from '../types';

export default function AdminDashboard() {
  const [companies, setCompanies] = useState<CompanyResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch all companies when the dashboard loads
    apiService.getAllCompanies()
      .then(data => setCompanies(data))
      .catch(err => {
        console.error(err);
        setError('Failed to load companies.');
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading dashboard...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Admin Dashboard</h2>
      
      {companies.length === 0 ? (
        <p className="text-gray-500 italic">No companies have been incorporated yet.</p>
      ) : (
        <div className="space-y-6">
          {companies.map(company => (
            <div key={company.id} className="border border-gray-200 rounded-md p-5 bg-gray-50">
              
              {/* Company Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-blue-700">{company.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Capital: <span className="font-semibold">${company.total_capital}</span> | 
                    Shareholders Expected: <span className="font-semibold">{company.shareholder_count}</span>
                  </p>
                </div>
                
                {/* Status Badge */}
                <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${
                  company.status === 'complete' 
                    ? 'bg-green-100 text-green-800 border-green-200' 
                    : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                }`}>
                  {company.status.toUpperCase()}
                </span>
              </div>

              {/* Nested Shareholders List */}
              {company.shareholders && company.shareholders.length > 0 ? (
                <div className="mt-4 bg-white p-4 rounded border border-gray-100 shadow-sm">
                  <h4 className="text-sm font-bold text-gray-700 mb-2 border-b pb-1">Registered Shareholders</h4>
                  <ul className="text-sm text-gray-600 space-y-1.5 list-disc pl-5">
                    {company.shareholders.map(sh => (
                      <li key={sh.id}>
                        <span className="font-medium text-gray-800">{sh.first_name} {sh.last_name}</span> 
                        <span className="text-gray-500"> — {sh.nationality}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="mt-4 text-sm text-gray-500 italic">
                  No shareholders registered yet. (Draft mode)
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
}