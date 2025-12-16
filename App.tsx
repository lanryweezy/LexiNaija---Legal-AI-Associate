import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Research } from './components/Research';
import { Drafter } from './components/Drafter';
import { Summarizer } from './components/Summarizer';
import { Clients } from './components/Clients';
import { Cases } from './components/Cases';
import { Billing } from './components/Billing';
import { DocumentEditor } from './components/DocumentEditor';
import { Docket } from './components/Docket';
import { Settings } from './components/Settings';
import { ConflictCheck } from './components/ConflictCheck';
import { Calculators } from './components/Calculators';
import { Precedents } from './components/Precedents';
import { PracticeGuide } from './components/PracticeGuide';
import { Strategy } from './components/Strategy';
import { Evidence } from './components/Evidence';
import { Witness } from './components/Witness';
import { Briefs } from './components/Briefs';
import { Corporate } from './components/Corporate';
import { AppView } from './types';
import { LegalStoreProvider } from './contexts/LegalStoreContext';

function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard onNavigate={setCurrentView} />;
      case AppView.DOCKET:
        return <Docket />;
      case AppView.RESEARCH:
        return <Research />;
      case AppView.DRAFTER:
        return <Drafter />;
      case AppView.SUMMARIZER:
        return <Summarizer />;
      case AppView.CLIENTS:
        return <Clients />;
      case AppView.CASES:
        return <Cases />;
      case AppView.BILLING:
        return <Billing />;
      case AppView.EDITOR:
        return <DocumentEditor />;
      case AppView.SETTINGS:
        return <Settings />;
      case AppView.CONFLICT_CHECK:
        return <ConflictCheck />;
      case AppView.CALCULATORS:
        return <Calculators />;
      case AppView.PRECEDENTS:
        return <Precedents onNavigate={setCurrentView} />;
      case AppView.PRACTICE_GUIDE:
        return <PracticeGuide />;
      case AppView.STRATEGY:
        return <Strategy />;
      case AppView.EVIDENCE:
        return <Evidence />;
      case AppView.WITNESS:
        return <Witness />;
      case AppView.BRIEFS:
        return <Briefs />;
      case AppView.CORPORATE:
        return <Corporate />;
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <LegalStoreProvider>
      <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-900">
        <Sidebar currentView={currentView} setView={setCurrentView} />
        <main className={`flex-1 ml-64 overflow-auto scrollbar-hide ${currentView === AppView.EDITOR || currentView === AppView.DOCKET || currentView === AppView.EVIDENCE || currentView === AppView.WITNESS || currentView === AppView.BRIEFS || currentView === AppView.CORPORATE ? 'bg-white' : ''}`}>
          {renderView()}
        </main>
      </div>
    </LegalStoreProvider>
  );
}

export default App;