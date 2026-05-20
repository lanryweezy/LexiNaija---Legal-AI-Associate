import React from 'react';
import { useLegalStore } from '../contexts/LegalStoreContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area
} from 'recharts';

export const Analytics: React.FC = () => {
  const { getAnalytics } = useLegalStore();
  const analytics = getAnalytics();

  const statusData = Object.entries(analytics.caseStatusDistribution).map(([name, value]) => ({ name, value }));
  const COLORS = ['#0f172a', '#eab308', '#64748b', '#94a3b8'];

  const outcomeData = Object.entries(analytics.outcomeDistribution).map(([name, value]) => ({ name, value }));
  const OUTCOME_COLORS = ['#10b981', '#ef4444', '#f59e0b', '#6366f1', '#94a3b8'];

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-black text-legal-gold uppercase tracking-[0.3em] mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-legal-gold animate-pulse"></div>
              Firm Performance
          </div>
          <h2 className="text-5xl font-serif font-black text-legal-900 dark:text-white italic tracking-tighter leading-tight">Analytics</h2>
          <p className="text-slate-400 dark:text-slate-500 font-medium">Insights and metrics on firm performance and matter status.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800 p-8 hover:shadow-xl hover:border-legal-gold/50 transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 dark:bg-white/5 opacity-0 group-hover:opacity-100 rounded-full translate-x-12 -translate-y-12 blur-xl transition-opacity"></div>
          <h3 className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-2 relative z-10">Total Matters</h3>
          <p className="text-4xl font-black text-legal-900 dark:text-white relative z-10">{analytics.totalCases}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800 p-8 hover:shadow-xl hover:border-legal-gold/50 transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 dark:bg-emerald-500/10 opacity-0 group-hover:opacity-100 rounded-full translate-x-12 -translate-y-12 blur-xl transition-opacity"></div>
          <h3 className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-2 relative z-10">Active Matters</h3>
          <p className="text-4xl font-black text-legal-900 dark:text-white relative z-10">{analytics.activeCases}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800 p-8 hover:shadow-xl hover:border-legal-gold/50 transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 dark:bg-white/5 opacity-0 group-hover:opacity-100 rounded-full translate-x-12 -translate-y-12 blur-xl transition-opacity"></div>
          <h3 className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-2 relative z-10">Total Clients</h3>
          <p className="text-4xl font-black text-legal-900 dark:text-white relative z-10">{analytics.totalClients}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800 p-8 hover:shadow-xl hover:border-legal-gold/50 transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-legal-gold/10 opacity-0 group-hover:opacity-100 rounded-full translate-x-12 -translate-y-12 blur-xl transition-opacity"></div>
          <h3 className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-2 relative z-10">Total Revenue</h3>
          <p className="text-4xl font-black text-legal-900 dark:text-white relative z-10">₦{analytics.totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-800 p-10">
          <h3 className="text-2xl font-serif font-black italic tracking-tight text-legal-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">Revenue Trend</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.monthlyRevenue}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#eab308" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} tickFormatter={(val) => `₦${val/1000}k`} />
                <Tooltip
                  contentStyle={{borderRadius: '16px', border: 'none', backgroundColor: '#0f172a', color: '#fff', boxShadow: '0 20px 50px rgba(0,0,0,0.3)'}}
                  itemStyle={{color: '#fff'}}
                  formatter={(value: number) => [`₦${value.toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#eab308" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-800 p-10">
          <h3 className="text-2xl font-serif font-black italic tracking-tight text-legal-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">Matter Status Distribution</h3>
          <div className="h-80 w-full flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                   contentStyle={{borderRadius: '16px', border: 'none', backgroundColor: '#0f172a', color: '#fff', boxShadow: '0 20px 50px rgba(0,0,0,0.3)'}}
                   itemStyle={{color: '#fff'}}
                />
                <Legend layout="vertical" align="right" verticalAlign="middle" iconType="circle" wrapperStyle={{fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-800 p-10">
          <h3 className="text-2xl font-serif font-black italic tracking-tight text-legal-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">Case Outcomes</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={outcomeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                <Tooltip
                  contentStyle={{borderRadius: '16px', border: 'none', backgroundColor: '#0f172a', color: '#fff', boxShadow: '0 20px 50px rgba(0,0,0,0.3)'}}
                  itemStyle={{color: '#fff'}}
                />
                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                  {outcomeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={OUTCOME_COLORS[index % OUTCOME_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-800 p-10">
          <h3 className="text-2xl font-serif font-black italic tracking-tight text-legal-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">Primary Clients by Revenue</h3>
          <div className="space-y-4">
            {analytics.topClients.map((client, index) => (
              <div key={client.clientId} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 bg-legal-900 dark:bg-legal-gold text-legal-gold dark:text-legal-900 rounded-full flex items-center justify-center text-[10px] font-black tracking-widest shadow-inner">
                    {index + 1}
                  </span>
                  <span className="text-sm font-bold text-legal-900 dark:text-white">{client.clientName}</span>
                </div>
                <span className="text-lg font-black text-legal-900 dark:text-white">₦{client.totalRevenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};