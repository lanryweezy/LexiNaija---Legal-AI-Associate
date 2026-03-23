import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, 
  Zap, 
  Scale, 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight,
  MessageSquare,
  PenTool,
  Calendar,
  Share2,
  Archive,
  Play
} from 'lucide-react';

import { AppView } from '../types';

interface LandingPageProps {
  onGetStarted: () => void;
  onNavigate: (view: AppView) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-[#fafafa] text-slate-900 font-sans selection:bg-legal-gold/30 overflow-x-hidden relative">
      {/* Background Mesh Gradient */}
      <div className="fixed inset-0 pointer-events-none -z-20 opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[radial-gradient(circle_at_center,rgba(196,155,75,0.15),transparent_70%)] blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle_at_center,rgba(26,35,46,0.1),transparent_70%)] blur-[120px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,#fff,transparent_80%)] opacity-50"></div>
      </div>
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-[100] bg-white shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-legal-900 rounded-xl flex items-center justify-center shadow-lg">
              <ShieldCheck className="text-legal-gold w-6 h-6" />
            </div>
            <span className="text-2xl font-serif font-black italic tracking-tighter uppercase text-legal-900">LexiNaija</span>
          </div>
          <div className="hidden md:flex items-center gap-10 bg-white/50 backdrop-blur-md px-8 py-3 rounded-full border border-white/20 shadow-sm">
            <a href="#features" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-legal-900 transition-colors">Intelligence</a>
            <a href="#suite" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-legal-900 transition-colors">The Vault</a>
            <a href="#pricing" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-legal-900 transition-colors">Tiers</a>
          </div>
          <div>
            <button 
              onClick={onGetStarted}
              className="px-8 py-4 bg-legal-900 text-white rounded-full text-[10px] font-black uppercase tracking-[.2em] shadow-[0_10px_40px_-10px_rgba(26,35,46,0.5)] hover:bg-legal-gold hover:text-legal-900 transition-all active:scale-95 flex items-center gap-2 group"
            >
              Login <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="relative z-10">
              
              <h1 className="text-6xl md:text-7xl lg:text-[90px] font-serif font-black text-legal-900 leading-[0.9] tracking-tighter mb-8 animate-in slide-in-from-bottom delay-100">
                The AI associate<br />
                <span className="text-legal-gold italic">For Your Chambers.</span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-lg mb-10 animate-in slide-in-from-bottom delay-200">
                LexiNaija is the hyper-intelligent associate suite designed specifically for the Nigerian legal landscape. Automate research, draft high-fidelity briefs, and manage your practice with institutional precision.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-6 animate-in slide-in-from-bottom delay-300">
                <button 
                  onClick={onGetStarted}
                  className="w-full sm:w-auto px-10 py-5 bg-legal-900 text-white rounded-full font-black uppercase tracking-[.2em] text-[11px] shadow-2xl hover:bg-legal-gold hover:text-legal-900 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-4"
                >
                  Get Started
                </button>
                <button className="w-full sm:w-auto px-10 py-5 bg-white text-legal-900 border border-slate-200 rounded-full font-black uppercase tracking-[.2em] text-[11px] hover:border-legal-900 transition-all flex items-center justify-center gap-3 group">
                  <Play size={14} className="group-hover:text-legal-gold transition-colors" /> Watch Demo
                </button>
              </div>
            </div>

            {/* Right Images */}
            <div className="relative z-10 animate-in fade-in zoom-in duration-1000 delay-300">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-legal-gold/20 rounded-full blur-[100px] -z-10"></div>
              
              <div className="relative rounded-[40px] overflow-hidden shadow-2xl border-8 border-white group">
                <img 
                  src="file:///C:/Users/USER/.gemini/antigravity/brain/ded6e2a8-4e02-4241-b662-cc14fb24817f/lexinaija_hero_visual_1773488549630.png" 
                  alt="LexiNaija Sovereign Justice Visual" 
                  className="w-full object-cover aspect-[4/5] group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-legal-900/80 via-transparent to-transparent"></div>
                
                {/* Floating Glass Widget */}
                <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-legal-gold flex items-center justify-center shrink-0">
                      <Zap size={16} className="text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] text-legal-gold font-black uppercase tracking-widest mb-1">AI Action Running</p>
                      <p className="text-white font-bold text-sm">Drafting Statement of Claim...</p>
                    </div>
                  </div>
                  <div className="w-full bg-black/20 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-legal-gold w-2/3 h-full rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
              
              {/* Secondary Floating Image */}
              <div className="absolute -bottom-10 -left-10 w-64 rounded-3xl overflow-hidden shadow-2xl border-4 border-white hidden md:block animate-bounce-slow bg-white">
                <img 
                   src="file:///C:/Users/USER/.gemini/antigravity/brain/ded6e2a8-4e02-4241-b662-cc14fb24817f/digital_lawyer_dashboard_mockup_1773488564501.png" 
                   alt="LexiNaija Dashboard Workflow" 
                   className="w-full object-cover aspect-video"
                />
                <div className="p-4 bg-white border-t border-slate-100">
                   <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Insight Captured</p>
                   <p className="text-sm font-bold text-legal-900">Clause 4(a) contradicts the initial plea.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 border-y border-slate-200 bg-white overflow-hidden relative">
        <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-white to-transparent z-10"></div>
        <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-white to-transparent z-10"></div>
        <div className="flex gap-20 items-center whitespace-nowrap animate-marquee">
          {["Approved by Senior Advocates", "Verified NBA Practice Standard", "Section 84 Evidence Act Compliant", "SCUML Reporting Integrated", "CAMA 2020 Tuned", "Streaming-First Architecture"].map((text, i) => (
            <div key={i} className="flex items-center gap-4 opacity-30 hover:opacity-100 transition-opacity">
               <ShieldCheck size={20} className="text-legal-900 fill-legal-gold/20" />
               <span className="text-xs font-black uppercase tracking-[0.4em] text-legal-900">{text}</span>
            </div>
          ))}
          {/* Repeat for seamless marquee */}
          {["Approved by Senior Advocates", "Verified NBA Practice Standard", "Section 84 Evidence Act Compliant", "SCUML Reporting Integrated", "CAMA 2020 Tuned", "Streaming-First Architecture"].map((text, i) => (
            <div key={i + 10} className="flex items-center gap-4 opacity-30 hover:opacity-100 transition-opacity">
               <ShieldCheck size={20} className="text-legal-900 fill-legal-gold/20" />
               <span className="text-xs font-black uppercase tracking-[0.4em] text-legal-900">{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-[10px] font-black text-legal-gold uppercase tracking-widest px-4 py-1 border border-legal-gold/30 rounded-full bg-legal-gold/5 mb-6 inline-block">AI Legal Associate</span>
            <h2 className="text-4xl md:text-5xl font-serif font-black text-legal-900 italic tracking-tighter leading-tight">Built for your Chambers.</h2>
            <p className="text-slate-500 mt-4 font-medium">Simple tools to manage every part of your legal practice.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1: Legal Research */}
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
              <div className="w-12 h-12 bg-legal-gold/10 text-legal-gold rounded-2xl flex items-center justify-center mb-6">
                <Scale size={20} />
              </div>
              <h3 className="text-xl font-serif font-black text-legal-900 mb-3 italic">Legal Research</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">Access deep insights on the Evidence Act, CAMA 2020, and Supreme Court rulings instantly.</p>
            </div>

            {/* Feature 2: Smart Drafter */}
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
              <div className="w-12 h-12 bg-legal-gold/10 text-legal-gold rounded-2xl flex items-center justify-center mb-6">
                <PenTool size={20} />
              </div>
              <h3 className="text-xl font-serif font-black text-legal-900 mb-3 italic">Smart Drafter</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">Generate high-fidelity contracts, tenancy agreements, and court processes in seconds.</p>
            </div>

            {/* Feature 3: Brief Generator */}
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
              <div className="w-12 h-12 bg-legal-gold/10 text-legal-gold rounded-2xl flex items-center justify-center mb-6">
                <FileText size={20} />
              </div>
              <h3 className="text-xl font-serif font-black text-legal-900 mb-3 italic">Brief Generator</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">Transform complex facts into structured IRAC-style briefs for superior court appearances.</p>
            </div>

            {/* Feature 4: Conflict Check */}
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
              <div className="w-12 h-12 bg-legal-gold/10 text-legal-gold rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-xl font-serif font-black text-legal-900 mb-3 italic">Conflict Check</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">Automated institutional scanning to identify potential conflicts of interest across your entire vault.</p>
            </div>

            {/* Minor Features Grid */}
            <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { title: "DOCKET SYNC", icon: <Share2 size={16} /> },
                { title: "Court Diary", icon: <Calendar size={16} /> },
                { title: "COLLABORATION", icon: <MessageSquare size={16} /> },
                { title: "Client Portal", icon: <Archive size={16} /> },
                { title: "VAULT STORAGE", icon: <Zap size={16} /> },
                { title: "Evidence Locker", icon: <CheckCircle2 size={16} /> }
              ].map((f, i) => (
                <div key={i} className="bg-slate-100 p-6 rounded-3xl border border-slate-200 flex flex-col items-center text-center gap-3 group hover:bg-white hover:border-legal-gold/30 hover:shadow-md transition-all">
                  <div className="text-legal-900 group-hover:text-legal-gold transition-colors">{f.icon}</div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">{f.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-[10px] font-black text-legal-gold uppercase tracking-[.3em] mb-6 inline-block">AI Legal Associate</span>
            <h2 className="text-4xl md:text-5xl font-serif font-black text-legal-900 italic tracking-tighter leading-tight">Choose a plan that fits your chambers.</h2>
            <p className="text-slate-500 mt-6 font-medium">Choose the tier that matches your firm's ambition.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Solo Tier */}
            <div className="bg-slate-50 rounded-[40px] p-10 border border-slate-100 flex flex-col group hover:bg-white hover:shadow-2xl transition-all duration-500">
               <div className="mb-8">
                  <h3 className="text-xl font-serif font-black text-legal-900 mb-2">Solo Practice</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">For New Wigs & Solos</p>
               </div>
               <div className="mb-8">
                  <span className="text-5xl font-serif font-black text-legal-900">₦5,000</span>
                  <span className="text-slate-400 font-bold ml-2">/mo</span>
               </div>
               <ul className="space-y-4 mb-10 flex-1">
                  <li className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                    <CheckCircle2 className="text-legal-900 w-4 h-4" /> 5 AI Drafts Per Month
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                    <CheckCircle2 className="text-legal-900 w-4 h-4" /> Basic Case Management
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                    <CheckCircle2 className="text-legal-900 w-4 h-4" /> Cause List Generation
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-600 font-medium opacity-40">
                    <CheckCircle2 className="text-slate-300 w-4 h-4" /> Deep Research Suite
                  </li>
               </ul>
               <button 
                  onClick={onGetStarted}
                  className="w-full py-4 bg-white border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-widest hover:border-legal-900 transition-all font-bold"
               >
                 Start Trial
               </button>
            </div>

            {/* Pro Tier */}
            <div className="bg-legal-900 rounded-[40px] p-10 flex flex-col relative overflow-hidden shadow-2xl scale-105 z-10">
               <div className="absolute top-0 right-0 px-6 py-2 bg-legal-gold text-legal-900 font-black text-[9px] uppercase tracking-widest rounded-bl-2xl">Most Popular</div>
               <div className="mb-8">
                  <h3 className="text-xl font-serif font-black text-white mb-2">Professional</h3>
                  <p className="text-xs text-white/50 font-bold uppercase tracking-widest">For Growing Firms</p>
               </div>
               <div className="mb-8">
                  <span className="text-5xl font-serif font-black text-white">₦15,000</span>
                  <span className="text-white/50 font-bold ml-2">/mo</span>
               </div>
               <ul className="space-y-4 mb-10 flex-1">
                  <li className="flex items-center gap-3 text-sm text-white/80 font-medium">
                    <CheckCircle2 className="text-legal-gold w-4 h-4" /> Unlimited AI Drafting
                  </li>
                  <li className="flex items-center gap-3 text-sm text-white/80 font-medium">
                    <CheckCircle2 className="text-legal-gold w-4 h-4" /> Deep Research Suite
                  </li>
                  <li className="flex items-center gap-3 text-sm text-white/80 font-medium">
                    <CheckCircle2 className="text-legal-gold w-4 h-4" /> Bailiff & Process Tracker
                  </li>
                  <li className="flex items-center gap-3 text-sm text-white/80 font-medium">
                    <CheckCircle2 className="text-legal-gold w-4 h-4" /> Corporate Filing Automation
                  </li>
               </ul>
               <button 
                  onClick={onGetStarted}
                  className="w-full py-4 bg-legal-gold text-legal-900 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl font-bold"
               >
                 Go Professional
               </button>
            </div>

            {/* Enterprise Tier */}
            <div className="bg-slate-50 rounded-[40px] p-10 border border-slate-100 flex flex-col group hover:bg-white hover:shadow-2xl transition-all duration-500">
               <div className="mb-8">
                  <h3 className="text-xl font-serif font-black text-legal-900 mb-2">Chambers AI</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">For SAN Chambers</p>
               </div>
               <div className="mb-8">
                  <span className="text-5xl font-serif font-black text-legal-900">₦100k+</span>
               </div>
               <ul className="space-y-4 mb-10 flex-1">
                  <li className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                    <CheckCircle2 className="text-legal-900 w-4 h-4" /> Multi-user Sync
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                    <CheckCircle2 className="text-legal-900 w-4 h-4" /> Custom Precedent Library
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                    <CheckCircle2 className="text-legal-900 w-4 h-4" /> Immutable Compliance Audit
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                    <CheckCircle2 className="text-legal-900 w-4 h-4" /> High-Concurrency Architecture
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                    <CheckCircle2 className="text-legal-900 w-4 h-4" /> Dedicated Account Liaison
                  </li>
               </ul>
               <button 
                  onClick={onGetStarted}
                  className="w-full py-4 bg-white border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-widest hover:border-legal-900 transition-all font-bold"
               >
                 Consult Sales
               </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=2000" alt="Office Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-legal-900/95 backdrop-blur-sm"></div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10 text-center text-white">
          <ShieldCheck className="w-20 h-20 text-legal-gold mx-auto mb-8" />
          <h2 className="text-5xl md:text-7xl font-serif font-black italic leading-tight mb-8">
            The Future of Nigerian Law is <span className="text-legal-gold not-italic">Agentic.</span>
          </h2>
          <p className="text-xl text-slate-300 font-medium mb-12 leading-relaxed max-w-2xl mx-auto">
            Stop acting as your own secretary. Provision your AI Associate today and reclaim your billable hours.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={onGetStarted}
              className="w-full sm:w-auto px-12 py-6 bg-legal-gold text-legal-900 rounded-full font-black uppercase tracking-[.2em] shadow-2xl shadow-legal-gold/20 hover:bg-white hover:-translate-y-1 transition-all active:scale-95"
            >
              Register now
            </button>
            <button 
              className="w-full sm:w-auto px-12 py-6 bg-white/10 text-white border border-white/20 rounded-full font-black uppercase tracking-[.2em] hover:bg-white/20 transition-all font-medium"
            >
              Consult Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-legal-950 py-16 px-6 relative z-10 border-t border-legal-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-legal-900 rounded-xl flex items-center justify-center border border-white/10">
              <ShieldCheck className="text-legal-gold w-6 h-6" />
            </div>
            <span className="text-xl font-serif font-black italic tracking-tighter uppercase text-white">LexiNaija</span>
          </div>
          <div className="flex items-center gap-12 text-white/70">
            <button
              onClick={() => onNavigate(AppView.PRIVACY)}
              className="text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
            >
              Privacy Protocol
            </button>
            <button
              onClick={() => onNavigate(AppView.TERMS)}
              className="text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
            >
              Firm Licensing
            </button>
            <a href="mailto:security@lexinaija.com" className="text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">Security Ops</a>
          </div>
          <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">© 2026 LexiNaija AI. All Rights Reserved.</p>
        </div>
      </footer>

      {/* Tailwind specific custom animations mapped in global css or class based */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: 200%;
          animation: marquee 30s linear infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
