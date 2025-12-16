import React, { useState } from 'react';
import { UserCheck, MessageSquare, Zap, Gavel, Save, AlertCircle } from 'lucide-react';
import { useLegalStore } from '../contexts/LegalStoreContext';
import { analyzeWitnessStatement } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

export const Witness: React.FC = () => {
  const { cases, saveDocumentToCase } = useLegalStore();
  const [statement, setStatement] = useState('');
  const [opposingRole, setOpposingRole] = useState('Opposing Party');
  const [analysis, setAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState('');

  const handleAnalyze = async () => {
    if (!statement.trim()) {
      alert("Please paste the Witness Statement text.");
      return;
    }
    setIsAnalyzing(true);
    setAnalysis('');
    try {
      const result = await analyzeWitnessStatement(statement, opposingRole);
      setAnalysis(result);
    } catch (e) {
      alert("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveToCase = () => {
    if (!selectedCaseId) {
        alert("Please select a case to save this analysis to.");
        return;
    }
    if (!analysis) return;

    saveDocumentToCase(selectedCaseId, {
        id: Date.now().toString(),
        title: `Cross-Exam Strategy - ${opposingRole} - ${new Date().toLocaleDateString()}`,
        content: `**WITNESS STATEMENT EXCERPT:**\n${statement.substring(0, 500)}...\n\n---\n\n${analysis}`,
        type: 'Research',
        createdAt: new Date()
    });
    alert("Analysis saved to Case Documents.");
  };

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-2rem)] flex flex-col">
      <div className="mb-6 flex justify-between items-end">
        <div>
            <h2 className="text-2xl font-serif font-bold text-legal-900 flex items-center gap-2">
                <UserCheck className="text-legal-gold" /> Witness Companion
            </h2>
            <p className="text-gray-500 text-sm mt-1">Analyze Witness Statements on Oath for Hearsay and generate Cross-Examination questions.</p>
        </div>
        <div className="flex gap-2">
            <select 
                value={selectedCaseId}
                onChange={e => setSelectedCaseId(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-legal-gold outline-none w-64"
            >
                <option value="">-- Associate with Case (Optional) --</option>
                {cases.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full overflow-hidden">
        {/* Input Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <span className="font-bold text-gray-700 flex items-center gap-2">
                    <MessageSquare size={16} /> Statement Input
                </span>
                <select 
                    value={opposingRole}
                    onChange={e => setOpposingRole(e.target.value)}
                    className="text-xs border border-gray-300 rounded p-1"
                >
                    <option value="Claimant">Witness for Claimant</option>
                    <option value="Defendant">Witness for Defendant</option>
                    <option value="Prosecution">Prosecution Witness</option>
                </select>
            </div>
            <div className="p-4 flex-1 flex flex-col">
                <textarea 
                    value={statement}
                    onChange={e => setStatement(e.target.value)}
                    placeholder="Paste the text of the Witness Statement on Oath here..."
                    className="flex-1 w-full border border-gray-200 rounded-lg p-4 focus:ring-2 focus:ring-legal-gold outline-none resize-none font-mono text-sm leading-relaxed"
                    spellCheck={false}
                />
                <button 
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !statement}
                    className="mt-4 w-full bg-legal-900 text-white py-3 rounded-lg font-medium hover:bg-legal-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                    {isAnalyzing ? (
                        <>Analyzing Evidence Act compliance...</>
                    ) : (
                        <><Zap size={18} fill="currentColor" /> Generate Cross-Examination Strategy</>
                    )}
                </button>
            </div>
        </div>

        {/* Output Panel */}
        <div className="bg-gray-50 rounded-xl shadow-inner border border-gray-200 flex flex-col overflow-hidden relative">
            <div className="p-4 bg-white border-b border-gray-200 flex justify-between items-center">
                <span className="font-bold text-legal-900 flex items-center gap-2">
                    <Gavel size={18} className="text-legal-gold"/> Strategic Report
                </span>
                <button 
                    onClick={handleSaveToCase}
                    disabled={!analysis || !selectedCaseId}
                    className="text-sm text-legal-700 hover:text-legal-900 flex items-center gap-1 disabled:opacity-50"
                >
                    <Save size={16} /> Save
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8">
                {analysis ? (
                    <div className="prose prose-sm max-w-none prose-headings:font-serif prose-headings:text-legal-900 prose-p:text-gray-700">
                        <ReactMarkdown>{analysis}</ReactMarkdown>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <UserCheck className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-center max-w-xs">
                            Paste a statement to identify Hearsay (S.38 Evidence Act) and generate leading questions.
                        </p>
                    </div>
                )}
            </div>

            {!analysis && (
                 <div className="absolute bottom-6 left-6 right-6 bg-blue-50 border border-blue-200 p-4 rounded-lg text-xs text-blue-800 flex gap-3">
                    <AlertCircle className="shrink-0 w-5 h-5" />
                    <p>
                        <strong>Tip:</strong> You can paste scanned text (OCR) here. The AI is trained to detect when a witness is giving evidence on facts they did not personally witness.
                    </p>
                 </div>
            )}
        </div>
      </div>
    </div>
  );
};