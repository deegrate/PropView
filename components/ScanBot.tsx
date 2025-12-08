import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Terminal, Search, Loader2, Plus, Check, Flame, ArrowRight } from 'lucide-react';
import { findDealsWithGemini, findWholesaleDealsWithGemini } from '../services/geminiService';
import { Property } from '../types';

interface ScanBotProps {
  isOpen: boolean;
  onClose: () => void;
  onImportProperties: (properties: Property[]) => void;
}

export const ScanBot: React.FC<ScanBotProps> = ({ isOpen, onClose, onImportProperties }) => {
  const [market, setMarket] = useState('');
  const [strategy, setStrategy] = useState('BRRRR');
  const [isScanning, setIsScanning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [foundProperties, setFoundProperties] = useState<Property[]>([]);
  const [wholesaleProperties, setWholesaleProperties] = useState<Property[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  if (!isOpen) return null;

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `> ${message}`]);
  };

  const handleScan = async () => {
    if (!market) return;
    setIsScanning(true);
    setFoundProperties([]);
    setWholesaleProperties([]);
    setLogs(['> Initializing ScanBot v2.1...', '> Establishing secure connection to market data feeds...']);

    // Simulate connection delay
    setTimeout(() => addLog(`Targeting Market: ${market}`), 800);
    setTimeout(() => addLog(`Strategy Protocol: ${strategy}`), 1500);
    setTimeout(() => addLog('Accessing MLS records...'), 2200);
    setTimeout(() => addLog('Analyzing price trends and history...'), 3000);
    
    // Trigger "Wholesale" scan log
    setTimeout(() => addLog('Scanning for off-market wholesale deals (> $50k equity)...'), 3500);
    setTimeout(() => addLog('Cross-referencing rental estimates...'), 4200);

    try {
        // Run both scans in parallel for efficiency
        const [deals, wholesaleDeals] = await Promise.all([
            findDealsWithGemini(market, strategy),
            findWholesaleDealsWithGemini(market)
        ]);
        
        setTimeout(() => {
            const totalFound = deals.length + wholesaleDeals.length;
            if (totalFound > 0) {
                addLog(`Success! Identified ${totalFound} potential high-yield assets.`);
                addLog(`${wholesaleDeals.length} Wholesale opportunities detected with high equity spread.`);
                setFoundProperties(deals);
                setWholesaleProperties(wholesaleDeals);
            } else {
                addLog('Scan complete. No properties found matching strict criteria.');
            }
            setIsScanning(false);
        }, 5000);

    } catch (e) {
        addLog('Error: Connection interrupted.');
        setIsScanning(false);
    }
  };

  const handleImport = () => {
      onImportProperties([...foundProperties, ...wholesaleProperties]);
      onClose();
      // Reset state for next time
      setLogs([]);
      setFoundProperties([]);
      setWholesaleProperties([]);
      setMarket('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 w-full max-w-5xl h-[700px] rounded-xl border border-slate-700 shadow-2xl flex flex-col overflow-hidden animate-fade-in">
        
        {/* Header */}
        <div className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-800/50">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-emerald-500/10 flex items-center justify-center border border-emerald-500/50">
                  <Bot size={20} className="text-emerald-400" />
              </div>
              <h2 className="text-white font-semibold tracking-wide">Market Scan Bot</h2>
           </div>
           <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
              <X size={24} />
           </button>
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar / Controls */}
            <div className="w-full md:w-72 bg-slate-900 border-r border-slate-800 p-6 flex flex-col gap-6 shrink-0 z-10">
                <div>
                    <label className="text-slate-400 text-xs uppercase font-bold mb-2 block">Target Market</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-slate-500 w-4 h-4" />
                        <input 
                            type="text" 
                            placeholder="City, State or Zip" 
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                            value={market}
                            onChange={(e) => setMarket(e.target.value)}
                            disabled={isScanning}
                        />
                    </div>
                </div>

                <div>
                    <label className="text-slate-400 text-xs uppercase font-bold mb-2 block">Strategy</label>
                    <select 
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-emerald-500 outline-none"
                        value={strategy}
                        onChange={(e) => setStrategy(e.target.value)}
                        disabled={isScanning}
                    >
                        <option value="BRRRR">BRRRR (Buy, Rehab, Rent, Refinance, Repeat)</option>
                        <option value="Fix & Flip">Fix & Flip</option>
                        <option value="Buy & Hold">Buy & Hold (Cash Flow)</option>
                        <option value="Short Term Rental">Short Term Rental (Airbnb)</option>
                    </select>
                </div>

                <div className="mt-auto">
                    <button 
                        onClick={handleScan}
                        disabled={isScanning || !market}
                        className={`
                            w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all
                            ${isScanning 
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20'}
                        `}
                    >
                        {isScanning ? <Loader2 className="animate-spin" /> : <Terminal size={18} />}
                        {isScanning ? 'Scanning...' : 'Start Scan'}
                    </button>
                </div>
            </div>

            {/* Main Display Area */}
            <div className="flex-1 bg-slate-950 flex flex-col min-w-0">
                
                {/* Terminal / Logs */}
                <div className={`
                    flex-1 p-6 overflow-y-auto font-mono text-sm transition-all duration-300
                    ${(foundProperties.length > 0 || wholesaleProperties.length > 0) ? 'h-1/4 max-h-48 border-b border-slate-800' : 'h-full'}
                `}>
                    {logs.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4">
                            <Bot size={48} className="opacity-20" />
                            <p>Ready to scan. Enter parameters to begin.</p>
                        </div>
                    )}
                    {logs.map((log, i) => (
                        <div key={i} className="mb-1 text-emerald-400/80">{log}</div>
                    ))}
                    <div ref={logsEndRef} />
                </div>

                {/* Results Area */}
                {(foundProperties.length > 0 || wholesaleProperties.length > 0) && (
                    <div className="flex-1 bg-slate-900 p-6 flex flex-col overflow-hidden animate-slide-up">
                        <div className="flex justify-between items-center mb-4 shrink-0">
                            <h3 className="text-white font-semibold flex items-center gap-2">
                                <Check size={18} className="text-emerald-400" />
                                {foundProperties.length + wholesaleProperties.length} Opportunities Found
                            </h3>
                            <button 
                                onClick={handleImport}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
                            >
                                <Plus size={14} /> Import All Leads
                            </button>
                        </div>
                        
                        <div className="overflow-y-auto pr-2 pb-4 space-y-6">
                            
                            {/* WHOLESALE SECTION */}
                            {wholesaleProperties.length > 0 && (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-amber-500 font-bold text-sm tracking-wider border-b border-amber-500/30 pb-1">
                                        <Flame size={16} /> WHOLESALE ({wholesaleProperties.length}) 
                                        <span className="text-amber-500/60 text-xs font-normal normal-case ml-auto"> > $50k Potential Equity</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {wholesaleProperties.map(prop => {
                                            const equity = (prop.estimatedValue || prop.price) - prop.price;
                                            return (
                                                <div key={prop.id} className="bg-slate-800 border border-amber-500/40 rounded-lg p-3 hover:bg-slate-800/80 transition-colors group relative overflow-hidden">
                                                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-3xl"></div>
                                                    <div className="flex justify-between items-start mb-2 relative">
                                                        <div className="font-bold text-white text-sm truncate w-full pr-16">{prop.address}</div>
                                                        <div className="text-amber-400 text-xs font-bold font-mono bg-amber-950/50 border border-amber-500/30 px-1.5 py-0.5 rounded ml-2 shrink-0 absolute right-0 top-0">
                                                            ${(prop.price / 1000).toFixed(0)}k
                                                        </div>
                                                    </div>
                                                    <div className="mb-2 flex items-center gap-2">
                                                        <div className="text-[10px] text-slate-400 uppercase tracking-wide">Potential Equity</div>
                                                        <div className="flex-1 h-px bg-slate-700"></div>
                                                        <div className="text-emerald-400 font-bold text-sm">+${(equity / 1000).toFixed(1)}k</div>
                                                    </div>
                                                    <div className="text-xs text-slate-400 flex gap-3 mb-2">
                                                        <span>{prop.beds}bd</span>
                                                        <span>{prop.baths}ba</span>
                                                        <span>{prop.sqft}sqft</span>
                                                        <span className="text-slate-500 ml-auto">ARV: ${(prop.estimatedValue! / 1000).toFixed(0)}k</span>
                                                    </div>
                                                    <div className="text-xs text-slate-500 line-clamp-2 italic">
                                                        "{prop.description}"
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* STANDARD STRATEGY SECTION */}
                            {foundProperties.length > 0 && (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm tracking-wider border-b border-indigo-500/30 pb-1">
                                        <ArrowRight size={16} /> STRATEGY MATCHES ({foundProperties.length})
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {foundProperties.map(prop => (
                                            <div key={prop.id} className="bg-slate-800 border border-slate-700 rounded-lg p-3 hover:border-slate-600 transition-colors group">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="font-bold text-white text-sm truncate w-full">{prop.address}</div>
                                                    <div className="text-indigo-400 text-xs font-mono bg-indigo-900/20 px-1.5 py-0.5 rounded ml-2 shrink-0">
                                                        ${(prop.price / 1000).toFixed(0)}k
                                                    </div>
                                                </div>
                                                <div className="text-xs text-slate-400 flex gap-3">
                                                    <span>{prop.beds}bd</span>
                                                    <span>{prop.baths}ba</span>
                                                    <span>{prop.sqft}sqft</span>
                                                </div>
                                                <div className="mt-2 text-xs text-slate-500 line-clamp-2">
                                                    {prop.description}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};