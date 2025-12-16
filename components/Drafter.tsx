import React, { useState } from 'react';
import { FileText, Download, Copy, RefreshCw, CheckCircle2, Save, X, Sparkles, Plus } from 'lucide-react';
import { draftContract, getClauseSuggestions } from '../services/geminiService';
import { ContractParams } from '../types';
import { useLegalStore } from '../contexts/LegalStoreContext';
import ReactMarkdown from 'react-markdown';

export const Drafter: React.FC = () => {
  const { cases, saveDocumentToCase } = useLegalStore();
  const [params, setParams] = useState<ContractParams>({
    type: 'Tenancy Agreement',
    partyA: '',
    partyB: '',
    jurisdiction: 'Lagos State',
    keyTerms: ''
  });
  const [generatedDraft, setGeneratedDraft] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState('');
  const [saveTitle, setSaveTitle] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const handleDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDrafting(true);
    setGeneratedDraft('');
    try {
      const result = await draftContract(params);
      setGeneratedDraft(result);
    } catch (error) {
      alert("Failed to draft contract. Please check parameters.");
    } finally {
      setIsDrafting(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedDraft);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const openSaveModal = () => {
    setSaveTitle(`${params.type} - Draft`);
    setShowSaveModal(true);
  };

  const handleSaveToCase = () => {
    if (selectedCase && generatedDraft && saveTitle) {
        saveDocumentToCase(selectedCase, {
            id: Date.now().toString(),
            title: saveTitle,
            content: generatedDraft,
            type: 'Draft',
            createdAt: new Date()
        });
        setShowSaveModal(false);
        setSaveTitle('');
        setSelectedCase('');
        alert("Saved to Case File successfully!");
    }
  };

  const handleGetSuggestions = async () => {
    setLoadingSuggestions(true);
    setSuggestions([]);
    try {
        const results = await getClauseSuggestions(params.type);
        setSuggestions(results);
    } catch(e) {
        console.error("Failed to get suggestions");
    } finally {
        setLoadingSuggestions(false);
    }
  };

  const addSuggestion = (suggestion: string) => {
    setParams(prev => ({
        ...prev,
        keyTerms: prev.keyTerms ? `${prev.keyTerms}\n- Include a ${suggestion}` : `- Include a ${suggestion}`
    }));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-2rem)] overflow-hidden">
      {/* Input Panel */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col overflow-y-auto">
        <h2 className="text-2xl font-serif font-bold text-legal-900 mb-6">Smart Drafter</h2>
        <form onSubmit={handleDraft} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contract Type</label>
            <select 
              value={params.type}
              onChange={e => {
                  setParams({...params, type: e.target.value});
                  setSuggestions([]);
              }}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-legal-gold focus:ring-legal-gold p-2 border"
            >
              <option>Tenancy Agreement (Residential)</option>
              <option>Tenancy Agreement (Commercial)</option>
              <option>Employment Contract</option>
              <option>Deed of Assignment (Land)</option>
              <option>Memorandum of Understanding (MoU)</option>
              <option>Service Level Agreement</option>
              <option>Non-Disclosure Agreement</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Party A (e.g., Landlord)</label>
              <input 
                required
                type="text" 
                value={params.partyA}
                onChange={e => setParams({...params, partyA: e.target.value})}
                placeholder="Full Name / Company"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-legal-gold focus:ring-legal-gold p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Party B (e.g., Tenant)</label>
              <input 
                required
                type="text" 
                value={params.partyB}
                onChange={e => setParams({...params, partyB: e.target.value})}
                placeholder="Full Name / Company"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-legal-gold focus:ring-legal-gold p-2 border"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jurisdiction</label>
            <input 
              required
              type="text" 
              value={params.jurisdiction}
              onChange={e => setParams({...params, jurisdiction: e.target.value})}
              placeholder="e.g., Lagos State, FCT Abuja"
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-legal-gold focus:ring-legal-gold p-2 border"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">Key Terms & Specific Clauses</label>
              <button 
                type="button" 
                onClick={handleGetSuggestions}
                disabled={loadingSuggestions}
                className="text-xs flex items-center gap-1 text-legal-gold hover:text-yellow-600 font-medium disabled:opacity-50"
              >
                <Sparkles size={12} />
                {loadingSuggestions ? 'Analyzing...' : 'Suggest Clauses'}
              </button>
            </div>
            <textarea 
              required
              value={params.keyTerms}
              onChange={e => setParams({...params, keyTerms: e.target.value})}
              rows={5}
              placeholder="e.g., Rent is N2,000,000 per annum, 2 years upfront. Tenant must pay service charge. Jurisdiction clause should favor Lagos High Court."
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-legal-gold focus:ring-legal-gold p-2 border resize-none"
            />
            {suggestions.length > 0 && (
              <div className="mt-2 animate-in fade-in slide-in-from-top-2">
                <p className="text-xs text-gray-500 mb-1.5 font-medium">Click to include standard clauses:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((s, i) => (
                    <button 
                      key={i}
                      type="button"
                      onClick={() => addSuggestion(s)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-legal-50 text-legal-800 border border-legal-200 hover:bg-legal-100 transition-colors"
                    >
                      <Plus size={10} /> {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={isDrafting}
            className="w-full flex items-center justify-center gap-2 bg-legal-900 text-white py-3 rounded-lg hover:bg-legal-800 transition-all font-medium disabled:opacity-70"
          >
            {isDrafting ? (
              <>
                <RefreshCw className="animate-spin w-5 h-5" /> Drafting...
              </>
            ) : (
              <>
                <FileText className="w-5 h-5" /> Generate Document
              </>
            )}
          </button>
        </form>
      </div>

      {/* Output Panel */}
      <div className="bg-gray-50 rounded-xl shadow-inner border border-gray-200 flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
          <span className="text-sm font-medium text-gray-500">Preview Mode</span>
          <div className="flex gap-2">
            <button 
                onClick={openSaveModal}
                disabled={!generatedDraft}
                className="p-2 hover:bg-gray-100 rounded text-legal-gold transition-colors flex items-center gap-1 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Save className="w-4 h-4" /> Save
            </button>
            <button 
              onClick={copyToClipboard}
              disabled={!generatedDraft}
              className="p-2 hover:bg-gray-100 rounded text-gray-600 transition-colors flex items-center gap-1 disabled:opacity-50"
            >
              {copySuccess ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            </button>
            <button 
              disabled={!generatedDraft}
              className="p-2 hover:bg-gray-100 rounded text-gray-600 transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-8 font-serif leading-relaxed text-legal-900 bg-white">
          {generatedDraft ? (
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown>{generatedDraft}</ReactMarkdown>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <FileText className="w-16 h-16 mb-4 opacity-20" />
              <p>Document preview will appear here.</p>
            </div>
          )}
        </div>
      </div>

      {showSaveModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-legal-900">Save to Case File</h3>
                    <button onClick={() => setShowSaveModal(false)} className="text-gray-400 hover:text-gray-600">
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Select Matter</label>
                      <select 
                          className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-legal-gold outline-none"
                          value={selectedCase}
                          onChange={e => setSelectedCase(e.target.value)}
                      >
                          <option value="">-- Choose Case --</option>
                          {cases.map(c => (
                              <option key={c.id} value={c.id}>{c.title}</option>
                          ))}
                      </select>
                      {cases.length === 0 && <p className="text-xs text-red-500 mt-1">No active cases found. Please create a case first.</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Document Title</label>
                      <input 
                        type="text" 
                        className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-legal-gold outline-none"
                        value={saveTitle}
                        onChange={e => setSaveTitle(e.target.value)}
                        placeholder="e.g. Tenancy Agreement - Draft 1"
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button onClick={() => setShowSaveModal(false)} className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100">Cancel</button>
                        <button 
                          onClick={handleSaveToCase} 
                          disabled={!selectedCase || !saveTitle} 
                          className="flex-1 px-4 py-2 text-sm font-medium text-white bg-legal-900 rounded-lg hover:bg-legal-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Save Document
                        </button>
                    </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};