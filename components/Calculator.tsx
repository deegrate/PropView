import React, { useEffect } from 'react';
import { Property, FinancialAnalysis } from '../types';
import { DollarSign, Percent, TrendingUp, AlertCircle, PieChart as PieChartIcon, Settings } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';

interface CalculatorProps {
  property: Property;
  financials: FinancialAnalysis;
  setFinancials: React.Dispatch<React.SetStateAction<FinancialAnalysis>>;
}

export const Calculator: React.FC<CalculatorProps> = ({ property, financials, setFinancials }) => {

  // Recalculate whenever inputs change
  useEffect(() => {
    const purchasePrice = property.price;
    const downPaymentAmount = purchasePrice * (financials.downPayment / 100);
    const loanAmount = purchasePrice - downPaymentAmount;
    const closingCostsAmount = purchasePrice * (financials.closingCosts / 100);
    const totalInvested = downPaymentAmount + closingCostsAmount + financials.rehabCosts;

    // Monthly Mortgage (PI)
    const r = financials.interestRate / 100 / 12;
    const n = financials.loanTerm * 12;
    const monthlyPrincipalInterest = loanAmount > 0 
      ? loanAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
      : 0;

    // Operating Expenses
    const monthlyTaxes = (purchasePrice * (financials.propertyTaxRate / 100)) / 12;
    const monthlyInsurance = (purchasePrice * (financials.insuranceRate / 100)) / 12;
    const monthlyVacancy = property.estimatedRent * (financials.vacancyRate / 100);
    const monthlyMaintenance = property.estimatedRent * (financials.maintenanceRate / 100);
    const monthlyManagement = property.estimatedRent * (financials.managementRate / 100);
    const monthlyHOA = financials.hoa;

    const totalOperatingExpenses = monthlyTaxes + monthlyInsurance + monthlyVacancy + monthlyMaintenance + monthlyManagement + monthlyHOA;
    const totalMonthlyExpenses = monthlyPrincipalInterest + totalOperatingExpenses;
    
    const monthlyCashFlow = property.estimatedRent - totalMonthlyExpenses;
    const netOperatingIncome = property.estimatedRent * 12 - totalOperatingExpenses * 12;

    // ROI Metrics
    const annualCashFlow = monthlyCashFlow * 12;
    const capRate = (netOperatingIncome / purchasePrice) * 100;
    const cashOnCash = totalInvested > 0 ? (annualCashFlow / totalInvested) * 100 : 0;

    setFinancials(prev => ({
      ...prev,
      monthlyIncome: property.estimatedRent,
      monthlyExpenses: totalMonthlyExpenses,
      cashFlow: monthlyCashFlow,
      capRate: parseFloat(capRate.toFixed(2)),
      cashOnCash: parseFloat(cashOnCash.toFixed(2)),
      totalInvestment: totalInvested,
      breakdown: {
        mortgage: monthlyPrincipalInterest,
        taxes: monthlyTaxes,
        insurance: monthlyInsurance,
        hoa: monthlyHOA,
        vacancy: monthlyVacancy,
        maintenance: monthlyMaintenance,
        management: monthlyManagement
      }
    }));
  }, [
    property, 
    financials.downPayment, 
    financials.interestRate, 
    financials.closingCosts, 
    financials.rehabCosts, 
    financials.loanTerm, 
    financials.propertyTaxRate,
    financials.insuranceRate,
    financials.hoa,
    financials.vacancyRate,
    financials.maintenanceRate,
    financials.managementRate,
    setFinancials
  ]);

  const handleChange = (field: keyof FinancialAnalysis, value: number) => {
    setFinancials(prev => ({ ...prev, [field]: value }));
  };

  const expenseData = [
    { name: 'Mortgage', value: financials.breakdown.mortgage, color: '#6366f1' }, // indigo
    { name: 'Taxes', value: financials.breakdown.taxes, color: '#f59e0b' }, // amber
    { name: 'Ins/HOA', value: financials.breakdown.insurance + financials.breakdown.hoa, color: '#ec4899' }, // pink
    { name: 'Ops', value: financials.breakdown.vacancy + financials.breakdown.maintenance + financials.breakdown.management, color: '#10b981' }, // emerald
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Cards - ROI Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 relative overflow-hidden">
             <div className="text-slate-400 text-xs uppercase font-semibold">Cash Flow / Mo</div>
             <div className={`text-2xl font-bold mt-1 ${financials.cashFlow >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                ${financials.cashFlow.toFixed(0)}
             </div>
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <DollarSign size={40} />
             </div>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 relative overflow-hidden">
             <div className="text-slate-400 text-xs uppercase font-semibold">Cash on Cash</div>
             <div className={`text-2xl font-bold mt-1 ${financials.cashOnCash >= 8 ? 'text-emerald-400' : 'text-yellow-400'}`}>
                {financials.cashOnCash}%
             </div>
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Percent size={40} />
             </div>
          </div>
           <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 relative overflow-hidden">
             <div className="text-slate-400 text-xs uppercase font-semibold">Cap Rate</div>
             <div className="text-2xl font-bold mt-1 text-white">
                {financials.capRate}%
             </div>
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <TrendingUp size={40} />
             </div>
          </div>
           <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 relative overflow-hidden">
             <div className="text-slate-400 text-xs uppercase font-semibold">Cash Needed</div>
             <div className="text-2xl font-bold mt-1 text-white">
                ${(financials.totalInvestment / 1000).toFixed(1)}k
             </div>
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <DollarSign size={40} />
             </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Inputs */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Purchase & Loan */}
            <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
                    <DollarSign className="text-blue-400" size={18} /> Acquisition & Loan
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                        <label className="text-xs text-slate-400 mb-1 block">Purchase Price</label>
                        <div className="text-white font-mono text-sm bg-slate-900 px-3 py-2 rounded border border-slate-700">
                            ${property.price.toLocaleString()}
                        </div>
                    </div>
                     <div>
                        <label className="text-xs text-slate-400 mb-1 block">Down Payment (%)</label>
                        <input type="number" value={financials.downPayment} onChange={e => handleChange('downPayment', parseFloat(e.target.value))} className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none" />
                    </div>
                     <div>
                        <label className="text-xs text-slate-400 mb-1 block">Interest Rate (%)</label>
                        <input type="number" step="0.125" value={financials.interestRate} onChange={e => handleChange('interestRate', parseFloat(e.target.value))} className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none" />
                    </div>
                    <div>
                        <label className="text-xs text-slate-400 mb-1 block">Closing Costs (%)</label>
                        <input type="number" value={financials.closingCosts} onChange={e => handleChange('closingCosts', parseFloat(e.target.value))} className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none" />
                    </div>
                     <div>
                        <label className="text-xs text-slate-400 mb-1 block">Rehab Budget ($)</label>
                        <input type="number" step="1000" value={financials.rehabCosts} onChange={e => handleChange('rehabCosts', parseFloat(e.target.value))} className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none" />
                    </div>
                     <div>
                        <label className="text-xs text-slate-400 mb-1 block">Loan Term (Yrs)</label>
                        <input type="number" value={financials.loanTerm} onChange={e => handleChange('loanTerm', parseFloat(e.target.value))} className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none" />
                    </div>
                </div>
            </div>

            {/* Operating Expenses */}
             <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
                    <Settings className="text-emerald-400" size={18} /> Operating Assumptions
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                     <div>
                        <label className="text-xs text-slate-400 mb-1 block">Annual Tax Rate (%)</label>
                        <input type="number" step="0.1" value={financials.propertyTaxRate} onChange={e => handleChange('propertyTaxRate', parseFloat(e.target.value))} className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none" />
                    </div>
                     <div>
                        <label className="text-xs text-slate-400 mb-1 block">Annual Ins. Rate (%)</label>
                        <input type="number" step="0.1" value={financials.insuranceRate} onChange={e => handleChange('insuranceRate', parseFloat(e.target.value))} className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none" />
                    </div>
                    <div>
                        <label className="text-xs text-slate-400 mb-1 block">Monthly HOA ($)</label>
                        <input type="number" value={financials.hoa} onChange={e => handleChange('hoa', parseFloat(e.target.value))} className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none" />
                    </div>
                     <div>
                        <label className="text-xs text-slate-400 mb-1 block">Vacancy Rate (%)</label>
                        <input type="number" value={financials.vacancyRate} onChange={e => handleChange('vacancyRate', parseFloat(e.target.value))} className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none" />
                    </div>
                     <div>
                        <label className="text-xs text-slate-400 mb-1 block">Maintenance (%)</label>
                        <input type="number" value={financials.maintenanceRate} onChange={e => handleChange('maintenanceRate', parseFloat(e.target.value))} className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none" />
                    </div>
                     <div>
                        <label className="text-xs text-slate-400 mb-1 block">Management (%)</label>
                        <input type="number" value={financials.managementRate} onChange={e => handleChange('managementRate', parseFloat(e.target.value))} className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none" />
                    </div>
                </div>
            </div>

        </div>

        {/* Right Col: Breakdown Chart */}
        <div className="space-y-6">
            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 h-full flex flex-col">
                <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Monthly Expense Breakdown</h3>
                
                <div className="h-48 w-full mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={expenseData}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={70}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {expenseData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                                formatter={(value: number) => `$${value.toFixed(0)}`}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="flex-1 space-y-3">
                     <div className="flex justify-between items-center text-sm">
                        <span className="flex items-center gap-2 text-slate-400">
                             <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Principal & Interest
                        </span>
                        <span className="text-white font-mono">${financials.breakdown.mortgage.toFixed(0)}</span>
                     </div>
                     <div className="flex justify-between items-center text-sm">
                        <span className="flex items-center gap-2 text-slate-400">
                             <span className="w-2 h-2 rounded-full bg-amber-500"></span> Taxes
                        </span>
                        <span className="text-white font-mono">${financials.breakdown.taxes.toFixed(0)}</span>
                     </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="flex items-center gap-2 text-slate-400">
                             <span className="w-2 h-2 rounded-full bg-pink-500"></span> Ins/HOA
                        </span>
                        <span className="text-white font-mono">${(financials.breakdown.insurance + financials.breakdown.hoa).toFixed(0)}</span>
                     </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="flex items-center gap-2 text-slate-400">
                             <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Ops (Vac/Maint/Mgmt)
                        </span>
                        <span className="text-white font-mono">${(financials.breakdown.vacancy + financials.breakdown.maintenance + financials.breakdown.management).toFixed(0)}</span>
                     </div>
                     <div className="h-px bg-slate-700 my-2"></div>
                      <div className="flex justify-between items-center text-sm font-semibold">
                        <span className="text-white">Total Monthly Exp.</span>
                        <span className="text-white font-mono">${financials.monthlyExpenses.toFixed(0)}</span>
                     </div>
                </div>

            </div>
        </div>

      </div>
    </div>
  );
};