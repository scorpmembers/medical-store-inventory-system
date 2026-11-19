import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useStore();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start p-3.5 rounded-lg shadow-lg border text-sm transition-all duration-200 transform translate-y-0 ${
              isSuccess
                ? 'bg-white border-emerald-300 text-slate-800'
                : isError
                ? 'bg-white border-rose-300 text-slate-800'
                : isWarning
                ? 'bg-white border-amber-300 text-slate-800'
                : 'bg-white border-slate-300 text-slate-800'
            }`}
          >
            <div className="flex-shrink-0 mr-3 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              {isError && <AlertCircle className="w-5 h-5 text-rose-600" />}
              {isWarning && <AlertTriangle className="w-5 h-5 text-amber-500" />}
              {!isSuccess && !isError && !isWarning && <Info className="w-5 h-5 text-teal-600" />}
            </div>

            <div className="flex-1 mr-2">
              {toast.title && (
                <p className="font-semibold text-slate-900 leading-tight mb-0.5">
                  {toast.title}
                </p>
              )}
              <p className="text-slate-600 text-xs leading-relaxed">{toast.message}</p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
