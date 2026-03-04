export type IncorporationStatus = 'draft' | 'complete';

export interface ShareholderData {
  first_name: string;
  last_name: string;
  nationality: string;
}

export interface ShareholderResponse extends ShareholderData {
  id: number;
  company_id: number;
}

export interface CompanyData {
  name: string;
  shareholder_count: number;
  total_capital: number;
}

export interface CompanyUpdate {
  name?: string;
  shareholder_count?: number;
  total_capital?: number;
}

export interface CompanyResponse extends CompanyData {
  id: number;
  status: IncorporationStatus;
  created_at: string;
  updated_at: string | null;
  shareholders: ShareholderResponse[];
}