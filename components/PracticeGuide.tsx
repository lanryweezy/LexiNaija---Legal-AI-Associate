import React, { useState } from 'react';
import { Book, CheckSquare, ChevronRight, ListChecks, ArrowRightCircle, Building2, Home, Scale, User, ShieldCheck } from 'lucide-react';
import { useLegalStore } from '../contexts/LegalStoreContext';
import { AppView } from '../types';

interface Guide {
  id: string;
  category: string;
  title: string;
  description: string;
  steps: string[];
}

const GUIDES: Guide[] = [
  {
    id: 'g1',
    category: 'Property',
    title: 'Perfection of Title (Lagos State)',
    description: 'Procedure for obtaining Governor\'s Consent and registering title at the Lands Registry.',
    steps: [
      'Application letter for Governor\'s Consent to the Director of Land Services.',
      'Submit Form 1C duly signed by parties.',
      'Submit 3 Certified True Copies (CTC) of Root of Title.',
      'Submit 4 copies of the Deed of Assignment (with survey plans attached).',
      'Pay Charting Fee and Endorsement Fee.',
      'Obtain Demand Notice for Consent Fee, Capital Gains Tax, Stamp Duties, and Registration Fee.',
      'Make payments to designated banks and obtain Treasury Receipts.',
      'Submit receipts for verification.',
      'Stamping of Deeds at the Stamp Duties Office.',
      'Registration of Deeds at the Lands Registry.',
      'Collection of Perfected Deed.'
    ]
  },
  {
    id: 'g2',
    category: 'Corporate',
    title: 'Company Incorporation (Private Ltd)',
    description: 'Steps to register a private company limited by shares under CAMA 2020 via CRP.',
    steps: [
      'Create account on CAC Companies Registration Portal (CRP).',
      'Conduct Name Search/Reservation (Availability Check).',
      'Complete Pre-incorporation Form (Form CAC 1.1) online.',
      'Input details of Directors, Shareholders, and PSCs (Persons with Significant Control).',
      'Prepare Memorandum and Articles of Association (can use model articles).',
      'Pay Filing Fees and Stamp Duties online via Remita.',
      'Download pre-filled documents for signature.',
      'Upload scanned signature pages and IDs of Directors/Shareholders.',
      'Wait for approval and download E-Certificate and Certified True Copies.'
    ]
  },
  {
    id: 'g3',
    category: 'Litigation',
    title: 'Recovery of Premises (Lagos)',
    description: 'Statutory procedure for evicting tenants under the Tenancy Law of Lagos State.',
    steps: [
      'Determine the nature of tenancy (Weekly, Monthly, Yearly, Fixed).',
      'Serve valid Notice to Quit (Form TL2 or TL3) - (7 days, 1 month, or 6 months).',
      'Wait for expiration of Notice to Quit.',
      'Serve 7 Days Notice of Owner\'s Intention to Recover Possession (Form TL4).',
      'File Writ of Summons and Particulars of Claim at Magistrate or High Court (depending on rental value).',
      'Serve Court Processes on the Defendant/Tenant.',
      'Trial / Hearing.',
      'Obtain Judgment and Order for Possession.',
      'Apply for Warrant of Possession if tenant refuses to vacate.'
    ]
  },
  {
    id: 'g4',
    category: 'Litigation',
    title: 'Fundamental Rights Enforcement',
    description: 'Procedure under the FREP Rules 2009.',
    steps: [
      'Prepare Motion on Notice.',
      'Prepare Statement setting out the name and description of applicant, relief sought, and grounds.',
      'Prepare Affidavit in Support of the application.',
      'Prepare Written Address in support of the application.',
      'File processes at the High Court (State or Federal depending on respondent).',
      'Serve Respondent(s) within 5 days of filing.',
      'Respond to Counter-Affidavits if filed.',
      'Hearing of the Application.'
    ]
  },
  {
    id: 'g5',
    category: 'Family',
    title: 'Dissolution of Marriage (Divorce)',
    description: 'Petition for Decree Nisi/Absolute under Matrimonial Causes Act.',
    steps: [
      'Verify jurisdiction and domicile.',
      'Draft Petition stating facts and grounds (Two years separation, adultery, etc.).',
      'Complete Verifying Affidavit and Certificate of Reconciliation.',
      'File Petition at the High Court.',
      'Serve Petition on the Respondent.',
      'Wait for Answer (if any). If undefended, set down for hearing.',
      'Trial/Hearing (Petitioner gives evidence).',
      'Judge grants Decree Nisi.',
      'Wait 3 months for Decree Absolute.'
    ]
  }
];

export const PracticeGuide: React.FC = () => {
  const { cases, addTask } = useLegalStore();
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const categories = ['All', 'Property', 'Corporate', 'Litigation', 'Family'];

  const filteredGuides = GUIDES.filter(g => categoryFilter === 'All' || g.category === categoryFilter);

  const handleCreateTasks = () => {
    if (!selectedGuide) return;
    
    // Create tasks for each step
    const today = new Date();
    selectedGuide.steps.forEach((step, index) => {
        const dueDate = new Date(today);
        dueDate.setDate(today.getDate() + (index + 1)); // Stagger dates by 1 day

        addTask({
            id: Date.now().toString() + index,
            title: step,
            dueDate: dueDate,
            priority: 'Medium',
            status: 'Pending',
            caseId: selectedCaseId || undefined
        });
    });

    alert(`Successfully created ${selectedGuide.steps.length} tasks in your Docket.`);
    setSelectedGuide(null);
    setSelectedCaseId('');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-2rem)] flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-serif font-bold text-legal-900">Practice Guides & Procedures</h2>
        <p className="text-gray-500 text-sm mt-1">Standard Operating Procedures (SOPs) for Nigerian legal practice.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 h-full overflow-hidden">
        {/* Sidebar List */}
        <div className="w-full md:w-1/3 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex gap-2 overflow-x-auto scrollbar-hide">
                {categories.map(cat => (
                    <button 
                        key={cat}
                        onClick={() => setCategoryFilter(cat)}
                        className={`px-3 py-1 text-xs font-bold rounded-full border whitespace-nowrap transition-colors ${categoryFilter === cat ? 'bg-legal-900 text-white border-legal-900' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
            <div className="flex-1 overflow-y-auto">
                {filteredGuides.map(guide => (
                    <button
                        key={guide.id}
                        onClick={() => setSelectedGuide(guide)}
                        className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors flex items-start gap-3 ${selectedGuide?.id === guide.id ? 'bg-legal-50 border-l-4 border-l-legal-gold' : 'border-l-4 border-l-transparent'}`}
                    >
                        <div className="mt-1 text-legal-500 shrink-0">
                            {guide.category === 'Property' ? <Home size={18}/> : 
                             guide.category === 'Corporate' ? <Building2 size={18}/> :
                             guide.category === 'Litigation' ? <Scale size={18}/> :
                             guide.category === 'Family' ? <User size={18}/> : <Book size={18}/>}
                        </div>
                        <div>
                            <h3 className={`font-bold text-sm ${selectedGuide?.id === guide.id ? 'text-legal-900' : 'text-gray-700'}`}>{guide.title}</h3>
                            <p className="text-xs text-gray-400 mt-1 line-clamp-2">{guide.description}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>

        {/* Detail View */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
            {selectedGuide ? (
                <>
                    <div className="p-6 border-b border-gray-100 bg-gray-50">
                        <div className="flex items-center gap-2 mb-2">
                             <span className="text-[10px] font-bold uppercase tracking-wider bg-white px-2 py-0.5 rounded border border-gray-200 text-gray-500">{selectedGuide.category}</span>
                        </div>
                        <h2 className="text-2xl font-serif font-bold text-legal-900">{selectedGuide.title}</h2>
                        <p className="text-gray-600 mt-2 text-sm">{selectedGuide.description}</p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <ListChecks className="text-legal-gold" size={20}/> Procedural Checklist
                        </h3>
                        <div className="space-y-4">
                            {selectedGuide.steps.map((step, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <div className="w-6 h-6 rounded-full bg-legal-100 text-legal-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                                        {idx + 1}
                                    </div>
                                    <p className="text-gray-700 text-sm leading-relaxed border-b border-gray-100 pb-2 w-full">{step}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 border-t border-gray-100 bg-gray-50">
                        <h4 className="font-bold text-sm text-gray-700 mb-2">Convert to Actionable Tasks</h4>
                        <div className="flex gap-4 items-center">
                            <div className="flex-1">
                                <select 
                                    value={selectedCaseId} 
                                    onChange={e => setSelectedCaseId(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-legal-gold outline-none"
                                >
                                    <option value="">-- Associate with a Case (Optional) --</option>
                                    {cases.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                                </select>
                            </div>
                            <button 
                                onClick={handleCreateTasks}
                                className="bg-legal-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-legal-800 flex items-center gap-2"
                            >
                                <CheckSquare size={16} /> Import to Docket
                            </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                            This will create {selectedGuide.steps.length} pending tasks in your Court Diary.
                        </p>
                    </div>
                </>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-300 p-8">
                    <ShieldCheck className="w-16 h-16 mb-4 opacity-20" />
                    <p className="text-lg font-medium text-gray-400">Select a guide to view procedure</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};