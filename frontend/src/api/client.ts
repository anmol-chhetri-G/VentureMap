import axios from 'axios';
import type { 
  CompanyData, 
  CompanyUpdate, 
  CompanyResponse, 
  ShareholderData, 
  ShareholderResponse 
} from '../types';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000', // Your FastAPI server
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Step 1: Create a new draft company
  createCompanyDraft: async (data: CompanyData): Promise<CompanyResponse> => {
    const response = await api.post<CompanyResponse>('/companies', data);
    return response.data;
  },

  // Update an existing draft (if the user comes back and edits Step 1)
  updateCompanyDraft: async (id: number, data: CompanyUpdate): Promise<CompanyResponse> => {
    const response = await api.patch<CompanyResponse>(`/companies/${id}`, data);
    return response.data;
  },

  // Fetch a company to reload a saved draft
  getCompany: async (id: number): Promise<CompanyResponse> => {
    const response = await api.get<CompanyResponse>(`/companies/${id}`);
    return response.data;
  },

  // Step 2: Submit all shareholders
  addShareholders: async (companyId: number, shareholders: ShareholderData[]): Promise<ShareholderResponse[]> => {
    const response = await api.post<ShareholderResponse[]>(`/companies/${companyId}/shareholders`, shareholders);
    return response.data;
  },

  // Admin View: Retrieve all companies with their nested shareholders
  getAllCompanies: async (): Promise<CompanyResponse[]> => {
    const response = await api.get<CompanyResponse[]>('/companies');
    return response.data;
  }
};