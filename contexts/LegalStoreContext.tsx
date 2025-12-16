import React, { createContext, useContext, useState, useEffect } from 'react';
import { Client, Case, Invoice, SavedDocument, DocumentVersion, BillableItem, Task, FirmProfile, EvidenceItem } from '../types';

interface LegalStoreContextType {
  firmProfile: FirmProfile;
  clients: Client[];
  cases: Case[];
  invoices: Invoice[];
  tasks: Task[];
  activeDoc: { caseId: string; docId: string } | null;
  setActiveDoc: (doc: { caseId: string; docId: string } | null) => void;
  updateFirmProfile: (profile: FirmProfile) => void;
  addClient: (client: Client) => void;
  updateClient: (id: string, data: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  addCase: (newCase: Case) => void;
  updateCase: (id: string, data: Partial<Case>) => void;
  deleteCase: (id: string) => void;
  addInvoice: (invoice: Invoice) => void;
  saveDocumentToCase: (caseId: string, doc: SavedDocument) => void;
  updateCaseDocument: (caseId: string, docId: string, updates: Partial<SavedDocument>) => void;
  addBillableItem: (caseId: string, item: BillableItem) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, data: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addEvidence: (caseId: string, item: EvidenceItem) => void;
  deleteEvidence: (caseId: string, evidenceId: string) => void;
}

const LegalStoreContext = createContext<LegalStoreContextType | undefined>(undefined);

export const LegalStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firmProfile, setFirmProfile] = useState<FirmProfile>({
    name: 'LexiNaija Chambers',
    address: '12 Victoria Island, Lagos',
    email: 'info@lexinaija.com',
    phone: '0800-LEXI-NAIJA',
    solicitorName: 'A. I. Lawyer, Esq.'
  });

  const [activeDoc, setActiveDoc] = useState<{ caseId: string; docId: string } | null>(null);

  const [clients, setClients] = useState<Client[]>([
    { id: '1', name: 'Musa Properties Ltd', type: 'Corporate', email: 'info@musaproperties.ng', phone: '08031234567', address: '45, Adetokunbo Ademola, VI, Lagos', dateAdded: new Date() },
    { id: '2', name: 'Chief Emeka Okonkwo', type: 'Individual', email: 'emeka.okonkwo@email.com', phone: '09098765432', address: '12, Wuse 2, Abuja', dateAdded: new Date() }
  ]);

  const [cases, setCases] = useState<Case[]>([
    { 
      id: '101', 
      clientId: '1', 
      title: 'Tenancy Recovery - 15 Awolowo Way', 
      suitNumber: 'MC/L/123/2024', 
      court: 'Magistrate Court, Yaba', 
      status: 'Pending Court', 
      nextHearing: '2024-05-20', 
      notes: 'Tenant has not paid for 2 years. Statutory notices served.',
      opposingParty: 'Mr. Johnson Chukwuma',
      documents: [],
      billableItems: [
        { id: 'b1', description: 'Consultation Fee', amount: 50000, date: new Date('2024-01-15'), type: 'Professional Fee' },
        { id: 'b2', description: 'Filing of Writ of Summons', amount: 25000, date: new Date('2024-02-01'), type: 'Expense' }
      ],
      evidence: [
        {
          id: 'ev1',
          description: 'Tenancy Agreement dated 2020',
          type: 'Document',
          dateObtained: new Date('2020-01-01'),
          isReliedUpon: true,
          custodyLocation: 'Original with Client'
        },
        {
          id: 'ev2',
          description: 'Notice to Quit (Duplicate Copy)',
          type: 'Document',
          dateObtained: new Date('2023-11-01'),
          isReliedUpon: true,
          custodyLocation: 'Case File'
        }
      ]
    }
  ]);

  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: '1001', clientId: '1', caseId: '101', amount: 75000, description: 'Professional fees for consultation and filing of recovery action.', status: 'Sent', date: new Date() }
  ]);

  const [tasks, setTasks] = useState<Task[]>([
      { id: 't1', title: 'File Motion Ex-Parte', dueDate: new Date('2024-05-18'), priority: 'High', status: 'Pending', caseId: '101' },
      { id: 't2', title: 'Call Client for Updates', dueDate: new Date('2024-05-19'), priority: 'Low', status: 'Pending', caseId: '101' }
  ]);

  const updateFirmProfile = (profile: FirmProfile) => setFirmProfile(profile);

  const addClient = (client: Client) => setClients([...clients, client]);
  
  const updateClient = (id: string, data: Partial<Client>) => {
    setClients(clients.map(c => c.id === id ? { ...c, ...data } : c));
  };

  const deleteClient = (id: string) => {
    setClients(clients.filter(c => c.id !== id));
  };

  const addCase = (newCase: Case) => setCases([...cases, newCase]);
  
  const updateCase = (id: string, data: Partial<Case>) => {
    setCases(cases.map(c => c.id === id ? { ...c, ...data } : c));
  };

  const deleteCase = (id: string) => {
    setCases(cases.filter(c => c.id !== id));
  };

  const addInvoice = (invoice: Invoice) => setInvoices([...invoices, invoice]);
  
  const saveDocumentToCase = (caseId: string, doc: SavedDocument) => {
    setCases(cases.map(c => {
      if (c.id === caseId) {
        return { ...c, documents: [...c.documents, doc] };
      }
      return c;
    }));
  };

  const updateCaseDocument = (caseId: string, docId: string, updates: Partial<SavedDocument>) => {
    setCases(cases.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          documents: c.documents.map(d => {
            if (d.id === docId) {
               const version: DocumentVersion = {
                 id: Date.now().toString(),
                 timestamp: new Date(),
                 content: d.content,
                 title: d.title
               };
               const existingVersions = d.versions || [];
               return { ...d, ...updates, versions: [version, ...existingVersions] };
            }
            return d;
          })
        };
      }
      return c;
    }));
  };

  const addBillableItem = (caseId: string, item: BillableItem) => {
    setCases(cases.map(c => {
      if (c.id === caseId) {
        return { ...c, billableItems: [...c.billableItems, item] };
      }
      return c;
    }));
  };

  const addEvidence = (caseId: string, item: EvidenceItem) => {
    setCases(cases.map(c => {
      if (c.id === caseId) {
        return { ...c, evidence: [...(c.evidence || []), item] };
      }
      return c;
    }));
  };

  const deleteEvidence = (caseId: string, evidenceId: string) => {
    setCases(cases.map(c => {
      if (c.id === caseId) {
        return { ...c, evidence: (c.evidence || []).filter(e => e.id !== evidenceId) };
      }
      return c;
    }));
  };

  const addTask = (task: Task) => setTasks([...tasks, task]);
  
  const updateTask = (id: string, data: Partial<Task>) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, ...data } : t));
  };
  
  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <LegalStoreContext.Provider value={{ 
      firmProfile, clients, cases, invoices, tasks, activeDoc,
      updateFirmProfile, addClient, updateClient, deleteClient, 
      addCase, updateCase, deleteCase, addInvoice, 
      saveDocumentToCase, updateCaseDocument, addBillableItem, 
      addTask, updateTask, deleteTask, addEvidence, deleteEvidence, setActiveDoc 
    }}>
      {children}
    </LegalStoreContext.Provider>
  );
};

export const useLegalStore = () => {
  const context = useContext(LegalStoreContext);
  if (!context) throw new Error("useLegalStore must be used within a LegalStoreProvider");
  return context;
};