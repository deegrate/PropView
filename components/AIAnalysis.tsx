import React, { useState } from 'react';
import { Property, FinancialAnalysis, AIAnalysisResult } from '../types';
import { analyzeDealWithGemini } from '../services/geminiService';
import { Sparkles, ThumbsUp, ThumbsDown, Target, FileText, Loader2 } from 'lucide-react';

interface AIAnalysisProps {
  property: Property;
  financials: FinancialAnalysis;
}

export const AIAnalysis: React.FC<AIAnalysisProps> = ({ property, financials }) => {
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const result = await analyzeDealWithGemini(property, financials);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  if (!analysis && !isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center p-8 space-y-4">
        <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-indigo-400" />
        </div>
        <h3 className="text-xl font-bold text-white">AI Deal Analyst</h3>
        <p className="text-slate-400 max-w-md">
            Unlock deep insights. Our Gemini-powered AI will analyze the financials, location data (mocked), and property characteristics to score this deal.
        </p>
        <button 
            onClick={handleAnalyze}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20"
        >
            <Sparkles size={18} /> Run Analysis
        </button>
      </div>
    );
  }

  if (isAnalyzing) {
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[300px] space-y-4">
            <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
            <p className="text-slate-400 animate-pulse">Analyzing market trends & financials...</p>
        </div>
      );
  }

  return (
    <div className="space-y-6 animate-fade-in">
        {/* Score Header */}
        <div className="flex items-center justify-between bg-slate-800 p-4 rounded-xl border border-slate-700">
            <div>
                <h3 className="text-slate-400 text-sm uppercase tracking-wider">PropVision Score</h3>
                <div className="flex items-baseline gap-2">
                    <span className={`text-4xl font-bold ${
                        (analysis?.score || 0) >= 80 ? 'text-emerald-400' : 
                        (analysis?.score || 0) >= 60 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                        {analysis?.score}
                    </span>
                    <span className="text-slate-500">/ 100</span>
                </div>
            </div>
            <div className="text-right">
                <span className="inline-block px-3 py-1 bg-slate-700 rounded-full text-indigo-300 text-sm font-medium border border-slate-600">
                    {analysis?.strategy}
                </span>
            </div>
        </div>

        {/* Summary */}
        <div className="space-y-2">
            <h4 className="flex items-center gap-2 text-white font-medium">
                <FileText size={18} className="text-slate-400" /> Executive Summary
            </h4>
            <p className="text-slate-300 text-sm leading-relaxed bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                {analysis?.summary}
            </p>
        </div>

        {/* Pros & Cons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                 <h4 className="flex items-center gap-2 text-emerald-400 font-medium text-sm uppercase">
                    <ThumbsUp size={16} /> Pros
                </h4>
                <ul className="space-y-2">
                    {analysis?.pros.map((pro, idx) => (
                        <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                            {pro}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="space-y-2">
                 <h4 className="flex items-center gap-2 text-red-400 font-medium text-sm uppercase">
                    <ThumbsDown size={16} /> Cons & Risks
                </h4>
                <ul className="space-y-2">
                    {analysis?.cons.map((con, idx) => (
                        <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></span>
                            {con}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
        
        <div className="flex justify-end pt-4">
            <button 
                onClick={handleAnalyze} 
                className="text-xs text-slate-500 hover:text-white underline"
            >
                Regenerate Analysis
            </button>
        </div>
    </div>
  );
};
