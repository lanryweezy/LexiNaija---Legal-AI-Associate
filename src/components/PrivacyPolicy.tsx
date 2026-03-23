import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import { AppView } from '../types';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
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
           <span className="font-serif font-black italic text-legal-900">LexiNaija Protocol</span>
        </div>
        <div className="w-16"></div>
      </nav>

      <div className="max-w-3xl mx-auto py-16 px-6">
        <h1 className="text-4xl font-serif font-black text-legal-900 mb-2 italic">Privacy Protocol</h1>
        <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-12">Last Updated: October 2023 | NDPR Compliant</p>

        <div className="prose prose-slate max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-bold text-legal-900 mb-4">1. Data Controller</h2>
            <p className="text-slate-600 leading-relaxed font-medium">
              LexiNaija ("the Platform") is committed to protecting the privacy of legal practitioners and their clients.
              In compliance with the <strong>Nigeria Data Protection Regulation (NDPR) 2019</strong> and the
              <strong>Nigeria Data Protection Act 2023</strong>, we act as both a Data Controller for your account information
              and a Data Processor for the legal data you input into the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-legal-900 mb-4">2. Legal Professional Privilege</h2>
            <p className="text-slate-600 leading-relaxed font-medium">
              We recognize the sanctity of Section 192 of the Evidence Act 2011. LexiNaija is architected such that
              your case files and privileged communications are encrypted at rest. We do not use your confidential
              legal work product to train our underlying AI models without explicit, anonymized opt-in.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-legal-900 mb-4">3. Data We Collect</h2>
            <ul className="list-disc pl-5 text-slate-600 space-y-2 font-medium">
              <li>Firm registration details (Name, NBA Enrollment Number, Address).</li>
              <li>Transaction data for billing purposes via Paystack.</li>
              <li>User-provided legal documents for processing and management.</li>
              <li>Device fingerprints for S.84 Evidence Act compliance certificates.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-legal-900 mb-4">4. Security Infrastructure</h2>
            <p className="text-slate-600 leading-relaxed font-medium">
              We employ AES-256 encryption for documents and TLS 1.3 for data in transit.
              Our servers are located in high-security environments with SOC2 compliance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-legal-900 mb-4">5. Your Rights</h2>
            <p className="text-slate-600 leading-relaxed font-medium">
              Under the NDPR, you have the right to access, rectify, or erase your data.
              You may request a data portability export of your entire firm vault at any time.
            </p>
          </section>

          <section className="bg-slate-50 p-8 rounded-[32px] border border-slate-100">
            <h2 className="text-lg font-bold text-legal-900 mb-2">Contact Security Ops</h2>
            <p className="text-sm text-slate-500 font-medium">
              For any data-related queries or to report a breach, contact our Data Protection Officer at
              <span className="text-legal-900 ml-1 font-bold">privacy@lexinaija.com</span>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
