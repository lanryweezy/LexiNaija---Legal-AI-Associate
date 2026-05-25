import React, { useState } from 'react';
import { useLegalStore } from '../contexts/LegalStoreContext';
import { useToast } from '../contexts/ToastContext';
import { Save, Building, Mail, Phone, User, ShieldCheck, RefreshCw, Upload, Info, HelpCircle, FolderPlus } from 'lucide-react';

export const Settings: React.FC = () => {
  const { showToast } = useToast();
  const { firmProfile, updateFirmProfile, creditsTotal, creditsUsed, addCredits, knowledgeItems } = useLegalStore();
  const [formData, setFormData] = useState(firmProfile);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFirmProfile(formData);
    setSaved(true);
    showToast("Settings saved successfully.", "success");
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col relative pb-20">
      {/* Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-legal-gold/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="h-20 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-10 shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-legal-900 rounded-2xl flex items-center justify-center shadow-lg">
                <ShieldCheck className="text-legal-gold" size={20} />
            </div>
            <div>
                <h1 className="text-xl font-serif font-black text-legal-900 dark:text-white italic tracking-tighter uppercase">Firm Settings</h1>
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-left">Manage your practice infrastructure</p>
            </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-12 relative z-10 scrollbar-hide">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Practice Identity Section */}
          <section className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-[48px] border border-white dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-50 dark:border-slate-800 bg-white/30 dark:bg-white/5 flex justify-between items-start">
                <div>
                    <h3 className="text-2xl font-serif font-black text-legal-900 dark:text-white italic tracking-tighter">Practice Profile</h3>
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">This information is used for automated document generation and billing.</p>
                </div>
                <div className="group relative">
                    <HelpCircle size={18} className="text-slate-300 cursor-help hover:text-legal-gold transition-colors" />
                    <div className="absolute right-0 top-full mt-2 w-64 p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 text-[11px] font-bold text-slate-500 dark:text-slate-400 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 leading-relaxed italic">
                        The firm details provided here will appear on all generated documents, fee notes, and certificates.
                    </div>
                </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 ml-6">Firm Name <span className="text-rose-500">*</span></label>
                    <div className="relative group">
                        <Building className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-legal-gold transition-colors" size={18} />
                        <input 
                          required
                          type="text" 
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          placeholder="e.g. LexiNaija Chambers"
                          className="w-full pl-16 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[20px] font-bold text-legal-900 dark:text-white focus:ring-4 focus:ring-legal-gold/5 focus:border-legal-gold outline-none transition-all shadow-inner min-h-[44px]"
                        />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 ml-6">Lead Solicitor / Signatory <span className="text-rose-500">*</span></label>
                    <div className="relative group">
                        <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-legal-gold transition-colors" size={18} />
                        <input 
                          required
                          type="text" 
                          value={formData.solicitorName}
                          onChange={e => setFormData({...formData, solicitorName: e.target.value})}
                          className="w-full pl-16 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[20px] font-bold text-legal-900 dark:text-white focus:ring-4 focus:ring-legal-gold/5 focus:border-legal-gold outline-none transition-all shadow-inner min-h-[44px]"
                          placeholder="e.g. A. I. Lawyer, Esq."
                        />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 ml-6">Office Address <span className="text-rose-500">*</span></label>
                  <textarea 
                    required
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    placeholder="Physical address of the firm..."
                    className="flex-1 w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[32px] p-8 text-lg font-serif italic text-legal-900 dark:text-white focus:ring-4 focus:ring-legal-gold/5 focus:border-legal-gold outline-none transition-all shadow-inner resize-none min-h-[160px]"
                    rows={4}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                    <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 ml-6">Firm Logo (URL)</label>
                    <div className="relative group">
                        <Upload className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-legal-gold transition-colors" size={18} />
                        <input 
                          type="text" 
                          value={formData.firmLogoUrl || ''}
                          onChange={e => setFormData({...formData, firmLogoUrl: e.target.value})}
                          placeholder="https://example.com/logo.png"
                          className="w-full pl-16 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[20px] font-bold text-legal-900 dark:text-white focus:ring-4 focus:ring-legal-gold/5 focus:border-legal-gold outline-none transition-all shadow-inner min-h-[44px]"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-6 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[24px] border border-slate-100 dark:border-slate-700">
                    <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm">
                        <ShieldCheck className={formData.isEnterprise ? "text-legal-gold" : "text-slate-200 dark:text-slate-600"} size={24} />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Enterprise Mode</p>
                          <div className="group relative">
                              <Info size={12} className="text-slate-300 cursor-help" />
                              <div className="absolute left-0 bottom-full mb-2 w-48 p-3 bg-legal-900 text-white rounded-xl text-[9px] font-bold opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                                Enables multi-user collaboration and institutional access controls.
                              </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mt-1 cursor-pointer" onClick={() => setFormData({...formData, isEnterprise: !formData.isEnterprise})}>
                            <button
                              type="button"
                              className={`w-10 h-5 rounded-full transition-all relative ${formData.isEnterprise ? 'bg-legal-900 dark:bg-legal-gold' : 'bg-slate-200 dark:bg-slate-700'}`}
                              aria-label="Toggle Enterprise Activation"
                            >
                                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData.isEnterprise ? 'left-6' : 'left-1'}`}></div>
                            </button>
                            <span className="text-xs font-black text-legal-900 dark:text-white uppercase">Activation</span>
                        </div>
                    </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                    <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 ml-6">Email Address <span className="text-rose-500">*</span></label>
                    <div className="relative group">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-legal-gold transition-colors" size={18} />
                        <input 
                          required
                          type="email" 
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                          placeholder="contact@firm.com"
                          className="w-full pl-16 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[20px] font-bold text-legal-900 dark:text-white focus:ring-4 focus:ring-legal-gold/5 focus:border-legal-gold outline-none transition-all shadow-inner min-h-[44px]"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 ml-6">Phone Number <span className="text-rose-500">*</span></label>
                    <div className="relative group">
                        <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-legal-gold transition-colors" size={18} />
                        <input 
                          required
                          type="text" 
                          value={formData.phone}
                          onChange={e => setFormData({...formData, phone: e.target.value})}
                          placeholder="+234..."
                          className="w-full pl-16 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[20px] font-bold text-legal-900 dark:text-white focus:ring-4 focus:ring-legal-gold/5 focus:border-legal-gold outline-none transition-all shadow-inner min-h-[44px]"
                        />
                    </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-50 dark:border-slate-800 flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <button 
                        type="submit" 
                        className="bg-legal-900 dark:bg-legal-gold text-white dark:text-legal-900 px-10 py-5 rounded-[24px] font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-legal-900/20 dark:shadow-legal-gold/20 hover:bg-legal-gold hover:text-legal-900 dark:hover:bg-white transition-all flex items-center gap-4 active:scale-95 min-h-[44px]"
                    >
                        <Save size={18} /> Save Settings
                    </button>
                    {saved && (
                        <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-left-4">Settings Saved</span>
                    )}
                </div>

                <div className="flex items-center gap-6">
                  <div className="px-6 py-3 bg-slate-900 rounded-2xl flex items-center gap-4 shadow-xl border border-legal-gold/20">
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black text-legal-gold uppercase tracking-widest">Neural Balance</span>
                        <span className="text-sm font-black text-white italic tracking-tighter">{creditsTotal - creditsUsed} CR Available</span>
                      </div>
                      <div className="group relative">
                        <HelpCircle size={14} className="text-slate-500 cursor-help" />
                        <div className="absolute right-0 bottom-full mb-2 w-48 p-3 bg-slate-800 text-white rounded-xl text-[9px] font-bold opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                          Credits power AI research, drafting, and analysis tools. 1 credit ≈ 1 analysis operation.
                        </div>
                      </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => addCredits(100)}
                    className="p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-400 hover:text-legal-900 dark:hover:text-white rounded-[20px] hover:shadow-xl transition-all active:scale-95 min-h-[44px] min-w-[44px]"
                    title="Add 100 Credits"
                  >
                    <RefreshCw size={20} />
                  </button>
                </div>
              </div>
            </form>
          </section>

          {/* Knowledge Folders Section */}
          <section className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-[48px] border border-white dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-50 dark:border-slate-800 bg-white/30 dark:bg-white/5 flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-serif font-black text-legal-900 dark:text-white italic tracking-tighter">Wisdom Bank</h3>
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Manage institutional knowledge folders to improve AI research accuracy.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.5)]"></div>
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Context Engine Ready</span>
                </div>
            </div>
            
            <div className="p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {['Entertainment', 'G.M IBRU', 'LAW SCHOOL', 'CAC', 'General'].map(cat => {
                  const items = (knowledgeItems || []).filter(k => k.category === cat);
                  return (
                    <div key={cat} className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[32px] border border-slate-100 dark:border-slate-700 flex flex-col gap-4 group hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl transition-all duration-500 min-h-[180px]">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-legal-900 dark:text-slate-400 uppercase tracking-widest opacity-40">{cat}</span>
                        <span className={`text-[10px] font-black px-3 py-1 rounded-full transition-colors ${items.length > 0 ? 'bg-legal-gold/20 dark:bg-legal-gold/10 text-legal-900 dark:text-legal-gold group-hover:bg-legal-gold dark:group-hover:text-legal-900' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}>
                          {items.length} {items.length === 1 ? 'Folder' : 'Folders'}
                        </span>
                      </div>
                      <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 leading-relaxed italic">
                        {cat === 'Entertainment' ? "Intellectual Property, Talent Agreements & Industry Precedents." : 
                         cat === 'G.M IBRU' ? "Legacy Litigation files and Commercial Advisory patterns." :
                         cat === 'LAW SCHOOL' ? "Core Nigerian Jurisprudence and Procedural Guides." :
                         cat === 'CAC' ? "Corporate Affairs Commission protocols and filings." :
                         "General Practice documents and miscellaneous research."}
                      </p>

                      {items.length === 0 && (
                        <button className="mt-2 flex items-center gap-2 text-[9px] font-black uppercase text-legal-gold hover:opacity-80 transition-opacity">
                          <FolderPlus size={12} /> Add first folder
                        </button>
                      )}

                      <div className="mt-auto pt-4 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between">
                        <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Institutional Access</span>
                        <ShieldCheck size={14} className="text-emerald-500" />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 p-8 bg-legal-900 dark:bg-slate-800 rounded-[40px] flex flex-wrap items-center justify-between gap-6 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-legal-gold/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                <div className="relative z-10">
                    <h4 className="text-white font-serif italic text-xl tracking-tighter">Synchronize Local Folders</h4>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-2">Index your local legal workspace to improve AI tool precision.</p>
                </div>
                <button className="bg-legal-gold text-legal-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-3 relative z-10 active:scale-95 shadow-xl shadow-legal-gold/20 min-h-[44px]">
                  <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-700" /> Re-Index Workspace
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
