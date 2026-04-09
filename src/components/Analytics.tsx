import React from 'react';
import { useLegalStore } from '../contexts/LegalStoreContext';

export const Analytics: React.FC = () => {
  const { getAnalytics } = useLegalStore();
  const analytics = getAnalytics();

  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col h-[calc(100vh-2rem)] animate-in fade-in duration-1000">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-black text-legal-gold uppercase tracking-[0.3em] mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-legal-gold animate-pulse"></div>
              Intelligence Insights
          </div>
          <h2 className="text-5xl font-serif font-black text-legal-900 italic tracking-tighter leading-tight">Firm Analytics</h2>
          <p className="text-slate-400 font-medium">Deep metrics on practice performance and matter saturation.</p>
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {[
            { label: 'Total Matters', value: analytics.totalCases, color: 'bg-slate-900' },
            { label: 'Active Matters', value: analytics.activeCases, color: 'bg-emerald-600' },
            { label: 'Total Clients', value: analytics.totalClients, color: 'bg-sky-600' },
            { label: 'Revenue Ingest', value: `₦${analytics.totalRevenue.toLocaleString()}`, color: 'bg-legal-gold' }
        ].map((stat, i) => (
            <div key={i} className="bg-white/70 backdrop-blur-xl rounded-[40px] shadow-2xl border border-white p-8 relative overflow-hidden group transition-all hover:scale-[1.02]">
                <div className={`absolute top-0 right-0 w-24 h-24 ${stat.color} opacity-5 rounded-full translate-x-12 -translate-y-12 blur-2xl group-hover:opacity-10 transition-opacity`}></div>
                <h3 className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 mb-2 relative z-10">{stat.label}</h3>
                <p className="text-4xl font-black text-legal-900 relative z-10 tracking-tighter">{stat.value}</p>
            </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 flex-1 overflow-hidden">
        <div className="bg-white/70 backdrop-blur-xl rounded-[48px] shadow-2xl border border-white p-10 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-8 border-b border-slate-50 pb-6">
              <h3 className="text-2xl font-serif font-black italic tracking-tighter text-legal-900">Matter Posture</h3>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Volume Metrics</span>
          </div>
          <div className="space-y-4 overflow-y-auto pr-2 scrollbar-hide">
            {Object.entries(analytics.caseStatusDistribution).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between p-6 bg-slate-50/50 rounded-[28px] border border-slate-100 hover:bg-white hover:shadow-xl transition-all group">
                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 group-hover:text-legal-900 transition-colors">{status}</span>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-legal-gold" style={{ width: `${(count / analytics.totalCases) * 100}%` }}></div>
                    </div>
                    <span className="text-2xl font-black text-legal-900">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-[48px] shadow-2xl border border-white p-10 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-8 border-b border-slate-50 pb-6">
              <h3 className="text-2xl font-serif font-black italic tracking-tighter text-legal-900">Revenue Tier: Clients</h3>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Monetary Ingest</span>
          </div>
          <div className="space-y-4 overflow-y-auto pr-2 scrollbar-hide">
            {analytics.topClients.map((client, index) => (
              <div key={client.clientId} className="flex items-center justify-between p-6 bg-slate-50/50 rounded-[28px] border border-slate-100 hover:bg-white hover:shadow-xl transition-all group">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-legal-900 text-legal-gold rounded-2xl flex items-center justify-center text-[11px] font-black italic shadow-2xl group-hover:scale-110 transition-transform">
                    0{index + 1}
                  </div>
                  <div>
                    <span className="text-lg font-serif font-black italic text-legal-900 tracking-tight">{client.clientName}</span>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">{client.caseCount} Active Matters</p>
                  </div>
                </div>
                <span className="text-xl font-black text-legal-900">₦{client.totalRevenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};