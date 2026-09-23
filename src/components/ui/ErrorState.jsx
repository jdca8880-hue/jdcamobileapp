import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorState({ message = 'An error occurred while fetching data.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl mx-4 my-6 shadow-sm">
      <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
        <AlertCircle size={24} />
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-2">Something went wrong</h3>
      <p className="text-sm text-slate-500 mb-6 max-w-sm">{message}</p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl font-medium shadow-sm transition-colors"
        >
          <RefreshCw size={16} />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}
