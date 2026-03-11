import React, { createContext, useContext, useState, useEffect } from 'react';

// Context for showing toasts
const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };

    const hideToast = () => {
        setToast(null);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);

// The actual Toast UI Component
function Toast({ message, type, onClose }) {
    useEffect(() => {
        // Automatically close toast after 3 seconds
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    let bgColor = 'bg-red-500'; // Default error
    let iconClass = 'fa-exclamation-circle';

    if (type === 'success') {
        bgColor = 'bg-[#5cbdba]';
        iconClass = 'fa-check-circle';
    } else if (type === 'info') {
        bgColor = 'bg-blue-500';
        iconClass = 'fa-info-circle';
    }

    return (
        <div className={`fixed bottom-4 right-4 z-[9999] animate-slideInUp`}>
            <div className={`${bgColor} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 backdrop-blur-sm bg-opacity-95`}>
                <i className={`fas ${iconClass} text-xl`}></i>
                <span className="font-medium">{message}</span>
                <button onClick={onClose} className="ml-4 hover:text-gray-200 transition">
                    <i className="fas fa-times"></i>
                </button>
            </div>

            <style>{`
        .animate-slideInUp {
          animation: slideInUp 0.3s ease-out forwards;
        }
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </div>
    );
}
