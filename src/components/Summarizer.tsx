import React, { useState } from 'react';
import { UploadCloud, BookOpen, ChevronRight, AlertTriangle, Save } from 'lucide-react';
import { summarizeCaseText } from '../services/geminiService';
import { CaseSummary } from '../types';
import { useLegalStore } from '../contexts/LegalStoreContext';
import { useToast } from '../contexts/ToastContext';

export const Summarizer: React.FC = () => {
  const { showToast } = useToast();
  const { cases, saveDocumentToCase, consumeCredits, creditsTotal, creditsUsed } = useLegalStore();
  const [text, setText] = useState('');
  const [summary, setSummary] = useState<CaseSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState('');

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    if (!consumeCredits(3)) {
      showToast("Insufficient Intelligence Credits.", "error");
      return;
    }
    setIsLoading(true);
    setSummary(null);
    try {
      const result = await summarizeCaseText(text);
      setSummary(result);
      showToast("Cognitive extraction complete.", "success");
    } catch (error) {
      showToast("Analysis protocol failure.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToCase = () => {
    if (selectedCase && summary) {
        saveDocumentToCase(selectedCase, {
            id: Date.now().toString(),
            title: `Summary: ${summary.title}`,
            content: `Ratio: ${summary.ratioDecidendi}\n\nSummary: ${summary.summary}`,
            type: 'Summary',
            createdAt: new Date()
        });
        setShowSaveModal(false);
        showToast("Analysis archived to matter file.", "success");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col h-[calc(100vh-2rem)] animate-in fade-in duration-1000">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-black text-legal-gold uppercase tracking-[0.3em] mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-legal-gold animate-pulse"></div>
              Case analyzer
          </div>
          <h2 className="text-5xl font-serif font-black text-legal-900 italic tracking-tighter leading-tight">Judgment Deep-Read</h2>
          <p className="text-slate-400 font-medium">Extract Ratio Decidendi and cognitive summaries from raw legal text.</p>
        </div>
        <div className="px-6 py-3 bg-slate-900 rounded-2xl flex items-center gap-4 shadow-xl shrink-0">
            <span className="text-[10px] font-black text-legal-gold uppercase tracking-widest">Neural Balance</span>
            <span className="text-sm font-black text-white italic tracking-tighter">{creditsTotal - creditsUsed} CR</span>
        </div>
      </header>

      <div className="bg-white/70 backdrop-blur-xl rounded-[40px] shadow-2xl border border-white p-10 mb-10 flex flex-col">
        <div className="flex justify-between items-center mb-6">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                <FileSearch size={14} className="text-legal-gold" /> Raw Text Input Protocol
            </label>
            <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                <ShieldCheck size={12} /> Secure Extraction
            </div>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste judgment body or legal submissions here for AI-powered synthesis..."
          className="w-full h-48 p-8 bg-slate-50 border border-slate-100 rounded-[32px] text-lg font-serif italic text-legal-900 focus:bg-white focus:ring-4 focus:ring-legal-gold/5 outline-none transition-all resize-none shadow-inner"
        />
        <div className="flex justify-between items-center mt-8">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
            <AlertTriangle size={14} className="text-amber-500" /> Verify against Certified True Copy (CTC)
          </p>
          <button
            onClick={handleAnalyze}
            disabled={isLoading || !text}
            className="bg-legal-900 text-white px-10 py-5 rounded-[22px] font-black uppercase tracking-widest text-[11px] hover:bg-legal-gold hover:text-legal-900 disabled:opacity-20 shadow-2xl shadow-legal-900/20 transition-all flex items-center gap-4 group active:scale-95"
          >
            {isLoading ? <RefreshCw size={18} className="animate-spin" /> : <Zap size={18} className="group-hover:scale-125 transition-transform" />}
            {isLoading ? 'Synthesizing...' : 'Initialize Analysis'}
          </button>
        </div>
      </div>

      {summary && (
        <div className="flex-1 overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-700">
          <div className="h-full bg-white/70 backdrop-blur-xl rounded-[48px] shadow-2xl border border-white flex flex-col overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white/30">
                <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-legal-900 rounded-[20px] flex items-center justify-center shadow-lg">
                        <BookOpen size={24} className="text-legal-gold" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-serif font-black italic tracking-tighter text-legal-900">{summary.title}</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Extraction Protocol: Active</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowSaveModal(true)}
                    className="flex items-center gap-3 bg-legal-900 text-white px-8 py-4 rounded-[20px] font-black uppercase tracking-widest text-[10px] hover:bg-legal-gold hover:text-legal-900 transition-all shadow-xl active:scale-95 group"
                >
                    <Bookmark size={18} className="group-hover:-translate-y-1 transition-transform" /> Archive to Matter
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-12 scrollbar-hide">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-10">
                    <section>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-4">
                            <span className="w-8 h-[2px] bg-legal-gold"></span>
                            Ratio Decidendi
                        </h4>
                        <div className="bg-slate-50 p-10 rounded-[40px] border border-slate-100 shadow-inner">
                            <p className="text-2xl font-serif italic text-legal-900 leading-relaxed tracking-tight">
                                "{summary.ratioDecidendi}"
                            </p>
                        </div>
                    </section>

                    <section>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Executive Summary</h4>
                        <p className="text-lg font-medium text-slate-600 leading-relaxed italic">
                            {summary.summary}
                        </p>
                    </section>
                </div>

                <div className="lg:col-span-4">
                    <div className="bg-legal-900 p-8 rounded-[40px] shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-legal-gold opacity-10 rounded-full translate-x-12 -translate-y-12"></div>
                        <h4 className="text-[10px] font-black text-legal-gold uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                            <Shield size={14} /> Relevant Statutes
                        </h4>
                        <div className="space-y-3">
                            {summary.relevantStatutes.map((statute, idx) => (
                                <div key={idx} className="flex items-start gap-3 p-3 bg-white/5 border border-white/10 rounded-xl group hover:bg-white/10 transition-colors">
                                    <div className="w-1.5 h-1.5 rounded-full bg-legal-gold mt-1.5 shrink-0"></div>
                                    <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">{statute}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSaveModal && (
          <div className="fixed inset-0 bg-legal-900/40 backdrop-blur-sm flex items-center justify-center z-[10000] p-4 text-left">
              <div className="bg-white rounded-[40px] p-10 w-full max-w-md shadow-[0_80px_120px_-20px_rgba(0,0,0,0.4)] animate-in fade-in zoom-in-95 duration-500">
                  <div className="flex justify-between items-center mb-8 border-b border-slate-50 pb-6">
                      <div>
                        <h3 className="font-serif font-black text-2xl text-legal-900 italic tracking-tight">Archive Analysis</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Registry Deposition Protocol</p>
                      </div>
                      <button onClick={() => setShowSaveModal(false)} className="text-slate-300 hover:text-slate-600">
                        <X size={24} />
                      </button>
                  </div>
                  <div className="space-y-6">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Target Matter Index</label>
                        <select
                            className="w-full bg-slate-50 border border-slate-100 p-6 rounded-[24px] font-bold text-legal-900 focus:ring-4 focus:ring-legal-gold/5 outline-none appearance-none cursor-pointer transition-all shadow-inner"
                            value={selectedCase}
                            onChange={e => setSelectedCase(e.target.value)}
                        >
                            <option value="">-- Choose Litigation File --</option>
                            {cases.map(c => (
                                <option key={c.id} value={c.id}>{c.title}</option>
                            ))}
                        </select>
                      </div>
                      <div className="flex gap-4 pt-6">
                          <button onClick={() => setShowSaveModal(false)} className="flex-1 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Abort</button>
                          <button
                            onClick={handleSaveToCase}
                            disabled={!selectedCase}
                            className="flex-[2] bg-legal-900 text-white rounded-[20px] font-black uppercase tracking-widest text-[11px] hover:bg-legal-gold hover:text-legal-900 shadow-2xl shadow-legal-900/20 transition-all disabled:opacity-20 py-5"
                          >
                            Commit to File
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

const FileSearch = ({ size, className }: { size?: number, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M4 22V4c0-1.1.9-2 2-2h8.5L20 7.5V22H4z" />
        <path d="M14 2v6h6" />
        <circle cx="11.5" cy="15.5" r="2.5" />
        <path d="M16.5 20.5 14 18" />
    </svg>
);

const Shield = ({ size, className }: { size?: number, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);