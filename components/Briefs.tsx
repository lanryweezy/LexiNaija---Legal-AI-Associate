import React, { useState } from 'react';
import { Feather, BookOpen, Save, Gavel, Scale, Play, Copy, CheckCircle2 } from 'lucide-react';
import { useLegalStore } from '../contexts/LegalStoreContext';
import { generateLegalArgument } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

export const Briefs: React.FC = () => {
  const { cases, saveDocumentToCase } = useLegalStore();
  const [selectedCaseId, setSelectedCaseId] = useState('');
  
  const [formData, setFormData] = useState({
      issue: '',
      stance: 'Applicant/Claimant',
      jurisdiction: 'High Court of Lagos State',
      facts: ''
  });

  const [argument, setArgument] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Auto-fill facts when case selected
  const handleCaseSelect = (caseId: string) => {
      setSelectedCaseId(caseId);
      const c = cases.find(item => item.id === caseId);
      if (c) {
          setFormData(prev => ({
              ...prev,
              facts: c.notes || '',
              jurisdiction: c.court || prev.jurisdiction
          }));
      }
  };

  const handleGenerate = async () => {
      if (!formData.issue || !formData.facts) {
          alert("Please provide the Legal Issue and Facts.");
          return;
      }
      setIsGenerating(true);
      setArgument('');
      try {
          const result = await generateLegalArgument(formData.issue, formData.stance, formData.facts, formData.jurisdiction);
          setArgument(result);
      } catch (e) {
          alert("Failed to generate argument. Please try again.");
      } finally {
          setIsGenerating(false);
      }
  };

  const handleSave = () => {
      if (!selectedCaseId) {
          alert("Please select a Case File to save this brief to.");
          return;
      }
      if (!argument) return;

      saveDocumentToCase(selectedCaseId, {
          id: Date.now().toString(),
          title: `Argument: ${formData.issue.substring(0, 30)}...`,
          content: argument,
          type: 'Draft',
          createdAt: new Date()
      });
      alert("Saved to Case Documents.");
  };

  const copyToClipboard = () => {
      navigator.clipboard.writeText(argument);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-2rem)] flex flex-col">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-serif font-bold text-legal-900 flex items-center gap-2">
            <Feather className="text-legal-gold" /> Smart Briefs & Advocacy
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            AI-powered drafting for Written Addresses, Motions, and Legal Arguments (IRAC Style).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full overflow-hidden">
        {/* Input Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200 font-bold text-gray-700 flex items-center gap-2">
                <Scale size={18} /> Argument Parameters
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Link to Matter</label>
                    <select 
                        value={selectedCaseId}
                        onChange={e => handleCaseSelect(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-legal-gold outline-none"
                    >
                        <option value="">-- Select Case File --</option>
                        {cases.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Issue for Determination</label>
                    <input 
                        type="text"
                        value={formData.issue}
                        onChange={e => setFormData({...formData, issue: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-legal-gold outline-none"
                        placeholder="e.g. Whether the Claimant has locus standi to institute this action."
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Argue In Favor Of</label>
                        <select 
                            value={formData.stance}
                            onChange={e => setFormData({...formData, stance: e.target.value})}
                            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-legal-gold outline-none"
                        >
                            <option>Applicant/Claimant</option>
                            <option>Respondent/Defendant</option>
                            <option>Appellant</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Court / Forum</label>
                        <input 
                            type="text"
                            value={formData.jurisdiction}
                            onChange={e => setFormData({...formData, jurisdiction: e.target.value})}
                            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-legal-gold outline-none"
                            placeholder="e.g. Court of Appeal"
                        />
                    </div>
                </div>

                <div className="flex-1 flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Relevant Facts</label>
                    <textarea 
                        value={formData.facts}
                        onChange={e => setFormData({...formData, facts: e.target.value})}
                        placeholder="Summarize the specific facts that support this argument..."
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-legal-gold outline-none resize-none flex-1 min-h-[150px]"
                    />
                </div>

                <button 
                    onClick={handleGenerate}
                    disabled={isGenerating || !formData.issue}
                    className="w-full bg-legal-900 text-white py-3 rounded-lg font-medium hover:bg-legal-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                    {isGenerating ? (
                        <>Drafting Argument...</>
                    ) : (
                        <><Play size={18} fill="currentColor" /> Generate Argument</>
                    )}
                </button>
            </div>
        </div>

        {/* Output Panel */}
        <div className="bg-gray-50 rounded-xl shadow-inner border border-gray-200 flex flex-col overflow-hidden">
            <div className="p-4 bg-white border-b border-gray-200 flex justify-between items-center">
                <span className="font-bold text-legal-900 flex items-center gap-2">
                    <Gavel size={18} className="text-legal-gold"/> Drafted Argument
                </span>
                <div className="flex gap-2">
                    <button 
                        onClick={copyToClipboard}
                        disabled={!argument}
                        className="text-sm text-gray-500 hover:text-legal-900 flex items-center gap-1 disabled:opacity-50"
                    >
                        {copySuccess ? <CheckCircle2 size={16} className="text-green-600"/> : <Copy size={16} />}
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={!argument || !selectedCaseId}
                        className="text-sm text-legal-700 hover:text-legal-900 flex items-center gap-1 disabled:opacity-50"
                    >
                        <Save size={16} /> Save to Case
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 bg-white">
                {argument ? (
                    <div className="prose prose-sm max-w-none prose-headings:font-serif prose-headings:text-legal-900 prose-p:text-gray-800 prose-li:text-gray-800">
                        <ReactMarkdown>{argument}</ReactMarkdown>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <BookOpen className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-center max-w-xs">
                            Define an issue and facts to generate a structured legal argument with citations.
                        </p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};