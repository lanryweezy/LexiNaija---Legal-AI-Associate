import React, { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, CheckCircle2, Circle, Clock, Plus, AlertCircle, Gavel, Sparkles, Filter, FileOutput, ChevronLeft, ChevronRight, LayoutList, Calendar, AlertTriangle, Trash2 } from 'lucide-react';
import jsPDF from 'jspdf';
import { useLegalStore } from '../contexts/LegalStoreContext';
import { generateDailyBrief } from '../services/geminiService';
import { Task, AppView } from '../types';
import ReactMarkdown from 'react-markdown';
import { getLimitationUrgency } from '../services/limitationCalculator';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

export const Docket: React.FC = () => {
  const { cases, tasks, addTask, updateTask, deleteTask, firmProfile, setView, setActiveCaseId } = useLegalStore();
  const [showModal, setShowModal] = useState(false);
  const [brief, setBrief] = useState<string | null>(null);
  const [generatingBrief, setGeneratingBrief] = useState(false);
  const [filter, setFilter] = useState<'All' | 'High' | 'Court' | 'Limitation'>('All');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [newTask, setNewTask] = useState<Partial<Task>>({
    priority: 'Medium',
    status: 'Pending',
    title: '',
    caseId: ''
  });

  // Combine Hearings, Tasks and Limitation Deadlines into one chronological list
  const allItems = useMemo(() => {
    const upcomingHearings = cases
      .filter(c => c.nextHearing && c.status !== 'Closed')
      .map(c => ({
        id: `hearing-${c.id}`,
        type: 'Hearing',
        title: `Court Appearance: ${c.title}`,
        date: new Date(c.nextHearing!),
        priority: 'High' as const,
        caseId: c.id,
        suitNumber: c.suitNumber,
        court: c.court,
        status: 'Pending'
      }));

    const limitationDeadlines = cases
      .filter(c => c.limitationDate)
      .map(c => {
        const date = new Date(c.limitationDate!);
        return {
          id: `limit-${c.id}`,
          type: 'Limitation',
          title: `STATUTE BAR: ${c.title}`,
          date: date,
          priority: 'High' as const,
          caseId: c.id,
          status: 'Pending',
          urgency: getLimitationUrgency(date)
        };
      });

    return [
      ...upcomingHearings,
      ...limitationDeadlines,
      ...tasks.map(t => ({ ...t, type: 'Task', date: new Date(t.dueDate) }))
    ].sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [cases, tasks]);

  const filteredItems = useMemo(() => {
    return allItems.filter(item => {
      if (filter === 'High') return item.priority === 'High';
      if (filter === 'Court') return item.type === 'Hearing';
      if (filter === 'Limitation') return item.type === 'Limitation';
      return true;
    });
  }, [allItems, filter]);

  // Calendar Logic
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentMonth]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.title && newTask.dueDate) {
      addTask({
        id: crypto.randomUUID(),
        title: newTask.title,
        dueDate: new Date(newTask.dueDate),
        priority: newTask.priority as any,
        status: 'Pending',
        caseId: newTask.caseId
      });
      setShowModal(false);
      setNewTask({ priority: 'Medium', status: 'Pending', title: '', caseId: '' });
    }
  };

  const toggleTaskStatus = (task: any) => {
    if (task.type === 'Hearing' || task.type === 'Limitation') return;
    const newStatus = task.status === 'Pending' ? 'Completed' : 'Pending';
    updateTask(task.id, { status: newStatus });
  };

  const handleGenerateBrief = async () => {
    setGeneratingBrief(true);
    const scheduleSummary = filteredItems.slice(0, 5).map(i => 
      `- ${i.date.toDateString()}: ${i.type} - ${i.title} (${i.priority})`
    ).join('\n');
    
    const result = await generateDailyBrief(scheduleSummary);
    setBrief(result);
    setGeneratingBrief(false);
  };

  const generateCauseListPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    doc.setFont("times", "bold");
    doc.setFontSize(20);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text("CAUSE LIST", pageWidth / 2, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.setFont("times", "normal");
    doc.text(`${firmProfile?.name || 'LexiNaija Chambers'}`, pageWidth / 2, 28, { align: "center" });
    doc.text(`Date of List: ${new Date().toLocaleDateString()}`, pageWidth / 2, 34, { align: "center" });
    
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.line(20, 40, pageWidth - 20, 40);

    let yOffset = 50;

    const hearings = filteredItems.filter(i => i.type === 'Hearing');

    if (hearings.length === 0) {
        doc.setFont("times", "italic");
        doc.text("No upcoming hearings scheduled.", pageWidth / 2, yOffset, { align: "center" });
    } else {
        hearings.forEach((hearing, index) => {
            if (yOffset > 270) {
                doc.addPage();
                yOffset = 20;
            }

            doc.setFont("times", "bold");
            doc.setFontSize(12);
            doc.text(`${index + 1}. ${(hearing as any).suitNumber || "SUIT NO: N/A"}`, 20, yOffset);
            
            doc.setFont("times", "normal");
            doc.setFontSize(11);
            doc.text(`Parties: ${hearing.title}`, 20, yOffset + 6);
            doc.text(`Court: ${(hearing as any).court || "N/A"}`, 20, yOffset + 12);
            
            doc.setFont("times", "italic");
            doc.text(`Date: ${hearing.date.toLocaleDateString()}`, 20, yOffset + 18);

            yOffset += 30; // Spacing between items
        });
    }

    doc.save(`CauseList_${new Date().getTime()}.pdf`);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-2rem)] flex flex-col animate-in fade-in duration-1000">
      <div className="flex justify-between items-start mb-6 shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-black text-legal-gold uppercase tracking-[0.3em] mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-legal-gold animate-pulse"></div>
              Litigation Intelligence
          </div>
          <h2 className="text-5xl font-serif font-black text-legal-900 dark:text-white italic tracking-tighter leading-tight">Court Diary</h2>
          <p className="text-slate-400 dark:text-slate-500 font-medium">Manage critical appearances and statutory deadlines with absolute precision.</p>
        </div>
        <div className="flex gap-3">
            <button 
                onClick={generateCauseListPDF}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-sm font-medium shadow-sm transition-all"
            >
                <FileOutput size={16} className="text-legal-900 dark:text-legal-gold" />
                Cause List PDF
            </button>
            <button 
                onClick={handleGenerateBrief}
                disabled={generatingBrief}
                className="bg-white dark:bg-slate-900 border border-legal-200 dark:border-legal-800 text-legal-900 dark:text-legal-gold px-4 py-2 rounded-lg hover:bg-legal-50 dark:hover:bg-slate-800 flex items-center gap-2 text-sm font-medium shadow-sm"
            >
                <Sparkles size={16} className={generatingBrief ? "animate-pulse text-legal-gold" : "text-legal-gold"} />
                {generatingBrief ? "Generating Brief..." : "Daily Brief"}
            </button>
            <button 
                onClick={() => setShowModal(true)}
                className="bg-legal-900 dark:bg-legal-gold text-white dark:text-legal-900 px-4 py-2 rounded-lg hover:bg-legal-gold hover:text-legal-900 dark:hover:bg-white flex items-center gap-2 text-sm font-medium shadow-xl transition-all"
            >
                <Plus size={16} /> New Task
            </button>
        </div>
      </div>

      {brief && (
        <div className="mb-6 bg-gradient-to-r from-legal-900 to-legal-800 rounded-xl p-6 text-white shadow-lg shrink-0 animate-in slide-in-from-top-4">
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-serif font-bold flex items-center gap-2"><Sparkles size={16} className="text-legal-gold"/> Executive Brief</h3>
                <button onClick={() => setBrief(null)} className="text-gray-400 hover:text-white text-xs">Dismiss</button>
            </div>
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown>{brief}</ReactMarkdown>
            </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6 shrink-0">
        <div className="flex gap-4">
            {['All', 'High', 'Court', 'Limitation'].map((f) => (
                <button
                    key={f}
                    onClick={() => setFilter(f as any)}
                    className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-legal-900 dark:bg-legal-gold text-white dark:text-legal-900 shadow-lg' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                    {f === 'All' ? 'Full Archive' : f === 'High' ? 'Priority Alpha' : f === 'Court' ? 'Court Appearances' : 'Limitation Risks'}
                </button>
            ))}
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
            <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-legal-900 dark:text-white shadow-sm' : 'text-slate-400'}`}
            >
                <LayoutList size={20} />
            </button>
            <button
                onClick={() => setViewMode('calendar')}
                className={`p-3 rounded-xl transition-all ${viewMode === 'calendar' ? 'bg-white dark:bg-slate-700 text-legal-900 dark:text-white shadow-sm' : 'text-slate-400'}`}
            >
                <Calendar size={20} />
            </button>
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-slate-900 rounded-[40px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col">
        {viewMode === 'calendar' ? (
            <div className="h-full flex flex-col">
                <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
                    <h3 className="text-2xl font-serif font-black italic text-legal-900 dark:text-white tracking-tighter">
                        {format(currentMonth, 'MMMM yyyy')}
                    </h3>
                    <div className="flex gap-2">
                        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-400 hover:text-legal-900 dark:hover:text-white transition-all shadow-sm">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={() => setCurrentMonth(new Date())} className="px-5 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-legal-900 dark:hover:text-white transition-all shadow-sm">
                            Today
                        </button>
                        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-400 hover:text-legal-900 dark:hover:text-white transition-all shadow-sm">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-auto grid grid-cols-7 border-b border-slate-100 dark:border-slate-800">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center border-r border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                            {day}
                        </div>
                    ))}

                    {calendarDays.map((day, idx) => {
                        const dayItems = allItems.filter(item => isSameDay(item.date, day));
                        const isSelectedMonth = isSameMonth(day, currentMonth);
                        const isToday = isSameDay(day, new Date());
                        
                        return (
                            <div key={idx} className={`min-h-[140px] p-3 border-r border-b border-slate-100 dark:border-slate-800 transition-all ${isSelectedMonth ? 'bg-white dark:bg-slate-900' : 'bg-slate-50/30 dark:bg-slate-950/20'}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-[11px] font-black w-7 h-7 flex items-center justify-center rounded-full transition-all ${isToday ? 'bg-legal-gold text-legal-900 shadow-lg' : isSelectedMonth ? 'text-slate-900 dark:text-white' : 'text-slate-300 dark:text-slate-700'}`}>
                                        {format(day, 'd')}
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    {dayItems.slice(0, 3).map(item => (
                                        <div key={item.id} className={`p-1.5 rounded-lg text-[9px] font-black uppercase tracking-tight truncate border shadow-sm ${
                                            item.type === 'Hearing' ? 'bg-legal-900 dark:bg-legal-gold text-white dark:text-legal-900 border-legal-900 dark:border-legal-gold' :
                                            item.type === 'Limitation' ? 'bg-rose-500 text-white border-rose-600' :
                                            'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-700'
                                        }`}>
                                            {item.type === 'Hearing' ? '⚖️ ' : item.type === 'Limitation' ? '🚨 ' : ''}
                                            {item.title}
                                        </div>
                                    ))}
                                    {dayItems.length > 3 && (
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest text-center mt-1">
                                            + {dayItems.length - 3} more
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        ) : (
            <div className="overflow-y-auto flex-1 scrollbar-hide">
                {filteredItems.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-700 py-32">
                        <CalendarIcon className="w-20 h-20 mb-6 opacity-10"/>
                        <p className="text-xl font-serif font-black italic tracking-tighter">Quiet Archive Detected.</p>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] mt-2">No critical appearances or deadlines on the active registry.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {filteredItems.map((item) => {
                            const isOverdue = new Date() > item.date && item.status !== 'Completed';
                            const isToday = isSameDay(item.date, new Date());

                            return (
                                <div key={item.id} className={`p-8 flex items-center gap-8 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group ${item.status === 'Completed' ? 'opacity-40 grayscale' : ''}`}>
                                    <div className="flex flex-col items-center gap-1 shrink-0 w-16">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{format(item.date, 'MMM')}</span>
                                        <span className={`text-3xl font-serif font-black italic ${isToday ? 'text-legal-gold' : 'text-legal-900 dark:text-white'}`}>{format(item.date, 'dd')}</span>
                                    </div>

                                    <button
                                        onClick={() => toggleTaskStatus(item)}
                                        disabled={item.type === 'Hearing' || item.type === 'Limitation'}
                                        className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${
                                            item.status === 'Completed' ? 'bg-emerald-500 border-emerald-500 text-white' :
                                            item.type === 'Hearing' ? 'bg-legal-900 text-white border-legal-900' :
                                            item.type === 'Limitation' ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/20' :
                                            'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-300 dark:text-slate-600 hover:border-legal-gold'
                                        }`}
                                    >
                                        {item.status === 'Completed' ? <CheckCircle2 size={24} /> :
                                         item.type === 'Hearing' ? <Gavel size={24} /> :
                                         item.type === 'Limitation' ? <AlertTriangle size={24} /> :
                                         <Circle size={24} />}
                                    </button>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest ${
                                                item.type === 'Hearing' ? 'bg-legal-900 text-white' :
                                                item.type === 'Limitation' ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' :
                                                'bg-slate-100 dark:bg-slate-800 text-slate-600'
                                            }`}>
                                                {item.type}
                                            </span>
                                            {item.priority === 'High' && (
                                                <div className="flex items-center gap-1.5 text-[9px] font-black text-rose-500 uppercase tracking-widest animate-pulse">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                                                    Priority Alpha
                                                </div>
                                            )}
                                        </div>
                                        <h3 className={`text-2xl font-serif font-black italic tracking-tight text-legal-900 dark:text-white ${item.status === 'Completed' ? 'line-through' : ''}`}>
                                            {item.title}
                                        </h3>
                                        {item.type === 'Hearing' && (
                                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-tight">{(item as any).court} • {(item as any).suitNumber}</p>
                                        )}
                                        {item.type === 'Limitation' && (item as any).urgency && (
                                            <p className="text-sm font-black text-rose-600 dark:text-rose-400 mt-1 uppercase tracking-widest">{(item as any).urgency.message}</p>
                                        )}
                                        {item.caseId && (
                                            <button
                                                onClick={() => { setActiveCaseId(item.caseId!); setView(AppView.CASES); }}
                                                className="text-[10px] font-black text-legal-gold uppercase tracking-widest mt-3 flex items-center gap-2 hover:translate-x-2 transition-transform"
                                            >
                                                Open Case File <ChevronRight size={12} />
                                            </button>
                                        )}
                                    </div>

                                    <div className="text-right shrink-0">
                                        <div className={`flex items-center justify-end gap-2 text-xs font-black uppercase tracking-widest ${isOverdue ? 'text-rose-600' : isToday ? 'text-emerald-500' : 'text-slate-400'}`}>
                                            <Clock size={14} />
                                            {isToday ? 'Operational: Today' : format(item.date, 'EEEE')}
                                        </div>
                                        <p className="text-2xl font-serif font-black italic text-legal-900 dark:text-white mt-1">{format(item.date, 'HH:mm')}</p>
                                    </div>

                                    {item.type === 'Task' && item.status !== 'Completed' && (
                                        <button onClick={() => deleteTask(item.id)} className="ml-8 p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-all">
                                            <Trash2 size={20} />
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-legal-900 dark:text-white">Add New Task</h3>
                    <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">×</button>
                </div>
                <form onSubmit={handleAddTask} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-400 mb-1">Task Description</label>
                        <input 
                            required
                            type="text" 
                            className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 rounded-lg focus:ring-2 focus:ring-legal-gold outline-none text-legal-900 dark:text-white"
                            placeholder="e.g. Call Registrar at High Court"
                            value={newTask.title}
                            onChange={e => setNewTask({...newTask, title: e.target.value})}
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-400 mb-1">Due Date</label>
                            <input 
                                required
                                type="datetime-local" 
                                className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 rounded-lg focus:ring-2 focus:ring-legal-gold outline-none text-sm text-legal-900 dark:text-white"
                                onChange={e => setNewTask({...newTask, dueDate: e.target.value as any})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-400 mb-1">Priority</label>
                            <select 
                                className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 rounded-lg focus:ring-2 focus:ring-legal-gold outline-none text-legal-900 dark:text-white"
                                value={newTask.priority}
                                onChange={e => setNewTask({...newTask, priority: e.target.value as any})}
                            >
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-400 mb-1">Link to Case (Optional)</label>
                        <select 
                            className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 rounded-lg focus:ring-2 focus:ring-legal-gold outline-none text-legal-900 dark:text-white"
                            value={newTask.caseId}
                            onChange={e => setNewTask({...newTask, caseId: e.target.value})}
                        >
                            <option value="">-- No Case Link --</option>
                            {cases.map(c => (
                                <option key={c.id} value={c.id}>{c.title}</option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className="w-full bg-legal-900 dark:bg-legal-gold text-white dark:text-legal-900 font-bold py-3 rounded-lg hover:opacity-90 transition-colors">
                        Add Task
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};
