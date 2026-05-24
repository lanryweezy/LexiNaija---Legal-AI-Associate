import React, { useState, Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { Auth } from './components/Auth';
import { CommandPalette } from './components/CommandPalette';
const Dashboard = lazy(() => import('./components/Dashboard').then(m => ({ default: m.Dashboard })));
const Research = lazy(() => import('./components/Research').then(m => ({ default: m.Research })));
const Drafter = lazy(() => import('./components/Drafter').then(m => ({ default: m.Drafter })));
const Summarizer = lazy(() => import('./components/Summarizer').then(m => ({ default: m.Summarizer })));
const Clients = lazy(() => import('./components/Clients').then(m => ({ default: m.Clients })));
const Cases = lazy(() => import('./components/Cases').then(m => ({ default: m.Cases })));
const Billing = lazy(() => import('./components/Billing').then(m => ({ default: m.Billing })));
const DocumentEditor = lazy(() => import('./components/DocumentEditor').then(m => ({ default: m.DocumentEditor })));
const Docket = lazy(() => import('./components/Docket').then(m => ({ default: m.Docket })));
const Settings = lazy(() => import('./components/Settings').then(m => ({ default: m.Settings })));
const ConflictCheck = lazy(() => import('./components/ConflictCheck').then(m => ({ default: m.ConflictCheck })));
const Calculators = lazy(() => import('./components/Calculators').then(m => ({ default: m.Calculators })));
const Precedents = lazy(() => import('./components/Precedents').then(m => ({ default: m.Precedents })));
const PracticeGuide = lazy(() => import('./components/PracticeGuide').then(m => ({ default: m.PracticeGuide })));
const Strategy = lazy(() => import('./components/Strategy').then(m => ({ default: m.Strategy })));
const Evidence = lazy(() => import('./components/Evidence').then(m => ({ default: m.Evidence })));
const Witness = lazy(() => import('./components/Witness').then(m => ({ default: m.Witness })));
const Briefs = lazy(() => import('./components/Briefs').then(m => ({ default: m.Briefs })));
const Corporate = lazy(() => import('./components/Corporate').then(m => ({ default: m.Corporate })));
const Analytics = lazy(() => import('./components/Analytics').then(m => ({ default: m.Analytics })));
const CaseLawDatabase = lazy(() => import('./components/CaseLawDatabase').then(m => ({ default: m.CaseLawDatabase })));
const BailiffTracker = lazy(() => import('./components/BailiffTracker').then(m => ({ default: m.BailiffTracker })));
const ComplianceAudit = lazy(() => import('./components/ComplianceAudit').then(m => ({ default: m.ComplianceAudit })));
const ClientPortal = lazy(() => import('./components/ClientPortal').then(m => ({ default: m.ClientPortal })));
const Entertainment = lazy(() => import('./components/Entertainment').then(m => ({ default: m.Entertainment })));
const FeeCalculator = lazy(() => import('./components/FeeCalculator').then(m => ({ default: m.FeeCalculator })));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy').then(m => ({ default: m.PrivacyPolicy })));
const TermsOfService = lazy(() => import('./components/TermsOfService').then(m => ({ default: m.TermsOfService })));
const Notifications = lazy(() => import('./components/Notifications').then(m => ({ default: m.Notifications })));

import { AppView } from './types';
import { LegalStoreProvider, useLegalStore } from './contexts/LegalStoreContext';
import { ToastProvider } from './contexts/ToastContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ChevronRight } from 'lucide-react';

const Breadcrumbs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0 || pathnames[0] === 'landing' || pathnames[0] === 'auth') return null;

  return (
    <nav className="flex items-center gap-2 px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
      <button
        onClick={() => navigate('/dashboard')}
        className="hover:text-legal-gold transition-colors"
      >
        LexiNaija
      </button>
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;

        return (
          <React.Fragment key={to}>
            <ChevronRight size={10} className="text-slate-300" />
            {last ? (
              <span className="text-legal-900 dark:text-white">{value.replaceAll('_', ' ')}</span>
            ) : (
              <button
                onClick={() => navigate(to)}
                className="hover:text-legal-gold transition-colors"
              >
                {value.replaceAll('_', ' ')}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

function AppRoutes() {
  const { currentView, setView } = useLegalStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const path = location.pathname.substring(1).toUpperCase() || 'LANDING';
    if (Object.values(AppView).includes(path as AppView)) {
        setView(path as AppView);
    }
  }, [location, setView]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isFullPage = currentView === AppView.LANDING || currentView === AppView.AUTH || currentView === AppView.PRIVACY || currentView === AppView.TERMS;

  const handleNavigate = (view: AppView) => {
    setView(view);
    navigate(`/${view.toLowerCase()}`);
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors">
      {!isFullPage && <Sidebar currentView={currentView} />}
      <div className={`flex-1 flex flex-col ${!isFullPage ? 'ml-64' : ''} overflow-hidden`}>
        {!isFullPage && <Breadcrumbs />}
        <main className={`flex-1 overflow-auto scrollbar-hide ${currentView === AppView.EDITOR || currentView === AppView.DOCKET || currentView === AppView.EVIDENCE || currentView === AppView.WITNESS || currentView === AppView.BRIEFS || currentView === AppView.CORPORATE ? 'bg-white dark:bg-slate-900' : ''}`}>
          <Suspense fallback={<div className="p-6 text-sm text-gray-600">Loading…</div>}>
            <Routes>
              <Route path="/" element={<Navigate to={`/${AppView.LANDING.toLowerCase()}`} replace />} />
              <Route path="/landing" element={<LandingPage onGetStarted={() => handleNavigate(AppView.DASHBOARD)} onNavigate={handleNavigate} />} />
              <Route path="/auth" element={<Auth onAuthSuccess={() => handleNavigate(AppView.DASHBOARD)} />} />
              <Route path="/dashboard" element={<Dashboard onNavigate={handleNavigate} />} />
              <Route path="/docket" element={<Docket />} />
              <Route path="/research" element={<Research />} />
              <Route path="/drafter" element={<Drafter />} />
              <Route path="/summarizer" element={<Summarizer />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/cases" element={<Cases />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/editor" element={<DocumentEditor />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/conflict_check" element={<ConflictCheck />} />
              <Route path="/calculators" element={<Calculators />} />
              <Route path="/precedents" element={<Precedents onNavigate={handleNavigate} />} />
              <Route path="/practice_guide" element={<PracticeGuide />} />
              <Route path="/strategy" element={<Strategy />} />
              <Route path="/evidence" element={<Evidence />} />
              <Route path="/witness" element={<Witness />} />
              <Route path="/briefs" element={<Briefs />} />
              <Route path="/corporate" element={<Corporate />} />
              <Route path="/entertainment" element={<Entertainment />} />
              <Route path="/calculator" element={<FeeCalculator />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/case_law" element={<CaseLawDatabase />} />
              <Route path="/bailiff" element={<BailiffTracker />} />
              <Route path="/audit" element={<ComplianceAudit />} />
              <Route path="/portal" element={<ClientPortal />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/privacy" element={<PrivacyPolicy onBack={() => handleNavigate(AppView.LANDING)} />} />
              <Route path="/terms" element={<TermsOfService onBack={() => handleNavigate(AppView.LANDING)} />} />
              <Route path="*" element={
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <h2 className="text-2xl font-serif font-black italic">View Not Found</h2>
                  <p className="mt-2 text-sm uppercase tracking-widest font-black">The requested intelligence module is unavailable.</p>
                  <button
                    onClick={() => handleNavigate(AppView.DASHBOARD)}
                    className="mt-8 px-6 py-3 bg-legal-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-legal-gold transition-all"
                  >
                    Return to Control Panel
                  </button>
                </div>
              } />
            </Routes>
          </Suspense>
        </main>
      </div>
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <LegalStoreProvider>
        <ToastProvider>
          <ThemeProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </ThemeProvider>
        </ToastProvider>
      </LegalStoreProvider>
    </ErrorBoundary>
  );
}

export default App;
