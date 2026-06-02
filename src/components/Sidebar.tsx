import React, { useState, useMemo } from 'react';
import {
  Scale, BookOpen, PenTool, LayoutDashboard, ShieldCheck, Users, Briefcase,
  CreditCard, FileText, Calendar, ShieldAlert, Settings, Calculator, Library,
  List, BrainCircuit, Archive, UserCheck, Feather, Building2, BarChart3, Gavel,
  Truck, Share2, Music, Sun, Moon, Bell, Search, ChevronDown, ChevronRight
} from 'lucide-react';
import { AppView } from '../types';
import { useLegalStore } from '../contexts/LegalStoreContext';
import { useTheme } from '../contexts/ThemeContext';
import { Link, useLocation } from 'react-router-dom';
import { getCasesApproachingLimitation } from '../services/limitationCalculator';

interface SidebarProps {
  currentView: AppView;
}

interface NavItem {
  id: AppView;
  label: string;
  icon: any;
  badge?: number | string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView }) => {
  const { suggestions, activeCaseId, cases, creditsTotal, creditsUsed, firmProfile, tasks } = useLegalStore();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'Practice Management': true,
    'AI Tools': true,
    'Administration': true,
  });

  // Calculate Notification Badge Count
  // ⚡ Bolt: Memoize context-dependent array operations to avoid O(N) recalculations on unrelated state updates (e.g. typing in search)
  const { totalNotifications, limitationCount } = useMemo(() => {
    const limitationCount = getCasesApproachingLimitation(cases, 90).length;
    const urgentTasks = tasks.filter(t => t.status === 'Pending' && t.priority === 'High').length;
    return {
      limitationCount,
      totalNotifications: limitationCount + urgentTasks
    };
  }, [cases, tasks]);

  const sections: NavSection[] = [
    {
      title: 'Practice Management',
      items: [
        { id: AppView.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard, badge: suggestions.length > 0 ? suggestions.length : undefined },
        { id: AppView.NOTIFICATIONS, label: 'Notifications', icon: Bell, badge: totalNotifications > 0 ? totalNotifications : undefined },
        { id: AppView.ANALYTICS, label: 'Analytics', icon: BarChart3 },
        { id: AppView.DOCKET, label: 'Court Diary & Tasks', icon: Calendar },
        { id: AppView.CASES, label: 'Case Files', icon: Briefcase },
        { id: AppView.CLIENTS, label: 'Client Directory', icon: Users },
        { id: AppView.BILLING, label: 'Billing & Fees', icon: CreditCard },
        { id: AppView.PORTAL, label: 'Client Portal', icon: Share2 },
        { id: AppView.EVIDENCE, label: 'Evidence & Exhibits', icon: Archive },
        { id: AppView.BAILIFF, label: 'Bailiff Tracker', icon: Truck },
      ]
    },
    {
      title: 'AI Tools',
      items: [
        { id: AppView.STRATEGY, label: 'Strategy Advisor', icon: BrainCircuit },
        { id: AppView.BRIEFS, label: 'Smart Briefs', icon: Feather },
        { id: AppView.WITNESS, label: 'Witness Companion', icon: UserCheck },
        { id: AppView.CORPORATE, label: 'Corporate Assistant', icon: Building2 },
        { id: AppView.ENTERTAINMENT, label: 'Entertainment Law', icon: Music },
        { id: AppView.SUMMARIZER, label: 'Case Analyzer', icon: BookOpen },
        { id: AppView.RESEARCH, label: 'Legal Research', icon: Scale },
        { id: AppView.CASE_LAW, label: 'Case Law DB', icon: Gavel },
        { id: AppView.DRAFTER, label: 'Smart Drafter', icon: PenTool },
      ]
    },
    {
      title: 'Administration',
      items: [
        { id: AppView.EDITOR, label: 'Documents', icon: FileText },
        { id: AppView.PRECEDENTS, label: 'Precedents Library', icon: Library },
        { id: AppView.PRACTICE_GUIDE, label: 'Practice Guides', icon: List },
        { id: AppView.CALCULATORS, label: 'Legal Calculators', icon: Calculator },
        { id: AppView.CONFLICT_CHECK, label: 'Conflict Check', icon: ShieldAlert },
        { id: AppView.AUDIT, label: 'Audit Trail', icon: ShieldCheck },
        { id: AppView.SETTINGS, label: 'Firm Settings', icon: Settings },
      ]
    }
  ];

  const filteredSections = useMemo(() => {
    if (!searchQuery) return sections;

    // ⚡ Bolt: Cache lowercased search query to avoid redundant O(N*M) string reallocations inside filter loop
    const queryLower = searchQuery.toLowerCase();

    return sections.map(section => ({
      ...section,
      items: section.items.filter(item =>
        item.label.toLowerCase().includes(queryLower)
      )
    })).filter(section => section.items.length > 0);
  }, [searchQuery]);

  const toggleSection = (title: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const isViewActive = (viewId: AppView) => {
    return location.pathname === `/${viewId.toLowerCase()}`;
  };

  return (
    <div className="w-64 bg-legal-900 text-white h-screen flex flex-col fixed left-0 top-0 z-10 shadow-xl border-r border-legal-800">
      <div className="p-6 border-b border-legal-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-legal-gold rounded-sm flex items-center justify-center">
            <ShieldCheck className="text-legal-900 w-5 h-5" />
            </div>
            <div className="flex flex-col">
                <h1 className="text-lg font-serif font-bold tracking-wide text-gray-100 leading-none">LexiNaija</h1>
                <span className="text-[10px] text-gray-400 mt-1">Associate Suite</span>
            </div>
        </div>
        <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title="Toggle theme"
            className="p-2 hover:bg-legal-800 rounded-lg transition-colors text-legal-gold focus-visible:ring-2 focus-visible:ring-legal-gold focus:outline-none"
        >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>

      <div className="px-4 pt-4 pb-2">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 group-focus-within:text-legal-gold transition-colors" />
          <input
            type="text"
            placeholder="Search features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-legal-800/50 border border-legal-700 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-legal-gold/50 focus:border-legal-gold transition-all"
          />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-hide py-2">
        {filteredSections.map((section) => (
          <div key={section.title} className="mb-4">
            <button
              onClick={() => toggleSection(section.title)}
              className="w-full px-6 py-2 flex items-center justify-between text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-gray-300 transition-colors"
            >
              <span>{section.title}</span>
              {expandedSections[section.title] || searchQuery ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>

            {(expandedSections[section.title] || searchQuery) && (
              <ul className="mt-1 space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = isViewActive(item.id);
                  return (
                    <li key={item.id}>
                      <Link
                        to={`/${item.id.toLowerCase()}`}
                        className={`group flex items-center gap-3 px-6 py-2.5 transition-all duration-200 border-l-4 ${
                          isActive
                            ? 'bg-legal-800 border-legal-gold text-white shadow-inner'
                            : 'border-transparent text-gray-400 hover:bg-legal-800/50 hover:text-gray-200'
                        }`}
                      >
                        <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-legal-gold' : 'group-hover:text-gray-300'}`} />
                        <span className={`text-sm flex-1 ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
                        {item.badge && (
                          <span className={`${item.id === AppView.NOTIFICATIONS ? 'bg-rose-600' : 'bg-legal-gold'} text-legal-900 text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm`}>
                              {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-legal-700 space-y-4">
        {activeCaseId && (
            <div className="bg-legal-gold/10 rounded-2xl p-3 border border-legal-gold/20 animate-in slide-in-from-bottom-2 duration-500">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-legal-gold"></div>
                    <span className="text-[8px] font-black text-legal-gold uppercase tracking-[0.2em]">Active Focus</span>
                </div>
                <p className="text-[11px] font-black text-white truncate italic">
                    {cases.find(c => c.id === activeCaseId)?.title || 'Matter Syncing...'}
                </p>
            </div>
        )}
        <div className="bg-legal-800 rounded-xl p-4 border border-legal-700 shadow-lg">
          <div className="flex justify-between items-center mb-1">
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Neural Capacity</p>
            <p className="text-xs text-legal-gold font-black italic">
              {firmProfile.isEnterprise ? 'ENTERPRISE' : 'SOLO'}
            </p>
          </div>

          <div className="w-full bg-legal-700 h-2 rounded-full overflow-hidden mt-2">
            <div
              className="bg-gradient-to-r from-legal-gold to-amber-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(212,175,55,0.4)]"
              style={{ width: `${Math.min(100, (creditsUsed / creditsTotal) * 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-[9px] font-black text-gray-500 uppercase">{creditsUsed} / {creditsTotal}</span>
            <span className="text-[9px] font-black text-legal-gold uppercase">{Math.round((creditsUsed/creditsTotal)*100)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
