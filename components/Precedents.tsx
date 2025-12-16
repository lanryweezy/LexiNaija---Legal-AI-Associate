import React, { useState } from 'react';
import { BookOpen, FileText, ChevronRight, Copy, Search, Scale, Briefcase, Building2, Shield } from 'lucide-react';
import { useLegalStore } from '../contexts/LegalStoreContext';
import { AppView } from '../types';

interface PrecedentsProps {
  onNavigate: (view: AppView) => void;
}

interface Template {
  id: string;
  category: string;
  title: string;
  description: string;
  content: string;
}

const TEMPLATES: Template[] = [
  {
    id: 'p1',
    category: 'Civil Litigation',
    title: 'Motion Ex-Parte for Substituted Service',
    description: 'Application to serve court processes by substitution (e.g. pasting at address).',
    content: `# IN THE HIGH COURT OF LAGOS STATE
# IN THE IKEJA JUDICIAL DIVISION
# HOLDEN AT IKEJA

SUIT NO: ....................

BETWEEN:

[PLAINTIFF NAME]   ........................................   CLAIMANT/APPLICANT

AND

[DEFENDANT NAME]   ........................................   DEFENDANT/RESPONDENT

## MOTION EX-PARTE
**BROUGHT PURSUANT TO ORDER 7 RULE 5 OF THE HIGH COURT OF LAGOS STATE (CIVIL PROCEDURE) RULES 2019 AND UNDER THE INHERENT JURISDICTION OF THIS HONOURABLE COURT**

**TAKE NOTICE** that this Honourable Court will be moved on the ...... day of ...... 20.... at the hour of 9 o'clock in the forenoon or so soon thereafter as Counsel for the Claimant/Applicant may be heard praying the Court for the following orders:

1. **AN ORDER** of this Honourable Court granting leave to the Claimant/Applicant to serve the Writ of Summons and other originating processes in this suit on the Defendant by substituted means, to wit: by pasting same on the entrance gate or conspicuous part of the Defendant's last known address at [ADDRESS].

2. **AND FOR SUCH FURTHER ORDER(S)** as this Honourable Court may deem fit to make in the circumstances.

**DATED THIS ...... DAY OF ...... 20....**

__________________________
**[LAWYER NAME]**
Counsel to the Applicant
[FIRM ADDRESS]
`
  },
  {
    id: 'p2',
    category: 'Civil Litigation',
    title: 'Affidavit of Urgency',
    description: 'Supporting affidavit for urgent applications.',
    content: `# IN THE HIGH COURT OF LAGOS STATE
# HOLDEN AT LAGOS

SUIT NO: ....................

BETWEEN:

[PLAINTIFF NAME]   .......   CLAIMANT

AND

[DEFENDANT NAME]   .......   DEFENDANT

## AFFIDAVIT OF URGENCY

I, [DEPONENT NAME], Male/Female, Christian/Muslim, Nigerian Citizen of [ADDRESS], do hereby make Oath and state as follows:

1. That I am the Claimant in this suit and by virtue of my position, I am conversant with the facts deposed herein.
2. That the res (subject matter) of this suit is at imminent risk of being destroyed by the Defendant.
3. That unless this Honourable Court intervenes urgently, the judgment of this court will be rendered nugatory.
4. That it is in the interest of justice to grant this application.
5. That I swear to this Affidavit in good faith believing the contents to be true and correct in accordance with the Oaths Act.

__________________________
**DEPONENT**

**SWORN TO** at the High Court Registry, Lagos.
This ...... day of ...... 20....

**BEFORE ME**

**COMMISSIONER FOR OATHS**
`
  },
  {
    id: 'p3',
    category: 'Property',
    title: 'Notice to Quit (7 Days)',
    description: 'Statutory notice for weekly tenants or tenants at will.',
    content: `[DATE]

TO:
[TENANT NAME]
[PROPERTY ADDRESS]

Dear Sir/Ma,

## NOTICE TO QUIT

I, [SOLICITOR NAME], Solicitor to your Landlord, [LANDLORD NAME], hereby give you NOTICE to quit and deliver up possession of the [DESCRIPTION OF PREMISES] with the appurtenances situate at [ADDRESS] which you hold of him as tenant thereof, on the [DATE OF EXPIRY] or at the expiration of the current week of your tenancy which shall expire next after the end of seven (7) days from the service of this notice.

DATED this ...... day of ...... 20....

__________________________
**[SOLICITOR NAME]**
Solicitor to the Landlord
`
  },
  {
    id: 'p4',
    category: 'Corporate',
    title: 'Board Resolution (Bank Account)',
    description: 'Resolution to open a corporate bank account.',
    content: `## BOARD RESOLUTION OF [COMPANY NAME]

**HELD AT THE REGISTERED OFFICE OF THE COMPANY AT [ADDRESS] ON THE ...... DAY OF ...... 20....**

**PRESENT:**
1. Director A
2. Director B
3. Secretary

**BUSINESS OF THE DAY:**
OPENING OF BANK ACCOUNT

**IT WAS RESOLVED:**

1. That a Current Account be opened with **[BANK NAME]** in the name of the Company.
2. That the said Bank be and is hereby authorized to honor cheques, bills of exchange, and promissory notes drawn, accepted, or made on behalf of the Company.
3. That the signatories to the account shall be:
   - Category A: [Name]
   - Category B: [Name]
4. That the mandate for the account shall be [Signing Instruction, e.g., A and B to sign].

**DATED THIS ...... DAY OF ...... 20....**

__________________________          __________________________
**DIRECTOR**                        **SECRETARY**
`
  }
];

export const Precedents: React.FC<PrecedentsProps> = ({ onNavigate }) => {
  const { cases, saveDocumentToCase, setActiveDoc } = useLegalStore();
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [targetCaseId, setTargetCaseId] = useState('');

  const filtered = TEMPLATES.filter(t => 
    (category === 'All' || t.category === 'All' || t.category === category) &&
    (t.title.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase()))
  );

  const categories = ['All', 'Civil Litigation', 'Property', 'Corporate', 'Criminal'];

  const handleUseTemplate = () => {
    if (!targetCaseId || !selectedTemplate) return;
    
    const newDocId = Date.now().toString();
    saveDocumentToCase(targetCaseId, {
      id: newDocId,
      title: selectedTemplate.title,
      content: selectedTemplate.content,
      type: 'Draft',
      createdAt: new Date()
    });

    // Navigate to Editor with this document active
    setActiveDoc({ caseId: targetCaseId, docId: newDocId });
    onNavigate(AppView.EDITOR);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-2rem)] flex flex-col">
      <div className="mb-8">
        <h2 className="text-2xl font-serif font-bold text-legal-900">Precedents Library</h2>
        <p className="text-gray-500 text-sm mt-1">Standardized Nigerian legal forms and templates ready for drafting.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 h-full overflow-hidden">
        {/* Sidebar / Filters */}
        <div className="w-full md:w-64 flex flex-col gap-2 shrink-0">
           <div className="relative mb-4">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
             <input 
               type="text" 
               placeholder="Search templates..."
               value={search}
               onChange={e => setSearch(e.target.value)}
               className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-legal-gold outline-none"
             />
           </div>
           
           <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Categories</h3>
           {categories.map(cat => (
             <button
               key={cat}
               onClick={() => setCategory(cat)}
               className={`text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${category === cat ? 'bg-legal-100 text-legal-900' : 'text-gray-600 hover:bg-gray-50'}`}
             >
               {cat}
             </button>
           ))}
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                {filtered.map(template => (
                    <div key={template.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-legal-gold transition-all flex flex-col">
                        <div className="w-10 h-10 rounded-full bg-legal-50 text-legal-900 flex items-center justify-center mb-4">
                            {template.category === 'Property' ? <Building2 size={20}/> : 
                             template.category === 'Corporate' ? <Briefcase size={20}/> :
                             template.category === 'Criminal' ? <Shield size={20}/> : <Scale size={20}/>}
                        </div>
                        <h3 className="font-bold text-legal-900 mb-2">{template.title}</h3>
                        <p className="text-sm text-gray-500 mb-4 flex-1">{template.description}</p>
                        <button 
                            onClick={() => { setSelectedTemplate(template); setTargetCaseId(''); }}
                            className="w-full py-2 border border-legal-200 text-legal-900 font-medium rounded-lg hover:bg-legal-900 hover:text-white transition-colors flex items-center justify-center gap-2 text-sm"
                        >
                            <FileText size={16} /> Use Template
                        </button>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {selectedTemplate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="font-bold text-lg text-legal-900">Create from Template</h3>
                      <button onClick={() => setSelectedTemplate(null)} className="text-gray-400 hover:text-gray-600">×</button>
                  </div>
                  <div className="p-6 space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <p className="text-xs font-bold text-gray-500 uppercase mb-1">Selected Template</p>
                          <p className="font-bold text-legal-900">{selectedTemplate.title}</p>
                      </div>

                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Select Matter to Attach</label>
                          <select 
                            value={targetCaseId}
                            onChange={e => setTargetCaseId(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-legal-gold outline-none"
                          >
                              <option value="">-- Choose a Case File --</option>
                              {cases.map(c => (
                                  <option key={c.id} value={c.id}>{c.title}</option>
                              ))}
                          </select>
                          {cases.length === 0 && <p className="text-xs text-red-500 mt-1">No active cases. Create a case first.</p>}
                      </div>

                      <div className="flex gap-3 pt-2">
                          <button onClick={() => setSelectedTemplate(null)} className="flex-1 py-2.5 text-gray-600 font-medium hover:bg-gray-50 rounded-lg">Cancel</button>
                          <button 
                            onClick={handleUseTemplate}
                            disabled={!targetCaseId}
                            className="flex-1 bg-legal-900 text-white py-2.5 rounded-lg font-medium hover:bg-legal-800 disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                              <Copy size={16} /> Create Draft
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};