export interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  lotSize: number; // sqft
  yearBuilt: number;
  propertyType: 'Single Family' | 'Multi Family' | 'Condo' | 'Townhouse';
  status: 'For Sale' | 'Pending' | 'Sold' | 'Foreclosure';
  imageUrl: string;
  estimatedRent: number;
  estimatedValue?: number; // After Repair Value or Current Market Value
  description: string;
  coordinates: { x: number; y: number }; // For mock map placement
  features: string[];
  lastSoldDate: string;
  lastSoldPrice: number;
}

export interface FinancialAnalysis {
  // Loan & Acquisition
  downPayment: number; // %
  interestRate: number; // %
  loanTerm: number; // years
  closingCosts: number; // %
  rehabCosts: number; // $
  
  // Operating Assumptions
  propertyTaxRate: number; // annual %
  insuranceRate: number; // annual %
  hoa: number; // monthly $
  vacancyRate: number; // %
  maintenanceRate: number; // %
  managementRate: number; // %
  
  // Calculated Results
  monthlyIncome: number;
  monthlyExpenses: number;
  cashFlow: number;
  capRate: number;
  cashOnCash: number;
  totalInvestment: number;
  
  // Calculated Breakdown
  breakdown: {
    mortgage: number;
    taxes: number;
    insurance: number;
    hoa: number;
    vacancy: number;
    maintenance: number;
    management: number;
  };
}

export interface AIAnalysisResult {
  score: number; // 0-100
  summary: string;
  pros: string[];
  cons: string[];
  strategy: string;
  isLoading: boolean;
}