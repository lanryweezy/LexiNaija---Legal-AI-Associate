import React, { Component, ErrorInfo, ReactNode } from 'react';
import { captureException, setContext } from '../services/errorTracker';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    
    // Log to Sentry
    setContext('componentStack', { componentStack: errorInfo.componentStack });
    captureException(error, {
      tags: {
        component: this.constructor.name,
        fatal: 'true'
      },
      extra: {
        componentStack: errorInfo.componentStack,
      }
    });
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-10 text-center border border-slate-100 italic">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
               <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <h2 className="text-2xl font-serif font-black text-legal-900 mb-4 tracking-tighter">Protocol Interrupted</h2>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
              Synthesizing legal intelligence encountered an unexpected variance. Please refresh the interface to re-initialize the workspace.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-legal-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-legal-gold hover:text-legal-900 transition-all shadow-xl"
            >
              Restart Workspace
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
