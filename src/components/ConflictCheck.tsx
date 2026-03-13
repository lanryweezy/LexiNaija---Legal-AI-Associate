import React, { useState } from 'react';
import { useLegalStore } from '../contexts/LegalStoreContext';
import { Search, AlertTriangle, CheckCircle, ShieldAlert, User, Briefcase, ChevronRight, X } from 'lucide-react';

export const ConflictCheck: React.FC = () => {
  const { clients, cases } = useLegalStore();
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Logic to find matches
  const clientMatches = query ? clients.filter(c => c.name.toLowerCase().includes(query.toLowerCase())) : [];
  
  const opposingPartyMatches = query ? cases.filter(c => 
    c.opposingParty && c.opposingParty.toLowerCase().includes(query.toLowerCase())
  ) : [];
  
  const caseMatches = query ? cases.filter(c => 
    c.title.toLowerCase().includes(query.toLowerCase())
  ) : [];

  const totalMatches = clientMatches.length + opposingPartyMatches.length + caseMatches.length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
        setHasSearched(true);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-screen animate-in fade-in duration-1000">
      <div className="mb-16 text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-[10px] font-black text-legal-gold uppercase tracking-[0.4em] mb-2">
            <div className="w-2 h-2 rounded-full bg-legal-gold animate-pulse"></div>
            Integrity Protocol
        </div>
        <h2 className="text-6xl font-serif font-black text-legal-900 italic tracking-tighter leading-tight">Conflict Shield</h2>
        <p className="text-slate-400 font-medium max-w-xl mx-auto leading-relaxed">
            Initialize an exhaustive cross-reference check against the internal archive to mitigate ethical risks and professional contraventions.
        </p>
      </div>

      <div className="relative max-w-3xl mx-auto mb-20 group">
        <div className="absolute -inset-1 bg-gradient-to-r from-legal-gold/20 to-transparent rounded-[32px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
        <form onSubmit={handleSearch} className="relative flex items-center bg-white/70 backdrop-blur-2xl border border-slate-100 rounded-[30px] p-2 shadow-2xl transition-all focus-within:border-legal-gold/50 focus-within:shadow-legal-gold/5">
            <div className="pl-6 text-slate-300">
                <Search size={24} />
            </div>
            <input 
                type="text" 
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setHasSearched(false);
                }}
                placeholder="Nomenclature of Prospect, Entity or Affiliate..."
                className="w-full pl-4 pr-6 py-6 bg-transparent font-bold text-xl text-legal-900 outline-none placeholder:text-slate-300 placeholder:font-normal"
            />
            {query && (
                <button type="button" onClick={() => {setQuery(''); setHasSearched(false);}} className="p-2 text-slate-300 hover:text-legal-900 transition-colors">
                    <X size={20} />
                </button>
            )}
            <button 
                type="submit"
                disabled={!query}
                className="bg-legal-900 text-white px-10 py-5 rounded-[22px] font-black uppercase tracking-widest text-[11px] hover:bg-legal-gold hover:text-legal-900 disabled:opacity-30 disabled:hover:bg-legal-900 disabled:hover:text-white transition-all ml-2 active:scale-95 shadow-lg shadow-legal-900/10"
            >
                Initialize Scan
            </button>
        </form>
      </div>

      {hasSearched && (
        <div className="animate-in fade-in slide-in-from-bottom-10 duration-700">
            {totalMatches === 0 ? (
                <div className="max-w-2xl mx-auto bg-emerald-50/50 backdrop-blur-xl border border-emerald-100 rounded-[40px] p-12 text-center shadow-xl">
                    <div className="w-20 h-20 bg-white shadow-sm border border-emerald-100 rounded-[28px] flex items-center justify-center mx-auto mb-8 animate-bounce-subtle">
                        <CheckCircle className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h3 className="text-3xl font-serif font-black text-emerald-900 italic tracking-tight mb-4">Conflict Clearance Confirmed</h3>
                    <p className="text-emerald-700 font-medium leading-relaxed">
                        The designated entity <span className="font-black underline underline-offset-4">"{query}"</span> has no registered interest within the LexiNaija architecture. Ethical posture is deemed secure.
                    </p>
                    <div className="mt-10 h-[2px] w-12 bg-emerald-200 mx-auto"></div>
                </div>
            ) : (
                <div className="space-y-10">
                    <div className="bg-rose-50/80 backdrop-blur-xl border border-rose-100 rounded-[40px] p-10 flex items-center gap-8 shadow-xl">
                        <div className="w-20 h-20 bg-white shadow-sm border border-rose-100 rounded-[28px] flex items-center justify-center shrink-0">
                            <AlertTriangle className="w-10 h-10 text-rose-500" />
                        </div>
                        <div>
                            <h3 className="text-3xl font-serif font-black text-rose-900 italic tracking-tight mb-2">Inhibitory Patterns Detected</h3>
                            <p className="text-rose-700 font-medium select-none">
                                Found {totalMatches} matches for <span className="font-black">"{query}"</span>. Professional vigilance is mandatory before proceeding with this brief.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Client Matches */}
                        {clientMatches.length > 0 && (
                            <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden group hover:border-legal-gold/50 transition-all">
                                <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                                    <span className="text-[10px] font-black text-legal-900 uppercase tracking-widest flex items-center gap-2">
                                        <User size={14} className="text-legal-gold" /> Registered Clients
                                    </span>
                                    <span className="text-[10px] bg-white px-2 py-1 rounded-lg border border-slate-200 font-black">{clientMatches.length}</span>
                                </div>
                                <div className="divide-y divide-slate-50">
                                    {clientMatches.map(c => (
                                        <div key={c.id} className="p-8 hover:bg-slate-50 transition-colors">
                                            <p className="font-serif font-black italic text-xl text-legal-900 tracking-tight mb-2">{c.name}</p>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{c.type}</span>
                                                <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Since {new Date(c.dateAdded).getFullYear()}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Opposing Party Matches */}
                        {opposingPartyMatches.length > 0 && (
                            <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden group hover:border-rose-300 transition-all">
                                <div className="px-8 py-6 bg-rose-50/30 border-b border-rose-100 flex items-center justify-between">
                                    <span className="text-[10px] font-black text-rose-800 uppercase tracking-widest flex items-center gap-2">
                                        <ShieldAlert size={14} /> Adversarial Interests
                                    </span>
                                    <span className="text-[10px] bg-white px-2 py-1 rounded-lg border border-rose-100 font-black text-rose-800">{opposingPartyMatches.length}</span>
                                </div>
                                <div className="divide-y divide-slate-50">
                                    {opposingPartyMatches.map(c => (
                                        <div key={c.id} className="p-8 hover:bg-rose-50/20 transition-colors">
                                            <p className="font-serif font-black italic text-xl text-rose-900 tracking-tight mb-2">{c.opposingParty}</p>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Case Context:</p>
                                                <p className="text-sm font-bold text-legal-900 line-clamp-1">{c.title}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Case Title Matches */}
                        {caseMatches.length > 0 && (
                            <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden group hover:border-legal-gold/50 transition-all">
                                <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                                    <span className="text-[10px] font-black text-legal-900 uppercase tracking-widest flex items-center gap-2">
                                        <Briefcase size={14} className="text-legal-gold" /> Matter Index Matches
                                    </span>
                                    <span className="text-[10px] bg-white px-2 py-1 rounded-lg border border-slate-200 font-black">{caseMatches.length}</span>
                                </div>
                                <div className="divide-y divide-slate-50">
                                    {caseMatches.map(c => (
                                        <div key={c.id} className="p-8 hover:bg-slate-50 transition-colors">
                                            <p className="font-serif font-black italic text-xl text-legal-900 tracking-tight mb-2">{c.title}</p>
                                            <div className="flex items-center gap-3">
                                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border ${c.status === 'Open' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>{c.status}</span>
                                                <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">REF-{c.id.substring(0, 6)}</span>
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
      )}
    </div>
  );
};