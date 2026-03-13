import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface AiDisclaimerProps {
  compact?: boolean;
}

export const AiDisclaimer: React.FC<AiDisclaimerProps> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="flex items-start gap-2 px-4 py-3 bg-amber-50/80 border border-amber-200/50 rounded-xl text-[10px] text-amber-800">
        <AlertTriangle size={12} className="shrink-0 mt-0.5 text-amber-500" />
        <span className="font-bold leading-relaxed">
          AI-Generated Content — Must be independently verified by a qualified legal practitioner before use. 
          This does not constitute legal advice (RPC 2023).
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-4 p-6 bg-amber-50/50 backdrop-blur-sm border border-amber-200/30 rounded-[24px]">
      <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
        <AlertTriangle size={18} className="text-amber-600" />
      </div>
      <div>
        <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest mb-1">Professional Responsibility Notice</p>
        <p className="text-[11px] text-amber-700 leading-relaxed font-medium">
          This output is <strong>AI-generated</strong> and does not constitute legal advice. 
          It must be independently verified by a qualified legal practitioner before use in any legal proceeding, 
          correspondence, or client advisory. Pursuant to the <strong>Rules of Professional Conduct (RPC) 2023</strong>, 
          legal practitioners must exercise independent professional judgment at all times.
        </p>
      </div>
    </div>
  );
};
