import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
    Search, Command, Briefcase, FileText, Zap, 
    Settings, Users, Calculator, Trash2, Plus, ArrowRight,
    Scale, Feather, UserCheck, Building2, Gavel
} from 'lucide-react';
import { AppView } from '../types';
import { useLegalStore } from '../contexts/LegalStoreContext';
import { useNavigate } from 'react-router-dom';

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const { cases, clients, setActiveCaseId, setView, setActiveDoc } = useLegalStore();
    const navigate = useNavigate();

    const commands = useMemo(() => [
        { id: AppView.DASHBOARD, label: 'Go to Dashboard', icon: Briefcase, category: 'Navigation' },
        { id: AppView.CASES, label: 'View Case Files', icon: Briefcase, category: 'Navigation' },
        { id: AppView.CLIENTS, label: 'Client Directory', icon: Users, category: 'Navigation' },
        { id: AppView.BRIEFS, label: 'Draft New Brief', icon: Feather, category: 'Tools' },
        { id: AppView.DRAFTER, label: 'Draft Instrument', icon: PenTool, category: 'Tools' },
        { id: AppView.RESEARCH, label: 'Legal Research', icon: Scale, category: 'Tools' },
        { id: AppView.SETTINGS, label: 'Firm Settings', icon: Settings, category: 'System' },
    ], []);

    // Deep Search within documents and notes
    const documentResults = useMemo(() => {
        if (query.length <= 2) return [];
        // ⚡ Bolt: Cache lowercased query outside of nested map/filter loops to prevent O(N*M) string reallocations
        const queryLower = query.toLowerCase();
        const results: any[] = [];

        // ⚡ Bolt: Use a single pass instead of flatMap + filter + map to avoid multiple O(N) arrays allocation
        cases.forEach(c => {
            c.documents.forEach(d => {
                if (d.title.toLowerCase().includes(queryLower) || d.content.toLowerCase().includes(queryLower)) {
                    results.push({
                        id: AppView.EDITOR,
                        label: `Doc: ${d.title}`,
                        icon: FileText,
                        category: `Matter: ${c.title}`,
                        caseId: c.id,
                        docId: d.id
                    });
                }
            });
        });
        return results;
    }, [query, cases]);

    const caseNoteResults = useMemo(() => {
        if (query.length <= 2) return [];
        const queryLower = query.toLowerCase();
        return cases.filter(c =>
            c.notes.toLowerCase().includes(queryLower)
        ).map(c => ({
            id: AppView.CASES,
            label: `Note in: ${c.title}`,
            icon: Briefcase,
            category: 'Matter Note',
            caseId: c.id
        }));
    }, [query, cases]);

    // Filtered items based on query
    const filteredCommands = useMemo(() => {
        // ⚡ Bolt: Cache lowercased query to avoid redundant computation for every command, case, and client
        const queryLower = query.toLowerCase();
        return [
            ...commands.filter(c =>
                c.label.toLowerCase().includes(queryLower) ||
                c.category.toLowerCase().includes(queryLower)
            ),
            ...(query.length > 2 ? cases.filter(c => c.title.toLowerCase().includes(queryLower) || (c.suitNumber && c.suitNumber.toLowerCase().includes(queryLower))).map(c => ({
                id: AppView.CASES,
                label: `Case: ${c.title}`,
                icon: Briefcase,
                category: 'Matter',
                caseId: c.id
            })) : []),
            ...(query.length > 2 ? clients.filter(c => c.name.toLowerCase().includes(queryLower)).map(c => ({
                id: AppView.CLIENTS,
                label: `Client: ${c.name}`,
                icon: Users,
                category: 'Directory'
            })) : []),
            ...documentResults,
            ...caseNoteResults
        ];
    }, [query, commands, cases, clients, documentResults, caseNoteResults]);

    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 10);
        }
    }, [isOpen]);

    const handleAction = (cmd: any) => {
        if (cmd.caseId) {
            setActiveCaseId(cmd.caseId);
        }
        if (cmd.docId) {
            setActiveDoc({ caseId: cmd.caseId, docId: cmd.docId });
        }
        setView(cmd.id as AppView);
        navigate(`/${cmd.id.toLowerCase()}`);
        onClose();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
        } else if (e.key === 'ArrowUp') {
            setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
        } else if (e.key === 'Enter') {
            const selected = filteredCommands[selectedIndex];
            if (selected) {
                handleAction(selected);
            }
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 animate-in fade-in duration-200">
            <div className="fixed inset-0 bg-legal-900/60 backdrop-blur-sm" onClick={onClose}></div>
            
            <div className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-[0_60px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden border border-slate-100 ring-1 ring-black/5 animate-in slide-in-from-top-4 duration-300">
                <div className="flex items-center px-8 border-b border-slate-100 bg-slate-50/50">
                    <Search className="text-slate-400 mr-4" size={24} />
                    <input 
                        ref={inputRef}
                        type="text"
                        placeholder="Deep search cases, docs, or notes..."
                        className="w-full py-8 text-xl font-serif italic text-legal-900 bg-transparent outline-none placeholder:text-slate-300"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl shadow-sm ml-4">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">ESC</span>
                    </div>
                </div>

                <div className="max-h-[450px] overflow-y-auto p-4 space-y-2 scrollbar-hide">
                    {filteredCommands.length > 0 ? (
                        filteredCommands.map((cmd, idx) => {
                            const Icon = cmd.icon;
                            return (
                                <button 
                                    key={`${cmd.label}-${idx}`}
                                    onClick={() => handleAction(cmd)}
                                    onMouseEnter={() => setSelectedIndex(idx)}
                                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                                        idx === selectedIndex ? 'bg-legal-900 text-white shadow-xl translate-x-1' : 'text-slate-500 hover:bg-slate-50'
                                    }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                            idx === selectedIndex ? 'bg-legal-gold text-legal-900' : 'bg-slate-100 text-slate-400'
                                        }`}>
                                            <Icon size={20} />
                                        </div>
                                        <div className="text-left">
                                            <p className={`font-black uppercase tracking-widest text-[11px] ${idx === selectedIndex ? 'text-white' : 'text-legal-900'}`}>{cmd.label}</p>
                                            <p className={`text-[9px] uppercase tracking-widest font-medium mt-0.5 opacity-60`}>{cmd.category}</p>
                                        </div>
                                    </div>
                                    {idx === selectedIndex && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black uppercase tracking-widest opacity-60 mr-2">Execute</span>
                                            <Plus size={16} className="text-legal-gold" />
                                        </div>
                                    )}
                                </button>
                            );
                        })
                    ) : (
                        <div className="py-20 text-center">
                            <Zap size={48} className="mx-auto text-slate-100 mb-6" />
                            <p className="font-serif italic text-slate-400 text-xl">No results matching protocol.</p>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center px-8">
                    <div className="flex gap-6">
                        <div className="flex items-center gap-2">
                            <div className="p-1 bg-white border border-slate-200 rounded text-[9px] font-black text-slate-400">↑↓</div>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Navigate</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="p-1 bg-white border border-slate-200 rounded text-[9px] font-black text-slate-400">ENTER</div>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Select</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                         <Command size={14} className="text-slate-300" />
                         <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest tracking-tighter italic">LexiNaija Professional Interface v2.0</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PenTool = FileText; // Fallback
