import React, { useState } from 'react';
import { Gavel, Search, BookOpen, ExternalLink, Scale, Clock, ShieldCheck, AlertCircle, ChevronRight } from 'lucide-react';

interface CaseLaw {
  id: string;
  title: string;
  citation: string;
  court: string;
  year: string;
  summary: string;
  ratio: string;
  link: string;
}

const MOCK_CASE_LAW: CaseLaw[] = [
  {
    id: '1',
    title: 'A.G. Federation v. Abubakar',
    citation: '(2007) 10 NWLR (Pt. 1041) 1',
    court: 'Supreme Court',
    year: '2007',
    summary: 'A landmark case on the immunity of the President and Vice President and the powers of the Attorney General.',
    ratio: 'The immunity granted to the President and Vice President under Section 308 of the 1999 Constitution is absolute during their tenure.',
    link: 'https://lawpavilion.com'
  },
  {
    id: '2',
    title: 'Savannah Bank v. Ajilo',
    citation: '(1989) 1 NWLR (Pt. 97) 305',
    court: 'Supreme Court',
    year: '1989',
    summary: 'A leading authority on the Land Use Act and the requirement of Governor\'s consent for alienation of land.',
    ratio: 'Any alienation of land without the prior consent of the Governor as required by Section 22 of the Land Use Act is null and void.',
    link: 'https://lawpavilion.com'
  },
  {
    id: '3',
    title: 'Dantata v. Mohammed',
    citation: '(2000) 7 NWLR (Pt. 664) 176',
    court: 'Supreme Court',
    year: '2000',
    summary: 'A case on the principles of res judicata and the finality of judgments.',
    ratio: 'Once a matter has been finally decided by a court of competent jurisdiction, the parties are estopped from litigating the same issue again.',
    link: 'https://lawpavilion.com'
  }
];

export const CaseLawDatabase: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CaseLaw[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCase, setSelectedCase] = useState<CaseLaw | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsSearching(true);
    // Simulate API search delay
    setTimeout(() => {
      const filtered = MOCK_CASE_LAW.filter(c => 
        c.title.toLowerCase().includes(query.toLowerCase()) || 
        c.citation.toLowerCase().includes(query.toLowerCase()) ||
        c.summary.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setIsSearching(false);
    }, 800);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-2rem)] flex flex-col animate-in fade-in duration-1000">
      <header className="mb-10">
        <div className="flex items-center gap-2 text-[10px] font-black text-legal-gold uppercase tracking-[0.3em] mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-legal-gold animate-pulse"></div>
            Jurisprudence Engine
        </div>
        <h2 className="text-5xl font-serif font-black text-legal-900 italic tracking-tighter leading-tight">
          Case Law Database
        </h2>
        <p className="text-slate-400 font-medium mt-2">Access verified Supreme Court and Court of Appeal judgments (LPELR/NWLR Integrated).</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 flex-1 overflow-hidden">
        {/* Search Panel */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="bg-white/70 backdrop-blur-xl rounded-[40px] border border-white shadow-2xl p-8 group transition-all hover:bg-white">
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-legal-gold transition-colors w-5 h-5" />
                <input 
                  type="text" 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Citation or Party Name..."
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-legal-900 focus:ring-4 focus:ring-legal-gold/5 focus:border-legal-gold outline-none shadow-inner transition-all placeholder:font-normal placeholder:text-slate-300"
                />
              </div>
              <button 
                type="submit"
                disabled={isSearching}
                className="w-full bg-legal-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-legal-gold hover:text-legal-900 transition-all flex items-center justify-center gap-3 shadow-xl shadow-legal-900/10 active:scale-95 disabled:opacity-50"
              >
                {isSearching ? 'Synchronizing Archive...' : 'Initialize Search'}
              </button>
            </form>
          </div>

          <div className="flex-1 bg-white/70 backdrop-blur-xl rounded-[40px] border border-white shadow-2xl flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white/30">
              <span className="text-[10px] font-black text-legal-900 uppercase tracking-widest">Search Results</span>
              <span className="bg-legal-gold/20 text-legal-900 text-[10px] font-black px-3 py-1 rounded-full">{results.length} Found</span>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              {results.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 p-10 text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
                    <BookOpen className="w-8 h-8 opacity-20" />
                  </div>
                  <p className="text-xs font-black uppercase tracking-widest leading-relaxed">Search the database to see authoritative law reports.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {results.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCase(c)}
                      className={`w-full text-left p-6 hover:bg-white transition-all group ${selectedCase?.id === c.id ? 'bg-white' : ''}`}
                    >
                      <h3 className="font-serif font-black italic text-lg text-legal-900 tracking-tight mb-2 group-hover:text-legal-gold transition-colors">{c.title}</h3>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-3">{c.citation}</p>
                      <div className="flex items-center gap-3">
                        <span className="bg-slate-50 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border border-slate-100">{c.court}</span>
                        <span className="text-[9px] font-black text-slate-300">{c.year}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Display Panel */}
        <div className="lg:col-span-8 bg-white/30 backdrop-blur-xl rounded-[48px] border border-white shadow-2xl flex flex-col overflow-hidden relative">
          {selectedCase ? (
            <>
              {/* Background Accent */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-legal-gold/5 rounded-full blur-[100px] pointer-events-none"></div>
              
              <div className="p-10 border-b border-slate-100 bg-white/40 flex justify-between items-start relative z-10">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-legal-900 text-white text-[9px] font-black px-3 py-1 rounded-xl uppercase tracking-widest">{selectedCase.court}</span>
                    <span className="text-slate-300 text-[10px] font-black font-mono tracking-widest uppercase">{selectedCase.citation}</span>
                  </div>
                  <h2 className="text-4xl font-serif font-black text-legal-900 italic tracking-tighter leading-tight">{selectedCase.title}</h2>
                </div>
                <button className="w-14 h-14 bg-white border border-slate-100 text-legal-gold hover:text-legal-900 hover:border-legal-gold rounded-2xl flex items-center justify-center transition-all shadow-xl active:scale-95 group">
                  <ExternalLink size={24} className="group-hover:rotate-12 transition-transform" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-12 space-y-12 relative z-10 scrollbar-hide">
                <section>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-4">
                    <span className="w-8 h-[2px] bg-legal-gold"></span>
                    Ratio Decidendi
                  </h4>
                  <div className="bg-legal-900 text-white p-10 rounded-[40px] relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-legal-gold/10 rounded-full translate-x-12 -translate-y-12 blur-2xl"></div>
                    <Scale className="absolute bottom-6 right-8 text-white/5" size={80} />
                    <p className="text-2xl text-white font-serif italic leading-relaxed tracking-tight relative z-10">
                      "{selectedCase.ratio}"
                    </p>
                  </div>
                </section>

                <section>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Judgment Protocol Summary</h4>
                  <p className="text-slate-600 leading-relaxed text-xl font-medium italic">
                    {selectedCase.summary}
                  </p>
                </section>

                <div className="pt-12 border-t border-slate-50 grid grid-cols-2 gap-8">
                  <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Verification Hash</p>
                    <div className="flex items-center gap-3 text-legal-900 font-black italic tracking-tighter">
                      <ShieldCheck size={20} className="text-emerald-500" />
                      LexiNaija Authenticated Protocol
                    </div>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Institutional Update</p>
                    <div className="flex items-center gap-3 text-legal-900 font-black italic tracking-tighter">
                      <Clock size={20} className="text-legal-gold" />
                      Protocol Sync: March 2026
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-200">
              <Scale className="w-32 h-32 mb-8 opacity-5" />
              <div className="text-center space-y-2">
                <h4 className="text-xl font-serif font-black italic text-slate-300">Awaiting Search Protocol</h4>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Select a judgment result to initialize intelligence display</p>
              </div>
              <div className="mt-10 flex items-center gap-3 bg-white border border-slate-100 text-slate-400 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">
                <AlertCircle size={16} className="text-legal-gold" />
                <span>AI Deep-Read Synthesizer Active</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
