import React, { useState } from 'react';
import { Building2, FileCheck, HelpCircle, PenTool, Copy, Save, Sparkles, Building, Play } from 'lucide-react';
import { useLegalStore } from '../contexts/LegalStoreContext';
import { generateCorporateObjects, generateCorporateResolution, generateComplianceAdvice } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

type Tab = 'objects' | 'resolutions' | 'compliance';

export const Corporate: React.FC = () => {
  const { cases, saveDocumentToCase } = useLegalStore();
  const [activeTab, setActiveTab] = useState<Tab>('objects');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  
  // Objects State
  const [bizDesc, setBizDesc] = useState('');

  // Resolution State
  const [resCompany, setResCompany] = useState('');
  const [resAction, setResAction] = useState('');
  const [resDirectors, setResDirectors] = useState('');
  const [resType, setResType] = useState<'Board' | 'General'>('Board');

  // Compliance State
  const [compQuery, setCompQuery] = useState('');

  const [selectedCaseId, setSelectedCaseId] = useState('');

  const handleGenerate = async () => {
    setIsLoading(true);
    setResult('');
    try {
        let output = '';
        if (activeTab === 'objects') {
            if (!bizDesc) { alert('Enter business description'); setIsLoading(false); return; }
            output = await generateCorporateObjects(bizDesc);
        } else if (activeTab === 'resolutions') {
            if (!resCompany || !resAction) { alert('Enter company details'); setIsLoading(false); return; }
            output = await generateCorporateResolution(resAction, resCompany, resDirectors, resType);
        } else if (activeTab === 'compliance') {
            if (!compQuery) { alert('Enter query'); setIsLoading(false); return; }
            output = await generateComplianceAdvice(compQuery);
        }
        setResult(output);
    } catch (e) {
        alert("Operation failed. Try again.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleSave = () => {
      if (!selectedCaseId) {
          alert("Select a case/client file to save to.");
          return;
      }
      if (!result) return;
      
      const title = activeTab === 'objects' ? 'MoU Objects Clause' : activeTab === 'resolutions' ? 'Board Resolution' : 'Compliance Advisory';

      saveDocumentToCase(selectedCaseId, {
          id: Date.now().toString(),
          title: `${title} - ${new Date().toLocaleDateString()}`,
          content: result,
          type: 'Draft',
          createdAt: new Date()
      });
      alert("Saved to Documents.");
  };

  const copyToClipboard = () => {
      navigator.clipboard.writeText(result);
      alert("Copied to clipboard.");
  };

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-2rem)] flex flex-col">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-serif font-bold text-legal-900 flex items-center gap-2">
            <Building2 className="text-legal-gold" /> Corporate Assistant (CAC)
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Automate CAMA 2020 compliance, draft resolutions, and generate object clauses.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full overflow-hidden">
        {/* Left Panel: Inputs */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
            <div className="flex border-b border-gray-200">
                <button 
                    onClick={() => { setActiveTab('objects'); setResult(''); }}
                    className={`flex-1 py-3 text-sm font-medium flex justify-center items-center gap-2 ${activeTab === 'objects' ? 'bg-legal-50 text-legal-900 border-b-2 border-legal-gold' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    <PenTool size={16}/> Objects
                </button>
                <button 
                    onClick={() => { setActiveTab('resolutions'); setResult(''); }}
                    className={`flex-1 py-3 text-sm font-medium flex justify-center items-center gap-2 ${activeTab === 'resolutions' ? 'bg-legal-50 text-legal-900 border-b-2 border-legal-gold' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    <FileCheck size={16}/> Resolutions
                </button>
                <button 
                    onClick={() => { setActiveTab('compliance'); setResult(''); }}
                    className={`flex-1 py-3 text-sm font-medium flex justify-center items-center gap-2 ${activeTab === 'compliance' ? 'bg-legal-50 text-legal-900 border-b-2 border-legal-gold' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    <HelpCircle size={16}/> Advisory
                </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto space-y-6">
                {activeTab === 'objects' && (
                    <div className="space-y-4 animate-in fade-in">
                        <label className="block text-sm font-medium text-gray-700">Business Description</label>
                        <textarea 
                            value={bizDesc}
                            onChange={e => setBizDesc(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-3 h-48 focus:ring-2 focus:ring-legal-gold outline-none resize-none"
                            placeholder="e.g. A company dealing in oil and gas logistics, haulage, and general procurement."
                        />
                        <p className="text-xs text-gray-500">
                            The AI will generate standard legal object clauses suitable for the Memorandum of Association.
                        </p>
                    </div>
                )}

                {activeTab === 'resolutions' && (
                    <div className="space-y-4 animate-in fade-in">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                            <input 
                                type="text"
                                value={resCompany}
                                onChange={e => setResCompany(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-legal-gold outline-none"
                                placeholder="e.g. Globex Nigeria Ltd"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Resolution Type</label>
                            <select 
                                value={resType} 
                                onChange={e => setResType(e.target.value as any)}
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-legal-gold outline-none"
                            >
                                <option value="Board">Board Resolution</option>
                                <option value="General">General Meeting Resolution</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Action to be Resolved</label>
                            <textarea 
                                value={resAction}
                                onChange={e => setResAction(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-3 h-24 focus:ring-2 focus:ring-legal-gold outline-none resize-none"
                                placeholder="e.g. To open a corporate account with Zenith Bank with specific signatories..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Directors/Members Present</label>
                            <input 
                                type="text"
                                value={resDirectors}
                                onChange={e => setResDirectors(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-legal-gold outline-none"
                                placeholder="e.g. John Doe, Jane Smith"
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'compliance' && (
                    <div className="space-y-4 animate-in fade-in">
                         <label className="block text-sm font-medium text-gray-700">Compliance Query (CAMA 2020)</label>
                         <textarea 
                            value={compQuery}
                            onChange={e => setCompQuery(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-3 h-48 focus:ring-2 focus:ring-legal-gold outline-none resize-none"
                            placeholder="e.g. What is the minimum share capital for a company with foreign participation? Or deadlines for Annual Returns."
                        />
                    </div>
                )}

                <button 
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-full bg-legal-900 text-white py-3 rounded-lg font-medium hover:bg-legal-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                    {isLoading ? <Sparkles className="animate-spin" size={18}/> : <Play size={18} fill="currentColor"/>}
                    {isLoading ? 'Processing...' : 'Generate Content'}
                </button>
            </div>
        </div>

        {/* Right Panel: Output */}
        <div className="lg:col-span-2 bg-gray-50 rounded-xl shadow-inner border border-gray-200 flex flex-col overflow-hidden relative">
             <div className="p-4 bg-white border-b border-gray-200 flex justify-between items-center">
                <span className="font-bold text-legal-900 flex items-center gap-2">
                    <Building size={18} className="text-legal-gold"/> Generated Output
                </span>
                <div className="flex gap-2">
                    {result && (
                        <div className="flex items-center gap-2 mr-4">
                            <select 
                                value={selectedCaseId}
                                onChange={e => setSelectedCaseId(e.target.value)}
                                className="text-xs border border-gray-300 rounded p-1.5 w-48"
                            >
                                <option value="">-- Select File to Save --</option>
                                {cases.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                            </select>
                        </div>
                    )}
                    <button 
                        onClick={copyToClipboard}
                        disabled={!result}
                        className="text-sm text-gray-500 hover:text-legal-900 flex items-center gap-1 disabled:opacity-50"
                    >
                        <Copy size={16} />
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={!result || !selectedCaseId}
                        className="text-sm text-legal-700 hover:text-legal-900 flex items-center gap-1 disabled:opacity-50"
                    >
                        <Save size={16} /> Save
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 bg-white">
                {result ? (
                    <div className="prose prose-sm max-w-none prose-headings:font-serif prose-headings:text-legal-900 prose-p:text-gray-800 prose-li:text-gray-800">
                        <ReactMarkdown>{result}</ReactMarkdown>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <Building2 className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-center max-w-xs">
                            {activeTab === 'objects' && "Enter a business description to generate MemArt Object Clauses."}
                            {activeTab === 'resolutions' && "Input resolution details to draft a formal Board or General meeting document."}
                            {activeTab === 'compliance' && "Ask about CAMA 2020 requirements or post-incorporation filing procedures."}
                        </p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};