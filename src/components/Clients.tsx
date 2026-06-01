import React, { useState } from 'react';
import {
  User, Mail, Phone, MapPin, Plus, Search, Filter, Pencil, Trash2,
  ChevronRight, Building2, Calendar, ShieldCheck, X, Download, Save, ExternalLink
} from 'lucide-react';
import { useLegalStore } from '../contexts/LegalStoreContext';
import { useToast } from '../contexts/ToastContext';
import { Client } from '../types';
import { ConfirmModal } from './ConfirmModal';

export const Clients: React.FC = () => {
  const { showToast } = useToast();
  const { clients, addClient, updateClient, deleteClient } = useLegalStore();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Client>>({ type: 'Individual' });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ type: 'Individual', name: '', email: '', phone: '', address: '', rcNumber: '' });
    setShowModal(true);
  };

  const handleOpenEdit = (client: Client) => {
    setEditingId(client.id);
    setFormData(client);
    setShowModal(true);
  };

  const handleDeleteRequest = (id: string) => {
    setClientToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (clientToDelete) {
      deleteClient(clientToDelete);
      setClientToDelete(null);
      showToast("Client record excised.", "info");
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      if (editingId) {
        updateClient(editingId, formData);
        showToast("Client intelligence updated.", "success");
      } else {
        addClient({
          id: crypto.randomUUID(),
          name: formData.name,
          type: formData.type as any,
          email: formData.email,
          phone: formData.phone || '',
          address: formData.address || '',
          rcNumber: formData.rcNumber,
          dateAdded: new Date(),
          conflictCleared: true
        });
        showToast("New client enrollment completed.", "success");
      }
      setShowModal(false);
    }
  };

  const filteredClients = React.useMemo(() => {
    // ⚡ Bolt: Cache lowercased search query to avoid redundant O(N*M) string reallocations on every render
    const searchQueryLower = searchQuery.toLowerCase();
    return clients.filter(c =>
      c.name.toLowerCase().includes(searchQueryLower) ||
      c.email.toLowerCase().includes(searchQueryLower) ||
      (c.rcNumber && c.rcNumber.toLowerCase().includes(searchQueryLower))
    );
  }, [clients, searchQuery]);

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-black text-legal-gold uppercase tracking-[0.3em] mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-legal-gold animate-pulse"></div>
              Institutional Roster
          </div>
          <h2 className="text-5xl font-serif font-black text-legal-900 dark:text-white italic tracking-tighter leading-tight">Client Directory</h2>
          <p className="text-slate-400 dark:text-slate-500 font-medium">Manage your client engagements and KYC data.</p>
        </div>
        <div className="flex gap-4 items-end">
          <div className="relative">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
             <input
               type="text"
               placeholder="Search by name, email, or RC..."
               maxLength={100}
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="pl-12 pr-6 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-legal-gold/10 focus:border-legal-gold w-80 text-sm font-bold text-legal-900 dark:text-white shadow-sm outline-none transition-all placeholder:font-normal placeholder:text-slate-300 dark:placeholder:text-slate-600"
             />
          </div>
          <button 
             onClick={handleOpenAdd}
             className="bg-legal-900 dark:bg-legal-gold text-white dark:text-legal-900 px-8 py-4 rounded-2xl hover:bg-legal-gold hover:text-legal-900 dark:hover:bg-white flex items-center gap-3 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-legal-900/20 transition-all shrink-0 group"
          >
            <Plus size={16} className="group-hover:rotate-90 transition-transform" /> Enroll Client
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map(c => (
          <div key={c.id} className="bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:border-legal-gold/50 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 dark:bg-white/5 opacity-0 group-hover:opacity-100 rounded-full translate-x-16 -translate-y-16 blur-2xl transition-opacity"></div>

            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${c.type === 'Corporate' ? 'bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'}`}>
                {c.type === 'Corporate' ? <Building2 size={24} /> : <User size={24} />}
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleOpenEdit(c)} className="p-2 text-slate-300 hover:text-legal-900 dark:hover:text-white transition-colors"><Pencil size={16}/></button>
                <button onClick={() => handleDeleteRequest(c.id)} className="p-2 text-slate-300 hover:text-rose-600 transition-colors"><Trash2 size={16}/></button>
              </div>
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">{c.type}</span>
                    {c.rcNumber && (
                        <>
                            <span className="w-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-full"></span>
                            <span className="text-[9px] font-black uppercase tracking-widest text-legal-gold">RC: {c.rcNumber}</span>
                        </>
                    )}
                </div>
                <h3 className="text-2xl font-serif font-black italic tracking-tight text-legal-900 dark:text-white mb-6 group-hover:text-legal-gold transition-colors">{c.name}</h3>

                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                        <Mail size={16} className="text-slate-300 dark:text-slate-600" />
                        <span className="font-medium truncate">{c.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                        <Phone size={16} className="text-slate-300 dark:text-slate-600" />
                        <span className="font-medium">{c.phone}</span>
                    </div>
                    <div className="flex items-start gap-3 text-sm text-slate-500 dark:text-slate-400">
                        <MapPin size={16} className="text-slate-300 dark:text-slate-600 mt-1 shrink-0" />
                        <span className="font-medium line-clamp-2">{c.address}</span>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={14} className="text-emerald-500" />
                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Conflict Cleared</span>
                    </div>
                    <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase">Added {new Date(c.dateAdded).toLocaleDateString()}</span>
                </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-legal-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-[0_60px_100px_-20px_rgba(0,0,0,0.3)] w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-8 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-2xl font-serif font-black text-legal-900 dark:text-white italic tracking-tight">
                  {editingId ? 'Update Client Record' : 'Initialize Client Enrollment'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-10 space-y-6">
              <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-8">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, type: 'Individual'})}
                  className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${formData.type === 'Individual' ? 'bg-white dark:bg-slate-700 text-legal-900 dark:text-white shadow-sm' : 'text-slate-400 hover:text-legal-900 dark:hover:text-slate-300'}`}
                >
                  Individual
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, type: 'Corporate'})}
                  className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${formData.type === 'Corporate' ? 'bg-white dark:bg-slate-700 text-legal-900 dark:text-white shadow-sm' : 'text-slate-400 hover:text-legal-900 dark:hover:text-slate-300'}`}
                >
                  Corporate
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 ml-2">Full Legal Nomenclature <span className="text-rose-500">*</span></label>
                  <input 
                    type="text"
                    required 
                    maxLength={255}
                    value={formData.name}
                    className="w-full border border-slate-200 dark:border-slate-700 p-5 rounded-2xl bg-white dark:bg-slate-800 text-sm font-bold text-legal-900 dark:text-white focus:ring-4 focus:ring-legal-gold/10 focus:border-legal-gold outline-none transition-all shadow-sm placeholder:font-normal placeholder:text-slate-300 dark:placeholder:text-slate-600"
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                {formData.type === 'Corporate' && (
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 ml-2">CAC Registration Number (RC)</label>
                    <input
                      type="text"
                      maxLength={50}
                      value={formData.rcNumber}
                      placeholder="e.g. RC 1234567"
                      className="w-full border border-slate-200 dark:border-slate-700 p-5 rounded-2xl bg-white dark:bg-slate-800 text-sm font-bold text-legal-900 dark:text-white focus:ring-4 focus:ring-legal-gold/10 focus:border-legal-gold outline-none transition-all shadow-sm placeholder:font-normal placeholder:text-slate-300 dark:placeholder:text-slate-600"
                      onChange={e => setFormData({...formData, rcNumber: e.target.value})}
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 ml-2">Primary Email <span className="text-rose-500">*</span></label>
                    <input
                      type="email"
                      required
                      maxLength={255}
                      value={formData.email}
                      className="w-full border border-slate-200 dark:border-slate-700 p-5 rounded-2xl bg-white dark:bg-slate-800 text-sm font-bold text-legal-900 dark:text-white focus:ring-4 focus:ring-legal-gold/10 focus:border-legal-gold outline-none transition-all shadow-sm placeholder:font-normal placeholder:text-slate-300 dark:placeholder:text-slate-600"
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 ml-2">Secure Phone Line</label>
                    <input
                      type="tel"
                      maxLength={50}
                      value={formData.phone}
                      className="w-full border border-slate-200 dark:border-slate-700 p-5 rounded-2xl bg-white dark:bg-slate-800 text-sm font-bold text-legal-900 dark:text-white focus:ring-4 focus:ring-legal-gold/10 focus:border-legal-gold outline-none transition-all shadow-sm placeholder:font-normal placeholder:text-slate-300 dark:placeholder:text-slate-600"
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 ml-2">Service Address</label>
                  <textarea
                    value={formData.address}
                    maxLength={500}
                    className="w-full border border-slate-200 dark:border-slate-700 p-5 rounded-2xl bg-white dark:bg-slate-800 text-sm font-medium text-legal-900 dark:text-white focus:ring-4 focus:ring-legal-gold/10 focus:border-legal-gold outline-none transition-all shadow-sm resize-none h-24 placeholder:text-slate-300 dark:placeholder:text-slate-600"
                    onChange={e => setFormData({...formData, address: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t border-slate-50 dark:border-slate-800">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Abort Procedure</button>
                <button type="submit" className="flex-[2] bg-legal-900 dark:bg-legal-gold text-white dark:text-legal-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-legal-gold hover:text-legal-900 dark:hover:bg-white shadow-xl transition-all">
                  {editingId ? 'Update Client Intelligence' : 'Register New Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Purge Client Intelligence"
        message="This operation will permanently excise this client record from the firm architecture. All historical associations will be archived but the profile will be destroyed."
        confirmLabel="Confirm Purge"
        variant="danger"
      />
    </div>
  );
};