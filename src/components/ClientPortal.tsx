import React, { useState, useCallback } from 'react';
import { Share2, Mail, Link as LinkIcon, Shield, Copy, CheckCircle2, UserCheck, Clock, X, ChevronRight, LayoutGrid, TrendingUp, Calendar, FileCheck, Upload, File } from 'lucide-react';
import { useLegalStore } from '../contexts/LegalStoreContext';
import { generateMilestones, calculateProgress, getCurrentMilestone, getNextMilestone, getMilestoneStatusColor } from '../services/milestoneService';
import { useDropzone } from 'react-dropzone';
import { useToast } from '../contexts/ToastContext';

interface EvidenceUploadProps {
    caseId: string;
    clientName: string;
}

const EvidenceUpload: React.FC<EvidenceUploadProps> = ({ caseId, clientName }) => {
    const { addEvidence } = useLegalStore();
    const { showToast } = useToast();
    const [isUploading, setIsUploading] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setIsUploading(true);
        // Simulate secure upload processing
        setTimeout(() => {
            acceptedFiles.forEach(file => {
                addEvidence(caseId, {
                    id: Date.now().toString() + Math.random(),
                    description: `[UPLOADED BY CLIENT] ${file.name}`,
                    type: 'Document',
                    dateObtained: new Date(),
                    isReliedUpon: false,
                    custodyLocation: 'Digital Vault (Client Portal)',
                    notes: `Securely uploaded via portal by ${clientName}. File size: ${(file.size / 1024).toFixed(2)} KB.`
                });
            });
            setIsUploading(false);
            showToast(`${acceptedFiles.length} file(s) securely synchronized with case file.`, "success");
        }, 2000);
    }, [caseId, addEvidence, clientName, showToast]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'image/*': ['.jpeg', '.png', '.jpg']
        }
    });

    return (
        <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-3xl p-10 text-center transition-all cursor-pointer ${
                isDragActive ? 'border-legal-gold bg-legal-gold/5 scale-[1.02]' : 'border-slate-200 dark:border-slate-800 hover:border-legal-900/20 dark:hover:border-legal-gold/20'
            }`}
        >
            <input {...getInputProps()} />
            {isUploading ? (
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-slate-100 border-t-legal-gold rounded-full animate-spin"></div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-legal-900 dark:text-white">Encrypting & Routing Data...</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-[24px] shadow-sm flex items-center justify-center mx-auto border border-slate-100 dark:border-slate-700">
                        <File size={28} className="text-slate-300 dark:text-slate-600" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-legal-900 dark:text-white">Drag files here or click to browse</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Supported: PDF, DOCX, JPG (Max 25MB)</p>
                    </div>
                    <div className="pt-2">
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full text-[8px] font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-900/30">
                            <Shield size={10} /> End-to-End Encrypted
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

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
          <h2 className="text-5xl font-serif font-black text-legal-900 dark:text-white italic tracking-tighter leading-tight">Client Portal</h2>
          <p className="text-slate-400 dark:text-slate-500 font-medium">Provision secure, encrypted workspace access for legal entities and private clients.</p>
        </div>
        <button 
          onClick={() => setShowInviteModal(true)}
          className="bg-legal-900 dark:bg-legal-gold text-white dark:text-legal-900 px-10 py-5 rounded-[22px] font-black uppercase tracking-widest text-[11px] hover:bg-legal-gold hover:text-legal-900 dark:hover:bg-white shadow-xl shadow-legal-900/10 transition-all flex items-center gap-3 active:scale-95"
        >
          <Mail size={18} /> Send Invitation
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 flex-1 overflow-hidden">
        {/* Active Shared Access */}
        <div className="lg:col-span-4 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl rounded-[48px] border border-white dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
          <div className="p-8 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <span className="text-[10px] font-black text-legal-900 dark:text-slate-400 uppercase tracking-widest">Authorized Terminals</span>
            <span className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[9px] font-black px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/30">Live Traffic</span>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {clients.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center text-slate-300 dark:text-slate-700">
                <Share2 className="w-16 h-16 opacity-10 mb-6" />
                <p className="text-[10px] font-black uppercase tracking-widest">No active portal authorizations detected.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50 dark:divide-slate-800">
                {clients.map((client) => (
                  <div
                    key={client.id}
                    onClick={() => setSelectedClient(client.id)}
                    className={`p-8 transition-all cursor-pointer group relative ${selectedClient === client.id ? 'bg-white dark:bg-slate-800' : 'hover:bg-white dark:hover:bg-slate-800/30'}`}
                  >
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                        <ChevronRight className="text-legal-gold" size={20} />
                    </div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`font-serif font-black italic text-xl tracking-tight group-hover:text-legal-gold transition-colors ${selectedClient === client.id ? 'text-legal-gold' : 'text-legal-900 dark:text-white'}`}>{client.name}</h3>
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-[8px] px-2 py-0.5 rounded-full font-black uppercase">Ref-Auth</span>
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
        <div className="lg:col-span-8 bg-white/40 dark:bg-slate-900/20 backdrop-blur-xl rounded-[56px] border border-white dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden relative">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-legal-gold/5 rounded-full blur-[120px] pointer-events-none"></div>
          
          <div className="p-10 bg-legal-900 dark:bg-slate-900 text-white flex justify-between items-center relative z-10 mx-6 mt-6 rounded-[32px] shadow-2xl border dark:border-slate-800">
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
          
          {!selectedClient ? (
            <div className="p-12 flex-1 flex flex-col items-center justify-center text-center relative z-10">
                <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-[32px] shadow-sm flex items-center justify-center mb-8">
                    <Share2 className="w-12 h-12 text-slate-100 dark:text-slate-700" />
                </div>
                <h4 className="text-2xl font-serif font-black italic text-slate-300 dark:text-slate-700 tracking-tight mb-4">Awaiting Client Selection</h4>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 max-w-sm leading-relaxed mx-auto">
                Select an authorized terminal from the registry to initialize folder permissions and data-room protocols.
                </p>
            </div>
          ) : (
             <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-10 duration-500 overflow-hidden">
                <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white/50 dark:bg-slate-900/50">
                    <div>
                        <span className="text-[10px] font-black text-legal-gold uppercase tracking-widest">Active Terminal</span>
                        <h3 className="text-3xl font-serif font-black italic text-legal-900 dark:text-white tracking-tight">{clients.find(c => c.id === selectedClient)?.name}</h3>
                    </div>
                    <button onClick={() => setSelectedClient('')} className="p-3 text-slate-400 hover:text-legal-900 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl transition-all"><X size={20}/></button>
                </div>
                <div className="flex-1 overflow-y-auto p-10 space-y-12 scrollbar-hide">
                    <div>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">Authorized Matter Synchronization</h4>
                        <div className="space-y-10">
                            {cases.filter(c => c.clientId === selectedClient).length === 0 ? (
                                <p className="text-slate-400 font-medium italic">No active matters linked to this portal.</p>
                            ) : (
                                cases.filter(c => c.clientId === selectedClient).map(c => {
                                    const milestones = generateMilestones(c.id, c.title);
                                    const progress = calculateProgress(milestones);
                                    const currentMilestone = getCurrentMilestone(milestones);
                                    const nextMilestone = getNextMilestone(milestones);
                                    
                                    return (
                                    <div key={c.id} className="bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-[40px] p-10 shadow-sm space-y-10 relative overflow-hidden group/card">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-legal-gold/5 rounded-full translate-x-10 -translate-y-10 group-hover/card:scale-150 transition-transform duration-700"></div>

                                        <div className="flex justify-between items-start relative z-10">
                                            <div>
                                                <h5 className="text-2xl font-serif font-black text-legal-900 dark:text-white italic tracking-tight">{c.title}</h5>
                                                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{c.suitNumber || 'Suit Number Pending'}</p>
                                            </div>
                                            <span className="px-5 py-2.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-900/30 flex items-center gap-2">
                                                <TrendingUp size={14} /> {progress}% Complete
                                            </span>
                                        </div>

                                        {/* Evidence Submission Area (NEW) */}
                                        <div className="bg-slate-50 dark:bg-slate-800 rounded-[32px] p-8 border border-slate-100 dark:border-slate-700 relative z-10 shadow-inner">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-10 h-10 bg-legal-900 dark:bg-legal-gold rounded-xl flex items-center justify-center">
                                                    <Upload size={18} className="text-legal-gold dark:text-legal-900" />
                                                </div>
                                                <div>
                                                    <h6 className="text-[10px] font-black text-legal-900 dark:text-white uppercase tracking-widest">Evidence Submission Vault</h6>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Secure encrypted upload for matter files</p>
                                                </div>
                                            </div>

                                            <EvidenceUpload caseId={c.id} clientName={clients.find(cl => cl.id === selectedClient)?.name || 'Client'} />
                                        </div>

                                        {/* Current Milestone */}
                                        {currentMilestone && (
                                            <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 relative z-10">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Current Intelligence Phase</p>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-3 h-3 rounded-full bg-legal-gold animate-pulse"></div>
                                                    <p className="text-base font-bold text-legal-900 dark:text-white">{currentMilestone.title}</p>
                                                </div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{currentMilestone.description}</p>
                                            </div>
                                        )}

                                        {/* Progress Bar */}
                                        <div className="relative pt-2 pb-2 relative z-10">
                                            <div className="flex justify-between mb-3">
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Matter Evolution</span>
                                                <span className="text-[9px] font-black text-legal-gold uppercase tracking-widest">{progress}% Finalized</span>
                                            </div>
                                            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden shadow-inner">
                                                <div
                                                    className="h-full bg-gradient-to-r from-legal-gold to-legal-gold/70 transition-all duration-1000 shadow-[0_0_10px_rgba(234,179,8,0.3)]"
                                                    style={{ width: `${progress}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* All Milestones */}
                                        <div className="pt-10 border-t border-slate-100 dark:border-slate-800 relative z-10">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-6">Procedural History</p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {milestones.map((m) => {
                                                    return (
                                                        <div key={m.id} className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-50 dark:border-slate-800/50">
                                                            <div className={`w-2.5 h-2.5 rounded-full ${
                                                                m.status === 'completed' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                                                                m.status === 'pending' ? 'bg-slate-300 dark:bg-slate-700' :
                                                                'bg-rose-500'
                                                            } transition-all`}></div>
                                                            <p className={`text-xs font-bold flex-1 ${
                                                                m.status === 'completed' ? 'text-emerald-600 dark:text-emerald-400' :
                                                                m.status === 'pending' ? 'text-slate-500 dark:text-slate-400' :
                                                                'text-rose-600'
                                                            }`}>{m.title}</p>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
             </div>
          )}
        </div>
      </div>

      {showInviteModal && (
        <div className="fixed inset-0 bg-legal-900/40 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[48px] w-full max-w-lg shadow-[0_80px_120px_-20px_rgba(0,0,0,0.4)] animate-in fade-in zoom-in-95 duration-500 overflow-hidden text-left border dark:border-slate-800">
            <div className="p-10 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-800/30">
              <div>
                <h3 className="font-serif font-black italic text-3xl text-legal-900 dark:text-white tracking-tight">Onboard Entity</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Portal Provisioning Protocol</p>
              </div>
              <button onClick={() => setShowInviteModal(false)} className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-800 rounded-full text-slate-300 hover:text-legal-900 dark:hover:text-white transition-all shadow-sm border border-slate-50 dark:border-slate-700">
                <X size={20} />
              </button>
            </div>
            <div className="p-10 space-y-8">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Select Target Client</label>
                <div className="relative group">
                    <select 
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-6 rounded-3xl font-black text-legal-900 dark:text-white outline-none focus:ring-4 focus:ring-legal-gold/5 focus:border-legal-gold appearance-none transition-all cursor-pointer shadow-inner"
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

              <div className="bg-slate-50 dark:bg-slate-800/80 rounded-[40px] p-8 border border-slate-100 dark:border-slate-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-legal-gold/5 rounded-full blur-2xl"></div>
                <p className="text-[10px] font-black text-legal-900 dark:text-legal-gold uppercase mb-4 tracking-widest flex items-center gap-2">
                    <LinkIcon size={12} className="text-legal-gold" /> Encrypted Credentials Link
                </p>
                <div className="flex gap-3 relative z-10">
                  <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 px-5 py-4 rounded-2xl text-[11px] text-slate-400 font-mono truncate shadow-sm">
                    https://lexinaija.com/portal/auth-7728-x92...
                  </div>
                  <button 
                    onClick={handleCopyLink}
                    className="w-14 h-14 bg-legal-900 dark:bg-legal-gold text-white dark:text-legal-900 rounded-2xl hover:bg-legal-gold hover:text-legal-900 dark:hover:bg-white transition-all flex items-center justify-center shadow-lg active:scale-95"
                  >
                    {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <button className="w-full bg-legal-900 dark:bg-legal-gold text-white dark:text-legal-900 py-6 rounded-3xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-legal-900/20 flex items-center justify-center gap-4 hover:bg-legal-gold hover:text-legal-900 dark:hover:bg-white transition-all active:scale-[0.98] group">
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
