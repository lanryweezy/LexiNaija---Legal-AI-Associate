import React, { useState, useEffect } from 'react';
import { Lightbulb, Target, Shield, AlertTriangle, FileText, Save, Play, BrainCircuit } from 'lucide-react';
import { useLegalStore } from '../contexts/LegalStoreContext';
import { generateCaseStrategy } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

export const Strategy: React.FC = () => {
  const { cases, saveDocumentToCase, consumeCredits } = useLegalStore();
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [role, setRole] = useState('Claimant/Plaintiff');
  const [jurisdiction, setJurisdiction] = useState('Lagos State High Court');
  const [facts, setFacts] = useState('');
  const [strategyReport, setStrategyReport] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Auto-fill facts when a case is selected
  useEffect(() => {
    if (selectedCaseId) {
        const c = cases.find(caseItem => caseItem.id === selectedCaseId);
        if (c) {
            setFacts(c.notes || '');
            // Attempt to guess jurisdiction/court from case data
            if (c.court) setJurisdiction(c.court);
        }
    }
  }, [selectedCaseId, cases]);

  const handleAnalyze = async () => {
    if (!facts.trim()) {
        alert("Please enter the facts of the case.");
        return;
    }
    if (!consumeCredits(10)) {
        alert("Insufficient credits to generate a strategy report.");
        return;
    }
    setIsAnalyzing(true);
    setStrategyReport('');
    try {
        const report = await generateCaseStrategy(facts, role, jurisdiction);
        setStrategyReport(report);
    } catch (e) {
        alert("Failed to generate strategy. Please try again.");
    } finally {
        setIsAnalyzing(false);
    }
  };

  const handleSaveToCase = () => {
    if (!selectedCaseId) {
        alert("Please select a case file to save this strategy to.");
        return;
    }
    if (!strategyReport) return;

    saveDocumentToCase(selectedCaseId, {
        id: Date.now().toString(),
        title: `Legal Strategy Opinion - ${new Date().toLocaleDateString()}`,
        content: strategyReport,
        type: 'Research',
        createdAt: new Date()
    });
    alert("Strategy saved to Case Documents successfully.");
  };

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-2rem)] flex flex-col">
      <div className="mb-6 shrink-0">
        <h2 className="text-2xl font-serif font-bold text-legal-900 flex items-center gap-3">
            <BrainCircuit className="text-legal-gold" /> Case Strategy Advisor
        </h2>
        <p className="text-gray-500 text-sm mt-1">AI-powered legal merits assessment and litigation strategy planning.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full overflow-hidden">
        {/* Input Column */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200 font-bold text-gray-700 flex items-center gap-2">
                <Target size={18} /> Case Parameters
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Existing Matter</label>
                    <select 
                        value={selectedCaseId}
                        onChange={e => setSelectedCaseId(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-legal-gold outline-none"
                    >
                        <option value="">-- New Analysis (No File Linked) --</option>
                        {cases.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Client's Role</label>
                        <select 
                            value={role}
                            onChange={e => setRole(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-legal-gold outline-none"
                        >
                            <option>Claimant/Plaintiff</option>
                            <option>Defendant</option>
                            <option>Applicant</option>
                            <option>Respondent</option>
                            <option>Appellant</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Jurisdiction / Court</label>
                        <input 
                            type="text"
                            value={jurisdiction}
                            onChange={e => setJurisdiction(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-legal-gold outline-none"
                            placeholder="e.g. Lagos High Court"
                        />
                    </div>
                </div>

                <div className="flex-1 flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brief Facts & Instructions</label>
                    <textarea 
                        value={facts}
                        onChange={e => setFacts(e.target.value)}
                        placeholder="Enter the key facts of the case here. Be specific about dates, agreements, and disputes..."
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-legal-gold outline-none resize-none flex-1 min-h-[200px]"
                    />
                </div>

                <button 
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !facts}
                    className="w-full bg-legal-900 text-white py-3 rounded-lg font-medium hover:bg-legal-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                    {isAnalyzing ? (
                        <>Processing Legal Logic...</>
                    ) : (
                        <><Play size={18} fill="currentColor" /> Generate Strategic Opinion</>
                    )}
                </button>
            </div>
        </div>

        {/* Output Column */}
        <div className="bg-gray-50 rounded-xl shadow-inner border border-gray-200 flex flex-col overflow-hidden relative">
            <div className="p-4 bg-white border-b border-gray-200 flex justify-between items-center">
                <span className="font-bold text-legal-900 flex items-center gap-2">
                    <Lightbulb size={18} className="text-legal-gold"/> Strategic Opinion
                </span>
                <button 
                    onClick={handleSaveToCase}
                    disabled={!strategyReport || !selectedCaseId}
                    className="text-sm text-legal-700 hover:text-legal-900 flex items-center gap-1 disabled:opacity-50"
                >
                    <Save size={16} /> Save to File
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
                {strategyReport ? (
                    <div className="prose prose-sm max-w-none prose-headings:font-serif prose-headings:text-legal-900 prose-p:text-gray-700">
                        <ReactMarkdown>{strategyReport}</ReactMarkdown>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <Shield className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-center max-w-xs">
                            Enter case facts to receive a preliminary legal opinion, SWOT analysis, and recommended strategy.
                        </p>
                    </div>
                )}
            </div>
            
            {!strategyReport && !isAnalyzing && (
                 <div className="absolute bottom-6 left-6 right-6 bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-xs text-yellow-800 flex gap-3">
                    <AlertTriangle className="shrink-0 w-5 h-5" />
                    <p>
                        <strong>Disclaimer:</strong> This tool uses AI to generate strategic insights based on Nigerian law. 
                        It is designed to assist counsel, not replace professional judgment. Always verify statutes and case law citations.
                    </p>
                 </div>
            )}
        </div>
      </div>
    </div>
  );
};