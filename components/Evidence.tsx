import React, { useState } from 'react';
import { Archive, Plus, Trash2, FileText, Image as ImageIcon, MessageSquare, Box, FileCheck, ExternalLink, Printer } from 'lucide-react';
import { useLegalStore } from '../contexts/LegalStoreContext';
import { EvidenceItem } from '../types';

export const Evidence: React.FC = () => {
  const { cases, addEvidence, deleteEvidence, saveDocumentToCase, firmProfile, clients } = useLegalStore();
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState<Partial<EvidenceItem>>({
    type: 'Document',
    isReliedUpon: true,
    custodyLocation: 'Case File'
  });

  const selectedCase = cases.find(c => c.id === selectedCaseId);
  const caseEvidence = selectedCase?.evidence || [];

  const handleAddEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCaseId && formData.description) {
      addEvidence(selectedCaseId, {
        id: Date.now().toString(),
        description: formData.description,
        type: formData.type as any,
        dateObtained: formData.dateObtained ? new Date(formData.dateObtained) : new Date(),
        isReliedUpon: formData.isReliedUpon || false,
        custodyLocation: formData.custodyLocation,
        notes: formData.notes
      });
      setShowModal(false);
      setFormData({ type: 'Document', isReliedUpon: true, custodyLocation: 'Case File', description: '', notes: '' });
    }
  };

  const generateListofDocuments = () => {
    if (!selectedCase) return;
    
    const client = clients.find(c => c.id === selectedCase.clientId);
    const reliedDocuments = caseEvidence.filter(e => e.isReliedUpon);

    if (reliedDocuments.length === 0) {
        alert("No evidence marked as 'Relied Upon' to generate list.");
        return;
    }

    const courtHeader = selectedCase.court ? `IN THE ${selectedCase.court.toUpperCase()}` : "IN THE HIGH COURT OF LAGOS STATE";
    const suitNo = selectedCase.suitNumber ? selectedCase.suitNumber : "SUIT NO: ....................";
    
    const content = `# ${courtHeader}
# IN THE ${selectedCase.court?.split(',')[1]?.trim().toUpperCase() || 'LAGOS'} JUDICIAL DIVISION
# HOLDEN AT ${selectedCase.court?.split(',')[1]?.trim().toUpperCase() || 'LAGOS'}

**${suitNo}**

**BETWEEN:**

**${client?.name.toUpperCase() || 'CLAIMANT'}** ........................................ **CLAIMANT**

**AND**

**${selectedCase.opposingParty?.toUpperCase() || 'DEFENDANT'}** ........................................ **DEFENDANT**

## LIST OF DOCUMENTS TO BE RELIED UPON AT TRIAL

**TAKE NOTICE** that the Claimant/Defendant intends to rely on the following documents at the trial of this suit:

${reliedDocuments.map((doc, idx) => `${idx + 1}. ${doc.description} dated ${new Date(doc.dateObtained).toLocaleDateString()}.`).join('\n\n')}

**DATED THIS ...... DAY OF ...... 20....**

__________________________
**${firmProfile.solicitorName}**
Counsel to the Claimant/Defendant
${firmProfile.name}
${firmProfile.address}
${firmProfile.email} | ${firmProfile.phone}

**FOR SERVICE ON:**
THE DEFENDANT/CLAIMANT
C/O THEIR COUNSEL
`;

    saveDocumentToCase(selectedCase.id, {
        id: Date.now().toString(),
        title: `List of Documents - ${new Date().toLocaleDateString()}`,
        content: content,
        type: 'Draft',
        createdAt: new Date()
    });

    alert("Generated 'List of Documents' and saved to Case Documents.");
  };

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-2rem)] flex flex-col">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-serif font-bold text-legal-900 flex items-center gap-2">
            <Archive className="text-legal-gold" /> Evidence & Exhibits
          </h2>
          <p className="text-gray-500 text-sm mt-1">Manage physical and documentary evidence, and generate court schedules.</p>
        </div>
      </div>

      <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
           <div className="flex items-center gap-4 flex-1">
               <label className="text-sm font-medium text-gray-700">Select Case File:</label>
               <select 
                  value={selectedCaseId}
                  onChange={(e) => setSelectedCaseId(e.target.value)}
                  className="w-full max-w-md border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-legal-gold outline-none"
               >
                   <option value="">-- Choose a Matter --</option>
                   {cases.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
               </select>
           </div>
           
           <div className="flex gap-2">
               <button 
                  onClick={generateListofDocuments}
                  disabled={!selectedCaseId || caseEvidence.length === 0}
                  className="bg-white border border-legal-200 text-legal-900 px-4 py-2 rounded-lg hover:bg-legal-50 flex items-center gap-2 text-sm font-medium shadow-sm disabled:opacity-50"
                  title="Generate List of Documents for Frontloading"
               >
                   <FileCheck size={16} /> Generate List
               </button>
               <button 
                  onClick={() => setShowModal(true)}
                  disabled={!selectedCaseId}
                  className="bg-legal-900 text-white px-4 py-2 rounded-lg hover:bg-legal-800 flex items-center gap-2 text-sm font-medium shadow-sm disabled:opacity-50"
               >
                   <Plus size={16} /> Add Item
               </button>
           </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-0">
           {!selectedCaseId ? (
               <div className="h-full flex flex-col items-center justify-center text-gray-300">
                   <Archive className="w-16 h-16 mb-4 opacity-20" />
                   <p>Select a case to view evidence locker</p>
               </div>
           ) : caseEvidence.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-gray-400">
                   <Box className="w-12 h-12 mb-3 opacity-20" />
                   <p>No evidence items recorded for this case.</p>
               </div>
           ) : (
               <table className="w-full text-left border-collapse">
                   <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                       <tr>
                           <th className="px-6 py-3 border-b border-gray-100 w-12">#</th>
                           <th className="px-6 py-3 border-b border-gray-100">Description</th>
                           <th className="px-6 py-3 border-b border-gray-100">Type</th>
                           <th className="px-6 py-3 border-b border-gray-100">Date Obtained</th>
                           <th className="px-6 py-3 border-b border-gray-100">Custody</th>
                           <th className="px-6 py-3 border-b border-gray-100 text-center">Relied Upon?</th>
                           <th className="px-6 py-3 border-b border-gray-100 text-right">Actions</th>
                       </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                       {caseEvidence.map((item, idx) => (
                           <tr key={item.id} className="hover:bg-gray-50 group">
                               <td className="px-6 py-4 text-sm text-gray-400 font-mono">{idx + 1}</td>
                               <td className="px-6 py-4">
                                   <div className="flex items-start gap-3">
                                       <div className="mt-1 text-gray-400">
                                           {item.type === 'Document' && <FileText size={16} />}
                                           {item.type === 'Image' && <ImageIcon size={16} />}
                                           {item.type === 'Correspondence' && <MessageSquare size={16} />}
                                           {item.type === 'Physical' && <Box size={16} />}
                                       </div>
                                       <div>
                                           <p className="font-medium text-legal-900">{item.description}</p>
                                           {item.notes && <p className="text-xs text-gray-500 mt-1">{item.notes}</p>}
                                       </div>
                                   </div>
                               </td>
                               <td className="px-6 py-4 text-sm text-gray-600">
                                   <span className="bg-gray-100 px-2 py-1 rounded text-xs">{item.type}</span>
                               </td>
                               <td className="px-6 py-4 text-sm text-gray-600">{new Date(item.dateObtained).toLocaleDateString()}</td>
                               <td className="px-6 py-4 text-sm text-gray-600">{item.custodyLocation}</td>
                               <td className="px-6 py-4 text-center">
                                   {item.isReliedUpon ? (
                                       <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Yes</span>
                                   ) : (
                                       <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">No</span>
                                   )}
                               </td>
                               <td className="px-6 py-4 text-right">
                                   <button 
                                      onClick={() => deleteEvidence(selectedCaseId, item.id)}
                                      className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all p-1.5 hover:bg-red-50 rounded"
                                   >
                                       <Trash2 size={16} />
                                   </button>
                               </td>
                           </tr>
                       ))}
                   </tbody>
               </table>
           )}
        </div>
      </div>

      {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="font-bold text-lg text-legal-900">Add New Evidence</h3>
                      <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">×</button>
                  </div>
                  <form onSubmit={handleAddEvidence} className="p-6 space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <input 
                              required
                              type="text" 
                              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-legal-gold outline-none"
                              placeholder="e.g. Receipt of Payment #1234"
                              value={formData.description}
                              onChange={e => setFormData({...formData, description: e.target.value})}
                          />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                              <select 
                                  className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-legal-gold outline-none"
                                  value={formData.type}
                                  onChange={e => setFormData({...formData, type: e.target.value as any})}
                              >
                                  <option value="Document">Document</option>
                                  <option value="Correspondence">Correspondence</option>
                                  <option value="Image">Photograph/Image</option>
                                  <option value="Audio">Audio/Video</option>
                                  <option value="Physical">Physical Object</option>
                              </select>
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Date Obtained</label>
                              <input 
                                  type="date" 
                                  className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-legal-gold outline-none"
                                  onChange={e => setFormData({...formData, dateObtained: new Date(e.target.value)})}
                              />
                          </div>
                      </div>

                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Custody Location</label>
                          <input 
                              type="text" 
                              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-legal-gold outline-none"
                              placeholder="e.g. Client's Safe, Court Registry"
                              value={formData.custodyLocation}
                              onChange={e => setFormData({...formData, custodyLocation: e.target.value})}
                          />
                      </div>

                      <div className="flex items-center gap-2">
                          <input 
                              type="checkbox" 
                              id="relied"
                              checked={formData.isReliedUpon}
                              onChange={e => setFormData({...formData, isReliedUpon: e.target.checked})}
                              className="w-4 h-4 text-legal-900 border-gray-300 rounded focus:ring-legal-gold"
                          />
                          <label htmlFor="relied" className="text-sm text-gray-700">Include in List of Documents (Frontloading)</label>
                      </div>

                      <button type="submit" className="w-full bg-legal-900 text-white font-medium py-2.5 rounded-lg hover:bg-legal-800 transition-colors">
                          Add Item
                      </button>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};