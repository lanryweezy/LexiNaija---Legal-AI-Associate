import React from 'react';
import { X, AlertTriangle, ShieldAlert } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm Action',
  cancelLabel = 'Abort Procedure',
  variant = 'danger'
}) => {
  if (!isOpen) return null;

  const variantStyles = {
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20',
    warning: 'bg-legal-gold hover:bg-legal-900 hover:text-white text-legal-900 shadow-legal-gold/20',
    info: 'bg-legal-900 hover:bg-legal-gold hover:text-legal-900 text-white shadow-legal-900/20'
  };

  const iconStyles = {
    danger: 'bg-rose-50 text-rose-600',
    warning: 'bg-amber-50 text-amber-600',
    info: 'bg-sky-50 text-sky-600'
  };

  return (
    <div className="fixed inset-0 bg-legal-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
      <div className="bg-white/90 backdrop-blur-2xl rounded-[48px] shadow-[0_80px_150px_-30px_rgba(0,0,0,0.4)] w-full max-w-md overflow-hidden border border-white animate-in zoom-in-95 duration-500">
        <div className="p-10 flex flex-col items-center text-center">
          <div className={`w-20 h-20 ${iconStyles[variant]} rounded-[32px] flex items-center justify-center mb-8 shadow-inner`}>
            {variant === 'danger' ? <ShieldAlert size={32} /> : <AlertTriangle size={32} />}
          </div>
          
          <h3 className="text-3xl font-serif font-black text-legal-900 italic tracking-tighter mb-4 leading-tight">{title}</h3>
          <p className="text-slate-400 font-medium leading-relaxed mb-10 max-w-[280px]">
            {message}
          </p>
          
          <div className="grid grid-cols-1 w-full gap-4">
            <button 
              onClick={() => { onConfirm(); onClose(); }}
              className={`w-full py-6 rounded-[24px] font-black uppercase tracking-widest text-[11px] transition-all shadow-2xl active:scale-95 ${variantStyles[variant]}`}
            >
              {confirmLabel}
            </button>
            <button 
              onClick={onClose}
              className="w-full py-6 rounded-[24px] font-black uppercase tracking-widest text-[11px] text-slate-400 hover:text-legal-900 hover:bg-slate-50 transition-all"
            >
              {cancelLabel}
            </button>
          </div>
        </div>
        
        <div className="absolute top-6 right-6">
            <button onClick={onClose} className="p-3 text-slate-200 hover:text-slate-400 transition-colors">
                <X size={20} />
            </button>
        </div>
        
        {/* Subtle Brand Accent */}
        <div className="h-1 bg-gradient-to-r from-transparent via-legal-gold/20 to-transparent"></div>
      </div>
    </div>
  );
};
