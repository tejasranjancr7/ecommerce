import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((t) => {
        const getIcon = () => {
          switch (t.type) {
            case 'success':
              return <CheckCircle2 size={20} color="#10b981" />;
            case 'warning':
              return <AlertTriangle size={20} color="#f59e0b" />;
            case 'error':
              return <AlertCircle size={20} color="#f43f5e" />;
            case 'info':
            default:
              return <Info size={20} color="#6366f1" />;
          }
        };

        return (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <div style={{ flexShrink: 0, marginTop: '2px' }}>
              {getIcon()}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f8fafc' }}>
                {t.title}
              </div>
              {t.description && (
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px', lineHeight: 1.4 }}>
                  {t.description}
                </div>
              )}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="btn btn-ghost"
              style={{ padding: '2px', color: '#64748b' }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
