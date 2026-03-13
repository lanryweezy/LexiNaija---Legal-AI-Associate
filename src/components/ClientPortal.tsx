import React, { useState } from 'react';
import { Share2, Mail, Link as LinkIcon, Shield, Copy, CheckCircle2, UserCheck, Clock, X, ChevronRight, LayoutGrid } from 'lucide-react';
import { useLegalStore } from '../contexts/LegalStoreContext';

export const ClientPortal: React.FC = () => {
  const { clients, cases } = useLegalStore();
  const [selectedClient, setSelectedClient] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://lexinaija.com/portal/invite-${Date.now()}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-2rem)] flex flex-col animate-in fade-in duration-1000">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-black text-legal-gold uppercase tracking-[0.3em] mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-legal-gold animate-pulse"></div>
              Collaboration Layer
          </div>
          <h2 className="text-5xl font-serif font-black text-legal-900 italic tracking-tighter leading-tight">Client Portal</h2>
          <p className="text-slate-400 font-medium">Provision secure, encrypted workspace access for legal entities and private clients.</p>
        </div>
        <button 
          onClick={() => setShowInviteModal(true)}
          className="bg-legal-900 text-white px-10 py-5 rounded-[22px] font-black uppercase tracking-widest text-[11px] hover:bg-legal-gold hover:text-legal-900 shadow-xl shadow-legal-900/10 transition-all flex items-center gap-3 active:scale-95"
        >
          <Mail size={18} /> Send Invitation
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 flex-1 overflow-hidden">
        {/* Active Shared Access */}
        <div className="lg:col-span-4 bg-white/70 backdrop-blur-xl rounded-[48px] border border-white shadow-2xl flex flex-col overflow-hidden">
          <div className="p-8 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
            <span className="text-[10px] font-black text-legal-900 uppercase tracking-widest">Authorized Terminals</span>
            <span className="bg-emerald-50 text-emerald-600 text-[9px] font-black px-3 py-1 rounded-full border border-emerald-100">Live Traffic</span>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {clients.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center text-slate-300">
                <Share2 className="w-16 h-16 opacity-10 mb-6" />
                <p className="text-[10px] font-black uppercase tracking-widest">No active portal authorizations detected.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {clients.map((client) => (
                  <div key={client.id} className="p-8 hover:bg-white transition-all cursor-pointer group relative">
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                        <ChevronRight className="text-legal-gold" size={20} />
                    </div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-serif font-black italic text-xl text-legal-900 tracking-tight group-hover:text-legal-gold transition-colors">{client.name}</h3>
                      <span className="bg-slate-100 text-slate-400 text-[8px] px-2 py-0.5 rounded-full font-black uppercase">Ref-Auth</span>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 mb-6">{client.email}</p>
                    <div className="flex items-center gap-6 text-[9px] font-black uppercase tracking-widest text-slate-400">
                      <span className="flex items-center gap-2"><UserCheck size={14} className="text-emerald-500" /> Active Session</span>
                      <span className="flex items-center gap-2"><Clock size={14} className="text-legal-gold" /> Persistent</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Permission Manager */}
        <div className="lg:col-span-8 bg-white/40 backdrop-blur-xl rounded-[56px] border border-white shadow-2xl flex flex-col overflow-hidden relative">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-legal-gold/5 rounded-full blur-[120px] pointer-events-none"></div>
          
          <div className="p-10 bg-legal-900 text-white flex justify-between items-center relative z-10 mx-6 mt-6 rounded-[32px] shadow-2xl">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-black text-legal-gold uppercase tracking-[0.3em] mb-2">
                <Shield size={14} /> Critical Access Control
              </div>
              <h3 className="text-3xl font-serif font-black italic tracking-tighter">Command Panel</h3>
            </div>
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                <LayoutGrid className="text-legal-gold" size={24} />
            </div>
          </div>
          
          <div className="p-12 flex-1 flex flex-col items-center justify-center text-center relative z-10">
            <div className="w-24 h-24 bg-white rounded-[32px] shadow-sm flex items-center justify-center mb-8">
                <Share2 className="w-12 h-12 text-slate-100" />
            </div>
            <h4 className="text-2xl font-serif font-black italic text-slate-300 tracking-tight mb-4">Awaiting Client Selection</h4>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 max-w-sm leading-relaxed mx-auto">
              Select an authorized terminal from the registry to initialize folder permissions and data-room protocols.
            </p>
          </div>
        </div>
      </div>

      {showInviteModal && (
        <div className="fixed inset-0 bg-legal-900/40 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-[48px] w-full max-w-lg shadow-[0_80px_120px_-20px_rgba(0,0,0,0.4)] animate-in fade-in zoom-in-95 duration-500 overflow-hidden text-left">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <div>
                <h3 className="font-serif font-black italic text-3xl text-legal-900 tracking-tight">Onboard Entity</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Portal Provisioning Protocol</p>
              </div>
              <button onClick={() => setShowInviteModal(false)} className="w-12 h-12 flex items-center justify-center bg-white rounded-full text-slate-300 hover:text-legal-900 transition-all shadow-sm border border-slate-50">
                <X size={20} />
              </button>
            </div>
            <div className="p-10 space-y-8">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Select Target Client</label>
                <div className="relative group">
                    <select 
                      className="w-full bg-slate-50 border border-slate-100 p-6 rounded-3xl font-black text-legal-900 outline-none focus:ring-4 focus:ring-legal-gold/5 focus:border-legal-gold appearance-none transition-all cursor-pointer shadow-inner"
                      value={selectedClient}
                      onChange={(e) => setSelectedClient(e.target.value)}
                    >
                      <option value="">-- Elect Client Record --</option>
                      {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 group-hover:text-legal-gold transition-colors">
                        <ChevronRight className="rotate-90" size={20} />
                    </div>
                </div>
              </div>

              <div className="bg-slate-50/50 rounded-[40px] p-8 border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-legal-gold/5 rounded-full blur-2xl"></div>
                <p className="text-[10px] font-black text-legal-900 uppercase mb-4 tracking-widest flex items-center gap-2">
                    <LinkIcon size={12} className="text-legal-gold" /> Encrypted Credentials Link
                </p>
                <div className="flex gap-3 relative z-10">
                  <div className="flex-1 bg-white border border-slate-100 px-5 py-4 rounded-2xl text-[11px] text-slate-400 font-mono truncate shadow-sm">
                    https://lexinaija.com/portal/auth-7728-x92...
                  </div>
                  <button 
                    onClick={handleCopyLink}
                    className="w-14 h-14 bg-legal-900 text-white rounded-2xl hover:bg-legal-gold hover:text-legal-900 transition-all flex items-center justify-center shadow-lg active:scale-95"
                  >
                    {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <button className="w-full bg-legal-900 text-white py-6 rounded-3xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-legal-900/20 flex items-center justify-center gap-4 hover:bg-legal-gold hover:text-legal-900 transition-all active:scale-[0.98] group">
                  <Mail size={22} className="group-hover:-translate-y-1 transition-transform" /> Dispatch Access Protocol
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
