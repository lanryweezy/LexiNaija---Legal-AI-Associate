import React from 'react';
import { useLegalStore } from '../contexts/LegalStoreContext';
import { Bell, Calendar, AlertTriangle, Clock, CheckCircle, X, ChevronRight, Info } from 'lucide-react';
import { getCasesApproachingLimitation } from '../services/limitationCalculator';
import { AppView } from '../types';
import { useNavigate } from 'react-router-dom';

export const Notifications: React.FC = () => {
  const { cases, tasks, setView } = useLegalStore();
  const navigate = useNavigate();

  // Logic to gather "notifiable" events
  const limitationCases = getCasesApproachingLimitation(cases, 90);
  const upcomingHearings = cases.filter(c => {
    if (!c.nextHearing) return false;
    const diff = (new Date(c.nextHearing).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7;
  });
  const pendingTasks = tasks.filter(t => t.status === 'Pending' && t.priority === 'High');

  const handleNavigate = (view: AppView, caseId?: string) => {
    if (caseId) {
        // Ideally we'd set active case here
    }
    setView(view);
    navigate(`/${view.toLowerCase()}`);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto animate-in fade-in duration-1000">
      <div className="flex items-center justify-between mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-black text-legal-gold uppercase tracking-[0.3em] mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-legal-gold animate-pulse"></div>
              Firm Intelligence Feed
          </div>
          <h2 className="text-5xl font-serif font-black text-legal-900 dark:text-white italic tracking-tighter leading-tight">Notifications</h2>
          <p className="text-slate-400 dark:text-slate-500 font-medium">Strategic alerts and critical practice deadlines.</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Statute Bar Alerts */}
        {limitationCases.map(c => (
          <div key={`lim-${c.id}`} className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 p-6 rounded-[32px] flex items-center justify-between group hover:shadow-lg transition-all">
            <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-white dark:bg-rose-900/50 rounded-2xl flex items-center justify-center text-rose-500 shadow-sm border border-rose-100 dark:border-rose-900/50">
                    <AlertTriangle size={24} />
                </div>
                <div>
                    <h4 className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest mb-1">Statute-Bar Risk</h4>
                    <p className="font-serif font-black text-lg text-legal-900 dark:text-white italic">{c.title}</p>
                    <p className="text-xs text-rose-700 dark:text-rose-300 font-medium mt-1">{c.urgency.message}</p>
                </div>
            </div>
            <button
                onClick={() => handleNavigate(AppView.CASES)}
                className="p-4 bg-white dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-rose-600 transition-colors shadow-sm opacity-0 group-hover:opacity-100"
            >
                <ChevronRight size={20} />
            </button>
          </div>
        ))}

        {/* Hearing Alerts */}
        {upcomingHearings.map(c => (
          <div key={`hear-${c.id}`} className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 p-6 rounded-[32px] flex items-center justify-between group hover:shadow-lg transition-all">
            <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-white dark:bg-amber-900/50 rounded-2xl flex items-center justify-center text-amber-500 shadow-sm border border-amber-100 dark:border-amber-900/50">
                    <Calendar size={24} />
                </div>
                <div>
                    <h4 className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-1">Upcoming Hearing</h4>
                    <p className="font-serif font-black text-lg text-legal-900 dark:text-white italic">{c.title}</p>
                    <p className="text-xs text-amber-700 dark:text-amber-300 font-medium mt-1">Set for {new Date(c.nextHearing!).toLocaleDateString()} at {c.court || 'designated forum'}.</p>
                </div>
            </div>
            <button
                onClick={() => handleNavigate(AppView.DOCKET)}
                className="p-4 bg-white dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-amber-600 transition-colors shadow-sm opacity-0 group-hover:opacity-100"
            >
                <ChevronRight size={20} />
            </button>
          </div>
        ))}

        {/* Priority Tasks */}
        {pendingTasks.map(t => (
          <div key={`task-${t.id}`} className="bg-sky-50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/30 p-6 rounded-[32px] flex items-center justify-between group hover:shadow-lg transition-all">
            <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-white dark:bg-sky-900/50 rounded-2xl flex items-center justify-center text-sky-500 shadow-sm border border-sky-100 dark:border-sky-900/50">
                    <Clock size={24} />
                </div>
                <div>
                    <h4 className="text-[10px] font-black text-sky-600 dark:text-sky-400 uppercase tracking-widest mb-1">Priority Directive</h4>
                    <p className="font-serif font-black text-lg text-legal-900 dark:text-white italic">{t.title}</p>
                    <p className="text-xs text-sky-700 dark:text-sky-300 font-medium mt-1">Due {new Date(t.dueDate).toLocaleDateString()}.</p>
                </div>
            </div>
            <button
                onClick={() => handleNavigate(AppView.DOCKET)}
                className="p-4 bg-white dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-sky-600 transition-colors shadow-sm opacity-0 group-hover:opacity-100"
            >
                <ChevronRight size={20} />
            </button>
          </div>
        ))}

        {limitationCases.length === 0 && upcomingHearings.length === 0 && pendingTasks.length === 0 && (
          <div className="py-32 text-center">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-[32px] flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="text-slate-300 dark:text-slate-600" size={32} />
            </div>
            <p className="text-xl font-serif font-black text-slate-400 dark:text-slate-600 italic">Static Atmosphere Detected.</p>
            <p className="text-xs text-slate-400 dark:text-slate-600 mt-2 uppercase font-black tracking-widest">No critical alerts requiring intervention at this coordinate.</p>
          </div>
        )}
      </div>
    </div>
  );
};