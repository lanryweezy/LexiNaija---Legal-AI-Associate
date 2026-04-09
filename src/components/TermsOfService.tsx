import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';

interface TermsOfServiceProps {
  onBack: () => void;
}

export const TermsOfService: React.FC<TermsOfServiceProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-slate-100 py-4 px-6 sticky top-0 bg-white/80 backdrop-blur-md z-10 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-legal-900 transition-colors text-sm font-bold uppercase tracking-widest"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <div className="flex items-center gap-2">
           <Shield className="text-legal-gold" size={18} />
           <span className="font-serif font-black italic text-legal-900">LexiNaija Protocols</span>
        </div>
        <div className="w-16"></div>
      </nav>

      <div className="max-w-3xl mx-auto py-16 px-6">
        <h1 className="text-4xl font-serif font-black text-legal-900 mb-2 italic">Firm Licensing Terms</h1>
        <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-12">Effective March 2024 | RPC 2023 Compliant</p>

        <div className="prose prose-slate max-w-none space-y-8 font-medium">
          <section>
            <h2 className="text-xl font-bold text-legal-900 mb-4 uppercase tracking-widest text-sm">1. Engagement of Services</h2>
            <p className="text-slate-600 leading-relaxed">
              LexiNaija is a legal AI-powered software-as-a-service ("SaaS") platform designed for legal practitioners.
              By using this platform, you certify that you are a qualified legal practitioner enrolled at the Supreme Court of Nigeria
              or authorized by such a practitioner to act on behalf of their firm.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-legal-900 mb-4 uppercase tracking-widest text-sm">2. Professional Responsibility (RPC)</h2>
            <p className="text-slate-600 leading-relaxed">
              Pursuant to the <strong>Rules of Professional Conduct (RPC) 2023</strong>, legal practitioners remain
              fully responsible for all work products generated through LexiNaija.
              AI-generated content must be independently verified.
              Failure to do so constitutes a breach of professional negligence for which LexiNaija bears no liability.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-legal-900 mb-4 uppercase tracking-widest text-sm">3. No Legal Advice</h2>
            <p className="text-slate-600 leading-relaxed bg-amber-50 p-6 rounded-2xl border border-amber-100 text-amber-900 font-bold">
              LexiNaija does not provide legal advice. It provides tools for legal practitioners to enhance their practice.
              The Platform does not create an attorney-client relationship between LexiNaija and any user or their client.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-legal-900 mb-4 uppercase tracking-widest text-sm">4. Billing and Tiers</h2>
            <p className="text-slate-600 leading-relaxed">
              Payments are processed via Paystack. Subscription tiers (Solo, Professional, Chambers AI)
              are billed in advance. All fees are non-refundable except where required by Nigerian consumer protection law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-legal-900 mb-4 uppercase tracking-widest text-sm">5. Intellectual Property</h2>
            <p className="text-slate-600 leading-relaxed">
              Users retain ownership of their case files and original work product.
              LexiNaija owns all rights to the platform architecture, AI algorithms, and unique software code.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-legal-900 mb-4 uppercase tracking-widest text-sm">6. Termination</h2>
            <p className="text-slate-600 leading-relaxed">
              LexiNaija reserves the right to terminate accounts that violate the RPC or engage in unethical conduct
              (e.g., identity theft, data scraping, or using the platform for unauthorized practice of law).
            </p>
          </section>

          <section className="bg-slate-900 p-8 rounded-[40px] text-white">
            <h2 className="text-lg font-bold text-legal-gold mb-2">Arbitration & Governing Law</h2>
            <p className="text-sm text-slate-400">
              Any dispute arising under these terms shall be governed by the laws of the Federal Republic of Nigeria
              and settled through binding arbitration in Lagos, Nigeria.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
