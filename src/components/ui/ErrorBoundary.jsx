import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Caught exception:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600 shadow-sm border border-red-200">
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-sm text-gray-500 mb-8 max-w-md">
            The application encountered an unexpected error. Please try refreshing the page. If the problem persists, please contact support.
          </p>
          
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-6 py-3 bg-[#2457D6] hover:bg-[#1c44a8] text-white rounded-xl font-bold transition-all shadow-sm"
          >
            <RefreshCw size={18} />
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}
